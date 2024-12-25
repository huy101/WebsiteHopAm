const express = require('express');
const router = express.Router();
const Comment = require('../models/comments');
const Role = require('../models/role');
const Notification = require('../models/notifications');
const { User } = require('../models/user');
const {Song} = require('../models/song');
const mongoose = require("mongoose");
router.post('/', async (req, res) => {
  try {
    const { songId, userId, content, role } = req.body;
    // Tìm bài hát bằng ObjectId
    const song = await Song.findOne({ _id: songId }).select('title');

    if (!song) {
      return res.status(404).json({ message: 'Không tìm thấy bài hát' });
    }

    const songTitle = song.title;
    // Extract mentions from the content
    const mentionPattern = /@([a-zA-Z0-9_]+)/g;
    const mentions = content.match(mentionPattern) || [];

    const mentionedUserIds = []; // To store ObjectIds of mentioned users
    const notifications = [];   // To store notifications

    // Separate admin mentions
    const adminMentions = mentions.filter(mention => mention === '@admin');
    if (adminMentions.length > 0) {
      // Find all admin users
      const admins = await Role.find({ role: 'admin' }).select('userId');
      for (let admin of admins) {
        // Add admin IDs to mentionedUserIds

        // Create notifications for admin users
        const notification = new Notification({
          userId: admin.userId,
          type: 'comment',
          relatedId: songId,
          message: `Bạn đã được tag trong bình luận về bài hát "${songTitle}".`,
          songUrl: `/chord/${songId}`,
        });
        notifications.push(notification);
      }
    }

    // Handle other mentions (non-admin users)
    for (let mention of mentions) {
      if (mention !== '@admin') {
        const username = mention.slice(1); // Remove '@' from mention
        const user = await User.findOne({ username: username });
        if (user) {
          // Add user IDs to mentionedUserIds
          mentionedUserIds.push(user._id);

          // Create notifications for mentioned users
          const notification = new Notification({
            userId: user._id,
            type: 'comment',
            relatedId: songId,
            message: `Bạn đã được tag trong bình luận về bài hát "${songTitle}".`,
            songUrl: `/chord/${songId}`,
          });
          notifications.push(notification);
        }
      }
    }

    // Save the new comment with all mentions
    const newComment = new Comment({
      songId,
      userId,
      content,
      mentions: mentionedUserIds,
    });

    await newComment.save();

    // Save all notifications to the database
    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    res.status(201).json({ message: 'Bình luận đã được thêm thành công', comment: newComment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi thêm bình luận' });
  }
});

module.exports = router;
