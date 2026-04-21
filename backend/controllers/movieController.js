const axios = require('axios');
const Room = require('../models/Room');

const movieNight = async (req, res) => {
    try {
        const { roomID } = req.params;
        
        const randomPage = Math.floor(Math.random() * 10) + 1;
        
        const tmdbURL = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&sort_by=popularity.desc&page=${randomPage}&vote_count.gte=500`;
        
        const response = await axios.get(tmdbURL);

        const fetchMovies = response.data.results.slice(0,10).map(movie => ({
            ID: movie.id,
            title: movie.title,
            posterPath: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            overview: movie.overview,
            releaseDate: movie.release_date,
            voteAverage: movie.vote_average
        }));

        // save to database
        const updateRoom = await Room.findOneAndUpdate(
            { roomID: roomID },
            { $set: { 
                    movies: fetchMovies,
                    status: 'active' 
                }
            },
            { new: true }
        );

        if (!updateRoom) {
            return res.status(404).json({ message: "Room not found" });
        }

        // send data back to the frontend
        res.status(200).json({ movies: fetchMovies });
    } catch (error) {
        console.error('Error fetching movies:', error);
        res.status(500).json({ error: 'Failed to fetch movies' });
    }
};

// save movie selection to database
const submitVote = async (req, res) => {
    try {
        const { roomID } = req.params;
        const { movieID, voteType } = req.body;

        // validate the vote type
        if (!['like', 'dislike'].includes(voteType)) {
            return res.status(400).json({ error: 'Invalid vote type' });
        }

        // find the room
        const room = await Room.findOne({ roomID: roomID });
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        // find the movie in the room's movie list
        const movieIndex = room.movies.findIndex(m => m.ID === movieID);
        if (movieIndex === -1) {
            return res.status(404).json({ error: 'Movie not found in this room' });
        }

        // update the vote count
        if (voteType === 'like') {
            room.movies[movieIndex].likes += 1;
        } else {
            room.movies[movieIndex].dislikes += 1;
        }

        // save the updated room
        await room.save();

        res.status(200).json({ message: 'Vote submitted successfully', movie: room.movies[movieIndex] });
    } catch (error) {
        console.error('Error submitting vote:', error);
        res.status(500).json({ error: 'Failed to submit vote' });
    }
};

module.exports = { movieNight, submitVote };