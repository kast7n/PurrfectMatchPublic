import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import { FavoriteDto } from "../../app/models/Favorite";

export const favoritesApi = createApi({
  reducerPath: "favoritesApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["Favorites"],
  endpoints: (builder) => ({
    getUserFavorites: builder.query<FavoriteDto[], string>({
      query: (userId) => ({
        url: `users/${userId}/favorites`, // Matches FavoritesController.cs route
        method: "GET",
      }),      providesTags: (result) =>
        result
          ? [
              ...result.map(({ petId }) => ({ type: "Favorites" as const, id: petId })), // Tag each favorite by petId
              { type: "Favorites", id: "LIST" }, // General list tag
            ]
          : [{ type: "Favorites", id: "LIST" }],
    }),
    // Basic add/remove mutations (can be expanded later)
    addFavorite: builder.mutation<FavoriteDto, { userId: string; petId: number }>({
      query: ({ userId, petId }) => ({
        url: `users/${userId}/favorites`,
        method: "POST",
        body: { userId, petId }, // Body based on AddToFavoritesDto
      }),
      invalidatesTags: [{ type: "Favorites", id: "LIST" }],
    }),
    removeFavorite: builder.mutation<void, { userId: string; petId: number }>({
      query: ({ userId, petId }) => ({
        url: `users/${userId}/favorites/${petId}`,
        method: "DELETE",
      }),      invalidatesTags: (_, __, { petId }) => [
        { type: "Favorites", id: "LIST" },
        { type: "Favorites", id: petId },
      ],
    }),
  }),
});

export const {
  useGetUserFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} = favoritesApi;
