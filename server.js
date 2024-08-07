import http  from 'http';
import { WebSocketServer } from 'ws';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('Hello World\n');
});

server.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});

const wss = new WebSocketServer({server});

let messages = [];

wss.on('connection', (ws) => {
  console.log('Un usuario se ha conectado');

  ws.send(JSON.stringify({ type: 'messages', data: messages }));

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    if (data.type === 'new-message') {
      messages.push(data.data);
      wss.clients.forEach((client) => {
        client.send(JSON.stringify({ type: 'messages', data: messages }));
      });
    }
  });

  ws.on('close', () => {
    console.log('Un usuario se ha desconectado');
  });
});

