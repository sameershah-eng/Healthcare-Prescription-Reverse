import { useMushongaStore } from '../../store/useMushongaStore';
import { motion, AnimatePresence } from 'motion/react';
import { Database, Activity } from 'lucide-react';

export function DataLinesOverlay() {
  const activeParticle = useMushongaStore((s) => s.activeParticle);
  const themeMode = useMushongaStore((s) => s.themeMode);
  const isDark = themeMode === 'dark';

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* SVG Canvas for connection lines using responsive viewBox */}
      <svg
        className="w-full h-72 absolute top-12 left-0"
        viewBox="0 0 1000 200"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0F3B34" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#D9673A" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0F3B34" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Path Left Phone (x: 200) to Central Core (x: 500, y: 70) */}
        <path
          d="M 220 180 Q 340 70 500 70"
          stroke={isDark ? '#44403c' : '#a8a29e'}
          strokeWidth="2.5"
          strokeDasharray="5 5"
          fill="none"
          strokeOpacity="0.7"
        />

        {/* Path Center Phone (x: 500) to Central Core (x: 500, y: 70) */}
        <path
          d="M 500 180 L 500 95"
          stroke={isDark ? '#44403c' : '#a8a29e'}
          strokeWidth="2.5"
          strokeDasharray="5 5"
          fill="none"
          strokeOpacity="0.7"
        />

        {/* Path Right Phone (x: 780) to Central Core (x: 500, y: 70) */}
        <path
          d="M 780 180 Q 660 70 500 70"
          stroke={isDark ? '#44403c' : '#a8a29e'}
          strokeWidth="2.5"
          strokeDasharray="5 5"
          fill="none"
          strokeOpacity="0.7"
        />
      </svg>

      {/* Central Node: "Mushonga Core API" */}
      <div className="absolute top-[88px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
        <div className={`px-4 py-2 rounded-2xl border shadow-xl backdrop-blur-md flex items-center gap-2.5 ${
          isDark
            ? 'bg-stone-900/95 border-stone-700/80 text-stone-100'
            : 'bg-white/95 border-stone-300 text-stone-900'
        }`}>
          <div className="relative">
            <Database className="w-4 h-4 text-[#D9673A]" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#1F8A5B] animate-ping" />
          </div>
          <div>
            <div className="text-[11px] font-bold tracking-wider font-mono-jb flex items-center gap-1.5">
              <span>Mushonga Core API</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#1F8A5B]/15 text-[#1F8A5B] font-semibold">
                LIVE
              </span>
            </div>
            <div className="text-[9px] text-stone-400 font-mono-jb">
              Single Source of Truth · Harare Node
            </div>
          </div>
        </div>

        {/* Active event banner below core node */}
        <AnimatePresence>
          {activeParticle && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mt-1.5 px-3 py-1 rounded-full bg-[#D9673A] text-white text-[11px] font-bold shadow-lg flex items-center gap-1.5"
            >
              <Activity className="w-3.5 h-3.5 animate-spin" />
              <span>{activeParticle.summary}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
