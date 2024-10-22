// import axios from "axios";
// import { createAsyncThunk } from "@reduxjs/toolkit";
// import { createSlice } from '@reduxjs/toolkit';

// export const userLogin = createAsyncThunk(
//     '/login',
//     async ({ email,password }, { rejectWithValue }) => {
//       try {
//         const url = "http://localhost:8080/login";
//         console.log("Login data being sent:", { email,password });
//         const { data } = await axios.post(url, { email,password });
//        alert("Response data:", data.user);
        
//         if (!data.token) {
//           throw new Error("No token returned from server");
//         }
  
//         localStorage.setItem('userToken', data.token);
//         localStorage.setItem('userInfo', JSON.stringify(data.username, data.email)); 
//         return {
//           userInfo: {
//             _id: data.user._id,
//             email: data.user.email,
//             name: data.user.name,
//           },
//           userToken: data.token,
//         };
//       } catch (error) {
//         console.error("Error occurred during login:", error); // Thêm log lỗi
//         if (error.response && error.response.data.message) {
//           return rejectWithValue(error.response.data.message);
//         } else {
//           return rejectWithValue(error.message);
//         }
//       }
//     }
//   );

  
//   const initialState = {
//     loading: false,
//     userInfo: JSON.parse(localStorage.getItem('userInfo')) || null, // Khôi phục từ localStorage
//     userToken: localStorage.getItem('userToken') || null,
//     error: null,
//     success: false,
//   };
  
//   const authSlice = createSlice({
//     name: 'auth',
//     initialState,
//     reducers: {
//       // Định nghĩa reducer cho logout
//       logout: (state) => {
//         state.userInfo = null;
//         state.userToken = null;
//         localStorage.removeItem('userInfo'); // Xóa userInfo khỏi localStorage
//         localStorage.removeItem('userToken'); // Xóa userToken khỏi localStorage
//       },
//     },
//     extraReducers: (builder) => {
//       builder
//         .addCase(userLogin.pending, (state) => {
//           state.loading = true;
//           state.error = null;
//           state.success = false;
//         })
//         .addCase(userLogin.fulfilled, (state, { payload }) => {
//           state.loading = false;
//           state.userInfo = payload.userInfo; // Đảm bảo payload có userInfo
//           state.userToken = payload.userToken; // Đảm bảo này tồn tại trong payload
//           state.success = true; 
//         })
//         .addCase(userLogin.rejected, (state, { payload }) => {
//           state.loading = false;
//           state.error = payload;
//           state.success = false; // Xử lý payload lỗi
//         });
//     },
//   });
  
//   export const { logout } = authSlice.actions; // Xuất action logout
//   export default authSlice.reducer; // Xuất reducer
  