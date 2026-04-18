import React from 'react';


const WaitingLobby = ({ roomCode, qrImage, participants = [], onBack }) => {
  
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#141e30] to-[#243b55] flex justify-center items-center p-5 text-white font-sans">
      <div className="w-full max-w-[1000px] bg-white/10 backdrop-blur-md rounded-[24px] p-10 shadow-2xl border border-white/10">
        
        {/* Header */}
        <div className="text-center mb-[30px]">
          <div className="text-[42px] mb-[10px]">🎬</div>
          <h1 className="text-[34px] font-bold text-[#ffd369] mb-[10px]">Waiting Lobby</h1>
          <p className="text-[17px] text-[#f1f1f1] leading-[1.6]">
            Share the room code or QR code with your friends and wait for everyone to join.
          </p>
        </div>

        {/* Lobby Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[25px] mt-[30px]">
          
          {/* Card 1: Session Access */}
          <div className="bg-white/10 p-[25px] rounded-[18px] shadow-lg">
            <h2 className="text-[22px] font-bold text-[#ffd369] mb-[18px]">Session Access</h2>

            <div className="bg-[#ffd369]/15 border-2 border-dashed border-[#ffd369] rounded-[16px] p-5 text-center mb-5">
              <div className="text-[15px] text-[#eaeaea] mb-2 font-medium">Your Room Code</div>
              <div className="text-[36px] font-bold tracking-[4px] text-[#ffd369] uppercase">
                {roomCode || "------"}
              </div>
            </div>

            <div className="w-[210px] h-[210px] mx-auto bg-white rounded-[16px] flex flex-col justify-center items-center text-[#222] font-bold text-center overflow-hidden shadow-inner">
              {qrImage ? (
                <img 
                  src={qrImage} 
                  alt="Room QR Code" 
                  className="w-full h-full p-2 object-contain" 
                />
              ) : (
                <div className="p-5 italic text-gray-500">
                  QR Code<br />Loading...
                </div>
              )}
            </div>

            <p className="mt-[18px] text-[15px] text-[#ddd]">
              Participants can join using the room code or by scanning the QR code.
            </p>
          </div>

          {/* Card 2: Participants */}
          <div className="bg-white/10 p-[25px] rounded-[18px] shadow-lg flex flex-col">
            <h2 className="text-[22px] font-bold text-[#ffd369] mb-[18px]">Participants</h2>

            {}
            {participants.length === 0 ? (
                <div className="bg-white/10 border-l-[5px] border-[#ffd369] rounded-[12px] p-[15px] mb-5 text-[16px] text-[#f4f4f4]">
                  Waiting for participants...
                </div>
            ) : null}

            <ul className="flex flex-col gap-3 list-none">
              {participants.map((person, index) => (
                <li key={index} className="flex justify-between items-center bg-white/10 p-[14px] rounded-[12px] hover:bg-white/15 transition-colors">
                  <span className="text-[16px] font-bold">{person.name}</span>
                  <span className={`text-[14px] px-3 py-1 rounded-full font-medium ${person.status === 'Connected' ? 'bg-[#2ecc71]' : 'bg-gray-500'}`}>
                    {person.status}
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-auto pt-5 text-[15px] text-[#ddd]">
              {participants.length} {participants.length === 1 ? 'participant' : 'participants'} connected.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-[15px] mt-[35px] flex-wrap">
          <button className="bg-[#ffd369] text-[#1b1b1b] font-bold py-[14px] px-6 rounded-xl text-[16px] hover:bg-[#ffbf00] transition-all transform hover:-translate-y-0.5 shadow-md">
            Start Session
          </button>
          <button 
            onClick={onBack}
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