import { Wifi, Battery } from 'lucide-react';

interface StatusBarProps {
  dark?: boolean;
}

export function StatusBar({ dark = false }: StatusBarProps) {
  return (
    <div className={`h-11 px-6 flex items-center justify-between text-xs font-semibold select-none z-30 shrink-0 ${
      dark ? 'text-stone-100' : 'text-stone-900'
    }`}>
      {/* Time */}
      <span className="tracking-tight text-[13px] font-medium font-mono-jb">09:41</span>

      {/* Dynamic Island Pill */}
      <div className="w-24 h-5 bg-black rounded-full flex items-center justify-center gap-1.5 px-2 shadow-inner">
        <div className="w-2.5 h-2.5 rounded-full bg-stone-950 border border-stone-800" />
        <div className="w-1.5 h-1.5 rounded-full bg-stone-800/80" />
      </div>

      {/* Right Icons: Signal, WiFi, Battery */}
      <div className="flex items-center gap-1.5">
        {/* 4-bar cellular signal */}
        <div className="flex items-end gap-[1.5px] h-2.5 w-3.5">
          <span className={`w-[2px] h-1 rounded-sm ${dark ? 'bg-stone-100' : 'bg-stone-900'}`} />
          <span className={`w-[2px] h-1.5 rounded-sm ${dark ? 'bg-stone-100' : 'bg-stone-900'}`} />
          <span className={`w-[2px] h-2 rounded-sm ${dark ? 'bg-stone-100' : 'bg-stone-900'}`} />
          <span className={`w-[2px] h-2.5 rounded-sm ${dark ? 'bg-stone-100' : 'bg-stone-900'}`} />
        </div>

        <Wifi className="w-3.5 h-3.5" />
        
        <div className="flex items-center gap-0.5">
          <Battery className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
