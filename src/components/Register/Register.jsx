import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../redux/authActions';
import { TextField, Button, Box, Typography, CircularProgress, Snackbar, Alert } from '@mui/material';
import NavbarTop from '../Navbar/Navbar';
import './Register.css';

const Register = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);
  const { error, successMessage } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });

  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    const { username, email, password } = formData;

    if (!username || !email || !password) {
      console.log("Please fill in all fields");
      return;
    }

    try {
      console.log(username, email, password);
      await dispatch(registerUser({ email, username, password })).unwrap();
      setShowSuccessSnackbar(true); // Show success snackbar
      setFormData({
        email: '',
        username: '',
        password: '',
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSnackbarClose = () => {
    setShowSuccessSnackbar(false);
  };

  return (
    <>
      <div className="top">
        <NavbarTop />
      </div>
      <div className="login">
        <Box sx={{ maxWidth: 400, margin: 'auto', padding: 3 }}>
          <Typography variant="h5" gutterBottom align="center">
            Đăng ký thành viên
          </Typography>
          <form onSubmit={handleSubmit}>
          <TextField
            label="Tên đăng ký"
            type="text"
            name="username"
              fullWidth
              onChange={handleChange}
              value={formData.username}
              required
              margin="normal"
            />
            <TextField
              label="Email"
              type="email"
              name="email"
              fullWidth
              onChange={handleChange}
              value={formData.email}
              required
              margin="normal"
            />
            <TextField
              label="Password"
              type="password"
              name="password"
              fullWidth
              onChange={handleChange}
              value={formData.password}
              required
              margin="normal"
            />

            {/* Display API errors */}
            {error && <Typography color="error" sx={{ marginTop: 2 }}>{error}</Typography>}

            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              sx={{ marginTop: 3 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Đăng ký'}
            </Button>
          </form>
        </Box>
      </div>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccessSnackbar}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.
        </Alert>
      </Snackbar>
    </>
  );
};

export default Register;
