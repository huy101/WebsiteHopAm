// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchComments } from '../../redux/commentsSlice';
// import { Typography, CircularProgress, Box, Paper, Divider } from '@mui/material';

// const ListComments = ({ songId }) => {
//   const dispatch = useDispatch();
//   const { comments, loading, error } = useSelector((state) => state.comment);
//   const [username, setUsername] = useState('');
//   const storedUsername = localStorage.getItem('userName');

//   useEffect(() => {
//     if (storedUsername) {
//       setUsername(storedUsername);
//     }

//     dispatch(fetchComments()); // Fetch comments when component mounts
//   }, [dispatch]);

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" height="100px">
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Typography color="error" align="center">
//         An error occurred while fetching comments: {error.message}
//       </Typography>
//     );
//   }

//   return (
//     <Box>
//       {comments
//         .filter((comment) => comment.songId === songId)
//         .map((comment) => (
//           <Paper key={comment._id} elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
//             <Typography variant="h6" color="primary">
//               {comment.userId.username}
//             </Typography>
//             <Typography variant="body1" sx={{ marginBottom: 1 }}>
//               {comment.content}
//             </Typography>
//             <Divider />
//           </Paper>
//         ))}
//     </Box>
//   );
// };

// export default ListComments;
