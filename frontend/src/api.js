import { io } from 'socket.io-client';

const API_BASE = 'http://localhost:8000/api';

// shared socket connection
export const socket = io('http://localhost:8000');

// room management
export const createRoom = async (hostName, expectedParticipants) => {
    const response = await fetch(`${API_BASE}/create-room`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hostName, expectedParticipants })
    });
    return response.json();
};

export const joinRoom = async (participantName, roomID) => {
    const response = await fetch(`${API_BASE}/join-room`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantName, roomID })
    });
    return response.json();
};

export const getRoom = async (roomID) => {
    const response = await fetch(`${API_BASE}/room/${roomID}`);
    return response.json();
};

// game & voting logic
export const startSession = async (roomID) => {
    const response = await fetch(`${API_BASE}/${roomID}/start`, { 
        method: 'POST' 
    });
    return response.json();
};

export const submitVote = async (roomID, movieID, voteType) => {
    const response = await fetch(`${API_BASE}/${roomID}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieID, voteType })
    });
    return response.json();
};

export const getResults = async (roomID) => {
    const response = await fetch(`${API_BASE}/${roomID}/results`);
    const data = await response.json();
    return { status: response.status, data };
};