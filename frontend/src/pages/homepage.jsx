import React from 'react';

const Homepage = ({ onCreateRoom }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#141e30] to-[#243b55] flex justify-center items-center p-4 text-white font-sans">
      <div className="bg-white/10 backdrop-blur-md p-10 md:p-12 rounded-[20px] shadow-2xl w-full max-w-[520px] text-center border border-white/10">
        
        {/* Logo */}
        <div className="text-[48px] mb-2 leading-none">🎬</div>
        
        {/* Title */}
        <h1 className="text-[40px] font-bold text-[#ffd369] mb-4 leading-tight">
          MovieMatch
        </h1>
        
        {/* Description */}
        <p className="text-[18px] leading-[1.6] mb-8 text-[#f1f1f1]">
          Find the perfect movie for your group or just for yourself.<br className="hidden md:block"/>
          Create a room, join friends, or use solo mode for personal recommendations.
        </p>

        {/* Buttons Group */}
        <div className="flex flex-col gap-[15px]">
          {/* Nút Create Group - Nút này sẽ kích hoạt chuyển sang Lobby */}
          <button 
            onClick={onCreateRoom}
            className="bg-[#ffd369] text-[#1b1b1b] py-[15px] rounded-xl text-[18px] font-bold hover:bg-[#ffbf00] transition-all transform hover:-translate-y-0.5"
          >
            Create Group Room
          </button>

          {/* Nút Join Room */}
          <button className="bg-transparent border-2 border-[#ffd369] text-[#ffd369] py-[15px] rounded-xl text-[18px] font-bold hover:bg-[#ffd369] hover:text-[#1b1b1b] transition-all transform hover:-translate-y-0.5">
            Join Room
          </button>

          {/* Nút Solo Mode */}
          <button className="bg-[#ff6b6b] text-white py-[15px] rounded-xl text-[18px] font-bold hover:bg-[#ff4c4c] transition-all transform hover:-translate-y-0.5">
            Start Solo Mode
          </button>
        </div>

        {/* Footer */}
        <div className="mt-[25px] text-[14px] text-[#dcdcdc] opacity-80 uppercase tracking-wide">
          Group & Solo Movie Recommendation System
        </div>
      </div>
    </div>
  );
};

export default Homepage;