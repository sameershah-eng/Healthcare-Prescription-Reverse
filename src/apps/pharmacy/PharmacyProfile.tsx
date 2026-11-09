import { useState } from 'react';
import { useMushongaStore } from '../../store/useMushongaStore';
import { Role } from '../../types';
import { formatPrice } from '../../lib/realtime';
import { translations } from '../../i18n/translations';
import { ShieldCheck, MapPin, Phone, TrendingUp, Sliders, Moon, Sun, CheckCircle } from 'lucide-react';

interface PharmacyProfileProps {
  onSwitchRole?: (role: Role) => void;
}

export function PharmacyProfile({ onSwitchRole }: PharmacyProfileProps) {
  const currency = useMushongaStore((s) => s.currency);
  const setCurrency = useMushongaStore((s) => s.setCurrency);
  const themeMode = useMushongaStore((s) => s.themeMode);
  const setThemeMode = useMushongaStore((s) => s.setThemeMode);
  const rules = useMushongaStore((s) => s.rules);
  const updateRules = useMushongaStore((s) => s.updateRules);

  // Simulated 7-day revenue payouts
  const weeklyRevenueData = [
    { day: 'Mon', amount: 145 },
    { day: 'Tue', amount: 210 },
    { day: 'Wed', amount: 180 },
    { day: 'Thu', amount: 290 },
    { day: 'Fri', amount: 340 },
    { day: 'Sat', amount: 410 },
    { day: 'Sun', amount: 275 }
  ];

  const totalWeekly = weeklyRevenueData.reduce((acc, curr) => acc + curr.amount, 0);
  const maxAmount = Math.max(...weeklyRevenueData.map((d) => d.amount));

  return (
    <div className="flex-1 overflow-y-auto phone-scroll p-4 pb-24 space-y-4 select-none">
      {/* Header */}
      <div className="flex items-center gap-3.5 pt-2">
        <div className="w-16 h-16 rounded-3xl bg-[#B8862F] text-white flex items-center justify-center font-bold text-2xl shadow-md border-2 border-white dark:border-stone-800">
          MP
        </div>
        <div>
          <h2 className="font-fraunces text-xl font-bold text-stone-900 dark:text-stone-100">
            Msasa Pharmacy
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Avondale Shopping Centre, King George Rd, Harare
          </p>
          <div className="flex items-center gap-1 text-[11px] text-[#1F8A5B] font-semibold mt-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>MCAZ Premise License #HRE-8821</span>
          </div>
        </div>
      </div>

      {/* Weekly Revenue Disbursed Chart */}
      <div className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
              Weekly Disbursed Revenue
            </span>
            <div className="font-mono-jb text-2xl font-black text-[#0F3B34] dark:text-[#389182] mt-0.5">
              {formatPrice(totalWeekly, currency)}
            </div>
          </div>
          <span className="text-xs font-bold text-[#1F8A5B] flex items-center gap-0.5 bg-[#1F8A5B]/10 px-2 py-0.5 rounded-full">
            <TrendingUp className="w-3 h-3" /> +18.4%
          </span>
        </div>

        {/* Custom Clean Bar Chart */}
        <div className="pt-2">
          <div className="flex items-end justify-between h-28 gap-2 px-1">
            {weeklyRevenueData.map((item) => {
              const heightPercent = (item.amount / maxAmount) * 100;
              const isPeak = item.amount === maxAmount;
              return (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <span className="text-[9px] font-mono-jb opacity-0 group-hover:opacity-100 transition-opacity text-stone-500">
                    ${item.amount}
                  </span>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-lg transition-all ${
                      isPeak
                        ? 'bg-[#D9673A] shadow-xs'
                        : 'bg-[#0F3B34] dark:bg-[#389182]/70 hover:opacity-85'
                    }`}
                  />
                  <span className="text-[10px] font-mono-jb text-stone-400">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Configurable Business Rules (Client's Open Questions) */}
      <div className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#D9673A]" />
          <h3 className="font-bold text-xs uppercase tracking-wider text-stone-700 dark:text-stone-300">
            Configurable Business Rules
          </h3>
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between p-2 rounded-xl bg-stone-50 dark:bg-stone-800/60">
            <div>
              <div className="font-semibold text-stone-800 dark:text-stone-200">
                Bid is binding once accepted
              </div>
              <div className="text-[10px] text-stone-500">Pharmacy must fulfill accepted bids</div>
            </div>
            <button
              onClick={() => updateRules({ bidBinding: !rules.bidBinding })}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                rules.bidBinding ? 'bg-[#1F8A5B] text-white' : 'bg-stone-200 dark:bg-stone-700 text-stone-500'
              }`}
            >
              {rules.bidBinding ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-stone-50 dark:bg-stone-800/60">
            <div>
              <div className="font-semibold text-stone-800 dark:text-stone-200">
                Tender Window
              </div>
              <div className="text-[10px] text-stone-500">Duration pharmacies can bid</div>
            </div>
            <span className="font-mono-jb font-bold text-[#D9673A]">
              {rules.bidWindowSeconds}s (Demo Speed)
            </span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-stone-50 dark:bg-stone-800/60">
            <div>
              <div className="font-semibold text-stone-800 dark:text-stone-200">
                Max Bids / Pharmacy
              </div>
              <div className="text-[10px] text-stone-500">Revisions count against quota</div>
            </div>
            <span className="font-mono-jb font-bold text-stone-700 dark:text-stone-300">
              {rules.maxBidsPerPharmacy} bids
            </span>
          </div>
        </div>
      </div>

      {/* Role Switcher */}
      {onSwitchRole && (
        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-2">
          <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
            Switch Mushonga App
          </span>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => onSwitchRole('patient')}
              className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-center hover:bg-stone-200"
            >
              Patient
            </button>
            <button
              onClick={() => onSwitchRole('doctor')}
              className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-center hover:bg-stone-200"
            >
              Doctor
            </button>
            <button
              onClick={() => onSwitchRole('pharmacy')}
              className="p-2 rounded-xl bg-[#B8862F] text-white font-bold text-center"
            >
              Pharmacy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
