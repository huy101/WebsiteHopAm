  // src/redux/store.js
  import { configureStore } from '@reduxjs/toolkit';
  import authSlice from './songSlice';       // Reducer for authentication state
  import songReducer from './fetchSongAction'; // Reducer for fetching song data
  import genresReducer from './genreSlice';    // Reducer for managing genres
  import rhythmsReducer from './rhythmSlice';  // Reducer for managing rhythms
  import fecthList from './fecthListAction'
  import typeSlice from './types'
  import authAction from './authActions'
  import favoritesSlice from './favoriteSlice'
  import fetchRecentSongs from './fecthListAction'
  import { commentsApi } from './commentsSlice';
  import {notificationsApi }from './notificationSlice'
  import songRequestReducer from "./requestSongSlice.js";
  // Create the Redux store with the specified reducers
  const store = configureStore({
    reducer: {
      fetchRecentSongs:fetchRecentSongs,
      auth: authAction,          // Authentication state
      list:fecthList,
      song: songReducer,  
      rhythms:rhythmsReducer,
      genres :  genresReducer ,
      songRequest:songRequestReducer,
      types:typeSlice ,
     
      favorites: favoritesSlice,
      [commentsApi.reducerPath]: commentsApi.reducer,
      [notificationsApi.reducerPath]: notificationsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        notificationsApi.middleware,
        commentsApi.middleware // Thêm middleware của commentsApi
      ),
  
  });

  export default store; // Export the configured store
