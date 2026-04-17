const express = require('express');
const cors = require('cors');
const QRCode = require('qrcode');
require('dotenv').config();

const PORT = process.env.PORT || 8000;

const app = express();

app.use(cors());
app.use(express.json());

const activeRooms = {};

// generate room ID
function generateRoomID(){
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let roomID = '';
    for (let i = 0; i < 6; i++){
        roomID += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return roomID;
}

// create-room endpoint
app.post('/api/create-room', async (req, res) => {
    try{
        // catch data from the frontend
        const { hostName, expectedParticipants } = req.body;
        console.log('Received create-room request:', { hostName, expectedParticipants });

        // generate a unique room ID
        const roomID = generateRoomID();

        // fake database for testing
        activeRooms[roomID] = {
            host: hostName,
            expectedParticipants: expectedParticipants,
            guests: [], // empty array ready for friends to join
            status: "waiting"
        };

        const frontendBaseUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
        const joinURL = `${frontendBaseUrl}/join?code=${roomID}`;
        const QRCodeURL = await QRCode.toDataURL(joinURL);
        console.log('Generated room ID:', roomID);

        //send data back to the frontend
        res.json({
            roomID: roomID,
            QRCodeURL: QRCodeURL,
            status: "waiting for participants"
        })
    } catch (error) {
        console.error('Error creating room:', error);
        res.status(500).json({ error: 'Failed to create room' });
    }  
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});