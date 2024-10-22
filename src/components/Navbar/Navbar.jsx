import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { useDispatch, useSelector } from 'react-redux';
import { fetchGenres } from '../../redux/genreSlice'; 
import { fetchRhythms } from '../../redux/rhythmSlice'; 
import { logout } from '../../redux/authActions'; 
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Form, Button, Row, Col } from 'react-bootstrap'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';
import { setType } from '../../redux/types';

function NavbarTop() {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate(); // Use useNavigate instead of Navigate
  // Get genres and rhythms from Redux state
  const genres = useSelector((state) => state.genres); 
  const rhythms = useSelector((state) => state.rhythms);
  const { childTypeId, type } = useSelector((state) => state.types);
  
  // Get auth state from Redux
  const { userInfo, userToken } = useSelector((state) => state.auth);

  // Fetch genres and rhythms when the component mounts
  useEffect(() => {
    dispatch(fetchGenres()); // Fetch genres
    dispatch(fetchRhythms()); // Fetch rhythms
  }, [dispatch]);

  const handleClickGenre = (genre) => {
    dispatch(setType({
      childTypeId: genre._id,
      type: "genre",
    }));
    navigate(`/list/${genre._id}`); // Navigate after setting type
  };

  const handleClickRhythm = (rhythm) => {
    dispatch(setType({
      childTypeId: rhythm._id,
      type: "rhythm",
    }));
    navigate(`/list/${rhythm._id}`); // Navigate after setting type
  };

  const handleLogout = () => {
    // Clear userToken from localStorage and dispatch logout action
    localStorage.removeItem('userToken');
    dispatch(logout());
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Handle search logic here, e.g., redirect to search results page
    console.log('Searching for:', searchQuery);
    // Navigate to search results if needed
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
                {/* Genre Dropdown */}
                <NavDropdown title="Thể loại" id="basic-nav-dropdown">
                  {genres.length > 0 ? (
                    genres.map((genre) => (
                      <NavDropdown.Item
                        key={genre._id}
                        onClick={() => handleClickGenre(genre)} // Wrap the function call
                      >
                        {genre.name}
                      </NavDropdown.Item>
                    ))
                  ) : (
                    <NavDropdown.Item disabled>Không có thể loại</NavDropdown.Item>
                  )}  
                </NavDropdown>
              </div>

              {/* Rhythm Dropdown */}
              <div className="contain">
                <i className="fas fa-guitar fa-lg"></i>
                <NavDropdown title="Điệu" id="basic-nav-dropdown">
                  {rhythms.length > 0 ? (
                    rhythms.map((rhythm) => (
                      <NavDropdown.Item
                        key={rhythm._id}
                        onClick={() => handleClickRhythm(rhythm)} // Wrap the function call
                      >
                        {rhythm.name}
                      </NavDropdown.Item>
                    ))
                  ) : (
                    <NavDropdown.Item disabled>Không có điệu</NavDropdown.Item>
                  )}
                </NavDropdown>
              </div>

              {/* Messages Dropdown */}
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

            {/* Account Dropdown */}
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
