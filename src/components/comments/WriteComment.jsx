import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetCommentsQuery, useAddCommentMutation } from '../../redux/commentsSlice'; // Import both hooks
import { Button, TextField, Box, Typography, Paper, CircularProgress, Divider } from '@mui/material';
import Swal from 'sweetalert2';

const CommentSection = ({ songId }) => {
  const { data: comments, isLoading, error } = useGetCommentsQuery();  // Fetch comments from RTK Query
  const { token } = useSelector((state) => state.auth);

  const [content, setContent] = useState('');
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState('');
  const storedUsername = localStorage.getItem('userName');
  const storedUserId = localStorage.getItem('userId');
  const storedRole = localStorage.getItem('userRole');
  // Load user details from localStorage
  useEffect(() => {
   

    if (storedUsername) {
      setUsername(storedUsername);
      setUserId(storedUserId);
      setRole(storedRole);
    }
  }, []);

  // Use the mutation hook to add a comment
  const [addComment] = useAddCommentMutation();

  // Handle submitting a comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!storedUserId) {
      Swal.fire({
        title: 'Bạn chưa đăng nhập!',
        text: 'Vui lòng đăng nhập để gửi bình luận.',
        icon: 'warning',
        confirmButtonText: 'Đăng nhập',
        showCancelButton: true,
        cancelButtonText: 'Hủy',
      }).then((result) => {
        if (result.isConfirmed) {
          // Chuyển hướng sang trang đăng nhập
          window.location.href = '/login'; // Thay '/login' bằng URL của trang đăng nhập của bạn
        }
      });
      return;
    }
    if (content.trim() && token) {
      const mentionPattern = /@([a-zA-Z0-9_]+)/g;
      const mentions = content.match(mentionPattern) || [];

      if (mentions.length > 0 && role !== 'admin') {
        const invalidMentions = mentions.filter((mention) => mention !== '@admin');
        if (invalidMentions.length > 0) {
          Swal.fire({
            title: 'Không hợp lệ!',
            text: 'Bạn chỉ có thể tag @admin.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
          return;
        }
      }

      try {
        // Dispatch action to add comment using the RTK Query hook
        await addComment({ songId, userId, content }).unwrap();
        setContent(''); // Reset input after submit
      } catch (err) {
        console.error('Failed to add comment: ', err);
      }
    }
  };

  // Loading and error handling
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center">
        An error occurred while fetching comments: {error.message}
      </Typography>
    );
  }

  return (
    <Box>
      {/* Comment input form */}
      <Paper sx={{ padding: 3, maxWidth: 600, margin: 'auto', marginBottom: 2 }}>
        <Typography variant="h6" gutterBottom>
          <i className="fas fa-comments"></i> Nhập bình luận
        </Typography>
        <form onSubmit={handleCommentSubmit}>
          <Box mb={2}>
            <Typography variant="body2" color="textSecondary">
              Tên bạn: <strong>{username}</strong>
            </Typography>
          </Box>
          <Box mb={2}>
            <TextField
              label="@admin để gửi thông báo"
              variant="outlined"
              multiline
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Hãy cho tôi biết suy nghĩ của bạn về bài hát nhé !"
              fullWidth
              required
            />
          </Box>

          <Box display="flex" justifyContent="flex-start" gap={2}>
            <Button type="submit" variant="contained" color="primary" size="small" onClick={handleCommentSubmit}>
              Gửi
            </Button>
            
          </Box>
        </form>
      </Paper>

      {/* Displaying comments */}
      {comments
        .filter((comment) => comment.songId === songId)
        .map((comment) => (
          <Paper key={comment._id} elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
            <Typography variant="h6" color="primary">
              {comment.userId.username}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 1 }}>
              {comment.content}
            </Typography>
            <Divider />
          </Paper>
        ))}
    </Box>
  );
};

export default CommentSection;
