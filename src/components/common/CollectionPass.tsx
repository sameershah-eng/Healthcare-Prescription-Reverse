import { Order, Currency } from '../../types';
import { formatPrice } from '../../lib/realtime';
import { CheckCircle2, Clock, MapPin, QrCode } from 'lucide-react';

interface CollectionPassProps {
  order: Order;
  currency: Currency;
  onSimulatePickup?: () => void;
  dark?: boolean;
}

export function CollectionPass({ order, currency, onSimulatePickup, dark = false }: CollectionPassProps) {
  const steps: { key: Order['status']; label: string }[] = [
    { key: 'accepted', label: 'Accepted' },
    { key: 'preparing', label: 'Preparing' },
    { key: 'ready', label: 'Ready' },
    { key: 'collected', label: 'Collected' }
  ];

  const statusIndexMap: Record<Order['status'], number> = {
    accepted: 0,
    preparing: 1,
    ready: 2,
    collected: 3
  };

  const currentIdx = statusIndexMap[order.status] ?? 0;

  return (
    <div className={`relative rounded-3xl border overflow-hidden shadow-md ${
      dark ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'
    }`}>
      {/* Top Header of Ticket */}
      <div className="bg-[#0F3B34] text-white p-4">
        <div className="flex items-center justify-between text-xs text-white/80">
          <span className="uppercase tracking-wider font-semibold text-[10px]">
            Prescription Collection Pass
          </span>
          <span className="font-mono-jb text-[11px] text-white/90">
            {order.orderNumber}
          </span>
        </div>
        <h3 className="font-fraunces text-xl font-bold mt-1 text-white">
          {order.pharmacyName}
        </h3>
        <p className="text-xs text-white/80 flex items-center gap-1 mt-1 truncate">
          <MapPin className="w-3 h-3 text-[#D9673A] shrink-0" />
          {order.pharmacyAddress}
        </p>
      </div>

      {/* Notch cutouts on sides to look like a genuine ticket */}
      <div className="relative h-4 bg-stone-100 dark:bg-stone-800 flex items-center justify-between px-[-12px]">
        <div className="w-4 h-4 rounded-full bg-[#F7F5F0] dark:bg-[#0E1513] -ml-2 border-r border-stone-200 dark:border-stone-800" />
        <div className="flex-1 border-b-2 border-dotted border-stone-300 dark:border-stone-700 mx-2" />
        <div className="w-4 h-4 rounded-full bg-[#F7F5F0] dark:bg-[#0E1513] -mr-2 border-l border-stone-200 dark:border-stone-800" />
      </div>

      {/* QR Code and 6-digit pickup code */}
      <div className="p-4 text-center">
        <div className="inline-block p-3 rounded-2xl bg-white border border-stone-200 shadow-inner">
          {/* Custom SVG QR Code Matrix */}
          <svg width="128" height="128" viewBox="0 0 128 128" fill="none" className="mx-auto">
            {/* Position markers */}
            <rect x="8" y="8" width="36" height="36" rx="4" fill="#0F3B34" />
            <rect x="14" y="14" width="24" height="24" rx="2" fill="white" />
            <rect x="20" y="20" width="12" height="12" rx="1" fill="#0F3B34" />

            <rect x="84" y="8" width="36" height="36" rx="4" fill="#0F3B34" />
            <rect x="90" y="14" width="24" height="24" rx="2" fill="white" />
            <rect x="96" y="20" width="12" height="12" rx="1" fill="#0F3B34" />

            <rect x="8" y="84" width="36" height="36" rx="4" fill="#0F3B34" />
            <rect x="14" y="90" width="24" height="24" rx="2" fill="white" />
            <rect x="20" y="96" width="12" height="12" rx="1" fill="#0F3B34" />

            {/* Simulated Data Dots */}
            <rect x="52" y="12" width="6" height="6" fill="#D9673A" />
            <rect x="66" y="12" width="6" height="6" fill="#0F3B34" />
            <rect x="52" y="24" width="6" height="6" fill="#0F3B34" />
            <rect x="60" y="32" width="6" height="6" fill="#D9673A" />
            <rect x="70" y="24" width="6" height="6" fill="#0F3B34" />
            
            <rect x="12" y="52" width="6" height="6" fill="#0F3B34" />
            <rect x="24" y="52" width="6" height="6" fill="#D9673A" />
            <rect x="36" y="52" width="6" height="6" fill="#0F3B34" />
            <rect x="24" y="66" width="6" height="6" fill="#0F3B34" />
            <rect x="12" y="70" width="6" height="6" fill="#0F3B34" />

            <rect x="52" y="52" width="8" height="8" rx="2" fill="#D9673A" />
            <rect x="68" y="52" width="6" height="6" fill="#0F3B34" />
            <rect x="52" y="68" width="6" height="6" fill="#0F3B34" />
            <rect x="68" y="68" width="8" height="8" rx="2" fill="#0F3B34" />

            <rect x="84" y="52" width="6" height="6" fill="#0F3B34" />
            <rect x="98" y="52" width="6" height="6" fill="#D9673A" />
            <rect x="110" y="52" width="6" height="6" fill="#0F3B34" />
            <rect x="90" y="66" width="6" height="6" fill="#0F3B34" />
            
            <rect x="52" y="84" width="6" height="6" fill="#0F3B34" />
            <rect x="66" y="84" width="6" height="6" fill="#D9673A" />
            <rect x="52" y="98" width="6" height="6" fill="#D9673A" />
            <rect x="66" y="98" width="6" height="6" fill="#0F3B34" />
            <rect x="60" y="110" width="6" height="6" fill="#0F3B34" />

            <rect x="84" y="84" width="8" height="8" fill="#0F3B34" />
            <rect x="100" y="84" width="6" height="6" fill="#0F3B34" />
            <rect x="90" y="96" width="8" height="8" fill="#D9673A" />
            <rect x="106" y="96" width="6" height="6" fill="#0F3B34" />
            <rect x="84" y="108" width="6" height="6" fill="#0F3B34" />
            <rect x="100" y="108" width="8" height="8" fill="#0F3B34" />
          </svg>
        </div>

        {/* 6-Digit Pickup Code */}
        <div className="mt-3">
          <span className="text-[10px] tracking-wider uppercase font-semibold text-stone-400">
            Counter Pickup Code
          </span>
          <div className="font-mono-jb text-2xl font-extrabold tracking-widest text-[#0F3B34] dark:text-[#389182]">
            {order.pickupCode.slice(0, 3)} {order.pickupCode.slice(3)}
          </div>
          <p className="text-[11px] text-stone-500 mt-0.5">
            Show QR or read 6-digit code to pharmacist
          </p>
        </div>

        {/* Status Timeline */}
        <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800">
          <div className="flex items-center justify-between relative px-2">
            {/* Connecting line */}
            <div className="absolute left-6 right-6 top-3 h-[2px] bg-stone-200 dark:bg-stone-700 -z-0" />
            <div
              className="absolute left-6 top-3 h-[2px] bg-[#1F8A5B] -z-0 transition-all duration-500"
              style={{ width: `${(currentIdx / (steps.length - 1)) * 80}%` }}
            />

            {steps.map((st, i) => {
              const isDone = i <= currentIdx;
              const isCurrent = i === currentIdx;
              return (
                <div key={st.key} className="flex flex-col items-center z-10">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                      isDone
                        ? 'bg-[#1F8A5B] text-white shadow-xs'
                        : 'bg-stone-200 dark:bg-stone-700 text-stone-500'
                    } ${isCurrent ? 'ring-2 ring-[#D9673A]' : ''}`}
                  >
                    {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                  </div>
                  <span
                    className={`text-[10px] mt-1 font-medium ${
                      isCurrent
                        ? 'text-[#D9673A] font-bold'
                        : isDone
                        ? 'text-stone-700 dark:text-stone-300'
                        : 'text-stone-400'
                    }`}
                  >
                    {st.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="mt-4 p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 text-left flex items-center justify-between text-xs">
          <div>
            <div className="font-semibold text-stone-800 dark:text-stone-200">
              {order.paymentMethod === 'cash' ? 'Cash on Collection' : 'Paid via EcoCash'}
            </div>
            <div className="text-[10px] text-stone-500 font-mono-jb">
              Ref: {order.paymentRef}
            </div>
          </div>
          <div className="font-mono-jb font-bold text-sm text-[#0F3B34] dark:text-[#389182]">
            {formatPrice(order.totalUSD, currency)}
          </div>
        </div>
      </div>
    </div>
  );
}
