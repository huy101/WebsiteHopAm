import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
} from '@mui/material';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RequestSongForm from '../requestSong/RequestSongForm';
import RequestSongList from '../RequestSongList/RequestSongList';
import { fetchPopularSongs } from '../../redux/fecthListAction';

const PopularSongs = () => {
  const [openRequestForm, setOpenRequestForm] = useState(false);
  const [displayCount, setDisplayCount] = useState(5);
  
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(fetchPopularSongs());
  }, []);
  
  const handleOpenRequestForm = () => {
    setOpenRequestForm(true);
  };
  
  const handleCloseRequestForm = () => {
    setOpenRequestForm(false);
  };
  
  const handleViewMore = () => {
    setDisplayCount(prevCount => prevCount + 5);
  };
  
  const popularSongs = useSelector((state) => state.list.popular);
  
  return (
    <Box sx={{ width: '400px' }}>
      <Paper elevation={2} sx={{ p: 2, borderRadius: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <MusicNoteIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" fontWeight="600">
            Bài hát phổ biến trong tháng
          </Typography>
        </Box>
        
        {popularSongs.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {popularSongs.slice(0, displayCount).map((song, index) => (
              <Link
                to={`/chord/${song._id}`}
                key={song._id}
                style={{ textDecoration: 'none' }}
              >
                <Paper
                  sx={{
                    p: 1.5,
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <Typography variant="body2" color="text.primary">
                    {index + 1}. {song.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {song.artist.map((artist) => artist.name).join(', ')}
                  </Typography>
                </Paper>
              </Link>
            ))}
            
            {popularSongs.length > displayCount && (
              <Button
                variant="text"
                onClick={handleViewMore}
                startIcon={<ExpandMoreIcon />}
                sx={{ mt: 1, textTransform: 'none' }}
              >
                Xem thêm
              </Button>
            )}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Không có bài hát nào phổ biến
          </Typography>
        )}
        
        <Button
          variant="contained"
          fullWidth
          startIcon={<QueueMusicIcon />}
          onClick={handleOpenRequestForm}
          sx={{ mt: 2, textTransform: 'none' }}
        >
          Yêu cầu hợp âm bài hát
        </Button>
        
        <Box sx={{ mt: 2 }}>
          <RequestSongList />
        </Box>
      </Paper>
      
      <Dialog
        open={openRequestForm}
        onClose={handleCloseRequestForm}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent>
          <RequestSongForm />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRequestForm}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PopularSongs;