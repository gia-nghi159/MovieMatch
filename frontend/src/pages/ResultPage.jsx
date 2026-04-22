import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getResults } from '../api';

const ResultPage = ({ onBackHome }) => {
  const { roomID } = useParams();
  const navigate = useNavigate();
  const [winner, setWinner] = useState(null);
  const [runnerUps, setRunnerUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadResults = async () => {
      try {
        setLoading(true);
        const { status, data } = await getResults(roomID);

        if (cancelled) return;

        if (status === 202) {
          navigate(`/waiting-finish/${roomID}`);
          return;
        }

        if (data.error) throw new Error(data.error);

        setWinner(data.winner || null);
        setRunnerUps(data.runnerUps || []);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load results');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadResults();

    return () => {
      cancelled = true;
    };
  }, [roomID, navigate]);

  return (
    <main className="page page-tight page-centered">
      <div className="page-content hero-animate">
        <section className="hero-panel compact-panel">
          <div className="hero-grid compact-lobby-grid">
            <div>
              <div className="brand-mark">🏆</div>
              <div className="eyebrow" style={{ marginTop: '14px' }}>Final result</div>
              <h1 className="page-title">Your group pick</h1>
              <p className="page-subtitle">The room has finished voting.</p>
            </div>

            <aside className="highlight-card lift-animate">
              {loading ? (
                <div className="status-pill status-muted">Loading results...</div>
              ) : error ? (
                <div className="status-pill status-warn">{error}</div>
              ) : (
                <div
                  className="winner-poster-card"
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(7,12,23,0.18), rgba(7,12,23,0.88)), url(${winner?.posterPath || ''})`,
                  }}
                >
                  <div className="winner-poster-content">
                  <div className="eyebrow">Winner</div>
                  <h2 className="section-title" style={{ marginTop: '18px' }}>{winner?.title}</h2>
                  <p className="section-subtitle">
                    TMDB score: {winner?.voteAverage ?? 'N/A'}
                  </p>
                  </div>
                </div>
              )}
            </aside>
          </div>
        </section>

        {!loading && !error && winner ? (
          <div className="card-grid" style={{ marginTop: '18px' }}>
            <section className="surface-panel compact-surface">
              <div className="surface-header compact-header">
                <div>
                  <h2 className="section-title">{winner.title}</h2>
                  <p className="section-subtitle">{winner.releaseDate || 'Release date unavailable'}</p>
                </div>
              </div>
              <p className="movie-copy">{winner.overview || 'No overview available.'}</p>
            </section>

            <section className="surface-panel compact-surface">
              <div className="surface-header compact-header">
                <div>
                  <h2 className="section-title">Runner-ups</h2>
                  <p className="section-subtitle">Other top picks.</p>
                </div>
              </div>
              <ul className="participant-list compact-list">
                {runnerUps.map((movie, index) => (
                  <li key={`${movie.ID || movie.title}-${index}`} className="participant-item compact-item runner-up-item">
                    <div
                      className="runner-up-poster"
                      style={{
                        backgroundImage: movie.posterPath
                          ? `linear-gradient(rgba(7,12,23,0.14), rgba(7,12,23,0.32)), url(${movie.posterPath})`
                          : 'none',
                      }}
                    />
                    <span style={{ fontWeight: 700 }}>{movie.title}</span>
                    <span className="status-pill status-muted">{movie.voteAverage ?? 'N/A'}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        ) : null}

        <section className="surface-panel" style={{ marginTop: '18px' }}>
          <div className="action-row">
            <button type="button" className="btn btn-primary" onClick={onBackHome}>
              Back home
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ResultPage;
