const express = require('express');
const { Song, Chord } = require('../models/song'); // Đảm bảo đường dẫn tới file models là chính xác
const mongoose = require('mongoose');
const Genre = require('../models/genre');
const Rhythm = require('../models/rhythm');
const Role = require('../models/role');
const SongRequest=require('../models/songRequestSchema.js')
const Comment = require('../models/comments');
const {User }= require('../models/user');
const router = require("express").Router();
const checkAdmin = require('../middleware/checkAdmin');
const {Artist} =require('../models/artist')
 // Để phân tích JSON trong request body
 const Notification = require('../models/notifications');
router.get('/:id', async (req, res) => {
    const { id } = req.params; // Trích xuất id từ params

    // Kiểm tra xem ID có hợp lệ hay không
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID không hợp lệ' });
    }

    try {
        // Tìm và cập nhật viewCount và viewMonth
        const song = await Song.findByIdAndUpdate(
            id,
            { $inc: { viewCount: 1, viewMonth: 1 } }, // Tăng cả viewCount và viewMonth
            { new: true } // Lấy document đã cập nhật
        )
        .populate('rhythm', 'name') // Populate trường rhythm và chỉ lấy name
        .populate('genre', 'name') // Populate trường genre và chỉ lấy name
        .populate('artist', 'name'); // Populate trường artist và chỉ lấy name

        // Nếu không tìm thấy bài hát
        if (!song) {
            return res.status(404).json({ message: 'Không tìm thấy bài hát' });
        }

        // Trả về bài hát đã cập nhật
        return res.status(200).json({ song });
    } catch (error) {
        console.error('Lỗi:', error);
        return res.status(500).json({ message: 'Có lỗi xảy ra' });
    }
});

 
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const updateFields = req.body;

  console.log("Update Fields Received:", updateFields);

  try {
    // Convert genreId -> genre, rhythmId -> rhythm if provided
    if (updateFields.genreId) {
      updateFields.genre = updateFields.genreId;
      delete updateFields.genreId;
    }
    if (updateFields.rhythmId) {
      updateFields.rhythm = updateFields.rhythmId;
      delete updateFields.rhythmId;
    }

    // Handle artist field
    if (updateFields.artist) {
      const artistNames = updateFields.artist.split(',').map((name) => name.trim()); // Split artists by commas and trim spaces
      const artistIds = [];

      for (const name of artistNames) {
        let artist = await Artist.findOne({ name });

        if (!artist) {
          // Create a new artist if it doesn't exist
          artist = new Artist({ name });
          await artist.save();
        }

        artistIds.push(artist._id); // Collect artist IDs
      }

      updateFields.artist = artistIds; // Update the artist field with the array of IDs
    }

    // Find the current song in the database
    const song = await Song.findById(id);
    if (!song) {
      return res.status(404).json({ message: 'Bài hát không tồn tại' });
    }
    if(song.status==false){
    await Notification.create({
      userId: song.userId, // Người đã gửi yêu cầu
      type: "song",
      relatedId: song._id,
      message: `Bài hát "${song.title}" của bạn đã được phê duyệt.`,
      songUrl: `/chord/${song._id}`, // Đường dẫn đến bài hát
    });}
    // Update the song
    const updatedSong = await Song.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true } // Return the updated document and run schema validators
    );

    if (!updatedSong) {
      return res.status(400).json({ message: 'Không có thay đổi nào để cập nhật' });
    }

    res.status(200).json({ message: 'Cập nhật bài hát thành công', song: updatedSong });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi cập nhật bài hát' });
  }
});







// Thêm bài hát mới



// Assuming `User` model has a role property to check if the user is an admin


router.post('/add',checkAdmin, async (req, res) => {
  try {
    const { title, artist, genre, rhythm, tone, lyrics, videoId, userId } = req.body;

    

    const artistIds = [];
    for (const artistName of artist) {
      const existingArtist = await Artist.findOne({ name: artistName });
      if (existingArtist) {
        artistIds.push(existingArtist._id); // Use existing artist ObjectId
      } else {
        // If artist doesn't exist, you can either create a new one or handle the case
        const newArtist = new Artist({ name: artistName });
        const savedArtist = await newArtist.save();
        artistIds.push(savedArtist._id); // Use new artist ObjectId
      }
    }

    // Check if song already exists with the same title and associated artists
    const existingSong = await Song.findOne({
      title: title,
      artist: { $all: artistIds }  // Check if the song has all the artists in the artistIds array
    });

    if (existingSong) {
      return res.status(409).send({ message: 'Song with the same title and artist(s) already exists.' });
    }
    console.log(req.body);
    // Create the new song
    const song = new Song({
      title,
      artist: artistIds,  // Store the artist IDs
      genre,
      rhythm,
      tone: tone || 'C',
      lyrics: lyrics || [],
      videoId,
      userId,
      status: req.isAdmin ? true : false, // If admin, set status to true
    });
 
    // Save the song
    await song.save();

    // Notify admins if the user is not an admin
    if (!req.isAdmin) {
      const notifications = [];
      const admins = await Role.find({ role: 'admin' }).select('userId');

      for (let admin of admins) {
        const notification = new Notification({
          userId: admin.userId,
          type: 'song',
          relatedId: song._id,
          message: ` Người dùng thêm bài hát mới.`,
          songUrl: `/admin`,  // This URL might be changed based on your application routing
        });
        notifications.push(notification);
      }

      if (notifications.length > 0) await Notification.insertMany(notifications);
    }

    return res.status(201).send(song);
  } catch (error) {
    console.error(error);
    return res.status(400).send({ message: error.message });
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
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid song ID format' });
  }

  try {
    // Xóa bài hát
    const deletedSong = await Song.findByIdAndDelete(id);
    if (!deletedSong) {
      return res.status(404).json({ message: 'Song not found' });
    }

    // Xóa comments liên quan
    await Comment.deleteMany({ songId: id });

    // Xóa bài hát khỏi danh sách yêu thích
    await User.updateMany(
      { favorites : id },
      { $pull: { favorites : id } }
    );

    // Thực hiện các thao tác khác nếu cần, như xóa view count hoặc các tham chiếu khác

    res.status(200).json({ message: 'Song and related data deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;
