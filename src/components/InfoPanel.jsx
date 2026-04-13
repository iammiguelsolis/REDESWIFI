import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, BookOpen, Globe, ShieldAlert, Zap, Package,
  ArrowRight, MousePointerClick, Radio, ChevronRight,
  History, Lightbulb, Target, AlertTriangle, CheckCircle2,
} from 'lucide-react';

/* ────────────────────────────────────────────────────
   Sections data — each section is an accordion item
   ──────────────────────────────────────────────────── */

const SECTIONS = [
  {
    id: 'why',
    icon: History,
    accent: 'text-amber-400',
    accentBg: 'bg-amber-500/10',
    accentBorder: 'border-amber-500/20',
    title: '¿Por qué existe esto?',
    subtitle: 'Contexto Histórico',
    content: (
      <>
        <p className="text-slate-300 leading-relaxed text-xs">
          En plena <strong className="text-white">Guerra Fría (años 1960)</strong>, el Departamento
          de Defensa de EE.UU. enfrentaba un problema crítico: sus redes de comunicación
          militar eran <strong className="text-red-400">extremadamente vulnerables</strong>.
        </p>
        <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3 my-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <p className="text-red-300/90 text-sm leading-relaxed">
              <strong>El problema:</strong> Todas las comunicaciones usaban el modelo telefónico
              (conmutación de circuitos). Si un enemigo destruía <em>un solo punto</em> de
              la red, toda la comunicación entre regiones se perdía.
            </p>
          </div>
        </div>
        <p className="text-slate-300 leading-relaxed text-xs">
          El investigador <strong className="text-white">Paul Baran</strong> (RAND Corporation, 1964)
          propuso una idea revolucionaria: ¿y si los mensajes no viajaran por un único
          camino fijo, sino que se <strong className="text-indigo-300">dividieran en pedazos
          pequeños</strong> que pudieran encontrar su propia ruta?
        </p>
        <p className="text-slate-300 leading-relaxed text-[15px] mt-3">
          Esta idea dio origen a <strong className="text-white">ARPANET</strong> (1969) — la primera
          red basada en conmutación de paquetes y precursora directa de Internet.
        </p>
      </>
    ),
  },
  {
    id: 'circuits',
    icon: Zap,
    accent: 'text-amber-400',
    accentBg: 'bg-amber-500/10',
    accentBorder: 'border-amber-500/20',
    title: 'Conmutación de Circuitos',
    subtitle: 'El modelo antiguo (Telefonía)',
    content: (
      <>
        <p className="text-slate-300 leading-relaxed text-xs">
          Así funcionaban las <strong className="text-white">redes telefónicas
          tradicionales</strong>. Cuando llamabas a alguien, la red establecía
          un <strong className="text-amber-300">camino físico dedicado</strong> entre
          tu teléfono y el del destinatario.
        </p>

        <div className="bg-slate-800/60 rounded-lg p-3 my-3 border border-slate-700/50">
          <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-3">Cómo funciona</p>
          <div className="space-y-2.5">
            {[
              'Se establece UNA ruta fija antes de transmitir',
              'Todo el mensaje viaja por esa misma ruta',
              'El canal queda reservado (nadie más puede usarlo)',
              'La ruta se libera al terminar la comunicación',
            ].map((t, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="text-amber-400 font-bold text-sm mt-0.5">{i + 1}.</span>
                <p className="text-slate-300 text-sm">{t}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
          <div className="flex items-start gap-3">
            <X className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-red-300 font-semibold text-sm mb-1">Debilidad fatal</p>
              <p className="text-red-300/80 text-sm leading-relaxed">
                Si <strong>cualquier nodo</strong> de la ruta fija se daña, la comunicación
                se corta <strong>inmediatamente</strong> y no hay forma de recuperarla.
                El dato se pierde.
              </p>
            </div>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'packets',
    icon: Package,
    accent: 'text-indigo-400',
    accentBg: 'bg-indigo-500/10',
    accentBorder: 'border-indigo-500/20',
    title: 'Conmutación de Paquetes',
    subtitle: 'Internet moderno (TCP/IP)',
    content: (
      <>
        <p className="text-slate-300 leading-relaxed text-xs">
          Este es el modelo que usa <strong className="text-white">Internet</strong>. Tu
          mensaje se <strong className="text-indigo-300">divide en múltiples paquetes
          pequeños</strong>, cada uno con su propia dirección de destino. Cada paquete
          viaja de forma independiente.
        </p>

        <div className="bg-slate-800/60 rounded-lg p-3 my-3 border border-slate-700/50">
          <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-3">Cómo funciona</p>
          <div className="space-y-2.5">
            {[
              'El mensaje se divide en paquetes independientes',
              'Cada paquete puede tomar una ruta diferente',
              'Si un nodo falla, los paquetes se re-encaminan solos',
              'Al llegar al destino, los paquetes se reensamblan',
            ].map((t, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="text-indigo-400 font-bold text-sm mt-0.5">{i + 1}.</span>
                <p className="text-slate-300 text-sm">{t}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-green-300 font-semibold text-sm mb-1">Resiliencia</p>
              <p className="text-green-300/80 text-sm leading-relaxed">
                Aunque varios nodos caigan, los paquetes <strong>encuentran caminos
                alternativos automáticamente</strong>. Por eso Internet puede sobrevivir
                incluso a catástrofes masivas.
              </p>
            </div>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'howto',
    icon: Target,
    accent: 'text-green-400',
    accentBg: 'bg-green-500/10',
    accentBorder: 'border-green-500/20',
    title: '¿Cómo usar el simulador?',
    subtitle: 'Guía paso a paso',
    content: (
      <>
        <div className="space-y-3">
          {/* Step 1 */}
          <div className="flex gap-3">
            <div className="shrink-0 w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
              <span className="text-indigo-400 font-semibold text-xs">1</span>
            </div>
            <div>
              <p className="text-white font-medium text-xs mb-0.5">Elige el modo de red</p>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                En la barra inferior, alterna entre <strong className="text-amber-300">⚡ Circuitos</strong> (red
                antigua tipo telefónica) y <strong className="text-indigo-300">📦 Paquetes</strong> (Internet
                moderno).
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-3">
            <div className="shrink-0 w-7 h-7 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center">
              <span className="text-red-400 font-semibold text-xs">2</span>
            </div>
            <div>
              <p className="text-white font-medium text-xs mb-0.5">Rompe la red (simula un ataque)</p>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Haz <strong className="text-white">clic en cualquier router</strong> (nodos B, C, D, E
                o F) para desactivarlo. El nodo se atenuará con un borde rojo. Esto simula
                la destrucción física de un punto de la infraestructura.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-3">
            <div className="shrink-0 w-7 h-7 rounded-lg bg-green-600/20 border border-green-500/30 flex items-center justify-center">
              <span className="text-green-400 font-semibold text-xs">3</span>
            </div>
            <div>
              <p className="text-white font-medium text-xs mb-0.5">Envía el mensaje</p>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Presiona <strong className="text-white">"Enviar Mensaje"</strong> y observa cómo
                reacciona cada sistema. En circuitos verás un solo punto de luz; en paquetes
                verás 4 puntos de colores diferentes.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-3">
            <div className="shrink-0 w-7 h-7 rounded-lg bg-amber-600/20 border border-amber-500/30 flex items-center justify-center">
              <span className="text-amber-400 font-semibold text-xs">4</span>
            </div>
            <div>
              <p className="text-white font-medium text-xs mb-0.5">Observa la diferencia</p>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                <strong className="text-red-300">Circuitos:</strong> Si un nodo de la ruta cae,
                la transmisión <strong>falla en seco</strong>.<br/>
                <strong className="text-green-300">Paquetes:</strong> Los datos
                se <strong>re-encaminan automáticamente</strong> por rutas alternativas.
              </p>
            </div>
          </div>
        </div>

        {/* Experiments */}
        <div className="mt-4 bg-slate-800/60 rounded-lg p-3 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Experimentos sugeridos</p>
          </div>
          <div className="space-y-2">
            {[
              'Envía en modo Circuitos con todos los nodos activos → el dato llega sin problema',
              'Desactiva el nodo D y envía en Circuitos → si la ruta pasaba por D, falla',
              'Envía en modo Paquetes con todos los nodos activos → 4 paquetes, 4 rutas',
              'Desactiva B y E (ruta superior completa) en modo Paquetes → los paquetes se desvían por abajo',
              'Mientras los paquetes viajan, desactiva un nodo en su camino → re-enrutamiento en tiempo real',
            ].map((t, i) => (
              <div key={i} className="flex items-start gap-2">
                <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0 mt-1" />
                <p className="text-slate-400 text-sm leading-relaxed">{t}</p>
              </div>
            ))}
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'comparison',
    icon: Globe,
    accent: 'text-cyan-400',
    accentBg: 'bg-cyan-500/10',
    accentBorder: 'border-cyan-500/20',
    title: 'Comparativa directa',
    subtitle: 'Circuitos vs. Paquetes',
    content: (
      <>
        <div className="overflow-hidden rounded-xl border border-slate-700/50">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-800/80">
                <th className="text-left px-4 py-3 text-slate-400 font-semibold text-xs uppercase tracking-wider">Aspecto</th>
                <th className="text-left px-4 py-3 text-amber-400 font-semibold text-xs uppercase tracking-wider">Circuitos</th>
                <th className="text-left px-4 py-3 text-indigo-400 font-semibold text-xs uppercase tracking-wider">Paquetes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {[
                ['Ruta', 'Fija y dedicada', 'Dinámica por paquete'],
                ['Tolerancia a fallos', '❌ Zero', '✅ Alta'],
                ['Eficiencia', 'Baja (canal reservado)', 'Alta (recursos compartidos)'],
                ['Reacción a fallo', 'Corte total', 'Re-enrutamiento automático'],
                ['Ejemplo real', 'Telefonía tradicional', 'Internet (TCP/IP)'],
                ['Diseñado para', 'Comunicación punto a punto', 'Sobrevivir ataques'],
              ].map(([asp, circ, paq], i) => (
                <tr key={i} className="bg-slate-900/40 hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-2.5 text-white font-medium">{asp}</td>
                  <td className="px-4 py-2.5 text-slate-400">{circ}</td>
                  <td className="px-4 py-2.5 text-slate-300">{paq}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <blockquote className="mt-5 border-l-2 border-indigo-500/50 pl-4 py-1">
          <p className="text-slate-400 text-sm italic leading-relaxed">
            "La fortaleza de Internet no está en la resistencia de sus nodos,
            sino en su capacidad de encontrar caminos alternativos cuando un nodo falla."
          </p>
          <p className="text-slate-500 text-xs mt-1.5">— Principio fundamental del diseño de ARPANET</p>
        </blockquote>
      </>
    ),
  },
];

/* ────────────────────────────────────────────────────
   InfoPanel component — side drawer with accordion
   ──────────────────────────────────────────────────── */

export default function InfoPanel({ isOpen, onClose }) {
  const [expanded, setExpanded] = useState('why');

  const toggle = (id) => setExpanded(prev => (prev === id ? null : id));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-xl bg-slate-900 border-l border-slate-700/60 shadow-2xl z-50 flex flex-col"
          >
            {/* Drawer Header */}
            <div className="shrink-0 px-6 py-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-600/20 flex items-center justify-center border border-indigo-500/20">
                  <BookOpen className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-white tracking-tight">Guía del Simulador</h2>
                  <p className="text-xs text-slate-500 mt-0.5 font-normal">Historia, contexto y cómo usarlo</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors border border-slate-700/50"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Intro */}
            <div className="shrink-0 px-6 py-4 border-b border-slate-800/60">
              <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Radio className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5 animate-pulse" />
                  <p className="text-indigo-200/90 text-xs leading-relaxed font-normal">
                    Este simulador demuestra el avance tecnológico más importante
                    en la creación de <strong className="text-white italic">ARPANET</strong> e <strong className="text-white italic">Internet</strong>:
                    cómo pasar de redes vulnerables (circuitos) a redes resilientes (paquetes)
                    que sobreviven a la destrucción de nodos.
                  </p>
                </div>
              </div>
            </div>

            {/* Accordion Sections */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {SECTIONS.map(section => {
                const Ic = section.icon;
                const open = expanded === section.id;
                return (
                  <div key={section.id} className={`rounded-xl border transition-colors duration-200 overflow-hidden ${open ? section.accentBorder + ' bg-slate-800/30' : 'border-slate-800 bg-slate-900/30'}`}>
                    <button
                      onClick={() => toggle(section.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left group"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${open ? section.accentBg : 'bg-slate-800'}`}>
                        <Ic className={`w-4 h-4 ${open ? section.accent : 'text-slate-500'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium text-sm transition-colors tracking-tight ${open ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                          {section.title}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5 font-normal">{section.subtitle}</p>
                      </div>
                      <motion.div
                        animate={{ rotate: open ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight className={`w-4 h-4 ${open ? section.accent : 'text-slate-600'}`} />
                      </motion.div>
                    </button>

                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 pt-2 text-xs leading-relaxed">
                            {section.content}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Drawer Footer */}
            <div className="shrink-0 px-6 py-4 border-t border-slate-800">
              <button
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-colors text-sm shadow-lg shadow-indigo-500/20"
              >
                <ArrowRight className="w-4 h-4" />
                Comenzar a simular
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
