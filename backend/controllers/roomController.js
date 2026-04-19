const Room = require('../models/Room');
const QRCode = require('qrcode');

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
        const { hostName, participantNumber } = req.body;

        // validation
        if (!hostName || hostName.trim() === "") {
            return res.status(400).json({ error: 'Host name is required' });
        }
        if (!participantNumber || participantNumber < 1) {
            return res.status(400).json({ error: 'Participant number must be at least 1' });
        }

        console.log('Received create-room request:', { hostName, participantNumber });

        // generate a unique room ID
        const roomID = generateRoomID();

        // save to Database
        const newRoom = await Room.create({
            roomID: roomID,
            host: hostName,
            participantNumber: participantNumber,
            participants: [
                { name: hostName, role: 'host', status: 'joined' }
            ],
            status: "waiting"
        });

        // generate QR Code
        const frontendBaseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const joinURL = `${frontendBaseUrl}/join?code=${roomID}`;
        const QRCodeURL = await QRCode.toDataURL(joinURL);
        
        console.log('Generated room ID:', roomID);

        // send data back to the frontend
        res.json({
            roomID: roomID,
            QRCodeURL: QRCodeURL,
            status: "waiting"
        });
        
    } catch (error) {
        console.error('Error creating room:', error);
        res.status(500).json({ error: 'Failed to create room' });
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
    getRoom
};