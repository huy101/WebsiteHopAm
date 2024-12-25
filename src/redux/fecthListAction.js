      // redux/slices/songSlice.js
      import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
      import axios from 'axios';
      export const fetchAllSongs = createAsyncThunk(
        'songs/fetchAllSongs',
        async (_, { rejectWithValue }) => {
          try {
            const response = await axios.get('http://localhost:8080/list/all'); // Sử dụng endpoint lấy tất cả bài hát
            return response.data; // Trả về danh sách bài hát
          } catch (error) {
            return rejectWithValue(error.response?.data || error.message); // Xử lý lỗi
          }
        }
      );
      export const fetchPopularSongs = createAsyncThunk(
        'songs/fetchPopularSongs',
        async (_, { rejectWithValue }) => {
          try {
            const response = await axios.get('http://localhost:8080/list/popular'); // Adjust endpoint to match your API
            return response.data; // Returns popular songs
          } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
          }
        }
      );
      
      export const fetchPending = createAsyncThunk(
        'songs/fetchPending',
        async (_, { rejectWithValue }) => {
          try {
            const response = await axios.get('http://localhost:8080/list/pending'); // Sử dụng endpoint lấy tất cả bài hát
            return response.data; // Trả về danh sách bài hát
          } catch (error) {
            return rejectWithValue(error.response?.data || error.message); // Xử lý lỗi
          }
        }
      );
      // Async thunk để lấy tất cả bài hát của người dùng với status true
export const fetchUserSongs = createAsyncThunk(
  'songs/fetchUserSongs',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:8080/list/user/${userId}/posted`);
      return response.data; // Trả về danh sách bài hát của người dùng
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message); // Xử lý lỗi
    }
  }
);
      // Async thunk để fetch danh sách bài hát theo thể loại
      export const fetchSongsByGenre = createAsyncThunk(
        'songs/fetchSongsByGenre',
        async (genreId, { rejectWithValue }) => {
          try {
            const response = await axios.get(`http://localhost:8080/list/genre/${genreId}`);
            return response.data; // Trả về danh sách bài hát
          } catch (error) {
            return rejectWithValue(error.response.data);
          }
        }
      );

      // Async thunk để fetch danh sách bài hát theo điệu
      export const fetchSongsByRhythm = createAsyncThunk(
        'songs/fetchSongsByRhythm',
        async (rhythmId, { rejectWithValue }) => {
          try {
            const response = await axios.get(`http://localhost:8080/list/rhythm/${rhythmId}`);
            return response.data; // Trả về danh sách bài hát
          } catch (error) {
            return rejectWithValue(error.response.data);
          }
        }
      );

      // Async thunk để fetch danh sách bài hát theo tên tác giả
      export const fetchSongsByArtist = createAsyncThunk(
        'songs/fetchSongsByartist',
        async (artistName, { rejectWithValue }) => {
          try {
            const response = await axios.get(`http://localhost:8080/list/artist/${artistName}`);
            return response.data; // Trả về danh sách bài hát
          } catch (error) {
            return rejectWithValue(error.response.data);
          }
        }
      );
      // Async thunk to perform search based on a query
      export const searchSongs = createAsyncThunk(
        'songs/searchSongs',
        async (query, { rejectWithValue }) => {
          try {
            const response = await axios.get(`http://localhost:8080/list/search/${encodeURIComponent(query)}`);

            return response.data; // Returns the list of songs that match the query
          } catch (error) {
            return rejectWithValue('Failed to fetch songs');
          }
        }
      );
      // Async thunk để fetch danh sách bài hát mới đăng trong vòng 1 tuần
  export const fetchRecentSongs = createAsyncThunk(
    'songs/fetchRecentSongs',
    async (_, { rejectWithValue }) => {
      try {
        const response = await axios.get(`http://localhost:8080/list/recent`);
        return response.data; // Trả về danh sách bài hát mới
      } catch (error) {
        return rejectWithValue(error.response ? error.response.data : 'Failed to fetch recent songs');
      }
    }
  );
  // Thunk to edit a song
