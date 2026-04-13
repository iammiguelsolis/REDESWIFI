import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { NODES, EDGES, findPath, findDiversePaths, PACKET_STYLES } from '../utils/graph';

/**
 * Custom hook that owns ALL simulation state + animation loop.
 * Returns everything the UI component needs.
 */
export default function useSimulation() {
  const [mode, setMode] = useState('packets');
  const [nodeActive, setNodeActive] = useState({ B: true, C: true, D: true, E: true, F: true });
  const [statusMsg, setStatusMsg] = useState({ text: 'Listo para enviar', type: 'idle' });
  const [isSimulating, setIsSimulating] = useState(false);
  const [displayPackets, setDisplayPackets] = useState([]);
  const [arrivedCount, setArrivedCount] = useState(0);

  // Mutable refs for the hot animation loop
  const pkts = useRef([]);
  const frameId = useRef(null);
  const lastT = useRef(0);
  const nodeRef = useRef(nodeActive);
  const modeRef = useRef(mode);
  const simRef = useRef(false);

  useEffect(() => { nodeRef.current = nodeActive; }, [nodeActive]);
  useEffect(() => { modeRef.current = mode; }, [mode]);

  const activeSet = useCallback(() => {
    const s = new Set();
    Object.entries(nodeRef.current).forEach(([id, v]) => v && s.add(id));
    return s;
  }, []);

  const activeCount = useMemo(
    () => Object.values(nodeActive).filter(Boolean).length + 2,
    [nodeActive],
  );

  /* ── toggle node ── */
  const toggleNode = useCallback(id => {
    if (id === 'origin' || id === 'dest') return;
    setNodeActive(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  /* ── animation frame ── */
  const tick = useCallback(ts => {
    if (!simRef.current) return;
    const dt = Math.min((ts - lastT.current) / 1000, 0.1);
    lastT.current = ts;

    const pktArr = pkts.current;
    const aSet = activeSet();
    const curMode = modeRef.current;
    let err = false, arrived = 0;

    for (const p of pktArr) {
      if (p.status === 'arrived') { arrived++; continue; }
      if (p.status === 'error') continue;

      // delay
      if (p.delay > 0) { p.delay -= dt; continue; }

      // blocked → retry reroute
      if (p.status === 'blocked') {
        const from = p.route[p.segmentIndex];
        const np = findPath(from, 'dest', aSet);
        if (np) { p.route = np; p.segmentIndex = 0; p.progress = 0; p.status = 'traveling'; }
        continue;
      }

      // mid-segment: check next hop
      if (p.segmentIndex < p.route.length - 1) {
        const next = p.route[p.segmentIndex + 1];
        const down = next !== 'origin' && next !== 'dest' && !aSet.has(next);

        if (down) {
          if (curMode === 'circuits') { p.status = 'error'; err = true; continue; }
          // packets: reroute from current from-node
          const from = p.route[p.segmentIndex];
          const np = findPath(from, 'dest', aSet);
          if (np) { p.route = np; p.segmentIndex = 0; p.progress = 0; }
          else { p.status = 'blocked'; }
          continue;
        }

        // circuits: verify entire remaining route
        if (curMode === 'circuits') {
          for (let i = p.segmentIndex + 1; i < p.route.length - 1; i++) {
            const nid = p.route[i];
            if (nid !== 'origin' && nid !== 'dest' && !aSet.has(nid)) {
              p.status = 'error'; err = true; break;
            }
          }
          if (p.status === 'error') continue;
        }
      }

      // advance
      p.progress += p.speed * dt;

      if (p.progress >= 1) {
        p.segmentIndex++;
        p.progress = 0;
        const at = p.route[p.segmentIndex];
        if (at === 'dest') { p.status = 'arrived'; arrived++; continue; }

        // packets: validate next hop after arriving at node
        if (curMode === 'packets' && p.segmentIndex < p.route.length - 1) {
          const nh = p.route[p.segmentIndex + 1];
          if (nh !== 'dest' && !aSet.has(nh)) {
            const np = findPath(at, 'dest', aSet);
            if (np) { p.route = [...p.route.slice(0, p.segmentIndex), ...np]; }
            else { p.status = 'blocked'; }
          }
        }
      }
    }

    // build display data
    const disp = pktArr.map(p => {
      let x, y;
      if (p.delay > 0) { x = NODES.origin.x; y = NODES.origin.y; }
      else if (p.status === 'arrived') { x = NODES.dest.x; y = NODES.dest.y; }
      else if (p.status === 'blocked' || p.status === 'error') {
        const n = NODES[p.route[Math.min(p.segmentIndex, p.route.length - 1)]];
        x = n.x; y = n.y;
      } else {
        const fi = Math.min(p.segmentIndex, p.route.length - 1);
        const ti = Math.min(p.segmentIndex + 1, p.route.length - 1);
        const f = NODES[p.route[fi]], t = NODES[p.route[ti]];
        const prog = Math.min(p.progress, 1);
        x = f.x + (t.x - f.x) * prog;
        y = f.y + (t.y - f.y) * prog;
      }
      return { id: p.id, x, y, status: p.status, colorIdx: p.colorIdx,
               segmentIndex: p.segmentIndex, route: p.route, delay: p.delay };
    });

    setDisplayPackets(disp);
    setArrivedCount(arrived);

    // ── completion checks ──
    if (err && curMode === 'circuits') {
      setStatusMsg({ text: '⚠ Error: Falla de conexión en circuito', type: 'error' });
      simRef.current = false; setIsSimulating(false); return;
    }
    if (pktArr.every(p => p.status === 'arrived')) {
      setStatusMsg({
        text: curMode === 'circuits'
          ? '✓ Mensaje transmitido exitosamente por el circuito'
          : '✓ ¡Todos los paquetes llegaron y se reensamblaron!',
        type: 'success',
      });
      simRef.current = false; setIsSimulating(false); return;
    }
    if (pktArr.every(p => p.status !== 'traveling' && p.status !== 'blocked')) {
      setStatusMsg({ text: '⚠ Algunos paquetes no pudieron llegar', type: 'error' });
      simRef.current = false; setIsSimulating(false); return;
    }

    frameId.current = requestAnimationFrame(tick);
  }, [activeSet]);

  /* ── send ── */
  const handleSend = useCallback(() => {
    if (simRef.current) return;
    const aSet = activeSet();

    if (modeRef.current === 'circuits') {
      const path = findPath('origin', 'dest', aSet);
      if (!path) { setStatusMsg({ text: '⚠ No existe ruta disponible', type: 'error' }); return; }
      pkts.current = [{ id: 0, route: path, segmentIndex: 0, progress: 0, speed: 0.7, status: 'traveling', colorIdx: 0, delay: 0 }];
    } else {
      const paths = findDiversePaths(aSet, 4);
      if (paths.some(p => !p)) { setStatusMsg({ text: '⚠ No hay suficientes rutas', type: 'error' }); return; }
      pkts.current = paths.map((r, i) => ({
        id: i, route: r, segmentIndex: 0, progress: 0,
        speed: 0.5 + i * 0.09, status: 'traveling', colorIdx: i, delay: i * 0.4,
      }));
    }

    setDisplayPackets([]); setArrivedCount(0);
    setStatusMsg({
      text: modeRef.current === 'circuits' ? 'Transmitiendo por circuito dedicado…' : 'Enviando paquetes por múltiples rutas…',
      type: 'active',
    });
    simRef.current = true; setIsSimulating(true);
    lastT.current = performance.now();
    frameId.current = requestAnimationFrame(tick);
  }, [tick, activeSet]);

  /* ── reset ── */
  const handleReset = useCallback(() => {
    cancelAnimationFrame(frameId.current);
    pkts.current = [];
    simRef.current = false; setIsSimulating(false);
    setDisplayPackets([]); setArrivedCount(0);
    setNodeActive({ B: true, C: true, D: true, E: true, F: true });
    setStatusMsg({ text: 'Listo para enviar', type: 'idle' });
  }, []);

  useEffect(() => () => cancelAnimationFrame(frameId.current), []);

  return {
    mode, setMode, nodeActive, toggleNode, statusMsg,
    isSimulating, displayPackets, arrivedCount, activeCount,
    handleSend, handleReset,
  };
}
