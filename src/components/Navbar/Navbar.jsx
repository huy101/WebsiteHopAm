import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchGenres } from "../../redux/genreSlice";
import { fetchRhythms } from "../../redux/rhythmSlice";
import { logout } from "../../redux/authActions";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import {
    Divider,
    InputAdornment,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Avatar,
    ListItemText,
    ListItemIcon,
    Grid2,
} from "@mui/material";
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { LibraryMusic, QueueMusic, KeyboardArrowDown, Speed } from '@mui/icons-material';

import AddSong from "../AddNewSong/AddSong";
import MenuIcon from "@mui/icons-material/Menu";
import InboxIcon from "@mui/icons-material/Inbox";
import SearchIcon from "@mui/icons-material/Search";
import CategoryIcon from "@mui/icons-material/Category";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import Badge from "@mui/material/Badge";

import { useParams } from "react-router-dom";
import { searchSongs } from "../../redux/fecthListAction";
import { setType } from "../../redux/types";
import PersonIcon from "@mui/icons-material/Person";
import "./Navbar.css";
import { useGetNotificationsQuery, useMarkAllAsReadMutation } from "../../redux/notificationSlice";
import ListSong from "../ListSong/ListSong";
const NavbarTop = () => {
    const dispatch = useDispatch();
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");
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
    const role = localStorage.getItem("userRole");
    const [markAllAsRead] = useMarkAllAsReadMutation();
    const [username, setUsername] = useState("");
    const notificationsCount = notifications.length;
    const { query } = useParams();
    useEffect(() => {
        const storedUsername = localStorage.getItem("userName");
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
        setAnchorEl(event.currentTarget);
        console.log(notifications); // Open the notification menu
    };

    const handleCloseNotifications = () => {
        setAnchorEl(null); // Đóng menu khi nhấp ra ngoài
    };

        useEffect(() => {
            if (query) {
                console.log("Searching for:", query);
                dispatch(searchSongs(query));
            }
        }, [dispatch,query]);

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead(userId).unwrap(); // Gửi yêu cầu đánh dấu tất cả là đã đọc
            console.log("Tất cả thông báo đã được đánh dấu là đã đọc.");
        } catch (error) {
            console.error("Lỗi khi đánh dấu thông báo đã đọc:", error);
        }
    };
    useEffect(() => {
        dispatch(fetchGenres());
        dispatch(fetchRhythms());
    }, [dispatch]);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        navigate(`/list/search/${encodeURIComponent(searchQuery)}`);
        setSearchQuery("");
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
        dispatch(
            setType({
                childTypeId: genre._id,
                type: "genre",
            })
        );
        navigate(`/list/genre/${genre._id}`);
    };

    const handleClickRhythm = (rhythm) => {
        dispatch(
            setType({
                childTypeId: rhythm._id,
                type: "rhythm",
            })
        );
        navigate(`/list/rhythm/${rhythm._id}`);
    };

    return (
        <AppBar
            position="static"
            className="MuiAppBar-root"
            sx={{ display: "flex", justifyContent: "center" }}
        >
            <Toolbar>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" component={Link} to="/">
                        HOP AM GUITAR
                    </Typography>
                </Box>
                <Box display="flex" alignItems="center">
                    <MenuItem  onClick={openGenreMenu}><LibraryMusic/> Thể loại</MenuItem>
                    <Menu
                        anchorEl={genreAnchorEl}
                        open={Boolean(genreAnchorEl)}
                        onClose={closeGenreMenu}
                        PaperProps={{
                            elevation: 3,
                            sx: {
                              minWidth: 200,
                              mt: 1,
                            },
                          }}
                          transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                        
                    >
                        {genres.length > 0 ? (
  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
    {genres.map((genre, index) => (
      <React.Fragment key={genre._id}>
        <MenuItem
          sx={{ 
            display: 'flex',
            alignItems: 'center', 
            gap: 0.5,
            minHeight: 'unset',
            fontSize: 'rem',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
          onClick={() => {
            navigate(`/list/genre/${genre._id}`);
            closeGenreMenu();
          }}
        > 
          <LibraryMusic sx={{ fontSize: '1rem' }} />
          <Typography 
            noWrap 
            sx={{ 
              fontSize: 'rem',
              lineHeight: 1.2
            }}
          >
            {genre.name}
          </Typography>
        </MenuItem>
        {(index + 1) % 3 === 0 && index !== genres.length - 1 && (
          <Divider sx={{ gridColumn: '1 / -1',  }} />
        )}
      </React.Fragment>
    ))}
  </Box>
) : (
  <MenuItem disabled>Không có thể loại</MenuItem>
)}
                    </Menu>

                    <MenuItem color="#495057" onClick={openRhythmMenu}>
                    <Speed sx={{ fontSize: 25 }} />
                   Điệu
                    </MenuItem>
                    <Menu
                        anchorEl={rhythmAnchorEl}
                        open={Boolean(rhythmAnchorEl)}
                        onClose={closeRhythmMenu}
                        PaperProps={{
                            elevation: 3,
                            sx: {
                              minWidth: 200,
                              mt: 1,
                            },
                          }}
                          transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                    >

{rhythms.length > 0 ? (
  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
    {rhythms.map((rhythm, index) => (
      <React.Fragment key={rhythm._id}>
        <MenuItem
          sx={{ 
            display: 'flex',
            alignItems: 'center', 
            gap: 0.5,
            py: 0.5,
            px: 1,
            minHeight: 'unset',
            fontSize: 'rem',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
          onClick={() => {
            navigate(`/list/rhythm/${rhythm._id}`);
            closeRhythmMenu();
          }}
        > 
          <Speed sx={{ fontSize: '1rem' }} />
          <Typography 
            noWrap 
            sx={{ 
              fontSize: 'rem',
              lineHeight: 1.2
            }}
          >
            {rhythm.name}
          </Typography>
        </MenuItem>
        {(index + 1) % 3 === 0 && index !== rhythms.length - 1 && (
          <Divider sx={{ gridColumn: '1 / -1', my: 0.5 }} />
        )}
      </React.Fragment>
    ))}
  </Box>
) : (
  <MenuItem disabled>Không có điệu</MenuItem>
)}
                    </Menu>
                </Box>

                <Box
                    component="form"
                    onSubmit={handleSearchSubmit}
                    display="flex"
                    alignItems="center"
                >
                    <TextField
                        size="small"
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton 
            onClick={openUserMenu}
            sx={{ 
              borderRadius: 2,
              padding: '8px 16px',
              '&:hover': {
                backgroundColor: 'rgba(59, 130, 246, 0.08)'
              }
            }}
          >
            <Avatar
              sx={{ 
                width: 35, 
                height: 35,
                bgcolor: '#3b82f6',
                fontWeight: 600,
                marginRight: 1
              }}
            >
              {username.charAt(0).toUpperCase()}
            </Avatar>
            <Typography 
              sx={{ 
                color: '#1e293b',
                fontWeight: 500,
                fontSize: '1.5rem'
              }}
            >
              {username || "Tài khoản"}
            </Typography>
          </IconButton>

          <Menu
            anchorEl={userMenuAnchorEl}
            open={Boolean(userMenuAnchorEl)}
            onClose={closeUserMenu}
            PaperProps={{
              sx: {
                width: 220,
                marginTop: 1,
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
              }
            }}
          >
            <MenuItem component={Link} to="/liked" sx={{ py: 1.5 }}>
              <ListItemIcon>
                <PersonOutlineIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Trang cá nhân" />
            </MenuItem>
            
            <MenuItem onClick={handleOpenAddSongDialog} sx={{ py: 1.5 }}>
              <ListItemIcon>
                <AddCircleOutlineIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Thêm bài hát mới" />
            </MenuItem>

            {role === "admin" && (
              <MenuItem component={Link} to="/admin" sx={{ py: 1.5 }}>
                <ListItemIcon>
                  <AdminPanelSettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Quản lý" />
              </MenuItem>
            )}

            <Divider />

            <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: 'error.main' }}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText primary="Đăng xuất" />
            </MenuItem>
          </Menu>

          <IconButton 
            onClick={handleClickNotifications}
            sx={{ 
              borderRadius: 2,
              '&:hover': {
                backgroundColor: 'rgba(59, 130, 246, 0.08)'
              }
            }}
          >
            <Badge
              badgeContent={notifications.filter(n => !n.isRead).length}
              color="error"
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseNotifications}
            onClick={handleMarkAllAsRead}
            anchorOrigin={{
              vertical: 'bottom', // Vị trí hiển thị theo chiều dọc (top, bottom)
              horizontal: 'right', // Vị trí hiển thị theo chiều ngang (left, right)
            }}
            transformOrigin={{
              vertical: 'top', // Điểm bắt đầu hiển thị theo chiều dọc
              horizontal: 'right', // Điểm bắt đầu hiển thị theo chiều ngang
            }}
            PaperProps={{
              sx: {
                width: 380,
                maxHeight: 480,
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
              }
            }}
          >
            <Box sx={{ p: 2, pb: 1.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                Thông báo
              </Typography>
            </Box>
            
            <Divider />
            
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <MenuItem
                  key={notification._id}
                  component={Link}
                  to={notification.songUrl}
                  sx={{
                    p: 2,
                    borderBottom: '1px solid rgba(0,0,0,0.04)',
                    backgroundColor: notification.read ? 'transparent' : 'rgba(59, 130, 246, 0.04)',
                    '&:hover': {
                      backgroundColor: 'rgba(59, 130, 246, 0.08)'
                    }
                  }}
                >
                  <Box sx={{ width: '100%' }}>
                    <Typography
                      sx={{
                        fontSize: '0.925rem',
                        color: '#1e293b',
                        fontWeight: notification.read ? 400 : 500,
                        lineHeight: 1.5,
                        mb: 1,
                        whiteSpace: 'normal', // Cho phép xuống dòng
                        wordWrap: 'break-word', // Ngắt từ nếu quá dài
                        overflow: 'hidden',
                      }}
                    >
                      {notification.message}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AccessTimeIcon sx={{ fontSize: 14, color: '#64748b' }} />
                      <Typography
                        variant="caption"
                        sx={{ color: '#64748b', fontSize: '0.75rem' }}
                      >
                        {new Date(notification.createdAt).toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
              ))
            ) : (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="text.secondary">
                  Không có thông báo mới
                </Typography>
              </Box>
            )}
          </Menu>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            component={Link}
            to="/login"
            variant="outlined"
            sx={{
              color: '#3b82f6',
              borderColor: '#3b82f6',
              '&:hover': {
                borderColor: '#2563eb',
                backgroundColor: 'rgba(59, 130, 246, 0.04)'
              }
            }}
          >
            Đăng nhập
          </Button>
          <Button
            component={Link}
            to="/register"
            variant="contained"
            sx={{
              bgcolor: '#3b82f6',
              '&:hover': {
                bgcolor: '#2563eb'
              }
            }}
          >
            Đăng ký
          </Button>
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
};

export default NavbarTop;
