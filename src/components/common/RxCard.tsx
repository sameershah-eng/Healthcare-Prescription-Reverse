import { Prescription } from '../../types';
import { ShieldCheck, FileText, ExternalLink } from 'lucide-react';

interface RxCardProps {
  prescription: Prescription;
  onFloat?: (rx: Prescription) => void;
  onViewStamp?: (rx: Prescription) => void;
  onSelect?: (rx: Prescription) => void;
  selected?: boolean;
  showFloatAction?: boolean;
  dark?: boolean;
}

export function RxCard({
  prescription,
  onFloat,
  onViewStamp,
  onSelect,
  selected = false,
  showFloatAction = true,
  dark = false
}: RxCardProps) {
  return (
    <div
      onClick={() => onSelect && onSelect(prescription)}
      className={`relative rounded-2xl border transition-all duration-200 overflow-hidden ${
        selected
          ? 'ring-2 ring-[#D9673A] border-[#D9673A] shadow-md'
          : dark
          ? 'bg-stone-900/90 border-stone-800 hover:border-stone-700'
          : 'bg-white border-stone-200/90 hover:border-stone-300 shadow-xs'
      } ${onSelect ? 'cursor-pointer' : ''}`}
    >
      {/* Top Rx Header Bar */}
      <div className="px-4 pt-3.5 pb-2.5 border-b border-dashed border-stone-200 dark:border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-fraunces text-2xl font-bold text-[#0F3B34] dark:text-[#389182] leading-none">
            ℞
          </span>
          <div>
            <span className="text-[10px] tracking-wider uppercase font-semibold text-stone-400">
              Prescription Pad
            </span>
            <div className="font-mono-jb text-[11px] font-semibold text-stone-700 dark:text-stone-300">
              {prescription.rxNumber}
            </div>
          </div>
        </div>

        {/* Verification Status Badge */}
        {prescription.isDoctorVerified ? (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#1F8A5B]/10 border border-[#1F8A5B]/20 text-[#1F8A5B]">
            <ShieldCheck className="w-3 h-3" />
            <span className="text-[10px] font-bold tracking-tight">Doctor-Verified</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#D99A1E]/15 border border-[#D99A1E]/30 text-[#D99A1E]">
            <FileText className="w-3 h-3" />
            <span className="text-[10px] font-bold tracking-tight">Uploaded Stamp</span>
          </div>
        )}
      </div>

      {/* Main Body */}
      <div className="p-4 space-y-3">
        {/* Doctor and Date */}
        <div className="flex items-baseline justify-between text-xs">
          <div>
            <div className="font-bold text-stone-900 dark:text-stone-100">
              {prescription.doctorName}
            </div>
            <div className="text-[11px] text-stone-500">
              {prescription.doctorSpecialty || 'General Practitioner'} · {prescription.doctorRegNumber || 'MCZ-MD-44819'}
            </div>
          </div>
          <span className="text-[11px] font-mono-jb text-stone-400 shrink-0">
            {prescription.dateIssued}
          </span>
        </div>

        {/* Diagnosis note */}
        {prescription.diagnosis && (
          <div className="text-[11px] text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-stone-800/60 p-2 rounded-lg">
            <span className="font-semibold text-stone-800 dark:text-stone-200">Dx: </span>
            {prescription.diagnosis}
          </div>
        )}

        {/* Medicines list */}
        <div className="space-y-1.5 pt-1">
          {prescription.items.map((item, idx) => (
            <div
              key={idx}
              className="text-xs p-2 rounded-lg bg-stone-50 dark:bg-stone-800/40 border border-stone-100 dark:border-stone-800"
            >
              <div className="flex items-center justify-between font-semibold text-stone-900 dark:text-stone-100">
                <span>{item.name} {item.strength}</span>
                <span className="font-mono-jb text-stone-500 text-[11px]">{item.quantity}</span>
              </div>
              <div className="text-[11px] text-stone-500 mt-0.5 font-sans">
                {item.dosage}
              </div>
            </div>
          ))}
        </div>

        {/* Stamped photo thumbnail if external */}
        {!prescription.isDoctorVerified && prescription.stampPhotoUrl && (
          <div className="pt-1 flex items-center justify-between">
            <div
              onClick={(e) => {
                e.stopPropagation();
                if (onViewStamp) onViewStamp(prescription);
              }}
              className="flex items-center gap-2 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg overflow-hidden border border-stone-300 dark:border-stone-700 relative">
                <img
                  src={prescription.stampPhotoUrl}
                  alt="Doctor Stamp"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1 group-hover:text-[#D9673A]">
                  Review Physical Stamp <ExternalLink className="w-3 h-3" />
                </span>
                <span className="text-[10px] text-stone-400 block">MCZ Official Ink Impression</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Perforated tear border line */}
      <div className="relative h-2 perforated-border text-stone-300 dark:text-stone-700" />

      {/* Footer / CTA */}
      {showFloatAction && onFloat && (
        <div className="px-4 py-2.5 bg-stone-50/70 dark:bg-stone-800/40 flex items-center justify-between">
          <span className="text-[11px] text-stone-500">
            {prescription.status === 'floated'
              ? 'Currently in active bidding'
              : prescription.status === 'ordered'
              ? 'Tender accepted'
              : 'Ready to float to pharmacies'}
          </span>

          {prescription.status === 'issued' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFloat(prescription);
              }}
              className="px-3 py-1.5 rounded-lg bg-[#D9673A] text-white text-xs font-bold hover:bg-[#c25930] active:scale-95 transition-all shadow-xs"
            >
              Float Rx Now
            </button>
          )}
        </div>
      )}
    </div>
  );
}
