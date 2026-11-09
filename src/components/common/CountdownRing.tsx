import { useState, useEffect } from 'react';

interface CountdownRingProps {
  totalSeconds: number; // total duration
  expiresAt: number; // timestamp in ms
  size?: number;
  strokeWidth?: number;
  onExpire?: () => void;
}

export function CountdownRing({
  totalSeconds = 60,
  expiresAt,
  size = 54,
  strokeWidth = 4,
  onExpire
}: CountdownRingProps) {
  const [secondsLeft, setSecondsLeft] = useState<number>(() => {
    const diff = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
    return diff > 0 ? diff : totalSeconds;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
      setSecondsLeft(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        if (onExpire) onExpire();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(1, Math.max(0, secondsLeft / totalSeconds));
  const strokeDashoffset = circumference * (1 - progress);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const formattedTime = `${mins}:${secs.toString().padStart(2, '0')}`;

  return (
    <div className="relative inline-flex items-center justify-center shrink-0">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-stone-200 dark:text-stone-800"
          fill="transparent"
        />
        {/* Copper active ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#D9673A"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-linear"
          fill="transparent"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-mono-jb text-[11px] font-bold text-[#D9673A] tracking-tighter">
          {formattedTime}
        </span>
      </div>
    </div>
  );
}
