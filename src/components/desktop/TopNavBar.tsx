import { useMushongaStore } from '../../store/useMushongaStore';
import { translations } from '../../i18n/translations';
import { Smartphone, Monitor, Globe, Moon, Sun, WifiOff, Sparkles } from 'lucide-react';

export function TopNavBar() {
  const language = useMushongaStore((s) => s.language);
  const setLanguage = useMushongaStore((s) => s.setLanguage);
  const currency = useMushongaStore((s) => s.currency);
  const setCurrency = useMushongaStore((s) => s.setCurrency);
  const themeMode = useMushongaStore((s) => s.themeMode);
  const setThemeMode = useMushongaStore((s) => s.setThemeMode);
  const viewMode = useMushongaStore((s) => s.viewMode);
  const setViewMode = useMushongaStore((s) => s.setViewMode);
  const isOffline = useMushongaStore((s) => s.isOffline);

  const isDark = themeMode === 'dark';
  const t = translations[language];

  return (
    <header className={`h-16 px-4 md:px-6 border-b flex items-center justify-between z-30 select-none shrink-0 backdrop-blur-md transition-colors ${
      isDark
        ? 'bg-[#0E1513]/95 border-stone-800 text-stone-100'
        : 'bg-white/95 border-stone-200 text-stone-900 shadow-xs'
    }`}>
      {/* Brand & Wordmark */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0F3B34] to-[#165349] border border-[#D9673A]/40 flex items-center justify-center shadow-md">
            <span className="font-fraunces text-lg font-black text-[#D9673A] leading-none">
              M
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className={`font-fraunces text-lg font-bold tracking-tight ${
                isDark ? 'text-stone-100' : 'text-stone-900'
              }`}>
                {t.appName}
              </h1>
              <span className="text-[10px] text-stone-500 font-mono-jb hidden sm:inline">
                · {language === 'sn' ? 'mushonga = medicine' : 'reverse-bidding platform'}
              </span>
            </div>
            <div className="text-[10px] text-stone-400 font-mono-jb hidden lg:block">
              {t.liveStatusLine}
            </div>
          </div>
        </div>

        {/* Desktop Recommendation Badge */}
        <div className={`hidden xl:flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] ${
          isDark
            ? 'bg-stone-800/80 border-stone-700 text-stone-300'
            : 'bg-stone-100 border-stone-200 text-stone-600'
        }`}>
          <Sparkles className="w-3 h-3 text-[#D9673A]" />
          <span>{t.desktopNotice}</span>
        </div>
      </div>

      {/* Offline Status Warning */}
      {isOffline && (
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C8432F]/15 border border-[#C8432F]/40 text-[#C8432F] text-xs font-bold animate-pulse">
          <WifiOff className="w-3.5 h-3.5" />
          <span>Offline Simulation Active</span>
        </div>
      )}

      {/* Control Switchers: View, Currency, Language, Theme */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* View Mode Switcher */}
        <div className={`flex items-center p-0.5 rounded-xl border text-xs ${
          isDark ? 'bg-stone-900 border-stone-800' : 'bg-stone-100 border-stone-200'
        }`}>
          <button
            onClick={() => setViewMode('ecosystem')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-medium transition-all ${
              viewMode === 'ecosystem'
                ? 'bg-[#0F3B34] text-white shadow-xs font-bold'
                : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">3 Apps</span>
          </button>
          <button
            onClick={() => setViewMode('single')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-medium transition-all ${
              viewMode === 'single'
                ? 'bg-[#0F3B34] text-white shadow-xs font-bold'
                : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Single Phone</span>
          </button>
        </div>

        {/* Currency Switcher: USD / ZiG */}
        <div className={`flex items-center p-0.5 rounded-xl border font-mono-jb text-xs ${
          isDark ? 'bg-stone-900 border-stone-800' : 'bg-stone-100 border-stone-200'
        }`}>
          <button
            onClick={() => setCurrency('USD')}
            className={`px-2 py-0.8 rounded-lg font-semibold transition-all ${
              currency === 'USD'
                ? 'bg-[#D9673A] text-white shadow-xs'
                : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            USD
          </button>
          <button
            onClick={() => setCurrency('ZiG')}
            className={`px-2 py-0.8 rounded-lg font-semibold transition-all ${
              currency === 'ZiG'
                ? 'bg-[#D9673A] text-white shadow-xs'
                : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            ZiG
          </button>
        </div>

        {/* Language Switcher: EN / Shona */}
        <button
          onClick={() => setLanguage(language === 'en' ? 'sn' : 'en')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-semibold transition-colors ${
            isDark
              ? 'bg-stone-900 border-stone-800 text-stone-300 hover:text-white'
              : 'bg-stone-100 border-stone-200 text-stone-700 hover:text-stone-900'
          }`}
          title="Switch English / Shona"
        >
          <Globe className="w-3.5 h-3.5 text-[#D9673A]" />
          <span>{language === 'en' ? 'EN' : 'SHONA'}</span>
        </button>

        {/* Theme Mode Switcher */}
        <button
          onClick={() => setThemeMode(isDark ? 'light' : 'dark')}
          className={`p-1.5 rounded-xl border transition-colors ${
            isDark
              ? 'bg-stone-900 border-stone-800 text-stone-300 hover:text-white'
              : 'bg-stone-100 border-stone-200 text-stone-700 hover:text-stone-900'
          }`}
          title="Toggle Light / Dark Theme"
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-[#D99A1E]" />
          ) : (
            <Moon className="w-4 h-4 text-stone-600" />
          )}
        </button>
      </div>
    </header>
  );
}
