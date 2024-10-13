// genresSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchGenres = createAsyncThunk('genres/fetchGenres', async () => {
  const response = await axios.get('http://localhost:8080/api/genres');
  return response.data;
});

const genreSlice = createSlice({
  name: 'genres',
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchGenres.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export default genreSlice.reducer;
