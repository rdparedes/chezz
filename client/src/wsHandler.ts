import { backendBaseUrl } from './config';

const DEFAULT_USER_ID = 1;

export const createNewGameSession = async ({ onMessageCallback }) => {
  // Establish a websocket connection with the backend
  const { url } = await (
    await fetch(`${backendBaseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        user_id: DEFAULT_USER_ID,
      }),
    })
  ).json();

  const socket = new WebSocket(url);

  socket.onopen = function (e: Event) {
    console.info('[ws] Connection established!');
    socket.send(JSON.stringify({ message: 'new_game' }));
  };

  socket.onmessage = function (e: MessageEvent) {
    console.log(`[ws] Message from server: ${e.data}`);
    onMessageCallback(e.data);
  };

  socket.onclose = function (e: CloseEvent) {
    if (e.wasClean) {
      console.log('[ws] Connection closed cleanly');
    } else {
      console.log('[ws] Connection died');
    }
  };

  socket.onerror = function (e: Event) {
    console.error('[ws] Error', e);
  };
};
