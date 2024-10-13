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


		const { error } = req.body //validate(req.body);


		console.log(error)
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		let user = await User.findOne({ email: req.body.email });
		if (user)
			return res
				.status(409)
				.send({ message: "User with given email already Exist!" });



		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.password, salt);

		user = await new User({ ...req.body, password: hashPassword }).save();

		const token = await new Token({
			userId: user._id,
			token: crypto.randomBytes(32).toString("hex"),
		}).save();
		const url = `${BASE_URL}api/users/${user.id}/verify/${token.token}`;
		console.log(url)
		await sendEmail(user.email, "Verify Email", url);

		res
			.status(201)
			.send({ message: "An Email sent to your account please verify" });
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: "Internal Server Error" });
	}
});

router.get("/:id/verify/:token", async (req, res) => {
	try {

		const user = await User.findOne({ _id: req.params.id });



		if (!user) return res.status(400).send({ message: "Invalid link" });
		
		
		const token = await Token.findOne({
			userId: user._id,
			token: req.params.token,
		});
		if (!token) return res.status(400).send({ message: "Invalid link" });
		   // Update the verified field to true for the given user ID
		const result = await User.updateOne({ _id: user._id }, { verified: true });
		

		res.status(200).send({ message: "Email verified successfully" });
		await token.remove();
		
	} catch (error) {
		res.status(500).send({ message: JSON.stringify(error) });
	}
});

module.exports = router;