export enum NotificationTypeDto {
  NewApplication = "NewApplication",
  ApplicationUpdate = "ApplicationUpdate",
  NewMatch = "NewMatch", // Assuming this means a pet match for a user
  MessageReceived = "MessageReceived", // For chat/messaging features
  GeneralUpdate = "GeneralUpdate",
  DonationReceived = "DonationReceived", // Added
  NewPetListed = "NewPetListed", // Added: e.g., matching user preferences
  FavoriteActivity = "FavoriteActivity", // Added: e.g., pet they favorited was adopted
  ShelterUpdate = "ShelterUpdate", // Added: For updates from shelters a user follows
  // Add other types from CreateNotificationDto.cs or NotificationType enum in C#
}

export interface NotificationDto {
  notificationId: number; // Changed to camelCase to match backend API response
  userId: string; // The user who receives the notification
  message: string;
  isRead: boolean;
  createdAt: string; // ISO date string
  type: NotificationTypeDto;
  relatedEntityId?: string | number; // e.g., ApplicationId, PetId, UserId, DonationId
  relatedEntityUrl?: string; // A URL to navigate to when the notification is clicked
  // senderId?: string; // Optional: if the notification is from another user/system
}

// Based on CreateNotificationDto.cs and UpdateNotificationDto.cs
// export interface CreateNotificationDto {
//   userId: string;
//   message: string;
//   type: NotificationTypeDto;
//   relatedEntityId?: string | number;
//   relatedEntityUrl?: string;
// }

// export interface UpdateNotificationDto {
//   isRead?: boolean;
// }
