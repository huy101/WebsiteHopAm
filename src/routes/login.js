require('dotenv').config();
const router = require("express").Router();
const { User } = require("../models/user"); // Assuming validate is also used for login
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passwordComplexity = require("joi-password-complexity"); 
// const session = require('express-session');
router.post("/", async (req, res) => {
    try {
      console.log("Received data from frontend:", req.body); 
  
      // Find the user by email
      const user = await User.findOne({ email: req.body.email });
      if (!user) return res.status(404).send({ message: "User not found" });
  
      // Check if the user's email is verified
      if (!user.verified) {
        return res.status(403).send({ message: "Email not verified. Please check your inbox." });
      }
  
      // Compare the provided password with the hashed password in the database
      const validPassword = await bcrypt.compare(req.body.password, user.password);
      if (!validPassword) return res.status(401).send({ message: "Invalid email or password" });
  
      // Generate a JWT token
      const token = jwt.sign(
        { _id: user._id, email: user.email, name:user.username },
        process.env.JWTPRIVATEKEY,
        { expiresIn: "1h" } // Token expires in 1 hour
      );
  console.log(user)

      // Send the token and user details in the response
      return res.status(200).send({
        message: "Login successful",
        token: token,
        user: {
          _id: user._id,
          email: user.email,
          name: user.username
        }
      });
    } catch (error) {
      console.error("Error occurred:", error); // Log the error for debugging
      return res.status(500).send({ message: "Internal Server Error" });
    }
  });
  
module.exports = router;
