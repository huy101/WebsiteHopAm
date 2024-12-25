// routes/songRoutes.js
const express = require('express');
const { Song } = require('../models/song');
const router = express.Router();
const mongoose = require("mongoose");
const {User}=require('../models/user')
const checkApproval=require('../middleware/checkAproval')
const Fuse = require('fuse.js');
// Fetch songs by genre
router.get("/all", async (req, res) => {
  try {
    // Chỉ lấy các trường id, title, và artist
    const songs = await Song.find();
    res.json(songs);
  } catch (error) { 
    res.status(500).json({ error: "An error occurred while fetching songs" });
  }
});
router.get("/pending", async (req, res) => {
  try {
    // Chỉ lấy các bài hát cần phê duyệt (approval: false)
    const pendingSongs = await Song.find({ approval: false }, 'id title artist genre rhythm tone'); 
    // Chỉ lấy các trường cần thiết
    res.json(pendingSongs);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching pending songs" });
  }
});


// Fetch songs by genre
router.get("/genre/:genreId", checkApproval, async (req, res) => {
  const { genreId } = req.params;

  // Check if genreId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(genreId)) {
    return res.status(400).json({ error: "Invalid genre ID" });
  }

  try {
    const songs = await Song.find({ genre: genreId,...req.approvalFilter });
    res.json(songs);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching songs" });
  }
});
router.get("/rhythm/:rhythmId",checkApproval, async (req, res) => {
  const { rhythmId } = req.params;

  // Check if genreId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(rhythmId)) {
    return res.status(400).json({ error: "Invalid genre ID" });
  }

  try {
    const songs = await Song.find({ rhythm: rhythmId ,...req.approvalFilter });
    res.json(songs);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching songs" });
  }
});
router.get("/artist/:name",checkApproval, async (req, res) => {
  const { name } = req.params;

  // Kiểm tra nếu name không rỗng
  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Invalid artist name" });
  }

  try {
    const songs = await Song.find({ artist: name,...req.approvalFilter });
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
    const allSongs = await Song.find(); // Lấy tất cả bài hát từ cơ sở dữ liệu

    // Cấu hình Fuse.js
    const options = {
      keys: ['title', 'lyrics.verse', 'comments.text'], // Các trường cần tìm kiếm
      threshold: 0.3, // Mức độ gần giống (0.0: chính xác, 1.0: chấp nhận mọi kết quả)
    };

    const fuse = new Fuse(allSongs, options);
    const results = fuse.search(query).map(result => result.item); // Trả về các kết quả khớp

    res.status(200).send(results);
  } catch (error) {
    console.error('Error during song search:', error.message);
    res.status(500).send({ message: 'Failed to search for songs' });
  }
});

// Fetch songs posted by a user with status true
router.get('/user/:userId/posted', checkApproval, async (req, res) => {
  const { userId } = req.params;

  try {
    // Tìm tất cả bài hát của người dùng có status là true
    const songs = await Song.find({ userId: userId, status: true, ...req.approvalFilter });
    res.status(200).json(songs);
  } catch (error) {
    console.error('Error fetching posted songs:', error);
    res.status(500).json({ error: 'An error occurred while fetching posted songs' });
  }
});

// Add a song to favorites
router.post('/user/:userId/favorites', async (req, res) => {
  const { userId } = req.params;
  const { songId } = req.body;

  try {
    // Update user's favorites
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { favorites: songId } },  // Avoid duplicates
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
router.delete('/user/:userId/favorites/:songId', async (req, res) => {
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
router.get('/user/:userId/favorites/:songId', async (req, res) => {
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
router.get('/user/:userId/favorites', async (req, res) => {
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
// Add this route to your routes/songRoutes.js file

// Fetch most viewed songs in the current month
router.get('/popular', checkApproval, async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); // First day of the current month
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Last day of the current month

    console.log('Start of Month:', startOfMonth);
    console.log('End of Month:', endOfMonth);

    // Combine the approval filter with the date range filter
    const filter = {
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
      ...req.approvalFilter,
    };

    // Fetch popular songs created in the current month and sort by view count
    const popularSongs = await Song.find(filter)
      .sort({ viewCount: -1 })
      .limit(10);

    console.log('Popular Songs:', popularSongs);

    res.status(200).json(popularSongs);
  } catch (error) {
    console.error('Error fetching popular songs:', error);
    res.status(500).json({ message: 'Error fetching popular songs', error });
  }
});



// Fetch songs uploaded in the last 7 days
router.get('/recent',checkApproval, async (req, res) => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7); // Lấy thời gian cách đây 7 ngày

  try {
    const recentSongs = await Song.find({ createdAt: { $gte: oneWeekAgo },...req.approvalFilter  }).sort({ createdAt: -1 }); // Sắp xếp mới nhất ở trên cùng
    res.status(200).json(recentSongs);
  } catch (error) {
    console.error('Error fetching recent songs:', error);
    res.status(500).json({ message: 'Error fetching recent songs', error });
  }
});

// Fetch songs by composer


module.exports = router;
