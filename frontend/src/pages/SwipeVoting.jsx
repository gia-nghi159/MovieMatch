import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { getRoom, submitVote } from '../api';

const SwipeVoting = ({ onFinish, fallbackFinish }) => {
  const { roomID } = useParams();
  const location = useLocation();
  const [movieQueue, setMovieQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loadingRoomMovies, setLoadingRoomMovies] = useState(Boolean(roomID));

  const movie = movieQueue[currentIndex];
  const total = movieQueue.length;
  const current = Math.min(currentIndex + 1, total);
  const percent = total ? (current / total) * 100 : 0;

  useEffect(() => {
    let cancelled = false;

    const loadMovies = async () => {
      if (!roomID) {
        setLoadingRoomMovies(false);
        return;
      }

      try {
        setLoadingRoomMovies(true);
        const data = await getRoom(roomID);

        if (!cancelled && data.movies?.length) {
          setMovieQueue(
            data.movies.map((item) => ({
              id: item.ID,
              movieID: item.ID,
              title: item.title,
              genres: [],
              runtimeMinutes: null,
              year: item.releaseDate ? new Date(item.releaseDate).getFullYear() : 'N/A',
              rating: item.voteAverage ? `TMDB ${item.voteAverage}` : 'N/A',
              overview: item.overview || 'No overview available for this movie.',
              posterUrl: item.posterPath,
              releaseDate: item.releaseDate,
              voteAverage: item.voteAverage,
            })),
          );
          setCurrentIndex(0);
          setIsFlipped(false);
        }
      } catch (error) {
        console.error('Failed to load room movies:', error);
      } finally {
        if (!cancelled) {
          setLoadingRoomMovies(false);
        }
      }
    };

    loadMovies();

    return () => {
      cancelled = true;
    };
  }, [roomID]);

  const finishFlow = () => {
    if (roomID && fallbackFinish) {
      fallbackFinish(roomID);
      return;
    }

    onFinish();
  };

  const advanceMovie = async (voteType) => {
    if (!movie) {
      finishFlow();
      return;
    }

    if (roomID && movie.movieID) {
      try {
        await submitVote(roomID, movie.movieID, voteType);
      } catch (error) {
        console.error('Vote submission failed:', error);
      }
    }

    setIsFlipped(false);

    if (currentIndex >= total - 1) {
      finishFlow();
      return;
    }

    setCurrentIndex((prev) => prev + 1);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') advanceMovie('like');
      if (e.key === 'ArrowLeft') advanceMovie('dislike');
      if (e.key === ' ') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, total, roomID, movie?.movieID]);

  if (loadingRoomMovies && roomID) {
    return (
      <main className="page page-tight page-centered">
        <div className="page-content hero-animate">
          <section className="surface-panel compact-panel">
            <div className="status-pill status-muted">Loading movies...</div>
          </section>
        </div>
      </main>
    );
  }

  if (!roomID) {
    return (
      <main className="page page-tight page-centered">
        <div className="page-content hero-animate">
          <section className="surface-panel compact-panel">
            <div className="status-pill status-muted">Start a room from the lobby to begin voting.</div>
          </section>
        </div>
      </main>
    );
  }

  if (!movie) return null;

  return (
    <main className="page page-tight page-centered">
      <div className="page-content hero-animate">
        <section className="surface-panel compact-panel">
          <div className="surface-header compact-header-row">
            <div>
              <div className="eyebrow">Group voting</div>
              <h1 className="movie-title" style={{ marginTop: '12px' }}>
                Swipe And Decide
              </h1>
              <p className="section-subtitle">Use arrows to vote. Click the card to flip.</p>
            </div>

            <div className="stack-card compact-progress">
              <div className="stat-value" style={{ marginTop: 0 }}>
                {current} / {total}
              </div>
              <div className="progress-shell" style={{ marginTop: '12px' }}>
                <div className="progress-fill" style={{ width: `${percent}%` }} />
              </div>
            </div>
          </div>

          <div className="swipe-layout">
            <button type="button" className="btn btn-danger side-vote" onClick={() => advanceMovie('dislike')} title="Dislike">
              <span className="side-vote-icon">←</span>
            </button>

            <div className="swipe-stage">
              <button
                type="button"
                className={`flip-card-shell flip-card-button ${isFlipped ? 'flip-active' : ''}`}
                onClick={() => setIsFlipped((prev) => !prev)}
                aria-label={isFlipped ? 'Show movie poster' : 'Show movie details'}
              >
                <div
                  className="flip-card-face flip-card-front"
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(7,12,23,0.08), rgba(7,12,23,0.82)), url(${movie.posterUrl || ''})`,
                  }}
                >
                  <div className="poster-overlay">
                    <div className="poster-kicker">Featured pick</div>
                    <h2 className="poster-title">{movie.title}</h2>
                    <div className="mini-pill-row">
                      <span className="mini-pill">{movie.year}</span>
                      <span className="mini-pill">{movie.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="flip-card-face flip-card-back">
                  <div className="movie-card-back">
                    <h2 className="movie-title" style={{ fontSize: '2.3rem' }}>{movie.title}</h2>
                    <div className="mini-pill-row" style={{ marginBottom: '16px' }}>
                      <span className="chip chip-active">{movie.year}</span>
                      <span className="chip">{movie.rating}</span>
                    </div>
                    <p className="movie-copy compact-copy">{movie.overview}</p>
                    <div className="details-grid two-col-grid" style={{ marginTop: '18px' }}>
                      <div className="detail-item">
                        <span className="detail-label">Release Date</span>
                        <span className="detail-value">{movie.releaseDate || 'Unknown'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">TMDB Score</span>
                        <span className="detail-value">{movie.voteAverage ?? 'N/A'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Source</span>
                        <span className="detail-value">TMDB discover feed</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Movie ID</span>
                        <span className="detail-value">{movie.movieID || movie.id}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            </div>

            <button type="button" className="btn btn-success side-vote" onClick={() => advanceMovie('like')} title="Like">
              <span className="side-vote-icon">→</span>
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default SwipeVoting;
