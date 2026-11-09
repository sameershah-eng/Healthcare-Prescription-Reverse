import { useMushongaStore } from '../../store/useMushongaStore';
import { motion, AnimatePresence } from 'motion/react';
import { Database, Activity } from 'lucide-react';

export function DataLinesOverlay() {
  const activeParticle = useMushongaStore((s) => s.activeParticle);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* SVG Canvas for connection lines */}
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0F3B34" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#D9673A" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0F3B34" stopOpacity="0.4" />
          </linearGradient>

          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Path Left Phone (Patient) to Central Core */}
        <path
          d="M calc(50% - 370px) 240 Q calc(50% - 180px) 140 calc(50%) 140"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="4 4"
          fill="none"
          className="text-stone-700/60"
        />

        {/* Path Center Phone (Doctor) to Central Core */}
        <path
          d="M calc(50%) 240 L calc(50%) 165"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="4 4"
          fill="none"
          className="text-stone-700/60"
        />

        {/* Path Right Phone (Pharmacy) to Central Core */}
        <path
          d="M calc(50% + 370px) 240 Q calc(50% + 180px) 140 calc(50%) 140"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="4 4"
          fill="none"
          className="text-stone-700/60"
        />
      </svg>

      {/* Central Node: "Mushonga Core API" */}
      <div className="absolute top-[108px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
        <div className="px-4 py-2 rounded-2xl bg-stone-900/95 border border-stone-700/80 text-stone-100 shadow-xl backdrop-blur-md flex items-center gap-2.5">
          <div className="relative">
            <Database className="w-4 h-4 text-[#D9673A]" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#1F8A5B] animate-ping" />
          </div>
          <div>
            <div className="text-[11px] font-bold tracking-wider font-mono-jb flex items-center gap-1.5">
              <span>Mushonga Core API</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-stone-800 text-[#1F8A5B] font-semibold">
                SYNCED
              </span>
            </div>
            <div className="text-[9px] text-stone-400 font-mono-jb">
              Single Source of Truth · Harare Cloud Node
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
              className="mt-1 px-3 py-1 rounded-full bg-[#D9673A] text-white text-[11px] font-bold shadow-lg flex items-center gap-1.5"
            >
              <Activity className="w-3.5 h-3.5 animate-spin" />
              <span>{activeParticle.summary}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Traveling Copper Particle along connection lines */}
      <AnimatePresence>
        {activeParticle && (
          <motion.div
            key={activeParticle.id}
            initial={{
              x: activeParticle.from === 'patient'
                ? 'calc(50vw - 370px)'
                : activeParticle.from === 'doctor'
                ? '50vw'
                : 'calc(50vw + 370px)',
              y: 240,
              opacity: 0,
              scale: 0.5
            }}
            animate={{
              x: ['calc(50vw)', activeParticle.to.includes('patient') ? 'calc(50vw - 370px)' : activeParticle.to.includes('pharmacy') ? 'calc(50vw + 370px)' : '50vw'],
              y: [140, 240],
              opacity: [1, 1, 0.8],
              scale: [1.4, 1.8, 1]
            }}
            transition={{ duration: 1.6, ease: 'easeInOut' }}
            className="absolute w-5 h-5 -ml-2.5 -mt-2.5 rounded-full bg-[#D9673A] shadow-[0_0_16px_#D9673A] border-2 border-white pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
