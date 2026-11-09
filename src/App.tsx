import { useState, useEffect } from 'react';
import { useMushongaStore } from './store/useMushongaStore';
import { PhoneFrame } from './components/common/PhoneFrame';
import { TopNavBar } from './components/desktop/TopNavBar';
import { DataLinesOverlay } from './components/desktop/DataLinesOverlay';
import { DemoControlPanel } from './components/desktop/DemoControlPanel';
import { PatientApp } from './apps/patient/PatientApp';
import { DoctorApp } from './apps/doctor/DoctorApp';
import { PharmacyApp } from './apps/pharmacy/PharmacyApp';
import { Role } from './types';
import { User, Stethoscope, Store } from 'lucide-react';

export default function App() {
  const viewMode = useMushongaStore((s) => s.viewMode);
  const setViewMode = useMushongaStore((s) => s.setViewMode);
  const activeSingleRole = useMushongaStore((s) => s.activeSingleRole);
  const setActiveSingleRole = useMushongaStore((s) => s.setActiveSingleRole);
  const themeMode = useMushongaStore((s) => s.themeMode);
  const isOffline = useMushongaStore((s) => s.isOffline);

  // Viewport tracking for mobile <768px vs desktop
  const [windowWidth, setWindowWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isDarkMode = themeMode === 'dark';
  const showEcosystem = viewMode === 'ecosystem' && !isMobile;

  return (
    <div className={`h-screen w-screen overflow-hidden flex flex-col select-none transition-colors ${
      isDarkMode ? 'dark bg-[#0E1513] text-stone-100' : 'bg-[#F7F5F0] text-stone-900'
    }`}>
      {/* Offline Mode Ribbon */}
      {isOffline && (
        <div className="bg-[#C8432F] text-white text-[11px] font-bold py-1 px-4 text-center z-50 shrink-0 flex items-center justify-center gap-2">
          <span>Offline mode active · Local actions queued for automatic sync</span>
        </div>
      )}

      {/* Desktop Top Navigation Bar */}
      {!isMobile && <TopNavBar />}

      {/* Main Presentation Stage */}
      <main className={`relative flex-1 w-full overflow-x-auto overflow-y-auto phone-scroll flex flex-col items-center justify-start transition-colors ${
        isDarkMode
          ? 'bg-[#0E1513]'
          : 'bg-[#F2EFE9]'
      }`}>
        {/* Subtle Ambient Background Gradient */}
        <div className={`absolute inset-0 pointer-events-none transition-opacity ${
          isDarkMode
            ? 'bg-[radial-gradient(circle_at_center,rgba(15,59,52,0.25)_0%,rgba(14,21,19,1)_85%)]'
            : 'bg-[radial-gradient(circle_at_center,rgba(15,59,52,0.08)_0%,rgba(242,239,233,1)_85%)]'
        }`} />

        {/* SVG Data Lines & Central Core API Node (Rendered in Ecosystem view) */}
        {showEcosystem && <DataLinesOverlay />}

        {/* ECOSYSTEM VIEW: 3 PHONES SIDE BY SIDE */}
        {showEcosystem ? (
          <div className="relative z-10 w-full min-w-max px-6 py-6 pb-24 flex items-start justify-center gap-6 xl:gap-8 min-h-full">
            {/* Phone 1: Patient App */}
            <PhoneFrame
              role="patient"
              roleTitle="Mushonga · Patient"
              roleSubtitle="Tendai Moyo (Avondale)"
              dark={isDarkMode}
            >
              <PatientApp dark={isDarkMode} />
            </PhoneFrame>

            {/* Phone 2: Doctor App */}
            <PhoneFrame
              role="doctor"
              roleTitle="Mushonga · Doctor"
              roleSubtitle="Dr. Chikwanha (Belgravia)"
              dark={isDarkMode}
            >
              <DoctorApp dark={isDarkMode} />
            </PhoneFrame>

            {/* Phone 3: Pharmacy App */}
            <PhoneFrame
              role="pharmacy"
              roleTitle="Mushonga · Pharmacy"
              roleSubtitle="Msasa Pharmacy (Avondale)"
              dark={isDarkMode}
            >
              <PharmacyApp dark={isDarkMode} />
            </PhoneFrame>
          </div>
        ) : isMobile ? (
          /* MOBILE VIEW: Full-screen native app (100dvh, safe-area insets, no frame) */
          <div className="relative w-full h-full flex flex-col overflow-hidden">
            <PhoneFrame
              role={activeSingleRole}
              roleTitle={`Mushonga · ${activeSingleRole}`}
              isMobileFullBleed={true}
              dark={isDarkMode}
            >
              {activeSingleRole === 'patient' && (
                <PatientApp
                  onSwitchRole={(r) => setActiveSingleRole(r)}
                  dark={isDarkMode}
                />
              )}
              {activeSingleRole === 'doctor' && (
                <DoctorApp
                  onSwitchRole={(r) => setActiveSingleRole(r)}
                  dark={isDarkMode}
                />
              )}
              {activeSingleRole === 'pharmacy' && (
                <PharmacyApp
                  onSwitchRole={(r) => setActiveSingleRole(r)}
                  dark={isDarkMode}
                />
              )}
            </PhoneFrame>
          </div>
        ) : (
          /* SINGLE PHONE VIEW (with role switcher at top) */
          <div className="relative z-10 flex flex-col items-center justify-start py-6 pb-24 min-h-full">
            {/* Segmented Role Switcher above the single phone */}
            <div className={`mb-3 p-1 rounded-2xl border flex items-center gap-1 shadow-md text-xs font-bold ${
              isDarkMode
                ? 'bg-stone-900 border-stone-800'
                : 'bg-white border-stone-300'
            }`}>
              {[
                { id: 'patient', label: 'Patient App', icon: User, tint: 'bg-[#0F3B34]' },
                { id: 'doctor', label: 'Doctor App', icon: Stethoscope, tint: 'bg-[#2B4C7E]' },
                { id: 'pharmacy', label: 'Pharmacy App', icon: Store, tint: 'bg-[#B8862F]' }
              ].map((r) => {
                const Icon = r.icon;
                const isSelected = activeSingleRole === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => setActiveSingleRole(r.id as Role)}
                    className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
                      isSelected
                        ? `${r.tint} text-white shadow-md`
                        : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{r.label}</span>
                  </button>
                );
              })}
            </div>

            <PhoneFrame
              role={activeSingleRole}
              roleTitle={`Mushonga · ${activeSingleRole}`}
              dark={isDarkMode}
            >
              {activeSingleRole === 'patient' && <PatientApp dark={isDarkMode} />}
              {activeSingleRole === 'doctor' && <DoctorApp dark={isDarkMode} />}
              {activeSingleRole === 'pharmacy' && <PharmacyApp dark={isDarkMode} />}
            </PhoneFrame>
          </div>
        )}

        {/* Demo Control Panel Dock */}
        <DemoControlPanel />
      </main>
    </div>
  );
}
