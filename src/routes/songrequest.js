    const SongRequest = require("../models/songRequestSchema");
    const router = require("express").Router();
    const { User } = require("../models/user");
        const {Song }= require("../models/song"); // Mô hình Song
        const Role = require('../models/role');
        const Notification = require('../models/notifications');
        const {Artist} = require('../models/artist');
        const checkAdmin = require('../middleware/checkAdmin');
        const mongoose = require("mongoose");
// API tạo bài hát từ yêu cầu
router.post("/approve/:requestId",checkAdmin, async (req, res) => {
  const { requestId } = req.params;
  const {
    title,
    artist,
    lyrics,
    videoId,
    genreId,
    tone,
    rhythmId,
    status,
    userId,
  } = req.body;

  // Validate required fields
  if (!title || !genreId || !userId) {
    return res
      .status(400)
      .json({ message: "Các trường bắt buộc không được để trống." });
  }

  // Check if artist is an array
  if (!Array.isArray(artist)) {
    return res
      .status(400)
      .json({ message: "Trường artist phải là một mảng các ObjectId hoặc tên nghệ sĩ." });
  }

  try {
    // Ensure all artists exist or create new ones
    const artistIds = await Promise.all(
      artist.map(async (artistInput) => {
        // If the input is a valid ObjectId, check if the artist exists
        if (mongoose.Types.ObjectId.isValid(artistInput)) {
          const existingArtist = await Artist.findById(artistInput);
          if (existingArtist) {
            return existingArtist._id;
          }
        }

        // Otherwise, assume it's a name and try to find or create the artist
        const existingArtistByName = await Artist.findOne({ name: artistInput });
        if (existingArtistByName) {
          return existingArtistByName._id;
        }

        // Create a new artist if not found
        const newArtist = new Artist({ name: artistInput });
        await newArtist.save();
        return newArtist._id;
      })
    );

    // Check for duplicate song (by title and artist)
    const existingSong = await Song.findOne({
      title,
      artist: { $all: artistIds }, // Kiểm tra trùng với tất cả nghệ sĩ trong mảng
    });
    if (existingSong) {
      return res.status(409).send({ message: "Song already exists." });
    }

    const request = await SongRequest.findById(requestId);
    if (!request) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy yêu cầu bài hát." });
    }

    // Create new song
    const newSong = new Song({
      title,
      artist: artistIds, // Sử dụng danh sách artist đã được xác thực hoặc tạo mới
      lyrics,
      videoId,
      genre: genreId,
      tone,
      rhythm: rhythmId || null, // Handle missing rhythmId
      status,
      userId,
    });

    await newSong.save();

    // Update request status to "approved"
    request.status = true;
    await request.save();

    // Create notification
    if(!req.isAdmin){
    await Notification.create({
      userId: request.userId, // Người đã gửi yêu cầu
      type: "request",
      relatedId: newSong._id,
      message: `Yêu cầu bài hát "${title}" của bạn đã được phê duyệt.`,
      songUrl: `/chord/${newSong._id}`, // Đường dẫn đến bài hát
    });
  }
    res.status(200).json({
      message: "Bài hát đã được tạo thành công!",
      song: newSong,
    });
  } catch (error) {
    console.error("Lỗi khi tạo bài hát:", error);
    res.status(500).json({ message: "Lỗi khi tạo bài hát", error });
  }
});



router.delete("/multiple", async (req, res) => {
console.log(req.body);
const { requestIds } = req.body;
  // Kiểm tra nếu requestIds là mảng và không rỗng
  if (!Array.isArray(requestIds) || requestIds.length === 0) {
    return res.status(400).json({ message: "Vui lòng cung cấp một mảng các requestId hợp lệ." });
  }

  try {
    // Xóa các yêu cầu bài hát theo danh sách requestIds
    const result = await SongRequest.deleteMany({ _id: { $in: requestIds } });

    // Kiểm tra xem có yêu cầu nào bị xóa không
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Không tìm thấy yêu cầu bài hát nào để xóa." });
    }

    res.status(200).json({
      message: `${result.deletedCount} yêu cầu bài hát đã được xóa thành công.`,
    });
  } catch (error) {
    console.error("Lỗi khi xóa yêu cầu bài hát:", error);
    res.status(500).json({ message: "Lỗi khi xóa yêu cầu bài hát", error });
  }
});


