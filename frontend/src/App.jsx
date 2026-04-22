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
import WaitingToFinish from './pages/WaitingToFinish';
import ResultPage from './pages/result';

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
        <Route path="/swipe/:roomID" element={<SwipeVoting onFinish={() => window.location.href = '/waiting-finish'} />} />
        <Route path="/waiting-finish/:roomID" element={<WaitingToFinish onRevealWinner={() => window.location.href = '/result'} />} />
        <Route path="/result/:roomID" element={<ResultPage />} />
      </Routes>
    </Router>
  );
}

export default App;
