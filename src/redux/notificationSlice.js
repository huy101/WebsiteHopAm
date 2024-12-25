import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Create API slice
export const notificationsApi = createApi({
  reducerPath: 'notificationsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080' }),
  tagTypes: ['Notifications'], // Tag for real-time updates

  endpoints: (builder) => ({
    // Fetch notifications
    getNotifications: builder.query({
      query: (userId) => `notifications/${userId}`,
      providesTags: ['Notifications'], // Tracks cache updates
    }),

    // Mark all notifications as read
    markAllAsRead: builder.mutation({
      query: (userId) => ({
        url: `notifications/${userId}/markRead`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Notifications'], // Invalidate cache to refetch updated data
    }),
  }),
});

// Export hooks for usage in components
export const { useGetNotificationsQuery, useMarkAllAsReadMutation } = notificationsApi;
