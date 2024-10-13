import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/authActions'; // Ensure you import the logout action
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';
import { Form, Button, Row, Col } from 'react-bootstrap'; // Import Form, Button, Row, Col

function NavbarTop() {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');

  // Get auth state from Redux
  const { userInfo, userToken } = useSelector((state) => state.auth);

  const handleLogout = () => {
    // Clear userToken from localStorage and dispatch logout action
    localStorage.removeItem('userToken');
    dispatch(logout());
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Handle search logic here, e.g., redirect to search results page
    console.log('Searching for:', searchQuery);
    // Redirect to a search results page or perform a search action
  };

  return (
    <div className="top">
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="/">Hợp Âm Đàn</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <div className="contain">
                <i className="fas fa-book fa-lg"></i>
                <NavDropdown title="Thể Loại" id="basic-nav-dropdown">
                  <NavDropdown.Item href="#">Nhạc vàng</NavDropdown.Item>
                </NavDropdown>
              </div>
              <div className="contain">
                <i className="fas fa-guitar fa-lg"></i>
                <NavDropdown title="Điệu" id="basic-nav-dropdown">
                  <NavDropdown.Item href="">Chachacha</NavDropdown.Item>
                </NavDropdown>
              </div>
              <div className="message">
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" data-toggle="dropdown" href="#" aria-expanded="false">
                    <i className="fas fa-envelope fa-fw"></i>
                  </a>
                  <ul className="dropdown-menu dropdown-messages">
                    <li>
                      <div className="text-center">Chưa có tin nhắn nào</div>
                    </li>
                    <div className="dropdown-divider"></div>
                    <li className="text-center">
                      <a href="https://hopamviet.vn/msg.html">
                        <strong>Tất cả tin nhắn</strong>
                        <i className="fas fa-angle-right"></i>
                      </a>
                    </li>
                  </ul>
                </li>
              </div>
            </Nav>
            <Nav className="me-auto">
              <div className="contain">
                <NavDropdown title={userInfo ? userInfo.name : "Tài khoản"} id="basic-nav-dropdown">
                  {userToken && userInfo ? (
                    <>
                      <NavDropdown.Item as={Link} to="/posted">Bài hát tôi đã đăng</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/liked">Bài hát yêu thích</NavDropdown.Item>
                      <NavDropdown.Item onClick={handleLogout}>Đăng xuất</NavDropdown.Item>
                    </>
                  ) : (
                    <>
                      <NavDropdown.Item as={Link} to="/login">Đăng nhập</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/register">Đăng ký</NavDropdown.Item>
                      <NavDropdown.Item onClick={handleLogout}>Đăng xuất</NavDropdown.Item>
                    </>
                  )}
                </NavDropdown>
              </div>
            </Nav>
          </Navbar.Collapse>

          {/* Search Form */}
          <Form inline onSubmit={handleSearchSubmit}>
            <Row>
              <Col xs="auto">
                <Form.Control
                  type="text"
                  placeholder="Nhập tên bài hát, tên ca sĩ"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)} // Update state on input change
                  style={{ width: '500px', marginRight: '-32px' }}
                />
              </Col>
              <Col xs="auto">
                <Button type="submit">
                  <i className="fa-solid fa-magnifying-glass"></i> Tìm
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </Navbar>
    </div>
  );
}

export default NavbarTop;
