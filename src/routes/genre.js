// routes/genreRoutes.js
const express = require('express');
const router = express.Router();
const Genre = require('../models/genre'); // Model cho thể loại

// Route để lấy tất cả thể loại
router.get('/', async (req, res) => {
    try {
        const genres = await Genre.find(); // Lấy tất cả thể loại từ cơ sở dữ liệu
        res.json(genres);
        console.log(genres) // Trả về danh sách thể loại
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Không thể lấy danh sách thể loại' });
    }
});

module.exports = router;
