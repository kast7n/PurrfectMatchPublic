import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import { 
  Shelter, 
  ShelterFilterDto, 
  CreateShelterDto, 
  UpdateShelterDto, 
  PaginatedSheltersResponse,
  ShelterMetricsDto,
  ShelterFollowerDto,
  CreateShelterApplicationDto,
  ShelterCreationRequestDto,
  ShelterApplicationFilterDto,
  PaginatedShelterApplicationsResponse,
  UpdateShelterApplicationStatusDto
} from "../../app/models/shelter";

export const shelterApi = createApi({
  reducerPath: "shelterApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["Shelter", "ShelterApplication"],
  endpoints: (builder) => ({
    fetchFilteredShelters: builder.query<PaginatedSheltersResponse, ShelterFilterDto | undefined>({
      query: (filter) => ({
        url: "shelters",
        params: filter || undefined, // Pass undefined if no filter is provided
      }),
      providesTags: ["Shelter"],
    }),    fetchShelterById: builder.query<Shelter, number>({
      query: (id) => ({ url: `shelters/${id}` }),
      providesTags: (_result, _error, id) => [{ type: "Shelter", id }],
    }),
    addShelter: builder.mutation<Shelter, CreateShelterDto>({
      query: (newShelter) => ({
        url: "shelters",
        method: "POST",
        body: newShelter,
      }),
      invalidatesTags: ["Shelter"],
    }),    updateShelter: builder.mutation<Shelter, { id: number; updatedShelter: UpdateShelterDto }>({
      query: ({ id, updatedShelter }) => ({
        url: `shelters/${id}`,
        method: "PUT",
        body: updatedShelter,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Shelter", id }],
    }),
    deleteShelter: builder.mutation<void, number>({
      query: (id) => ({
        url: `shelters/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [{ type: "Shelter", id }],    }),
    fetchShelterMetrics: builder.query<ShelterMetricsDto, number>({
      query: (shelterId) => ({ url: `shelters/metrics/${shelterId}` }),
      providesTags: (_result, _error, shelterId) => [{ type: "Shelter", id: shelterId }],
    }),
    // Additional endpoints that might be useful for shelter management
    fetchAllShelters: builder.query<Shelter[], void>({
      query: () => ({ url: "shelters/all" }),
      providesTags: ["Shelter"],
    }),    // Follower-related endpoints
    fetchShelterFollowers: builder.query<ShelterFollowerDto[], number>({
      query: (shelterId) => ({ url: `shelters/followers/${shelterId}` }),
      providesTags: (_result, _error, shelterId) => [{ type: "Shelter", id: shelterId }],
    }),    fetchFollowedShelters: builder.query<Shelter[], string>({
      query: (userId) => ({ url: `shelters/user/${userId}/followed-shelters` }),
      providesTags: ["Shelter"],
    }),      // Shelter Application endpoints
    createShelterApplication: builder.mutation<ShelterCreationRequestDto, CreateShelterApplicationDto>({
      query: (applicationData) => ({
        url: "shelters/applications",
        method: "POST",
        body: applicationData,
      }),
      invalidatesTags: ["ShelterApplication"],
    }),

    // Get paginated shelter applications (Admin only)
    fetchShelterApplications: builder.query<PaginatedShelterApplicationsResponse, ShelterApplicationFilterDto | undefined>({
      query: (filter) => ({
        url: "shelters/applications",
        params: filter || undefined,
      }),
      providesTags: ["ShelterApplication"],
    }),

    // Get all shelter applications without pagination (Admin only - backward compatibility)
    fetchAllShelterApplications: builder.query<ShelterCreationRequestDto[], ShelterApplicationFilterDto | undefined>({
      query: (filter) => ({
        url: "shelters/applications/all",
        params: filter || undefined,
      }),
      providesTags: ["ShelterApplication"],
    }),

    // Get shelter applications for a specific user
    fetchUserShelterApplications: builder.query<ShelterCreationRequestDto[], string>({
      query: (userId) => ({ url: `shelters/applications/user/${userId}` }),
      providesTags: (_result, _error, userId) => [{ type: "ShelterApplication", id: userId }],
    }),

    // Get specific shelter application by ID
    fetchShelterApplicationById: builder.query<ShelterCreationRequestDto, number>({
      query: (id) => ({ url: `shelters/applications/${id}` }),
      providesTags: (_result, _error, id) => [{ type: "ShelterApplication", id }],
    }),

    // Update shelter application status (Admin only)
    updateShelterApplicationStatus: builder.mutation<{ message: string }, { id: number; statusData: UpdateShelterApplicationStatusDto }>({
      query: ({ id, statusData }) => ({
        url: `shelters/applications/${id}/status`,
        method: "PUT",
        body: statusData,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "ShelterApplication", id },
        "ShelterApplication",
      ],
    }),

    // Delete/cancel shelter application
    deleteShelterApplication: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `shelters/applications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "ShelterApplication", id },
        "ShelterApplication",
      ],
    }),
  }),
});

export const {
  useFetchFilteredSheltersQuery,
  useFetchShelterByIdQuery,
  useAddShelterMutation,
  useUpdateShelterMutation,
  useDeleteShelterMutation,
  useFetchShelterMetricsQuery,
  useFetchAllSheltersQuery,
  useFetchShelterFollowersQuery,
  useFetchFollowedSheltersQuery,
  
  // Shelter Application hooks
  useCreateShelterApplicationMutation,
  useFetchShelterApplicationsQuery,
  useFetchAllShelterApplicationsQuery,
  useFetchUserShelterApplicationsQuery,
  useFetchShelterApplicationByIdQuery,
  useUpdateShelterApplicationStatusMutation,
  useDeleteShelterApplicationMutation,
} = shelterApi;
