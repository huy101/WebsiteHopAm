const jwt = require('jsonwebtoken');

const check = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Access Denied. No token provided.' });


  try {
    const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
    req.user = decoded; // Gán thông tin người dùng từ token vào request
    next(); // Chuyển sang middleware tiếp theo hoặc route handler
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = check  ;
