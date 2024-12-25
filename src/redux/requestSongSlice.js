import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk để gửi yêu cầu bài hát
export const requestSong = createAsyncThunk(
  "songRequest/requestSong",
  async ({ title, artist, lyrics, videoId, userId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/request",
        { title, artist, lyrics, videoId, userId }
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Đã xảy ra lỗi khi gửi yêu cầu bài hát!";
      console.error("Error in requestSong:", errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);
// Async thunk để tạo bài hát từ yêu cầu
export const createSongFromRequest = createAsyncThunk(
  "songRequest/createSongFromRequest",
  async ({ data, requestId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/request/approve/${requestId}`,
        data
      );
      return response.data; // Return the new song data
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while creating the song!";
      console.error("Error in createSongFromRequest:", errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);


// Async thunk để lấy danh sách yêu cầu bài hát
export const fetchRequests = createAsyncThunk(
  "songRequest/fetchRequests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:8080/request/list");
      return response.data; // Trả về danh sách yêu cầu
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Đã xảy ra lỗi khi lấy danh sách yêu cầu bài hát!"
      );
    }
  }
);
// Thunk để fetch một request cụ thể
export const fetchRequestById = createAsyncThunk(
  'songRequest/fetchRequestById',
  async (requestId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:8080/request/${requestId}`);
      return response.data; // Trả về dữ liệu từ API
    } catch (error) {
      // Xử lý lỗi và trả về reject
      return rejectWithValue(
        error.response?.data?.message || 'Lỗi khi lấy yêu cầu bài hát'
      );
    }
  }
);
// Slice cho songRequest
const songRequestSlice = createSlice({
  name: "songRequest",
  initialState: {
    loading: false,
    successMessage: "",
    errorMessage: "",
    requests: [], // Thêm trường này để lưu trữ danh sách yêu cầu
    selectedRequest: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.successMessage = "";
      state.errorMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestSong.pending, (state) => {
        state.loading = true;
        state.successMessage = "";
        state.errorMessage = "";
      })
      .addCase(requestSong.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message; // Lấy message từ API
        state.errorMessage = "";
      })
      .addCase(requestSong.rejected, (state, action) => {
        state.loading = false;
        state.successMessage = "";
        state.errorMessage = action.payload; // Lấy lỗi từ rejectWithValue
      })
      .addCase(fetchRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload; // Lưu danh sách yêu cầu
        state.errorMessage = "";
      })
      .addCase(fetchRequests.rejected, (state, action) => {
        state.loading = false;
        state.successMessage = "";
        state.errorMessage = action.payload; // Lấy lỗi từ rejectWithValue
      })
      .addCase(fetchRequestById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRequestById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedRequest = action.payload; // Lưu yêu cầu cụ thể vào state
        state.errorMessage = "";
      })
      .addCase(fetchRequestById.rejected, (state, action) => {
        state.loading = false;
        state.successMessage = "";
        state.errorMessage = action.payload;
      });
  },
});

export const { clearMessages } = songRequestSlice.actions;
export default songRequestSlice.reducer;
