const mongoose = require('mongoose');
const rhythmSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // Tên điệu
  });
  
  // Model cho bảng Rhythm
  const Rhythm = mongoose.model("Rhythm", rhythmSchema);
  module.exports = Rhythm ;
