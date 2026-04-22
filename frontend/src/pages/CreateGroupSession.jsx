import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoom } from '../api';

const CreateGroupSession = () => {
  const navigate = useNavigate();
  const [hostName, setHostName] = useState('');
  const [participantNumber, setParticipantNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    const participantCount = Number(participantNumber);

    if (!hostName.trim()) {
      alert('Please enter your name.');
      return;
    }

    if (!participantCount || participantCount < 2 || participantCount > 20) {
      alert('Please enter a number between 2 and 20.');
      return;
    }

    setLoading(true);

    try {
      const data = await createRoom(hostName.trim(), participantCount);

      if (!data.roomID) {
        alert(`Error: ${data.error || 'Failed to create room'}`);
        return;
      }

      localStorage.setItem('userName', hostName.trim());
      navigate(`/lobby/${data.roomID}`);
    } catch (error) {
      alert('Connection Error. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page page-centered">
      <div className="page-content card-grid hero-animate">
        <section className="hero-panel">
          <div className="brand-mark">✨</div>
          <div className="eyebrow" style={{ marginTop: '18px' }}>Create room</div>
          <h1 className="page-title">Start a session</h1>
          <p className="page-subtitle">Set the host and group size.</p>

          <div className="metric-grid">
            <div className="stat-card">
              <div className="stat-label">Joining</div>
              <div className="stat-value">Live</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Room size</div>
              <div className="stat-value">2-20</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Next</div>
              <div className="stat-value">Lobby</div>
            </div>
          </div>
        </section>

        <section className="surface-panel lift-animate">
          <div className="surface-header">
            <div>
              <h2 className="section-title">Session setup</h2>
              <p className="section-subtitle">A few quick details.</p>
            </div>
          </div>

          <form onSubmit={handleCreate} className="form-grid">
            <div className="field field-full">
              <label className="field-label">Host name</label>
              <input
                className="text-input"
                type="text"
                placeholder="e.g. Alex"
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
              />
            </div>

            <div className="field field-full">
              <label className="field-label">Expected participants</label>
              <input
                className="text-input"
                type="number"
                min="2"
                max="20"
                placeholder="e.g. 4"
                value={participantNumber}
                onChange={(e) => setParticipantNumber(e.target.value)}
              />
              <p className="field-hint">Between 2 and 20.</p>
            </div>

            <div className="action-row field-full">
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? 'Creating room...' : 'Create room'}
              </button>
              <button className="btn btn-secondary" type="button" onClick={() => navigate('/')}>
                Back
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
};

export default CreateGroupSession;
