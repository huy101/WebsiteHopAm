// routes/rhythmRoutes.js
const express = require('express');
const router = express.Router();
const Rhythm = require('../models/rhythm'); // Model cho điệu nhạc

// Route để lấy tất cả điệu nhạc
router.get('/', async (req, res) => {
    try {
        const rhythms = await Rhythm.find(); // Lấy tất cả điệu nhạc từ cơ sở dữ liệu
        res.json(rhythms); // Trả về danh sách điệu nhạc
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Không thể lấy danh sách điệu nhạc' });
    }
});

module.exports = router;
