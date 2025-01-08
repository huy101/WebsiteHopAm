require('dotenv').config();
const router = require("express").Router();
const { User, validate } = require("../models/user");
const Token = require("../models/token");
const crypto = require("crypto");
const sendEmail = require("../untils/sendEmail");
const bcrypt = require("bcrypt");
const Role = require("../models/role"); 
router.post("/register", async (req, res) => {
	try {
	  const BASE_URL = process.env.BASE_URL;
  
	  const { error } = req.body; // validate(req.body);
	  console.log(error)
	  if (error) {
		return res.status(400).send({ message: error.details[0].message });
	  }
  
	  let user = await User.findOne({ email: req.body.email });
	  if (user) {
		return res.status(409).send({ message: "User with given email already exists!" });
	  }
  
	  const salt = await bcrypt.genSalt(Number(process.env.SALT));
	  const hashPassword = await bcrypt.hash(req.body.password, salt);
  
	  user = await new User({ ...req.body, password: hashPassword }).save();
  
	  const token = await new Token({
		userId: user._id,
		token: crypto.randomBytes(32).toString("hex"),
	  }).save();
  
	  const url = `${process.env.BASE_URL}api/users/verify/${user.id}/${token.token}`;
			  
			  // Send the email with the verification link
			  const emailData = {
				username: user.username, // Truyền username vào
				verificationUrl: url, 
			  };
		  
			  await sendEmail(user.email, "Verify Email", "register", emailData); 
  
	  return res.status(201).send({ message: "An email has been sent to your account. Please verify." });
	} catch (error) {
	  console.log(error);
	  return res.status(500).send({ message: "Internal Server Error" });
	}
  });
  


	router.get("/verify/:userId/:token", async (req, res) => {
		try {
		  const { userId, token } = req.params;
	  
		  // Find the user by ID
		  const user = await User.findById(userId);
		  if (!user) return res.status(400).render("email/verifyEmail", { status: 'error', message: "Invalid link" });
	  
		  // Find the token associated with the user
		  const verificationToken = await Token.findOne({
			userId: user._id,
			token,
		  });
		  if (!verificationToken) return res.status(400).render("emails/verifyEmail", { status: 'error', message: "Invalid link" });
	  
		  // Verify the user's email
		  user.verified = true;
		  await user.save();
	  
		  // Create the 'user' role for the user after email verification
		  const role = new Role({
			userId: user._id,
			username: user.username,  // Assuming the User model has a 'username' field
			role: 'user',  // Default role is 'user'
		  });
		  await role.save();
	  
		  // Delete the token to prevent reuse
		  await Token.deleteOne({ userId: user._id, token });
	  
		  // Render the success page with the URL for login
		  const url = `http://localhost:3000/login`; // The link to redirect users to the login page
		  res.status(200).render("emails/verifyEmail", { status: 'success', url });
		} catch (error) {
		  console.error(error); // Log the error
		  res.status(500).render("emails/verifyEmail", { status: 'error', message: "Internal Server Error" });
		}
	  });
  
  router.get("/list", async (req, res) => {
	try {
	  const users = await User.find();
	  res.json(users);
	  console.log(users)
	} catch (error) {
	  res.status(500).json({ error: "An error occurred while fetching users	" });
	}
  });
  // Đảm bảo Token model đã được khai báo

