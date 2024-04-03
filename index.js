import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import initRoutes from './src/routes';
import './database.js';
import { cronJob } from './src/utils/cronJob';
import http from 'http';
import { Server } from 'socket.io';
import { onConnection } from './websocket/websocket.js';

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  path: '/socket',
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

io.use(function (socket, next) {
  console.log('handshake', socket.handshake.query.token);
  if (socket.handshake.query && socket.handshake.query.token) {
    jwt.verify(
      socket.handshake.query.token,
      process.env.JWT_SECRET,
      function (err) {
        if (err) return next(new Error('Authentication error'));
        next();
      },
    );
  } else {
    next(new Error('Authentication error'));
  }
});

io.on('connection', onConnection);

app.use(
  cors({
    origin: [process.env.CLIENT_URL, '*'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Welcome to PurrPet API');
});

initRoutes(app);

const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

cronJob();
export default io;
