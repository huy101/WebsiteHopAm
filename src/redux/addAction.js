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
      // Xử lý lỗi nếu cóconsole.error('Error adding song:', error);

      // Reject the promise with the error message from the backend (if exists)
      // Adjust 'error.response.data' if the backend sends the error differently
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        // If the error does not have a response (e.g., network error), send a generic message
        return rejectWithValue('There was an error while adding the song.');
      }
    }
  }
);

export default addSong