const mongoose = require("mongoose");
const Genre = require('./genre');
const Rhythm = require('./rhythm');
const { User } = require("./user");

// Schema for Chord (no changes)
const chordSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});
const Chord = mongoose.model("Chord", chordSchema);

// Updated schema for Song
const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String },
  genre: { type: mongoose.Schema.Types.ObjectId, ref: "Genre", required: true },
  rhythm: { type: mongoose.Schema.Types.ObjectId, ref: "Rhythm", required: true },
  tone: { type: String },
  slug: { type: String, unique: true },
  lyrics: [
    {
      verse: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  user:{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: false  },
  comments: [
    {
       // Or reference user schema if available
      text: String,
      date: { type: Date, default: Date.now },
    },
  ],
  viewCount: { type: Number, default: 0 }, // Track song views
});

const Song = mongoose.model("Song", songSchema);

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
