import { useState } from 'react';
import { useMushongaStore } from '../../store/useMushongaStore';
import { User, Phone, MapPin, FileText, ChevronRight, CheckCircle2 } from 'lucide-react';

interface DoctorPatientsProps {
  onIssueRxForPatient?: (patientName: string) => void;
}

export function DoctorPatients({ onIssueRxForPatient }: DoctorPatientsProps) {
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);

  const patients = [
    {
      id: 'pat-1',
      name: 'Tendai Moyo',
      phone: '+263 77 234 5678',
      suburb: 'Avondale, Harare',
      lastVisit: '14 Nov 2026',
      condition: 'Acute bacterial sinusitis',
      activeRxCount: 2
    },
    {
      id: 'pat-2',
      name: 'Farai Ncube',
      phone: '+263 77 345 6789',
      suburb: 'Belgravia, Harare',
      lastVisit: '10 Nov 2026',
      condition: 'Hypertension Stage 1',
      activeRxCount: 1
    },
    {
      id: 'pat-3',
      name: 'Chipo Dube',
      phone: '+263 77 456 7890',
      suburb: 'Milton Park, Harare',
      lastVisit: '04 Nov 2026',
      condition: 'Type 2 Diabetes review',
      activeRxCount: 3
    },
    {
      id: 'pat-4',
      name: 'Tatenda Sibanda',
      phone: '+263 77 567 8901',
      suburb: 'Mt Pleasant, Harare',
      lastVisit: '28 Oct 2026',
      condition: 'Asthma checkup',
      activeRxCount: 1
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto phone-scroll p-4 pb-24 space-y-4 select-none">
      {/* Header */}
      <div>
        <h2 className="font-fraunces text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
          Clinic Patients
        </h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Registered patient roster & clinical history
        </p>
      </div>

      <div className="space-y-3">
        {patients.map((pat) => (
          <div
            key={pat.id}
            onClick={() => setSelectedPatient(pat.id === selectedPatient ? null : pat.id)}
            className="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs cursor-pointer hover:border-stone-300 dark:hover:border-stone-700 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#2B4C7E]/10 text-[#2B4C7E] dark:text-[#608bcf] font-bold text-xs flex items-center justify-center">
                  {pat.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-stone-900 dark:text-stone-100">
                    {pat.name}
                  </h4>
                  <div className="text-[10px] text-stone-500 font-mono-jb">
                    {pat.phone} · {pat.suburb}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono-jb text-stone-400 block">
                  Last visit: {pat.lastVisit}
                </span>
                <span className="text-[10px] text-[#0F3B34] dark:text-[#389182] font-semibold">
                  {pat.activeRxCount} active Rx
                </span>
              </div>
            </div>

            {/* Expandable detail */}
            {selectedPatient === pat.id && (
              <div className="mt-3 pt-2.5 border-t border-stone-100 dark:border-stone-800 space-y-2 animate-in fade-in">
                <div className="text-xs text-stone-600 dark:text-stone-400 bg-stone-50 dark:bg-stone-800/60 p-2.5 rounded-xl">
                  <span className="font-semibold text-stone-800 dark:text-stone-200">Clinical Focus: </span>
                  {pat.condition}
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  {onIssueRxForPatient && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onIssueRxForPatient(pat.name);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#2B4C7E] text-white text-xs font-bold hover:bg-[#203a63]"
                    >
                      Issue Rx for {pat.name.split(' ')[0]}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
