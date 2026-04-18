import React, { useState } from 'react';
import axios from 'axios';
import Homepage from "./pages/homepage";
import WaitingLobby from "./pages/waitinglobby";

function App() {
  const [view, setView] = useState('home');
  const [roomData, setRoomData] = useState({
    roomID: '------',
    qrCode: '',
    status: ''
  });

  const handleCreateRoom = async () => {
    try {
      
      const response = await axios.post('http://localhost:8000/api/create-room', {
        hostName: "Sabeeh", 
        expectedParticipants: 4
      });

      
      const { roomId, qrCodeUrl, status } = response.data;

      setRoomData({
        roomID: roomId,
        qrCode: qrCodeUrl,
        status: status
      });

      setView('lobby');

    } catch (error) {
      console.error("Lỗi kết nối:", error);
      alert("Không kết nối được với server của Yaseen ở port 8000!");
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
          onBack={() => setView('home')} 
        />
      )}
    </div>
  );
}

export default App;