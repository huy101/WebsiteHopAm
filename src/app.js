require("dotenv").config();
const express = require("express");
const app = express();
// const session = require('express-session');
const connection = require("./config/database");
const userRoutes = require("./routes/users");
const login=require('./routes/login');
const addComment=require('./routes/addComment');
const authRoutes = require("./routes/auth");
const cors = require('cors');
const addSong=require("./routes/addsong")
const genreRoutes = require('./routes/genre'); // Import routes for genres
const rhythmRoutes = require('./routes/rhythm');
const test=require('./routes/test'); 
const list=require('./routes/list')
const displaySong =require('./routes/displaySong')
const listComments= require('./routes/listComments')
const pagination=require('./routes/pagination')
app.use(cors());

// app.use(session({
//     secret: process.env.JWTPRIVATEKEY, // Đảm bảo thay đổi secret này
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: true } // Đặt thành true nếu dùng HTTPS
//   }));
// database connection
connection();

// middlewares
app.use(express.json());


// routes
app.use('/api/genres', genreRoutes); // Sử dụng route cho thể loại
app.use('/api/rhythms', rhythmRoutes); 
app.use('/song', displaySong); 
app.use("/login", login);
app.use("/", addSong);
app.use("/test", test);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/list", list);
app.use('/comment',addComment)
app.use('/list',listComments)
app.use('/user', list)
// app.use('/pages',pagination)
// const hostname=process.env.HOSTNAME||'localhost'
const port = process.env.PORT;
app.listen(port, () => console.log(`Listening on port ${port}...`));
  