import React, { useState } from "react";
import { Box, Button, TextField, Typography, Alert } from "@mui/material";
import { useDispatch } from "react-redux";
import { requestSong } from "../../redux/requestSongSlice";
import './form.css';

const RequestSongForm = () => {
  // Các state riêng biệt cho từng trường trong form
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");  // artist as a string
  const [lyrics, setLyrics] = useState(""); 
  const [videoId, setVideoId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  // Hàm trích xuất videoId từ link YouTube
  const extractVideoId = (url) => {
    const regex = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|.*[&?]v=))([\w\-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const videoIdExtracted = extractVideoId(videoId);
    if (!videoIdExtracted) {
      setError("Đường link YouTube không hợp lệ.");
      return;
    }

    // Tạo mảng artist từ input (người dùng nhập nhiều nghệ sĩ cách nhau bằng dấu phẩy)
    const artistArray = artist ? artist.split(',').map(artist => artist.trim()) : [];
    
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("Người dùng chưa đăng nhập.");
      return;
    }

    try {
      const response = await dispatch(
        requestSong({
          title,
          artist: artistArray,  // Gửi mảng artist
          lyrics: [{ verse: lyrics }], // Gửi lyrics dưới dạng một mảng với đối tượng verse
          videoId: videoIdExtracted,
          userId,
        })
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

  const handleArtistChange = (e) => {
    setArtist(e.target.value); // Cập nhật artist dưới dạng string
  };

  return (
    <Box sx={{ height: "500px", width: "500px" }}>
      <Typography variant="h5" align="center" gutterBottom>
        Yêu cầu bài hát
      </Typography>
      <form onSubmit={handleSubmit} onBlur={handleBlur}>
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Tiêu đề bài hát"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Box>

        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Nghệ sĩ"
            value={artist}  // Hiển thị artist như một chuỗi
            onChange={handleArtistChange}
            required
          />
        </Box>

        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Lời bài hát"
            multiline
            rows={4}
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
            required
          />
        </Box>

        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Link bài hát"
            type="url"
            value={videoId}
            onChange={(e) => setVideoId(e.target.value)}
          />
        </Box>

        {message && (
          <Alert severity="success" sx={{ mt: 1, mb: 0 }}>
            {message}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 1, mb: 0 }}>
            {error}
          </Alert>
        )}

        <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }}>
          Gửi yêu cầu
        </Button>
      </form>
    </Box>
  );
};

export default RequestSongForm;
