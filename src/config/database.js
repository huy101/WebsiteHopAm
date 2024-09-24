const mongoose = require("mongoose");
require('dotenv').config();

const uri = "mongodb+srv://hoanghuy1812003:W54o8NE6ZaHBiMco@web.uvb0u.mongodb.net/WebHopAm?retryWrites=true&w=majority&appName=Web"; // Đảm bảo biến này có trong .env

module.exports = () => {
	const connectionParams = {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	};
	try {
		mongoose.connect(uri, connectionParams); // Sửa ở đây
		console.log("Connected to database successfully");
	} catch (error) {
		console.log(error);
		console.log("Could not connect database!");
	}
};



// W54o8NE6ZaHBiMco
// mongodb+srv://hoanghuy1812003:W54o8NE6ZaHBiMco@web.uvb0u.mongodb.net/