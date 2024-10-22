// redux/slices/songSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk để fetch danh sách bài hát theo thể loại
export const fetchSongsByGenre = createAsyncThunk(
  'songs/fetchSongsByGenre',
  async (genreId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:8080/list/genre/${genreId}`);
      return response.data; // Trả về danh sách bài hát
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk để fetch danh sách bài hát theo điệu
export const fetchSongsByRhythm = createAsyncThunk(
  'songs/fetchSongsByRhythm',
  async (rhythmId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:8080/list/rhythm/${rhythmId}`);
      return response.data; // Trả về danh sách bài hát
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk để fetch danh sách bài hát theo tên tác giả
export const fetchSongsByComposer = createAsyncThunk(
  'songs/fetchSongsByComposer',
  async (composerId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/songs/composer/${composerId}`);
      return response.data; // Trả về danh sách bài hát
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const songSlice = createSlice({
  name: 'songs',
  initialState: {
    songs: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSongsByGenre.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSongsByGenre.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.songs = payload; // Lưu danh sách bài hát
      })
      .addCase(fetchSongsByGenre.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(fetchSongsByRhythm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSongsByRhythm.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.songs = payload; // Lưu danh sách bài hát
      })
      .addCase(fetchSongsByRhythm.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(fetchSongsByComposer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSongsByComposer.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.songs = payload; // Lưu danh sách bài hát
      })
      .addCase(fetchSongsByComposer.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  }
});

export default songSlice.reducer;
