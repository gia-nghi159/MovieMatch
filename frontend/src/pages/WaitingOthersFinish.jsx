import React from 'react';

// waiting page - shown after user finishes voting, waits for others to finish
const WaitingOthersFinish = ({ onRevealWinner }) => {

  // placeholder participants - will come from backend later
  const participants = [
    { name: 'Alex (Host)', done: true },
    { name: 'Jamie', done: true },
    { name: 'Taylor', done: false },
    { name: 'Morgan', done: false },
  ];

  const doneCount = participants.filter((p) => p.done).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#141e30] to-[#243b55] flex justify-center items-center p-5 text-white font-sans">
      <div className="w-full max-w-[760px] bg-white/10 backdrop-blur-md rounded-[24px] p-[45px_35px] shadow-2xl border border-white/10 text-center">

        <div className="text-[58px] mb-4">⏳🎬</div>
        <h1 className="text-[36px] font-bold text-[#ffd369] mb-4">Waiting for Others to Finish</h1>

        <p className="text-[18px] text-[#f1f1f1] leading-[1.7] max-w-[620px] mx-auto mb-7">
          Your votes have been submitted. Please wait while the other participants finish reviewing and voting on their movie options.
        </p>

        {/* Session status box */}
        <div className="bg-white/10 border-l-[5px] border-[#ffd369] rounded-[16px] p-[18px_20px] text-left mb-7">
          <h2 className="text-[20px] font-bold text-[#ffd369] mb-2">Session Status</h2>
          <p className="text-[16px] text-[#f5f5f5] leading-[1.6]">
            The matching engine will calculate the final recommendation once all participants have completed voting.
          </p>
        </div>

        {/* Voting progress */}
        <div className="bg-white/5 rounded-[18px] p-[22px] text-left mb-8">
          <h2 className="text-[22px] font-bold text-[#ffd369] mb-4 text-center">Voting Progress</h2>

          <ul className="flex flex-col gap-3 list-none">
            {participants.map((person, index) => (
              <li key={index} className="flex justify-between items-center bg-white/10 p-[14px_16px] rounded-[12px]">
                <span className="text-[16px] font-bold text-white">{person.name}</span>
                <span className={`text-[14px] font-bold px-3 py-1.5 rounded-full text-white ${person.done ? 'bg-[#2ecc71]' : 'bg-[#f39c12]'}`}>
                  {person.done ? 'Finished' : 'Still Voting'}
                </span>
              </li>
            ))}
          </ul>

          <p className="text-center text-[15px] text-[#dcdcdc] mt-4">
            {doneCount} of {participants.length} participants have finished voting.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4 flex-wrap">
          <button className="bg-[#ffd369] text-[#1b1b1b] font-bold py-[14px] px-6 rounded-[12px] text-[16px] min-w-[180px] hover:bg-[#ffbf00] transition-all transform hover:-translate-y-0.5">
            Refresh Status
          </button>
          <button
            onClick={onRevealWinner}
            className="bg-transparent border-2 border-[#ffd369] text-[#ffd369] font-bold py-[14px] px-6 rounded-[12px] text-[16px] min-w-[180px] hover:bg-[#ffd369] hover:text-[#1b1b1b] transition-all transform hover:-translate-y-0.5"
          >
            Reveal Winner
          </button>
        </div>

      </div>
    </div>
  );
};

export default WaitingOthersFinish;
