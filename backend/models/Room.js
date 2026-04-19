const mongoose = require('mongoose');

// database schema
const roomSchema = new mongoose.Schema({
    roomId: { type: String, required: true, unique: true },
    host: { type: String, required: true },
    participantNumber: { type: Number, required: true },
    participants: { type: Array, default: [] },
    status: { type: String, default: "waiting" },
    createdAt: { type: Date, default: Date.now } 
});

module.exports = mongoose.model('Room', roomSchema);