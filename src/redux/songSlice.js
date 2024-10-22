import { createSlice} from '@reduxjs/toolkit';

import addSong from './addAction'
// Thunk để gửi yêu cầu thêm bài hát đến API
import { fetchSongById } from './fetchSongAction';

// Khởi tạo slice
const songSlice = createSlice({
    name: 'songs',
    initialState: {
        songs: [],  // Danh sách bài hát
        loading: false,
        error: null,
    },
    reducers: {
        // Reducer để thêm bài hát vào state
        addLocalSong: (state, action) => {
            state.songs.push(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addSong.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addSong.fulfilled, (state, action) => {
                state.songs.push(action.payload); // Thêm bài hát vào danh sách khi hoàn thành
                state.loading = false;
            })
            .addCase(addSong.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
           
            .addCase(fetchSongById.pending, (state) => {
                state.loading = true;
                state.error = null;
              })
              .addCase(fetchSongById.fulfilled, (state, action) => {
                state.song = action.payload; // Cập nhật bài hát
                state.loading = false;
              })
              .addCase(fetchSongById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message; // Xử lý lỗi
              })
    },
});

export const { addLocalSong } = songSlice.actions;

export default songSlice.reducer;
