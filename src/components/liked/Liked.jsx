import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFavoriteSongs } from '../../redux/favoriteSlice';
import { fetchUserSongs } from '../../redux/fecthListAction';
import NavbarTop from '../Navbar/Navbar';
import Footer from '../Home/Footer';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Grid,
  Pagination,
  Avatar,
  IconButton,
  Tabs,
  Tab,

} from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import {
  Favorite,
  PlayArrow,
  MoreVert,
  History,
  QueueMusic,
  Star,
  Upload,
} from '@mui/icons-material';

// TabPanel component remains the same

const SongTable = ({ songs, type, currentPage, songsPerPage, onPageChange }) => {
  const indexOfLastSong = (currentPage + 1) * songsPerPage;
  const indexOfFirstSong = indexOfLastSong - songsPerPage;
  const currentSongs = songs.slice(indexOfFirstSong, indexOfLastSong);
  
  return (
    <Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ 
                fontWeight: 600,
                backgroundColor: '#f8fafc',
                color: '#64748b',
                fontSize: '0.875rem',
                padding: 2
              }}>#</TableCell>
              <TableCell sx={{ 
                fontWeight: 600,
                backgroundColor: '#f8fafc',
                color: '#64748b',
                fontSize: '0.875rem',
                padding: 2
              }}>Tên bài hát</TableCell>
              <TableCell sx={{ 
                fontWeight: 600,
                backgroundColor: '#f8fafc',
                color: '#64748b',
                fontSize: '0.875rem',
                padding: 2
              }}>Nghệ sĩ</TableCell>
              <TableCell sx={{ 
                fontWeight: 600,
                backgroundColor: '#f8fafc',
                color: '#64748b',
                fontSize: '0.875rem',
                padding: 2
              }}>{type === 'history' ? 'Ngày nghe' : 'Lượt xem'}</TableCell>
              <TableCell sx={{ 
                fontWeight: 600,
                backgroundColor: '#f8fafc',
                color: '#64748b',
                fontSize: '0.875rem',
                padding: 2
              }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentSongs.map((song, index) => (
              <TableRow 
                key={song._id}
                sx={{ 
                  '&:hover': { 
                    backgroundColor: '#f8fafc',
                    '& .play-button': {
                      opacity: 1
                    }
                  }
                }}
              >
                <TableCell sx={{ padding: 2, width: '48px' }}>
                  <Box sx={{ 
                    position: 'relative',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Typography sx={{ 
                      color: '#94a3b8',
                      fontSize: '0.875rem'
                    }}>
                      {indexOfFirstSong + index + 1}
                    </Typography>
                    <IconButton 
                      className="play-button"
                      sx={{ 
                        position: 'absolute',
                        opacity: 0,
                        transition: 'opacity 0.2s',
                        padding: 0,
                        color: '#3b82f6'
                      }}
                    >
                      <PlayArrow fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell sx={{ padding: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography 
                      component="a" 
                      href={`/chord/${song._id}`}
                      sx={{
                        textDecoration: 'none',
                        color: '#1e293b',
                        fontWeight: 500,
                        '&:hover': {
                          color: '#3b82f6'
                        }
                      }}
                    >
                      {song.title}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ 
                  padding: 2,
                  color: '#64748b'
                }}>
                  {song.artist.map((artist) => artist.name).join(', ')}
                </TableCell>
                <TableCell sx={{ 
                  padding: 2,
                  color: '#64748b',
                  fontSize: '0.875rem'
                }}>
                  {type === 'history' ? song.lastPlayed : song.viewCount}
                </TableCell>
                <TableCell sx={{ padding: 2, width: '48px' }}>
                  <IconButton size="small">
                    <MoreVert sx={{ color: '#94a3b8' }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Pagination 
          count={Math.ceil(songs.length / songsPerPage)}
          page={currentPage + 1}
          onChange={(e, page) => onPageChange(page - 1)}
          color="primary"
        />
      </Box>
    </Box>
  );
};

const Liked = () => {
  const [username, setUsername] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [songsPerPage] = useState(5);
  
  const dispatch = useDispatch();
  const favoriteSongs = useSelector((state) => state.favorites.favoriteSongs);
  const postedSongs = useSelector((state) => state.list.songs);
  const userId = localStorage.getItem('userId');

  const recentlyPlayed = favoriteSongs?.slice(0, 5) || [];
  const playlists = favoriteSongs?.slice(0, 3) || [];

  useEffect(() => {
    const storedUsername = localStorage.getItem('userName');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      
      dispatch(fetchFavoriteSongs(userId));
    
      dispatch(fetchUserSongs(userId));
     
    }
  }, [dispatch, userId, tabValue]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setCurrentPage(0);
  };

  if (!favoriteSongs || !postedSongs) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        bgcolor: '#f8fafc'
      }}>
        <CircularProgress sx={{ color: '#3b82f6' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      bgcolor: '#f8fafc'
    }}>
      <NavbarTop />
      
      <Box sx={{ 
        flex: 1,
        padding: { xs: 2, md: 4 },
        maxWidth: '1400px',
        margin: '0 auto',
        width: '100%'
      }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ 
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
              bgcolor: '#ffffff'
            }}>
                <TabContext value={tabValue}>
  <Tabs 
    value={tabValue} 
    onChange={handleTabChange}
    sx={{
      borderBottom: 1,
      borderColor: 'divider',
      px: 2,
      '& .MuiTab-root': {
        textTransform: 'none',
        minHeight: 64,
      }
    }}
  >
    <Tab 
      icon={<Favorite />} 
      label="Yêu thích" 
      iconPosition="start"
      sx={{ gap: 1 }}
    />
    <Tab 
      icon={<Upload />} 
      label="Đã đăng" 
      iconPosition="start"
      sx={{ gap: 1 }}
    />
  </Tabs>

  {tabValue === 0 && (
    <SongTable 
      songs={favoriteSongs} 
      type="favorites"
      currentPage={currentPage}
      songsPerPage={songsPerPage}
      onPageChange={setCurrentPage}
    />
  )}

  {tabValue === 1 && (
    <SongTable 
      songs={postedSongs} 
      type="posted"
      currentPage={currentPage}
      songsPerPage={songsPerPage}
      onPageChange={setCurrentPage}
    />
  )}
</TabContext>


            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ 
              padding: 4,
              borderRadius: 3,
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
              bgcolor: '#ffffff'
            }}>
              <Typography variant="h6" sx={{ 
                marginBottom: 3,
                fontWeight: 700,
                color: '#1e293b',
                letterSpacing: '-0.01em'
              }}>
                Thông tin cá nhân
              </Typography>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 3
              }}>
                <Avatar 
                  sx={{ 
                    width: 64, 
                    height: 64,
                    bgcolor: '#3b82f6'
                  }}
                >
                  {username.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="body1" sx={{ 
                    color: '#64748b',
                    marginBottom: 0.5
                  }}>
                    Xin chào
                  </Typography>
                  <Typography variant="h6" sx={{ 
                    color: '#1e293b',
                    fontWeight: 600
                  }}>
                    {username}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mt: 4 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f8fafc' }}>
                      <Typography variant="h4" color="primary" fontWeight="bold">
                        {favoriteSongs.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Bài hát yêu thích
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f8fafc' }}>
                      <Typography variant="h4" color="primary" fontWeight="bold">
                        {postedSongs.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Bài hát đã đăng
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </Box>
  );
};

export default Liked;