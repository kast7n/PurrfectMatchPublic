import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import {
  SpeciesDto,
  BreedDto,
  CoatLengthDto,
  ColorDto,
  ActivityLevelDto,
  HealthStatusDto,
  ShelterFilterDto,
} from "../../app/models/PetAttributes";

export interface FilterOption {
  id: number;
  name: string;
}

export interface GoodWithOption {
  value: string;
  label: string;
  icon: string;
}

export interface BreedFilterParams {
  breedId?: number;
  speciesId?: number;
  name?: string;
}

export const filterOptionsApi = createApi({
  reducerPath: "filterOptionsApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["FilterOptions"],
  endpoints: (builder) => ({
    fetchSpecies: builder.query<SpeciesDto[], void>({
      query: () => "species",
      providesTags: ["FilterOptions"],
    }),    fetchBreeds: builder.query<BreedDto[], BreedFilterParams | void>({
      query: (params) => ({
        url: "breeds",
        params: params || undefined,
      }),
      providesTags: ["FilterOptions"],
    }),
    fetchCoatLengths: builder.query<CoatLengthDto[], void>({
      query: () => "coatLengths",
      providesTags: ["FilterOptions"],
    }),
    fetchColors: builder.query<ColorDto[], void>({
      query: () => "colors",
      providesTags: ["FilterOptions"],
    }),
    fetchActivityLevels: builder.query<ActivityLevelDto[], void>({
      query: () => "activityLevels",
      providesTags: ["FilterOptions"],
    }),
    fetchHealthStatuses: builder.query<HealthStatusDto[], void>({
      query: () => "healthStatuses",
      providesTags: ["FilterOptions"],
    }),
    fetchShelters: builder.query<ShelterFilterDto[], void>({
      query: () => ({ url: "shelters" }),
      providesTags: ["FilterOptions"],
    }),
  }),
});

export const {
  useFetchSpeciesQuery,
  useFetchBreedsQuery,
  useFetchCoatLengthsQuery,
  useFetchColorsQuery,
  useFetchActivityLevelsQuery,
  useFetchHealthStatusesQuery,
  useFetchSheltersQuery,
} = filterOptionsApi;

// Default options in case the API fails
export const defaultFilterOptions = {
  species: [
    { id: 1, name: "Dog" },
    { id: 2, name: "Cat" },
    { id: 3, name: "Bird" },
    { id: 4, name: "Small Animal" },
    { id: 5, name: "Reptile" },
  ],
  sizes: [
    { id: 1, name: "Small" },
    { id: 2, name: "Medium" },
    { id: 3, name: "Large" },
    { id: 4, name: "Extra Large" },
  ],
  genders: [
    { id: 1, name: "Male" },
    { id: 2, name: "Female" },
  ],
  goodWith: [
    { value: "Kids", label: "Kids", icon: "👶" },
    { value: "Dogs", label: "Dogs", icon: "🐕" },
    { value: "Cats", label: "Cats", icon: "🐈" },
    { value: "OtherAnimals", label: "Other Animals", icon: "🐾" },
    { value: "SeniorPeople", label: "Senior People", icon: "👵" },
  ],
  coatLengths: [
    { id: 1, name: "Short" },
    { id: 2, name: "Medium" },
    { id: 3, name: "Long" },
  ],
  colors: [
    { id: 1, name: "Black" },
    { id: 2, name: "White" },
    { id: 3, name: "Brown" },
    { id: 4, name: "Tabby" },
    { id: 5, name: "Calico" },
    { id: 6, name: "Mixed" },
  ],
  activityLevels: [
    { id: 1, name: "Low" },
    { id: 2, name: "Medium" },
    { id: 3, name: "High" },
  ],
  healthStatuses: [
    { id: 1, name: "Healthy" },
    { id: 2, name: "Minor Medical" },
    { id: 3, name: "Special Needs" },
    { id: 4, name: "Senior" },
  ],
};
