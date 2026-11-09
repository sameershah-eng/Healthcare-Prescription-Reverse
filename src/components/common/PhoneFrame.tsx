import { ReactNode } from 'react';
import { Role } from '../../types';
import { StatusBar } from './StatusBar';
import { PushBanner } from './PushBanner';
import { useMushongaStore } from '../../store/useMushongaStore';
import { motion, AnimatePresence } from 'motion/react';

interface PhoneFrameProps {
  role: Role;
  roleTitle: string;
  roleSubtitle?: string;
  children: ReactNode;
  onNavigateScreen?: (screen?: string) => void;
  dark?: boolean;
  isMobileFullBleed?: boolean;
}

export function PhoneFrame({
  role,
  roleTitle,
  roleSubtitle,
  children,
  onNavigateScreen,
  dark = false,
  isMobileFullBleed = false
}: PhoneFrameProps) {
  const notifications = useMushongaStore((s) => s.notifications);
  const markNotificationRead = useMushongaStore((s) => s.markNotificationRead);
  const touchRipple = useMushongaStore((s) => s.touchRipple);

  // Filter unread notifications targeting this role
  const roleNotification = notifications.find((n) => n.targetRole === role && !n.read) || null;

  const roleColors = {
    patient: {
      badge: 'bg-[#0F3B34] text-white',
      border: 'border-[#0F3B34]/30',
      dot: 'bg-[#0F3B34]'
    },
    doctor: {
      badge: 'bg-[#2B4C7E] text-white',
      border: 'border-[#2B4C7E]/30',
      dot: 'bg-[#2B4C7E]'
    },
    pharmacy: {
      badge: 'bg-[#B8862F] text-white',
      border: 'border-[#B8862F]/30',
      dot: 'bg-[#B8862F]'
    }
  };

  const currentRoleStyle = roleColors[role];

  // Mobile full bleed view (no bezel, 100dvh)
  if (isMobileFullBleed) {
    return (
      <div className={`relative w-full h-[100dvh] flex flex-col overflow-hidden select-none ${
        dark ? 'bg-[#0E1513] text-stone-100' : 'bg-[#F7F5F0] text-stone-900'
      }`}>
        <StatusBar dark={dark} />

        <PushBanner
          role={role}
          notification={roleNotification}
          onDismiss={(id) => markNotificationRead(id)}
          onTap={(screen) => onNavigateScreen && onNavigateScreen(screen)}
        />

        <div className="relative flex-1 overflow-hidden flex flex-col">
          {children}
        </div>
      </div>
    );
  }

  // Desktop / Tablet Mockup with 8px stone-900 bezel and 44px rounded corners
  return (
    <div className="flex flex-col items-center select-none shrink-0 group">
      {/* Top Role Indicator Tag */}
      <div className="mb-2 flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900/90 text-stone-200 border border-stone-800 shadow-sm backdrop-blur-md">
        <span className={`w-2 h-2 rounded-full ${currentRoleStyle.dot} animate-live-pulse`} />
        <span className="text-[11px] font-bold tracking-wide uppercase">
          {roleTitle}
        </span>
        {roleSubtitle && (
          <span className="text-[10px] text-stone-400 font-mono-jb">
            {roleSubtitle}
          </span>
        )}
      </div>

      {/* Phone Hardware Shell */}
      <div
        className="relative w-[360px] max-w-[360px] h-[780px] max-h-[calc(100vh-140px)] rounded-[44px] p-2 bg-[#1A1A1A] border-4 border-stone-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] flex flex-col overflow-hidden transition-transform duration-200"
      >
        {/* Inner Screen Canvas */}
        <div className={`relative w-full h-full rounded-[36px] overflow-hidden flex flex-col ${
          dark ? 'bg-[#0E1513] text-stone-100' : 'bg-[#F7F5F0] text-stone-900'
        }`}>
          {/* iOS Status Bar */}
          <StatusBar dark={dark} />

          {/* In-Phone Push Banner */}
          <PushBanner
            role={role}
            notification={roleNotification}
            onDismiss={(id) => markNotificationRead(id)}
            onTap={(screen) => onNavigateScreen && onNavigateScreen(screen)}
          />

          {/* Active Touch Ripple for automated story driver */}
          <AnimatePresence>
            {touchRipple && touchRipple.role === role && (
              <motion.div
                initial={{ scale: 0, opacity: 0.9 }}
                animate={{ scale: 1.8, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                style={{ left: touchRipple.x, top: touchRipple.y }}
                className="absolute w-12 h-12 -ml-6 -mt-6 rounded-full bg-[#D9673A]/60 border-2 border-[#D9673A] pointer-events-none z-50 shadow-lg"
              />
            )}
          </AnimatePresence>

          {/* Screen Content Root (strictly inside phone) */}
          <div className="relative flex-1 overflow-hidden flex flex-col">
            {children}
          </div>

          {/* iOS Bottom Home Indicator Bar */}
          <div className="h-4 flex items-center justify-center shrink-0 z-30 pointer-events-none pb-1">
            <div className={`w-32 h-1 rounded-full ${
              dark ? 'bg-stone-600/80' : 'bg-stone-300'
            }`} />
          </div>
        </div>
      </div>
    </div>
  );
}
