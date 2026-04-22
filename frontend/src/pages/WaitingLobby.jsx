import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

// waiting lobby - shows room code and live participant list using socket.io
const WaitingLobby = () => {
  const { roomID } = useParams();
  const navigate = useNavigate();

  const [participants, setParticipants] = useState([]);
  const [hostName, setHostName] = useState('');
  const [expectedParticipants, setExpectedParticipants] = useState(0);
  const [status, setStatus] = useState('waiting');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // fetch initial room data from backend
    const fetchRoom = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(`http://localhost:8000/api/room/${roomID}`);
        const data = await response.json();

        if (!response.ok) {
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

    // connect to socket.io server
    const socket = io('http://localhost:8000');

    // send join-socket-room event to backend with the room ID
    socket.emit('join-socket-room', roomID);

    // listen for participant-joined event from backend
    // payload: { participantName, participants }
    socket.on('participant-joined', (data) => {
      console.log('New participant joined:', data.participantName);
      setParticipants(data.participants);
    });

    // listen for start-session event from backend
    socket.on('start-session', () => {
      console.log('Session started');
      navigate('/filters');
    });

    // cleanup - disconnect socket when leaving the page
    return () => {
      socket.disconnect();
    };
  }, [roomID]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#141e30] to-[#243b55] flex justify-center items-center p-5 text-white font-sans">
      <div className="w-full max-w-[1000px] bg-white/10 backdrop-blur-md rounded-[24px] p-10 shadow-2xl border border-white/10">

        {/* Header */}
        <div className="text-center mb-[30px]">
          <div className="text-[42px] mb-[10px]">🎬</div>
          <h1 className="text-[34px] font-bold text-[#ffd369] mb-[10px]">Waiting Lobby</h1>
          <p className="text-[17px] text-[#f1f1f1] leading-[1.6]">
            Share the room code with your friends and wait for everyone to join.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/20 border border-red-400 text-red-100 px-4 py-3 rounded-xl text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[25px] mt-[30px]">

          {/* Session Access */}
          <div className="bg-white/10 p-[25px] rounded-[18px] shadow-lg">
            <h2 className="text-[22px] font-bold text-[#ffd369] mb-[18px]">Session Access</h2>

            <div className="bg-[#ffd369]/15 border-2 border-dashed border-[#ffd369] rounded-[16px] p-5 text-center mb-5">
              <div className="text-[15px] text-[#eaeaea] mb-2 font-medium">Your Room Code</div>
              <div className="text-[36px] font-bold tracking-[4px] text-[#ffd369] uppercase">
                {roomID || '------'}
              </div>
            </div>

            <div className="bg-white/10 rounded-[16px] p-5 text-center">
              <div className="text-[16px] text-[#f4f4f4] mb-2">Host</div>
              <div className="text-[22px] font-bold text-[#ffd369]">
                {loading ? 'Loading...' : hostName || 'Unknown'}
              </div>
            </div>

            <p className="mt-[18px] text-[15px] text-[#ddd]">
              Share this room code with your friends so they can join the session.
            </p>
          </div>

          {/* Participants */}
          <div className="bg-white/10 p-[25px] rounded-[18px] shadow-lg flex flex-col">
            <h2 className="text-[22px] font-bold text-[#ffd369] mb-[18px]">Participants</h2>

            {loading ? (
              <div className="bg-white/10 border-l-[5px] border-[#ffd369] rounded-[12px] p-[15px] mb-5 text-[16px] text-[#f4f4f4]">
                Loading room data...
              </div>
            ) : participants.length === 0 ? (
              <div className="bg-white/10 border-l-[5px] border-[#ffd369] rounded-[12px] p-[15px] mb-5 text-[16px] text-[#f4f4f4]">
                Waiting for participants...
              </div>
            ) : null}

            <ul className="flex flex-col gap-3 list-none">
              {participants.map((person, index) => (
                <li key={index} className="flex justify-between items-center bg-white/10 p-[14px] rounded-[12px] hover:bg-white/15 transition-colors">
                  <span className="text-[16px] font-bold">
                    {person.name}{person.role === 'host' ? ' (Host)' : ''}
                  </span>
                  <span className={`text-[14px] px-3 py-1 rounded-full font-medium ${person.status === 'joined' ? 'bg-[#2ecc71]' : 'bg-gray-500'}`}>
                    {person.status === 'joined' ? 'Connected' : person.status}
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-auto pt-5 text-[15px] text-[#ddd]">
              {participants.length}/{expectedParticipants || 0} participants joined.
              {status ? ` Status: ${status}.` : ''}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-[15px] mt-[35px] flex-wrap">
          <button className="bg-[#ffd369] text-[#1b1b1b] font-bold py-[14px] px-6 rounded-xl text-[16px] hover:bg-[#ffbf00] transition-all transform hover:-translate-y-0.5 shadow-md">
            Start Session
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-transparent border-2 border-[#ffd369] text-[#ffd369] font-bold py-[14px] px-6 rounded-xl text-[16px] hover:bg-[#ffd369] hover:text-[#1b1b1b] transition-all transform hover:-translate-y-0.5"
          >
            Leave Room
          </button>
        </div>

      </div>
    </div>
  );
};

export default WaitingLobby;
