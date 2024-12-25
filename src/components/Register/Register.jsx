import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../redux/authActions';
import { TextField, Button, Box, Typography, CircularProgress } from '@mui/material';
import NavbarTop from '../Navbar/Navbar';
import './Register.css';

const Register = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading); // Correct loading selector
  const { error, successMessage } = useSelector((state) => state.auth); // Correct error and successMessage selector

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });

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
      await dispatch(registerUser({ username, email, password })).unwrap();
      // Optionally clear the form after successful registration
      setFormData({
        email: '',
        username: '',
        password: '',
      });
    } catch (error) {
      console.error(error);
    }
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
              label="Tên đăng nhập"
              type="text"
              name="username"
              fullWidth
              onChange={handleChange}
              value={formData.username}
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
            
            {/* Display API errors and success messages */}
            {error && <Typography color="error" sx={{ marginTop: 2 }}>{error}</Typography>}
            {successMessage && <Typography color="success" sx={{ marginTop: 2 }}>{successMessage}</Typography>}

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
    </>
  );
};

export default Register;
