import { useState, useRef, useEffect } from 'react';
import { X, Flashlight, Camera, QrCode, CheckCircle2 } from 'lucide-react';

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
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    async function startCamera() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' }
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setHasPermission(true);
          }
        } else {
          setHasPermission(false);
        }
      } catch (err) {
        // Permission denied or camera unavailable in iframe
        setHasPermission(false);
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleSimulate = () => {
    setIsScanning(false);
    setTimeout(() => {
      onDetected(mode === 'qr' ? 'MSH-COLLECT-CONFIRMED' : 'STAMP_DETECTED_OK');
      onClose();
    }, 400);
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/90 flex flex-col justify-between p-4 select-none animate-in fade-in duration-200">
      {/* Top Controls */}
      <div className="flex items-center justify-between text-white z-20 pt-8 px-2">
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-bold text-sm text-center">
          {title}
        </h3>

        <button
          onClick={() => setTorchOn(!torchOn)}
          className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-colors ${
            torchOn ? 'bg-[#D9673A] text-white' : 'bg-white/20 text-white'
          }`}
        >
          <Flashlight className="w-4 h-4" />
        </button>
      </div>

      {/* Viewfinder Center */}
      <div className="relative flex-1 flex flex-col items-center justify-center my-4">
        {/* Real video if accessible */}
        {hasPermission && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover opacity-60 rounded-3xl"
          />
        )}

        {/* Framing Box */}
        <div className={`relative ${
          mode === 'qr' ? 'w-56 h-56' : 'w-64 h-80'
        } rounded-3xl border-2 border-white/60 bg-white/5 backdrop-blur-2xs flex flex-col items-center justify-center overflow-hidden shadow-2xl`}>
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
            <QrCode className="w-16 h-16 text-white/30" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-white/40">
              <Camera className="w-12 h-12" />
              <span className="text-[10px] text-center px-4 font-mono-jb">
                Align Doctor Ink Stamp inside frame
              </span>
            </div>
          )}
        </div>

        <p className="text-white/80 text-xs text-center mt-4 px-6 max-w-xs leading-relaxed">
          {mode === 'qr'
            ? 'Scan the 6-digit pickup QR code presented by the patient'
            : 'Position paper prescription ensuring official Medical Council stamp is visible'}
        </p>

        {hasPermission === false && (
          <div className="mt-2 text-[11px] text-stone-400 bg-black/40 px-3 py-1 rounded-full">
            Camera simulated (ideal for browser sandbox)
          </div>
        )}
      </div>

      {/* Bottom Action: Always provide "Simulate" fallback so no user is ever stuck */}
      <div className="z-20 pb-6 px-2 space-y-2">
        <button
          onClick={handleSimulate}
          className="w-full py-3.5 rounded-2xl bg-[#D9673A] text-white font-bold text-sm shadow-lg hover:bg-[#c25930] active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          {mode === 'qr' ? 'Simulate QR Verification' : 'Simulate Doctor Stamp Capture'}
        </button>
      </div>
    </div>
  );
}
