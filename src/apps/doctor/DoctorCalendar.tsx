import { useState } from 'react';
import { useMushongaStore } from '../../store/useMushongaStore';
import { translations } from '../../i18n/translations';
import { Calendar, Clock, User, CheckCircle2, Lock, Sliders, ChevronRight } from 'lucide-react';

export function DoctorCalendar() {
  const language = useMushongaStore((s) => s.language);
  const slots = useMushongaStore((s) => s.slots);
  const t = translations[language];

  const [selectedDate, setSelectedDate] = useState('2026-11-14');
  const [slotDuration, setSlotDuration] = useState<number>(20);

  // Filter slots for Dr. Chikwanha
  const doctorSlots = slots.filter(
    (s) => s.doctorId === 'doc-chikwanha' && s.dateStr === selectedDate
  );

  const bookedSlotsCount = doctorSlots.filter((s) => s.isBooked).length;
  const openSlotsCount = doctorSlots.filter((s) => !s.isBooked).length;

  return (
    <div className="flex-1 overflow-y-auto phone-scroll p-4 pb-24 space-y-4 select-none">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="font-fraunces text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
            Clinic Calendar
          </h2>
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1F8A5B]/15 text-[#1F8A5B] text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1F8A5B] animate-ping" />
            Live Sync
          </span>
        </div>
        <p className="text-xs text-stone-500 mt-0.5">
          Patient bookings update instantly without refreshing
        </p>
      </div>

      {/* Date Switcher Strip */}
      <div className="flex items-center gap-2">
        {[
          { date: '2026-11-14', day: 'Sat', label: '14 Nov (Today)' },
          { date: '2026-11-15', day: 'Sun', label: '15 Nov' },
          { date: '2026-11-16', day: 'Mon', label: '16 Nov' }
        ].map((d) => (
          <button
            key={d.date}
            onClick={() => setSelectedDate(d.date)}
            className={`flex-1 p-2.5 rounded-2xl text-center border font-bold transition-all ${
              selectedDate === d.date
                ? 'bg-[#2B4C7E] text-white border-[#2B4C7E] shadow-sm'
                : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300'
            }`}
          >
            <div className="text-[10px] uppercase font-mono-jb opacity-80">{d.day}</div>
            <div className="text-xs mt-0.5">{d.label}</div>
          </button>
        ))}
      </div>

      {/* Clinic Settings Bar */}
      <div className="p-3 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#2B4C7E]" />
          <div>
            <div className="font-bold text-stone-800 dark:text-stone-200">
              Hours: 08:30 – 16:30
            </div>
            <div className="text-[10px] text-stone-500">
              {bookedSlotsCount} booked · {openSlotsCount} open
            </div>
          </div>
        </div>

        {/* Slot length pills */}
        <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl font-mono-jb text-[10px]">
          {[15, 20, 30].map((dur) => (
            <button
              key={dur}
              onClick={() => setSlotDuration(dur)}
              className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                slotDuration === dur
                  ? 'bg-[#2B4C7E] text-white'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              {dur}m
            </button>
          ))}
        </div>
      </div>

      {/* Live Slots List */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
          Schedule Timeline ({doctorSlots.length} Slots)
        </h3>

        <div className="space-y-2">
          {doctorSlots.map((slot) => {
            if (slot.isBooked) {
              return (
                <div
                  key={slot.id}
                  className="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs flex items-center justify-between transition-all border-l-4 border-l-[#2B4C7E]"
                >
                  <div className="flex items-center gap-3">
                    <div className="font-mono-jb text-sm font-extrabold text-[#2B4C7E] dark:text-[#608bcf] w-14 shrink-0">
                      {slot.timeStr}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-stone-400" />
                        <span>{slot.bookedPatientName || 'Tendai Moyo'}</span>
                      </div>
                      <div className="text-[10px] text-stone-500">
                        Consultation · Booked via App
                      </div>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full bg-[#1F8A5B]/15 text-[#1F8A5B] font-bold text-[10px]">
                    Confirmed
                  </span>
                </div>
              );
            }

            return (
              <div
                key={slot.id}
                className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-900/40 border border-dashed border-stone-200 dark:border-stone-800 flex items-center justify-between text-stone-500"
              >
                <div className="flex items-center gap-3">
                  <div className="font-mono-jb text-sm font-semibold text-stone-400 w-14 shrink-0">
                    {slot.timeStr}
                  </div>
                  <span className="text-xs font-medium">Open for patient booking</span>
                </div>

                <span className="text-[10px] font-mono-jb text-stone-400">
                  {slotDuration} min
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
