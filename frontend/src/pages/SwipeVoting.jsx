import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getRoom, submitVote } from '../api';

const SwipeVoting = () => {
  const { roomID } = useParams();
  const navigate = useNavigate();
  
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // fetch movies when page loads
  useEffect(() => {
    getRoom(roomID).then(data => {
      if (data.movies) setMovies(data.movies);
    });
  }, [roomID]);

  // handle voting
  const handleVote = async (voteType) => {
    if (movies.length === 0) return;
    
    const currentMovie = movies[currentIndex];
    
    // send vote to backend
    const data = await submitVote(roomID, currentMovie.ID, voteType);
    
    // move to next movie or finish if it was the last one
    if (currentIndex < movies.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      if (data.gameFinished) {
        navigate(`/result/${roomID}`); // Skip the lobby completely!
      } else {
        navigate(`/waiting-finish/${roomID}`); // Still waiting on others
      }
    }
  };

  if (movies.length === 0) return <div className="text-white text-center mt-20">Loading movies...</div>;

  const currentMovie = movies[currentIndex];

  // Helper to extract just the year from the YYYY-MM-DD release date string
  const getYear = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).getFullYear();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#141e30] to-[#243b55] text-white font-sans flex justify-center items-center p-5">
      <div className="w-full max-w-[1100px] bg-white/10 backdrop-blur-md rounded-[24px] p-[35px] shadow-2xl border border-white/10">

        {/* Top bar */}
        <div className="flex justify-between items-center gap-5 mb-6 flex-wrap">
          <div>
            <h1 className="text-[34px] font-bold text-[#ffd369] mb-2">Swipe Voting</h1>
            <p className="text-[16px] text-[#f1f1f1] leading-[1.6]">
              Use the buttons below to like or dislike the movie.
            </p>
          </div>
          <div className="bg-white/10 rounded-[14px] p-[14px_18px] min-w-[220px]">
            <div className="text-[14px] text-[#e8e8e8] mb-2">
              Progress: {currentIndex + 1} / {movies.length} movies
            </div>
            <div className="w-full h-[10px] bg-white/15 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#ffd369] rounded-full transition-all"
                style={{ width: `${((currentIndex + 1) / movies.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Main content with side arrow buttons */}
        <div className="flex items-center gap-4">

          {/* Left arrow - dislike */}
          <button
            onClick={() => handleVote('dislike')}
            className="hidden md:flex flex-shrink-0 w-14 h-14 bg-[#ff6b6b] hover:bg-[#ff5252] text-white text-[28px] rounded-full items-center justify-center shadow-lg transition-all transform hover:scale-110"
            title="Dislike"
          >
            ←
          </button>

          {/* Movie card */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-[360px_1fr] gap-[30px] items-stretch">
            
            {/* Movie Poster */}
            {currentMovie.posterPath ? (
              <img 
                src={currentMovie.posterPath} 
                alt={currentMovie.title} 
                className="rounded-[22px] object-cover h-[520px] w-full shadow-lg" 
              />
            ) : (
              <div className="bg-gradient-to-b from-[#2d4059] to-[#1f2b3a] rounded-[22px] min-h-[520px] flex items-center justify-center text-[28px] font-bold text-[#ffd369] text-center p-5">
                NO POSTER
              </div>
            )}

            <div className="bg-white/10 rounded-[22px] p-7 flex flex-col">
              <h2 className="text-[32px] font-bold text-[#ffd369] mb-3">{currentMovie.title}</h2>

              {/* Simplified tags based on actual DB data */}
              <div className="flex flex-wrap gap-2 mb-5">
                <span className="bg-[#ffd369]/15 border border-[#ffd369]/40 text-white px-[14px] py-2 rounded-full text-[14px]">
                  Year: {getYear(currentMovie.releaseDate)}
                </span>
                <span className="bg-[#ffd369]/15 border border-[#ffd369]/40 text-white px-[14px] py-2 rounded-full text-[14px]">
                  TMDB Rating: {currentMovie.voteAverage ?? 'N/A'}
                </span>
              </div>

              <div className="mb-auto">
                <h3 className="text-[19px] font-bold text-[#ffd369] mb-2">Overview</h3>
                <p className="text-[16px] leading-[1.7] text-[#f2f2f2]">
                  {currentMovie.overview || "No overview available for this movie."}
                </p>
              </div>

              <div className="flex justify-center gap-3 flex-wrap mt-7">
                <button onClick={() => handleVote('dislike')} className="bg-[#ff6b6b] text-white font-bold py-[14px] px-5 rounded-[12px] text-[16px] min-w-[140px] hover:bg-[#ff5252] transition-all transform hover:-translate-y-0.5 shadow-lg">
                  👎 Dislike
                </button>
                <button onClick={() => handleVote('like')} className="bg-[#2ecc71] text-white font-bold py-[14px] px-5 rounded-[12px] text-[16px] min-w-[140px] hover:bg-[#27ae60] transition-all transform hover:-translate-y-0.5 shadow-lg">
                  👍 Like
                </button>
              </div>
            </div>
          </div>

          {/* Right arrow - like */}
          <button
            onClick={() => handleVote('like')}
            className="hidden md:flex flex-shrink-0 w-14 h-14 bg-[#2ecc71] hover:bg-[#27ae60] text-white text-[28px] rounded-full items-center justify-center shadow-lg transition-all transform hover:scale-110"
            title="Like"
          >
            →
          </button>

        </div>
      </div>
    </div>
  );
};

export default SwipeVoting;