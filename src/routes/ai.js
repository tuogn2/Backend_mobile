const express = require('express');
const router = express.Router();
const aiController = require('../controller/aiController');

// Tìm phòng theo vị trí
router.get('/search/location', aiController.searchByLocation);

// Tìm phòng theo loại phòng
router.get('/search/room-type', aiController.searchByRoomType);

// Tìm phòng theo giá
router.get('/search/price', aiController.searchByPrice);



router.get('/search/:name', aiController.getRoomByName);



module.exports = router;
