const mongoose = require('mongoose');
  
// Schema cho bảng Role
const roleSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['user', 'admin'], // Vai trò có thể là 'user' hoặc 'admin'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Tham chiếu đến bảng User
    unique: true, // Đảm bảo mỗi User chỉ có một vai trò duy nhất
  },
}, { timestamps: true });


module.exports = mongoose.model('Role', roleSchema);
