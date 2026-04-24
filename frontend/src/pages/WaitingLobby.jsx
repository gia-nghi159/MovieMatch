import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getRoom, startSession, socket } from '../api';

const WaitingLobby = () => {
  const { roomID } = useParams();
  const navigate = useNavigate();

  const [participants, setParticipants] = useState([]);
  const [hostName, setHostName] = useState('');
  const [expectedParticipants, setExpectedParticipants] = useState(0);
  const [startingSession, setStartingSession] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [currentUser] = useState(() => localStorage.getItem('userName'));

  const isHost = participants.some(
    (person) =>
      person.role === 'host' &&
      person.name?.trim().toLowerCase() === currentUser?.trim().toLowerCase()
  );

  useEffect(() => {
    getRoom(roomID)
      .then((data) => {
        setParticipants(data.participants || []);
        setHostName(data.host || '');
        setExpectedParticipants(data.participantNumber || 0);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load room data.');
        setLoading(false);
      });

    socket.emit('join-socket-room', roomID);

    socket.on('participant-joined', (data) => {
      setParticipants(data.participants || []);
    });

    socket.on('game-started', () => {
      navigate(`/swipe/${roomID}`);
    });

    return () => {
      socket.off('participant-joined');
      socket.off('game-started');
    };
  }, [roomID, navigate]);

  const handleStartSession = async () => {
    setStartingSession(true);

    try {
      await startSession(roomID);
      navigate(`/swipe/${roomID}`);
    } catch {
      setError('Failed to start session.');
      setStartingSession(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#141e30] text-white font-sans flex justify-center px-6">
      <div className="w-full max-w-[1120px] bg-[#334157] min-h-screen px-[50px] py-[40px]">
        <div className="text-center mb-10">
          <div className="text-[54px] mb-4">⏳ 🎬</div>

          <h1 className="text-[48px] font-bold text-[#ffd369] mb-6">
            Waiting Lobby
          </h1>

          <p className="text-[24px] leading-[1.7] text-[#f1f1f1] max-w-[900px] mx-auto">
            Your room has been created successfully. Please wait while the other
            participants join the movie session.
          </p>
        </div>

        {error && (
          <div className="mb-8 bg-red-500/20 border border-red-400 text-red-100 px-5 py-4 rounded-[18px] text-center">
            {error}
          </div>
        )}

        <div className="bg-[#4b566b] border-l-[8px] border-[#ffd369] rounded-[20px] p-8 mb-10">
          <h2 className="text-[30px] font-bold text-[#ffd369] mb-5">
            Session Status
          </h2>

          <p className="text-[22px] leading-[1.6] text-white">
            Room code:{' '}
            <span className="font-bold text-[#ffd369]">
              {roomID || '------'}
            </span>
          </p>

          <p className="text-[22px] leading-[1.6] text-white">
            Host:{' '}
            <span className="font-bold text-[#ffd369]">
              {loading ? 'Loading...' : hostName || 'Unknown'}
            </span>
          </p>
        </div>

        <div className="bg-[#4b566b] rounded-[24px] p-8 mb-10">
          <h2 className="text-center text-[32px] font-bold text-[#ffd369] mb-8">
            Participants
          </h2>

          <ul className="flex flex-col gap-[32px] list-none">
            {participants.map((person, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-[#5b667a] border border-white/10 rounded-[20px] px-8 py-7 shadow-[0_8px_18px_rgba(0,0,0,0.18)]"
              >
                <span className="text-[28px] font-bold !text-white">
                  {person.role === 'host'
                    ? `${person.name} (Host)`
                    : person.name}
                </span>

                <span
                  className={`text-[18px] min-w-[150px] text-center px-10 py-3 rounded-full font-bold whitespace-nowrap ${
                    person.status === 'joined'
                      ? 'bg-[#7bd36b] !text-white'
                      : 'bg-[#f0aa00] !text-white'
                  }`}
                >
                  {person.status === 'joined' ? 'Connected' : 'Waiting'}
                </span>
              </li>
            ))}
          </ul>

          {!loading && participants.length === 0 && (
            <p className="text-[20px] text-[#f1f1f1] mt-4 text-center">
              No participants have joined yet.
            </p>
          )}

          <p className="mt-8 text-center text-[22px] text-[#f1f1f1]">
            {participants.length} of {expectedParticipants || 0} participants have joined.
          </p>
        </div>

        <div className="flex justify-center gap-6 flex-wrap">
          {isHost ? (
            <button
              onClick={handleStartSession}
              disabled={startingSession}
              className="bg-[#ffd369] text-[#1b1b1b] font-bold py-4 px-12 rounded-[16px] text-[22px] hover:bg-[#ffbf00] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {startingSession ? 'Starting...' : 'Start Session'}
            </button>
          ) : (
            <div className="bg-white/20 text-white font-bold py-4 px-12 rounded-[16px] text-[22px]">
              Waiting for Host to start...
            </div>
          )}

          <button
            onClick={() => navigate('/')}
            className="bg-transparent border-2 border-[#ffd369] text-[#ffd369] font-bold py-4 px-12 rounded-[16px] text-[22px] hover:bg-[#ffd369] hover:text-[#1b1b1b] transition-all"
          >
            Leave Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default WaitingLobby;