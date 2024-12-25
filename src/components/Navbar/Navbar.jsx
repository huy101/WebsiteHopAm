import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGenres } from '../../redux/genreSlice';
import { fetchRhythms } from '../../redux/rhythmSlice';
import { logout } from '../../redux/authActions';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Divider, InputAdornment,Dialog, DialogActions, DialogContent, DialogTitle, } from '@mui/material';
import AddSong from '../AddNewSong/AddSong';
import MenuIcon from '@mui/icons-material/Menu';
import InboxIcon from '@mui/icons-material/Inbox';
import SearchIcon from '@mui/icons-material/Search';
import CategoryIcon from '@mui/icons-material/Category';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import Badge from '@mui/material/Badge'; 
import { useParams } from 'react-router-dom';
import {searchSongs} from '../../redux/fecthListAction';
import { setType } from '../../redux/types';  
import PersonIcon from '@mui/icons-material/Person';
import './Navbar.css';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useGetNotificationsQuery , useMarkAllAsReadMutation} from '../../redux/notificationSlice'
import ListSong from '../ListSong/ListSong';
 const NavbarTop = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const [genreAnchorEl, setGenreAnchorEl] = useState(null);
  const [rhythmAnchorEl, setRhythmAnchorEl] = useState(null);
  const [messageAnchorEl, setMessageAnchorEl] = useState(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const [openNotifications, setOpenNotifications] = useState(false);
  const { data, isLoading, error } = useGetNotificationsQuery(userId);
  const [openAddSongDialog, setOpenAddSongDialog] = useState(false);

const notifications = data?.notifications || [];
  const genres = useSelector((state) => state.genres);
  const rhythms = useSelector((state) => state.rhythms);
  const { user, token } = useSelector((state) => state.auth);
  const role = localStorage.getItem('userRole');
  const [markAllAsRead] = useMarkAllAsReadMutation(); 
  const [username, setUsername] = useState('');
  const notificationsCount = notifications.length; 
  const { query } = useParams();
  useEffect(() => {
    const storedUsername = localStorage.getItem('userName');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);


  const [anchorEl, setAnchorEl] = useState(null); // Trạng thái để mở menu thông báo

  const handleOpenAddSongDialog = () => {
    setOpenAddSongDialog(true);
  };
  
  const handleCloseAddSongDialog = () => {
    setOpenAddSongDialog(false);
  };
  

  const handleClickNotifications = (event) => {
    setAnchorEl(event.currentTarget);console.log(notifications)  // Open the notification menu
    
};

  const handleCloseNotifications = () => {
    setAnchorEl(null);  // Đóng menu khi nhấp ra ngoài
  };

  useEffect(() => {
    if (query) {
      dispatch(searchSongs(query));
      console.log("Searching for:", query);
    }
  }, [query, dispatch]);
  
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead(userId).unwrap(); // Gửi yêu cầu đánh dấu tất cả là đã đọc
      console.log('Tất cả thông báo đã được đánh dấu là đã đọc.');
    } catch (error) {
      console.error('Lỗi khi đánh dấu thông báo đã đọc:', error);
    }
  };
  useEffect(() => {
    dispatch(fetchGenres());
    dispatch(fetchRhythms());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Điều hướng tới ListSong với type "search" và truyền searchQuery
    navigate(`/list/search/${encodeURIComponent(searchQuery)}`);
    setSearchQuery(''); // Reset sau khi submit
  };

  const openGenreMenu = (event) => setGenreAnchorEl(event.currentTarget);
  const closeGenreMenu = () => setGenreAnchorEl(null);

  const openRhythmMenu = (event) => setRhythmAnchorEl(event.currentTarget);
  const closeRhythmMenu = () => setRhythmAnchorEl(null);

  const openMessageMenu = (event) => setMessageAnchorEl(event.currentTarget);
  const closeMessageMenu = () => setMessageAnchorEl(null);

  const openUserMenu = (event) => setUserMenuAnchorEl(event.currentTarget);
  const closeUserMenu = () => setUserMenuAnchorEl(null);

  const handleClickGenre = (genre) => {
    dispatch(setType({
      childTypeId: genre._id,
      type: "genre",
    }));
    navigate(`/list/genre/${genre._id}`);
  };

  const handleClickRhythm = (rhythm) => {
    dispatch(setType({
      childTypeId: rhythm._id,
      type: "rhythm",
    }));
    navigate(`/list/rhythm/${rhythm._id}`);
  };

  
  return (
    <AppBar position="static" className='MuiAppBar-root' sx={{display:'flex', justifyContent:'center'}}>
      <Toolbar>
        <Box display="flex" justifyContent='space-between' alignItems="center">
          <Typography variant="h6" component={Link} to="/">
            HOP AM GUITAR
          </Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <MenuItem onClick={openGenreMenu}>Thể loại</MenuItem>
          <Menu
            anchorEl={genreAnchorEl}
            open={Boolean(genreAnchorEl)}
            onClose={closeGenreMenu}
          >
            {genres.length > 0 ? (
              genres.map((genre) => (
                <MenuItem
                  key={genre._id}
                  onClick={() => {
                    navigate(`/list/genre/${genre._id}`);
                    closeGenreMenu();
                  }}
                >
                  {genre.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>Không có thể loại</MenuItem>
            )}
          </Menu>

          <MenuItem color='#495057' onClick={openRhythmMenu}>Điệu</MenuItem>
          <Menu
            anchorEl={rhythmAnchorEl}
            open={Boolean(rhythmAnchorEl)}
            onClose={closeRhythmMenu}
          >
            {rhythms.length > 0 ? (
              rhythms.map((rhythm) => (
                <MenuItem
                  key={rhythm._id}
                  onClick={() => {
                    navigate(`/list/rhythm/${rhythm._id}`);
                    closeRhythmMenu();
                  }}
                >
                  {rhythm.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>Không có điệu</MenuItem>
            )}
          </Menu>
        </Box>

        <Box component="form" onSubmit={handleSearchSubmit} display="flex" alignItems="center">
        <TextField
      size="small"
      placeholder="Nhập tên bài hát, tên ca sĩ"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      fullWidth
    />
          
         
        </Box>

        {token ? (
          <Box display="flex" alignItems="center">
            <IconButton onClick={openUserMenu} sx={{borderRadius:'0px'}}>
              <PersonIcon /> {username || "Tài khoản"}
            </IconButton>
            <Menu
              anchorEl={userMenuAnchorEl}
              open={Boolean(userMenuAnchorEl)}
              onClose={closeUserMenu}
            >
              <MenuItem component={Link} to="/posted">Bài hát tôi đã đăng</MenuItem>
              <MenuItem onClick={handleOpenAddSongDialog}>Thêm bài hát mới</MenuItem>
              <MenuItem component={Link} to="/liked">Bài hát yêu thích</MenuItem>
              {role === 'admin' && (
                <MenuItem component={Link} to="/admin">Quản lý</MenuItem>
              )}  
              <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
            </Menu>
            <IconButton onClick={handleClickNotifications}>
  <Badge badgeContent={notifications.filter(notification => !notification.isRead).length} color="error">
    <NotificationsIcon />
  </Badge>
</IconButton>

<Menu onClick={handleMarkAllAsRead}
  anchorEl={anchorEl}
  open={Boolean(anchorEl)}
  onClose={handleCloseNotifications}
  
  sx={{
    
    padding: 0,
    borderRadius: '30px',
    transform: 'translateX(-100px)',
    overflowY: 'hidden',
  }}
  PaperProps={{
    sx: {
      borderRadius: '10px',  // Áp dụng borderRadius cho Paper
      overflowY: 'auto',   // Ẩn thanh cuộn
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',  // Đảm bảo có shadow nhẹ cho menu
    },
  }}
><Typography variant="h5" sx={{padding: '8px 16px', color: '#495057', fontWeight: 500}}>Thông báo</Typography>
  {notifications.length > 0 ? (
    <>
    
      {notifications.map((notification) => (
       <MenuItem key={notification._id} sx={{
        padding: '8px 16px',
        borderBottom: '1px solid #dee2e6',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        fontSize: '14px',
        backgroundColor: '#f4f4f4',
        '&:hover': {
          backgroundColor: '#e8e8e8',
        } ,
        width: '100%', // Đảm bảo MenuItem chiếm đầy chiều rộng của phần tử chứa
        overflow: 'hidden', // Đảm bảo không có text overflow
        whiteSpace: 'normal',
      }}>
        <Typography variant="body2" sx={{
          fontWeight: 500, // Làm đậm thông báo chính
          fontSize: '14px', // Kích thước chữ nhỏ hơn
          color: '#333', // Màu sắc chữ đậm
          lineHeight: 1.5, // Để thông báo có khoảng cách thoáng
          wordBreak: 'break-word', // Đảm bảo chữ không bị tràn ra ngoài và ngắt từ khi cần thiết
    wordWrap: 'break-word',
        }}>
          <Link
            to={notification.songUrl}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            {notification.message}
          </Link>
        </Typography>
        <Typography variant="caption" color="textSecondary" sx={{
          fontSize: '12px', // Kích thước chữ nhỏ cho ngày
          marginTop: '4px', // Thêm khoảng cách giữa thông báo và ngày
        }}>
          {new Date(notification.createdAt).toLocaleString()}
        </Typography>
      </MenuItem>
      
      ))}
    </>
  ) : (
    <MenuItem disabled>Không có thông báo mới</MenuItem>
  )}
</Menu>
          </Box>
        ) : (
          <Box display="flex" color='#495057' gap="8px">
            <Button color='#495057'  component={Link} to="/login">Đăng nhập</Button>
            <Button color='#495057' component={Link} to="/register">Đăng ký</Button>
          </Box>
        )}
           

      </Toolbar>
      <Dialog open={openAddSongDialog} onClose={handleCloseAddSongDialog}>
  <DialogTitle>Thêm bài hát mới</DialogTitle>
  <DialogContent>
   <AddSong />
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseAddSongDialog} color="primary">
      Hủy
    </Button>
  
  </DialogActions>
</Dialog>

    </AppBar>
  );
}


export default NavbarTop;
