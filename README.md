# ROS PyTrees Dashboard

This project demonstrates a simple React + Vite dashboard that visualises behaviour tree activity from a ROS robot.

A Node.js server launches `py-trees-blackboard-watcher` and forwards its output via WebSocket to the React frontend. `reactflow` renders the behaviour tree and highlights nodes as messages arrive.

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
