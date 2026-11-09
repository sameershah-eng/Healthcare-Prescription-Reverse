import { useState } from 'react';
import { Prescription } from '../../types';
import { X, Lock, CheckCircle, ShieldAlert, ZoomIn, ZoomOut } from 'lucide-react';

interface StampViewerModalProps {
  prescription: Prescription | null;
  onClose: () => void;
  onAcceptToBid?: (rx: Prescription) => void;
  onReject?: (rx: Prescription, reason: string) => void;
  isPharmacyViewer?: boolean;
  dark?: boolean;
}

export function StampViewerModal({
  prescription,
  onClose,
  onAcceptToBid,
  onReject,
  isPharmacyViewer = true,
  dark = false
}: StampViewerModalProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [rejectMode, setRejectMode] = useState<boolean>(false);
  const [rejectReason, setRejectReason] = useState<string>('Illegible prescriber signature or missing dose duration');

  if (!prescription) return null;

  return (
    <div className="absolute inset-0 z-50 bg-black/75 backdrop-blur-sm flex flex-col justify-end p-2 select-none animate-in fade-in duration-200">
      <div className={`w-full max-h-[92%] rounded-3xl overflow-hidden flex flex-col shadow-2xl ${
        dark ? 'bg-stone-900 text-stone-100' : 'bg-white text-stone-900'
      }`}>
        {/* Header */}
        <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm">Review Physical Stamp</h3>
              <span className="text-[10px] font-mono-jb px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-500">
                {prescription.rxNumber}
              </span>
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Prescriber: {prescription.doctorName} · {prescription.dateIssued}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Image Container with Zoom Controls */}
        <div className="relative flex-1 min-h-[220px] bg-stone-950 flex items-center justify-center overflow-hidden p-2">
          <div
            className="transition-transform duration-200 relative flex items-center justify-center"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <img
              src={prescription.stampPhotoUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600'}
              alt="Prescription Stamp"
              className="max-h-[260px] w-auto object-contain rounded-lg shadow-lg border border-stone-800"
            />
            {/* Simulated Medical Council stamp overlay ring */}
            <div className="absolute bottom-6 right-6 border-2 border-red-700/80 rounded-full w-24 h-24 p-2 text-center text-red-700 font-bold stamp-seal flex flex-col items-center justify-center text-[8px] uppercase tracking-tighter pointer-events-none bg-red-100/10 backdrop-blur-2xs">
              <span className="leading-tight">Medical Council</span>
              <span className="text-[7px]">of Zimbabwe</span>
              <span className="text-[9px] mt-0.5 font-mono-jb">VALIDATED</span>
              <span className="text-[6px] text-stone-600">REG #44819</span>
            </div>
          </div>

          {/* Zoom buttons */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-md rounded-full p-1 border border-white/20">
            <button
              onClick={() => setZoomLevel((z) => Math.max(1, z - 0.25))}
              className="p-1 text-white hover:text-stone-300"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] text-white font-mono-jb px-1">
              {(zoomLevel * 100).toFixed(0)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
              className="p-1 text-white hover:text-stone-300"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Medicines summary */}
        <div className="p-3 bg-stone-50 dark:bg-stone-800/40 border-t border-stone-200 dark:border-stone-800 text-xs">
          <div className="font-semibold text-stone-800 dark:text-stone-200 mb-1">
            Prescribed Items to Dispense:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {prescription.items.map((it, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-stone-200/80 dark:bg-stone-700/70 text-[11px] font-medium"
              >
                {it.name} {it.strength} ({it.quantity})
              </span>
            ))}
          </div>
        </div>

        {/* Actions for Pharmacy */}
        {isPharmacyViewer && (
          <div className="p-4 border-t border-stone-200 dark:border-stone-800 space-y-3 shrink-0">
            {rejectMode ? (
              <div className="space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs text-[#C8432F] font-bold">
                  <ShieldAlert className="w-4 h-4" />
                  Select Reason for Private Rejection
                </div>
                <select
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                >
                  <option value="Illegible prescriber signature or missing dose duration">
                    Illegible prescriber signature or missing dose duration
                  </option>
                  <option value="Prescription expired (older than 30 days)">
                    Prescription expired (older than 30 days)
                  </option>
                  <option value="Item not registered with MCAZ / Schedule restricted">
                    Item not registered with MCAZ / Schedule restricted
                  </option>
                  <option value="Doctor stamp faded / verification unconfirmed">
                    Doctor stamp faded / verification unconfirmed
                  </option>
                </select>

                <div className="flex items-center gap-1.5 text-[11px] text-stone-500 bg-stone-100 dark:bg-stone-800 p-2 rounded-lg">
                  <Lock className="w-3.5 h-3.5 text-[#0F3B34] dark:text-[#389182] shrink-0" />
                  <span>Only your pharmacy sees this reason. Not visible to the patient.</span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => setRejectMode(false)}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (onReject) onReject(prescription, rejectReason);
                      onClose();
                    }}
                    className="flex-1 py-2 rounded-xl text-xs font-bold bg-[#C8432F] text-white hover:bg-[#b03724]"
                  >
                    Confirm Rejection
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mb-2.5">
                  <Lock className="w-3.5 h-3.5 text-[#0F3B34] dark:text-[#389182] shrink-0" />
                  <span>
                    Confirming will grant permission to submit your competitive reverse bid.
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setRejectMode(true)}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold border border-[#C8432F]/40 text-[#C8432F] hover:bg-[#C8432F]/10 active:scale-95 transition-all"
                  >
                    Reject Rx
                  </button>
                  <button
                    onClick={() => {
                      if (onAcceptToBid) onAcceptToBid(prescription);
                      onClose();
                    }}
                    className="flex-[2] py-2.5 rounded-xl text-xs font-bold bg-[#0F3B34] text-white hover:bg-[#165349] active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle className="w-4 h-4 text-[#D9673A]" />
                    Accept Rx & Bid
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
