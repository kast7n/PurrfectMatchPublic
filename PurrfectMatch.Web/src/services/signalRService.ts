import * as signalR from '@microsoft/signalr';
import { NotificationDto } from '../app/models/Notification';

export class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private static instance: SignalRService;

  private constructor() {}

  public static getInstance(): SignalRService {
    if (!SignalRService.instance) {
      SignalRService.instance = new SignalRService();
    }
    return SignalRService.instance;
  }  public async startConnection(accessToken?: string): Promise<void> {
    try {
      const hubUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api/', '/notificationHub') || 'https://localhost:7087/notificationHub';
      
      const connectionBuilder = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl, {
          withCredentials: true,
        })
        .withAutomaticReconnect();

      // Only add access token if provided
      if (accessToken) {
        connectionBuilder.withUrl(hubUrl, {
          accessTokenFactory: () => accessToken,
          withCredentials: true,
        });
      }

      this.connection = connectionBuilder.build();

      await this.connection.start();
      console.log('SignalR connection started successfully');
    } catch (error) {
      console.error('Error starting SignalR connection:', error);
      throw error;
    }
  }

  public async stopConnection(): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.stop();
        console.log('SignalR connection stopped');
      } catch (error) {
        console.error('Error stopping SignalR connection:', error);
      } finally {
        this.connection = null;
      }
    }
  }

  public onNotificationReceived(callback: (notification: NotificationDto) => void): void {
    if (this.connection) {
      this.connection.on('ReceiveNotification', callback);
    }
  }

  public onNotificationUpdated(callback: (notification: NotificationDto) => void): void {
    if (this.connection) {
      this.connection.on('NotificationUpdated', callback);
    }
  }

  public onNotificationDeleted(callback: (notificationId: number) => void): void {
    if (this.connection) {
      this.connection.on('NotificationDeleted', callback);
    }
  }

  public offNotificationReceived(): void {
    if (this.connection) {
      this.connection.off('ReceiveNotification');
    }
  }

  public offNotificationUpdated(): void {
    if (this.connection) {
      this.connection.off('NotificationUpdated');
    }
  }

  public offNotificationDeleted(): void {
    if (this.connection) {
      this.connection.off('NotificationDeleted');
    }
  }

  public isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }

  public getConnectionState(): signalR.HubConnectionState | null {
    return this.connection?.state || null;
  }

  public async joinUserGroup(userId: string): Promise<void> {
    if (this.connection && this.isConnected()) {
      try {
        await this.connection.invoke('JoinUserGroup', userId);
      } catch (error) {
        console.error('Error joining user group:', error);
      }
    }
  }

  public async leaveUserGroup(userId: string): Promise<void> {
    if (this.connection && this.isConnected()) {
      try {
        await this.connection.invoke('LeaveUserGroup', userId);
      } catch (error) {
        console.error('Error leaving user group:', error);
      }
    }
  }
}
