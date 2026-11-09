import { useState } from 'react';
import { useMushongaStore } from '../../store/useMushongaStore';
import { FloatRx, Prescription, Bid } from '../../types';
import { CountdownRing } from '../../components/common/CountdownRing';
import { StampViewerModal } from '../../components/common/StampViewerModal';
import { api } from '../../lib/api';
import { formatPrice } from '../../lib/realtime';
import { translations } from '../../i18n/translations';
import { 
  ShieldCheck, 
  FileText, 
  Clock, 
  MapPin, 
  Send, 
  Lock, 
  CheckCircle2, 
  Sliders, 
  Sparkles,
  ExternalLink,
  X
} from 'lucide-react';

const EMPTY_REJECTED: string[] = [];

interface PharmacyLiveRxProps {
  pharmacyId?: string;
  onNavigateToMyBids?: () => void;
}

export function PharmacyLiveRx({
  pharmacyId = 'pharma-msasa-avondale',
  onNavigateToMyBids
}: PharmacyLiveRxProps) {
  const language = useMushongaStore((s) => s.language);
  const currency = useMushongaStore((s) => s.currency);
  const floats = useMushongaStore((s) => s.floats);
  const bids = useMushongaStore((s) => s.bids);
  const prescriptions = useMushongaStore((s) => s.prescriptions);
  const rejectedRxIdsByPharmacy = useMushongaStore((s) => s.rejectedRxIdsByPharmacy);
  const rejectedRxIds = rejectedRxIdsByPharmacy[pharmacyId] || EMPTY_REJECTED;

  const t = translations[language];

  // Selected float for placing bid
  const [biddingFloat, setBiddingFloat] = useState<FloatRx | null>(null);
  const [bidPrice, setBidPrice] = useState<number>(12.50);
  const [readyMinutes, setReadyMinutes] = useState<number>(20);
  const [inStock, setInStock] = useState<boolean>(true);
  const [bidNote, setBidNote] = useState<string>('Sealed batch. Dispensed with seal.');
  const [isSubmittingBid, setIsSubmittingBid] = useState<boolean>(false);
  const [inspectStampRx, setInspectStampRx] = useState<Prescription | null>(null);

  // Active floats that haven't been privately rejected by this pharmacy
  const activeFloats = floats.filter(
    (f) => f.status === 'bidding' && !rejectedRxIds.includes(f.prescriptionId)
  );

  const handleSubmitBid = async () => {
    if (!biddingFloat) return;
    setIsSubmittingBid(true);
    try {
      await api.submitBid(biddingFloat.id, pharmacyId, bidPrice, readyMinutes, inStock, bidNote);
      setBiddingFloat(null);
      if (onNavigateToMyBids) onNavigateToMyBids();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingBid(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto phone-scroll p-4 pb-24 space-y-4 select-none">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#B8862F] dark:text-[#e0ab48] bg-[#B8862F]/10 px-2 py-0.5 rounded-full">
              Live Reverse Bidding
            </span>
            <h2 className="font-fraunces text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 mt-1">
              Live Prescriptions
            </h2>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-[#1F8A5B]/15 text-[#1F8A5B] font-mono-jb text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#1F8A5B] animate-ping" />
            {activeFloats.length} open
          </span>
        </div>
        <p className="text-xs text-stone-500 mt-0.5">
          Tenders broadcasted within your 10km service radius
        </p>
      </div>

      {/* Floated Prescriptions Feed */}
      <div className="space-y-3">
        {activeFloats.map((flt) => {
          const rx = prescriptions.find((r) => r.id === flt.prescriptionId);
          if (!rx) return null;

          // Check if pharmacy already submitted a bid for this float
          const myBid = bids.find((b) => b.floatId === flt.id && b.pharmacyId === pharmacyId);
          const allFloatBids = bids.filter((b) => b.floatId === flt.id).sort((a, b) => a.priceUSD - b.priceUSD);
          const lowestOffer = allFloatBids[0]?.priceUSD;

          return (
            <div
              key={flt.id}
              className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-3"
            >
              {/* Header: Status & Countdown */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-mono-jb text-xs font-bold text-stone-900 dark:text-stone-100">
                      {rx.rxNumber}
                    </span>
                    {rx.isDoctorVerified ? (
                      <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#1F8A5B]/15 text-[#1F8A5B] text-[10px] font-bold">
                        <ShieldCheck className="w-3 h-3" />
                        Doctor-Verified
                      </span>
                    ) : (
                      <button
                        onClick={() => setInspectStampRx(rx)}
                        className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#D99A1E]/15 text-[#D99A1E] text-[10px] font-bold hover:bg-[#D99A1E]/25 transition-colors"
                      >
                        <FileText className="w-3 h-3" />
                        Uploaded Stamp (Inspect) <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                      </button>
                    )}
                  </div>
                  <div className="text-[11px] text-stone-500 mt-0.5">
                    Patient: {flt.patientName} · {flt.suburb} (1.4 km)
                  </div>
                </div>

                <CountdownRing
                  totalSeconds={60}
                  expiresAt={flt.expiresAt}
                  size={42}
                  strokeWidth={3}
                />
              </div>

              {/* Items Summary */}
              <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800 space-y-1 text-xs">
                {rx.items.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between font-semibold">
                    <span>{it.name} {it.strength}</span>
                    <span className="font-mono-jb text-stone-500 text-[11px]">{it.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Existing Bid status or Place Bid CTA */}
              {myBid ? (
                <div className="p-3 rounded-2xl bg-[#0F3B34]/10 border border-[#0F3B34]/20 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-500 block">
                      Your Active Bid
                    </span>
                    <div className="font-mono-jb text-base font-extrabold text-[#0F3B34] dark:text-[#389182]">
                      {formatPrice(myBid.priceUSD, currency)}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] font-bold text-[#D9673A] block">
                      Rank #{myBid.rank || 1}
                    </span>
                    {lowestOffer && lowestOffer < myBid.priceUSD && (
                      <span className="text-[10px] text-stone-500">
                        {formatPrice(myBid.priceUSD - lowestOffer, currency)} above lowest
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 pt-1">
                  {!rx.isDoctorVerified && (
                    <button
                      onClick={() => setInspectStampRx(rx)}
                      className="px-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-bold text-xs hover:bg-stone-100 dark:hover:bg-stone-800"
                    >
                      Inspect Stamp
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setBiddingFloat(flt);
                      setBidPrice(12.50);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-[#0F3B34] text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#165349] active:scale-95 transition-all shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5 text-[#D9673A]" />
                    <span>Submit Reverse Bid</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {activeFloats.length === 0 && (
          <div className="p-8 text-center rounded-2xl bg-stone-100 dark:bg-stone-800/40 text-stone-500 text-xs space-y-1">
            <p className="font-bold">No active prescriptions in tender.</p>
            <p className="text-[11px]">Float a prescription in the Patient app to trigger live bids!</p>
          </div>
        )}
      </div>

      {/* BID SUBMISSION BOTTOM SHEET */}
      {biddingFloat && (
        <div className="absolute inset-0 z-50 bg-black/75 backdrop-blur-xs flex flex-col justify-end p-2 animate-in fade-in">
          <div className="w-full rounded-3xl bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 p-4 shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                  Submit Competitive Tender Offer
                </span>
                <h3 className="font-fraunces text-lg font-bold">
                  {biddingFloat.patientName} (Avondale)
                </h3>
              </div>
              <button
                onClick={() => setBiddingFloat(null)}
                className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Price Input in USD */}
            <div>
              <div className="flex items-baseline justify-between mb-1.5">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                  Your Offer Price (USD)
                </label>
                <span className="font-mono-jb text-xs text-stone-400">
                  Convert to {formatPrice(bidPrice, 'ZiG')}
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 font-mono-jb text-sm font-bold text-stone-400">
                  US$
                </span>
                <input
                  type="number"
                  step="0.5"
                  value={bidPrice}
                  onChange={(e) => setBidPrice(parseFloat(e.target.value) || 0)}
                  className="w-full pl-12 pr-4 py-2 rounded-xl border border-stone-300 dark:border-stone-700 font-mono-jb text-lg font-black bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#0F3B34]"
                />
              </div>

              {/* Quick price decrement buttons */}
              <div className="flex items-center gap-1.5 mt-2">
                {[14.00, 12.50, 11.50, 10.80].map((p) => (
                  <button
                    key={p}
                    onClick={() => setBidPrice(p)}
                    className="flex-1 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-[11px] font-mono-jb font-bold hover:bg-stone-200"
                  >
                    ${p.toFixed(2)}
                  </button>
                ))}
              </div>
            </div>

            {/* Ready in minutes */}
            <div>
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                Dispense & Ready in:
              </label>
              <div className="flex items-center gap-2 font-mono-jb text-xs">
                {[15, 20, 30, 45].map((m) => (
                  <button
                    key={m}
                    onClick={() => setReadyMinutes(m)}
                    className={`flex-1 py-1.5 rounded-xl font-bold transition-all ${
                      readyMinutes === m
                        ? 'bg-[#0F3B34] text-white shadow-xs'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    {m} min
                  </button>
                ))}
              </div>
            </div>

            {/* In stock toggle */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800 text-xs">
              <span className="font-semibold text-stone-800 dark:text-stone-200">
                All medications verified in stock
              </span>
              <button
                onClick={() => setInStock(!inStock)}
                className={`w-10 h-6 rounded-full transition-colors relative ${
                  inStock ? 'bg-[#1F8A5B]' : 'bg-stone-300'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  inStock ? 'translate-x-5' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* Submit Bid CTA */}
            <button
              disabled={isSubmittingBid}
              onClick={handleSubmitBid}
              className="w-full py-3.5 rounded-2xl bg-[#D9673A] text-white font-extrabold text-xs flex items-center justify-center gap-2 hover:bg-[#c25930] active:scale-98 transition-all shadow-md"
            >
              <Send className="w-4 h-4" />
              <span>Submit Bid ({formatPrice(bidPrice, currency)})</span>
            </button>
          </div>
        </div>
      )}

      {/* Stamp Inspection Modal */}
      {inspectStampRx && (
        <StampViewerModal
          prescription={inspectStampRx}
          isPharmacyViewer={true}
          onClose={() => setInspectStampRx(null)}
          onAcceptToBid={(rx) => {
            const flt = floats.find((f) => f.prescriptionId === rx.id);
            if (flt) {
              setBiddingFloat(flt);
              setBidPrice(12.50);
            }
          }}
          onReject={(rx, reason) => {
            api.rejectRxPrivately(pharmacyId, rx.id, reason);
          }}
        />
      )}
    </div>
  );
}
