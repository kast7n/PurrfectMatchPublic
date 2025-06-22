import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";

// Article types (reusing Post types but with article-specific naming)
export interface Article {
  postId: number;
  postType: string;
  shelterId?: number;
  shelterName?: string;
  userId: string;
  userName: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags: ArticleTag[];
}

export interface ArticleTag {
  tagId: number;
  tagName: string;
  createdAt: string;
}

export interface CreateArticleDto {
  postType: string;
  shelterId?: number;
  title: string;
  content: string;
  tagIds?: number[];
  userId?: string; // Will be set by the backend from auth token
}

export interface UpdateArticleDto {
  postType?: string;
  title?: string;
  content?: string;
  tagIds?: number[];
}

export interface ArticleFilterDto {
  postType?: string;
  shelterId?: number;
  userId?: string;
  title?: string;
  content?: string;
  tagId?: number;
  createdAfter?: string;
  createdBefore?: string;
  pageNumber: number;
  pageSize: number;
  sortBy?: string;
  sortDescending?: boolean;
}

export interface PaginatedArticlesResponse {
  items: Article[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateArticleTagDto {
  tagName: string;
}

export interface UpdateArticleTagDto {
  tagName: string;
}

export interface ArticleTagFilterDto {
  tagName?: string;
  createdAfter?: string;
  createdBefore?: string;
  pageNumber: number;
  pageSize: number;
  sortBy?: string;
  sortDescending?: boolean;
}

export const articlesApi = createApi({
  reducerPath: "articlesApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["Article", "ArticleTag"],
  endpoints: (builder) => ({
    // Article endpoints (using posts backend)
    fetchFilteredArticles: builder.query<PaginatedArticlesResponse, ArticleFilterDto | undefined>({
      query: (filter) => ({
        url: "posts",
        params: filter || undefined,
      }),
      providesTags: ["Article"],
    }),
    
    fetchArticleById: builder.query<Article, number>({
      query: (id) => ({ url: `posts/${id}` }),
      providesTags: (_result, _error, id) => [{ type: "Article", id }],
    }),

    createArticle: builder.mutation<Article, CreateArticleDto>({
      query: (newArticle) => ({
        url: "posts",
        method: "POST",
        body: newArticle,
      }),
      invalidatesTags: ["Article"],
    }),    updateArticle: builder.mutation<Article, { id: number; updatedArticle: UpdateArticleDto }>({
      query: ({ id, updatedArticle }) => ({
        url: `posts/${id}`,
        method: "PUT",
        body: updatedArticle,
      }),      async onQueryStarted({ id, updatedArticle }, { dispatch, queryFulfilled }) {
        // Optimistic update
        const patchResult = dispatch(
          articlesApi.util.updateQueryData('fetchArticleById', id, (draft) => {
            if (updatedArticle.title) draft.title = updatedArticle.title;
            if (updatedArticle.content) draft.content = updatedArticle.content;
            if (updatedArticle.postType) draft.postType = updatedArticle.postType;
            // Note: We can't easily update tags here without fetching tag details
            // The invalidation will refetch the full data with updated tags
            draft.updatedAt = new Date().toISOString();
          })
        );
        try {
          const result = await queryFulfilled;
          // Update with actual result from server
          dispatch(
            articlesApi.util.updateQueryData('fetchArticleById', id, () => result.data)
          );
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Article", id },
        "Article", // Also invalidate the general list
      ],
    }),    deleteArticle: builder.mutation<void, number>({
      query: (id) => ({
        url: `posts/${id}`,
        method: "DELETE",
      }),      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        // Optimistically remove the article from all lists
        const patchResults: { undo: () => void }[] = [];
        
        // Remove from fetchFilteredArticles cache
        patchResults.push(
          dispatch(
            articlesApi.util.updateQueryData('fetchFilteredArticles', undefined, (draft) => {
              if (draft?.items) {
                draft.items = draft.items.filter(article => article.postId !== id);
                draft.totalCount = Math.max(0, draft.totalCount - 1);
              }
            })
          )
        );

        try {
          await queryFulfilled;
          // Success - the optimistic updates stay
        } catch {
          // Revert optimistic updates on error
          patchResults.forEach(patchResult => patchResult.undo());
        }
      },
      invalidatesTags: (_result, _error, id) => [
        { type: "Article", id },
        "Article", // Invalidate all article lists
      ],
    }),

    fetchUserArticles: builder.query<Article[], string>({
      query: (userId) => ({ url: `posts/user/${userId}` }),
      providesTags: (_result, _error, userId) => [{ type: "Article", id: `user-${userId}` }],
    }),

    fetchShelterArticles: builder.query<Article[], number>({
      query: (shelterId) => ({ url: `posts/shelter/${shelterId}` }),
      providesTags: (_result, _error, shelterId) => [{ type: "Article", id: `shelter-${shelterId}` }],
    }),

    fetchArticlesByTag: builder.query<Article[], number>({
      query: (tagId) => ({ url: `posts/tag/${tagId}` }),
      providesTags: (_result, _error, tagId) => [{ type: "Article", id: `tag-${tagId}` }],
    }),    // Learning articles (tagged with "learning" - tagId: 2)
    fetchLearningArticles: builder.query<Article[], void>({
      query: () => ({ 
        url: "posts", 
        params: { 
          tagId: 2, // "learning" tag
          pageSize: 3,
          sortBy: "createdAt",
          sortDescending: true 
        } 
      }),
      transformResponse: (response: PaginatedArticlesResponse) => response.items,
      providesTags: [{ type: "Article", id: "learning" }],
    }),fetchAllLearningArticles: builder.query<PaginatedArticlesResponse, { pageNumber?: number; pageSize?: number }>({
      query: ({ pageNumber = 1, pageSize = 12 } = {}) => ({ 
        url: "posts", 
        params: { 
          tagId: 2, // "learning" tag
          pageNumber,
          pageSize,
          sortBy: "createdAt",
          sortDescending: true 
        } 
      }),
      providesTags: [{ type: "Article", id: "learning-all" }],
    }),    // Care guide articles (tagged with "guides" - tagId: 3)
    fetchCareGuideArticles: builder.query<Article[], void>({
      query: () => ({ 
        url: "posts", 
        params: { 
          tagId: 3, // "guides" tag
          pageSize: 3,
          sortBy: "createdAt",
          sortDescending: true 
        } 
      }),
      transformResponse: (response: PaginatedArticlesResponse) => response.items,
      providesTags: [{ type: "Article", id: "care-guides" }],
    }),

    fetchAllCareGuideArticles: builder.query<PaginatedArticlesResponse, { pageNumber?: number; pageSize?: number }>({
      query: ({ pageNumber = 1, pageSize = 12 } = {}) => ({ 
        url: "posts", 
        params: { 
          tagId: 3, // "guides" tag
          pageNumber,
          pageSize,
          sortBy: "createdAt",
          sortDescending: true 
        } 
      }),
      providesTags: [{ type: "Article", id: "care-guides-all" }],
    }),    // Health & wellness articles (tagged with "health" - tagId: 1)
    fetchHealthArticles: builder.query<Article[], void>({
      query: () => ({ 
        url: "posts", 
        params: { 
          tagId: 1, // "health" tag
          pageSize: 3,
          sortBy: "createdAt",
          sortDescending: true 
        } 
      }),
      transformResponse: (response: PaginatedArticlesResponse) => response.items,
      providesTags: [{ type: "Article", id: "health" }],
    }),

    fetchAllHealthArticles: builder.query<PaginatedArticlesResponse, { pageNumber?: number; pageSize?: number }>({
      query: ({ pageNumber = 1, pageSize = 12 } = {}) => ({ 
        url: "posts", 
        params: { 
          tagId: 1, // "health" tag
          pageNumber,
          pageSize,
          sortBy: "createdAt",
          sortDescending: true 
        } 
      }),
      providesTags: [{ type: "Article", id: "health-all" }],
    }),    // News articles (tagged with "news" - tagId: 4)
    fetchNewsArticles: builder.query<Article[], void>({
      query: () => ({ 
        url: "posts", 
        params: { 
          tagId: 4, // "news" tag
          pageSize: 3,
          sortBy: "createdAt",
          sortDescending: true 
        } 
      }),
      transformResponse: (response: PaginatedArticlesResponse) => response.items,
      providesTags: [{ type: "Article", id: "news" }],
    }),

    fetchAllNewsArticles: builder.query<PaginatedArticlesResponse, { pageNumber?: number; pageSize?: number }>({
      query: ({ pageNumber = 1, pageSize = 12 } = {}) => ({ 
        url: "posts", 
        params: { 
          tagId: 4, // "news" tag
          pageNumber,
          pageSize,
          sortBy: "createdAt",
          sortDescending: true 
        } 
      }),
      providesTags: [{ type: "Article", id: "news-all" }],
    }),

    // Tag endpoints (reusing existing tags)
    fetchFilteredArticleTags: builder.query<ArticleTag[], ArticleTagFilterDto | undefined>({
      query: (filter) => ({
        url: "tags",
        params: filter || undefined,
      }),
      providesTags: ["ArticleTag"],
    }),

    fetchAllArticleTags: builder.query<ArticleTag[], void>({
      query: () => ({ url: "tags/all" }),
      providesTags: ["ArticleTag"],
    }),

    fetchArticleTagById: builder.query<ArticleTag, number>({
      query: (id) => ({ url: `tags/${id}` }),
      providesTags: (_result, _error, id) => [{ type: "ArticleTag", id }],
    }),

    fetchArticleTagByName: builder.query<ArticleTag, string>({
      query: (tagName) => ({ url: `tags/name/${tagName}` }),
      providesTags: (_result, _error, tagName) => [{ type: "ArticleTag", id: tagName }],
    }),

    createArticleTag: builder.mutation<ArticleTag, CreateArticleTagDto>({
      query: (newTag) => ({
        url: "tags",
        method: "POST",
        body: newTag,
      }),
      invalidatesTags: ["ArticleTag"],
    }),

    updateArticleTag: builder.mutation<ArticleTag, { id: number; updatedTag: UpdateArticleTagDto }>({
      query: ({ id, updatedTag }) => ({
        url: `tags/${id}`,
        method: "PUT",
        body: updatedTag,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "ArticleTag", id }],
    }),

    deleteArticleTag: builder.mutation<void, number>({
      query: (id) => ({
        url: `tags/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [{ type: "ArticleTag", id }],
    }),

    fetchArticleTagsByPost: builder.query<ArticleTag[], number>({
      query: (postId) => ({ url: `tags/post/${postId}` }),
      providesTags: (_result, _error, postId) => [{ type: "ArticleTag", id: `post-${postId}` }],
    }),
  }),
});

export const {
  // Article hooks
  useFetchFilteredArticlesQuery,
  useFetchArticleByIdQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
  useFetchUserArticlesQuery,
  useFetchShelterArticlesQuery,
  useFetchArticlesByTagQuery,
  
  // Specific article type hooks
  useFetchLearningArticlesQuery,
  useFetchAllLearningArticlesQuery,
  useFetchCareGuideArticlesQuery,
  useFetchAllCareGuideArticlesQuery,
  useFetchHealthArticlesQuery,
  useFetchAllHealthArticlesQuery,
  useFetchNewsArticlesQuery,
  useFetchAllNewsArticlesQuery,
  
  // Tag hooks
  useFetchFilteredArticleTagsQuery,
  useFetchAllArticleTagsQuery,
  useFetchArticleTagByIdQuery,
  useFetchArticleTagByNameQuery,
  useCreateArticleTagMutation,
  useUpdateArticleTagMutation,
  useDeleteArticleTagMutation,
  useFetchArticleTagsByPostQuery,
} = articlesApi;
