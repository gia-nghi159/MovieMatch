require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const roomRoutes = require('./routes/roomRoutes'); 


const PORT = process.env.PORT || 8000;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// attach io to app so controllers can access it via req.app.get('io')
app.set('io', io);

app.use(cors());
app.use(express.json());

// connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/moviematch')
    .then(() => console.log('Connected to MongoDB!'))
    .catch((err) => console.error('Failed to connect to MongoDB', err));

// routes
app.use('/api', roomRoutes);

// socket.io events
io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    // both host and participants real time events
    socket.on('join-socket-room', (roomID) => {
        socket.join(roomID);
        console.log(`Socket ${socket.id} joined socket room: ${roomID}`);
    });

    socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id);
    });
});

// start the server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
