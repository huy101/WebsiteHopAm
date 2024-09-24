require("dotenv").config();
const express = require("express");
const app = express();

const connection = require("./config/database");
const userRoutes = require("./routes/users");
const testRoutes = require("./routes/test");
const authRoutes = require("./routes/auth");
const cors = require('cors');
app.use(cors());

// database connection
connection();

// middlewares
app.use(express.json());


// routes
app.use("/api/test", testRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
// const hostname=process.env.HOSTNAME||'localhost'
const port = process.env.PORT;
app.listen(port, () => console.log(`Listening on port ${port}...`));
  