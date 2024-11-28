const { Song } = require("../models/song");

const router = require("express").Router();
router.get("/", async (req, res) => {
	try {
        const song = await Song.find(); // Lấy tất cả thể loại từ cơ sở dữ liệu
        res.json(song);
        console.log(song) // Trả về danh sách thể loại
    }catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Không thể lấy danh sách thể loại' });
    }
});

module.exports = router;