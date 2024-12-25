import { Button,Box, TextField, Typography, Container,Dialog, DialogActions, DialogContent, DialogTitle  } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import NavbarTop from '../Navbar/Navbar';
import { useState, useEffect } from 'react';
import { userLogin } from '../../redux/authActions';
import './login.css';
import ResetPassword from '../Register/ResetPassword'
function Login() {
  const [data, setData] = useState({ email: '', password: '' });
  const [msg, setMsg] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };
  
  // Get auth state from Redux
  const { loading, userToken, error } = useSelector((state) => state.auth);

  // Redirect if already logged in
  useEffect(() => {
    if (userToken) {
      navigate('/'); // Redirect to home or another page when logged in
    }
  }, [userToken, navigate]);

  // Handle login logic
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!data.email.trim() || !data.password.trim()) {
      setMsg('Vui lòng điền đủ thông tin đăng nhập.');
      return;
    }

    try {
      const action = await dispatch(
        userLogin({ email: data.email, password: data.password })
      );

      if (userLogin.fulfilled.match(action)) {
        setMsg('Đăng nhập thành công!');
        navigate('/'); // Navigate to the home page after login
      }
    } catch (err) {
      // Error handling is already managed by Redux
      setMsg('');
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <>
      <div className="Navbar">
        <NavbarTop />
      </div>
      <Container maxWidth="xs" className="login">
        <div className="Login-form">
          <Typography variant="h5">Đăng nhập</Typography>
          <form onSubmit={handleLogin}>
            <TextField
              label="Email address"
              variant="outlined"
              fullWidth
              margin="normal"
              type="email"
              placeholder="Enter email"
              value={data.email}
              name="email"
              onChange={handleChange}
              error={!!error?.email}
              helperText={error?.email}
            />
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              margin="normal"
              type="password"
              placeholder="Password"
              value={data.password}
              name="password"
              onChange={handleChange}
              error={!!error?.password}
              helperText={error?.password}
            />

            {/* Display Redux errors or success messages */}
            {error && <Typography color="error">tài khoản hoặc mật khẩu không đúng</Typography>}
            {msg && <Typography color="success">{msg}</Typography>}

            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              disabled={loading}
              sx={{ marginTop: 2 }}
            >
              {loading ? 'Loading...' : 'Login'}
            </Button>
           <Box sx={{display:'flex'}}><Typography
              variant="h6"
              component={Link}
              to="/register"
              sx={{ marginRight: '20px', cursor: 'pointer' }}
            >
              Đăng ký
            </Typography>
            <Typography  variant="h6"    sx={{  cursor: 'pointer' }} onClick={handleClickOpen}>
              Quên mật khẩu
            </Typography></Box>
          </form>
        </div>
        {/* Dialog for password reset */}
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
         <ResetPassword />
        </DialogContent>
        <DialogActions>
         
        </DialogActions>
      </Dialog>
      </Container>
    </>
  );
}

export default Login;
