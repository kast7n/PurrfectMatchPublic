import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import { LoginSchema } from "../../lib/schemas/loginSchema";
import { RegisterSchema } from "../../lib/schemas/registerSchema";
import { ChangePasswordSchema } from "../../lib/schemas/changePasswordSchema";
import { ForgotPasswordSchema } from "../../lib/schemas/forgotPasswordSchema";
import { ResetPasswordSchema } from "../../lib/schemas/resetPasswordSchema";
import { router } from "../../app/routes/Routes";
import { toast } from "react-toastify";
import { User } from '../../app/models/user';

export const accountApi = createApi({
  reducerPath: "accountApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["UserInfo"],
  endpoints: (builder) => ({
    login: builder.mutation<void, LoginSchema>({
      query: (creds) => {
        return {
          url: "account/login",
          method: "POST",
          body: creds,
        };
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(accountApi.util.invalidateTags(["UserInfo"]));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    register: builder.mutation<string, RegisterSchema>({
      query: (creds) => {
        return {
          url: "account/register",
          method: "POST",
          body: creds,
        };
      },
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          toast.success(result.data);
        } catch (error) {
          toast.error("Registration failed, please try again");
          console.log(error);
          throw error;
        }
      },
    }),
    confirmEmail: builder.mutation<string, { userId: string; token: string }>({
      query: ({ userId, token }) => ({
        url: `account/confirm-email?userId=${userId}&token=${token}`,
        method: "GET",
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          toast.success(result.data);
          router.navigate("/login");
        } catch (error) {
          toast.error("Email confirmation failed.");
          console.log(error);
          throw error;
        }
      },
    }),
    userInfo: builder.query<User, void>({
      query: () => "account/user-info",
      providesTags: ["UserInfo"],
      // Handle errors silently for user info queries to avoid popups on page load
      transformErrorResponse: (response) => {
        // Don't throw errors for 401 responses on user-info endpoint
        if (response.status === 401) {
          return null;
        }
        return response;
      },
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "account/logout",
        method: "POST",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Clear the account API cache
          dispatch(accountApi.util.resetApiState());
          router.navigate("/");
        } catch (error) {
          console.error('Logout error:', error);
          // Even if logout fails on server, clear local state
          dispatch(accountApi.util.resetApiState());
          router.navigate("/");
        }
      },
    }),
    changePassword: builder.mutation<{ message: string }, ChangePasswordSchema>({
      query: (passwordData) => ({
        url: "account/change-password",
        method: "POST",
        body: passwordData,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          toast.success(result.data.message);
        } catch (error) {
          console.error('Change password error:', error);
          throw error;
        }
      },
    }),
    forgotPassword: builder.mutation<{ message: string }, ForgotPasswordSchema>({
      query: (emailData) => ({
        url: "account/forgot-password",
        method: "POST",
        body: emailData,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          toast.success(result.data.message);
        } catch (error) {
          console.error('Forgot password error:', error);
          throw error;
        }
      },
    }),
    resetPassword: builder.mutation<{ message: string }, ResetPasswordSchema>({
      query: (resetData) => ({
        url: "account/reset-password",
        method: "POST",
        body: resetData,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          toast.success(result.data.message);
          router.navigate("/login");
        } catch (error) {
          console.error('Reset password error:', error);
          throw error;
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useConfirmEmailMutation,
  useUserInfoQuery,
  useLogoutMutation,
  useLazyUserInfoQuery,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = accountApi;
