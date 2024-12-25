import React, { useState } from "react";
import { Box, Button, TextField, Typography, Alert } from "@mui/material";
import NavbarTop from "../Navbar/Navbar";
import { useDispatch } from "react-redux";
import { requestSong } from "../../redux/requestSongSlice";
import  './form.css';
const RequestSongForm = () => { const [lyrics, setLyrics] = useState('');
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    lyrics: [
      {
        verse: lyrics,
      },
    ],
    videoId: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  const extractVideoId = (url) => {
    const regex = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|.*[&?]v=))([\w\-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const videoId = extractVideoId(formData.videoId);
    if (!videoId) {
      setError("Đường link YouTube không hợp lệ.");
      return;
    }
  
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("Người dùng chưa đăng nhập.");
      return;
    }
  
    try {
      const response = await dispatch(
        requestSong({ ...formData, videoId, userId }) // Truyền userId vào đây
      ).unwrap();
      setMessage(response.message || "Yêu cầu đã được gửi thành công!");
      setError("");
    } catch (err) {
      setError(err?.message || "Số lượt yêu cầu trong ngày của bạn đã hết!");
      setMessage("");
    }
  };
  const handleBlur = () => {
    setMessage("");
    setError("");
  };

  return (
    <>
        <Box
        sx={{
        height: "450px",
        width: "500px",
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Yêu cầu bài hát
        </Typography>
        <form onSubmit={handleSubmit}  onBlur={handleBlur}>
          <Box  sx={{mt: 2,
                '& .MuiInputLabel-root': {
                  color: '#B0B0B0', // Change label color
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
              }}>
            <TextField
              fullWidth
              label="Tiêu đề bài hát"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Box>
          <Box sx={{mt: 2,
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
              }}>
            <TextField
              fullWidth
              label="Nghệ sĩ"
              name="artist"
              value={formData.artist}
              onChange={handleChange}
              required
            />
          </Box>
          <Box  sx={{mt: 2,
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
              }}>
            <TextField
              fullWidth
              label="Lời bài hát"
              name="lyrics"
              multiline
              rows={4}
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
            />
          </Box>
          <Box  sx={{ mt: 2,
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
              }}>
            <TextField
              fullWidth
              label="Link bài hát"
              name="videoId"
              type="url"
              value={formData.videoId}
              onChange={handleChange}
            />
          </Box>
          <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }}>
            Gửi yêu cầu
          </Button>
        </form>
        {message && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {message}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Box>
    </>
  );
};

export default RequestSongForm;
