const express = require('express');
const { spawn } = require('child_process');
const WebSocket = require('ws');

const app = express();
const port = process.env.PORT || 3001;

app.use(express.static('app/dist'));
const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
const wss = new WebSocket.Server({ server });

function startWatcher() {
  const proc = spawn('py-trees-blackboard-watcher', ['--visited', '--activity']);
  proc.stderr.on('data', (data) => console.error(data.toString()));
  proc.on('close', (code) => console.log('Watcher exited', code));
  return proc;
}

let watcher = null;

wss.on('connection', (ws) => {
  console.log('client connected');
  if (!watcher) {
    watcher = startWatcher();
  }
  const listener = (data) => {
    const lines = data.toString().split('\n').filter(Boolean);
    lines.forEach(line => {
      ws.send(JSON.stringify({ line }));
    });
  };
  watcher.stdout.on('data', listener);

  ws.on('close', () => {
    watcher.stdout.off('data', listener);
    console.log('client disconnected');
  });
});
