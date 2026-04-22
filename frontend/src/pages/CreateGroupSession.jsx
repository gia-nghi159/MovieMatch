import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateGroupSession = () => {
  const navigate = useNavigate();
  const [hostName, setHostName] = useState('');
  const [participantNumber, setParticipantNumber] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();

    const participantCount = Number(participantNumber);

    if (!hostName.trim()) {
      alert('Please enter host name.');
      return;
    }

    if (!participantCount || participantCount < 2 || participantCount > 20) {
      alert('Please enter a number of participants between 2 and 20.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/create-room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hostName: hostName,
          expectedParticipants: participantCount
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert('Error: ' + (data.error || 'Failed to create room'));
        return;
      }

      const actualRoomId = data.roomID;

      if (actualRoomId) {
        localStorage.setItem('userName', hostName);
        navigate(`/lobby/${actualRoomId}`);
      } else {
        alert('Error: Server failed to return room ID');
      }
    } catch (error) {
      console.error('Create room error:', error);
      alert('Connection Error. Please check if Backend is running.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#141e30] to-[#243b55] flex justify-center items-center text-white p-5 font-sans">
      <div className="w-full max-w-[500px] bg-white/10 rounded-[20px] px-[35px] py-[40px] backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
        <div className="text-center text-[42px] mb-[10px]">🎬</div>

        <h1 className="text-center text-[32px] text-[#ffd369] mb-3 font-bold">
          Create Group Session
        </h1>

        <p className="text-center text-[16px] text-[#f1f1f1] mb-[30px] leading-[1.6]">
          Start a new movie session and invite your friends to vote together.
        </p>

        <form onSubmit={handleCreate}>
          <label
            htmlFor="hostName"
            className="block mb-[10px] text-[16px] font-bold text-white"
          >
            Host Name
          </label>

          <input
            type="text"
            id="hostName"
            name="hostName"
            placeholder="Enter host name"
            required
            value={hostName}
            onChange={(e) => setHostName(e.target.value)}
            className="w-full px-4 py-[14px] border-none rounded-[12px] text-[16px] outline-none mb-5 text-black"
          />

          <label
            htmlFor="participants"
            className="block mb-[10px] text-[16px] font-bold text-white"
          >
            Number of Expected Participants
          </label>

          <input
            type="number"
            id="participants"
            name="participants"
            min="2"
            max="20"
            placeholder="Enter number of participants"
            required
            value={participantNumber}
            onChange={(e) => setParticipantNumber(e.target.value)}
            className="w-full px-4 py-[14px] border-none rounded-[12px] text-[16px] outline-none mb-5 text-black"
          />

          <p className="text-[14px] text-[#d9d9d9] mb-[25px] leading-[1.5]">
            Enter the number of people you expect to join this session.
          </p>

          <div className="flex gap-[15px] max-[600px]:flex-col">
            <button
              type="submit"
              className="flex-1 text-center py-[14px] rounded-[12px] text-[16px] font-bold border-none cursor-pointer transition-all duration-300 bg-[#ffd369] text-[#1b1b1b] hover:bg-[#ffbf00] hover:-translate-y-0.5"
            >
              Create
            </button>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 text-center py-[14px] rounded-[12px] text-[16px] font-bold cursor-pointer transition-all duration-300 bg-transparent text-[#ffd369] border-2 border-[#ffd369] hover:bg-[#ffd369] hover:text-[#1b1b1b] hover:-translate-y-0.5"
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupSession;