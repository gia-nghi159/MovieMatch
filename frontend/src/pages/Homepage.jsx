import React from 'react';
import { useNavigate } from 'react-router-dom';

const homepagePosters = [
  { id: 'interstellar', posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg' },
  { id: 'parasite', posterUrl: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg' },
  { id: 'spiderverse', posterUrl: 'https://image.tmdb.org/t/p/w500/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg' },
  { id: 'mad-max', posterUrl: 'https://image.tmdb.org/t/p/w500/hA2ple9q4qnwxp3hKVNhroipsir.jpg' },
  { id: 'get-out', posterUrl: 'https://image.tmdb.org/t/p/w500/1SwAVYpuLj8KsHxllTF8Dt9dSSX.jpg' },
  { id: 'lalaland', posterUrl: 'https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg' },
  { id: 'your-name', posterUrl: 'https://image.tmdb.org/t/p/w500/q719jXXEzOoYaps6babgKnONONX.jpg' },
  { id: 'amelie', posterUrl: 'https://image.tmdb.org/t/p/w500/oTKduWL2tpIKEmkAqF4mFEAWAsv.jpg' },
  { id: 'arrival', posterUrl: 'https://image.tmdb.org/t/p/w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg' },
  { id: 'knives-out', posterUrl: 'https://image.tmdb.org/t/p/w500/pThyQovXQrw2m0s9x82twj48Jq4.jpg' },
  { id: 'spirited-away', posterUrl: 'https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg' },
  { id: 'inception', posterUrl: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg' },
];

const Homepage = () => {
  const navigate = useNavigate();

  return (
    <main className="page">
      <div className="homepage-backdrop" aria-hidden="true">
        <div className="poster-wall">
          {homepagePosters.map((movie) => (
            <div
              key={movie.id}
              className="poster-tile"
              style={{
                backgroundImage: `linear-gradient(rgba(5,10,20,0.34), rgba(5,10,20,0.58)), url(${movie.posterUrl})`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="page-content-narrow home-card hero-animate" style={{ width: 'min(100%, 860px)' }}>
        <section className="hero-panel center-panel" style={{ width: 'min(100%, 640px)', padding: '46px 40px 38px' }}>
          <div className="brand-mark" style={{ margin: '0 auto' }}>🎬</div>
          <h1 className="home-title">MovieMatch</h1>
          <p className="home-subtitle" style={{ maxWidth: '520px' }}>Pick a movie together.</p>

          <div className="home-actions" style={{ marginTop: '34px', gap: '14px' }}>
            <button className="btn btn-primary" onClick={() => navigate('/create-room')}>
              Create Group Room
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/join-room')}>
              Join Room
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Homepage;
