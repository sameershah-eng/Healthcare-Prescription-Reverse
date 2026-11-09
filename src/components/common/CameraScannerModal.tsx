import { useState } from 'react';
import { X, Flashlight, Camera, QrCode, CheckCircle2, Sparkles } from 'lucide-react';

interface CameraScannerModalProps {
  mode: 'qr' | 'rx_photo';
  title: string;
  onDetected: (payload?: string) => void;
  onClose: () => void;
  dark?: boolean;
}

export function CameraScannerModal({
  mode,
  title,
  onDetected,
  onClose,
  dark = false
}: CameraScannerModalProps) {
  const [torchOn, setTorchOn] = useState(false);
  const [isScanning, setIsScanning] = useState(true);

  const handleSimulate = () => {
    setIsScanning(false);
    setTimeout(() => {
      onDetected(mode === 'qr' ? 'MSH-COLLECT-CONFIRMED' : 'STAMP_DETECTED_OK');
      onClose();
    }, 350);
  };

  return (
    <div className="absolute inset-0 z-50 bg-stone-950/95 flex flex-col justify-between p-4 select-none animate-in fade-in duration-200">
      {/* Top Controls */}
      <div className="flex items-center justify-between text-white z-20 pt-8 px-2">
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-bold text-sm text-center">
          {title}
        </h3>

        <button
          onClick={() => setTorchOn(!torchOn)}
          className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-colors ${
            torchOn ? 'bg-[#D9673A] text-white' : 'bg-white/20 text-white hover:bg-white/30'
          }`}
        >
          <Flashlight className="w-4 h-4" />
        </button>
      </div>

      {/* Viewfinder Center */}
      <div className="relative flex-1 flex flex-col items-center justify-center my-2">
        {/* Animated Viewfinder Grid */}
        <div className={`relative ${
          mode === 'qr' ? 'w-56 h-56' : 'w-64 h-72'
        } rounded-3xl border-2 border-white/50 bg-stone-900/60 backdrop-blur-xs flex flex-col items-center justify-center overflow-hidden shadow-2xl`}>
          {/* Subtle camera view pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* 4 Corner Accents */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-[#D9673A] rounded-tl-xl" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-[#D9673A] rounded-tr-xl" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-[#D9673A] rounded-bl-xl" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-[#D9673A] rounded-br-xl" />

          {/* Animated Laser Scan Line */}
          {isScanning && (
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#D9673A] to-transparent shadow-[0_0_12px_#D9673A] animate-bounce" />
          )}

          {mode === 'qr' ? (
            <div className="flex flex-col items-center gap-2">
              <QrCode className="w-16 h-16 text-white/40" />
              <span className="text-[10px] text-white/70 font-mono-jb">Align Pass QR</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-white/50 px-4 text-center">
              <Camera className="w-12 h-12" />
              <span className="text-[10px] font-mono-jb leading-tight">
                Align Doctor Ink Stamp & Signature
              </span>
            </div>
          )}
        </div>

        <p className="text-white/80 text-xs text-center mt-3 px-6 max-w-xs leading-relaxed">
          {mode === 'qr'
            ? 'Scan the 6-digit pickup QR code presented on patient device'
            : 'Position paper prescription showing official Medical Council stamp'}
        </p>
      </div>

      {/* Bottom Action: One tap simulation without any camera prompt */}
      <div className="z-20 pb-4 px-2 space-y-2">
        <button
          onClick={handleSimulate}
          className="w-full py-3.5 rounded-2xl bg-[#D9673A] text-white font-bold text-sm shadow-lg hover:bg-[#c25930] active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{mode === 'qr' ? 'Confirm QR Code Handover' : 'Capture Sample Stamped Rx'}</span>
        </button>
      </div>
    </div>
  );
}
