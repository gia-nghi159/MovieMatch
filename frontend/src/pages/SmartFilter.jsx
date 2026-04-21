import React, { useState } from 'react';

// smart filter page - user picks genres, mood, runtime etc before swiping
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

  function toggleGenre(genre) {
    setFilters((prev) => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter((g) => g !== genre)
        : [...prev.genres, genre],
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(filters);
  }

  const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Animation', 'Thriller'];
  const moods = ['Feel-Good', 'Exciting', 'Dark', 'Emotional', 'Relaxing', 'Suspenseful'];
  const ratings = ['G', 'PG', 'PG-13', 'R'];
  const languages = ['English', 'Korean', 'Japanese', 'French', 'Any'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#141e30] to-[#243b55] text-white font-sans py-8 px-5">
      <div className="max-w-[900px] mx-auto bg-white/10 backdrop-blur-md rounded-[24px] p-[35px] shadow-2xl border border-white/10">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-[42px] mb-2">🎬</div>
          <h1 className="text-[34px] font-bold text-[#ffd369] mb-2">Smart Filters</h1>
          <p className="text-[16px] text-[#f1f1f1] leading-[1.6] max-w-[700px] mx-auto">
            Choose your movie preferences before the voting phase begins.
            Set genres, mood, actors, directors, runtime, rating, and language.
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Genres */}
          <div className="mb-7 bg-white/5 rounded-[18px] p-[22px]">
            <h2 className="text-[20px] font-bold text-[#ffd369] mb-4">Genres</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {genres.map((genre) => (
                <label key={genre} className="flex items-center gap-2 bg-white/10 rounded-[12px] p-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.genres.includes(genre)}
                    onChange={() => toggleGenre(genre)}
                  />
                  {genre}
                </label>
              ))}
            </div>
          </div>

          {/* People Preferences */}
          <div className="mb-7 bg-white/5 rounded-[18px] p-[22px]">
            <h2 className="text-[20px] font-bold text-[#ffd369] mb-4">People Preferences</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold mb-2">Preferred Actor</label>
                <input
                  type="text"
                  placeholder="e.g. Leonardo DiCaprio"
                  value={filters.actor}
                  onChange={(e) => setFilters({ ...filters, actor: e.target.value })}
                  className="w-full p-[13px_14px] rounded-[12px] text-[15px] text-black outline-none border-none"
                />
              </div>
              <div>
                <label className="block font-bold mb-2">Preferred Director</label>
                <input
                  type="text"
                  placeholder="e.g. Christopher Nolan"
                  value={filters.director}
                  onChange={(e) => setFilters({ ...filters, director: e.target.value })}
                  className="w-full p-[13px_14px] rounded-[12px] text-[15px] text-black outline-none border-none"
                />
              </div>
            </div>
          </div>

          {/* Mood */}
          <div className="mb-7 bg-white/5 rounded-[18px] p-[22px]">
            <h2 className="text-[20px] font-bold text-[#ffd369] mb-4">Mood</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {moods.map((mood) => (
                <label key={mood} className="flex items-center gap-2 bg-white/10 rounded-[12px] p-3 cursor-pointer">
                  <input
                    type="radio"
                    name="mood"
                    value={mood}
                    checked={filters.mood === mood}
                    onChange={() => setFilters({ ...filters, mood })}
                  />
                  {mood}
                </label>
              ))}
            </div>
          </div>

          {/* Runtime */}
          <div className="mb-7 bg-white/5 rounded-[18px] p-[22px]">
            <h2 className="text-[20px] font-bold text-[#ffd369] mb-4">Runtime</h2>
            <label className="block font-bold mb-2">Preferred Runtime Range (minutes)</label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                min="30" max="300"
                placeholder="Minimum runtime"
                value={filters.minRuntime}
                onChange={(e) => setFilters({ ...filters, minRuntime: e.target.value })}
                className="w-full p-[13px_14px] rounded-[12px] text-[15px] text-black outline-none border-none"
              />
              <input
                type="number"
                min="30" max="300"
                placeholder="Maximum runtime"
                value={filters.maxRuntime}
                onChange={(e) => setFilters({ ...filters, maxRuntime: e.target.value })}
                className="w-full p-[13px_14px] rounded-[12px] text-[15px] text-black outline-none border-none"
              />
            </div>
            <p className="text-[14px] text-[#d9d9d9] mt-2">Example: 90 to 150 minutes</p>
          </div>

          {/* Content Rating */}
          <div className="mb-7 bg-white/5 rounded-[18px] p-[22px]">
            <h2 className="text-[20px] font-bold text-[#ffd369] mb-4">Content Rating</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {ratings.map((r) => (
                <label key={r} className="flex items-center gap-2 bg-white/10 rounded-[12px] p-3 cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    value={r}
                    checked={filters.rating === r}
                    onChange={() => setFilters({ ...filters, rating: r })}
                  />
                  {r}
                </label>
              ))}
            </div>
          </div>

          {/* Language */}
          <div className="mb-7 bg-white/5 rounded-[18px] p-[22px]">
            <h2 className="text-[20px] font-bold text-[#ffd369] mb-4">Language</h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {languages.map((lang) => (
                <label key={lang} className="flex items-center gap-2 bg-white/10 rounded-[12px] p-3 cursor-pointer">
                  <input
                    type="radio"
                    name="language"
                    value={lang}
                    checked={filters.language === lang}
                    onChange={() => setFilters({ ...filters, language: lang })}
                  />
                  {lang}
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-4 flex-wrap mt-8">
            <button
              type="submit"
              className="bg-[#ffd369] text-[#1b1b1b] font-bold py-[14px] px-6 rounded-[12px] text-[16px] hover:bg-[#ffbf00] transition-all transform hover:-translate-y-0.5"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={onBack}
              className="bg-transparent border-2 border-[#ffd369] text-[#ffd369] font-bold py-[14px] px-6 rounded-[12px] text-[16px] hover:bg-[#ffd369] hover:text-[#1b1b1b] transition-all transform hover:-translate-y-0.5"
            >
              Back
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default SmartFilter;
