const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Song } = require('../models/song');
const Genre = require('../models/genre');
const Rhythm = require('../models/rhythm');

// Lấy thông tin bài hát và tăng viewCount
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    console.log(id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID không hợp lệ' });
    }

    try {
        const song = await Song.findByIdAndUpdate(
            id,
            { $inc: { viewCount: 1 } },
            { new: true }
        ).populate('rhythm', 'name')
         .populate('genre', 'name');
        return res.status(200).send({ song });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra' });
    }
});

// // Cập nhật thông tin bài hát
// router.put('/:id', async (req, res) => {
//     const { id } = req.params;
//     const { title, artist, genre, rhythm, lyrics, chords } = req.body;

//     try {
//         const song = await Song.findById(id);
//         if (!song) {
//             return res.status(404).json({ message: 'Bài hát không tồn tại' });
//         }
        
//         if (title) song.title = title;
//         if (artist) song.artist = artist;
//         if (genre) song.genre = genre;
//         if (rhythm) song.rhythm = rhythm;
//         if (lyrics) song.lyrics = lyrics;

//         const updatedSong = await song.save();
//         res.status(200).json({ message: 'Cập nhật bài hát thành công', song: updatedSong });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Có lỗi xảy ra khi cập nhật bài hát' });
//     }
// });

module.exports = router;