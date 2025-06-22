import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import { toast } from "react-toastify";

// Types for UserProfile - Matching backend DTO structure
export interface UserProfile {
  userId: string;
  phoneNumber?: string;
  photoUrl?: string;
  age?: number;
  job?: string;
  currentPetsOwned: number;
  address?: UserAddress;
  generalInfo: string;
  housingType: string;
  hasYard: boolean;
  allergies?: string;
  experienceWithPets: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserAddress {
  street?: string;
  googleMapLink?: string;
}

export interface CreateUserProfileRequest {
  PhoneNumber?: string;
  Age?: number;
  Job?: string;
  CurrentPetsOwned: number;
  Address?: {
    street?: string;
  };
  GeneralInfo: string;
  HousingType: string;
  HasYard: boolean;
  Allergies?: string;
  ExperienceWithPets: string;
}

export interface UpdateUserProfileRequest {
  PhoneNumber?: string;
  Age?: number;
  Job?: string;
  CurrentPetsOwned: number;
  Address?: {
    street?: string;
  };
  GeneralInfo: string;
  HousingType: string;
  HasYard: boolean;
  Allergies?: string;
  ExperienceWithPets: string;
}

export const userProfileApi = createApi({
  reducerPath: "userProfileApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["UserProfile"],
  endpoints: (builder) => ({
    // Get current user's profile
    getCurrentUserProfile: builder.query<UserProfile, void>({
      query: () => "user-profiles/me",
      providesTags: ["UserProfile"],
      transformErrorResponse: (response) => {
        // Don't throw errors for 404 responses (user might not have a profile yet)
        if (response.status === 404) {
          return null;
        }
        return response;
      },
    }),

    // Get user profile by ID
    getUserProfile: builder.query<UserProfile, string>({
      query: (userId) => `user-profiles/${userId}`,
      providesTags: ["UserProfile"],
    }),    // Create user profile
    createUserProfile: builder.mutation<UserProfile, CreateUserProfileRequest>({
      query: (profileData) => ({
        url: "user-profiles",
        method: "POST",
        body: profileData,
      }),
      invalidatesTags: ["UserProfile"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Profile created successfully!");        } catch (error: unknown) {
          console.error("Create profile error:", error);
          
          // More detailed error handling
          interface ApiError {
            error?: {
              data?: string | { title?: string; errors?: Record<string, string[]> };
            };
          }
          
          const apiError = error as ApiError;
          if (apiError?.error?.data) {
            if (typeof apiError.error.data === 'string') {
              toast.error(apiError.error.data);
            } else if (apiError.error.data.title) {
              toast.error(apiError.error.data.title);
            } else if (apiError.error.data.errors) {
              const errorMessages = Object.values(apiError.error.data.errors).flat().join(', ');
              toast.error(errorMessages);
            } else {
              toast.error("Failed to create profile. Please check all required fields.");
            }
          } else {
            toast.error("Failed to create profile. Please try again.");
          }
          throw error;
        }
      },
    }),    // Update current user's profile
    updateCurrentUserProfile: builder.mutation<UserProfile, UpdateUserProfileRequest>({
      query: (profileData) => ({
        url: "user-profiles/me",
        method: "PUT",
        body: profileData,
      }),
      invalidatesTags: ["UserProfile"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Profile updated successfully!");
        } catch (error: unknown) {
          console.error("Update profile error:", error);
          
          interface ApiError {
            error?: {
              status?: number;
              data?: string | { title?: string; errors?: Record<string, string[]> };
            };
          }
          
          const apiError = error as ApiError;
          if (apiError?.error?.status === 404) {
            toast.error("Profile not found. Please create a profile first.");
          } else if (apiError?.error?.data) {
            if (typeof apiError.error.data === 'string') {
              toast.error(apiError.error.data);
            } else if (apiError.error.data.title) {
              toast.error(apiError.error.data.title);
            } else if (apiError.error.data.errors) {
              const errorMessages = Object.values(apiError.error.data.errors).flat().join(', ');
              toast.error(errorMessages);
            } else {
              toast.error("Failed to update profile. Please try again.");
            }
          } else {
            toast.error("Failed to update profile. Please try again.");
          }
          throw error;
        }
      },
    }),

    // Delete user profile
    deleteUserProfile: builder.mutation<void, string>({
      query: (userId) => ({
        url: `user-profiles/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["UserProfile"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Profile deleted successfully!");
        } catch (error) {
          toast.error("Failed to delete profile. Please try again.");
          console.error("Delete profile error:", error);
          throw error;
        }
      },
    }),    // Upload user photo
    uploadUserPhoto: builder.mutation<{ Url: string }, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        
        return {
          url: "user-profiles/me/photo",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["UserProfile"],      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Photo uploaded successfully!");
        } catch (error: unknown) {
          console.error("Upload photo error:", error);
          
          interface ApiError {
            error?: {
              data?: string | { title?: string; errors?: Record<string, string[]> };
            };
          }
            const apiError = error as ApiError;
          if (apiError?.error?.data) {
            if (typeof apiError.error.data === 'string') {
              if (apiError.error.data.includes("User profile not found")) {
                toast.error("Please create a profile before uploading a photo.");
              } else {
                toast.error(apiError.error.data);
              }
            } else if (apiError.error.data.title) {
              toast.error(apiError.error.data.title);
            } else {
              toast.error("Failed to upload photo. Please check file format and size.");
            }
          } else {
            toast.error("Failed to upload photo. Please try again.");
          }
          throw error;
        }
      },
    }),
  }),
});

export const {
  useGetCurrentUserProfileQuery,
  useGetUserProfileQuery,
  useCreateUserProfileMutation,
  useUpdateCurrentUserProfileMutation,
  useDeleteUserProfileMutation,
  useUploadUserPhotoMutation,
} = userProfileApi;
