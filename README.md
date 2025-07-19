# ROS PyTrees Dashboard

This project demonstrates a simple React + Vite dashboard that visualises behaviour tree activity from a ROS robot.

A Node.js server launches `py-trees-blackboard-watcher` (in JSON mode) and forwards structured events via WebSocket to the React frontend. The React app builds the behaviour tree on the fly with `reactflow` and colours nodes according to their status.

## Getting Started

1. Install dependencies

```bash
npm install
cd app && npm install
```

2. Run in development mode

```bash
# terminal 1
npm start

# terminal 2
cd app && npm run dev
```

3. Build for production

```bash
npm run build
```

Ensure `py-trees-blackboard-watcher` is installed locally so the backend can launch it.
The server uses the `--json` option so that each line of output is easily parsed and forwarded to the web client.
