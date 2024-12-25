import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserSongs } from '../../redux/fecthListAction'; 
import NavbarTop from '../Navbar/Navbar';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Grid, Pagination } from '@mui/material';

const PostedSongs = () => {
  const [username, setUsername] = useState('');
  const dispatch = useDispatch();
  const songs = useSelector((state) => state.list.songs); // Assuming 'songs' slice is used for posted songs
  const userId = localStorage.getItem('userId');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(0);
  const [songsPerPage, setSongsPerPage] = useState(5);

  const indexOfLastSong = (currentPage + 1) * songsPerPage;
  const indexOfFirstSong = indexOfLastSong - songsPerPage;
  const currentSongs = songs.slice(indexOfFirstSong, indexOfLastSong);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem('userName');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserSongs(userId)); // This would be an action that fetches posted songs for the logged-in user
    }
  }, [dispatch, userId]);

  // If songs are undefined or empty
  if (!songs) {
    return <CircularProgress />;
  }

  return (
    <>
      <div className="top">
        <NavbarTop />
      </div>
      <Box className="container pt-3">
        <Grid container spacing={3}>
          {/* Left Section - Posted Songs List */}
          <Grid item xs={12} md={8}>
            <Box className="ct-box">
              <Typography variant="h6">Danh sách bài hát đã đăng</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Tên bài hát</TableCell>
                      <TableCell>Tác giả</TableCell>
                      <TableCell>Xem</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentSongs.map((song) => (
                      <TableRow key={song._id}>
                        <TableCell>
                          <Typography variant="body1">
                            <a href={`/chord/${song._id}`} style={{ textDecoration: 'none' }}>{song.title}</a>
                          </Typography>
                        </TableCell>
                        <TableCell>{song.artist}</TableCell>
                        <TableCell>227727</TableCell> {/* Replace with actual view count if available */}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Grid>

          {/* Right Section - User Info */}
          <Grid item xs={12} md={4}>
            <Box className="ct-box">
              <Typography variant="h6"><strong>Thông tin cá nhân</strong></Typography>
              <Grid container spacing={2}>
                <Grid item>
                  <i className="fa fa-user fa-5x"></i>
                </Grid>
                <Grid item>
                  <Typography variant="body1">Xin chào <strong>{username}</strong></Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" my={2}>
        <Pagination 
          count={Math.ceil(songs.length / songsPerPage)} // Total number of pages
          variant="outlined" 
          color="primary" 
          onChange={(e, page) => paginate(page - 1)}  // Adjust for zero-based indexing
        />
      </Box>
    </>
  );
};

export default PostedSongs;
