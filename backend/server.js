require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const roomRoutes = require('./routes/roomRoutes'); 


const PORT = process.env.PORT || 8000;
const app = express();

app.use(cors());
app.use(express.json());

// connect to MongoDB
mongoose.connect(process.env.MONGO_URI) 
    .then(() => console.log('Connected to MongoDB!'))
    .catch((err) => console.error('Failed to connect to MongoDB', err));

// routes
app.use('/api', roomRoutes);

// start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});