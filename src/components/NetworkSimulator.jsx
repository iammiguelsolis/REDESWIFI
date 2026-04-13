import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Laptop, Router, Server, Send, RotateCcw,
  Zap, Package, Activity, CheckCircle2, AlertTriangle, Circle,
  Network, BookOpen, Info,
} from 'lucide-react';
import { NODES, EDGES, PACKET_STYLES } from '../utils/graph';
import useSimulation from '../hooks/useSimulation';
import InfoPanel from './InfoPanel';

const ICON = { laptop: Laptop, router: Router, server: Server };

/* ─── Sub-components ─── */

function StatCounter({ label, value, accent }) {
  return (
    <div className="text-center px-10 py-4 bg-slate-800/60 rounded-2xl border border-slate-700/50 min-w-[140px]">
      <p className="text-[10px] font-bold tracking-[0.25em] text-slate-500 uppercase mb-2">{label}</p>
      <p className={`text-2xl font-black leading-tight ${accent || 'text-white'}`}>{String(value)}</p>
    </div>
  );
}

function StatusBar({ status }) {
  const map = {
    idle: { color: 'text-slate-400', bg: 'bg-slate-800/50', icon: Circle },
    active: { color: 'text-indigo-300', bg: 'bg-indigo-500/10', icon: Activity },
    success: { color: 'text-green-300', bg: 'bg-green-500/10', icon: CheckCircle2 },
    error: { color: 'text-red-300', bg: 'bg-red-500/10', icon: AlertTriangle },
  };
  const s = map[status.type] || map.idle;
  const Ic = s.icon;
  return (
    <div className={`inline-flex items-center gap-3 text-sm font-semibold px-3 py-1.5 rounded-full ${s.color} ${s.bg}`}>
      <Ic className="w-4 h-4" />
      <span>{status.text}</span>
    </div>
  );
}

/* ─── MAIN ─── */

