import { useEffect, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { SignalRService } from '../services/signalRService';
import { NotificationDto } from '../app/models/Notification';
import { notificationApi } from '../features/notification/notificationApi';
import { useUserInfoQuery } from '../features/account/accountApi';
import { toast } from 'react-toastify';

interface UseSignalRNotificationsProps {
  onNotificationReceived?: (notification: NotificationDto) => void;
  onNotificationUpdated?: (notification: NotificationDto) => void;
  onNotificationDeleted?: (notificationId: number) => void;
}

export const useSignalRNotifications = ({
  onNotificationReceived,
  onNotificationUpdated,
  onNotificationDeleted,
}: UseSignalRNotificationsProps = {}) => {
  const { data: user } = useUserInfoQuery();
  const dispatch = useDispatch();
  const signalRService = useRef<SignalRService>(SignalRService.getInstance());
  const isConnectedRef = useRef(false);
  const handleNotificationReceived = useCallback(
    (notification: NotificationDto) => {
      console.log('New notification received:', notification);
        // Show toast notification
      toast.info(notification.message, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Invalidate notifications cache to refetch
      dispatch(notificationApi.util.invalidateTags(['Notifications']));

      // Call custom handler if provided
      onNotificationReceived?.(notification);
    },
    [dispatch, onNotificationReceived]
  );
  const handleNotificationUpdated = useCallback(
    (notification: NotificationDto) => {
      console.log('Notification updated:', notification);
      
      // Invalidate notifications cache to refetch
      dispatch(notificationApi.util.invalidateTags(['Notifications']));

      // Call custom handler if provided
      onNotificationUpdated?.(notification);
    },
    [dispatch, onNotificationUpdated]
  );
  const handleNotificationDeleted = useCallback(
    (notificationId: number) => {
      console.log('Notification deleted:', notificationId);
      
      // Invalidate notifications cache to refetch
      dispatch(notificationApi.util.invalidateTags(['Notifications']));

      // Call custom handler if provided
      onNotificationDeleted?.(notificationId);
    },
    [dispatch, onNotificationDeleted]
  );
  useEffect(() => {
    const service = signalRService.current;
      const connectSignalR = async () => {
      if (user && !isConnectedRef.current) {
        try {
          // Start connection without access token since we use cookie authentication
          await service.startConnection();
          
          // Set up event listeners
          service.onNotificationReceived(handleNotificationReceived);
          service.onNotificationUpdated(handleNotificationUpdated);
          service.onNotificationDeleted(handleNotificationDeleted);

          // Join user group
          if (user.id) {
            await service.joinUserGroup(user.id);
          }

          isConnectedRef.current = true;
        } catch (error) {
          console.error('Failed to connect to SignalR:', error);
        }
      }
    };

    const disconnectSignalR = async () => {
      if (!user && isConnectedRef.current) {
        try {
          // Clean up event listeners
          service.offNotificationReceived();
          service.offNotificationUpdated();
          service.offNotificationDeleted();

          await service.stopConnection();
          isConnectedRef.current = false;
        } catch (error) {
          console.error('Failed to disconnect from SignalR:', error);
        }
      }
    };

    if (user) {
      connectSignalR();
    } else {
      disconnectSignalR();
    }

    // Cleanup on unmount
    return () => {
      if (isConnectedRef.current) {
        service.offNotificationReceived();
        service.offNotificationUpdated();
        service.offNotificationDeleted();
        service.stopConnection();
        isConnectedRef.current = false;
      }
    };
  }, [user, handleNotificationReceived, handleNotificationUpdated, handleNotificationDeleted]);

  return {
    isConnected: isConnectedRef.current,
    signalRService: signalRService.current,
  };
};
