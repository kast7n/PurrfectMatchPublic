import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithErrorHandling } from '../../app/api/baseApi';
import type { 
  UserFilter, 
  UserResponse, 
  AssignShelterManagerRequest,
  RemoveShelterManagerRequest,
  UpdateUserRoleRequest,
  UpdateUserShelterRequest,
  UpdateUserDetailsRequest
} from '../../app/models/user';

export const userManagementApi = createApi({
  reducerPath: 'userManagementApi',
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUsers: builder.query<UserResponse, UserFilter>({
      query: (filter) => ({
        url: 'account/users',
        params: {
          pageNumber: filter.pageNumber,
          pageSize: filter.pageSize,
          sortBy: filter.sortBy,
          sortDescending: filter.sortDescending,
          ...(filter.email && { email: filter.email }),
          ...(filter.userName && { userName: filter.userName }),
          ...(filter.role && { role: filter.role }),
          ...(filter.shelterId && { shelterId: filter.shelterId }),
          ...(filter.emailConfirmed !== undefined && { emailConfirmed: filter.emailConfirmed }),
          ...(filter.isLockedOut !== undefined && { isLockedOut: filter.isLockedOut }),
        },
      }),
      providesTags: ['User'],
    }),      deleteUser: builder.mutation<string, string>({
      query: (userId) => ({
        url: `account/users/${userId}`,
        method: 'DELETE',
        responseHandler: 'text',
      }),
      invalidatesTags: ['User'],
    }),
      assignShelterManager: builder.mutation<string, AssignShelterManagerRequest>({
      query: (data) => ({
        url: 'account/users/assign-shelter-manager',
        method: 'POST',
        body: data,
        responseHandler: 'text',
      }),
      invalidatesTags: ['User'],
    }),    removeShelterManager: builder.mutation<string, RemoveShelterManagerRequest>({
      query: (data) => ({
        url: 'account/users/remove-shelter-manager',
        method: 'DELETE',
        body: data,
        responseHandler: 'text',
      }),
      invalidatesTags: ['User'],
    }),updateUserRole: builder.mutation<string, UpdateUserRoleRequest>({
      query: (data) => ({
        url: `account/users/${data.userId}/role`,
        method: 'PUT',
        body: { userId: data.userId, role: data.role },
        responseHandler: 'text',
      }),
      invalidatesTags: ['User'],
    }),    updateUserShelter: builder.mutation<string, UpdateUserShelterRequest>({
      query: (data) => ({
        url: `account/users/${data.userId}/shelter`,
        method: 'PUT',
        body: { 
          userId: data.userId, 
          newShelterId: data.newShelterId, 
          oldShelterId: data.oldShelterId 
        },
        responseHandler: 'text',
      }),
      invalidatesTags: ['User'],
    }),
    
    updateUserDetails: builder.mutation<string, UpdateUserDetailsRequest>({
      query: (data) => ({
        url: `account/users/${data.userId}/details`,
        method: 'PUT',
        body: { 
          userId: data.userId,
          userName: data.userName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          emailConfirmed: data.emailConfirmed,
          lockoutEnabled: data.lockoutEnabled
        },
        responseHandler: 'text',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useDeleteUserMutation,
  useAssignShelterManagerMutation,
  useRemoveShelterManagerMutation,
  useUpdateUserRoleMutation,
  useUpdateUserShelterMutation,
  useUpdateUserDetailsMutation,
} = userManagementApi;
