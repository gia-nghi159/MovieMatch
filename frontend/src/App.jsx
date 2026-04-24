import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';

import CreateGroupSession from './pages/CreateGroupSession';
import Homepage from './pages/Homepage';
import JoinGroupRoom from './pages/JoinGroupRoom';
import ResultPage from './pages/ResultPage';
import SmartFilter from './pages/SmartFilter';
import SwipeVoting from './pages/SwipeVoting';
import WaitingLobby from './pages/WaitingLobby';
import WaitingOthersFinish from './pages/WaitingOthersFinish';

function JoinRoomRoute() {
  const navigate = useNavigate();

  return (
    <JoinGroupRoom
      onJoin={(code) => navigate(`/lobby/${code}`)}
      onBack={() => navigate('/')}
    />
  );
}

function FiltersRoute() {
  const navigate = useNavigate();

  return (
    <SmartFilter
      onSubmit={(filters) => navigate('/swipe', { state: { filters } })}
      onBack={() => navigate('/')}
    />
  );
}

function SwipeRoute() {
  const navigate = useNavigate();
  return <SwipeVoting onFinish={() => navigate('/waiting-finish')} />;
}

function SwipeRoomRoute() {
  const navigate = useNavigate();
  return <SwipeVoting onFinish={() => navigate(-1)} fallbackFinish={(roomID) => navigate(`/waiting-finish/${roomID}`)} />;
}

function WaitingRoute() {
  const navigate = useNavigate();
  return <WaitingOthersFinish onRevealWinner={() => navigate('/')} />;
}

function WaitingRoomRoute() {
  const navigate = useNavigate();
  return <WaitingOthersFinish onRevealWinner={(roomID) => navigate(`/result/${roomID}`)} />;
}

function ResultRoute() {
  const navigate = useNavigate();
  return <ResultPage onBackHome={() => navigate('/')} />;
}

function App() {
  return (
    <Router>
      <div className="app-shell">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/create-room" element={<CreateGroupSession />} />
          <Route path="/lobby/:roomID" element={<WaitingLobby />} />
          <Route path="/join-room" element={<JoinRoomRoute />} />
          <Route path="/filters" element={<FiltersRoute />} />
          <Route path="/swipe" element={<SwipeRoute />} />
          <Route path="/swipe/:roomID" element={<SwipeRoomRoute />} />
          <Route path="/waiting-finish" element={<WaitingRoute />} />
          <Route path="/waiting-finish/:roomID" element={<WaitingRoomRoute />} />
          <Route path="/result/:roomID" element={<ResultRoute />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
