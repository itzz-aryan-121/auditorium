const WS_URL = 'ws://localhost:7001/ws'; // Match the port with your API
let socket = null;
let reconnectInterval = null;
let eventListeners = {};

export const connectWebSocket = () => {
  // Close any existing connection
  if (socket) {
    socket.close();
  }

  // Create new WebSocket connection
  socket = new WebSocket(WS_URL);

  // Setup event listeners
  socket.onopen = () => {
    console.log('WebSocket connection established');
    clearInterval(reconnectInterval);
    
    // Notify any listeners that we're connected
    if (eventListeners.connect) {
      eventListeners.connect.forEach(callback => callback());
    }
  };

  socket.onclose = (event) => {
    console.log('WebSocket connection closed', event);
    
    // Attempt to reconnect
    if (!reconnectInterval) {
      reconnectInterval = setInterval(() => {
        console.log('Attempting to reconnect WebSocket...');
        connectWebSocket();
      }, 5000); // Try to reconnect every 5 seconds
    }
    
    // Notify any close listeners
    if (eventListeners.close) {
      eventListeners.close.forEach(callback => callback(event));
    }
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
    
    // Notify error listeners
    if (eventListeners.error) {
      eventListeners.error.forEach(callback => callback(error));
    }
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log('WebSocket message received:', data);
      
      // Notify message listeners
      if (eventListeners.message) {
        eventListeners.message.forEach(callback => callback(data));
      }
      
      // Notify specific event listeners if type exists
      if (data.type && eventListeners[data.type]) {
        eventListeners[data.type].forEach(callback => callback(data));
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  };

  return socket;
};

export const sendMessage = (message) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
    return true;
  } else {
    console.error('WebSocket is not connected');
    return false;
  }
};

export const addEventListener = (event, callback) => {
  if (!eventListeners[event]) {
    eventListeners[event] = [];
  }
  eventListeners[event].push(callback);
};

export const removeEventListener = (event, callback) => {
  if (eventListeners[event]) {
    eventListeners[event] = eventListeners[event].filter(cb => cb !== callback);
  }
};