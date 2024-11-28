const express = require('express');
const router = express.Router();
const Comment = require('../models/comments');
const User = require('../models/user'); // Đảm bảo bạn đã import đúng model User

// Thêm bình luận
router.post('/', async (req, res) => {
  try {
    const { songId, userId, content } = req.body;

    // Tạo bình luận mới
    const comment = new Comment({ songId, userId, content });
    await comment.save();

    // Lấy lại bình luận vừa tạo, kèm thông tin người dùng
    const populatedComment = await Comment.findById(comment._id).populate('userId', 'username'); // Chỉ lấy trường `username` của user

    res.status(201).send(populatedComment); // Trả về bình luận đã populate
    console.log(populatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

module.exports = router;
