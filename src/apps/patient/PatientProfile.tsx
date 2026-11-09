import { useMushongaStore } from '../../store/useMushongaStore';
import { Role } from '../../types';
import { translations } from '../../i18n/translations';
import { User, Phone, MapPin, Globe, Moon, Sun, Smartphone, WifiOff, ShieldCheck, Heart } from 'lucide-react';

interface PatientProfileProps {
  onSwitchRole?: (role: Role) => void;
}

export function PatientProfile({ onSwitchRole }: PatientProfileProps) {
  const language = useMushongaStore((s) => s.language);
  const setLanguage = useMushongaStore((s) => s.setLanguage);
  const currency = useMushongaStore((s) => s.currency);
  const setCurrency = useMushongaStore((s) => s.setCurrency);
  const themeMode = useMushongaStore((s) => s.themeMode);
  const setThemeMode = useMushongaStore((s) => s.setThemeMode);
  const isOffline = useMushongaStore((s) => s.isOffline);
  const setIsOffline = useMushongaStore((s) => s.setIsOffline);

  const t = translations[language];

  return (
    <div className="flex-1 overflow-y-auto phone-scroll p-4 pb-24 space-y-4 select-none">
      {/* Profile Header */}
      <div className="flex items-center gap-3.5 pt-2">
        <div className="w-16 h-16 rounded-3xl bg-[#0F3B34] text-white flex items-center justify-center font-bold text-xl shadow-md border-2 border-white dark:border-stone-800">
          TM
        </div>
        <div>
          <h2 className="font-fraunces text-xl font-bold text-stone-900 dark:text-stone-100">
            Tendai Moyo
          </h2>
          <p className="text-xs text-stone-500 font-mono-jb mt-0.5">
            ID: 63-289410-X-42
          </p>
          <div className="flex items-center gap-1 text-[11px] text-[#1F8A5B] font-semibold mt-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Biometric Verified</span>
          </div>
        </div>
      </div>

      {/* Patient Health Info Card */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-2">
        <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
          Patient Health Card
        </span>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800/60">
            <span className="text-[10px] text-stone-400 block">Blood Group</span>
            <span className="font-bold text-stone-800 dark:text-stone-200">O Positive</span>
          </div>
          <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800/60">
            <span className="text-[10px] text-stone-400 block">Allergies</span>
            <span className="font-bold text-stone-800 dark:text-stone-200">Penicillin (Mild)</span>
          </div>
          <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800/60">
            <span className="text-[10px] text-stone-400 block">Location</span>
            <span className="font-bold text-stone-800 dark:text-stone-200">Avondale, Harare</span>
          </div>
          <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800/60">
            <span className="text-[10px] text-stone-400 block">Primary Phone</span>
            <span className="font-mono-jb text-[11px] font-bold text-stone-800 dark:text-stone-200">+263 77 234 5678</span>
          </div>
        </div>
      </div>

      {/* App Preferences */}
      <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-3">
        <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
          Preferences
        </span>

        {/* Currency Switch */}
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

        {/* Language Switch */}
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-stone-700 dark:text-stone-300">Language</span>
          <div className="flex items-center p-0.5 rounded-xl bg-stone-100 dark:bg-stone-800">
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                language === 'en' ? 'bg-[#0F3B34] text-white shadow-xs' : 'text-stone-500'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('sn')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                language === 'sn' ? 'bg-[#0F3B34] text-white shadow-xs' : 'text-stone-500'
              }`}
            >
              Shona
            </button>
          </div>
        </div>

        {/* Theme Switch */}
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

      {/* Switch Native App Role (Mobile Support) */}
      {onSwitchRole && (
        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-2">
          <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
            Switch Mushonga App
          </span>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => onSwitchRole('patient')}
              className="p-2 rounded-xl bg-[#0F3B34] text-white font-bold text-center"
            >
              Patient
            </button>
            <button
              onClick={() => onSwitchRole('doctor')}
              className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-center hover:bg-stone-200"
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
