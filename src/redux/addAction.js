// src/actions/addAction.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk action để thêm bài hát
  const addSong = createAsyncThunk(
  'songs/addSong',
  async (newSong, { rejectWithValue }) => {
    try {
      // Giả sử bạn có một API để thêm bài hát
      const response = await axios.post('http://localhost:8080/song/add', newSong);
      
      return response.data; 
      // Trả về dữ liệu sau khi bài hát đã được thêm

    } catch (error) {
      // Xử lý lỗi nếu có
      return rejectWithValue(error.response.data);
    }
  }
);

export default addSong