import { useState } from 'react';
import { useMushongaStore } from '../../store/useMushongaStore';
import { storyPlayer } from '../../lib/storyPlayer';
import { api } from '../../lib/api';
import { 
  Play, 
  Square, 
  RotateCcw, 
  CalendarPlus, 
  FilePlus, 
  Send, 
  Flame, 
  CheckCircle, 
  QrCode, 
  WifiOff, 
  AlertTriangle, 
  ChevronUp, 
  ChevronDown,
  Sparkles,
  Sliders
} from 'lucide-react';

export function DemoControlPanel() {
  const [isExpanded, setIsExpanded] = useState(false);
  const storyStep = useMushongaStore((s) => s.storyStep);
  const storyCaption = useMushongaStore((s) => s.storyCaption);
  const isOffline = useMushongaStore((s) => s.isOffline);
  const setIsOffline = useMushongaStore((s) => s.setIsOffline);
  const resetAllData = useMushongaStore((s) => s.resetAllData);
  const rules = useMushongaStore((s) => s.rules);
  const updateRules = useMushongaStore((s) => s.updateRules);
  const themeMode = useMushongaStore((s) => s.themeMode);
  const isDark = themeMode === 'dark';
  const [showRulesSheet, setShowRulesSheet] = useState(false);

  const isStoryActive = storyStep >= 0;

  // Manual Trigger: New booking
  const handleTriggerBooking = () => {
    const freeSlot = useMushongaStore.getState().slots.find((s) => !s.isBooked && s.doctorId === 'doc-chikwanha');
    if (freeSlot) {
      useMushongaStore.getState().bookSlot(freeSlot.id, 'doc-chikwanha', 'Tendai Moyo', 35);
    }
  };

  // Manual Trigger: Issue Rx
  const handleTriggerIssueRx = () => {
    useMushongaStore.getState().issuePrescription({
      doctorId: 'doc-chikwanha',
      doctorName: 'Dr. Rumbidzai Chikwanha',
      doctorSpecialty: 'Specialist Physician',
      doctorRegNumber: 'MCZ-MD-44819',
      patientId: 'patient-tendai',
      patientName: 'Tendai Moyo',
      items: [
        { id: 'm-1', name: 'Amoxicillin & Clavulanate', strength: '625mg', dosage: '1 tab bd with food', quantity: '14 tabs' },
        { id: 'm-2', name: 'Paracetamol', strength: '500mg', dosage: '2 tabs qds prn', quantity: '20 tabs' }
      ],
      diagnosis: 'Bacterial sinusitis',
      notes: 'Take full course.'
    });
  };

  // Manual Trigger: Float Rx
  const handleTriggerFloatRx = () => {
    const rx = useMushongaStore.getState().prescriptions[0];
    if (rx) {
      api.floatPrescription(rx.id, 10, 'Tendai Moyo');
    }
  };

  // Manual Trigger: Spawn Bid
  const handleTriggerSpawnBid = () => {
    const floats = useMushongaStore.getState().floats;
    const activeFloat = floats.find((f) => f.status === 'bidding') || floats[0];
    if (activeFloat) {
      const pharmacies = useMushongaStore.getState().pharmacies;
      const ph = pharmacies[Math.floor(Math.random() * pharmacies.length)];
      const price = Number((11.5 + Math.random() * 5).toFixed(2));
      useMushongaStore.getState().submitBid(activeFloat.id, ph.id, price, 20, true, 'Sealed stock available');
    }
  };

  // Manual Trigger: Mark Ready
  const handleTriggerMarkReady = () => {
    const orders = useMushongaStore.getState().orders;
    const ord = orders.find((o) => o.status === 'accepted') || orders[0];
    if (ord) {
      useMushongaStore.getState().markOrderReady(ord.id);
    }
  };

  // Manual Trigger: Collection Scan
  const handleTriggerCollectionScan = () => {
    const orders = useMushongaStore.getState().orders;
    const ord = orders.find((o) => o.status === 'ready' || o.status === 'accepted') || orders[0];
    if (ord) {
      useMushongaStore.getState().collectOrder(ord.id, ord.pickupCode);
    }
  };

  // Manual Trigger: Simulate Payment Failure
  const handleTriggerPaymentFail = async () => {
    const bids = useMushongaStore.getState().bids;
    if (bids.length > 0) {
      try {
        await useMushongaStore.getState().acceptBid(bids[0].id, 'ecocash', true);
      } catch (err: any) {
        useMushongaStore.getState().addNotification({
          targetRole: 'patient',
          title: 'EcoCash USSD Timeout',
          body: 'EcoCash network did not receive PIN in 45s. Tap to retry.',
          screen: 'LiveBids',
          type: 'order'
        });
      }
    }
  };

  return (
    <aside aria-label="Demo controls" className="fixed bottom-2 left-1/2 transform -translate-x-1/2 z-40 w-[96%] max-w-4xl select-none">
      <div className={`rounded-2xl border shadow-2xl backdrop-blur-xl overflow-hidden transition-colors ${
        isDark
          ? 'bg-stone-900/95 border-stone-700/80 text-stone-100'
          : 'bg-white/95 border-stone-300 text-stone-900 shadow-xl'
      }`}>
        {/* Story Caption Bar (when story is running or caption active) */}
        {storyCaption && (
          <div className="bg-[#D9673A] text-white px-4 py-1.5 text-xs font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>{storyCaption}</span>
            </div>
            {isStoryActive && (
              <span className="text-[10px] uppercase tracking-wider font-mono-jb opacity-90">
                Story Closer Running
              </span>
            )}
          </div>
        )}

        {/* Compact Bar (Always Visible) */}
        <div className="px-3 py-2 flex items-center justify-between gap-2">
          {/* Play Full Story Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (isStoryActive) {
                  storyPlayer.stop();
                } else {
                  storyPlayer.play();
                }
              }}
              className={`px-3.5 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all ${
                isStoryActive
                  ? 'bg-[#C8432F] text-white'
                  : 'bg-[#D9673A] text-white hover:bg-[#c25930]'
              }`}
            >
              {isStoryActive ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>▶ Play Full Story (60s)</span>
                </>
              )}
            </button>

            <button
              onClick={resetAllData}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 border transition-colors ${
                isDark
                  ? 'bg-stone-800 border-stone-700 text-stone-300 hover:text-white'
                  : 'bg-stone-100 border-stone-200 text-stone-700 hover:text-stone-900'
              }`}
              title="Reset data"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>

          {/* Quick Triggers preview on bar */}
          <div className="hidden md:flex items-center gap-1 text-xs">
            <button
              onClick={handleTriggerBooking}
              className="px-2 py-1 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 text-[11px] font-semibold text-[#2B4C7E] flex items-center gap-1"
            >
              <CalendarPlus className="w-3 h-3" /> Book
            </button>
            <button
              onClick={handleTriggerIssueRx}
              className="px-2 py-1 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 text-[11px] font-semibold text-[#1F8A5B] flex items-center gap-1"
            >
              <FilePlus className="w-3 h-3" /> Issue Rx
            </button>
            <button
              onClick={handleTriggerFloatRx}
              className="px-2 py-1 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 text-[11px] font-semibold text-[#D9673A] flex items-center gap-1"
            >
              <Send className="w-3 h-3" /> Float
            </button>
            <button
              onClick={handleTriggerSpawnBid}
              className="px-2 py-1 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 text-[11px] font-semibold text-[#D99A1E] flex items-center gap-1"
            >
              <Flame className="w-3 h-3" /> Bid
            </button>
            <button
              onClick={handleTriggerMarkReady}
              className="px-2 py-1 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 text-[11px] font-semibold text-[#1F8A5B] flex items-center gap-1"
            >
              <CheckCircle className="w-3 h-3" /> Ready
            </button>
            <button
              onClick={handleTriggerCollectionScan}
              className="px-2 py-1 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 text-[11px] font-semibold text-[#B8862F] flex items-center gap-1"
            >
              <QrCode className="w-3 h-3" /> Scan
            </button>
          </div>

          {/* Expand / Collapse Control */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowRulesSheet(!showRulesSheet)}
              className={`px-2 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 border ${
                isDark
                  ? 'bg-stone-800 border-stone-700 text-stone-300'
                  : 'bg-stone-100 border-stone-200 text-stone-700'
              }`}
            >
              <Sliders className="w-3 h-3 text-[#D9673A]" />
              <span className="hidden sm:inline">Rules</span>
            </button>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`p-1.5 rounded-lg border flex items-center gap-1 text-[11px] font-bold ${
                isDark
                  ? 'bg-stone-800 border-stone-700 text-stone-300'
                  : 'bg-stone-100 border-stone-200 text-stone-700'
              }`}
            >
              <span>{isExpanded ? 'Less' : 'More Triggers'}</span>
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Business Rules Drawer */}
        {showRulesSheet && (
          <div className={`p-3 border-t text-xs grid grid-cols-2 md:grid-cols-4 gap-3 animate-in fade-in ${
            isDark ? 'bg-stone-950/90 border-stone-800' : 'bg-stone-50 border-stone-200'
          }`}>
            <div>
              <span className="text-[10px] text-stone-400 block font-semibold">Bid Binding Once Accepted</span>
              <button
                onClick={() => updateRules({ bidBinding: !rules.bidBinding })}
                className={`mt-1 px-2.5 py-1 rounded text-[11px] font-bold ${
                  rules.bidBinding ? 'bg-[#1F8A5B] text-white' : 'bg-stone-300 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                }`}
              >
                {rules.bidBinding ? 'Binding (ON)' : 'Flexible (OFF)'}
              </button>
            </div>

            <div>
              <span className="text-[10px] text-stone-400 block font-semibold">Tender Window</span>
              <div className="mt-1 flex items-center gap-1 font-mono-jb">
                {[60, 300, 900].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => updateRules({ bidWindowSeconds: sec })}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      rules.bidWindowSeconds === sec
                        ? 'bg-[#D9673A] text-white'
                        : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    {sec === 60 ? '60s' : sec === 300 ? '5m' : '15m'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] text-stone-400 block font-semibold">Max Bids / Pharmacy</span>
              <div className="mt-1 flex items-center gap-1 font-mono-jb">
                {[1, 2, 3].map((num) => (
                  <button
                    key={num}
                    onClick={() => updateRules({ maxBidsPerPharmacy: num })}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      rules.maxBidsPerPharmacy === num
                        ? 'bg-[#0F3B34] text-white'
                        : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] text-stone-400 block font-semibold">Default Radius</span>
              <div className="mt-1 flex items-center gap-1 font-mono-jb">
                {[5, 10, 25].map((km) => (
                  <button
                    key={km}
                    onClick={() => updateRules({ bidRadiusKm: km })}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      rules.bidRadiusKm === km
                        ? 'bg-[#0F3B34] text-white'
                        : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    {km}km
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Expanded All Triggers Panel */}
        {isExpanded && (
          <div className={`p-3 border-t flex items-center gap-2 flex-wrap text-xs ${
            isDark ? 'bg-stone-900 border-stone-800' : 'bg-stone-50 border-stone-200'
          }`}>
            <button
              onClick={handleTriggerBooking}
              className="px-2.5 py-1.5 rounded-lg bg-[#2B4C7E] text-white font-bold flex items-center gap-1"
            >
              <CalendarPlus className="w-3.5 h-3.5" /> Book Slot
            </button>
            <button
              onClick={handleTriggerIssueRx}
              className="px-2.5 py-1.5 rounded-lg bg-[#0F3B34] text-white font-bold flex items-center gap-1"
            >
              <FilePlus className="w-3.5 h-3.5 text-[#D9673A]" /> Issue Verified Rx
            </button>
            <button
              onClick={handleTriggerFloatRx}
              className="px-2.5 py-1.5 rounded-lg bg-[#D9673A] text-white font-bold flex items-center gap-1"
            >
              <Send className="w-3.5 h-3.5" /> Float Prescription
            </button>
            <button
              onClick={handleTriggerSpawnBid}
              className="px-2.5 py-1.5 rounded-lg bg-[#B8862F] text-white font-bold flex items-center gap-1"
            >
              <Flame className="w-3.5 h-3.5" /> Spawn Live Bid
            </button>
            <button
              onClick={handleTriggerMarkReady}
              className="px-2.5 py-1.5 rounded-lg bg-[#1F8A5B] text-white font-bold flex items-center gap-1"
            >
              <CheckCircle className="w-3.5 h-3.5" /> Mark Ready
            </button>
            <button
              onClick={handleTriggerCollectionScan}
              className="px-2.5 py-1.5 rounded-lg bg-stone-800 text-white font-bold flex items-center gap-1"
            >
              <QrCode className="w-3.5 h-3.5 text-[#D9673A]" /> Scan & Handover
            </button>
            <button
              onClick={handleTriggerPaymentFail}
              className="px-2.5 py-1.5 rounded-lg border border-[#C8432F]/50 text-[#C8432F] font-bold flex items-center gap-1"
            >
              <AlertTriangle className="w-3.5 h-3.5" /> EcoCash Timeout
            </button>
            <button
              onClick={() => setIsOffline(!isOffline)}
              className={`px-2.5 py-1.5 rounded-lg font-bold flex items-center gap-1 ${
                isOffline ? 'bg-[#C8432F] text-white' : 'bg-stone-300 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
              }`}
            >
              <WifiOff className="w-3.5 h-3.5" /> {isOffline ? 'Offline' : 'Online'}
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
