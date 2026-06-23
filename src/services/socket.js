import { io } from 'socket.io-client';
import { API_URL } from '../constants/config';

let socket = null;

export function connectSocket(onUpdate) {
  if (socket && socket.connected) return socket;

  socket = io(API_URL, {
    // POLLING en priorité (toujours supporté par le serveur Flask dev), puis
    // upgrade websocket si dispo. Le plus compatible — comme le dashboard web.
    transports: ['polling', 'websocket'],
    upgrade: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 2000,
    timeout: 8000,
  });

  socket.on('connect', () => {
    console.log('Socket connected');
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  socket.on('test_update', (data) => {
    if (onUpdate) onUpdate(data);
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export async function apiStart() {
  const res = await fetch(`${API_URL}/api/start`, { method: 'POST' });
  return res.json();
}

export async function apiStop() {
  const res = await fetch(`${API_URL}/api/stop`, { method: 'POST' });
  return res.json();
}

export async function apiReset() {
  const res = await fetch(`${API_URL}/api/reset`, { method: 'POST' });
  return res.json();
}

export async function apiStatus() {
  const res = await fetch(`${API_URL}/api/status`);
  return res.json();
}

export async function apiHistory() {
  const res = await fetch(`${API_URL}/api/history`);
  return res.json();
}

// Statut du pilotage gateway (sonnerie). En mode déporté, indique si le serveur
// PC (gateway_server.py) est joignable -> l'app prévient avant de lancer un test.
export async function apiGateway() {
  const res = await fetch(`${API_URL}/api/gateway`);
  return res.json();
}
