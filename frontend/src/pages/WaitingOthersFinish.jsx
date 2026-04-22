import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getResults, getRoom, socket } from '../api';

const demoParticipants = [
  { name: 'Alex (Host)', done: true },
  { name: 'Jamie', done: true },
  { name: 'Taylor', done: false },
  { name: 'Morgan', done: false },
];

const WaitingOthersFinish = ({ onRevealWinner }) => {
  const { roomID } = useParams();
  const navigate = useNavigate();
  const [participants, setParticipants] = useState([]);
  const [expectedParticipants, setExpectedParticipants] = useState(0);
  const [waitingFor, setWaitingFor] = useState(null);
  const [loading, setLoading] = useState(Boolean(roomID));
  const [error, setError] = useState('');

  useEffect(() => {
    if (!roomID) {
      return;
    }

    let cancelled = false;

    const loadStatus = async () => {
      try {
        setLoading(true);
        const [room, results] = await Promise.all([getRoom(roomID), getResults(roomID)]);

        if (cancelled) return;

        if (room.error) throw new Error(room.error);

        setParticipants(room.participants || []);
        setExpectedParticipants(room.participantNumber || 0);

        if (results.status === 202) {
          setWaitingFor(results.data.waitingFor ?? null);
        } else if (results.status === 200) {
          setWaitingFor(0);
          navigate(`/result/${roomID}`);
          return;
        } else if (results.data?.error) {
          throw new Error(results.data.error);
        }

        setError('');
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load waiting status');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadStatus();
    socket.emit('join-socket-room', roomID);
    socket.on('results-ready', () => navigate(`/result/${roomID}`));

    const timer = setInterval(loadStatus, 5000);

    return () => {
      cancelled = true;
      clearInterval(timer);
      socket.off('results-ready');
    };
  }, [roomID, navigate]);

  if (!roomID) {
    const doneCount = demoParticipants.filter((person) => person.done).length;
    const percent = (doneCount / demoParticipants.length) * 100;

    return (
      <main className="page page-centered">
        <div className="page-content hero-animate">
          <section className="hero-panel">
            <div className="hero-grid">
              <div>
                <div className="brand-mark">⏳</div>
                <div className="eyebrow" style={{ marginTop: '18px' }}>Vote sync</div>
                <h1 className="page-title">Waiting on the room.</h1>
                <p className="page-subtitle">We'll reveal the match when everyone finishes.</p>
              </div>

              <aside className="highlight-card lift-animate">
                <div className="eyebrow">Progress</div>
                <div className="stat-value" style={{ marginTop: '18px' }}>
                  {doneCount}/{demoParticipants.length}
                </div>
                <p className="section-subtitle">Finished so far.</p>
                <div className="progress-shell">
                  <div className="progress-fill" style={{ width: `${percent}%` }} />
                </div>
              </aside>
            </div>
          </section>
        </div>
      </main>
    );
  }

  const doneCount = waitingFor == null ? 0 : Math.max(expectedParticipants - waitingFor, 0);
  const percent = expectedParticipants ? (doneCount / expectedParticipants) * 100 : 0;

  return (
    <main className="page page-tight page-centered">
      <div className="page-content hero-animate">
        <section className="hero-panel compact-panel">
          <div className="hero-grid compact-lobby-grid">
            <div>
              <div className="brand-mark">⏳</div>
              <div className="eyebrow" style={{ marginTop: '14px' }}>Vote sync</div>
              <h1 className="page-title">Waiting on the room.</h1>
              <p className="page-subtitle">We’ll reveal the result when all votes are in.</p>
            </div>

            <aside className="highlight-card lift-animate">
              <div className="eyebrow">Progress</div>
              <div className="stat-value" style={{ marginTop: '18px' }}>
                {loading ? '...' : `${doneCount}/${expectedParticipants}`}
              </div>
              <p className="section-subtitle">Participants finished voting.</p>
              <div className="progress-shell">
                <div className="progress-fill" style={{ width: `${percent}%` }} />
              </div>
            </aside>
          </div>
        </section>

        <div className="card-grid" style={{ marginTop: '18px' }}>
          <section className="surface-panel compact-surface">
            <div className="surface-header compact-header">
              <div>
                <h2 className="section-title">Session status</h2>
                <p className="section-subtitle">
                  {loading ? 'Loading status...' : waitingFor === 0 ? 'Results ready.' : `Waiting for ${waitingFor ?? '?'} more voter${waitingFor === 1 ? '' : 's'}.`}
                </p>
              </div>
            </div>
            {error ? <div className="status-pill status-warn">{error}</div> : <div className="status-pill status-muted">{loading ? 'Checking votes...' : 'Listening for results...'}</div>}
          </section>

          <section className="surface-panel compact-surface">
            <div className="surface-header compact-header">
              <div>
                <h2 className="section-title">People in room</h2>
                <p className="section-subtitle">{participants.length}/{expectedParticipants || 0} connected.</p>
              </div>
            </div>

            <ul className="participant-list compact-list">
              {participants.map((person, index) => (
                <li key={`${person.name}-${index}`} className="participant-item compact-item">
                  <span style={{ fontWeight: 700 }}>
                    {person.role === 'host' ? `Host - ${person.name}` : person.name}
                  </span>
                  <span className="status-pill status-muted">In room</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="surface-panel" style={{ marginTop: '18px' }}>
          <div className="action-row">
            <button type="button" className="btn btn-secondary" onClick={() => window.location.reload()}>
              Refresh status
            </button>
            <button type="button" className="btn btn-primary" onClick={() => onRevealWinner?.(roomID)}>
              Check results
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default WaitingOthersFinish;
