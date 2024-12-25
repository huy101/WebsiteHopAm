import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

// Function to set authentication token in headers
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Async thunk for user registration
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (newUser, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:8080/api/users', newUser, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again later.';
      return rejectWithValue(errorMessage);
    }
  }
);
// Async thunk for forgot password
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:8080/users/forgot-password', { email });
      return response.data; // Giả sử backend trả về thông báo
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send password reset email.';
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for user login
export const userLogin = createAsyncThunk(
  'auth/userLogin',
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('http://localhost:8080/login', userData);
      const decodedToken = jwtDecode(data.token); // Decode the token

      localStorage.setItem('jwtToken', data.token);
      localStorage.setItem('userName', decodedToken.name);
      localStorage.setItem('userId', decodedToken._id);
      localStorage.setItem('userRole', decodedToken.role); // Store user role
      setAuthToken(data.token);

      return { user: decodedToken, token: data.token }; // Return user data and token
    } catch (error) {
      return rejectWithValue(error.response?.data.message || 'Login failed');
    }
  }
);

// Async thunk for token verification
export const verifyToken = createAsyncThunk(
  'auth/verifyToken',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('jwtToken');
      const { data } = await axios.get('http://localhost:8080/api/users/verify', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data.message || 'Token verification failed');
    }
  }
);

// Initial state
const initialState = {
  loading: false,
  user: null,
  token: localStorage.getItem('jwtToken') || null,
  error: null,
  message: null,
  role: localStorage.getItem('userRole') || null, // Store role from localStorage
};

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.role = null; // Clear role
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('userName');
      localStorage.removeItem('userRole'); // Remove role from localStorage
      localStorage.removeItem('userId'); // Remove role from localStorage
      setAuthToken(null);
    },
    resetMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register User
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user; // Store user data from response
        state.message = payload.message; // Store the message from response
      })
      .addCase(registerUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      // User Login
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userLogin.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.token = payload.token;
        state.user = payload.user;
        state.role = payload.user.role; // Store role from token
      })
      .addCase(userLogin.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      // Verify Token
      .addCase(verifyToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyToken.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload;
        state.role = payload.role; // Update role if needed
      })
      .addCase(verifyToken.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
        state.token = null;
        state.role = null;
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole'); // Remove role if token is invalid
      })
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(forgotPassword.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.message = payload.message; // Store the success message
      })
      .addCase(forgotPassword.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload; // Store the error message
      });
  },
});

// Export actions and reducer
export const { logout, resetMessage } = authSlice.actions;
export default authSlice.reducer;
