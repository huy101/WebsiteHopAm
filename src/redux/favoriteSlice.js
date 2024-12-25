import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunks for API calls
export const toggleFavorite = createAsyncThunk(
  'favorites/toggleFavorite',
  async ({ userId, songId, liked }, { rejectWithValue }) => {
    try {
      if (!liked) {
        await axios.post(`http://localhost:8080/list/user/${userId}/favorites`, { songId });
        return { songId, liked: true };
      } else {
        await axios.delete(`http://localhost:8080/list/user/${userId}/favorites/${songId}`);
        return { songId, liked: false };
      }
    } catch (error) {
      return rejectWithValue(error.response.data);
    } 
  }
);

export const checkFavorite = createAsyncThunk(
  'favorites/checkFavorite',
  async ({ userId, songId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:8080/list/user/${userId}/favorites/${songId}`);
      return { songId, liked: response.data.isLiked };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// New Thunk: Fetch Favorite Songs List
export const fetchFavoriteSongs = createAsyncThunk(
  'favorites/fetchFavoriteSongs',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:8080/list/user/${userId}/favorites`);
      return response.data; // Assuming the API returns an array of favorite songs
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  })
// Slice for favorites
const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    favoriteSongs: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(toggleFavorite.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleFavorite.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.favoriteSongs[payload.songId] = payload.liked;
      })
      .addCase(toggleFavorite.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(checkFavorite.fulfilled, (state, { payload }) => {
        state.favoriteSongs[payload.songId] = payload.liked;
      })
      .addCase(fetchFavoriteSongs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFavoriteSongs.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.favoriteSongs = payload; // Set the list of favorite songs
      })
      .addCase(fetchFavoriteSongs.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export default favoritesSlice.reducer;