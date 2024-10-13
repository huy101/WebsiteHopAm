require("dotenv").config();
const express = require("express");
const app = express();

const connection = require("./config/database");
const userRoutes = require("./routes/users");
const login=require("./routes/login")
const authRoutes = require("./routes/auth");
const cors = require('cors');
const addSong=require("./routes/addsong")
const genreRoutes = require('./routes/genre'); // Import routes for genres
const rhythmRoutes = require('./routes/rhythm'); 
app.use(cors());


// database connection
connection();

// middlewares
app.use(express.json());


// routes
app.use('/api/genres', genreRoutes); // Sử dụng route cho thể loại
app.use('/api/rhythms', rhythmRoutes); 
app.use("/login", login);
app.use("/", addSong);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// const hostname=process.env.HOSTNAME||'localhost'
const port = process.env.PORT;
app.listen(port, () => console.log(`Listening on port ${port}...`));
  