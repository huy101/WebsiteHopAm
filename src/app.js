require("dotenv").config();
const express = require("express");
const app = express();
const path = require('path');
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
const songRequest=require('./routes/songrequest')
const WebSocket = require('ws');
const http = require('http'); 
const Notification =require('./routes/notification')
app.use(cors());
// Set EJS làm template engine
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
// Chỉ định thư mục chứa các view của bạn (nếu cần)
app.set('views', path.join(__dirname, 'views'));
connection();
const server = http.createServer(app);  // Khởi tạo server HTTP từ express app

// Gọi route WebSocket và truyền server vào
require('./routes/wsRoute')(server);

app.use(express.json());


// routes
app.use('/api/genres', genreRoutes); // Sử dụng route cho thể loại
app.use('/api/rhythms', rhythmRoutes); 
app.use('/', displaySong); 
app.use("/login", login);
app.use("/song", addSong);
app.use("/test", test);
app.use("/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/list", list);
app.use('/comment',addComment)
app.use('/list',listComments)
app.use('/notifications',Notification)
app.use('/request',songRequest)
// app.use('/pages',pagination)
// const hostname=process.env.HOSTNAME||'localhost'
const port = process.env.PORT;
app.listen(port, () => console.log(`Listening on port ${port}...`));
  