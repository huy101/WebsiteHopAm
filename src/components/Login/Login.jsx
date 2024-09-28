import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import "./login.css"
import NavbarTop from '../Navbar/Navbar';
import { useState } from 'react';
import axios from 'axios';
function Login() {
  const [data,setData]=useState({email:"", password:""});
  const [error, setError]=useState("")
  const [msg, setMsg] = useState('');
  const handleLogin=async(e)=>{
  e.preventDefault();
  const newerror={};
  if(!data.email.trim()){
    newerror.email="chưa nhập email kìa thằng lồn"
  }
    else
    if(!data.password.trim()){
      newerror.password="chưa nhập mk kìa thằng lồn"
    }
    if(Object.keys(newerror).length>0){
      setError(newerror);
      return;
    }
    try{
      const url = "http://localhost:8080/api/auth";
      const { data: res } = await axios.post(url, data);
      setMsg(res.message);
      localStorage.setItem("token", res.data);
			window.location = "/";
    } catch (error) {
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				setError(error.response.data.message);
			}
    }
  }
  const handleChange=(e)=>{
    const {name, value}=e.target;
    setData((prevData)=>({
      ...prevData, [name]:value,
    }))
  }
  return (<>
<div className="top">
  <NavbarTop/>
</div>
<div className="login">
<div className="Login-form">
  <Form action="/" method="post">
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" value={data.email} name='email' onChange={handleChange} />
        <Form.Text className="text-muted">
          We'll never share your email with anyone else.
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" value={data.password} name='password'   onChange={handleChange} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check type="checkbox" label="Check me out" />
      </Form.Group>
      {error.api && <div className="error_msg">{error.api}</div>}
            {msg && <div className="success_msg">{msg}</div>}
            {error.email && <div className="error_msg">{error.email}</div>}
            {error.password && (
                <div className="error_msg">{error.password}</div>
              )}
      <Button variant="primary" onClick={handleLogin} type="submit">
        Submit
      </Button>
    </Form>
  </div>
</div>
  
  </>
    
  );
}

export default Login;