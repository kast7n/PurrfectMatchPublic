import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import { NotificationDto } from "../../app/models/Notification";

export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["Notifications"],
  endpoints: (builder) => ({
    fetchNotifications: builder.query<NotificationDto[], void>({
      query: () => "notifications",
      providesTags: ["Notifications"],
    }),
    fetchNotificationsByUserId: builder.query<NotificationDto[], string>({
      query: (userId) => `notifications/user/${userId}`,
      providesTags: ["Notifications"],
    }),
    markNotificationAsRead: builder.mutation<NotificationDto, number>({
      query: (id) => ({
        url: `notifications/${id}/read`,
        method: "POST",
      }),
      invalidatesTags: ["Notifications"],
    }),
    deleteNotification: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useFetchNotificationsQuery,
  useFetchNotificationsByUserIdQuery,
  useMarkNotificationAsReadMutation,
  useDeleteNotificationMutation,
} = notificationApi;
