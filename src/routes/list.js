// routes/songRoutes.js
const express = require('express');
const { Song } = require('../models/song');
const router = express.Router();
const mongoose = require("mongoose");
const {User}=require('../models/user')
// Fetch songs by genre
router.get("/genre/:genreId", async (req, res) => {
  const { genreId } = req.params;

  // Check if genreId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(genreId)) {
    return res.status(400).json({ error: "Invalid genre ID" });
  }

  try {
    const songs = await Song.find({ genre: genreId });
    res.json(songs);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching songs" });
  }
});
router.get("/rhythm/:rhythmId", async (req, res) => {
  const { rhythmId } = req.params;

  // Check if genreId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(rhythmId)) {
    return res.status(400).json({ error: "Invalid genre ID" });
  }

  try {
    const songs = await Song.find({ rhythm: rhythmId });
    res.json(songs);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching songs" });
  }
});
router.get("/artist/:name", async (req, res) => {
  const { name } = req.params;

  // Kiểm tra nếu name không rỗng
  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Invalid artist name" });
  }

  try {
    const songs = await Song.find({ artist: name });
    res.json(songs);
    console.log(songs);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching songs" });
  }
});
router.get('/search/:query', async (req, res) => {
  const query = req.params.query;

  if (!query) {
    return res.status(400).send({ message: 'Search query is required' });
  }

  try {
    const songs = await Song.find({
      $or: [
        { title: { $regex: new RegExp(query, 'i') } }, // Tìm kiếm tiêu đề
        { 'lyrics.verse': { $regex: new RegExp(query, 'i') } }, // Tìm kiếm lời bài hát
        { 'comments.text': { $regex: new RegExp(query, 'i') } }, // Tìm kiếm trong bình luận
      ],
    });

    res.status(200).send(songs);
  } catch (error) {
    console.error('Error during song search:', error.message);
    res.status(500).send({ message: 'Failed to search for songs' });
  }
});
// Add a song to favorites
router.post('/:userId/favorites', async (req, res) => {
  const { userId } = req.params;
  const { songId } = req.body;

  try {
    // Update user's favorites
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { favorites: songId } }, // Avoid duplicates
      { new: true } // Return updated document
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Song added to favorites', favorites: user.favorites });
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ message: 'Error adding favorite', error });
  }
});
// Remove a song from favorites
router.delete('/:userId/favorites/:songId', async (req, res) => {
  const { userId, songId } = req.params;

  try {
    // Update user's favorites
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { favorites: songId } }, // Remove songId
      { new: true } // Return updated document
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Song removed from favorites', favorites: user.favorites });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ message: 'Error removing favorite', error });
  }
});
// Check if a song is in the favorites
router.get('/:userId/favorites/:songId', async (req, res) => {
  const { userId, songId } = req.params;

  try {
    // Find user and check if songId exists in favorites
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isLiked = user.favorites.includes(songId);
    res.status(200).json({ isLiked });
  } catch (error) {
    console.error('Error checking favorite:', error);
    res.status(500).json({ message: 'Error checking favorite', error });
  }
});// Get the list of favorite songs for a user
router.get('/:userId/favorites', async (req, res) => {
  const { userId } = req.params;

  try {
    // Find user and populate their favorite songs
    const user = await User.findById(userId).populate('favorites');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const favoriteSongs = await Song.find({ _id: { $in: user.favorites } });
    res.status(200).json(favoriteSongs);
  } catch (error) {
    console.error('Error fetching favorite songs:', error);
    res.status(500).json({ message: 'Error fetching favorite songs', error });
  }
});


// Fetch songs uploaded in the last 7 days
router.get('/recent', async (req, res) => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7); // Lấy thời gian cách đây 7 ngày

  try {
    const recentSongs = await Song.find({ createdAt: { $gte: oneWeekAgo } }).sort({ createdAt: -1 }); // Sắp xếp mới nhất ở trên cùng
    res.status(200).json(recentSongs);
  } catch (error) {
    console.error('Error fetching recent songs:', error);
    res.status(500).json({ message: 'Error fetching recent songs', error });
  }
});

// Fetch songs by composer


module.exports = router;
