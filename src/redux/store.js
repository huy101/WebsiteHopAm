// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import songSlice from './songSlice'
import genresReducer  from './genreSlice'
import rhythmsReducer  from './rhythmSlice'
const store = configureStore({
  reducer: {
    auth: authSlice,
    songs:songSlice,
    genres: genresReducer,
    rhythms: rhythmsReducer,
  },
});

export default store;
