// src/reducers/songSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { addSong } from './addAction';

// Khởi tạo trạng thái ban đầu
const initialState = {
  songs: [],
  status: 'idle', // Trạng thái của các thao tác async như thêm bài hát
  error: null,
};

// Tạo songSlice
const songSlice = createSlice({
  name: 'songs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Xử lý trạng thái khi action addSong đang thực hiện
      .addCase(addSong.pending, (state) => {
        state.status = 'loading';
      })
      // Xử lý khi action addSong thành công
      .addCase(addSong.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.songs.push(action.payload); // Thêm bài hát mới vào danh sách
      })
      // Xử lý khi action addSong thất bại
      .addCase(addSong.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// Xuất reducer
export default songSlice.reducer;
