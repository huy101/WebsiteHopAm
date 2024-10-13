// rhythmsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchRhythms = createAsyncThunk('rhythms/fetchRhythms', async () => {
  const response = await axios.get('http://localhost:8080/api/rhythms');
  return response.data;
});

const rhythmsSlice = createSlice({
  name: 'rhythms',
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchRhythms.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export default rhythmsSlice.reducer;
