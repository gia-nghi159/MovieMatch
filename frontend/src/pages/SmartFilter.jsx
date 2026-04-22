import React, { useState } from 'react';

const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Animation', 'Thriller'];
const moods = ['Feel-Good', 'Exciting', 'Dark', 'Emotional', 'Relaxing', 'Suspenseful'];
const ratings = ['G', 'PG', 'PG-13', 'R'];
const languages = ['English', 'Korean', 'Japanese', 'French', 'Any'];

const SmartFilter = ({ onSubmit, onBack }) => {
  const [filters, setFilters] = useState({
    genres: [],
    actor: '',
    director: '',
    mood: '',
    minRuntime: '',
    maxRuntime: '',
    rating: '',
    language: '',
  });

  const toggleGenre = (genre) => {
    setFilters((prev) => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter((item) => item !== genre)
        : [...prev.genres, genre],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(filters);
  };

  const renderChipGroup = (items, activeValue, onSelect, multiSelect = false) => (
    <div className="mini-pill-row">
      {items.map((item) => {
        const isActive = multiSelect ? activeValue.includes(item) : activeValue === item;
        return (
          <button
            key={item}
            type="button"
            className={`chip ${isActive ? 'chip-active' : ''}`}
            onClick={() => onSelect(item)}
          >
            {item}
          </button>
        );
      })}
    </div>
  );

  return (
    <main className="page page-centered">
      <div className="page-content hero-animate">
        <section className="hero-panel">
          <div className="hero-grid">
            <div>
              <div className="brand-mark">🪄</div>
              <div className="eyebrow" style={{ marginTop: '18px' }}>Smart filters</div>
              <h1 className="page-title">Set the vibe.</h1>
              <p className="page-subtitle">Pick a few filters before voting starts.</p>
            </div>

            <aside className="highlight-card lift-animate">
              <div className="eyebrow">Includes</div>
              <div className="highlight-art">
                <span className="mini-pill">Genres</span>
                <span className="mini-pill">Mood</span>
                <span className="mini-pill">Actors & directors</span>
                <span className="mini-pill">Runtime</span>
                <span className="mini-pill">Rating</span>
                <span className="mini-pill">Language</span>
              </div>
            </aside>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="card-grid" style={{ marginTop: '22px' }}>
          <section className="surface-panel">
            <div className="surface-header">
              <div>
                <h2 className="section-title">Genres</h2>
                <p className="section-subtitle">Choose any that fit.</p>
              </div>
            </div>
            {renderChipGroup(genres, filters.genres, toggleGenre, true)}
          </section>

          <section className="surface-panel">
            <div className="surface-header">
              <div>
                <h2 className="section-title">Mood</h2>
                <p className="section-subtitle">Choose one mood.</p>
              </div>
            </div>
            {renderChipGroup(moods, filters.mood, (mood) => setFilters({ ...filters, mood }))}
          </section>

          <section className="surface-panel">
            <div className="surface-header">
              <div>
                <h2 className="section-title">People preferences</h2>
                <p className="section-subtitle">Optional.</p>
              </div>
            </div>

            <div className="form-grid">
              <div className="field">
                <label className="field-label">Preferred actor</label>
                <input
                  className="text-input"
                  type="text"
                  placeholder="e.g. Leonardo DiCaprio"
                  value={filters.actor}
                  onChange={(e) => setFilters({ ...filters, actor: e.target.value })}
                />
              </div>

              <div className="field">
                <label className="field-label">Preferred director</label>
                <input
                  className="text-input"
                  type="text"
                  placeholder="e.g. Christopher Nolan"
                  value={filters.director}
                  onChange={(e) => setFilters({ ...filters, director: e.target.value })}
                />
              </div>
            </div>
          </section>

          <section className="surface-panel">
            <div className="surface-header">
              <div>
                <h2 className="section-title">Runtime</h2>
                <p className="section-subtitle">Set a range.</p>
              </div>
            </div>

            <div className="form-grid">
              <div className="field">
                <label className="field-label">Minimum runtime</label>
                <input
                  className="text-input"
                  type="number"
                  min="30"
                  max="300"
                  placeholder="90"
                  value={filters.minRuntime}
                  onChange={(e) => setFilters({ ...filters, minRuntime: e.target.value })}
                />
              </div>

              <div className="field">
                <label className="field-label">Maximum runtime</label>
                <input
                  className="text-input"
                  type="number"
                  min="30"
                  max="300"
                  placeholder="150"
                  value={filters.maxRuntime}
                  onChange={(e) => setFilters({ ...filters, maxRuntime: e.target.value })}
                />
              </div>
            </div>
          </section>

          <section className="surface-panel">
            <div className="surface-header">
              <div>
                <h2 className="section-title">Content rating</h2>
                <p className="section-subtitle">Optional.</p>
              </div>
            </div>
            {renderChipGroup(ratings, filters.rating, (rating) => setFilters({ ...filters, rating }))}
          </section>

          <section className="surface-panel">
            <div className="surface-header">
              <div>
                <h2 className="section-title">Language</h2>
                <p className="section-subtitle">Pick one.</p>
              </div>
            </div>
            {renderChipGroup(languages, filters.language, (language) => setFilters({ ...filters, language }))}
          </section>

          <section className="surface-panel">
            <div className="surface-header">
              <div>
                <h2 className="section-title">Ready?</h2>
                <p className="section-subtitle">Continue when ready.</p>
              </div>
            </div>

            <div className="action-row">
              <button type="submit" className="btn btn-primary">
                Apply filters
              </button>
              <button type="button" className="btn btn-secondary" onClick={onBack}>
                Back
              </button>
            </div>
          </section>
        </form>
      </div>
    </main>
  );
};

export default SmartFilter;
