const express = require('express');
const router = express.Router();
const { createRoom, getRoom } = require('../controllers/roomController');
const { movieNight, submitVote, getResults } = require('../controllers/movieController');


// create-room
router.post('/create-room', createRoom);

// join-room
router.post('/join-room', joinRoom);

// get-room
router.get('/room/:roomID', getRoom);

// movie-night
router.post('/:roomID/start', movieNight);

// submit-vote
router.post('/:roomID/vote', submitVote);

// get-results
router.get('/:roomID/results', getResults);

module.exports = router;
