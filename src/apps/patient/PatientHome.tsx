import { useMushongaStore } from '../../store/useMushongaStore';
import { translations } from '../../i18n/translations';
import { CountdownRing } from '../../components/common/CountdownRing';
import { HeartbeatDivider } from '../../components/common/HeartbeatDivider';
import { formatPrice } from '../../lib/realtime';
import { Calendar, ChevronRight, FileText, Send, Sparkles, MapPin, Clock } from 'lucide-react';

interface PatientHomeProps {
  onNavigate: (tab: string, meta?: any) => void;
}

export function PatientHome({ onNavigate }: PatientHomeProps) {
  const language = useMushongaStore((s) => s.language);
  const currency = useMushongaStore((s) => s.currency);
  const appointments = useMushongaStore((s) => s.appointments);
  const floats = useMushongaStore((s) => s.floats);
  const bids = useMushongaStore((s) => s.bids);
  const prescriptions = useMushongaStore((s) => s.prescriptions);

  const t = translations[language];

  // Find active float in bidding status
  const activeFloat = floats.find((f) => f.status === 'bidding');
  const floatBids = activeFloat ? bids.filter((b) => b.floatId === activeFloat.id) : [];
  const lowestBid = floatBids.length > 0 ? [...floatBids].sort((a, b) => a.priceUSD - b.priceUSD)[0] : null;

  // Next upcoming appointment
  const nextApt = appointments.find((a) => a.status === 'upcoming');

  return (
    <div className="flex-1 overflow-y-auto phone-scroll p-4 pb-24 space-y-4 select-none">
      {/* Header Greeting */}
      <div className="pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-fraunces text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
              {t.greetingPatient}
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              {t.patientSubtitle}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#0F3B34] text-white flex items-center justify-center font-bold text-sm shadow-sm">
            TM
          </div>
        </div>

        {/* Signature Heartbeat Line */}
        <HeartbeatDivider className="mt-2" />
      </div>

      {/* ACTIVE REVERSE BID TENDER STRIP (One tap to Live Bids moment) */}
      {activeFloat ? (
        <div
          onClick={() => onNavigate('LiveBids', { floatId: activeFloat.id })}
          className="rounded-2xl p-4 bg-gradient-to-br from-[#0F3B34] to-[#165349] text-white shadow-lg cursor-pointer border border-[#D9673A]/40 relative overflow-hidden group active:scale-98 transition-all"
        >
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D9673A]/20 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#D9673A] animate-ping" />
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#D9673A]">
                {t.viewLiveBids}
              </span>
            </div>
            <CountdownRing
              totalSeconds={60}
              expiresAt={activeFloat.expiresAt}
              size={36}
              strokeWidth={3}
            />
          </div>

          <div className="mt-2 relative z-10 flex items-baseline justify-between">
            <div>
              <div className="text-xs text-white/80">
                {floatBids.length} {t.bidsReceived}
              </div>
              <div className="text-xl font-bold font-fraunces text-white mt-0.5">
                {lowestBid ? (
                  <span>
                    {t.lowestSoFar}: <span className="font-mono-jb text-[#D9673A]">{formatPrice(lowestBid.priceUSD, currency)}</span>
                  </span>
                ) : (
                  <span>Awaiting pharmacy bids...</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs font-bold text-[#D9673A] group-hover:translate-x-0.5 transition-transform">
              <span>View Bids</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      ) : null}

      {/* NEXT APPOINTMENT CARD (Live doctor calendar moment) */}
      {nextApt ? (
        <div className="rounded-2xl p-4 bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span className="uppercase tracking-wider font-semibold text-[10px]">
              {t.nextAppointment}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#1F8A5B]/15 text-[#1F8A5B] font-bold text-[10px]">
              Confirmed
            </span>
          </div>

          <div className="flex items-start gap-3">
            <img
              src={nextApt.doctorAvatarUrl}
              alt={nextApt.doctorName}
              className="w-12 h-12 rounded-xl object-cover shrink-0 border border-stone-200 dark:border-stone-700"
              onError={(e) => {
                // Fallback to role-tinted initials avatar
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 truncate">
                {nextApt.doctorName}
              </h4>
              <p className="text-xs text-stone-500">
                {nextApt.doctorSpecialty} · {nextApt.doctorSuburb}
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs font-mono-jb text-[#0F3B34] dark:text-[#389182] font-semibold">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {nextApt.dateStr}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {nextApt.timeStr}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* QUICK ACTIONS GRID */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2.5">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => onNavigate('FloatRx')}
            className="p-3.5 rounded-2xl bg-[#0F3B34] text-white flex flex-col items-start gap-2 text-left active:scale-95 transition-all shadow-sm"
          >
            <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center text-[#D9673A]">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs">{t.tabFloatRx}</div>
              <div className="text-[10px] text-white/70">Reverse bidding</div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('Doctors')}
            className="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 text-stone-900 dark:text-stone-100 flex flex-col items-start gap-2 text-left active:scale-95 transition-all shadow-xs"
          >
            <div className="w-8 h-8 rounded-xl bg-[#2B4C7E]/10 text-[#2B4C7E] flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs">{t.tabDoctors}</div>
              <div className="text-[10px] text-stone-500">26 specialists</div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('FloatRx', { mode: 'upload' })}
            className="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 text-stone-900 dark:text-stone-100 flex flex-col items-start gap-2 text-left active:scale-95 transition-all shadow-xs"
          >
            <div className="w-8 h-8 rounded-xl bg-[#D99A1E]/15 text-[#D99A1E] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs">Upload Paper Rx</div>
              <div className="text-[10px] text-stone-500">Scan paper stamp</div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('Orders')}
            className="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 text-stone-900 dark:text-stone-100 flex flex-col items-start gap-2 text-left active:scale-95 transition-all shadow-xs"
          >
            <div className="w-8 h-8 rounded-xl bg-[#1F8A5B]/15 text-[#1F8A5B] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs">{t.tabOrders}</div>
              <div className="text-[10px] text-stone-500">Pickup passes</div>
            </div>
          </button>
        </div>
      </div>

      {/* MY PRESCRIPTIONS PREVIEW */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Available Prescriptions
          </h3>
          <button
            onClick={() => onNavigate('FloatRx')}
            className="text-xs font-bold text-[#0F3B34] dark:text-[#389182]"
          >
            View all ({prescriptions.length})
          </button>
        </div>

        <div className="space-y-2">
          {prescriptions.slice(0, 2).map((rx) => (
            <div
              key={rx.id}
              onClick={() => onNavigate('FloatRx', { selectedRxId: rx.id })}
              className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 flex items-center justify-between cursor-pointer hover:border-stone-300 dark:hover:border-stone-700"
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono-jb text-xs font-bold text-stone-900 dark:text-stone-100">
                    {rx.rxNumber}
                  </span>
                  {rx.isDoctorVerified ? (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#1F8A5B]/15 text-[#1F8A5B]">
                      Verified
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#D99A1E]/15 text-[#D99A1E]">
                      Uploaded
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5">
                  {rx.items[0]?.name} · {rx.doctorName}
                </div>
              </div>

              <span className="text-xs font-bold text-[#D9673A] flex items-center gap-0.5">
                Float <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