export default function NetworkSimulator() {
  const sim = useSimulation();
  const [showInfo, setShowInfo] = useState(false);

  const activeEdges = useMemo(() => {
    const s = new Set();
    sim.displayPackets.forEach(p => {
      if (p.status === 'traveling' && p.delay <= 0 && p.segmentIndex < p.route.length - 1) {
        const a = p.route[p.segmentIndex], b = p.route[p.segmentIndex + 1];
        s.add(`${a}-${b}`); s.add(`${b}-${a}`);
      }
    });
    return s;
  }, [sim.displayPackets]);

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col select-none overflow-hidden">

      {/* ══════════ TOP BAR ══════════ */}
      <header className="shrink-0 px-8 py-4 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md z-20">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 flex items-center justify-center border border-indigo-500/20">
              <Network className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight leading-tight">Simulador de Resiliencia de Red</h1>
              <p className="text-sm text-slate-500 mt-0.5">Conmutación de Circuitos vs. Paquetes</p>
            </div>
          </div>
          <StatusBar status={sim.statusMsg} />
        </div>
        <div className="flex items-center gap-5">
          <StatCounter label="MODO" value={sim.mode === 'circuits' ? 'Circuitos' : 'Paquetes'} accent={sim.mode === 'circuits' ? 'text-amber-400' : 'text-indigo-400'} />
          <StatCounter label="NODOS ACTIVOS" value={`${sim.activeCount}/7`} accent={sim.activeCount < 7 ? 'text-amber-400' : 'text-green-400'} />
          <StatCounter label="EN DESTINO" value={sim.arrivedCount} accent={sim.arrivedCount > 0 ? 'text-green-400' : 'text-white'} />
          <button
            onClick={() => setShowInfo(true)}
            className="w-14 h-14 rounded-xl bg-slate-800/60 hover:bg-indigo-600/30 border border-slate-700/50 hover:border-indigo-500/40 flex items-center justify-center transition-all duration-200 group"
            title="¿Qué es esto? — Guía del simulador"
          >
            <BookOpen className="w-6 h-6 text-slate-400 group-hover:text-indigo-400 transition-colors" />
          </button>
        </div>
      </header>

      {/* ══════════ NETWORK CANVAS (fills remaining space) ══════════ */}
      <main className="flex-1 relative grid-bg min-h-0">
        {/* SVG connection lines */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="0.6" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {EDGES.map(([a, b]) => {
            const nA = NODES[a], nB = NODES[b];
            const lit = activeEdges.has(`${a}-${b}`);
            const aOff = a !== 'origin' && a !== 'dest' && !sim.nodeActive[a];
            const bOff = b !== 'origin' && b !== 'dest' && !sim.nodeActive[b];
            const dead = aOff || bOff;
            return (
              <line key={`${a}-${b}`}
                x1={nA.x} y1={nA.y} x2={nB.x} y2={nB.y}
                stroke={dead ? '#451a1a' : lit ? '#818cf8' : '#334155'}
                strokeWidth={lit ? 0.6 : 0.3}
                strokeLinecap="round"
                filter={lit ? 'url(#glow)' : undefined}
                style={{ transition: 'stroke 0.3s, stroke-width 0.3s' }}
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {Object.values(NODES).map(node => {
          const isEndpoint = node.type === 'endpoint';
          const active = isEndpoint || sim.nodeActive[node.id];
          const Ic = ICON[node.icon];
          return (
            <div key={node.id}
              className="absolute flex flex-col items-center gap-1.5 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${node.x}%`, top: `${node.y}%`, zIndex: 10 }}
            >
              <motion.button
                whileHover={!isEndpoint ? { scale: 1.18 } : {}}
                whileTap={!isEndpoint ? { scale: 0.92 } : {}}
                onClick={() => sim.toggleNode(node.id)}
                disabled={isEndpoint}
                className={`
                  relative rounded-full flex items-center justify-center transition-all duration-300
                  w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20
                  ${isEndpoint
                    ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-indigo-500/60 shadow-lg shadow-indigo-500/10 cursor-default'
                    : active
                      ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-600 hover:border-indigo-400 cursor-pointer shadow-lg shadow-slate-900/50 hover:shadow-indigo-500/20'
                      : 'bg-slate-950 border-2 border-red-500/40 cursor-pointer opacity-60 shadow-lg shadow-red-900/20'
                  }
                `}
              >
                {active && isEndpoint && (
                  <span className="absolute inset-[-6px] rounded-full border-2 border-indigo-400/25 animate-[pulse-ring_2.5s_ease-in-out_infinite]" />
                )}
                <Ic className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 ${active ? 'text-slate-200' : 'text-red-400'}`} />
              </motion.button>
              <span className={`text-[10px] sm:text-xs font-bold tracking-widest ${active ? 'text-slate-400' : 'text-red-400/60'}`}>
                {node.label}
              </span>
            </div>
          );
        })}

        {/* Packets */}
        <AnimatePresence>
          {sim.displayPackets.map(p => {
            if (p.delay > 0) return null;
            const style = PACKET_STYLES[p.colorIdx] || PACKET_STYLES[0];
            return (
              <motion.div key={p.id}
                className={`absolute w-4 h-4 sm:w-5 sm:h-5 rounded-full ${style.cls} -translate-x-1/2 -translate-y-1/2 pointer-events-none`}
                style={{ left: `${p.x}%`, top: `${p.y}%`, backgroundColor: style.hex, zIndex: 20 }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: p.status === 'arrived' ? [1, 1.8, 0] : p.status === 'error' ? 0.5 : 1,
                  opacity: p.status === 'arrived' ? [1, 1, 0] : p.status === 'error' ? 0.35 : 1,
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: p.status === 'arrived' ? 0.7 : 0.3 }}
              />
            );
          })}
        </AnimatePresence>

        {/* Hint */}
        {!sim.isSimulating && sim.displayPackets.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-sm text-slate-500 bg-slate-900/80 px-5 py-2.5 rounded-full backdrop-blur-md border border-slate-700/40 pointer-events-none z-10"
          >
            <Info className="w-4 h-4 text-slate-400" />
            Haz clic en un router para desactivarlo · luego presiona "Enviar Mensaje"
          </motion.div>
        )}
      </main>

      {/* ══════════ BOTTOM BAR ══════════ */}
      <footer className="shrink-0 px-8 py-4 flex flex-col xl:flex-row items-center justify-between gap-6 border-t border-slate-800/80 bg-slate-900/60 backdrop-blur-md z-20">
        {/* Mode toggle */}
        <div className="flex bg-slate-800/80 rounded-2xl p-2 gap-2 border border-slate-700/50">
          {[
            { key: 'circuits', label: 'Circuitos', icon: Zap },
            { key: 'packets', label: 'Paquetes', icon: Package },
          ].map(({ key, label, icon: Ic }) => (
            <button key={key}
              onClick={() => !sim.isSimulating && sim.setMode(key)}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-250
                ${sim.mode === key
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
            >
              <Ic className="w-5 h-5" />{label}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={sim.handleSend} disabled={sim.isSimulating}
            className="flex items-center gap-3 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500
              text-white font-bold rounded-xl transition-all duration-200 text-sm
              shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/50
              disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-indigo-600"
          >
            <Send className="w-5 h-5" />Enviar Mensaje
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={sim.handleReset}
            className="flex items-center gap-3 px-6 py-3.5 bg-slate-800/80 hover:bg-slate-700
              text-slate-300 font-bold rounded-xl transition-colors duration-200 border border-slate-700/50 text-sm"
          >
            <RotateCcw className="w-5 h-5" />Reiniciar Red
          </motion.button>
        </div>
      </footer>

      {/* ══════════ INFO PANEL ══════════ */}
      <InfoPanel isOpen={showInfo} onClose={() => setShowInfo(false)} />
    </div>
  );
}
