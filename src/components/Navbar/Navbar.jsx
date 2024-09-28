import React from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Navbar.css';

function NavbarTop() {
  return (
 <><div className="top"><Navbar expand="lg" className="bg-body-tertiary">
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
           <NavDropdown.Item  href="">Chachacha</NavDropdown.Item>
         </NavDropdown>
       </div>
       <div className="message">
       <li class="nav-item dropdown">
<a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#" aria-expanded="false">
<i class="fas fa-envelope fa-fw"></i>
</a>
<ul class="dropdown-menu dropdown-messages">
<li>
<div class="text-center">Chưa có tin nhắn nào</div>
</li>
<div class="dropdown-divider"></div>
<li class="text-center">
<a href="https://hopamviet.vn/msg.html">
<strong>Tất cả tin nhắn</strong>
<i class="fas fa-angle-right"></i>
</a>
</li>
</ul>
</li>
       </div>
       
       <div className="contain">
         <i className="fas fa-user fa-lg"></i>
         
         <NavDropdown title="Tài khoản" id="basic-nav-dropdown">
           <NavDropdown.Item as={Link} to="/login">Đăng nhập</NavDropdown.Item>
           <NavDropdown.Item as={Link} to="/register">Đăng ký</NavDropdown.Item>
           <NavDropdown.Item as={Link} to="/add"><i class="fas fa-plus"></i> Thêm bài hát</NavDropdown.Item>
           <NavDropdown.Item as={Link} to="/posted">Bài hát tôi đã đăng</NavDropdown.Item>
           <NavDropdown.Item as={Link} to="/liked">Bài hát yêu thích</NavDropdown.Item>
         </NavDropdown>
       </div>
     </Nav>
   </Navbar.Collapse>
   <Form inline>
     <Row>
       <Col xs="auto">
         <Form.Control
           type="text"
           placeholder="Nhập tên bài hát, tên ca sĩ"
           style={{ width: '500px', marginRight: '-32px' }}
         />
       </Col>
       <Col xs="auto">
         <Button type="submit"><i class="fa-solid fa-magnifying-glass"></i> Tìm</Button>
       </Col>
     </Row>
   </Form>
 </Container>
</Navbar></div></>
    
  
    
  );
}

export default NavbarTop;
