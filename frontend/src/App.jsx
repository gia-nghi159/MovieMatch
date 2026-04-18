import React, { useState } from 'react';
import axios from 'axios';
import Homepage from "./pages/homepage";
import WaitingLobby from "./pages/waitinglobby";

function App() {
  const [view, setView] = useState('home');
  const [participants, setParticipants] = useState([]);
  
  const [roomData, setRoomData] = useState({
    roomID: '------',
    qrCode: '',
    status: ''
  });

  const handleCreateRoom = async (userName = "Guest", participantCount = 4) => {
    try {
      const response = await axios.post('http://localhost:8000/api/create-room', {
        hostName: userName, 
        expectedParticipants: participantCount
      });

      const { roomId, qrCodeUrl, status } = response.data;

      setRoomData({
        roomID: roomId,
        qrCode: qrCodeUrl,
        status: status
      });

      
      setParticipants([{ name: userName, status: 'Connected' }]);

      setView('lobby');

    } catch (error) {
      console.error("Connection error:", error);
      alert("Unable to connect to the server on port 8000. Please ensure the backend is running.");
    }
  };

  return (
    <div className="min-h-screen">
      {view === 'home' ? (
        <Homepage onCreateRoom={handleCreateRoom} />
      ) : (
        <WaitingLobby 
          roomCode={roomData.roomID} 
          qrImage={roomData.qrCode} 
          participants={participants} 
          onBack={() => setView('home')} 
        />
      )}
    </div>
  );
}

export default App;