// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../reudx/slice';

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default store;
