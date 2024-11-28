const express = require('express');
const router = express.Router();
const Song = require('../models/song'); // Giả sử bạn có một model bài hát Song

// Route phân trang cho danh sách bài hát
// Route phân trang dùng chung
router.get('/paginate', async (req, res) => {
  let perPage = 10; // Số bài hát mỗi trang
  let page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là 1

  // Lấy các bộ lọc từ query params
  const { genreId, rhythmId, artistName } = req.query;

  // Tạo bộ lọc động
  let query = {};

  // Thêm điều kiện lọc theo thể loại nếu có
  if (genreId && mongoose.Types.ObjectId.isValid(genreId)) {
    query.genre = genreId;
  }

  // Thêm điều kiện lọc theo điệu nếu có
  if (rhythmId && mongoose.Types.ObjectId.isValid(rhythmId)) {
    query.rhythm = rhythmId;
  }

  // Thêm điều kiện lọc theo tác giả nếu có
  if (artistName && artistName.trim()) {
    query.artist = { $regex: new RegExp(artistName, 'i') }; // Regex để tìm tên không phân biệt chữ hoa/thường
  }

  try {
    // Lấy danh sách bài hát theo bộ lọc
    const songs = await Song.find(query)
      .skip((perPage * (page - 1))) // Bỏ qua bài hát của các trang trước
      .limit(perPage); // Giới hạn số bài hát trong 1 trang

    // Đếm tổng số bài hát thỏa mãn bộ lọc
    const count = await Song.countDocuments(query);

    res.status(200).json({
      songs, // Danh sách bài hát trong trang hiện tại
      currentPage: page, // Trang hiện tại
      totalPages: Math.ceil(count / perPage), // Tổng số trang
      totalSongs: count, // Tổng số bài hát
    });
  } catch (error) {
    console.error('Error fetching songs:', error);
    res.status(500).json({ message: 'Failed to fetch songs', error });
  }
});


module.exports = router;
