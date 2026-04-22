import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getResults } from '../api';

const ResultPage = () => {
  const { roomID } = useParams();
  const navigate = useNavigate();

  const [winner, setWinner] = useState(null);
  const [runnerUps, setRunnerUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        setError('');

        const { status, data } = await getResults(roomID);

        if (status !== 200) {
          throw new Error(data.error || data.message || 'Failed to fetch results');
        }

        setWinner(data.winner || null);
        setRunnerUps(Array.isArray(data.runnerUps) ? data.runnerUps : []);
      } catch (err) {
        console.error('Fetch results error:', err);
        setError(err.message || 'Failed to load final recommendation');
      } finally {
        setLoading(false);
      }
    };

    if (roomID) {
      fetchResults();
    }
  }, [roomID]);

  const getYear = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).getFullYear();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#141e30] to-[#243b55] text-white p-6 flex justify-center items-center font-sans">
      <div className="w-full max-w-[1100px] bg-white/10 rounded-[24px] p-6 md:p-9 backdrop-blur-md shadow-2xl border border-white/10">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="text-[54px] mb-3">🏆🎬</div>
          <h1 className="text-[30px] md:text-[38px] font-bold text-[#ffd369] mb-3">
            Final Recommendation
          </h1>
          <p className="text-[16px] md:text-[17px] text-[#f1f1f1] leading-[1.6] max-w-[720px] mx-auto">
            All votes have been processed. Based on the final group voting results,
            MovieMatch selected the best movie for this session.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/20 border border-red-400 text-red-100 px-4 py-3 rounded-xl text-center">
            {error}
          </div>
        )}

        {loading ? (
          <div className="bg-white/10 rounded-[20px] p-10 text-center text-[#f1f1f1] text-[18px]">
            Loading final recommendation...
          </div>
        ) : !winner ? (
          <div className="bg-white/10 rounded-[20px] p-10 text-center text-[#f1f1f1] text-[18px]">
            No final result found for this room.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-7 items-stretch">
              
              {/* Poster Column */}
              <div className="bg-white/10 rounded-[22px] p-5 flex flex-col gap-4">
                {winner.posterPath ? (
                  <img
                    src={winner.posterPath}
                    alt={winner.title || 'Winning movie poster'}
                    className="w-full min-h-[360px] lg:min-h-[500px] object-cover rounded-[18px] shadow-lg"
                  />
                ) : (
                  <div className="min-h-[360px] lg:min-h-[500px] rounded-[18px] bg-gradient-to-b from-[#2d4059] to-[#1f2b3a] flex justify-center items-center text-center text-[#ffd369] text-[28px] font-bold p-5">
                    WINNING MOVIE POSTER
                  </div>
                )}

                <div className="text-center bg-[#ffd369]/15 border border-[#ffd369]/40 text-[#ffd369] py-3 px-4 rounded-[14px] text-[16px] font-bold">
                  Selected Movie for Your Group
                </div>
              </div>

              {/* Details Column */}
              <div className="bg-white/10 rounded-[22px] p-6 md:p-7">
                <h2 className="text-[30px] md:text-[40px] font-bold text-[#ffd369] mb-3">
                  {winner.title || 'Unknown Title'}
                </h2>

                <div className="flex flex-wrap gap-2.5 mb-8">
                  <span className="bg-[#ffd369]/12 border border-[#ffd369]/35 text-white px-4 py-2 rounded-full text-[14px]">
                    Year: {getYear(winner.releaseDate)}
                  </span>

                  <span className="bg-[#ffd369]/12 border border-[#ffd369]/35 text-white px-4 py-2 rounded-full text-[14px]">
                    TMDB Rating: {winner.voteAverage ?? 'N/A'}
                  </span>
                </div>

                <div className="mb-8">
                  <h3 className="text-[21px] font-bold text-[#ffd369] mb-2.5">
                    Movie Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div className="bg-white/10 rounded-[16px] p-4">
                      <strong className="block mb-1 text-[#ffd369] text-[15px]">
                        TMDB ID
                      </strong>
                      <span>{winner.ID ?? 'N/A'}</span>
                    </div>

                    <div className="bg-white/10 rounded-[16px] p-4">
                      <strong className="block mb-1 text-[#ffd369] text-[15px]">
                        Release Year
                      </strong>
                      <span>{getYear(winner.releaseDate)}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-10">
                  <h3 className="text-[21px] font-bold text-[#ffd369] mb-2.5">
                    Synopsis
                  </h3>
                  <p className="text-[16px] leading-[1.7] text-[#f2f2f2]">
                    {winner.overview || 'No synopsis available.'}
                  </p>
                </div>

                {/* Runner-Ups Section */}
                {runnerUps.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-[21px] font-bold text-[#ffd369] mb-4">
                      Runner-Ups
                    </h3>

                    <div className="flex flex-col gap-4">
                      {runnerUps.map((movie, index) => (
                        <div
                          key={movie.ID || index}
                          className="bg-white/10 rounded-[16px] px-6 py-5 border border-white/10 flex flex-col justify-center min-h-[80px] hover:bg-white/15 transition-all"
                        >
                          <div className="font-bold text-white text-[18px] mb-1">
                            {index + 2}. {movie.title}
                          </div>
                          <div className="text-[14px] text-[#ffd369] opacity-90 font-medium">
                            TMDB Rating: {movie.voteAverage ?? 'N/A'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-center gap-4 flex-wrap mt-10">
              <button
                onClick={() => navigate('/create-room')}
                className="min-w-[200px] border-none cursor-pointer px-6 py-[14px] rounded-[12px] text-[16px] font-bold transition-all bg-[#ffd369] text-[#1b1b1b] hover:bg-[#ffbf00] shadow-lg transform hover:-translate-y-0.5"
              >
                Start New Session
              </button>

              <button
                onClick={() => navigate('/')}
                className="min-w-[200px] cursor-pointer px-6 py-[14px] rounded-[12px] text-[16px] font-bold transition-all bg-transparent border-2 border-[#ffd369] text-[#ffd369] hover:bg-[#ffd369] hover:text-[#1b1b1b] shadow-lg transform hover:-translate-y-0.5"
              >
                Return Home
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResultPage;