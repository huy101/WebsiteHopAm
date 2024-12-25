const mongoose = require('mongoose');
  
// Schema cho bảng Role
const roleSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true, // Đảm bảo mỗi User chỉ có một vai trò duy nhất
  },
  username: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['user', 'admin'], // Vai trò có thể là 'user' hoặc 'admin'
  },
  
}, { timestamps: true });



module.exports = mongoose.model('Role', roleSchema);
