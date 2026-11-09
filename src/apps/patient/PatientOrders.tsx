import { useState } from 'react';
import { useMushongaStore } from '../../store/useMushongaStore';
import { Order, Appointment } from '../../types';
import { CollectionPass } from '../../components/common/CollectionPass';
import { formatPrice, formatDate } from '../../lib/realtime';
import { translations } from '../../i18n/translations';
import { QrCode, Calendar, Clock, MapPin, X, CheckCircle2 } from 'lucide-react';

export function PatientOrders() {
  const language = useMushongaStore((s) => s.language);
  const currency = useMushongaStore((s) => s.currency);
  const orders = useMushongaStore((s) => s.orders);
  const appointments = useMushongaStore((s) => s.appointments);
  const cancelAppointment = useMushongaStore((s) => s.cancelAppointment);

  const t = translations[language];

  const [activeSegment, setActiveSegment] = useState<'prescriptions' | 'appointments'>('prescriptions');
  const [selectedOrderPass, setSelectedOrderPass] = useState<Order | null>(null);

  return (
    <div className="flex-1 overflow-y-auto phone-scroll p-4 pb-24 space-y-4 select-none">
      {/* Header */}
      <div>
        <h2 className="font-fraunces text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
          My Orders & Visits
        </h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Track prescriptions, pickup passes, and doctor appointments
        </p>
      </div>

      {/* Segmented Switcher */}
      <div className="flex items-center p-1 rounded-2xl bg-stone-100 dark:bg-stone-800 text-xs font-bold">
        <button
          onClick={() => setActiveSegment('prescriptions')}
          className={`flex-1 py-2 rounded-xl text-center transition-all ${
            activeSegment === 'prescriptions'
              ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
              : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100'
          }`}
        >
          Prescription Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveSegment('appointments')}
          className={`flex-1 py-2 rounded-xl text-center transition-all ${
            activeSegment === 'appointments'
              ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
              : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100'
          }`}
        >
          Doctor Visits ({appointments.length})
        </button>
      </div>

      {/* PRESCRIPTIONS SEGMENT */}
      {activeSegment === 'prescriptions' && (
        <div className="space-y-3">
          {orders.map((ord) => {
            const statusColors: Record<Order['status'], string> = {
              accepted: 'bg-[#2F6FB0]/15 text-[#2F6FB0]',
              preparing: 'bg-[#D99A1E]/15 text-[#D99A1E]',
              ready: 'bg-[#1F8A5B] text-white',
              collected: 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
            };

            return (
              <div
                key={ord.id}
                onClick={() => setSelectedOrderPass(ord)}
                className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs cursor-pointer hover:border-stone-300 dark:hover:border-stone-700 transition-all active:scale-98"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono-jb text-xs font-bold text-stone-900 dark:text-stone-100">
                        {ord.orderNumber}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColors[ord.status]}`}>
                        {ord.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 mt-1">
                      {ord.pharmacyName}
                    </h4>
                    <div className="text-[11px] text-stone-500 mt-0.5">
                      {ord.pharmacyAddress}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono-jb text-sm font-extrabold text-[#0F3B34] dark:text-[#389182]">
                      {formatPrice(ord.totalUSD, currency)}
                    </div>
                    <span className="text-[10px] text-stone-400 block font-mono-jb">
                      {formatDate(ord.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                  <span className="font-mono-jb text-xs text-stone-600 dark:text-stone-300">
                    Pickup Code: <strong>{ord.pickupCode}</strong>
                  </span>

                  <button className="flex items-center gap-1 text-[#D9673A] font-bold">
                    <QrCode className="w-3.5 h-3.5" />
                    <span>View Pickup Pass</span>
                  </button>
                </div>
              </div>
            );
          })}

          {orders.length === 0 && (
            <div className="p-8 text-center rounded-2xl bg-stone-100 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 text-stone-500 text-xs">
              No orders placed yet. Float a prescription to receive pharmacy bids!
            </div>
          )}
        </div>
      )}

      {/* APPOINTMENTS SEGMENT */}
      {activeSegment === 'appointments' && (
        <div className="space-y-3">
          {appointments.map((apt) => (
            <div
              key={apt.id}
              className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                    {apt.doctorName}
                  </h4>
                  <div className="text-[11px] text-stone-500">
                    {apt.doctorSpecialty} · {apt.doctorSuburb}
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  apt.status === 'upcoming'
                    ? 'bg-[#1F8A5B]/15 text-[#1F8A5B]'
                    : 'bg-stone-200 dark:bg-stone-800 text-stone-500'
                }`}>
                  {apt.status === 'upcoming' ? 'Confirmed Visit' : apt.status}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono-jb text-[#0F3B34] dark:text-[#389182] font-semibold bg-stone-50 dark:bg-stone-800/50 p-2.5 rounded-xl">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                  {apt.dateStr}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  {apt.timeStr}
                </span>
                <span className="ml-auto font-bold">
                  {formatPrice(apt.feeUSD, currency)}
                </span>
              </div>

              {apt.status === 'upcoming' && (
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => cancelAppointment(apt.id)}
                    className="text-xs font-semibold text-[#C8432F] hover:underline"
                  >
                    Cancel Slot
                  </button>
                </div>
              )}
            </div>
          ))}

          {appointments.length === 0 && (
            <div className="p-8 text-center rounded-2xl bg-stone-100 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 text-stone-500 text-xs">
              No appointments scheduled. Browse doctors to book a visit.
            </div>
          )}
        </div>
      )}

      {/* Pass Detail Modal */}
      {selectedOrderPass && (
        <div className="absolute inset-0 z-50 bg-black/75 backdrop-blur-xs flex flex-col justify-end p-2 animate-in fade-in">
          <div className="w-full max-h-[92%] rounded-3xl bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 flex flex-col overflow-hidden shadow-2xl">
            <div className="p-3 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <span className="font-bold text-xs">Collection Pass</span>
              <button
                onClick={() => setSelectedOrderPass(null)}
                className="w-7 h-7 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto phone-scroll">
              <CollectionPass
                order={selectedOrderPass}
                currency={currency}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
