import { motion, AnimatePresence } from 'motion/react';
import { PushNotification, Role } from '../../types';
import { Bell, X } from 'lucide-react';

interface PushBannerProps {
  notification: PushNotification | null;
  onDismiss: (id: string) => void;
  onTap?: (screen?: string) => void;
  role: Role;
}

export function PushBanner({ notification, onDismiss, onTap, role }: PushBannerProps) {
  if (!notification) return null;

  const roleColor = role === 'patient' 
    ? 'border-[#0F3B34]/30 bg-[#0F3B34]/95 text-stone-100'
    : role === 'doctor'
    ? 'border-[#2B4C7E]/30 bg-[#2B4C7E]/95 text-stone-100'
    : 'border-[#B8862F]/30 bg-[#B8862F]/95 text-stone-100';

  return (
    <AnimatePresence>
      <motion.div
        key={notification.id}
        initial={{ y: -70, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: -60, opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', damping: 22, stiffness: 300 }}
        onClick={() => {
          if (onTap) onTap(notification.screen);
          onDismiss(notification.id);
        }}
        className={`absolute top-12 left-3 right-3 z-50 rounded-2xl p-3 shadow-xl backdrop-blur-md cursor-pointer border ${roleColor}`}
      >
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center shrink-0 mt-0.5">
            <Bell className="w-4 h-4 text-white" />
          </div>

          <div className="flex-1 min-w-0 pr-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-white/80">
                Mushonga · {role}
              </span>
              <span className="text-[10px] text-white/70">now</span>
            </div>
            <h4 className="text-xs font-bold text-white mt-0.5 truncate">
              {notification.title}
            </h4>
            <p className="text-[11px] text-white/90 leading-tight mt-0.5 line-clamp-2">
              {notification.body}
            </p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDismiss(notification.id);
            }}
            className="p-1 rounded-full text-white/70 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
