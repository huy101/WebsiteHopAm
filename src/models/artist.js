const mongoose = require("mongoose");

const artistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // Tên nghệ sĩ, yêu cầu là duy nhất
    bio: { type: String, default: "" }, // Tiểu sử nghệ sĩ (tuỳ chọn)
    profileImage: { type: String, default: "" }, // Hình ảnh đại diện của nghệ sĩ (tuỳ chọn)
  },
  { timestamps: true } // Thêm createdAt và updatedAt tự động
);

const Artist = mongoose.model("Artist", artistSchema);

module.exports = {Artist};
