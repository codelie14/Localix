import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ZoomInIcon,
  ZoomOutIcon,
  MaximizeIcon,
  FilterIcon,
  CircleIcon,
  SquareIcon,
  TriangleIcon,
  HexagonIcon,
  RefreshCwIcon,
  SearchIcon,
  DownloadIcon } from
'lucide-react';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';

interface GraphNode {
  id: number | string;
  type: string;
  label: string;
  x?: number;
  y?: number;
}

interface GraphEdge {
  from: number | string;
  to: number | string;
}

const nodeColors = {
  threat_actor: '#ef4444',
  malware: '#f59e0b',
  vulnerability: '#10b981',
  target: '#6366f1',
  technique: '#8b5cf6'
};
const legendItems = [
{
  type: 'threat_actor',
  label: 'Threat Actor',
  icon: CircleIcon,
  color: '#ef4444'
},
{
  type: 'malware',
  label: 'Malware',
  icon: SquareIcon,
  color: '#f59e0b'
},
{
  type: 'vulnerability',
  label: 'Vulnerability',
  icon: TriangleIcon,
  color: '#10b981'
},
{
  type: 'target',
  label: 'Target',
  icon: HexagonIcon,
  color: '#6366f1'
},
{
  type: 'technique',
  label: 'Technique',
  icon: CircleIcon,
  color: '#8b5cf6'
}];

