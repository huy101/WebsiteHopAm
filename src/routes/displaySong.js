// Route để lấy một bài hát theo slug
const express = require('express');
const router = express.Router();
const { Song} = require('../models/song'); 
const mongoose = require("mongoose");
// router.get('/:slug', async (req, res) => {
//     const slug = req.params.slug; // Lấy slug từ URL

//     try {
//         // Tìm bài hát theo slug
//         const song = await Song.findOne({ slug });
//          // Sử dụng findOne để tìm bài hát theo slug
        
//          console.log(song)
          
//         if (!song) {
//             return res.status(404).json({ message: 'Bài hát không tồn tại' });
//         }
//         return res.status(200).send({
//             message: " successful",
//             song});
            
//     } 
//     catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Có lỗi xảy ra' });
//     }
// });




router.get('/:id', async (req, res) => {
    const id = req.params.id; // Lấy id từ URL
    console.log(id);

    // Kiểm tra xem id có phải là ObjectId hợp lệ hay không
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID không hợp lệ' });
    }

    try {
        // Tìm bài hát theo ObjectId và tăng viewCount lên 1
        const song = await Song.findByIdAndUpdate(
            id,
            { $inc: { viewCount: 1 } }, // Tăng viewCount thêm 1
            { new: true } // Trả về document sau khi cập nhật
        );

        if (!song) {
            return res.status(404).json({ message: 'Bài hát không tồn tại' });
        }

        return res.status(200).send({
            message: "Lấy bài hát thành công",
            song
        });
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra' });
    }
});
    
module.exports = router;
