import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import { Shelter } from "../../app/models/shelter";

export interface ShelterFilterOption {
  id: number;
  name: string;
}

export interface LocationOption {
  value: string;
  label: string;
}

export const shelterFilterOptionsApi = createApi({
  reducerPath: "shelterFilterOptionsApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["ShelterFilterOptions"],
  endpoints: (builder) => ({
    // Get unique cities from all shelters
    fetchShelterCities: builder.query<LocationOption[], void>({
      query: () => ({ url: "shelters" }),
      transformResponse: (response: { items: Shelter[] }) => {
        const cities = new Set<string>();
        response.items.forEach(shelter => {
          if (shelter.address?.city) {
            cities.add(shelter.address.city);
          }
        });
        return Array.from(cities)
          .sort()
          .map(city => ({ value: city, label: city }));
      },
      providesTags: ["ShelterFilterOptions"],
    }),
    
    // Get unique states from all shelters
    fetchShelterStates: builder.query<LocationOption[], void>({
      query: () => ({ url: "shelters" }),
      transformResponse: (response: { items: Shelter[] }) => {
        const states = new Set<string>();
        response.items.forEach(shelter => {
          if (shelter.address?.state) {
            states.add(shelter.address.state);
          }
        });
        return Array.from(states)
          .sort()
          .map(state => ({ value: state, label: state }));
      },
      providesTags: ["ShelterFilterOptions"],
    }),
    
    // Get all shelters for shelter selection filter
    fetchAllSheltersForFilter: builder.query<ShelterFilterOption[], void>({
      query: () => ({ url: "shelters" }),
      transformResponse: (response: { items: Shelter[] }) => {
        return response.items
          .map(shelter => ({
            id: shelter.shelterId,
            name: shelter.name
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
      },
      providesTags: ["ShelterFilterOptions"],
    }),
  }),
});

export const {
  useFetchShelterCitiesQuery,
  useFetchShelterStatesQuery,
  useFetchAllSheltersForFilterQuery,
} = shelterFilterOptionsApi;

// Default options in case the API fails
export const defaultShelterFilterOptions = {
  cities: [
    { value: "New York", label: "New York" },
    { value: "Los Angeles", label: "Los Angeles" },
    { value: "Chicago", label: "Chicago" },
    { value: "Houston", label: "Houston" },
    { value: "Phoenix", label: "Phoenix" },
    { value: "Philadelphia", label: "Philadelphia" },
    { value: "San Antonio", label: "San Antonio" },
    { value: "San Diego", label: "San Diego" },
    { value: "Dallas", label: "Dallas" },
    { value: "San Jose", label: "San Jose" },
  ],
  states: [
    { value: "AL", label: "Alabama" },
    { value: "AK", label: "Alaska" },
    { value: "AZ", label: "Arizona" },
    { value: "AR", label: "Arkansas" },
    { value: "CA", label: "California" },
    { value: "CO", label: "Colorado" },
    { value: "CT", label: "Connecticut" },
    { value: "DE", label: "Delaware" },
    { value: "FL", label: "Florida" },
    { value: "GA", label: "Georgia" },
    { value: "HI", label: "Hawaii" },
    { value: "ID", label: "Idaho" },
    { value: "IL", label: "Illinois" },
    { value: "IN", label: "Indiana" },
    { value: "IA", label: "Iowa" },
    { value: "KS", label: "Kansas" },
    { value: "KY", label: "Kentucky" },
    { value: "LA", label: "Louisiana" },
    { value: "ME", label: "Maine" },
    { value: "MD", label: "Maryland" },
    { value: "MA", label: "Massachusetts" },
    { value: "MI", label: "Michigan" },
    { value: "MN", label: "Minnesota" },
    { value: "MS", label: "Mississippi" },
    { value: "MO", label: "Missouri" },
    { value: "MT", label: "Montana" },
    { value: "NE", label: "Nebraska" },
    { value: "NV", label: "Nevada" },
    { value: "NH", label: "New Hampshire" },
    { value: "NJ", label: "New Jersey" },
    { value: "NM", label: "New Mexico" },
    { value: "NY", label: "New York" },
    { value: "NC", label: "North Carolina" },
    { value: "ND", label: "North Dakota" },
    { value: "OH", label: "Ohio" },
    { value: "OK", label: "Oklahoma" },
    { value: "OR", label: "Oregon" },
    { value: "PA", label: "Pennsylvania" },
    { value: "RI", label: "Rhode Island" },
    { value: "SC", label: "South Carolina" },
    { value: "SD", label: "South Dakota" },
    { value: "TN", label: "Tennessee" },
    { value: "TX", label: "Texas" },
    { value: "UT", label: "Utah" },
    { value: "VT", label: "Vermont" },
    { value: "VA", label: "Virginia" },
    { value: "WA", label: "Washington" },
    { value: "WV", label: "West Virginia" },
    { value: "WI", label: "Wisconsin" },
    { value: "WY", label: "Wyoming" },
  ],
  sortOptions: [
    { value: "name", label: "Name" },
    { value: "city", label: "City" },
    { value: "state", label: "State" },
  ],
};
