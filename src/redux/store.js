// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authSlice from './songSlice';       // Reducer for authentication state
import songReducer from './fetchSongAction'; // Reducer for fetching song data
import genresReducer from './genreSlice';    // Reducer for managing genres
import rhythmsReducer from './rhythmSlice';  // Reducer for managing rhythms
import fecthList from './fecthListAction'
import typeSlice from './types'
// Create the Redux store with the specified reducers
const store = configureStore({
  reducer: {
    auth: authSlice,          // Authentication state
       list:fecthList,
    song: songReducer,  
    rhythms:rhythmsReducer,
    genres :  genresReducer ,
    types:typeSlice  // Song data state
  },
});

export default store; // Export the configured store
