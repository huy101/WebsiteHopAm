import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunk: Gọi API phân trang bài hát
export const fetchSongs = createAsyncThunk(
  'songs/fetchSongs',
  async ({ genreId, rhythmId, artistName, page }, thunkAPI) => {
    try {
      const response = await axios.get('http://localhost:8080/pages/paginate', {
        params: { genreId, rhythmId, artistName, page },
      });
      return response.data; // Trả về dữ liệu từ API
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Failed to fetch songs');
    }
  }
);

// Tạo Slice
const songsSlice = createSlice({
  name: 'songs',
  initialState: {
    songs: [],
    currentPage: 1,
    totalPages: 0,
    totalSongs: 0,
    isLoading: false,
    error: null,
  },
  reducers: {}, // Có thể thêm reducers tùy chỉnh nếu cần
  extraReducers: (builder) => {
    builder
      // Xử lý trạng thái khi gọi fetchSongs (pending)
      .addCase(fetchSongs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // Xử lý thành công khi fetchSongs hoàn thành (fulfilled)
      .addCase(fetchSongs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.songs = action.payload.songs;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.totalSongs = action.payload.totalSongs;
      })
      // Xử lý lỗi khi fetchSongs thất bại (rejected)
      .addCase(fetchSongs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Something went wrong';
      });
  },
});

export default songsSlice.reducer;
