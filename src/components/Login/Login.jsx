import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import "./login.css"
import NavbarTop from '../Navbar/Navbar';
function Login() {
  return (<>
<div className="top">
  <NavbarTop/>
</div>
<div className="login">
<div className="Login-form">
  <Form>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" />
        <Form.Text className="text-muted">
          We'll never share your email with anyone else.
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check type="checkbox" label="Check me out" />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  </div>
</div>
  
  </>
    
  );
}

export default Login;