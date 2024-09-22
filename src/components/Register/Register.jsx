import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './Register.css';
import axios from 'axios';
import { useState } from 'react';
import NavbarTop from '../Navbar/Navbar';

function Register() {
  const [data, setData] = useState({
    email: '',
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Tạo đối tượng lưu lỗi
    const newErrors = {};
    if (!data.email.trim()) {
      newErrors.email = 'Email không được để trống';
    }
    else
    if (!data.username.trim()) {
      newErrors.username = 'Tên đăng nhập không được để trống';
    }
    else
    if (!data.password.trim()) {
      newErrors.password = 'Password không được để trống';
    }

    // Nếu có lỗi, setErrors và không gửi request
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const url = 'http://localhost:8080/api/users';
      const { data: res } = await axios.post(url, data);
      setMsg(res.message);
      setErrors({}); // Clear errors nếu thành công
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setErrors({ api: error.response.data.message });
      }
    }
  };

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
          <legend>Đăng ký thành viên</legend>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                onChange={handleChange}
                value={data.email}
              />
             
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tên đăng nhập</Form.Label>
              <Form.Control
                type="text"
                name="username"
                onChange={handleChange}
                value={data.username}
              />
              
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                onChange={handleChange}
                value={data.password}
              />
            
            </Form.Group>

            {/* <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check type="checkbox" label="Check me out" />
            </Form.Group> */}

            {/* Hiển thị lỗi từ API */}
            {errors.api && <div className="error_msg">{errors.api}</div>}
            {msg && <div className="success_msg">{msg}</div>}
            {errors.email && <div className="error_msg">{errors.email}</div>}
            {errors.password && (
                <div className="error_msg">{errors.password}</div>
              )}
              {errors.username && (
                <div className="error_msg">{errors.username}</div>
              )}
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
}

export default Register;
