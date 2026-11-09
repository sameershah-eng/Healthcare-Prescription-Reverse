import { useState } from 'react';
import { useMushongaStore } from '../../store/useMushongaStore';
import { Bid } from '../../types';
import { api } from '../../lib/api';
import { formatPrice } from '../../lib/realtime';
import { translations } from '../../i18n/translations';
import { Trophy, Clock, Sparkles, TrendingDown, CheckCircle2, XCircle } from 'lucide-react';

interface PharmacyMyBidsProps {
  pharmacyId?: string;
  onViewOrder?: (orderId: string) => void;
}

export function PharmacyMyBids({
  pharmacyId = 'pharma-msasa-avondale',
  onViewOrder
}: PharmacyMyBidsProps) {
  const language = useMushongaStore((s) => s.language);
  const currency = useMushongaStore((s) => s.currency);
  const bids = useMushongaStore((s) => s.bids);
  const floats = useMushongaStore((s) => s.floats);
  const orders = useMushongaStore((s) => s.orders);
  const t = translations[language];

  const [activeSegment, setActiveSegment] = useState<'active' | 'won' | 'lost'>('active');

  const myBids = bids.filter((b) => b.pharmacyId === pharmacyId);
  const activeBids = myBids.filter((b) => b.status === 'pending');
  const wonBids = myBids.filter((b) => b.status === 'accepted');
  const lostBids = myBids.filter((b) => b.status === 'rejected');

  const handleRevisePrice = async (bidId: string, currentPrice: number) => {
    const revisedPrice = Number((currentPrice - 1.20).toFixed(2));
    await api.reviseBid(bidId, Math.max(8.00, revisedPrice));
  };

  return (
    <div className="flex-1 overflow-y-auto phone-scroll p-4 pb-24 space-y-4 select-none">
      {/* Header */}
      <div>
        <h2 className="font-fraunces text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
          My Tender Bids
        </h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Track active competitive ranks, wins, and revisions
        </p>
      </div>

      {/* Segment Switcher */}
      <div className="flex items-center p-1 rounded-2xl bg-stone-100 dark:bg-stone-800 text-xs font-bold">
        <button
          onClick={() => setActiveSegment('active')}
          className={`flex-1 py-2 rounded-xl text-center transition-all ${
            activeSegment === 'active'
              ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
              : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100'
          }`}
        >
          Active ({activeBids.length})
        </button>
        <button
          onClick={() => setActiveSegment('won')}
          className={`flex-1 py-2 rounded-xl text-center transition-all ${
            activeSegment === 'won'
              ? 'bg-white dark:bg-stone-900 text-[#1F8A5B] shadow-xs'
              : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100'
          }`}
        >
          Won 🎉 ({wonBids.length})
        </button>
        <button
          onClick={() => setActiveSegment('lost')}
          className={`flex-1 py-2 rounded-xl text-center transition-all ${
            activeSegment === 'lost'
              ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
              : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100'
          }`}
        >
          Past ({lostBids.length})
        </button>
      </div>

      {/* ACTIVE BIDS */}
      {activeSegment === 'active' && (
        <div className="space-y-3">
          {activeBids.map((b) => {
            const allTenderBids = bids.filter((item) => item.floatId === b.floatId).sort((x, y) => x.priceUSD - y.priceUSD);
            const lowestTenderPrice = allTenderBids[0]?.priceUSD;
            const isLeading = b.priceUSD <= lowestTenderPrice;

            return (
              <div
                key={b.id}
                className={`p-4 rounded-3xl border shadow-xs space-y-3 ${
                  isLeading
                    ? 'bg-gradient-to-br from-[#0F3B34]/10 to-[#D9673A]/10 border-[#D9673A]'
                    : 'bg-white dark:bg-stone-900 border-stone-200/90 dark:border-stone-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">
                      Tender Offer
                    </span>
                    <div className="font-mono-jb text-xl font-black text-stone-900 dark:text-stone-100">
                      {formatPrice(b.priceUSD, currency)}
                    </div>
                    {b.isRevised && b.originalPriceUSD && (
                      <span className="text-[10px] text-stone-400 line-through font-mono-jb">
                        Was {formatPrice(b.originalPriceUSD, currency)}
                      </span>
                    )}
                  </div>

                  {isLeading ? (
                    <span className="px-2.5 py-1 rounded-full bg-[#1F8A5B] text-white text-[10px] font-bold flex items-center gap-1 shadow-xs">
                      <Sparkles className="w-3 h-3" />
                      Rank #1 Leader
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-[10px] font-bold">
                      Rank #{b.rank || 2}
                    </span>
                  )}
                </div>

                <div className="text-xs text-stone-500">
                  Ready in {b.readyInMinutes}m · Avondale Branch
                </div>

                {/* Revise / Drop Price CTA */}
                {!isLeading && (
                  <button
                    onClick={() => handleRevisePrice(b.id, b.priceUSD)}
                    className="w-full py-2.5 rounded-xl bg-[#D9673A] text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#c25930] active:scale-95 transition-all shadow-xs"
                  >
                    <TrendingDown className="w-4 h-4" />
                    <span>Drop Price to {formatPrice(b.priceUSD - 1.20, currency)} (Take Lead)</span>
                  </button>
                )}
              </div>
            );
          })}

          {activeBids.length === 0 && (
            <div className="p-8 text-center rounded-2xl bg-stone-100 dark:bg-stone-800/40 text-stone-500 text-xs">
              No active bids right now. Check the "Live Rx" tab to bid on open prescriptions!
            </div>
          )}
        </div>
      )}

      {/* WON BIDS */}
      {activeSegment === 'won' && (
        <div className="space-y-3">
          {wonBids.map((b) => {
            const relatedOrder = orders.find((o) => o.floatId === b.floatId);
            return (
              <div
                key={b.id}
                className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-[#1F8A5B]/40 shadow-xs space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded-full bg-[#1F8A5B]/15 text-[#1F8A5B] font-bold text-[10px] inline-flex items-center gap-1">
                      <Trophy className="w-3 h-3" />
                      Tender Won!
                    </span>
                    <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 mt-1">
                      Patient Accepted Your Price
                    </h4>
                    <div className="font-mono-jb text-base font-extrabold text-[#0F3B34] dark:text-[#389182]">
                      {formatPrice(b.priceUSD, currency)}
                    </div>
                  </div>

                  {relatedOrder && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      relatedOrder.status === 'ready'
                        ? 'bg-[#1F8A5B] text-white'
                        : relatedOrder.status === 'collected'
                        ? 'bg-stone-200 dark:bg-stone-800 text-stone-600'
                        : 'bg-[#D99A1E]/15 text-[#D99A1E]'
                    }`}>
                      {relatedOrder.status}
                    </span>
                  )}
                </div>

                {relatedOrder && onViewOrder && (
                  <button
                    onClick={() => onViewOrder(relatedOrder.id)}
                    className="w-full py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-bold hover:bg-stone-200"
                  >
                    View Order & Dispense
                  </button>
                )}
              </div>
            );
          })}

          {wonBids.length === 0 && (
            <div className="p-8 text-center rounded-2xl bg-stone-100 dark:bg-stone-800/40 text-stone-500 text-xs">
              No won tenders yet. Compete on open prescriptions to win!
            </div>
          )}
        </div>
      )}

      {/* PAST / LOST BIDS */}
      {activeSegment === 'lost' && (
        <div className="space-y-3">
          {lostBids.map((b) => (
            <div
              key={b.id}
              className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 text-stone-500 text-xs flex items-center justify-between"
            >
              <div>
                <span className="font-mono-jb font-bold text-stone-700 dark:text-stone-300">
                  {formatPrice(b.priceUSD, currency)}
                </span>
                <span className="block text-[10px]">Tender concluded</span>
              </div>
              <span className="text-[10px] text-stone-400">Patient picked competitor</span>
            </div>
          ))}

          {lostBids.length === 0 && (
            <div className="p-8 text-center rounded-2xl bg-stone-100 dark:bg-stone-800/40 text-stone-500 text-xs">
              No past bids.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