router.post("/", checkAdmin, async (req, res) => {
  const { title, artist, lyrics, videoId, userId } = req.body;
  console.log(req.body);  // Kiểm tra xem req.body có đúng không
  const notifications = [];

  // Xác định thời gian bắt đầu và kết thúc của ngày hôm nay
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  try {
    // Kiểm tra nếu người dùng đã gửi yêu cầu trong ngày hôm nay
    const existingRequest = await SongRequest.findOne({
      userId,
      requestedAt: { $gte: startOfDay, $lte: endOfDay },
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "Bạn chỉ có thể yêu cầu bài hát một lần mỗi ngày!",
      });
    }

    // Ensure artist is an array of ObjectIds referencing the Artist model
    const artistIds = [];
    for (const artistName of artist) {
      const existingArtist = await Artist.findOne({ name: artistName });
      if (existingArtist) {
        artistIds.push(existingArtist._id); // Use existing artist ObjectId
      } else {
        // If artist doesn't exist, create a new one
        const newArtist = new Artist({ name: artistName });
        const savedArtist = await newArtist.save();
        artistIds.push(savedArtist._id); // Use new artist ObjectId
      }
    }

    // Tạo yêu cầu bài hát mới
    const newRequest = new SongRequest({
      title,
      artist: artistIds, // Store artist as an array of ObjectIds
      lyrics,
      videoId,
      userId,
    });

    // Lưu yêu cầu vào cơ sở dữ liệu
    await newRequest.save();

    // Notify admins if the user is not an admin
    if (!req.isAdmin) {
      const admins = await Role.find({ role: 'admin' }).select('userId');
      for (let admin of admins) {
        const notification = new Notification({
          userId: admin.userId,
          type: 'request',
          relatedId: newRequest._id,
          message: `Người dùng đã yêu cầu bài hát mới: "${title}" của ${artist}.`,
          songUrl: "/admin",
        });
        notifications.push(notification);
      }

      if (notifications.length > 0) await Notification.insertMany(notifications);
    }

    res.status(200).json({ message: "Yêu cầu bài hát đã được gửi thành công!" });
  } catch (error) {
    console.error("Lỗi khi xử lý yêu cầu bài hát:", error);
    res.status(500).json({ message: "Lỗi khi xử lý yêu cầu bài hát", error });
  }
});


router.get("/list", async (req, res) => {
  try {
    // Lấy các yêu cầu bài hát có status là "pending" và sắp xếp theo thời gian
    const requests = await SongRequest.find()
      .populate("artist", "name")
      .sort({ requestedAt: -1 })
      .populate("userId", "username"); // Chỉ lấy tên người dùng từ User model

    // Định dạng thời gian (ngày/tháng/năm) cho từng yêu cầu
    const formattedRequests = requests.map((request) => {
      const formattedDate = new Date(request.requestedAt).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      return {
        ...request._doc,
        requestedAt: formattedDate, // Ghi đè lại thời gian đã định dạng
      };
    });

    // Trả về danh sách yêu cầu với thời gian đã định dạng
    res.status(200).json(formattedRequests);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy danh sách yêu cầu bài hát", error });
  }
});


// API lấy một request cụ thể
router.get("/:requestId", async (req, res) => {
  const { requestId } = req.params;

  try {

    // Tìm yêu cầu bài hát dựa trên requestId
    const request = await SongRequest.findById(requestId).populate("artist", "name");

    // Kiểm tra nếu request không tồn tại
    if (!request) {
      return res.status(404).json({ message: "Không tìm thấy yêu cầu bài hát" });
    }

    // Trả về thông tin yêu cầu
    res.status(200).json({
      _id: request._id,
      title: request.title,
      artist: request.artist.map(artist => artist.name),
      lyrics: request.lyrics,
      videoId: request.videoId,
      userId: request.userId, // Tên người dùng
      requestedAt: new Date(request.requestedAt).toLocaleString("vi-VN"),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy thông tin chi tiết yêu cầu bài hát", error });
  }
});



    module.exports = router;