// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// // Async thunk for user registration
// export const registerUser = createAsyncThunk(
//   "user/register",
//   async (newUser, thunkAPI) => {
//     try {
//       const config = {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       };

//       const body = JSON.stringify(newUser);
//       const { data } = await axios.post('http://localhost:8080/api/users', body, config);
//       console.log(data);
//       localStorage.setItem("token", JSON.stringify(data)); // Save token in local storage
//       return data;
//     } catch (error) {
//       console.error(error.response?.data);
//       return thunkAPI.rejectWithValue(error.response?.data || "Registration failed");
//     }
//   }
// );

// // Async thunk for verifying the token
// export const verifyToken = createAsyncThunk(
//   "user/verifyToken",
//   async (token, thunkAPI) => {
//     try {
//       const { data } = await axios.get('http://localhost:3000/api/users/verify', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return data;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.response?.data || "Token verification failed");
//     }
//   }
// );

// // Initial state of the user slice
// const initialState = {
//   token: localStorage.getItem('token') || null,
//   loading: false,
//   user: null,
//   error: null,
// };

// // User slice definition
// export const userSlice = createSlice({
//   name: 'user',
//   initialState,
//   reducers: {
//     logout: (state) => {
//       state.token = null;
//       state.user = null;
//       localStorage.removeItem("token"); // Clear token from local storage
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(registerUser.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(registerUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.token = action.payload; // Store the received token
//       })
//       .addCase(registerUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload; // Store the error response
//       })
//       .addCase(verifyToken.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(verifyToken.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload; // Store the verified user information
//       })
//       .addCase(verifyToken.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload; // Store the error response
//       });
//   },
// });

// // Action creators are generated for each case reducer function
// export const { logout } = userSlice.actions;

// // Export the reducer
// export default userSlice.reducer;
