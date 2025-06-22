import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import { HealthRecordDto } from "../../app/models/HealthRecord";

export const healthRecordApi = createApi({
  reducerPath: "healthRecordApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["HealthRecords"],
  endpoints: (builder) => ({
    fetchHealthRecords: builder.query<HealthRecordDto[], number>({
      query: (petId) => `pets/${petId}/healthRecords`,
      providesTags: ["HealthRecords"],
    }),
    fetchHealthRecord: builder.query<HealthRecordDto, { petId: number; recordId: number }>({
      query: ({ petId, recordId }) => `pets/${petId}/healthRecords/${recordId}`,
      providesTags: (_result, _error, arg) => [{ type: "HealthRecords", id: arg.recordId }],
    }),
    addHealthRecord: builder.mutation<HealthRecordDto, { petId: number; record: Partial<HealthRecordDto> }>({
      query: ({ petId, record }) => ({
        url: `pets/${petId}/healthRecords`,
        method: "POST",
        body: record,
      }),
      invalidatesTags: ["HealthRecords"],
    }),
    updateHealthRecord: builder.mutation<HealthRecordDto, { petId: number; recordId: number; record: Partial<HealthRecordDto> }>({
      query: ({ petId, recordId, record }) => ({
        url: `pets/${petId}/healthRecords/${recordId}`,
        method: "PUT",
        body: record,
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: "HealthRecords", id: arg.recordId }],
    }),
    deleteHealthRecord: builder.mutation<{ success: boolean; recordId: number }, { petId: number; recordId: number }>({
      query: ({ petId, recordId }) => ({
        url: `pets/${petId}/healthRecords/${recordId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: "HealthRecords", id: arg.recordId }],
    }),
  }),
});

export const {
  useFetchHealthRecordsQuery,
  useFetchHealthRecordQuery,
  useAddHealthRecordMutation,
  useUpdateHealthRecordMutation,
  useDeleteHealthRecordMutation,
} = healthRecordApi;
