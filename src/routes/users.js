require('dotenv').config();
const router = require("express").Router();
const { User, validate } = require("../models/user");
const Token = require("../models/token");
const crypto = require("crypto");
const sendEmail = require("../untils/sendEmail");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
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
  
	  const url = `${BASE_URL}api/users/${user.id}/verify/${token.token}`;
	  await sendEmail(user.email, "Verify Email", url);
  
	  return res.status(201).send({ message: "An email has been sent to your account. Please verify." });
	} catch (error) {
	  console.log(error);
	  return res.status(500).send({ message: "Internal Server Error" });
	}
  });
  

router.get("/:id/verify/:token", async (req, res) => {
	try {
	  const user = await User.findOne({ _id: req.params.id });
	  if (!user) {
		return res.status(400).send({ message: "Invalid link" });
	  }
  
	  const token = await Token.findOne({
		userId: user._id,
		token: req.params.token,
	  });
	  if (!token) {
		return res.status(400).send({ message: "Invalid link" });
	  }
  
	  // Update the verified field to true for the given user ID
	  await User.updateOne({ _id: user._id }, { verified: true });
  
	  return res.status(200).send({ message: "Email verified successfully" });
	  await token.remove();
	} catch (error) {
	  console.error(error); // Log the error to help with debugging
	  return res.status(500).send({ message: "Internal Server Error" });
	}
  });
  

module.exports = router;