import { motion } from 'motion/react';
import { Bid, Currency } from '../../types';
import { formatPrice } from '../../lib/realtime';
import { CheckCircle2, Clock, Sparkles } from 'lucide-react';

interface BidCardProps {
  bid: Bid;
  currency: Currency;
  isLowest?: boolean;
  savingsUSD?: number;
  onAccept?: (bid: Bid) => void;
  dark?: boolean;
  disabled?: boolean;
}

export function BidCard({
  bid,
  currency,
  isLowest = false,
  savingsUSD = 0,
  onAccept,
  dark = false,
  disabled = false
}: BidCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className={`rounded-2xl border p-4 transition-all ${
        isLowest
          ? 'bg-gradient-to-br from-[#0F3B34]/10 via-[#F7F5F0] to-[#D9673A]/10 dark:from-[#0F3B34]/30 dark:via-stone-900 dark:to-[#D9673A]/20 border-[#D9673A] shadow-md ring-1 ring-[#D9673A]/50'
          : dark
          ? 'bg-stone-900/90 border-stone-800'
          : 'bg-white border-stone-200/90 shadow-xs'
      }`}
    >
      {/* Header: Pharmacy Name & Distance */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 truncate">
              {bid.pharmacyName}
            </h4>
            {isLowest && (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#D9673A] text-white text-[10px] font-bold shadow-xs">
                <Sparkles className="w-2.5 h-2.5" /> Lowest
              </span>
            )}
            {bid.isRevised && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-md bg-[#1F8A5B]/15 text-[#1F8A5B] font-mono-jb text-[10px] font-semibold">
                Revised ↓
              </span>
            )}
          </div>
          <div className="text-[11px] text-stone-500 mt-0.5">
            {bid.pharmacySuburb} · {bid.pharmacyDistanceKm.toFixed(1)} km away
          </div>
        </div>

        {/* Price display in JetBrains Mono / Fraunces */}
        <div className="text-right shrink-0">
          {bid.isRevised && bid.originalPriceUSD && (
            <div className="text-[11px] line-through text-stone-400 font-mono-jb">
              {formatPrice(bid.originalPriceUSD, currency)}
            </div>
          )}
          <div className={`font-mono-jb text-lg font-extrabold ${
            isLowest ? 'text-[#D9673A]' : 'text-stone-900 dark:text-stone-100'
          }`}>
            {formatPrice(bid.priceUSD, currency)}
          </div>
        </div>
      </div>

      {/* Meta details: Ready time & Stock */}
      <div className="mt-3 flex items-center justify-between text-xs pt-2.5 border-t border-stone-100 dark:border-stone-800">
        <div className="flex items-center gap-3 text-stone-500 text-[11px]">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            Ready in {bid.readyInMinutes}m
          </span>
          <span className="flex items-center gap-1 text-[#1F8A5B]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            All in stock
          </span>
        </div>

        {onAccept && (
          <button
            onClick={() => onAccept(bid)}
            disabled={disabled}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs active:scale-95 transition-all shadow-xs ${
              isLowest
                ? 'bg-[#D9673A] text-white hover:bg-[#c25930]'
                : 'bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 hover:opacity-90'
            }`}
          >
            Accept Bid
          </button>
        )}
      </div>

      {/* Savings Callout if lowest */}
      {isLowest && savingsUSD > 0 && (
        <div className="mt-2.5 px-2.5 py-1.5 rounded-lg bg-[#1F8A5B]/10 border border-[#1F8A5B]/20 flex items-center justify-between text-[11px] text-[#1F8A5B] font-medium">
          <span>You save {formatPrice(savingsUSD, currency)} vs highest offer</span>
          <span className="font-bold">Best Deal</span>
        </div>
      )}
    </motion.div>
  );
}
