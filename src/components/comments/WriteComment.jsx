import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetCommentsQuery, useAddCommentMutation } from '../../redux/commentsSlice';
import { Button, TextField, Box, Typography, Paper, CircularProgress, Divider } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Swal from 'sweetalert2';

const CommentSection = ({ songId }) => {
  const { data: comments, isLoading, error } = useGetCommentsQuery();
  const { token } = useSelector((state) => state.auth);
  const [displayCount, setDisplayCount] = useState(5);
  const [content, setContent] = useState('');
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState('');
  const storedUsername = localStorage.getItem('userName');
  const storedUserId = localStorage.getItem('userId');
  const storedRole = localStorage.getItem('userRole');

  useEffect(() => {
    if (storedUsername) {
      setUsername(storedUsername);
      setUserId(storedUserId);
      setRole(storedRole);
    }
  }, []);

  const [addComment] = useAddCommentMutation();

  const handleViewMore = () => {
    setDisplayCount(prevCount => prevCount + 5);
  };

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
        customClass: {
          confirmButton: 'custom-confirm-button', // Custom class for confirm button
        },
        willOpen: () => {
          const confirmButton = document.querySelector('.swal2-confirm');
          if (confirmButton) {
            confirmButton.style.backgroundColor = '#007bff'; // Custom background color
            confirmButton.style.color = 'white'; // Custom text color
            confirmButton.style.border = 'none'; // Remove border
          }
        },
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = '/login';
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
        await addComment({ songId, userId, content }).unwrap();
        setContent('');
      } catch (err) {
        console.error('Failed to add comment: ', err);
      }
    }
  };

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

  const filteredComments = comments.filter((comment) => comment.songId === songId);

  return (
    <Box>
      <Paper sx={{ padding: 3, maxWidth: 600, margin: 'auto' }}>
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
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              size="small" 
              onClick={handleCommentSubmit}
            >
              Gửi
            </Button>
          </Box>
        </form>
      </Paper>

      {/* Displaying comments with pagination */}
      {filteredComments.slice(0, displayCount).map((comment) => (
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

      {/* View More button */}
      {filteredComments.length > displayCount && (
        <Box display="flex" justifyContent="center" mt={2} mb={2}>
          <Button
            variant="text"
            onClick={handleViewMore}
            startIcon={<ExpandMoreIcon />}
            sx={{ textTransform: 'none' }}
          >
            Xem thêm bình luận
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CommentSection;