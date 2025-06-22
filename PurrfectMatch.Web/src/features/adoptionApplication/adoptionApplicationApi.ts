import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import { AdoptionApplicationDto } from "../../app/models/AdoptionApplication";
import { Pagination } from "../../app/models/pagination";

export interface AdoptionApplicationFilterParams {
  page?: number;
  pageSize?: number;
  status?: string;
  petId?: number;
  userId?: string;
  shelterId?: number;
}

export interface PaginatedAdoptionApplicationsResponse {
  data: AdoptionApplicationDto[];
  pagination: Pagination;
}

export const adoptionApplicationApi = createApi({
  reducerPath: "adoptionApplicationApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["AdoptionApplications"],  endpoints: (builder) => ({
    fetchAdoptionApplications: builder.query<AdoptionApplicationDto[], void>({
      query: () => "adoptionApplications/all",
      providesTags: ["AdoptionApplications"],
    }),
    
    fetchUserAdoptionApplications: builder.query<AdoptionApplicationDto[], string>({
      query: (userId) => `adoptionApplications/users/${userId}/adoption-applications`,
      providesTags: ["AdoptionApplications"],
    }),
    fetchFilteredAdoptionApplications: builder.query<PaginatedAdoptionApplicationsResponse, AdoptionApplicationFilterParams>({
      query: (params) => ({
        url: "adoptionApplications/filtered",
        params,
      }),
      providesTags: ["AdoptionApplications"],
    }),
    fetchAdoptionApplication: builder.query<AdoptionApplicationDto, number>({
      query: (id) => `adoptionApplications/${id}`,
      providesTags: (_result, _error, arg) => [{ type: "AdoptionApplications", id: arg }],
    }),
    createAdoptionApplication: builder.mutation<AdoptionApplicationDto, Partial<AdoptionApplicationDto>>({
      query: (body) => ({
        url: "adoptionApplications",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AdoptionApplications"],
    }),    updateAdoptionApplication: builder.mutation<AdoptionApplicationDto, Partial<AdoptionApplicationDto>>({
      query: (data) => ({
        url: `adoptionApplications/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: "AdoptionApplications", id: arg.id }],
    }),
    updateAdoptionApplicationStatus: builder.mutation<boolean, { id: number; status: string }>({
      query: ({ id, status }) => ({
        url: `adoptionApplications/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: "AdoptionApplications", id: arg.id }],
    }),
    deleteAdoptionApplication: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `adoptionApplications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: "AdoptionApplications", id: arg }],
    }),
  }),
});

export const {
  useFetchAdoptionApplicationsQuery,
  useFetchUserAdoptionApplicationsQuery,
  useFetchFilteredAdoptionApplicationsQuery,
  useFetchAdoptionApplicationQuery,
  useCreateAdoptionApplicationMutation,
  useUpdateAdoptionApplicationMutation,
  useUpdateAdoptionApplicationStatusMutation,
  useDeleteAdoptionApplicationMutation,
} = adoptionApplicationApi;
