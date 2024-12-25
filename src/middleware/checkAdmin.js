const Role = require("../models/role");  // Đảm bảo bạn đã có model User

const checkAdmin = async (req, res, next) => {
  try {
    const userId = req.body.userId; // Lấy `userId` từ request body
    const userRole = await Role.findOne({ userId }); // Tìm vai trò người dùng trong Role model

    if (!userRole) {
      return res.status(403).send({ message: 'User role not found.' });
    }

    // Kiểm tra nếu là admin
    req.isAdmin = userRole.role === 'admin'; // Đánh dấu trạng thái admin
    next(); // Tiếp tục xử lý request
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'Internal server error.' });
  }
};
module.exports = checkAdmin;