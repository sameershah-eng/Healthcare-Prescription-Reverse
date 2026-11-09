import { useState } from 'react';
import { useMushongaStore } from '../../store/useMushongaStore';
import { Bid, PaymentMethod, Order } from '../../types';
import { BidCard } from '../../components/common/BidCard';
import { CountdownRing } from '../../components/common/CountdownRing';
import { CollectionPass } from '../../components/common/CollectionPass';
import { api } from '../../lib/api';
import { formatPrice } from '../../lib/realtime';
import { translations } from '../../i18n/translations';
import { AnimatePresence, motion } from 'motion/react';
import { 
  Sparkles, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  X,
  ArrowRight
} from 'lucide-react';

interface PatientLiveBidsProps {
  floatId?: string;
  onViewOrders?: () => void;
}

export function PatientLiveBids({ floatId, onViewOrders }: PatientLiveBidsProps) {
  const language = useMushongaStore((s) => s.language);
  const currency = useMushongaStore((s) => s.currency);
  const floats = useMushongaStore((s) => s.floats);
  const bids = useMushongaStore((s) => s.bids);
  const orders = useMushongaStore((s) => s.orders);

  const t = translations[language];

  // Pick active float or provided floatId
  const currentFloat = floatId
    ? floats.find((f) => f.id === floatId) || floats[0]
    : floats.find((f) => f.status === 'bidding') || floats[0];

  const floatBids = currentFloat
    ? bids.filter((b) => b.floatId === currentFloat.id).sort((a, b) => a.priceUSD - b.priceUSD)
    : [];

  const highestBidUSD = floatBids.length > 0 ? Math.max(...floatBids.map((b) => b.priceUSD)) : 0;
  const lowestBidUSD = floatBids.length > 0 ? floatBids[0].priceUSD : 0;
  const savingsUSD = highestBidUSD > lowestBidUSD ? highestBidUSD - lowestBidUSD : 0;

  // Payment sheet states
  const [selectedBidForPayment, setSelectedBidForPayment] = useState<Bid | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('ecocash');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // If float is already accepted, check if there's an existing order
  const existingOrder = currentFloat
    ? orders.find((o) => o.floatId === currentFloat.id)
    : null;

  const activeOrderToDisplay = createdOrder || existingOrder;

  const handleConfirmPayment = async () => {
    if (!selectedBidForPayment) return;
    setIsProcessingPayment(true);
    setPaymentError(null);

    try {
      const ord = await api.acceptBid(selectedBidForPayment.id, paymentMethod);
      setCreatedOrder(ord);
      setSelectedBidForPayment(null);
    } catch (err: any) {
      setPaymentError(err.message || 'Payment failed. Please retry.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // If order already completed/accepted, show Collection Pass
  if (activeOrderToDisplay) {
    return (
      <div className="flex-1 overflow-y-auto phone-scroll p-4 pb-24 space-y-4 select-none animate-in fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-fraunces text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
              Pickup Ready
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Present this pass at {activeOrderToDisplay.pharmacyName}
            </p>
          </div>
          {onViewOrders && (
            <button
              onClick={onViewOrders}
              className="text-xs font-bold text-[#0F3B34] dark:text-[#389182] flex items-center gap-1"
            >
              <span>All Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <CollectionPass
          order={activeOrderToDisplay}
          currency={currency}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto phone-scroll p-4 pb-24 space-y-4 select-none">
      {/* Top Bidding Status & Countdown Ring */}
      {currentFloat ? (
        <div className="rounded-3xl p-4 bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D9673A] animate-ping" />
                <span className="text-[11px] uppercase tracking-wider font-bold text-[#D9673A]">
                  Reverse Bidding Active
                </span>
              </div>
              <h3 className="font-fraunces text-xl font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                {floatBids.length} Pharmacies Competing
              </h3>
              <p className="text-[11px] text-stone-500">
                Radius: {currentFloat.radiusKm} km · Avondale, Harare
              </p>
            </div>

            {/* Signature Countdown Ring */}
            <CountdownRing
              totalSeconds={60}
              expiresAt={currentFloat.expiresAt}
              size={56}
              strokeWidth={4}
            />
          </div>

          {/* Lowest Bid Banner */}
          {floatBids.length > 0 && (
            <div className="p-3 rounded-2xl bg-gradient-to-r from-[#0F3B34]/10 via-[#165349]/10 to-[#D9673A]/10 border border-[#D9673A]/40 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">
                  {t.lowestSoFar}
                </span>
                <div className="font-mono-jb text-lg font-black text-[#D9673A]">
                  {formatPrice(lowestBidUSD, currency)}
                </div>
              </div>

              {savingsUSD > 0 && (
                <div className="text-right">
                  <span className="text-[10px] text-stone-500">Max Savings</span>
                  <div className="font-mono-jb text-xs font-bold text-[#1F8A5B] flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Save {formatPrice(savingsUSD, currency)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 text-center rounded-3xl bg-stone-100 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800">
          <p className="text-xs text-stone-500">No active tender currently floating.</p>
        </div>
      )}

      {/* Live Sorted Bids List */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Live Reverse Bids (Sorted by Price)
          </h4>
          <span className="text-[10px] font-mono-jb text-stone-400">
            Auto-reordering
          </span>
        </div>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {floatBids.map((bid, idx) => (
              <BidCard
                key={bid.id}
                bid={bid}
                currency={currency}
                isLowest={idx === 0}
                savingsUSD={idx === 0 ? savingsUSD : 0}
                onAccept={(b) => setSelectedBidForPayment(b)}
              />
            ))}
          </AnimatePresence>

          {floatBids.length === 0 && (
            <div className="p-6 text-center rounded-2xl border border-dashed border-stone-300 dark:border-stone-700 space-y-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#D9673A] mx-auto" />
              <p className="text-xs text-stone-500">
                Pinging pharmacies in Avondale & Belgravia... Bids will appear in real time.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* PAYMENT SHEET MODAL */}
      {selectedBidForPayment && (
        <div className="absolute inset-0 z-50 bg-black/75 backdrop-blur-xs flex flex-col justify-end p-2 animate-in fade-in">
          <div className="w-full rounded-3xl bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 p-4 shadow-2xl space-y-4">
            {/* Sheet Header */}
            <div className="flex items-start justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                  Accept Bid & Pay
                </span>
                <h3 className="font-fraunces text-xl font-bold">
                  {selectedBidForPayment.pharmacyName}
                </h3>
                <div className="font-mono-jb text-base font-extrabold text-[#D9673A] mt-0.5">
                  Total: {formatPrice(selectedBidForPayment.priceUSD, currency)}
                </div>
              </div>

              <button
                onClick={() => setSelectedBidForPayment(null)}
                className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                Choose Payment Method
              </span>

              {[
                { id: 'ecocash', label: 'EcoCash Mobile Money', icon: Smartphone, desc: 'Instant USSD prompt (+263 77 234 5678)' },
                { id: 'onemoney', label: 'OneMoney (NetOne)', icon: Smartphone, desc: 'NetOne mobile wallet' },
                { id: 'innbucks', label: 'InnBucks Wallet', icon: Smartphone, desc: 'Fast retail US dollar balance' },
                { id: 'card', label: 'Visa / Mastercard', icon: CreditCard, desc: 'Paynow direct gateway' },
                { id: 'cash', label: 'Cash on Collection (USD)', icon: Banknote, desc: 'Pay physical cash at pharmacy counter' }
              ].map((pm) => {
                const Icon = pm.icon;
                const isSelected = paymentMethod === pm.id;
                return (
                  <button
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id as PaymentMethod)}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                      isSelected
                        ? 'border-[#0F3B34] bg-[#0F3B34]/5 dark:bg-[#0F3B34]/20 ring-1 ring-[#0F3B34]'
                        : 'border-stone-200 dark:border-stone-800 hover:border-stone-300'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-[#0F3B34] text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-500'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-xs">{pm.label}</div>
                      <div className="text-[10px] text-stone-500 truncate">{pm.desc}</div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-[#0F3B34] bg-[#0F3B34]' : 'border-stone-300'
                    }`}>
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Error callout if any */}
            {paymentError && (
              <div className="p-2.5 rounded-xl bg-[#C8432F]/15 border border-[#C8432F]/30 text-[#C8432F] text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{paymentError}</span>
              </div>
            )}

            {/* Simulated EcoCash USSD Prompt note */}
            {paymentMethod === 'ecocash' && (
              <div className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-[11px] text-stone-500 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#0F3B34] shrink-0" />
                <span>Prompt will be sent to +263 77 234 5678 to authorize.</span>
              </div>
            )}

            {/* Submit Payment CTA */}
            <button
              disabled={isProcessingPayment}
              onClick={handleConfirmPayment}
              className="w-full py-3.5 rounded-2xl bg-[#D9673A] text-white font-extrabold text-xs flex items-center justify-center gap-2 hover:bg-[#c25930] active:scale-98 transition-all shadow-md"
            >
              {isProcessingPayment ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authorizing {paymentMethod.toUpperCase()}...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    Confirm & Authorize {formatPrice(selectedBidForPayment.priceUSD, currency)}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
