const Room = require('../models/Room');

// helper function to generate a unique room ID
function generateRoomID() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let roomID = '';
    for (let i = 0; i < 6; i++) {
        roomID += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return roomID;
}


// create room
const createRoom = async (req, res) => {
    try {
        // catch data from the frontend
        const { hostName, expectedParticipants } = req.body;

        // validation
        if (!hostName || hostName.trim() === "") {
            return res.status(400).json({ error: 'Host name is required' });
        }
        if (!expectedParticipants || expectedParticipants < 1) {
            return res.status(400).json({ error: 'Expected participants must be at least 1' });
        }

        console.log('Received create-room request:', { hostName, expectedParticipants });

        // generate a unique room ID
        const roomID = generateRoomID();

        // save to Database
        const newRoom = await Room.create({
            roomID: roomID,
            host: hostName,
            participantNumber: expectedParticipants,
            participants: [
                { name: hostName, role: 'host', status: 'joined' }
            ],
            status: "waiting"
        });      
        
        console.log('Generated room ID:', roomID);

        // send data back to the frontend
        res.json({
            roomID: roomID,
            status: "waiting"
        });
        
    } catch (error) {
        console.error('Error creating room:', error);
        res.status(500).json({ error: 'Failed to create room' });
    }  
};

// join room
const joinRoom = async (req, res) => {
    try {
        const { participantName, roomID } = req.body;

        // validation
        if (!participantName || participantName.trim() === "") {
            return res.status(400).json({ error: 'Participant name is required' });
        }
        if (!roomID || roomID.trim() === "") {
            return res.status(400).json({ error: 'Room ID is required' });
        }

        console.log('Received join-room request:', { participantName, roomID });

        // find the room
        const room = await Room.findOne({ roomID: roomID });

        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        // only allow joining if room is still waiting
        if (room.status !== 'waiting') {
            return res.status(403).json({ error: 'Room is no longer accepting participants' });
        }

        // prevent duplicate participant names
        const alreadyJoined = room.participants.some(p => p.name === participantName.trim());
        if (alreadyJoined) {
            return res.status(409).json({ error: 'A participant with that name is already in this room' });
        }

        // add participant to the room
        room.participants.push({ name: participantName.trim(), role: 'guest', status: 'joined' });
        await room.save();

        console.log(`${participantName} joined room ${roomID}`);

        // notify host's lobby via socket.io
        const io = req.app.get('io');
        io.to(roomID).emit('participant-joined', {
            participantName: participantName.trim(),
            participants: room.participants
        });

        // send data back to the frontend
        res.json({
            message: 'Joined successfully',
            room: {
                roomID: room.roomID,
                host: room.host,
                participantNumber: room.participantNumber,
                participants: room.participants,
                status: room.status,
                createdAt: room.createdAt
            }
        });

    } catch (error) {
        console.error('Error joining room:', error);
        res.status(500).json({ error: 'Failed to join room' });
    }
};

// get room info
const getRoom = async (req, res) => {
    try {
        const { roomID } = req.params;

        // search the database for the room with the given roomID
        const room = await Room.findOne({ roomID: roomID });
        
        if (room) {
            res.json(room);
        } else {
            res.status(404).json({ error: 'Room not found' });
        }
    } catch (error) {
        console.error('Error fetching room:', error);
        res.status(500).json({ error: 'Failed to fetch room' });
    }
};

module.exports = {
    createRoom,
    joinRoom,
    getRoom
};
