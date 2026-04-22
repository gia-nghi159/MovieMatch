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
  
  // check who is currently looking at the screen
  const currentUser = localStorage.getItem('userName'); 

  useEffect(() => {
    // fetch room data
    getRoom(roomID).then(data => {
      setParticipants(data.participants || []);
      setHostName(data.host || '');
      setExpectedParticipants(data.participantNumber || 0);
    });

    // set up socket
    socket.emit('join-socket-room', roomID);

    socket.on('participant-joined', (data) => {
      setParticipants(data.participants);
    });

    socket.on('game-started', () => {
      navigate(`/swipe/${roomID}`); // auto-navigate EVERYONE to swipe page
    });

    return () => {
      socket.off('participant-joined');
      socket.off('game-started');
    };
  }, [roomID, navigate]);

  const handleStartSession = async () => {
    setStartingSession(true);
    await startSession(roomID); // triggers the backend to emit 'game-started'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#141e30] to-[#243b55] text-white font-sans p-5 flex justify-center items-center">
      <div className="w-full max-w-[1000px] bg-white/10 backdrop-blur-md rounded-[24px] p-10 shadow-2xl border border-white/10">
        <div className="text-center mb-[30px]">
          <div className="text-[42px] mb-[10px]">🎬</div>
          <h1 className="text-[34px] font-bold text-[#ffd369] mb-[10px]">
            Waiting Lobby
          </h1>
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
          <div className="bg-white/10 p-[25px] rounded-[18px] shadow-lg">
            <h2 className="text-[22px] font-bold text-[#ffd369] mb-[18px]">
              Session Access
            </h2>

            <div className="bg-[#ffd369]/15 border-2 border-dashed border-[#ffd369] rounded-[16px] p-5 text-center mb-5">
              <div className="text-[15px] text-[#eaeaea] mb-2">
                Your Room Code
              </div>
              <div className="text-[36px] font-bold tracking-[4px] text-[#ffd369] uppercase">
                {roomID || '------'}
              </div>
            </div>

            <div className="bg-white/10 rounded-[16px] p-5 text-center mb-5">
              <div className="text-[16px] text-[#f4f4f4] mb-2 font-bold">
                Host
              </div>
              <div className="text-[22px] font-bold text-[#ffd369]">
                {loading ? 'Loading...' : hostName || 'Unknown'}
              </div>
            </div>
          </div>

          <div className="bg-white/10 p-[25px] rounded-[18px] shadow-lg flex flex-col">
            <h2 className="text-[22px] font-bold text-[#ffd369] mb-[18px]">
              Participants
            </h2>

            <div className="bg-white/10 border-l-[5px] border-[#ffd369] rounded-[12px] p-[15px] mb-5 text-[16px] text-[#f4f4f4]">
              {loading ? 'Loading room data...' : 'Waiting for participants...'}
            </div>

            <ul className="flex flex-col gap-3 list-none">
              {participants.map((person, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-white/10 border border-white/10 rounded-[16px] px-5 py-4 shadow-md backdrop-blur-sm transition-all duration-200 hover:bg-white/15 hover:-translate-y-[2px] hover:shadow-lg"
                >
                  <span className="text-[16px] font-bold text-white">
                    {person.role === 'host' ? `Host - ${person.name}` : person.name}
                  </span>

                  <span
                    className={`text-[14px] px-4 py-1.5 rounded-full font-semibold shadow-sm ${
                      person.status === 'joined'
                        ? 'bg-[#2ecc71] text-white'
                        : 'bg-gray-500 text-white'
                    }`}
                  >
                    {person.status === 'joined' ? 'Connected' : person.status}
                  </span>
                </li>
              ))}
            </ul>

            {!loading && participants.length === 0 && (
              <p className="text-[15px] text-[#ddd] mt-2">
                No participants have joined yet.
              </p>
            )}

            <p className="mt-[18px] text-[15px] text-[#ddd]">
              {participants.length}/{expectedParticipants || 0} participants joined.
              {status ? ` Status: ${status}.` : ''}
            </p>
          </div>
        </div>

        <div className="flex justify-center gap-[15px] mt-[35px] flex-wrap">
          {currentUser === hostName ? (
            <button
              onClick={handleStartSession}
              className="bg-[#ffd369] text-[#1b1b1b] font-bold py-[14px] px-6 rounded-xl text-[16px] hover:bg-[#ffbf00] transition-all"
              >
              {startingSession ? 'Starting...' : 'Start Session'}
            </button>
          ) : (
              <div className="bg-white/20 text-white font-bold py-[14px] px-6 rounded-xl text-[16px]">
              Waiting for Host to start...
            </div>
          )}
          

          <button
            onClick={() => navigate('/')}
            className="bg-transparent border-2 border-[#ffd369] text-[#ffd369] font-bold py-[14px] px-6 rounded-xl text-[16px] hover:bg-[#ffd369] hover:text-[#1b1b1b] transition-all"
          >
            Leave Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default WaitingLobby;