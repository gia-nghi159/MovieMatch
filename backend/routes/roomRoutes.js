const express = require('express');
const router = express.Router();
const { createRoom, getRoom } = require('../controllers/roomController');


// create-room
router.post('/create-room', createRoom);

// get-room
router.get('/room/:roomID', getRoom);

module.exports = router;