import React, { useEffect, useState, useCallback } from 'react';
import ReactFlow, { Background, Controls } from "reactflow";
import type { Node, Edge } from "reactflow";
import 'reactflow/dist/style.css';
import './App.css';

function App() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  const highlightNode = useCallback((id: string, status?: string) => {
    setNodes((nds) => nds.map(n => {
      if (n.id !== id) return n;
      let style: React.CSSProperties = {};
      if (status) {
        if (status === 'running') style = { backgroundColor: 'yellow' };
        else if (status === 'success') style = { backgroundColor: 'lightgreen' };
        else if (status === 'failure') style = { backgroundColor: 'salmon' };
      }
      return { ...n, style };
    }));
  }, []);

  useEffect(() => {
    const ws = new WebSocket(`ws://${location.hostname}:3001`);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setLogs(l => [...l.slice(-50), JSON.stringify(data)]);
      if (data.node) {
        setNodes(n => {
          if (!n.some(nd => nd.id === data.node)) {
            return [...n, { id: data.node, data: { label: data.node }, position: { x: Math.random()*400, y: Math.random()*400 } }];
          }
          return n;
        });
        if (data.parent) {
          setEdges(e => {
            const id = `${data.parent}-${data.node}`;
            if (!e.some(ed => ed.id === id)) {
              return [...e, { id, source: data.parent, target: data.node }];
            }
            return e;
          });
        }
        highlightNode(data.node, data.status);
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
