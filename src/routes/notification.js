const express = require('express');
const router = express.Router();
const Notification = require('../models/notifications'); // Mô hình thông báo
const mongoose = require('mongoose');
// Route lấy danh sách thông báo cho người dùng
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Truy vấn thông báo của người dùng theo userId
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 });  // Sắp xếp thông báo theo thời gian tạo (mới nhất lên đầu)

    // Kiểm tra nếu không có thông báo nào
    if (!notifications || notifications.length === 0) {
      return res.status(404).json({ message: 'Không có thông báo nào' });
    }

    // Trả về danh sách thông báo
    res.status(200).json({ notifications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi lấy thông báo' });
  }
});
// Route cập nhật tất cả thông báo thành đã đọc
router.patch('/:userId/markRead', async (req, res) => {
  try {
    const { userId } = req.params;
    const userIdObj = new mongoose.Types.ObjectId(userId);
    // Cập nhật tất cả thông báo của người dùng thành isRead: true
    console.log('Cập nhật thông báo với userId:', userId);
console.log('Điều kiện cập nhật:', { userId: userIdObj, isRead: false });
    const result = await Notification.updateMany(
      { userId:userIdObj, isRead: false }, // Điều kiện: chỉ cập nhật thông báo chưa đọc
      { $set: { isRead: true } } // Thay đổi isRead thành true
    );

    res.status(200).json({
      message: 'Tất cả thông báo đã được đánh dấu là đã đọc',
      modifiedCount: result.modifiedCount, // Số thông báo được cập nhật
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi cập nhật thông báo' });
  }
});
router.patch('/:userId/markRead/:notificationId', async (req, res) => {
  try {
    const { userId, notificationId } = req.params;
    const userIdObj = new mongoose.Types.ObjectId(userId);
    const notificationIdObj = new mongoose.Types.ObjectId(notificationId); // Chuyển _id của thông báo thành ObjectId
    
    // Cập nhật thông báo cụ thể thành isRead: true
    console.log('Cập nhật thông báo với userId:', userId);
    console.log('Điều kiện cập nhật:', { userId: userIdObj, _id: notificationIdObj, isRead: false });
    
    const result = await Notification.updateOne(
      { userId: userIdObj, _id: notificationIdObj, isRead: false }, // Điều kiện: chỉ cập nhật thông báo chưa đọc với _id và userId cụ thể
      { $set: { isRead: true } } // Thay đổi isRead thành true
    );

    if (result.modifiedCount > 0) {
      res.status(200).json({
        message: 'Thông báo đã được đánh dấu là đã đọc',
        modifiedCount: result.modifiedCount, // Số thông báo được cập nhật
      });
    } else {
      res.status(404).json({ message: 'Thông báo không tìm thấy hoặc đã được đánh dấu là đã đọc' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi cập nhật thông báo' });
  }
});

module.exports = router;
