  import React, { useEffect, useState } from 'react';
  import { useDispatch, useSelector } from 'react-redux';
  import { fetchGenres } from '../../redux/genreSlice'; 
  import { fetchRhythms } from '../../redux/rhythmSlice'; 
  import addSong from '../../redux/addAction';
  import NavbarTop from '../Navbar/Navbar';
  import { useNavigate } from 'react-router-dom';
  import {
    Container,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Button,
    Typography,
    Box,
    Snackbar,
    Alert
  } from '@mui/material';
  import './addsong.css'
  const AddSong = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const genres = useSelector((state) => state.genres);
    const rhythms = useSelector((state) => state.rhythms);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedRhythm, setSelectedRhythm] = useState('');
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [tone, setTone] = useState('C'); 
    const [lyrics, setLyrics] = useState('');
    const userId = localStorage.getItem('userId');
    const [videoUrl, setVideoUrl] = useState(''); 
  const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
      if (!userId) {
        alert('Vui lòng đăng nhập để thêm bài hát.');
        navigate('/login'); 
      }
    }, [userId, navigate]);

    useEffect(() => {
      dispatch(fetchGenres());
      dispatch(fetchRhythms());
    }, [dispatch]);

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!title || !artist || !selectedGenre || !selectedRhythm || !lyrics) {
        setError('Vui lòng điền đầy đủ thông tin trước khi đăng bài.');
        return; // Ngừng thực hiện nếu thiếu thông tin
      }
      const videoId = extractVideoId(videoUrl); 
      const newSong = {
        title,
        artist,
        genre: selectedGenre,
        rhythm: selectedRhythm,
        tone,
        userId,
        videoId,
        lyrics: [
          {
            verse: lyrics,
            chords: extractChords(lyrics),
          },
        ],
      };
      dispatch(addSong(newSong)) // Dispatch action to add song
        .then(() => {
          setMessage('Bài hát đã được thêm thành công!');
          setError('');
        })
        .catch((error) => {
          setError('Có lỗi xảy ra khi thêm bài hát.');
          setMessage('');
        });
    };

    const extractVideoId = (url) => {
      const regex = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|.*[&?]v=))([\w\-]{11})/;
      const match = url.match(regex);
      return match ? match[1] : null;
    };

    const extractChords = (lyrics) => {
      const regex = /\[(.*?)\]/g;
      let matches = [];
      let match;
      while ((match = regex.exec(lyrics)) !== null) {
        matches.push(match[1]);
      }
      return matches;
    };

    return (
      <>
      
        <Container maxWidth="md" sx={{  display: 'flex', flexDirection: 'row' }}>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: 900 }}>
            {/* Song Title */}
            <TextField
              fullWidth
              label="Tên bài hát"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              margin="normal"
              sx={{
                marginBottom: '16px', // Add margin below the input field
                '& .MuiInputLabel-root': {
                  color: 'gray', // Change label color
                },
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px', // Rounded corners for the input box
                  '& fieldset': {
                    borderColor: '#B0B0B0', // Border color
                  },
                  '&:hover fieldset': {
                    borderColor: 'black', // Change border color on hover
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1976d2', // Change border color when focused
                  },
                },
              }}
            />
            {/* Artist */}
            <TextField
              fullWidth
              label="Ca sĩ"
              variant="outlined"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              margin="normal"
              sx={{
                marginBottom: '16px', // Add margin below the input field
                '& .MuiInputLabel-root': {
                  color: 'gray', // Change label color
                },
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px', // Rounded corners for the input box
                  '& fieldset': {
                    borderColor: '#B0B0B0', // Border color
                  },
                  '&:hover fieldset': {
                    borderColor: 'black', // Change border color on hover
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1976d2', // Change border color when focused
                  },
                },
              }}
            />
            {/* Genre Selection */}
            <FormControl fullWidth margin="normal">
              <InputLabel>Thể loại</InputLabel>
              <Select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                required
              >
                <MenuItem value="">
                  <em>Chọn thể loại</em>
                </MenuItem>
                {genres.map((genre) => (
                  <MenuItem key={genre._id} value={genre._id}>
                    {genre.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* Rhythm Selection */}
            <FormControl fullWidth margin="normal">
              <InputLabel>Điệu nhạc</InputLabel>
              <Select
                value={selectedRhythm}
                onChange={(e) => setSelectedRhythm(e.target.value)}
                required
              >
                <MenuItem value="">
                  <em>Chọn điệu nhạc</em>
                </MenuItem>
                {rhythms.map((rhythm) => (
                  <MenuItem key={rhythm._id} value={rhythm._id}>
                    {rhythm.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* Tone Selection */}
            <FormControl fullWidth margin="normal">
              <InputLabel>Tone chủ bài hát</InputLabel>
              <Select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
              >
                {["C", "D", "E", "F", "G", "A", "B", "Cm", "Dm", "Em", "Fm", "Gm", "Am", "Bm"].map(
                  (toneOption) => (
                    <MenuItem key={toneOption} value={toneOption}>
                      {toneOption}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>
            {/* Video URL */}
            <TextField
              fullWidth
              label="YouTube Video URL"
              variant="outlined"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              margin="normal"
              sx={{
                marginBottom: '16px', // Add margin below the input field
                '& .MuiInputLabel-root': {
                  color: 'gray', // Change label color
                },
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px', // Rounded corners for the input box
                  '& fieldset': {
                    borderColor: '#B0B0B0', // Border color
                  },
                  '&:hover fieldset': {
                    borderColor: 'black', // Change border color on hover
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1976d2', // Change border color when focused
                  },
                },
              }}
            />
            {/* Lyrics */}
            <TextField
              fullWidth
              label="Lời và hợp âm"
              variant="outlined"
              multiline
              rows={15}
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              required
              margin="normal"
              helperText="Hợp âm phải bỏ trong dấu ngoặc vuông []. Thông tin ca sĩ thể hiện và link bài hát để ở dưới cùng."
              sx={{
                '& .MuiInputLabel-root': {
                  color: 'gray', // Change label color
                },
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px', // Rounded corners for the input box
                  '& fieldset': {
                    borderColor: '#B0B0B0', // Border color
                  },
                  '&:hover fieldset': {
                    borderColor: 'black', // Change border color on hover
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1976d2', // Change border color when focused
                  },
                },
              }}
            />
                {message && (
                  <Alert severity="success" sx={{ margin: '0px' }}>
                    {message}
                  </Alert>
                )}
                {error && (
                  <Alert severity="error" sx={{ margin: '0px'  }}>
                    {error}
                  </Alert>
                )}
            {/* Submit Button */}
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ }}>
              Đăng bài
            </Button>
          </Box>
        </Container>

        {/* Snackbar for notifications */}
    
      </>
    );
  };

  export default AddSong;