// API Forgot Password
router.post("/forgot-password", async (req, res) => {
	try {
	  const { email } = req.body;
	  const user = await User.findOne({ email });
	  if (!user) {
		return res.status(404).send({ message: "User does not exist!" });
	  }
  
	  const randomToken = crypto.randomBytes(32).toString("hex");
	  const savedToken = new Token({
		userId: user._id,
		token: randomToken,
		expiresAt: Date.now() + 3600000, // 1 giờ
	  });
  
	  await savedToken.save();
  
	  const resetLink = `${process.env.BASE_URL}api/users/reset-password/${user._id}/${randomToken}`;
	  const emailData = { name: user.name, resetLink };
  
	  await sendEmail(user.email, "Reset Your Password", "resetPassword", emailData);
  
	  return res.status(200).json({
		success: true,
		message: "Password reset email has been sent!",
	  });
	} catch (error) {
	  console.error("Error during forgot password:", error);
	  return res.status(500).json({ success: false, message: "Internal Server Error" });
	}
  });

  router.get("/reset-password/:id/:token", async (req, res) => {
	try {
	  const { id, token } = req.params;
  
	  // Kiểm tra user và token trong database
	  const user = await User.findById(id);
	  if (!user) {
		return res.status(400).send({ message: "Invalid link or user!" });
	  }
  
	  const resetToken = await Token.findOne({ userId: user._id, token });
	  if (!resetToken || resetToken.expiresAt < Date.now()) {
		return res.status(400).send({ message: "Invalid or expired token!" });
	  }
  
	  // Render form HTML cho người dùng nhập mật khẩu mới
	  res.send(`
		<!DOCTYPE html>
		<html>
		<head>
		  <title>Reset Password</title>
		  <style>
			body {
			  font-family: Arial, sans-serif;
			  background-color: #f9f9f9;
			  text-align: center;
			  padding: 20px;
			}
			h1 {
			  color: #333;
			}
			form {
			  background: #fff;
			  padding: 20px;
			  border-radius: 5px;
			  display: inline-block;
			  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
			}
			input[type="password"] {
			  padding: 10px;
			  margin: 10px 0;
			  border: 1px solid #ddd;
			  border-radius: 4px;
			  width: 100%;
			}
			button {
			  padding: 10px 20px;
			  background-color: #007BFF;
			  color: #fff;
			  border: none;
			  border-radius: 4px;
			  cursor: pointer;
			}
			button:hover {
			  background-color: #0056b3;
			}
			.error {
			  color: red;
			  font-size: 14px;
			}
		  </style>
		  <script>
			function validateForm(event) {
			  const password = document.getElementById("password").value;
			  const confirmPassword = document.getElementById("confirmPassword").value;
  
			  if (password !== confirmPassword) {
				event.preventDefault(); // Ngăn không gửi form
				document.getElementById("error").innerText = "Mật khẩu không trùng khớp!";
			  }
			}
		  </script>
		</head>
		<body>
		  <h1>Reset Your Password</h1>
		  <form action="http://localhost:8080/api/users/reset-password/${id}/${token}" method="POST" onsubmit="validateForm(event)">
			<label for="password">New Password:</label>
			<input type="password" id="password" name="password" required />
			<br />
			<label for="confirmPassword">Confirm Password:</label>
			<input type="password" id="confirmPassword" name="confirmPassword" required />
			<br />
			<span id="error" class="error"></span>
			<br />
			<button type="submit">Reset Password</button>
		  </form>
		</body>
		</html>
	  `);
	} catch (error) {
	  console.error("Error displaying reset form:", error);
	  return res.status(500).send({ message: "Internal Server Error" });
	}
  });
  
  

  router.post("/reset-password/:id/:token", async (req, res) => {
	try {
	  const { password } = req.body;
	  const { id, token } = req.params;
  
	  // Kiểm tra xem password có hợp lệ không
	  if (!password) {
		return res.status(400).send({ message: "Password is required!" });
	  }
  
	  // Tìm người dùng và token trong cơ sở dữ liệu để xác minh đường dẫn
	  const user = await User.findOne({ _id: id });
	  if (!user) {
		return res.status(400).send({ message: "Người dùng không tồn tại" });
	  }
  
	  const resetToken = await Token.findOne({ userId: user._id, token: token });
	  if (!resetToken) {
		return res.status(400).send({ message: "không tồn tại đường dẫn reset" });
	  }
  
	  // Tạo salt và hash mật khẩu mới
	  const saltRounds = Number(process.env.SALT) || 10;  // Nếu không có giá trị trong env, mặc định là 10
	  const salt = await bcrypt.genSalt(saltRounds);  // Tạo salt từ số vòng lặp
	  if (!salt) {
		return res.status(500).send({ message: "Error generating salt" });
	  }
  
	  // Hash mật khẩu với salt
	  const hashPassword = await bcrypt.hash(password, salt);
	  if (!hashPassword) {
		return res.status(500).send({ message: "Error hashing password" });
	  }
  
	  // Cập nhật mật khẩu mới cho người dùng
	  await User.updateOne({ _id: user._id }, { password: hashPassword });
  
	  // Xóa token khỏi cơ sở dữ liệu sau khi sử dụng
	  await resetToken.deleteOne(); 
  
	  const message = "Cập nhật mật khẩu thành công!";
	  res.render('emails/ResetSuccess', { message });
	} catch (error) {
	  console.error(error);
	  return res.status(500).send({ message: "Internal Server Error" });
	}
  });
  
	
  
	
module.exports = router;