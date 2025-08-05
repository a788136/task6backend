require('dotenv').config(); // .env должен быть в самом начале

const app = require('./app');
const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

const io = socketIo(server, {
  cors: { origin: '*' }
});

// ВАЖНО: подключаем обработчики socket только после создания io!
require('./socket/socketHandlers')(io);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
