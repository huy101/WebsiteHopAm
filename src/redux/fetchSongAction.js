  import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
  import axios from 'axios';

  // Thunk action to fetch a single song by slug
  export const fetchSongById = createAsyncThunk(
    'song/fetchSongById', // Action type
    async (id, { rejectWithValue }) => {
      try {

        // Fetch song by slug from the API
        const {data}= await axios.get(`http://localhost:8080/song/${id}`);
        return data// Returning the song data from the response
      } catch (error) {
        // Handling errors
        return rejectWithValue(
          error.response && error.response.data ? error.response.data : error.message
        );
      }
    }
  );

  // Initial state for the slice
  const initialState = {
    songData: null,  // Data for a single song
    loading: false,  // Loading state
    error: null,     // Error state
  };

  // The slice definition
  const songSlice = createSlice({
    name: 'song',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchSongById.pending, (state) => {
          state.loading = true;
          state.error = null;
          state.songData = null; // Clear song data on new request
        })
        .addCase(fetchSongById.fulfilled, (state, action) => {
          state.loading = false;
          state.songData = action.payload; // Set song data
        })
        .addCase(fetchSongById.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload; // Set error
        });
    },
  });

  export default songSlice.reducer;
