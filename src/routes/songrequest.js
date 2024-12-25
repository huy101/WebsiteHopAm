    const SongRequest = require("../models/songRequestSchema");
    const router = require("express").Router();
    const { User } = require("../models/user");
        const {Song }= require("../models/song"); // Mô hình Song
        const Role = require('../models/role');
        const Notification = require('../models/notifications');
// API tạo bài hát từ yêu cầu
router.post("/approve/:requestId", async (req, res) => {
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
  const existingSong = await Song.findOne({ title, artist });
    if (existingSong) {
      return res.status(409).send({ message: 'Song already exists.' });
    }
  // Validate required fields
  if (!title || !genreId || !userId) {
    return res.status(400).json({ message: "Các trường bắt buộc không được để trống." });
  }

  try {
    const request = await SongRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Không tìm thấy yêu cầu bài hát" });
    }

    const newSong = new Song({
      title,
      artist,
      lyrics,
      videoId,
      genre: genreId,
      tone,
      rhythm: rhythmId || null, // Handle missing rhythmId
      status,
      userId,
    });

    await newSong.save();
    request.status = "approved";
    await request.save();
    await Notification.create({
      userId: request.userId, // Người đã gửi yêu cầu
      type: "request",
      relatedId: newSong._id,
      message: `Yêu cầu bài hát "${title}" của bạn đã được phê duyệt.`,
      songUrl: `/chord/${newSong._id}`, // Đường dẫn đến bài hát
    });

    res.status(200).json({ message: "Bài hát đã được tạo thành công!", song: newSong });
  } catch (error) {
    console.error("Lỗi khi tạo bài hát:", error);
    res.status(500).json({ message: "Lỗi khi tạo bài hát", error });
  }
   
});



router.post("/", async (req, res) => {
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

    // Tạo yêu cầu bài hát mới
    const newRequest = new SongRequest({
      title,
      artist,
      lyrics,
      videoId,
      userId,
    });

    // Lưu yêu cầu vào cơ sở dữ liệu
    await newRequest.save();
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
    await Notification.insertMany(notifications); 
   
    
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
          .sort({ requestedAt: -1 })
          .populate("userId", "username"); // Chỉ lấy tên người dùng từ User model
          console.log("Kết quả sau populate:", requests);
        // Trả về danh sách yêu cầu
        res.status(200).json(
          requests.map((request) => ({
            _id: request._id,
            title: request.title,
            artist: request.artist,
            userName: request.userId.username, // Tên người dùng
            status: request.status,
            requestedAt: new Date(request.requestedAt).toLocaleDateString("vi-VN"),
          }))
        );
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
    const request = await SongRequest.findById(requestId);

    // Kiểm tra nếu request không tồn tại
    if (!request) {
      return res.status(404).json({ message: "Không tìm thấy yêu cầu bài hát" });
    }

    // Trả về thông tin yêu cầu
    res.status(200).json({
      _id: request._id,
      title: request.title,
      artist: request.artist,
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