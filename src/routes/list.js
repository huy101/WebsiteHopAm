// routes/songRoutes.js
const express = require('express');
const { Song } = require('../models/song');
const router = express.Router();
const mongoose = require("mongoose");
const {User}=require('../models/user')
const checkApproval=require('../middleware/checkAproval')
const Fuse = require('fuse.js');
const { Artist } = require('../models/artist');
// Fetch songs by genre
router.get("/all", async (req, res) => {
  try {
    const songs = await Song.find().populate('artist', 'name') ;
    res.json(songs);
  } catch (error) { 
    res.status(500).json({ error: "An error occurred while fetching songs" });
  }
});
router.get("/pending", async (req, res) => {
  try {
    const pendingSongs = await Song.find({ approval: false }, 'id title artist genre rhythm tone') // Select necessary fields
      .populate('artist', 'name') // Populate 'artist' with the artist's name
      .exec(); // Execute the query
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
    const songs = await Song.find({ genre: genreId,...req.approvalFilter }).populate('artist', 'name') ;
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
    const songs = await Song.find({ rhythm: rhythmId ,...req.approvalFilter }).populate('artist', 'name') ;
    res.json(songs);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching songs" });
  }
});
router.get("/artist/:name", checkApproval, async (req, res) => {
  const { name } = req.params;

  // Check if name is valid
  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Invalid artist name" });
  }

  try {
    // Find the artist by name
    const artist = await Artist.findOne({ name: name.trim() });

    // If no artist found, return an error
    if (!artist) {
      return res.status(404).json({ error: "Artist not found" });
    }

    // Find songs by artist's ObjectId
    const songs = await Song.find({ artist: artist._id, ...req.approvalFilter })
      .populate('artist', 'name') // Populate artist field to get the name
      .populate('genre', 'name');  // Optionally populate genre field if needed

    res.json(songs);
    console.log(songs);
  } catch (error) {
    console.error('Error fetching songs:', error);
    res.status(500).json({ error: "An error occurred while fetching songs" });
  }
});



router.get('/search/:query', async (req, res) => {
  const query = req.params.query;

  if (!query) {
    return res.status(400).send({ message: 'Search query is required' });
  }

  try {
    const allSongs = await Song.find().populate("artist", "name");

    // Chuẩn hoá dữ liệu: Thêm một trường 'artistNames' là chuỗi kết hợp các tên nghệ sĩ
    const normalizedSongs = allSongs.map(song => ({
      ...song.toObject(), // Chuyển sang object để thao tác dễ dàng
      artistNames: song.artist.map(artist => artist.name).join(", "),
    }));
    // Cấu hình Fuse.js
    const options = {
      keys: ['title','artist.name', 'lyrics.verse', 'comments.text'], // Các trường cần tìm kiếm
      threshold: 0.3, // Mức độ gần giống (0.0: chính xác, 1.0: chấp nhận mọi kết quả)
      caseSensitive: false, // Không phân biệt chữ hoa chữ thường
      ignoreLocation: true,
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
    const songs = await Song.find({ userId: userId, status: true, ...req.approvalFilter }).populate('artist', 'name') ;
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

    const favoriteSongs = await Song.find({ _id: { $in: user.favorites } }).populate('artist', 'name') ;
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
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); // Ngày đầu tiên của tháng hiện tại
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Ngày cuối cùng của tháng hiện tại

    console.log('Start of Month:', startOfMonth);
    console.log('End of Month:', endOfMonth);

    // Kết hợp bộ lọc với viewMonth thay vì viewCount
    const filter = {
      viewMonth: { $gte: 1 }, // Các bài hát có ít nhất 1 lượt xem trong tháng
      createdAt: { $lte: endOfMonth }, // Đảm bảo bài hát đã được tạo trước cuối tháng
      ...req.approvalFilter, // Bao gồm bộ lọc từ middleware `checkApproval`
    };

    // Tìm các bài hát phổ biến theo viewMonth
    const popularSongs = await Song.find(filter)
      .populate('artist', 'name') // Populate thông tin artist, chỉ lấy trường name
      .populate('genre', 'name')  // Populate thông tin genre, chỉ lấy trường name
      .sort({ viewMonth: -1 })    // Sắp xếp theo viewMonth giảm dần
      .limit(10);                 // Giới hạn 10 bài hát phổ biến nhất

    console.log('Popular Songs:', popularSongs);

    // Trả về danh sách các bài hát phổ biến
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
    const recentSongs = await Song.find({ createdAt: { $gte: oneWeekAgo },...req.approvalFilter  })
    .populate('artist', 'name') 
    .sort({ createdAt: -1 }); // Sắp xếp mới nhất ở trên cùng
    res.status(200).json(recentSongs);
  } catch (error) {
    console.error('Error fetching recent songs:', error);
    res.status(500).json({ message: 'Error fetching recent songs', error });
  }
});

// Fetch songs by composer


module.exports = router;
