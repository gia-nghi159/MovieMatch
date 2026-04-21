import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Tyler's pages
import Homepage from './pages/Homepage';
import CreateGroupSession from './pages/CreateGroupSession';
import WaitingLobby from './pages/WaitingLobby';

// Sab's pages
import JoinGroupRoom from './pages/JoinGroupRoom';
import SmartFilter from './pages/SmartFilter';
import SwipeVoting from './pages/SwipeVoting';
import WaitingOthersFinish from './pages/WaitingOthersFinish';

function App() {
  return (
    <Router>
      <Routes>
        {/* Homepage */}
        <Route path="/" element={<Homepage />} />

        {/* Create room flow */}
        <Route path="/create-room" element={<CreateGroupSession />} />
        <Route path="/lobby/:roomID" element={<WaitingLobby />} />

        {/* Join room flow */}
        <Route path="/join-room" element={<JoinGroupRoom onJoin={(code) => window.location.href = `/lobby/${code}`} onBack={() => window.location.href = '/'} />} />

        {/* Voting flow */}
        <Route path="/filters" element={<SmartFilter onSubmit={() => window.location.href = '/swipe'} onBack={() => window.location.href = '/'} />} />
        <Route path="/swipe" element={<SwipeVoting onFinish={() => window.location.href = '/waiting-finish'} />} />
        <Route path="/waiting-finish" element={<WaitingOthersFinish onRevealWinner={() => window.location.href = '/result'} />} />
      </Routes>
    </Router>
  );
}

export default App;
