const express = require('express');
const router = express.Router();
const { createRoom, getRoom } = require('../controllers/roomController');
const { movieNight, submitVote } = require('../controllers/movieController');


// create-room
router.post('/create-room', createRoom);

// get-room
router.get('/room/:roomID', getRoom);

// movie-night
router.post('/:roomID/start', movieNight);

// submit-vote
router.post('/:roomID/vote', submitVote);

module.exports = router;