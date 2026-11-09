import { motion } from 'motion/react';
import { Role } from '../../types';
import { LucideIcon } from 'lucide-react';

export interface TabItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
  isCenterCTA?: boolean;
}

interface TabBarProps {
  role: Role;
  tabs: TabItem[];
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  dark?: boolean;
}

export function TabBar({ role, tabs, activeTab, onSelectTab, dark = false }: TabBarProps) {
  return (
    <div className="absolute bottom-4 left-3 right-3 z-40 select-none">
      <div className={`relative flex items-center justify-around px-2 py-1.5 rounded-full backdrop-blur-xl border shadow-lg ${
        dark 
          ? 'bg-stone-900/85 border-stone-800/80 text-stone-300' 
          : 'bg-[#F7F5F0]/85 border-stone-200/90 text-stone-600'
      }`}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          if (tab.isCenterCTA) {
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className="relative -top-4 flex flex-col items-center group active:scale-95 transition-transform"
              >
                <div className="w-13 h-13 rounded-full bg-[#D9673A] text-white flex items-center justify-center shadow-lg shadow-[#D9673A]/40 border-2 border-white dark:border-stone-900">
                  <Icon className="w-6 h-6 stroke-[2.2]" />
                </div>
                <span className="text-[10px] font-bold text-[#D9673A] mt-0.5 tracking-tight">
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className="relative flex flex-col items-center py-1 px-2.5 rounded-full active:scale-95 transition-transform"
            >
              {isActive && (
                <motion.div
                  layoutId={`activeTabPill-${role}`}
                  className={`absolute inset-0 rounded-full -z-10 ${
                    dark ? 'bg-stone-800/90' : 'bg-stone-200/70'
                  }`}
                  transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                />
              )}

              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    isActive
                      ? role === 'patient'
                        ? 'text-[#0F3B34] dark:text-[#389182]'
                        : role === 'doctor'
                        ? 'text-[#2B4C7E] dark:text-[#608bcf]'
                        : 'text-[#B8862F] dark:text-[#e0ab48]'
                      : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-200'
                  }`}
                />
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-[#D9673A] text-[9px] font-bold text-white flex items-center justify-center">
                    {tab.badge}
                  </span>
                ) : null}
              </div>

              <span
                className={`text-[10px] mt-0.5 tracking-tight transition-colors ${
                  isActive
                    ? 'font-bold text-stone-900 dark:text-stone-100'
                    : 'font-medium text-stone-400 dark:text-stone-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
