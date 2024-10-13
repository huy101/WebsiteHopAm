import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk để gửi yêu cầu thêm bài hát đến API
export const addSong = createAsyncThunk('songs/addSong', async (newSong) => {
    const response = await axios.post('/api/songs', newSong);
    return response.data; // API trả về thông tin bài hát đã thêm
});

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
            });
    },
});

export const { addLocalSong } = songSlice.actions;

export default songSlice.reducer;
