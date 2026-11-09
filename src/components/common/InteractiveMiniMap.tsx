import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { useMushongaStore } from '../../store/useMushongaStore';

interface InteractiveMiniMapProps {
  radiusKm: number;
  onRadiusChange?: (km: number) => void;
  dark?: boolean;
}

export function InteractiveMiniMap({
  radiusKm,
  onRadiusChange,
  dark = false
}: InteractiveMiniMapProps) {
  const pharmacies = useMushongaStore((s) => s.pharmacies);
  const [selectedSub, setSelectedSub] = useState<string>('Avondale');

  // Suburb positions relative to map center (Harare)
  const suburbs = [
    { name: 'Avondale', x: 120, y: 85, isPatient: true },
    { name: 'Belgravia', x: 165, y: 95 },
    { name: 'Milton Park', x: 135, y: 130 },
    { name: 'Borrowdale', x: 230, y: 50 },
    { name: 'Mt Pleasant', x: 175, y: 55 },
    { name: 'Greendale', x: 250, y: 125 }
  ];

  const filteredPharmacies = pharmacies.filter((p) => p.distanceKm <= radiusKm);

  return (
    <div className={`rounded-2xl border overflow-hidden ${
      dark ? 'bg-stone-900 border-stone-800' : 'bg-stone-50 border-stone-200'
    }`}>
      {/* Map Graphic Area */}
      <div className="relative h-44 w-full bg-[#E5E9E7] dark:bg-[#16221F] overflow-hidden select-none">
        {/* Subtle grid lines mimicking street grid */}
        <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="currentColor" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" className="text-stone-400 dark:text-stone-700" />
          
          {/* Main Harare Arteries (Samora Machel, King George, Borrowdale Rd) */}
          <path d="M 0 100 Q 150 95 320 110" stroke="#0F3B34" strokeWidth="3" fill="none" strokeOpacity="0.25" />
          <path d="M 120 0 Q 140 100 135 180" stroke="#0F3B34" strokeWidth="2.5" fill="none" strokeOpacity="0.25" />
          <path d="M 160 100 L 250 30" stroke="#D9673A" strokeWidth="2.5" fill="none" strokeOpacity="0.35" />
        </svg>

        {/* Dynamic Radius Circle centered at Avondale (x: 120, y: 85) */}
        <div
          className="absolute rounded-full border-2 border-[#D9673A]/60 bg-[#D9673A]/10 pointer-events-none transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: 120,
            top: 85,
            width: radiusKm === 5 ? 100 : radiusKm === 10 ? 170 : 250,
            height: radiusKm === 5 ? 100 : radiusKm === 10 ? 170 : 250
          }}
        />

        {/* Suburb labels & nodes */}
        {suburbs.map((sub) => (
          <div
            key={sub.name}
            onClick={() => setSelectedSub(sub.name)}
            style={{ left: sub.x, top: sub.y }}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group flex flex-col items-center"
          >
            {sub.isPatient ? (
              <div className="relative">
                <div className="w-5 h-5 rounded-full bg-[#D9673A] border-2 border-white shadow-md flex items-center justify-center text-white">
                  <MapPin className="w-3 h-3" />
                </div>
                <div className="absolute -inset-1 rounded-full bg-[#D9673A]/30 animate-ping -z-10" />
              </div>
            ) : (
              <div className="w-2.5 h-2.5 rounded-full bg-[#0F3B34] dark:bg-[#389182] border border-white shadow-xs" />
            )}
            <span className={`text-[9px] font-bold px-1 rounded whitespace-nowrap mt-0.5 shadow-2xs ${
              sub.isPatient 
                ? 'bg-[#D9673A] text-white' 
                : 'bg-white/90 dark:bg-stone-900/90 text-stone-700 dark:text-stone-300'
            }`}>
              {sub.name}
            </span>
          </div>
        ))}

        {/* Bottom map overlay indicator */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] bg-white/90 dark:bg-stone-900/90 px-2 py-1 rounded-md backdrop-blur-xs border border-stone-200 dark:border-stone-800">
          <span className="font-semibold text-stone-800 dark:text-stone-200">
            Avondale, Harare (Centre)
          </span>
          <span className="font-mono-jb text-[#D9673A] font-bold">
            {filteredPharmacies.length} pharmacies in {radiusKm}km
          </span>
        </div>
      </div>

      {/* Radius Selector Pills */}
      {onRadiusChange && (
        <div className="p-3 flex items-center justify-between">
          <span className="text-xs text-stone-500 font-medium">Search Radius</span>
          <div className="flex items-center gap-1.5">
            {[5, 10, 25].map((km) => (
              <button
                key={km}
                type="button"
                onClick={() => onRadiusChange(km)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  radiusKm === km
                    ? 'bg-[#0F3B34] text-white shadow-xs'
                    : 'bg-stone-200/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-700'
                }`}
              >
                {km} km
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
