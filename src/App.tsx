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
    typeof window !== 'undefined' ? window.innerWidth : 1440
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isDesktopEcosystem = windowWidth >= 1280 && viewMode === 'ecosystem';

  const isDarkMode = themeMode === 'dark';

  return (
    <div className={`h-screen w-screen overflow-hidden flex flex-col select-none ${
      isDarkMode ? 'dark bg-[#0E1513] text-stone-100' : 'bg-[#0E1513] text-stone-100'
    }`}>
      {/* Offline Mode Global Slim Ribbon */}
      {isOffline && (
        <div className="bg-[#C8432F] text-white text-[11px] font-bold py-1 px-4 text-center z-50 flex items-center justify-center gap-2">
          <span>Offline mode active · Local transactions queued for automatic sync</span>
        </div>
      )}

      {/* Desktop Top Navigation Bar (Hidden on small mobile screens to maximize app canvas) */}
      {!isMobile && <TopNavBar />}

      {/* Main Presentation Stage */}
      <main className="relative flex-1 w-full overflow-hidden flex flex-col items-center justify-center bg-[#0E1513]">
        {/* Subtle radial canvas backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(15,59,52,0.18)_0%,rgba(14,21,19,1)_85%)] pointer-events-none" />

        {/* SVG Data Lines & Central Core API Node (Rendered in Ecosystem view) */}
        {isDesktopEcosystem && <DataLinesOverlay />}

        {/* ECOSYSTEM VIEW: 3 PHONES SIDE BY SIDE */}
        {isDesktopEcosystem ? (
          <div className="relative z-10 w-full max-w-[1340px] px-4 flex items-center justify-center gap-6 xl:gap-10 pt-1 pb-16">
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
          /* SINGLE PHONE VIEW (Desktop <1280px or manual single phone toggle) */
          <div className="relative z-10 flex flex-col items-center justify-center pt-2 pb-16">
            {/* Segmented Role Switcher above the single phone */}
            <div className="mb-3 p-1 rounded-2xl bg-stone-900 border border-stone-800 flex items-center gap-1 shadow-lg text-xs font-bold">
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
                        : 'text-stone-400 hover:text-stone-200'
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
