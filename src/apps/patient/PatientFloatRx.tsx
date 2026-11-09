import { useState } from 'react';
import { useMushongaStore } from '../../store/useMushongaStore';
import { Prescription } from '../../types';
import { RxCard } from '../../components/common/RxCard';
import { InteractiveMiniMap } from '../../components/common/InteractiveMiniMap';
import { CameraScannerModal } from '../../components/common/CameraScannerModal';
import { StampViewerModal } from '../../components/common/StampViewerModal';
import { api } from '../../lib/api';
import { translations } from '../../i18n/translations';
import { ShieldCheck, Upload, ArrowRight, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';

interface PatientFloatRxProps {
  onLaunched: (floatId: string) => void;
  preselectedRxId?: string;
  initialMode?: 'select' | 'upload';
}

export function PatientFloatRx({ onLaunched, preselectedRxId, initialMode = 'select' }: PatientFloatRxProps) {
  const language = useMushongaStore((s) => s.language);
  const prescriptions = useMushongaStore((s) => s.prescriptions);
  const t = translations[language];

  const [step, setStep] = useState<number>(1);
  const [sourceType, setSourceType] = useState<'verified' | 'upload'>(initialMode === 'upload' ? 'upload' : 'verified');
  const [selectedRx, setSelectedRx] = useState<Prescription | null>(() => {
    if (preselectedRxId) {
      return prescriptions.find((r) => r.id === preselectedRxId) || prescriptions[0] || null;
    }
    return prescriptions[0] || null;
  });
  const [radiusKm, setRadiusKm] = useState<number>(10);
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [inspectStampRx, setInspectStampRx] = useState<Prescription | null>(null);
  const [isFloating, setIsFloating] = useState<boolean>(false);

  // Filter doctor verified vs uploaded
  const verifiedList = prescriptions.filter((r) => r.isDoctorVerified);
  const uploadedList = prescriptions.filter((r) => !r.isDoctorVerified);

  const handleLaunchTender = async () => {
    if (!selectedRx) return;
    setIsFloating(true);
    try {
      const flt = await api.floatPrescription(selectedRx.id, radiusKm, 'Tendai Moyo');
      setIsFloating(false);
      onLaunched(flt.id);
    } catch (err) {
      console.error(err);
      setIsFloating(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto phone-scroll p-4 pb-24 space-y-4 select-none">
      {/* Header & Step Tracker */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="font-fraunces text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
            Float Prescription
          </h2>
          <span className="font-mono-jb text-xs font-bold text-[#D9673A] px-2 py-0.5 rounded-full bg-[#D9673A]/10">
            Step {step} of 3
          </span>
        </div>
        <p className="text-xs text-stone-500 mt-0.5">
          {step === 1
            ? 'Choose verified or upload physical doctor prescription'
            : step === 2
            ? 'Confirm bidding radius across Harare'
            : 'Review tender summary and launch reverse auction'}
        </p>

        {/* 3-step progress bar */}
        <div className="flex items-center gap-1.5 mt-2.5">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                s <= step ? 'bg-[#D9673A]' : 'bg-stone-200 dark:bg-stone-800'
              }`}
            />
          ))}
        </div>
      </div>

      {/* STEP 1: SELECT OR UPLOAD PRESCRIPTION */}
      {step === 1 && (
        <div className="space-y-4 animate-in fade-in">
          {/* Source Segmented Selector */}
          <div className="flex items-center p-1 rounded-2xl bg-stone-100 dark:bg-stone-800 text-xs font-bold">
            <button
              onClick={() => setSourceType('verified')}
              className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                sourceType === 'verified'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#1F8A5B]" />
              <span>Doctor-Verified ({verifiedList.length})</span>
            </button>
            <button
              onClick={() => setSourceType('upload')}
              className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                sourceType === 'upload'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              <Upload className="w-3.5 h-3.5 text-[#D99A1E]" />
              <span>External Upload</span>
            </button>
          </div>

          {sourceType === 'verified' ? (
            <div className="space-y-3">
              <div className="text-[11px] text-stone-500">
                Directly issued by certified doctors with tamper-proof cryptographic seals:
              </div>

              {verifiedList.map((rx) => (
                <RxCard
                  key={rx.id}
                  prescription={rx}
                  selected={selectedRx?.id === rx.id}
                  onSelect={(r) => setSelectedRx(r)}
                  showFloatAction={false}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-[11px] text-stone-500">
                Capture paper prescription with official doctor ink stamp:
              </div>

              {/* Upload Action Button */}
              <button
                onClick={() => setShowCamera(true)}
                className="w-full p-4 rounded-2xl border-2 border-dashed border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/40 flex flex-col items-center justify-center gap-2 hover:border-[#D9673A] text-stone-600 dark:text-stone-300 active:scale-98 transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-[#D9673A]/15 text-[#D9673A] flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-center">
                  <span className="font-bold text-xs block">Scan / Take Photo of Paper Rx</span>
                  <span className="text-[10px] text-stone-400">Uses camera or sample stamped prescription</span>
                </div>
              </button>

              {/* Sample Uploaded Prescriptions List */}
              {uploadedList.map((rx) => (
                <RxCard
                  key={rx.id}
                  prescription={rx}
                  selected={selectedRx?.id === rx.id}
                  onSelect={(r) => setSelectedRx(r)}
                  onViewStamp={(r) => setInspectStampRx(r)}
                  showFloatAction={false}
                />
              ))}
            </div>
          )}

          {/* Continue CTA */}
          <div className="pt-2">
            <button
              disabled={!selectedRx}
              onClick={() => setStep(2)}
              className="w-full py-3.5 rounded-2xl bg-[#0F3B34] text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#165349] active:scale-98 transition-all shadow-sm"
            >
              <span>Continue to Radius & Location</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: RADIUS & MAP */}
      {step === 2 && (
        <div className="space-y-4 animate-in fade-in">
          <div className="text-xs text-stone-500">
            Select your preferred pickup distance around Avondale, Harare:
          </div>

          {/* Interactive Mini Map */}
          <InteractiveMiniMap
            radiusKm={radiusKm}
            onRadiusChange={(km) => setRadiusKm(km)}
          />

          <div className="p-3 rounded-2xl bg-stone-100 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800 text-xs">
            <div className="font-bold text-stone-800 dark:text-stone-200">
              Selected Rx: {selectedRx?.rxNumber}
            </div>
            <div className="text-[11px] text-stone-500 mt-0.5">
              {selectedRx?.items.length} items · Prescriber: {selectedRx?.doctorName}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-3.5 rounded-2xl bg-stone-200 dark:bg-stone-800 font-bold text-xs text-stone-700 dark:text-stone-300 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex-1 py-3.5 rounded-2xl bg-[#0F3B34] text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#165349] active:scale-98 transition-all shadow-sm"
            >
              <span>Review & Launch Tender</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: REVIEW & LAUNCH TENDER */}
      {step === 3 && selectedRx && (
        <div className="space-y-4 animate-in fade-in">
          <div className="rounded-2xl p-4 bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
              <span className="font-mono-jb text-xs font-bold text-stone-900 dark:text-stone-100">
                {selectedRx.rxNumber}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D9673A]/15 text-[#D9673A]">
                60s Live Tender
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Prescription Items:
              </span>
              <div className="space-y-1.5 mt-1">
                {selectedRx.items.map((it, idx) => (
                  <div key={idx} className="text-xs flex items-center justify-between font-semibold">
                    <span>{it.name} {it.strength}</span>
                    <span className="font-mono-jb text-stone-500">{it.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500">
              <span>Radius: <strong>{radiusKm} km</strong></span>
              <span>Patient: <strong>Tendai Moyo</strong></span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#1F8A5B]/10 border border-[#1F8A5B]/20 text-[11px] text-[#1F8A5B] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>
              Tender will broadcast to licensed pharmacies within {radiusKm}km in real time.
            </span>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-3.5 rounded-2xl bg-stone-200 dark:bg-stone-800 font-bold text-xs text-stone-700 dark:text-stone-300 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              disabled={isFloating}
              onClick={handleLaunchTender}
              className="flex-1 py-3.5 rounded-2xl bg-[#D9673A] text-white font-extrabold text-xs flex items-center justify-center gap-2 hover:bg-[#c25930] active:scale-98 transition-all shadow-md"
            >
              <Send className="w-4 h-4" />
              <span>{isFloating ? 'Broadcasting...' : 'Float to Pharmacies Now'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Camera Scanner Viewfinder Modal */}
      {showCamera && (
        <CameraScannerModal
          mode="rx_photo"
          title="Capture Doctor Paper Rx"
          onDetected={() => {
            setShowCamera(false);
            setSourceType('upload');
          }}
          onClose={() => setShowCamera(false)}
        />
      )}

      {/* Stamp Inspection Modal */}
      {inspectStampRx && (
        <StampViewerModal
          prescription={inspectStampRx}
          isPharmacyViewer={false}
          onClose={() => setInspectStampRx(null)}
        />
      )}
    </div>
  );
}
