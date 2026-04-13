// ═══════════════════════════════════════════
// NETWORK TOPOLOGY & GRAPH ALGORITHMS
// ═══════════════════════════════════════════

export const NODES = {
  origin: { id: 'origin', x: 10, y: 50, label: 'ORIGEN', type: 'endpoint', icon: 'laptop' },
  B: { id: 'B', x: 30, y: 25, label: 'B', type: 'router', icon: 'router' },
  C: { id: 'C', x: 30, y: 75, label: 'C', type: 'router', icon: 'router' },
  D: { id: 'D', x: 50, y: 50, label: 'D', type: 'router', icon: 'router' },
  E: { id: 'E', x: 70, y: 25, label: 'E', type: 'router', icon: 'router' },
  F: { id: 'F', x: 70, y: 75, label: 'F', type: 'router', icon: 'router' },
  dest: { id: 'dest', x: 90, y: 50, label: 'DESTINO', type: 'endpoint', icon: 'server' },
};

export const EDGES = [
  ['origin', 'B'], ['origin', 'C'],
  ['B', 'D'], ['B', 'E'],
  ['C', 'D'], ['C', 'F'],
  ['D', 'E'], ['D', 'F'],
  ['E', 'dest'], ['F', 'dest'],
];

// Pre-built adjacency list
const ADJ = {};
Object.keys(NODES).forEach(id => (ADJ[id] = []));
EDGES.forEach(([a, b]) => { ADJ[a].push(b); ADJ[b].push(a); });
export { ADJ };

/** BFS shortest path from `start` to `end`, only through active intermediate nodes */
export function findPath(start, end, activeSet) {
  const visited = new Set([start]);
  const queue = [[start]];

  while (queue.length > 0) {
    const path = queue.shift();
    const current = path[path.length - 1];
    if (current === end) return path;

    for (const nb of ADJ[current]) {
      if (visited.has(nb)) continue;
      if (nb === end || nb === start || activeSet.has(nb)) {
        visited.add(nb);
        queue.push([...path, nb]);
      }
    }
  }
  return null;
}

/** Generate 4 diverse paths for packet mode, falling back to BFS */
export function findDiversePaths(activeSet, count = 4) {
  const preferred = [
    ['origin', 'B', 'E', 'dest'],
    ['origin', 'C', 'F', 'dest'],
    ['origin', 'B', 'D', 'F', 'dest'],
    ['origin', 'C', 'D', 'E', 'dest'],
  ];

  return preferred.slice(0, count).map(route => {
    const nodesOk = route.every(n => n === 'origin' || n === 'dest' || activeSet.has(n));
    const edgesOk = nodesOk && route.every((n, i) =>
      i === route.length - 1 || ADJ[n].includes(route[i + 1])
    );
    return edgesOk ? [...route] : findPath('origin', 'dest', activeSet);
  });
}

/** Packet visual colours */
export const PACKET_STYLES = [
  { cls: 'packet-glow',       hex: '#60a5fa' },
  { cls: 'packet-glow-green', hex: '#4ade80' },
  { cls: 'packet-glow-amber', hex: '#fbbf24' },
  { cls: 'packet-glow-red',   hex: '#f87171' },
];