export function KnowledgeGraphPage() {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [zoom, setZoom] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch graph data from backend
    api.getGraphData()
      .then((data) => {
        setNodes(data.nodes || []);
        setEdges(data.edges || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching graph data:', err);
        setLoading(false);
      });
  }, []);

  const refreshGraph = () => {
    setLoading(true);
    api.getGraphData()
      .then((data) => {
        setNodes(data.nodes || []);
        setEdges(data.edges || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error refreshing graph:', err);
        setLoading(false);
      });
  };

  const handleExportGraph = () => {
    const dataStr = JSON.stringify({ nodes, edges }, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `knowledge-graph-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleSearchEntity = () => {
    const query = prompt('Enter entity to search (CVE, vendor, threat actor, etc.):');
    if (query) {
      api.searchGraph(query)
        .then((data) => {
          setNodes(data.nodes || []);
          setEdges(data.edges || []);
        })
        .catch((err) => {
          console.error('Search error:', err);
          alert('No results found');
        });
    }
  };
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <span className="text-terminal-green">&gt;</span>
          <h1 className="text-xl font-semibold text-white">Knowledge Graph</h1>
          <span className="text-gray-500 text-sm"> // threat relationships</span>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            onClick={handleSearchEntity}
            icon={<SearchIcon className="w-4 h-4" />}
            variant="secondary">
            Search
          </Button>
          
          <Button
            onClick={handleExportGraph}
            icon={<DownloadIcon className="w-4 h-4" />}
            variant="secondary">
            Export
          </Button>
          
          <Button
            onClick={refreshGraph}
            icon={<RefreshCwIcon className="w-4 h-4" />}
            variant="secondary"
            disabled={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Graph Canvas */}
        <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          className="lg:col-span-3 relative bg-terminal-dark rounded-lg border border-terminal-green/30 overflow-hidden neon-box-green"
          style={{
            height: '500px'
          }}>

          <span className="absolute -top-px -left-px text-terminal-green/60 text-xs z-10">
            ┌
          </span>
          <span className="absolute -top-px -right-px text-terminal-green/60 text-xs z-10">
            ┐
          </span>
          <span className="absolute -bottom-px -left-px text-terminal-green/60 text-xs z-10">
            └
          </span>
          <span className="absolute -bottom-px -right-px text-terminal-green/60 text-xs z-10">
            ┘
          </span>

          {/* Grid overlay */}
          <div className="absolute inset-0 grid-overlay" />

          {/* SVG Canvas */}
          <svg
            className="w-full h-full"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'center'
            }}>

            {/* Edges */}
            {edges.map((edge, index) => {
              const fromNode = nodes.find((n) => n.id === edge.from);
              const toNode = nodes.find((n) => n.id === edge.to);
              if (!fromNode || !toNode) return null;
              return (
                <line
                  key={index}
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke="#10b98140"
                  strokeWidth="1"
                  strokeDasharray="4 2" />);


            })}

            {/* Nodes */}
            {nodes.map((node) =>
            <g
              key={node.id}
              onClick={() => setSelectedNode(node)}
              className="cursor-pointer">

                <circle
                cx={node.x}
                cy={node.y}
                r={selectedNode?.id === node.id ? 28 : 24}
                fill={nodeColors[node.type as keyof typeof nodeColors]}
                fillOpacity={0.2}
                stroke={nodeColors[node.type as keyof typeof nodeColors]}
                strokeWidth={selectedNode?.id === node.id ? 3 : 2}
                className="transition-all duration-200" />

                <circle
                cx={node.x}
                cy={node.y}
                r={8}
                fill={nodeColors[node.type as keyof typeof nodeColors]} />

                <text
                  x={node.x}
                  y={(node.y || 0) + 40}
                  textAnchor="middle"
                  fill="#e5e5e5"
                fontSize="11"
                fontFamily="JetBrains Mono">

                  {node.label}
                </text>
              </g>
            )}
          </svg>

          {/* Coordinates display */}
          <div className="absolute bottom-4 left-4 text-xs text-gray-500 font-mono">
            [NODES: {nodes.length}] [EDGES: {edges.length}]
          </div>
        </motion.div>

        {/* Info Panel */}
        <div className="space-y-4">
          {/* Selected Node Info */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            className="relative bg-terminal-dark rounded-lg border border-terminal-green/30 p-4 neon-box-green">

            <span className="absolute -top-px -left-px text-terminal-green/60 text-xs">
              ┌
            </span>
            <span className="absolute -top-px -right-px text-terminal-green/60 text-xs">
              ┐
            </span>
            <span className="absolute -bottom-px -left-px text-terminal-green/60 text-xs">
              └
            </span>
            <span className="absolute -bottom-px -right-px text-terminal-green/60 text-xs">
              ┘
            </span>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-gray-500 text-xs">[</span>
              <span className="text-gray-400 text-xs uppercase tracking-wider">
                Node Info
              </span>
              <span className="text-gray-500 text-xs">]</span>
            </div>

            {selectedNode ?
            <div className="space-y-3">
                <div>
                  <p className="text-gray-500 text-xs">ID</p>
                  <p className="text-terminal-green font-mono">
                    {selectedNode.id}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Label</p>
                  <p className="text-white">{selectedNode.label}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Type</p>
                  <p className="text-terminal-amber">
                    {selectedNode.type.replace('_', ' ')}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Connections</p>
                  <p className="text-gray-300">
                    {
                  edges.filter(
                    (e) =>
                    e.from === selectedNode.id ||
                    e.to === selectedNode.id
                  ).length
                  }
                  </p>
                </div>
              </div> :

            <p className="text-gray-500 text-sm">
                Select a node to view details
              </p>
            }

            {selectedNode &&
            <div className="mt-4 pt-4 border-t border-terminal-green/20">
                <Button variant="ghost" size="sm" className="w-full">
                  View Full Analysis
                </Button>
              </div>
            }
          </motion.div>

          {/* Legend */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.1
            }}
            className="relative bg-terminal-dark rounded-lg border border-terminal-green/30 p-4 neon-box-green">

            <span className="absolute -top-px -left-px text-terminal-green/60 text-xs">
              ┌
            </span>
            <span className="absolute -top-px -right-px text-terminal-green/60 text-xs">
              ┐
            </span>
            <span className="absolute -bottom-px -left-px text-terminal-green/60 text-xs">
              └
            </span>
            <span className="absolute -bottom-px -right-px text-terminal-green/60 text-xs">
              ┘
            </span>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-gray-500 text-xs">[</span>
              <span className="text-gray-400 text-xs uppercase tracking-wider">
                Legend
              </span>
              <span className="text-gray-500 text-xs">]</span>
            </div>

            <div className="space-y-2">
              {legendItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.type} className="flex items-center gap-2">
                    <Icon
                      className="w-4 h-4"
                      style={{
                        color: item.color
                      }} />

                    <span className="text-gray-300 text-xs">{item.label}</span>
                  </div>);

              })}
            </div>

            {/* ASCII Art */}
            <div className="mt-4 pt-4 border-t border-terminal-green/20">
              <pre className="text-terminal-green/60 text-xs leading-tight">
                {`  ┌──●──┐
  │     │
  ●     ●
  │     │
  └──●──┘`}
              </pre>
            </div>
          </motion.div>
        </div>
      </div>
    </div>);

}