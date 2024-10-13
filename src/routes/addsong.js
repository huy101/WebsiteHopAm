const express = require('express');
const { Song, Chord } = require('../models/song'); // Đảm bảo đường dẫn tới file models là chính xác

const router = require("express").Router();
 // Để phân tích JSON trong request body

// Thêm bài hát mới
router.post('/add', async (req, res) => {
  try {
    // Lấy thông tin bài hát từ request body
    const { title, artist, genre, rhythm, tone, lyrics } = req.body;

    // Tạo một bài hát mới
    const song = new Song({
      title,
      artist,
      genre, // Đảm bảo genre là ObjectId đã tồn tại
      rhythm, // Đảm bảo rhythm là ObjectId đã tồn tại
      tone,
      lyrics,
    });

    await song.save(); // Lưu bài hát vào cơ sở dữ liệu

    res.status(201).send(song); // Trả về bài hát vừa tạo
  } catch (error) {
    console.error(error);
    res.status(400).send(error); // Trả về lỗi nếu có
  }
});

// Lấy danh sách bài hát
router.get('/songs', async (req, res) => {
  try {
    const songs = await Song.find().populate('genre rhythm'); // Tải thể loại và điệu
    res.send(songs);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Xóa bài hát
router.delete('/songs/:id', async (req, res) => {
  try {
    const song = await Song.findByIdAndDelete(req.params.id);
    if (!song) {
      return res.status(404).send();
    }
    res.send(song);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;