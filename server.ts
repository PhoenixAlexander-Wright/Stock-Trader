import { createServer } from 'node:http';
import next from 'next';
import { Server } from 'socket.io';
import serverSocket from './app/serverSocket.ts';

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);


  httpServer.listen(port, () => {
    console.log(`> Server ready on http://localhost:${port}`);
  });

  const io = new Server(httpServer);
  serverSocket(io);
});
