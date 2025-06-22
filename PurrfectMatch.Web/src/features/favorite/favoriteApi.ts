import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import { FavoriteDto } from "../../app/models/Favorite";

export const favoriteApi = createApi({
  reducerPath: "favoriteApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["Favorites"],
  endpoints: (builder) => ({
    fetchFavorites: builder.query<FavoriteDto[], void>({
      query: () => "favorites",
      providesTags: ["Favorites"],
    }),
    addFavorite: builder.mutation<FavoriteDto, Partial<FavoriteDto>>({
      query: (body) => ({
        url: "favorites",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Favorites"],
    }),
    removeFavorite: builder.mutation<{ success: boolean; petId: number }, number>({
      query: (petId) => ({
        url: `favorites/${petId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Favorites"],
    }),
  }),
});

export const {
  useFetchFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} = favoriteApi;
