import { useState } from 'react';
import { useMushongaStore } from '../../store/useMushongaStore';
import { Order } from '../../types';
import { api } from '../../lib/api';
import { formatPrice } from '../../lib/realtime';
import { CheckCircle2, Package, Clock, Banknote, Smartphone, ChevronRight } from 'lucide-react';

interface PharmacyOrdersProps {
  pharmacyId?: string;
}

export function PharmacyOrders({ pharmacyId = 'pharma-msasa-avondale' }: PharmacyOrdersProps) {
  const currency = useMushongaStore((s) => s.currency);
  const orders = useMushongaStore((s) => s.orders);

  const pharmacyOrders = orders.filter((o) => o.pharmacyId === pharmacyId);

  const handleMarkReady = async (orderId: string) => {
    await api.markOrderReady(orderId);
  };

  const handleCollect = async (orderId: string) => {
    await api.collectOrder(orderId);
  };

  return (
    <div className="flex-1 overflow-y-auto phone-scroll p-4 pb-24 space-y-4 select-none">
      {/* Header */}
      <div>
        <h2 className="font-fraunces text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
          Dispensary Orders
        </h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Package medications, notify patients, and confirm collection
        </p>
      </div>

      <div className="space-y-3">
        {pharmacyOrders.map((ord) => {
          const isCash = ord.paymentMethod === 'cash';

          return (
            <div
              key={ord.id}
              className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-3"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono-jb text-xs font-bold text-stone-900 dark:text-stone-100">
                      {ord.orderNumber}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      ord.status === 'ready'
                        ? 'bg-[#1F8A5B] text-white'
                        : ord.status === 'collected'
                        ? 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                        : 'bg-[#D99A1E]/15 text-[#D99A1E]'
                    }`}>
                      {ord.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 mt-1">
                    {ord.patientName}
                  </h4>
                  <div className="text-[11px] text-stone-500 font-mono-jb">
                    {ord.patientPhone}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono-jb text-base font-extrabold text-[#0F3B34] dark:text-[#389182]">
                    {formatPrice(ord.totalUSD, currency)}
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono-jb block">
                    Code: <strong>{ord.pickupCode}</strong>
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800 space-y-1 text-xs">
                {ord.items.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="font-semibold text-stone-800 dark:text-stone-200">
                      {it.name} {it.strength}
                    </span>
                    <span className="font-mono-jb text-stone-500 text-[11px]">{it.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Payment Details */}
              <div className="flex items-center justify-between text-xs text-stone-500 bg-stone-100 dark:bg-stone-800/60 p-2 rounded-xl">
                <div className="flex items-center gap-1.5 font-medium">
                  {isCash ? (
                    <Banknote className="w-3.5 h-3.5 text-[#D99A1E]" />
                  ) : (
                    <Smartphone className="w-3.5 h-3.5 text-[#1F8A5B]" />
                  )}
                  <span>
                    {isCash
                      ? 'Cash on Collection (USD)'
                      : `Paid via ${ord.paymentMethod.toUpperCase()} · ref ${ord.paymentRef}`}
                  </span>
                </div>
                {ord.paymentStatus === 'paid' && (
                  <span className="text-[#1F8A5B] font-bold text-[10px]">PAID</span>
                )}
              </div>

              {/* Action Buttons based on status */}
              <div className="pt-1">
                {ord.status === 'accepted' && (
                  <button
                    onClick={() => handleMarkReady(ord.id)}
                    className="w-full py-2.5 rounded-xl bg-[#0F3B34] text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#165349] active:scale-95 transition-all shadow-xs"
                  >
                    <Package className="w-4 h-4 text-[#D9673A]" />
                    <span>Package Items & Mark Ready for Pickup</span>
                  </button>
                )}

                {ord.status === 'ready' && (
                  <button
                    onClick={() => handleCollect(ord.id)}
                    className="w-full py-2.5 rounded-xl bg-[#1F8A5B] text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#18754c] active:scale-95 transition-all shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isCash ? 'Record Cash Received & Handover' : 'Confirm Patient Handover'}</span>
                  </button>
                )}

                {ord.status === 'collected' && (
                  <div className="text-center text-xs text-stone-400 font-semibold py-1">
                    ✓ Handed over to patient
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {pharmacyOrders.length === 0 && (
          <div className="p-8 text-center rounded-2xl bg-stone-100 dark:bg-stone-800/40 text-stone-500 text-xs">
            No orders placed for this pharmacy yet.
          </div>
        )}
      </div>
    </div>
  );
}
