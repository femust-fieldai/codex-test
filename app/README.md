# ROS PyTrees Dashboard

This repository provides a minimal example of a React + Vite dashboard that can visualise a running behaviour tree and blackboard data from a ROS robot using `py-trees-blackboard-watcher`.

## Prerequisites

- Node.js (>=18)
- `py-trees-blackboard-watcher` available on the local machine

## Installation

```
npm install
cd app && npm install
```

## Development

Start the backend server and Vite dev server:

```
# in one terminal
npm run start

# in another terminal
cd app && npm run dev
```

The backend server runs on `http://localhost:3001` and proxies WebSocket data from `py-trees-blackboard-watcher`.
The React app connects to this WebSocket and displays watcher output while highlighting tree nodes.

Build the production bundle with:

```
npm run build
```
