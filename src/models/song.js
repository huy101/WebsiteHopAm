const mongoose = require("mongoose");
const Genre=require('./genre')
const rhythm =require('./rhythm')
// Schema cho bảng thể loại


// Schema cho bảng điệu


// Schema cho hợp âm
const chordSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Tên hợp âm là bắt buộc
  },
});

// Model cho bảng hợp âm
const Chord = mongoose.model("Chord", chordSchema);

// Schema chính cho bài hát
const songSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Tên bài hát
  artist: { type: String }, // Tên nhạc sĩ sáng tác
  genre: { type: mongoose.Schema.Types.ObjectId, ref: "Genre", required: true }, // Thể loại (tham chiếu đến bảng Genre)
  rhythm: { type: mongoose.Schema.Types.ObjectId, ref: "Rhythm", required: true }, // Điệu (tham chiếu đến bảng Rhythm)
  tone: { type: String }, // Tone chủ của bài hát
  lyrics: [
    {
      verse: String,
      chords: [String],
    },
  ],
  createdAt: { type: Date, default: Date.now }, // Ngày tạo bài hát
  updatedAt: { type: Date, default: Date.now }, // Ngày cập nhật bài hát
});

// Model cho bảng bài hát
const Song = mongoose.model("Song", songSchema);

// Hàm để tạo thể loại và điệu
const createGenresAndRhythms = async () => {
  // Mảng thể loại
  const genres = [
    { name: "Nhạc Vàng" },
    { name: "Nhạc Trẻ" },
    { name: "Nhạc Cổ Điển" },
    { name: "Nhạc Pop" },
    { name: "Nhạc Đỏ" },
  ];

  // Mảng điệu
  const rhythms = [
    { name: "Bolero" },
    { name: "Ballad" },
    { name: "Rumba" },
    { name: "Waltz" },
    { name: "Disco" },
    { name: "Chachacha" },
    { name: "Rap" },

  ];

  try {
    // Kiểm tra và lưu thể loại
    for (const genre of genres) {
      const existingGenre = await Genre.findOne({ name: genre.name });
      if (!existingGenre) {
        await Genre.create(genre);
        console.log(`Genre created: ${genre.name}`);
      } else {
        console.log(`Genre already exists: ${genre.name}`);
      }
    }

    // Kiểm tra và lưu điệu
    for (const rhythm of rhythms) {
      const existingRhythm = await Rhythm.findOne({ name: rhythm.name });
      if (!existingRhythm) {
        await Rhythm.create(rhythm);
        console.log(`Rhythm created: ${rhythm.name}`);
      } else {
        console.log(`Rhythm already exists: ${rhythm.name}`);
      }
    }
  } catch (error) {
    console.error("Error creating genres and rhythms:", error);
  }
};

// Gọi hàm để tạo thể loại và điệu
createGenresAndRhythms();

// Xuất tất cả các model
module.exports = { Song, Chord};
