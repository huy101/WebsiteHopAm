import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFavoriteSongs } from '../../redux/favoriteSlice';
import NavbarTop from '../Navbar/Navbar';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress, Grid, Pagination } from '@mui/material';

const Liked = () => {
  const [username, setUsername] = useState('');
  const dispatch = useDispatch();
  const favoriteSongs = useSelector((state) => state.favorites.favoriteSongs);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const storedUsername = localStorage.getItem('userName');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      dispatch(fetchFavoriteSongs(userId));
    }
  }, [dispatch, userId]);

  // If favoriteSongs is undefined or empty
  if (!favoriteSongs) {
    return <CircularProgress />;
  }

  return (
    <>
      <div className="top">
        <NavbarTop />
      </div>
      <Box className="container pt-3">
        <Grid container spacing={3}>
          {/* Left Section - Favorite Songs List */}
          <Grid item xs={12} md={8}>
            <Box className="ct-box">
              <Typography variant="h6">Danh sách bài hát yêu thích</Typography>
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
                    {favoriteSongs.map((song) => (
                      <TableRow key={song._id}>
                        <TableCell>
                          <Typography variant="body1">
                            <a href={`/chord/${song._id}`} style={{ textDecoration: 'none' }}>{song.title}</a>
                          </Typography>
                        </TableCell>
                        <TableCell>{song.artist}</TableCell>
                        <TableCell>227727</TableCell>
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
        <Pagination count={10} variant="outlined" color="primary" />
      </Box>
    </>
  );
}

export default Liked;
