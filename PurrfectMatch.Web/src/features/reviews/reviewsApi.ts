import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import { 
  ReviewDto, 
  CreateReviewDto, 
  UpdateReviewDto, 
  ShelterRatingStats 
} from "../../app/models/review";

export const reviewsApi = createApi({
  reducerPath: "reviewsApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["Review", "ShelterRating"],
  endpoints: (builder) => ({    // Create a review
    createReview: builder.mutation<ReviewDto, CreateReviewDto>({
      query: (data) => ({
        url: "reviews",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_, __, arg) => [
        { type: "Review", id: "LIST" },
        { type: "ShelterRating", id: arg.shelterId },
      ],
    }),    // Update a review
    updateReview: builder.mutation<ReviewDto, { reviewId: number; data: UpdateReviewDto; shelterId?: number }>({
      query: ({ reviewId, data }) => ({
        url: `reviews/${reviewId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, __, arg) => [
        { type: "Review", id: arg.reviewId },
        { type: "Review", id: "LIST" },
        // Invalidate shelter-specific reviews using passed shelterId or result shelterId
        { type: "Review", id: arg.shelterId || result?.shelterId },
        { type: "ShelterRating", id: arg.shelterId || result?.shelterId },
        // Also invalidate user review for shelter query
        { type: "Review", id: `${arg.shelterId || result?.shelterId}-${result?.userId}` },
      ],
    }),// Delete a review
    deleteReview: builder.mutation<void, number>({
      query: (reviewId) => ({
        url: `reviews/${reviewId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, reviewId) => [
        { type: "Review", id: reviewId },
        { type: "Review", id: "LIST" },
        // Since we don't get shelter ID back from delete, invalidate all shelter ratings
        { type: "ShelterRating", id: "LIST" },
      ],
    }),// Get shelter reviews
    getShelterReviews: builder.query<ReviewDto[], number>({
      query: (shelterId) => `reviews/shelters/${shelterId}`,
      providesTags: (_, __, shelterId) => [
        { type: "Review", id: "LIST" },
        { type: "Review", id: shelterId },
      ],
    }),

    // Get user reviews
    getUserReviews: builder.query<ReviewDto[], string>({
      query: (userId) => `reviews/users/${userId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ reviewId }) => ({ type: "Review" as const, id: reviewId })),
              { type: "Review", id: "LIST" },
            ]
          : [{ type: "Review", id: "LIST" }],
    }),    // Get user review for a specific shelter
    getUserReviewForShelter: builder.query<ReviewDto | null, { userId: string; shelterId: number }>({
      query: ({ userId, shelterId }) => `reviews/shelters/${shelterId}/users/${userId}`,
      providesTags: (_, __, { shelterId, userId }) => [
        { type: "Review", id: `${shelterId}-${userId}` },
      ],
    }),

    // Get shelter average rating
    getShelterAverageRating: builder.query<ShelterRatingStats, number>({
      query: (shelterId) => `reviews/shelters/${shelterId}/average-rating`,
      providesTags: (_, __, shelterId) => [
        { type: "ShelterRating", id: shelterId },
      ],
    }),

    // Get shelter review count
    getShelterReviewCount: builder.query<{ count: number }, number>({
      query: (shelterId) => `reviews/shelters/${shelterId}/count`,
      providesTags: (_, __, shelterId) => [
        { type: "ShelterRating", id: shelterId },
      ],
    }),
  }),
});

export const {
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useGetShelterReviewsQuery,
  useGetUserReviewsQuery,
  useGetUserReviewForShelterQuery,
  useGetShelterAverageRatingQuery,
  useGetShelterReviewCountQuery,
} = reviewsApi;
