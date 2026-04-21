import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from "./pages/Homepage";
import CreateGroupSession from "./pages/CreateGroupSession";
import WaitingLobby from "./pages/WaitingLobby";

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/create-room" element={<CreateGroupSession />} />
          <Route path="/lobby/:roomID" element={<WaitingLobby />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;