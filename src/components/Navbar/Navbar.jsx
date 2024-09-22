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
           <NavDropdown.Item href="#action/3.1">Nhạc vàng</NavDropdown.Item>
         </NavDropdown>
       </div>
       <div className="contain">
         <i className="fas fa-guitar fa-lg"></i>
         <NavDropdown title="Điệu" id="basic-nav-dropdown">
           <NavDropdown.Item href="#action/3.1">Chachacha</NavDropdown.Item>
         </NavDropdown>
       </div>
       <div className="contain">
         <i className="fas fa-user fa-lg"></i>
         <NavDropdown title="Tài khoản" id="basic-nav-dropdown">
           <NavDropdown.Item as={Link} to="/login">Đăng nhập</NavDropdown.Item>
           <NavDropdown.Item as={Link} to="/register">Đăng ký</NavDropdown.Item>
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
