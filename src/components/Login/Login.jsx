import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './login.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import NavbarTop from '../Navbar/Navbar';
import { useState, useEffect } from 'react';
import { userLogin } from '../../redux/authActions';

function Login() {
  const [data, setData] = useState({ email: '', password: '', name:'' });
  const [error, setError] = useState({});
  const [msg, setMsg] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get auth state from Redux
  const { loading, userInfo, userToken, error: loginError, success } = useSelector(
    (state) => state.auth
  );

  // Redirect if already logged in
  useEffect(() => {
    if (userToken) {
      
      navigate('/'); // Redirect to home or another page when logged in
    }
  }, [userToken, navigate]);

  // Xử lý logic login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError({});
    const newError = {};

    // Validate inputs
    if (!data.email.trim()) {
      newError.email = 'Bạn chưa nhập email';
    }
    if (!data.password.trim()) {
      newError.password = 'Bạn chưa nhập mật khẩu';
    }
    if (Object.keys(newError).length > 0) {
      setError(newError);
      return;
    }

    // Perform login
    try {
      const action = await dispatch(
        userLogin({ email: data.email, password: data.password })
      );
      if (userLogin.fulfilled.match(action)) {
        setMsg('Login successful!');
        navigate('/'); // Navigate to home page after login
      }
    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setError({ api: error.response.data.message });
      }
    }
  };

  // Cập nhật state khi người dùng nhập dữ liệu vào form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <>
      <div className="top">
        <NavbarTop />
      </div>
      <div className="login">
        <div className="Login-form">
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={data.email}
                name="email"
                onChange={handleChange}
              />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={data.password}
                name="password"
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check type="checkbox" label="Check me out" />
            </Form.Group>

            {/* Display errors or success messages */}
            {error.api && <div className="error_msg">{error.api}</div>}
            {msg && <div className="success_msg">{msg}</div>}
            {error.email && <div className="error_msg">{error.email}</div>}
            {error.password && <div className="error_msg">{error.password}</div>}

            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Loading...' : 'Submit'}
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
}

export default Login;
