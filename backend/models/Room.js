const mongoose = require('mongoose');

// Movie schema (embedded in Room)
const movieSchema = new mongoose.Schema({
  ID: { type: Number, required: true },
  title: { type: String, required: true },
  posterPath: { type: String },
  overview: { type: String },
  releaseDate: { type: String },
  voteAverage: { type: Number },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 }
});

// Room schema
const roomSchema = new mongoose.Schema({
    roomID: { type: String, required: true, unique: true },
    host: { type: String, required: true },
    participantNumber: { type: Number, required: true },
    participants: { type: Array, default: [] },
    status: { type: String, default: "waiting" },
    movies: [movieSchema]
});

module.exports = mongoose.model('Room', roomSchema);