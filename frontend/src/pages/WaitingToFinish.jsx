import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getRoom, socket } from '../api';

const WaitingToFinish = () => {
  const { roomID } = useParams();
  const navigate = useNavigate();
  const [participants, setParticipants] = useState([]);
  const [hostName, setHostName] = useState('');
  const [expectedParticipants, setExpectedParticipants] = useState(0);
  const [status, setStatus] = useState('active');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    getRoom(roomID).then(data => {
      setParticipants(data.participants || []);
      setHostName(data.host || '');
      setExpectedParticipants(data.participantNumber || 0);
      setStatus(data.status || 'active');
      setLoading(false);
    }).catch(err => {
      setError('Failed to load room data');
      setLoading(false);
    });
    
    socket.emit('join-socket-room', roomID);
    
    socket.on('results-ready', () => {
      navigate(`/result/${roomID}`);
    });

    return () => {
      socket.off('results-ready');
    };
  }, [roomID, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#141e30] to-[#243b55] flex justify-center items-center p-5 text-white font-sans">
      <div className="w-full max-w-[760px] bg-white/10 backdrop-blur-md rounded-[24px] px-[22px] md:px-[35px] py-[35px] md:py-[45px] shadow-2xl border border-white/10 text-center">
        <div className="text-[58px] mb-[15px]">⏳🎬</div>

        <h1 className="text-[30px] md:text-[36px] font-bold text-[#ffd369] mb-[14px]">
          Waiting for Others to Finish
        </h1>

        <p className="text-[16px] md:text-[18px] leading-[1.7] text-[#f1f1f1] max-w-[620px] mx-auto mb-[28px]">
          Your votes have been submitted successfully. Please wait while the other
          participants finish reviewing and voting on their movie options.
        </p>

        {error && (
          <div className="mb-6 bg-red-500/20 border border-red-400 text-red-100 px-4 py-3 rounded-xl text-center">
            {error}
          </div>
        )}

        <div className="bg-white/10 border-l-[5px] border-[#ffd369] rounded-[16px] px-5 py-[18px] text-left mb-[28px]">
          <h2 className="text-[20px] font-bold text-[#ffd369] mb-[10px]">
            Session Status
          </h2>
          <p className="text-[16px] leading-[1.6] text-[#f5f5f5]">
            {loading
              ? 'Loading session status...'
              : `Host: ${hostName || 'Unknown'}. Room status: ${status}. The final recommendation will be shown once results are ready.`}
          </p>
        </div>

        <div className="bg-white/10 rounded-[18px] p-[22px] text-left mb-[30px]">
          <h2 className="text-[22px] font-bold text-[#ffd369] mb-[16px] text-center">
            Participants in Session
          </h2>

          <ul className="list-none flex flex-col gap-3">
            {participants.map((person, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-white/10 px-4 py-[14px] rounded-[12px] gap-3 max-[600px]:flex-col max-[600px]:items-start"
              >
                <span className="text-[16px] font-bold text-white">
                  {person.role === 'host' ? `Host - ${person.name}` : person.name}
                </span>

                <span
                  className={`text-[14px] font-bold px-3 py-1.5 rounded-full whitespace-nowrap ${
                    person.status === 'joined'
                      ? 'bg-[#f39c12] text-white'
                      : 'bg-gray-500 text-white'
                  }`}
                >
                  {person.status === 'joined' ? 'In Session' : person.status}
                </span>
              </li>
            ))}
          </ul>

          {!loading && participants.length === 0 && (
            <p className="text-center text-[#dcdcdc] mt-4">
              No participants found in this room.
            </p>
          )}

          <p className="mt-4 text-center text-[15px] text-[#dcdcdc]">
            {participants.length}/{expectedParticipants || 0} participants currently connected.
          </p>
        </div>

        <div className="flex justify-center gap-[15px] flex-wrap">
          <button
            onClick={() => window.location.reload()}
            className="border-none cursor-pointer px-6 py-[14px] rounded-[12px] text-[16px] font-bold transition-all min-w-[180px] bg-[#ffd369] text-[#1b1b1b] hover:bg-[#ffbf00]"
          >
            Refresh Status
          </button>

          <button
            onClick={() => navigate(`/lobby/${roomID}`)}
            className="cursor-pointer px-6 py-[14px] rounded-[12px] text-[16px] font-bold transition-all min-w-[180px] bg-transparent border-2 border-[#ffd369] text-[#ffd369] hover:bg-[#ffd369] hover:text-[#1b1b1b]"
          >
            Return to Lobby
          </button>
        </div>
      </div>
    </div>
  );
};

export default WaitingToFinish;