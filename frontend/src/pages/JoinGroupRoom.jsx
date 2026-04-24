import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { joinRoom } from '../api';

const JoinGroupRoom = ({ onJoin, onBack }) => {
  const [roomCode, setRoomCode] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (roomCode.trim().length === 6 && name.trim()) {
      try {
        const data = await joinRoom(name.trim(), roomCode.toUpperCase());

        if (data.error) {
          alert(data.error);
          return;
        }

        localStorage.setItem('userName', name.trim());

        if (onJoin) {
          onJoin(roomCode.toUpperCase(), name.trim());
        } else {
          navigate(`/lobby/${roomCode.toUpperCase()}`);
        }
      } catch (error) {
        alert('Connection Error. Please check if the backend is running.');
      }
    }
  };

  return (
    <main className="page page-centered">
      <div className="page-content card-grid hero-animate">
        <section className="hero-panel">
          <div className="brand-mark">🎟️</div>
          <div className="eyebrow" style={{ marginTop: '18px' }}>Join room</div>
          <h1 className="page-title">Enter The Code</h1>
          <p className="page-subtitle">Name, code, done.</p>
        </section>

        <section className="surface-panel lift-animate">
          <div className="surface-header">
            <div>
              <h2 className="section-title">Join room</h2>
              <p className="section-subtitle">Use the host's 6-character code.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="form-grid">
            <div className="field field-full">
              <label className="field-label">Your name</label>
              <input
                className="text-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jamie"
              />
            </div>

            <div className="field field-full">
              <label className="field-label">Room code</label>
              <input
                className="text-input"
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="A1B2C3"
                maxLength={6}
                style={{ letterSpacing: '0.45em', textTransform: 'uppercase', fontWeight: 800 }}
              />
              <p className="field-hint">6 characters.</p>
            </div>

            <div className="action-row field-full">
              <button className="btn btn-primary" type="submit">
                Join room
              </button>
              <button
                className="btn btn-secondary"
                type="button"
                onClick={onBack || (() => navigate('/'))}
              >
                Back
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
};

export default JoinGroupRoom;
