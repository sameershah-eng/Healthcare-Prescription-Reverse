import { useMushongaStore } from '../../store/useMushongaStore';
import { Role } from '../../types';
import { translations } from '../../i18n/translations';
import { ShieldCheck, Award, MapPin, Clock, Stethoscope, Moon, Sun } from 'lucide-react';

interface DoctorProfileProps {
  onSwitchRole?: (role: Role) => void;
}

export function DoctorProfile({ onSwitchRole }: DoctorProfileProps) {
  const language = useMushongaStore((s) => s.language);
  const currency = useMushongaStore((s) => s.currency);
  const setCurrency = useMushongaStore((s) => s.setCurrency);
  const themeMode = useMushongaStore((s) => s.themeMode);
  const setThemeMode = useMushongaStore((s) => s.setThemeMode);
  const t = translations[language];

  return (
    <div className="flex-1 overflow-y-auto phone-scroll p-4 pb-24 space-y-4 select-none">
      {/* Header */}
      <div className="flex items-center gap-3.5 pt-2">
        <div className="w-16 h-16 rounded-3xl overflow-hidden border-2 border-[#2B4C7E] shadow-md">
          <img
            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400"
            alt="Dr. Chikwanha"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h2 className="font-fraunces text-xl font-bold text-stone-900 dark:text-stone-100">
            Dr. Rumbidzai Chikwanha
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Specialist Physician · MBChB (UZ), FCP (ECSA)
          </p>
          <div className="flex items-center gap-1 text-[11px] text-[#1F8A5B] font-semibold mt-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>MCZ-MD-44819 Active License</span>
          </div>
        </div>
      </div>

      {/* Clinical Practice Overview */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-2">
        <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
          Practice Information
        </span>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800/60">
            <span className="text-[10px] text-stone-400 block">Clinic Practice</span>
            <span className="font-bold text-stone-800 dark:text-stone-200">Belgravia Medical</span>
          </div>
          <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800/60">
            <span className="text-[10px] text-stone-400 block">Consultation Fee</span>
            <span className="font-bold text-stone-800 dark:text-stone-200 font-mono-jb">US$35.00</span>
          </div>
          <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800/60">
            <span className="text-[10px] text-stone-400 block">Operating Hours</span>
            <span className="font-bold text-stone-800 dark:text-stone-200">08:30 – 16:30</span>
          </div>
          <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800/60">
            <span className="text-[10px] text-stone-400 block">Slot Length</span>
            <span className="font-bold text-stone-800 dark:text-stone-200 font-mono-jb">20 minutes</span>
          </div>
        </div>
      </div>

      {/* Preferences & System */}
      <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-3">
        <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
          Display Settings
        </span>

        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-stone-700 dark:text-stone-300">Currency</span>
          <div className="flex items-center p-0.5 rounded-xl bg-stone-100 dark:bg-stone-800 font-mono-jb">
            <button
              onClick={() => setCurrency('USD')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                currency === 'USD' ? 'bg-[#D9673A] text-white shadow-xs' : 'text-stone-500'
              }`}
            >
              USD
            </button>
            <button
              onClick={() => setCurrency('ZiG')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                currency === 'ZiG' ? 'bg-[#D9673A] text-white shadow-xs' : 'text-stone-500'
              }`}
            >
              ZiG
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-stone-700 dark:text-stone-300">Theme</span>
          <button
            onClick={() => setThemeMode(themeMode === 'light' ? 'dark' : 'light')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold"
          >
            {themeMode === 'light' ? <Sun className="w-3.5 h-3.5 text-[#D99A1E]" /> : <Moon className="w-3.5 h-3.5 text-stone-400" />}
            <span>{themeMode === 'light' ? 'Light' : 'Dark'}</span>
          </button>
        </div>
      </div>

      {/* Role Switcher */}
      {onSwitchRole && (
        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-2">
          <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
            Switch Mushonga App
          </span>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => onSwitchRole('patient')}
              className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-center hover:bg-stone-200"
            >
              Patient
            </button>
            <button
              onClick={() => onSwitchRole('doctor')}
              className="p-2 rounded-xl bg-[#2B4C7E] text-white font-bold text-center"
            >
              Doctor
            </button>
            <button
              onClick={() => onSwitchRole('pharmacy')}
              className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-center hover:bg-stone-200"
            >
              Pharmacy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
