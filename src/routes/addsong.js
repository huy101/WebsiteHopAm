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
 // Để phân tích JSON trong request body
 const Notification = require('../models/notifications');
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

router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const updateFields = req.body;

  console.log("Update Fields Received:", updateFields);

  try {
    // Chuyển đổi genreId -> genre, rhythmId -> rhythm nếu có
    if (updateFields.genreId) {
      updateFields.genre = updateFields.genreId;
      delete updateFields.genreId;
    }
    if (updateFields.rhythmId) {
      updateFields.rhythm = updateFields.rhythmId;
      delete updateFields.rhythmId;
    }
   
    // Lấy bài hát hiện tại từ cơ sở dữ liệu
    const song = await Song.findById(id);
    if (!song) {
      return res.status(404).json({ message: 'Bài hát không tồn tại' });
    }

    // Cập nhật bài hát
    const updatedSong = await Song.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true } // Trả về tài liệu đã cập nhật, kiểm tra ràng buộc schema
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


router.post('/add', checkAdmin, async (req, res) => {
  try {
    const { title, artist, genre, rhythm, tone, lyrics, videoId, userId } = req.body;

    console.log(req.body);

    const existingSong = await Song.findOne({ title, artist });
    if (existingSong) {
      return res.status(409).send({ message: 'Song already exists.' });
    }

    // Tạo bài hát với status dựa trên quyền admin
    const song = new Song({
      title,
      artist,
      genre,
      rhythm,
      tone: tone || 'C',
      lyrics: lyrics || [],
      videoId,
      userId,
      status: req.isAdmin ? true : false, // Nếu là admin thì status true
    });

    // Lưu bài hát
    await song.save();

    // Chỉ gửi thông báo nếu không phải admin
    if (!req.isAdmin) {
      const notifications = [];
      const admins = await Role.find({ role: 'admin' }).select('userId');

      for (let admin of admins) {
        const notification = new Notification({
          userId: admin.userId,
          type: 'song',
          relatedId: song._id,
          message: ` Người dùng vừa thêm bài hát mới.`,
          songUrl: `/admin`,
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
