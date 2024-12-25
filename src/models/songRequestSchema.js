const mongoose = require("mongoose");
const { User } = require("../models/user");
const songRequestSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    artist: { type: String, required: true },
    lyrics: [
      {
        verse: String,
      },
    ], // Không bắt buộc
    videoId: { type: String, required: true },// Link bài hát, ví dụ YouTube
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Người gửi yêu cầu
    requestedAt: { type: Date, default: Date.now }, // Thời gian gửi yêu cầu
    status: { 
      type: String, 
      enum: ["pending", "approved", "rejected"], 
      default: "pending" // Trạng thái yêu cầu
    },
    songId: { type: mongoose.Schema.Types.ObjectId, ref: "Song" }, // Liên kết đến bài hát nếu yêu cầu được phê duyệt
  },
  { timestamps: true } // Tự động thêm createdAt và updatedAt
);

const SongRequest = mongoose.model("SongRequest", songRequestSchema);

module.exports = SongRequest;
