const mongoose = require('mongoose');
const genreSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Tên thể loại
});

// Model cho bảng Genre
const Genre = mongoose.model("Genre", genreSchema);
module.exports = Genre;
