import { useEffect, useState, useCallback } from 'react';
import ReactFlow, { Background, Controls } from "reactflow";
import type { Node, Edge } from "reactflow";
import 'reactflow/dist/style.css';
import './App.css';

const initialNodes: Node[] = [
  { id: '1', type: 'input', data: { label: 'Root' }, position: { x: 0, y: 0 } },
  { id: '2', data: { label: 'Child A' }, position: { x: -100, y: 100 } },
  { id: '3', data: { label: 'Child B' }, position: { x: 100, y: 100 } },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
];

function App() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges] = useState<Edge[]>(initialEdges);
  const [logs, setLogs] = useState<string[]>([]);

  const highlightNode = useCallback((id: string) => {
    setNodes((nds) => nds.map(n => ({ ...n, style: n.id === id ? { border: '2px solid red' } : {} })));
  }, []);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3001');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setLogs(l => [...l.slice(-50), data.line]);
      const match = data.line.match(/node=(\S+)/);
      if (match) {
        highlightNode(match[1]);
      }
    };
    return () => ws.close();
  }, [highlightNode]);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 1 }}>
        <ReactFlow nodes={nodes} edges={edges} fitView>
          <Background />
          <Controls />
        </ReactFlow>
      </div>
      <div style={{ width: '300px', overflow: 'auto', padding: '0.5rem', borderLeft: '1px solid #ccc' }}>
        <h3>Watcher Logs</h3>
        <pre style={{ whiteSpace: 'pre-wrap' }}>
          {logs.map((line, i) => <div key={i}>{line}</div>)}
        </pre>
      </div>
    </div>
  );
}

export default App;
