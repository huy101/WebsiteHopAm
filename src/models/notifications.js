const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role', // Người nhận thông báo
    required: true,
  },
  type: {
    type: String,
    enum: ['comment', 'request','song'], // 'comment' cho tag trong bình luận, 'approval' cho phê duyệt bài hát
    required: true,
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId, // Liên kết đến bài hát hoặc bình luận tùy loại thông báo
    refPath: 'type',
  },
  message: {
    type: String, // Nội dung thông báo
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false, // Trạng thái đọc thông báo
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  songUrl: {
    type: String,  // Thêm trường songUrl để lưu trữ đường dẫn đến bài hát
    required: true,
  },
});

module.exports = mongoose.model('Notification', notificationSchema);
