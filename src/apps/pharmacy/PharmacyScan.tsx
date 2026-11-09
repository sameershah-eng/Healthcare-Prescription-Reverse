import { useState } from 'react';
import { useMushongaStore } from '../../store/useMushongaStore';
import { CameraScannerModal } from '../../components/common/CameraScannerModal';
import { api } from '../../lib/api';
import { formatPrice } from '../../lib/realtime';
import confetti from 'canvas-confetti';
import { QrCode, CheckCircle2, ShieldCheck, KeyRound, ArrowRight } from 'lucide-react';

interface PharmacyScanProps {
  onSuccessCollected?: () => void;
}

export function PharmacyScan({ onSuccessCollected }: PharmacyScanProps) {
  const currency = useMushongaStore((s) => s.currency);
  const orders = useMushongaStore((s) => s.orders);

  const [showCameraModal, setShowCameraModal] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [collectedOrder, setCollectedOrder] = useState<any | null>(null);

  // Active ready order waiting for pickup
  const waitingOrder = orders.find((o) => o.status === 'ready' || o.status === 'accepted') || orders[0];

  const handleVerifyCode = async (codeToVerify: string) => {
    if (!waitingOrder) {
      setErrorMsg('No active prescription orders ready for collection.');
      return;
    }

    try {
      const ok = await api.collectOrder(waitingOrder.id, codeToVerify.replace(/\s+/g, ''));
      if (ok) {
        setCollectedOrder(waitingOrder);
        try {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.6 }
          });
        } catch (e) {
          // ignore
        }
        if (onSuccessCollected) onSuccessCollected();
      } else {
        setErrorMsg('Invalid pickup code. Please check patient pass.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification failed');
    }
  };

  const handleSimulateScan = () => {
    if (waitingOrder) {
      handleVerifyCode(waitingOrder.pickupCode);
    }
  };

  if (collectedOrder) {
    return (
      <div className="flex-1 overflow-y-auto phone-scroll p-4 pb-24 space-y-4 select-none animate-in fade-in text-center">
        <div className="w-16 h-16 rounded-full bg-[#1F8A5B] text-white flex items-center justify-center mx-auto shadow-lg mt-6">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <h2 className="font-fraunces text-2xl font-bold text-stone-900 dark:text-stone-100">
            Handover Confirmed!
          </h2>
          <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
            Prescription verified and marked Collected across Patient, Doctor, and Pharmacy apps.
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-left space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs">
            <span className="text-stone-500">Order Reference</span>
            <span className="font-mono-jb font-bold text-stone-900 dark:text-stone-100">
              {collectedOrder.orderNumber}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-stone-500">Patient</span>
            <span className="font-bold text-stone-900 dark:text-stone-100">
              {collectedOrder.patientName}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-stone-500">Total Collected</span>
            <span className="font-mono-jb font-bold text-[#0F3B34] dark:text-[#389182]">
              {formatPrice(collectedOrder.totalUSD, currency)}
            </span>
          </div>
        </div>

        <button
          onClick={() => setCollectedOrder(null)}
          className="w-full py-3 rounded-2xl bg-[#0F3B34] text-white font-bold text-xs"
        >
          Ready for Next Patient
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto phone-scroll p-4 pb-24 space-y-4 select-none">
      {/* Header */}
      <div>
        <h2 className="font-fraunces text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
          Scan Pickup Pass
        </h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Scan patient's QR code or enter 6-digit counter code
        </p>
      </div>

      {/* Main Viewfinder Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs flex flex-col items-center justify-center text-center space-y-4">
        <div className="relative w-40 h-40 rounded-3xl border-2 border-dashed border-[#D9673A] bg-stone-50 dark:bg-stone-800/40 flex flex-col items-center justify-center">
          <QrCode className="w-16 h-16 text-[#D9673A]/60" />
          <div className="absolute inset-x-2 h-0.5 bg-[#D9673A] animate-pulse" />
        </div>

        <div>
          <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
            Counter Scanner Ready
          </h3>
          <p className="text-xs text-stone-500 mt-0.5 max-w-xs">
            Use device camera to read patient QR code instantly
          </p>
        </div>

        <div className="w-full space-y-2">
          <button
            onClick={() => setShowCameraModal(true)}
            className="w-full py-3 rounded-2xl bg-[#0F3B34] text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#165349] active:scale-95 transition-all shadow-sm"
          >
            <QrCode className="w-4 h-4" />
            <span>Open Camera Viewfinder</span>
          </button>

          {/* Simulate button */}
          <button
            onClick={handleSimulateScan}
            className="w-full py-3 rounded-2xl bg-[#D9673A] text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#c25930] active:scale-95 transition-all shadow-md"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Simulate Patient Counter Scan</span>
          </button>
        </div>
      </div>

      {/* Manual 6-Digit Code Fallback */}
      <div className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-stone-700 dark:text-stone-300">
          <KeyRound className="w-4 h-4 text-stone-400" />
          <span>Manual 6-Digit Counter Code</span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            maxLength={6}
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder={waitingOrder ? waitingOrder.pickupCode : '482910'}
            className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 font-mono-jb text-base font-extrabold tracking-widest text-center bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#0F3B34]"
          />
          <button
            onClick={() => handleVerifyCode(manualCode || (waitingOrder ? waitingOrder.pickupCode : ''))}
            className="px-4 py-2.5 rounded-xl bg-[#0F3B34] text-white font-bold text-xs hover:bg-[#165349]"
          >
            Verify
          </button>
        </div>

        {errorMsg && (
          <p className="text-xs text-[#C8432F] font-semibold">{errorMsg}</p>
        )}
      </div>

      {/* Live Active Order waiting for collection preview */}
      {waitingOrder && (
        <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 text-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] text-stone-400 block font-mono-jb">
              Next Pending Pickup
            </span>
            <span className="font-bold text-stone-800 dark:text-stone-200">
              {waitingOrder.patientName} ({waitingOrder.orderNumber})
            </span>
          </div>
          <span className="font-mono-jb font-bold text-[#D9673A]">
            Code: {waitingOrder.pickupCode}
          </span>
        </div>
      )}

      {/* Camera Viewfinder Modal */}
      {showCameraModal && (
        <CameraScannerModal
          mode="qr"
          title="Scan Patient Pickup Pass"
          onDetected={() => {
            setShowCameraModal(false);
            handleSimulateScan();
          }}
          onClose={() => setShowCameraModal(false)}
        />
      )}
    </div>
  );
}