export const updateSong = createAsyncThunk(
  'songs/updateSong',
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`http://localhost:8080/song/update/${id}`, updatedData); // Replace with your API endpoint
      return response.data; // Return the updated song data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const deleteSong = createAsyncThunk(
  'songs/deleteSong',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`http://localhost:8080/song/delete/${id}`); // Replace with your delete API endpoint
      return response.data; // Return the result of the deletion, if any
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);



      const songSlice = createSlice({
        name: 'songs',
        initialState: {
          songs: [],
          popular: [],
          searchSongs:[],
          recent: [],
          loading: false,
          error: null,
        },
        reducers: {},
        extraReducers: (builder) => {
          builder
            .addCase(fetchSongsByGenre.pending, (state) => {
              state.loading = true;
              state.error = null;
            })
            .addCase(fetchSongsByGenre.fulfilled, (state, { payload }) => {
              state.loading = false;
              state.songs = payload; // Lưu danh sách bài hát
            })
            .addCase(fetchSongsByGenre.rejected, (state, { payload }) => {
              state.loading = false;
              state.error = payload;
            })
            .addCase(fetchSongsByRhythm.pending, (state) => {
              state.loading = true;
              state.error = null;
            })
            .addCase(fetchSongsByRhythm.fulfilled, (state, { payload }) => {
              state.loading = false;
              state.songs = payload; // Lưu danh sách bài hát
            })
            .addCase(fetchSongsByRhythm.rejected, (state, { payload }) => {
              state.loading = false;
              state.error = payload;
            })
            .addCase(fetchSongsByArtist.pending, (state) => {
              state.loading = true;
              state.error = null;
            })
            .addCase(fetchSongsByArtist.fulfilled, (state, { payload }) => {
              state.loading = false;
              state.songs = payload; // Lưu danh sách bài hát
            })
            .addCase(fetchSongsByArtist.rejected, (state, { payload }) => {
              state.loading = false;
              state.error = payload;
            })
            .addCase(searchSongs.pending, (state) => {
              state.loading = true;
              state.error = null;
            })
            .addCase(searchSongs.fulfilled, (state, { payload }) => {
              state.loading = false;
              state.searchSongs = payload; // Lưu danh sách bài hát tìm kiếm
            })
            .addCase(searchSongs.rejected, (state, { payload }) => {
              state.loading = false;
              state.error = payload;
            })
            .addCase(fetchRecentSongs.pending, (state) => {
              state.loading = true;
              state.error = null;
            })
            .addCase(fetchRecentSongs.fulfilled, (state, { payload }) => {
              state.loading = false;
              state.recent = payload; // Lưu danh sách bài hát mới
            })
            .addCase(fetchRecentSongs.rejected, (state, { payload }) => {
              state.loading = false;
              state.error = payload;
            })
            .addCase(fetchAllSongs.pending, (state) => {
              state.loading = true;
            })
            .addCase(fetchAllSongs.fulfilled, (state, action) => {
              state.loading = false;
              state.songs = action.payload;
            })
            .addCase(fetchAllSongs.rejected, (state, action) => {
              state.loading = false;
              state.error = action.error.message;
            })
            .addCase(fetchPending.pending, (state) => {
              state.loading = true;
            })
            .addCase(fetchPending.fulfilled, (state, action) => {
              state.loading = false;
              state.songs = action.payload;
            })
            .addCase(fetchPending.rejected, (state, action) => {
              state.loading = false;
              state.error = action.error.message;
            })
            .addCase(updateSong.pending, (state) => {
              state.loading = true;
              state.error = null;
            })
            .addCase(updateSong.fulfilled, (state, { payload }) => {
              state.loading = false;
              const index = state.songs.findIndex((song) => song.id === payload.id);
              if (index !== -1) {
                state.songs[index] = payload; // Update the song in the state
              }
            })
            .addCase(updateSong.rejected, (state, { payload }) => {
              state.loading = false;
              state.error = payload;
            })
            .addCase(deleteSong.pending, (state) => {
              state.loading = true;
              state.error = null;
            })
            .addCase(deleteSong.fulfilled, (state, action) => {
              state.loading = false;
              state.songs = state.songs.filter((song) => song._id !== action.meta.arg); // Remove deleted song
            })
            .addCase(deleteSong.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload;
            })
            .addCase(fetchUserSongs.pending, (state) => {
              state.loading = true;
              state.error = null;
            })
            .addCase(fetchUserSongs.fulfilled, (state, { payload }) => {
              state.loading = false;
              state.songs = payload; // Lưu danh sách bài hát của người dùng
            })
            .addCase(fetchUserSongs.rejected, (state, { payload }) => {
              state.loading = false;
              state.error = payload; // Xử lý lỗi nếu có
            })
            .addCase(fetchPopularSongs.pending, (state) => {
              state.loading = true;
              state.error = null;
            })
            .addCase(fetchPopularSongs.fulfilled, (state, { payload }) => {
              state.loading = false;
              state.popular = payload; // Save the popular songs
            })
            .addCase(fetchPopularSongs.rejected, (state, { payload }) => {
              state.loading = false;
              state.error = payload; // Handle error
            });

        }
      });

      export default songSlice.reducer;
