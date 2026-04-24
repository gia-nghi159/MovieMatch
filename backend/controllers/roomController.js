const Room = require('../models/Room');

// Helper function
function generateRoomID() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let roomID = '';
    for (let i = 0; i < 6; i++) {
        roomID += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return roomID;
}

// 1. Create room
const createRoom = async (req, res) => {
    try {
        const { hostName, expectedParticipants } = req.body;
        if (!hostName || hostName.trim() === "") {
            return res.status(400).json({ error: 'Host name is required' });
        }
        if (!expectedParticipants || expectedParticipants < 1) {
            return res.status(400).json({ error: 'Expected participants must be at least 1' });
        }

        const roomID = generateRoomID();
        const newRoom = await Room.create({
            roomID: roomID,
            host: hostName,
            participantNumber: expectedParticipants,
            participants: [{ name: hostName, role: 'host', status: 'joined' }],
            status: "waiting"
        });      
        
        res.json({ roomID: roomID, status: "waiting" });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create room' });
    }  
};

// 2. Join room
const joinRoom = async (req, res) => {
    try {
        const { participantName, roomID } = req.body;
        const room = await Room.findOne({ roomID: roomID });

        if (!room) return res.status(404).json({ error: 'Room not found' });
        if (room.status !== 'waiting') return res.status(403).json({ error: 'Room is active' });

        const alreadyJoined = room.participants.some(p => p.name === participantName.trim());
        if (alreadyJoined) return res.status(409).json({ error: 'Name already taken' });

        room.participants.push({ name: participantName.trim(), role: 'guest', status: 'joined' });
        await room.save();

        // Notify other participants in the lobby
        const io = req.app.get('io');
        io.to(roomID).emit('participant-joined', {
            participants: room.participants
        });

        res.json({ message: 'Joined successfully', room });
    } catch (error) {
        res.status(500).json({ error: 'Failed to join room' });
    }
};

// 3. Get room info
const getRoom = async (req, res) => {
    try {
        const { roomID } = req.params;
        const room = await Room.findOne({ roomID: roomID });
        if (room) res.json(room);
        else res.status(404).json({ error: 'Room not found' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch room' });
    }
};


// 4. Start Session
const startSession = async (req, res) => {
    try {
        const { roomID } = req.params;

        
        const room = await Room.findOneAndUpdate(
            { roomID: roomID },
            { status: 'active' },
            { new: true }
        );

        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        
        const io = req.app.get('io');

        
        io.to(roomID).emit('game-started');

        console.log(`Room ${roomID} started! Sending 'game-started' signal.`);

        res.json({ message: 'Session started successfully' });
    } catch (error) {
        console.error('Start session error:', error);
        res.status(500).json({ error: 'Failed to start session' });
    }
};

module.exports = {
    createRoom,
    joinRoom,
    getRoom,
    startSession 
};