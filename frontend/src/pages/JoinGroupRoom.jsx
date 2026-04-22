import React, { useState } from 'react';

// join group room page - user enters a 6 character room code to join a session
const JoinGroupRoom = ({ onJoin, onBack }) => {
  const [roomCode, setRoomCode] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (roomCode.trim().length === 6) {
      onJoin(roomCode.toUpperCase());
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#141e30] to-[#243b55] flex justify-center items-center p-5 text-white font-sans">
      <div className="w-full max-w-[500px] bg-white/10 backdrop-blur-md rounded-[20px] p-10 shadow-2xl border border-white/10 text-center">

        <div className="text-[44px] mb-2">🎟️</div>
        <h1 className="text-[32px] font-bold text-[#ffd369] mb-3">Join Group Room</h1>
        <p className="text-[16px] text-[#f1f1f1] leading-[1.6] mb-7">
          Enter the room code shared by the host to join the movie session.
        </p>

        <form onSubmit={handleSubmit}>
          <label className="block text-left text-[16px] font-bold mb-2 text-white">
            Room Code
          </label>
          <input
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            placeholder="Enter room code"
            maxLength={6}
            required
            className="w-full p-[14px_16px] rounded-[12px] text-[18px] uppercase tracking-[2px] mb-3 text-black outline-none border-none"
          />
          <p className="text-left text-[14px] text-[#d9d9d9] mb-6">
            Enter the 6-character room code to join the session.
          </p>

          <div className="flex gap-[15px]">
            <button
              type="submit"
              className="flex-1 bg-[#ffd369] text-[#1b1b1b] py-[14px] rounded-[12px] text-[16px] font-bold hover:bg-[#ffbf00] transition-all transform hover:-translate-y-0.5"
            >
              Join Room
            </button>
            <button
              type="button"
              onClick={onBack}
              className="flex-1 bg-transparent border-2 border-[#ffd369] text-[#ffd369] py-[14px] rounded-[12px] text-[16px] font-bold hover:bg-[#ffd369] hover:text-[#1b1b1b] transition-all transform hover:-translate-y-0.5"
            >
              Back
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default JoinGroupRoom;
