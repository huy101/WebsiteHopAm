import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const commentsApi = createApi({
  reducerPath: 'commentsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080' }),
  tagTypes: ['Comments'], // Tag for caching

  endpoints: (builder) => ({
    // Fetch comments
    getComments: builder.query({
      query: () => 'list/comments',
      providesTags: ['Comments'], // Cache tag for real-time updates
    }),

    // Add comment
    addComment: builder.mutation({
      query: (newComment) => ({
        url: '/comment',
        method: 'POST',
        body: newComment,
      }),
      invalidatesTags: ['Comments'], // Invalidate the cache to refetch comments
    }),
  }),
});

export const { useGetCommentsQuery, useAddCommentMutation } = commentsApi;
