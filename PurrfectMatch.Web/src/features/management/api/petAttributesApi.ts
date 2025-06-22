import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../../app/api/baseApi";
import {
  SpeciesDto,
  BreedDto,
  CoatLengthDto,
  ColorDto,
  ActivityLevelDto,
  HealthStatusDto,
} from "../../../app/models/PetAttributes";

// Request types for creating/updating attributes
export interface CreateSpeciesRequest {
  name: string;
}

export interface UpdateSpeciesRequest extends CreateSpeciesRequest {
  speciesId: number;
}

export interface CreateBreedRequest {
  name: string;
  speciesId: number;
}

export interface UpdateBreedRequest extends CreateBreedRequest {
  breedId: number;
}

export interface CreateCoatLengthRequest {
  length: string;
}

export interface UpdateCoatLengthRequest extends CreateCoatLengthRequest {
  coatLengthId: number;
}

export interface CreateColorRequest {
  color1: string;
}

export interface UpdateColorRequest extends CreateColorRequest {
  colorId: number;
}

export interface CreateActivityLevelRequest {
  activity: string;
}

export interface UpdateActivityLevelRequest extends CreateActivityLevelRequest {
  activityLevelId: number;
}

export interface CreateHealthStatusRequest {
  status: string;
}

export interface UpdateHealthStatusRequest extends CreateHealthStatusRequest {
  healthStatusId: number;
}

