const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Create an Express application
const app = express();

// Create an HTTP server
const server = http.createServer(app);

// Initialize Socket.IO on the server
const io = socketIo(server);

// Serve a simple webpage (Optional: Can use for real-time data display)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html'); // Make sure you have an index.html
});

// Handle Socket.IO connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Listen for 'sensorData' events from the ESP8266
  socket.on('sensorData', (data) => {
    try {
      // Parse the incoming JSON data
      const sensorData = JSON.parse(data);
      console.log('Received sensor data:', sensorData);

      // Here, you can process the sensor data, store it in a database, etc.
      // For example, you can display real-time data to all connected clients:
      io.emit('update', sensorData); // Broadcast the data to all connected clients

    } catch (error) {
      console.error('Error parsing sensor data:', error);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// Start the server on port 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
