import React, { useState, useEffect } from 'react';

// swipe voting page - like/dislike movies with arrow keys or buttons
const SwipeVoting = ({ onFinish }) => {
  const [progress] = useState({ current: 3, total: 10 });

  // placeholder movie - will be replaced with real API data later
  const movie = {
    title: 'Interstellar',
    genres: ['Sci-Fi'],
    runtime: '169 min',
    year: '2014',
    rating: 'PG-13',
    overview: "A team of explorers travels through a wormhole in space in an attempt to ensure humanity's survival. The film combines emotional storytelling, science fiction, and spectacular visuals.",
    director: 'Christopher Nolan',
    cast: 'Matthew McConaughey, Anne Hathaway',
    mood: 'Emotional, Suspenseful',
    language: 'English',
  };

  // handle keyboard arrow keys - left = dislike, right = like
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'ArrowRight') handleLike();
      if (e.key === 'ArrowLeft') handleDislike();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  function handleLike() {
    console.log('Liked:', movie.title);
    // will move to next movie once connected to backend
  }

  function handleDislike() {
    console.log('Disliked:', movie.title);
    // will move to next movie once connected to backend
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#141e30] to-[#243b55] text-white font-sans flex justify-center items-center p-5">
      <div className="w-full max-w-[1100px] bg-white/10 backdrop-blur-md rounded-[24px] p-[35px] shadow-2xl border border-white/10">

        {/* Top bar */}
        <div className="flex justify-between items-center gap-5 mb-6 flex-wrap">
          <div>
            <h1 className="text-[34px] font-bold text-[#ffd369] mb-2">Swipe Voting</h1>
            <p className="text-[16px] text-[#f1f1f1] leading-[1.6]">
              Press <kbd className="bg-white/20 px-2 py-0.5 rounded text-sm">←</kbd> to dislike or <kbd className="bg-white/20 px-2 py-0.5 rounded text-sm">→</kbd> to like. Or use the buttons below.
            </p>
          </div>
          <div className="bg-white/10 rounded-[14px] p-[14px_18px] min-w-[220px]">
            <div className="text-[14px] text-[#e8e8e8] mb-2">
              Progress: {progress.current} / {progress.total} movies
            </div>
            <div className="w-full h-[10px] bg-white/15 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#ffd369] rounded-full transition-all"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Main content with side arrow buttons */}
        <div className="flex items-center gap-4">

          {/* Left arrow - dislike */}
          <button
            onClick={handleDislike}
            className="hidden md:flex flex-shrink-0 w-14 h-14 bg-[#ff6b6b] hover:bg-[#ff5252] text-white text-[28px] rounded-full items-center justify-center shadow-lg transition-all transform hover:scale-110"
            title="Dislike (← arrow key)"
          >
            ←
          </button>

          {/* Movie card */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-[360px_1fr] gap-[30px] items-stretch">
            <div className="bg-gradient-to-b from-[#2d4059] to-[#1f2b3a] rounded-[22px] min-h-[520px] flex items-center justify-center text-[28px] font-bold text-[#ffd369] text-center p-5">
              MOVIE POSTER
            </div>

            <div className="bg-white/10 rounded-[22px] p-7">
              <h2 className="text-[32px] font-bold text-[#ffd369] mb-3">{movie.title}</h2>

              <div className="flex flex-wrap gap-2 mb-5">
                {movie.genres.map((g) => (
                  <span key={g} className="bg-[#ffd369]/15 border border-[#ffd369]/40 text-white px-[14px] py-2 rounded-full text-[14px]">{g}</span>
                ))}
                <span className="bg-[#ffd369]/15 border border-[#ffd369]/40 text-white px-[14px] py-2 rounded-full text-[14px]">{movie.runtime}</span>
                <span className="bg-[#ffd369]/15 border border-[#ffd369]/40 text-white px-[14px] py-2 rounded-full text-[14px]">{movie.year}</span>
                <span className="bg-[#ffd369]/15 border border-[#ffd369]/40 text-white px-[14px] py-2 rounded-full text-[14px]">{movie.rating}</span>
              </div>

              <div className="mb-5">
                <h3 className="text-[19px] font-bold text-[#ffd369] mb-2">Overview</h3>
                <p className="text-[16px] leading-[1.7] text-[#f2f2f2]">{movie.overview}</p>
              </div>

              <div className="mb-5">
                <h3 className="text-[19px] font-bold text-[#ffd369] mb-2">Details</h3>
                <div className="bg-white/5 rounded-[16px] p-[18px]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { label: 'Director', value: movie.director },
                      { label: 'Main Cast', value: movie.cast },
                      { label: 'Mood', value: movie.mood },
                      { label: 'Language', value: movie.language },
                    ].map((item) => (
                      <div key={item.label} className="bg-white/5 rounded-[12px] p-[14px]">
                        <strong className="block text-[#ffd369] text-[15px] mb-1">{item.label}</strong>
                        <span className="text-[15px] text-[#f2f2f2]">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-3 flex-wrap mt-7">
                <button onClick={handleDislike} className="bg-[#ff6b6b] text-white font-bold py-[14px] px-5 rounded-[12px] text-[16px] min-w-[140px] hover:bg-[#ff5252] transition-all transform hover:-translate-y-0.5">
                  👎 Dislike
                </button>
                <button onClick={handleLike} className="bg-[#2ecc71] text-white font-bold py-[14px] px-5 rounded-[12px] text-[16px] min-w-[140px] hover:bg-[#27ae60] transition-all transform hover:-translate-y-0.5">
                  👍 Like
                </button>
                <button className="bg-transparent border-2 border-[#ffd369] text-[#ffd369] font-bold py-[14px] px-5 rounded-[12px] text-[16px] min-w-[140px] hover:bg-[#ffd369] hover:text-[#1b1b1b] transition-all transform hover:-translate-y-0.5">
                  Flip Card
                </button>
                <button onClick={onFinish} className="bg-[#ffd369] text-[#1b1b1b] font-bold py-[14px] px-5 rounded-[12px] text-[16px] min-w-[140px] hover:bg-[#ffbf00] transition-all transform hover:-translate-y-0.5">
                  Finish
                </button>
              </div>
            </div>
          </div>

          {/* Right arrow - like */}
          <button
            onClick={handleLike}
            className="hidden md:flex flex-shrink-0 w-14 h-14 bg-[#2ecc71] hover:bg-[#27ae60] text-white text-[28px] rounded-full items-center justify-center shadow-lg transition-all transform hover:scale-110"
            title="Like (→ arrow key)"
          >
            →
          </button>

        </div>
      </div>
    </div>
  );
};

export default SwipeVoting;