export const petAttributesApi = createApi({
  reducerPath: "petAttributesApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: [
    "Species",
    "Breeds", 
    "CoatLengths",
    "Colors",
    "ActivityLevels",
    "HealthStatuses",
  ],
  endpoints: (builder) => ({
    // Species endpoints
    fetchAllSpecies: builder.query<SpeciesDto[], void>({
      query: () => "species",
      providesTags: ["Species"],
    }),
    createSpecies: builder.mutation<SpeciesDto, CreateSpeciesRequest>({
      query: (species) => ({
        url: "species",
        method: "POST",
        body: species,
      }),
      invalidatesTags: ["Species"],
    }),
    updateSpecies: builder.mutation<SpeciesDto, UpdateSpeciesRequest>({
      query: ({ speciesId, ...species }) => ({
        url: `species/${speciesId}`,
        method: "PUT",
        body: species,
      }),
      invalidatesTags: ["Species"],
    }),
    deleteSpecies: builder.mutation<void, number>({
      query: (speciesId) => ({
        url: `species/${speciesId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Species"],
    }),

    // Breeds endpoints
    fetchAllBreeds: builder.query<BreedDto[], { speciesId?: number }>({
      query: (params) => ({
        url: "breeds",
        params,
      }),
      providesTags: ["Breeds"],
    }),
    createBreed: builder.mutation<BreedDto, CreateBreedRequest>({
      query: (breed) => ({
        url: "breeds",
        method: "POST",
        body: breed,
      }),
      invalidatesTags: ["Breeds"],
    }),
    updateBreed: builder.mutation<BreedDto, UpdateBreedRequest>({
      query: ({ breedId, ...breed }) => ({
        url: `breeds/${breedId}`,
        method: "PUT",
        body: breed,
      }),
      invalidatesTags: ["Breeds"],
    }),
    deleteBreed: builder.mutation<void, number>({
      query: (breedId) => ({
        url: `breeds/${breedId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Breeds"],
    }),

    // Coat Lengths endpoints
    fetchAllCoatLengths: builder.query<CoatLengthDto[], void>({
      query: () => "coatLengths",
      providesTags: ["CoatLengths"],
    }),
    createCoatLength: builder.mutation<CoatLengthDto, CreateCoatLengthRequest>({
      query: (coatLength) => ({
        url: "coatLengths",
        method: "POST",
        body: coatLength,
      }),
      invalidatesTags: ["CoatLengths"],
    }),
    updateCoatLength: builder.mutation<CoatLengthDto, UpdateCoatLengthRequest>({
      query: ({ coatLengthId, ...coatLength }) => ({
        url: `coatLengths/${coatLengthId}`,
        method: "PUT",
        body: coatLength,
      }),
      invalidatesTags: ["CoatLengths"],
    }),
    deleteCoatLength: builder.mutation<void, number>({
      query: (coatLengthId) => ({
        url: `coatLengths/${coatLengthId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CoatLengths"],
    }),

    // Colors endpoints
    fetchAllColors: builder.query<ColorDto[], void>({
      query: () => "colors",
      providesTags: ["Colors"],
    }),
    createColor: builder.mutation<ColorDto, CreateColorRequest>({
      query: (color) => ({
        url: "colors",
        method: "POST",
        body: color,
      }),
      invalidatesTags: ["Colors"],
    }),
    updateColor: builder.mutation<ColorDto, UpdateColorRequest>({
      query: ({ colorId, ...color }) => ({
        url: `colors/${colorId}`,
        method: "PUT",
        body: color,
      }),
      invalidatesTags: ["Colors"],
    }),
    deleteColor: builder.mutation<void, number>({
      query: (colorId) => ({
        url: `colors/${colorId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Colors"],
    }),

    // Activity Levels endpoints
    fetchAllActivityLevels: builder.query<ActivityLevelDto[], void>({
      query: () => "activityLevels",
      providesTags: ["ActivityLevels"],
    }),
    createActivityLevel: builder.mutation<ActivityLevelDto, CreateActivityLevelRequest>({
      query: (activityLevel) => ({
        url: "activityLevels",
        method: "POST",
        body: activityLevel,
      }),
      invalidatesTags: ["ActivityLevels"],
    }),
    updateActivityLevel: builder.mutation<ActivityLevelDto, UpdateActivityLevelRequest>({
      query: ({ activityLevelId, ...activityLevel }) => ({
        url: `activityLevels/${activityLevelId}`,
        method: "PUT",
        body: activityLevel,
      }),
      invalidatesTags: ["ActivityLevels"],
    }),
    deleteActivityLevel: builder.mutation<void, number>({
      query: (activityLevelId) => ({
        url: `activityLevels/${activityLevelId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ActivityLevels"],
    }),

    // Health Statuses endpoints
    fetchAllHealthStatuses: builder.query<HealthStatusDto[], void>({
      query: () => "healthStatuses",
      providesTags: ["HealthStatuses"],
    }),
    createHealthStatus: builder.mutation<HealthStatusDto, CreateHealthStatusRequest>({
      query: (healthStatus) => ({
        url: "healthStatuses",
        method: "POST",
        body: healthStatus,
      }),
      invalidatesTags: ["HealthStatuses"],
    }),
    updateHealthStatus: builder.mutation<HealthStatusDto, UpdateHealthStatusRequest>({
      query: ({ healthStatusId, ...healthStatus }) => ({
        url: `healthStatuses/${healthStatusId}`,
        method: "PUT",
        body: healthStatus,
      }),
      invalidatesTags: ["HealthStatuses"],
    }),
    deleteHealthStatus: builder.mutation<void, number>({
      query: (healthStatusId) => ({
        url: `healthStatuses/${healthStatusId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["HealthStatuses"],
    }),
  }),
});

export const {
  // Species hooks
  useFetchAllSpeciesQuery,
  useCreateSpeciesMutation,
  useUpdateSpeciesMutation,
  useDeleteSpeciesMutation,
  
  // Breeds hooks
  useFetchAllBreedsQuery,
  useCreateBreedMutation,
  useUpdateBreedMutation,
  useDeleteBreedMutation,
  
  // Coat Lengths hooks
  useFetchAllCoatLengthsQuery,
  useCreateCoatLengthMutation,
  useUpdateCoatLengthMutation,
  useDeleteCoatLengthMutation,
  
  // Colors hooks
  useFetchAllColorsQuery,
  useCreateColorMutation,
  useUpdateColorMutation,
  useDeleteColorMutation,
  
  // Activity Levels hooks
  useFetchAllActivityLevelsQuery,
  useCreateActivityLevelMutation,
  useUpdateActivityLevelMutation,
  useDeleteActivityLevelMutation,
  
  // Health Statuses hooks
  useFetchAllHealthStatusesQuery,
  useCreateHealthStatusMutation,
  useUpdateHealthStatusMutation,
  useDeleteHealthStatusMutation,
} = petAttributesApi;
