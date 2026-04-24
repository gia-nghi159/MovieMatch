import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getRoom, socket, startSession } from '../api';

const WaitingLobby = () => {
  const { roomID } = useParams();
  const navigate = useNavigate();

  const [participants, setParticipants] = useState([]);
  const [hostName, setHostName] = useState('');
  const [expectedParticipants, setExpectedParticipants] = useState(0);
  const [status, setStatus] = useState('waiting');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startingSession, setStartingSession] = useState(false);
  const currentUser = localStorage.getItem('userName');

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await getRoom(roomID);
        if (data.error) {
          throw new Error(data.error || 'Failed to fetch room');
        }

        setParticipants(data.participants || []);
        setHostName(data.host || '');
        setExpectedParticipants(data.participantNumber || 0);
        setStatus(data.status || 'waiting');
      } catch (err) {
        console.error('Fetch room error:', err);
        setError(err.message || 'Failed to load room data');
      } finally {
        setLoading(false);
      }
    };

    if (roomID) {
      fetchRoom();
    }

    socket.emit('join-socket-room', roomID);

    socket.on('participant-joined', (data) => {
      setParticipants(data.participants);
    });

    socket.on('game-started', () => {
      navigate(`/swipe/${roomID}`);
    });

    return () => {
      socket.off('participant-joined');
      socket.off('game-started');
    };
  }, [navigate, roomID]);

  const handleStartSession = async () => {
    try {
      setStartingSession(true);
      const data = await startSession(roomID);
      if (data.error) {
        alert(data.error);
      }
    } catch (error) {
      alert('Could not start session. Check if the backend is running.');
    } finally {
      setStartingSession(false);
    }
  };

  return (
    <main className="page page-tight page-centered">
      <div className="page-content hero-animate">
        <section className="hero-panel compact-panel">
          <div className="hero-grid compact-lobby-grid">
            <div>
              <div className="brand-mark">📡</div>
              <div className="eyebrow" style={{ marginTop: '14px' }}>Waiting lobby</div>
              <h1 className="page-title">Wait for everyone</h1>
              <p className="page-subtitle">Share the code and start when ready.</p>

              <div className="metric-grid compact-metrics">
                <div className="stat-card">
                  <div className="stat-label">Code</div>
                  <div className="stat-value room-code-value">{roomID || '------'}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Host</div>
                  <div className="stat-value">{loading ? 'Loading...' : hostName || 'Unknown'}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Ready</div>
                  <div className="stat-value">{participants.length}/{expectedParticipants || 0}</div>
                </div>
              </div>
            </div>

            <section className="surface-panel compact-surface">
              <div className="surface-header compact-header">
                <div>
                  <h2 className="section-title">Participants</h2>
                  <p className="section-subtitle">Live room status.</p>
                </div>
                <div className="mini-pill-row">
                  <span className="status-pill status-success">Live</span>
                  <span className="status-pill status-muted">{status}</span>
                </div>
              </div>

              {error ? <div className="status-pill status-warn">{error}</div> : null}
              {loading ? <div className="status-pill status-muted">Loading room data...</div> : null}
              {!loading && participants.length === 0 ? (
                <div className="status-pill status-warn">Waiting for participants...</div>
              ) : null}

              <ul className="participant-list compact-list" style={{ marginTop: '12px' }}>
                {participants.map((person, index) => (
                  <li key={`${person.name}-${index}`} className="participant-item compact-item">
                    <div>
                      <div style={{ fontWeight: 700 }}>
                        {person.name}
                        {person.role === 'host' ? ' (Host)' : ''}
                      </div>
                      <div className="field-hint">{person.role || 'participant'}</div>
                    </div>
                    <span className={`status-pill ${person.status === 'joined' ? 'status-success' : 'status-muted'}`}>
                      {person.status === 'joined' ? 'Connected' : person.status}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="action-row" style={{ marginTop: '16px' }}>
                {currentUser === hostName ? (
                  <button className="btn btn-primary" type="button" onClick={handleStartSession} disabled={startingSession}>
                    {startingSession ? 'Starting...' : 'Start session'}
                  </button>
                ) : (
                  <div className="status-pill status-muted">Waiting for host...</div>
                )}
                <button className="btn btn-secondary" type="button" onClick={() => navigate('/')}>
                  Leave room
                </button>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
};

export default WaitingLobby;
