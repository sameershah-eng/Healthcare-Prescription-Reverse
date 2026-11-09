import { useMushongaStore } from '../../store/useMushongaStore';
import { translations } from '../../i18n/translations';
import { HeartbeatDivider } from '../../components/common/HeartbeatDivider';
import { formatPrice } from '../../lib/realtime';
import { Calendar, Clock, User, Phone, CheckCircle2, ChevronRight, FilePlus } from 'lucide-react';

interface DoctorTodayProps {
  onNavigate: (tab: string, meta?: any) => void;
}

export function DoctorToday({ onNavigate }: DoctorTodayProps) {
  const language = useMushongaStore((s) => s.language);
  const currency = useMushongaStore((s) => s.currency);
  const appointments = useMushongaStore((s) => s.appointments);
  const t = translations[language];

  // Dr. Chikwanha's appointments for today
  const todaysAppointments = appointments.filter((a) => a.doctorId === 'doc-chikwanha' && a.status === 'upcoming');

  return (
    <div className="flex-1 overflow-y-auto phone-scroll p-4 pb-24 space-y-4 select-none">
      {/* Doctor Header */}
      <div className="pt-2">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#2B4C7E] dark:text-[#608bcf] bg-[#2B4C7E]/10 px-2 py-0.5 rounded-full">
              Clinic Live Portal
            </span>
            <h2 className="font-fraunces text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 mt-1">
              Dr. Chikwanha
            </h2>
            <p className="text-xs text-stone-500">
              Belgravia Medical Centre · Harare
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl overflow-hidden border-2 border-[#2B4C7E] shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400"
              alt="Dr. Chikwanha"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <HeartbeatDivider className="mt-2" />
      </div>

      {/* Today's Overview Stats */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block">
            Patients Scheduled
          </span>
          <div className="font-mono-jb text-2xl font-extrabold text-[#2B4C7E] dark:text-[#608bcf] mt-0.5">
            {todaysAppointments.length}
          </div>
          <span className="text-[10px] text-[#1F8A5B] font-semibold flex items-center gap-1 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1F8A5B] animate-pulse" />
            Live sync active
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block">
            Consultation Fee
          </span>
          <div className="font-mono-jb text-2xl font-extrabold text-[#0F3B34] dark:text-[#389182] mt-0.5">
            {formatPrice(35, currency)}
          </div>
          <span className="text-[10px] text-stone-500 font-mono-jb mt-1 block">
            20m slot length
          </span>
        </div>
      </div>

      {/* Live Timeline of Appointments */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
            {t.todaysSchedule}
          </h3>
          <span className="text-[10px] font-mono-jb text-stone-400">
            14 Nov 2026
          </span>
        </div>

        <div className="space-y-2.5">
          {todaysAppointments.map((apt, index) => (
            <div
              key={apt.id}
              className="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-2.5 hover:border-stone-300 dark:hover:border-stone-700 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#2B4C7E]/10 text-[#2B4C7E] dark:text-[#608bcf] font-bold text-xs flex items-center justify-center">
                    {apt.patientName.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-stone-900 dark:text-stone-100">
                      {apt.patientName}
                    </h4>
                    <p className="text-[10px] text-stone-500 font-mono-jb">
                      {apt.patientPhone}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono-jb text-xs font-bold text-[#0F3B34] dark:text-[#389182]">
                    {apt.timeStr}
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-[#1F8A5B]/15 text-[#1F8A5B] block mt-0.5">
                    Booked Live
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                <span className="text-[11px] text-stone-500">
                  Belgravia Room 3
                </span>

                <button
                  onClick={() => onNavigate('IssueRx', { patientName: apt.patientName })}
                  className="px-3 py-1.5 rounded-xl bg-[#2B4C7E] text-white font-bold text-[11px] flex items-center gap-1 active:scale-95 transition-all shadow-xs"
                >
                  <FilePlus className="w-3.5 h-3.5 text-[#D9673A]" />
                  <span>Issue Digital Rx</span>
                </button>
              </div>
            </div>
          ))}

          {todaysAppointments.length === 0 && (
            <div className="p-8 text-center rounded-2xl bg-stone-100 dark:bg-stone-800/40 text-stone-500 text-xs">
              No appointments scheduled yet today.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
