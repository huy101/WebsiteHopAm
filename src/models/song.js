const mongoose = require("mongoose");
const Genre = require('./genre');
const Rhythm = require('./rhythm');
const { User } = require("./user");
const { boolean } = require("joi");

// Schema for Chord (no changes)
const chordSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});
const Chord = mongoose.model("Chord", chordSchema);

// Updated schema for Song
const songSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, index: true },
    artist: { type: String }, // Tham chiếu đến bảng Artist
    genre: { type: mongoose.Schema.Types.ObjectId, ref: "Genre", required: true },
    rhythm: { type: mongoose.Schema.Types.ObjectId, ref: "Rhythm", required: true },
    tone: { type: String, default: "C" }, // Giá trị mặc định cho tone
    status: { type: Boolean, default: false },
    lyrics: [
      {
        verse: String,
      },
    ],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    videoId: { type: String },
    viewCount: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false }, // Xóa mềm
  },
  { timestamps: true } // Tự động thêm createdAt và updatedAt
);

songSchema.index({ title: 1, artist: 1 }); // Tạo chỉ mục để tối ưu hóa tìm kiếm

const Song = mongoose.model("Song", songSchema);

module.exports = Song;


// Function to create Genres and Rhythms (no changes here)
const createGenresAndRhythms = async () => {
  const genres = [
    { name: "Nhạc Vàng" },
    { name: "Nhạc Trẻ" },
    { name: "Nhạc Cổ Điển" },
    { name: "Nhạc Pop" },
    { name: "Nhạc Đỏ" },
  ];

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
    for (const genre of genres) {
      const existingGenre = await Genre.findOne({ name: genre.name });
      if (!existingGenre) {
        await Genre.create(genre);
        console.log(`Genre created: ${genre.name}`);
        console.log(filePath);
      } else {
        console.log(`Genre already exists: ${genre.name}`);
      }
    }

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

createGenresAndRhythms();

module.exports = { Song, Chord };
