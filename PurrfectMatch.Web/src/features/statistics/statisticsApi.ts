import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithErrorHandling } from '../../app/api/baseApi';
import { GlobalStatistics } from '../../app/models/statistics';

export const statisticsApi = createApi({
  reducerPath: 'statisticsApi',
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ['Statistics'],
  endpoints: (builder) => ({
    fetchGlobalStatistics: builder.query<GlobalStatistics, void>({
      query: () => 'statistics/global',
      providesTags: ['Statistics'],
    }),
  }),
});

export const {
  useFetchGlobalStatisticsQuery,
} = statisticsApi;
