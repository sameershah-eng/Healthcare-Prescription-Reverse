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
  const [isExpanded, setIsExpanded] = useState(true);
  const storyStep = useMushongaStore((s) => s.storyStep);
  const storyCaption = useMushongaStore((s) => s.storyCaption);
  const isOffline = useMushongaStore((s) => s.isOffline);
  const setIsOffline = useMushongaStore((s) => s.setIsOffline);
  const resetAllData = useMushongaStore((s) => s.resetAllData);
  const rules = useMushongaStore((s) => s.rules);
  const updateRules = useMushongaStore((s) => s.updateRules);
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
    <div className="fixed bottom-3 left-1/2 transform -translate-x-1/2 z-40 w-[95%] max-w-4xl select-none">
      <div className="rounded-2xl bg-stone-900/95 border border-stone-700/80 shadow-2xl backdrop-blur-xl text-stone-100 overflow-hidden">
        {/* Story Caption Bar (when story is running or idle) */}
        {storyCaption && (
          <div className="bg-[#D9673A] text-white px-4 py-1.5 text-xs font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>{storyCaption}</span>
            </div>
            {isStoryActive && (
              <span className="text-[10px] uppercase tracking-wider font-mono-jb opacity-90">
                Playing pitch closer
              </span>
            )}
          </div>
        )}

        {/* Top Header of Dock */}
        <div className="px-4 py-2 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1F8A5B] animate-pulse" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-300">
              Demo Control Dock
            </h2>
            <span className="text-[10px] text-stone-400 font-mono-jb hidden sm:inline">
              · Live pitch engine & story runner
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Rules Button */}
            <button
              onClick={() => setShowRulesSheet(!showRulesSheet)}
              className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Sliders className="w-3.5 h-3.5 text-[#D9673A]" />
              <span className="hidden sm:inline">Business Rules</span>
            </button>

            {/* Toggle Dock minimize */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white"
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Configurable Business Rules Panel (when opened) */}
        {showRulesSheet && (
          <div className="p-3 bg-stone-950/90 border-b border-stone-800 text-xs grid grid-cols-2 md:grid-cols-4 gap-3 animate-in fade-in">
            <div>
              <span className="text-[10px] text-stone-400 block">Bid Binding Once Accepted</span>
              <button
                onClick={() => updateRules({ bidBinding: !rules.bidBinding })}
                className={`mt-1 px-2.5 py-1 rounded text-[11px] font-bold ${
                  rules.bidBinding ? 'bg-[#1F8A5B] text-white' : 'bg-stone-800 text-stone-400'
                }`}
              >
                {rules.bidBinding ? 'Enabled (Binding)' : 'Flexible'}
              </button>
            </div>

            <div>
              <span className="text-[10px] text-stone-400 block">Tender Window</span>
              <div className="mt-1 flex items-center gap-1 font-mono-jb">
                {[60, 300, 900].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => updateRules({ bidWindowSeconds: sec })}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      rules.bidWindowSeconds === sec ? 'bg-[#D9673A] text-white' : 'bg-stone-800 text-stone-300'
                    }`}
                  >
                    {sec === 60 ? '60s' : sec === 300 ? '5m' : '15m'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] text-stone-400 block">Max Bids / Pharmacy</span>
              <div className="mt-1 flex items-center gap-1 font-mono-jb">
                {[1, 2, 3].map((num) => (
                  <button
                    key={num}
                    onClick={() => updateRules({ maxBidsPerPharmacy: num })}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      rules.maxBidsPerPharmacy === num ? 'bg-[#0F3B34] text-white' : 'bg-stone-800 text-stone-300'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] text-stone-400 block">Default Radius</span>
              <div className="mt-1 flex items-center gap-1 font-mono-jb">
                {[5, 10, 25].map((km) => (
                  <button
                    key={km}
                    onClick={() => updateRules({ bidRadiusKm: km })}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      rules.bidRadiusKm === km ? 'bg-[#0F3B34] text-white' : 'bg-stone-800 text-stone-300'
                    }`}
                  >
                    {km}km
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Dock Controls Body */}
        {isExpanded && (
          <div className="p-3 flex items-center justify-between gap-3 flex-wrap">
            {/* Primary Story Closer Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (isStoryActive) {
                    storyPlayer.stop();
                  } else {
                    storyPlayer.play();
                  }
                }}
                className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 shadow-lg transition-all active:scale-95 ${
                  isStoryActive
                    ? 'bg-[#C8432F] text-white hover:bg-[#ad3523]'
                    : 'bg-[#D9673A] text-white hover:bg-[#c25930] ring-2 ring-[#D9673A]/40'
                }`}
              >
                {isStoryActive ? (
                  <>
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>Stop Story</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>▶ Play Full Story (60s Pitch)</span>
                  </>
                )}
              </button>

              <button
                onClick={resetAllData}
                className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Reset back to initial seed data"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Reset</span>
              </button>
            </div>

            {/* Individual Quick Trigger Buttons */}
            <div className="flex items-center gap-1.5 flex-wrap text-xs">
              <button
                onClick={handleTriggerBooking}
                className="px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium flex items-center gap-1 transition-colors"
                title="Book an appointment slot for Dr. Chikwanha"
              >
                <CalendarPlus className="w-3.5 h-3.5 text-[#2B4C7E]" />
                <span className="hidden sm:inline">Book Slot</span>
              </button>

              <button
                onClick={handleTriggerIssueRx}
                className="px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium flex items-center gap-1 transition-colors"
                title="Doctor issues verified Rx"
              >
                <FilePlus className="w-3.5 h-3.5 text-[#1F8A5B]" />
                <span className="hidden sm:inline">Issue Rx</span>
              </button>

              <button
                onClick={handleTriggerFloatRx}
                className="px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium flex items-center gap-1 transition-colors"
                title="Float prescription to pharmacies"
              >
                <Send className="w-3.5 h-3.5 text-[#D9673A]" />
                <span className="hidden sm:inline">Float Rx</span>
              </button>

              <button
                onClick={handleTriggerSpawnBid}
                className="px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium flex items-center gap-1 transition-colors"
                title="Spawn live pharmacy bid"
              >
                <Flame className="w-3.5 h-3.5 text-[#D99A1E]" />
                <span className="hidden sm:inline">Spawn Bid</span>
              </button>

              <button
                onClick={handleTriggerMarkReady}
                className="px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium flex items-center gap-1 transition-colors"
                title="Mark order ready for collection"
              >
                <CheckCircle className="w-3.5 h-3.5 text-[#1F8A5B]" />
                <span className="hidden sm:inline">Mark Ready</span>
              </button>

              <button
                onClick={handleTriggerCollectionScan}
                className="px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium flex items-center gap-1 transition-colors"
                title="Simulate counter QR scan and collection"
              >
                <QrCode className="w-3.5 h-3.5 text-[#B8862F]" />
                <span className="hidden sm:inline">Scan QR</span>
              </button>

              {/* Edge Case: Payment Failure simulation */}
              <button
                onClick={handleTriggerPaymentFail}
                className="px-2 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-[#C8432F] text-[11px] font-bold flex items-center gap-1 transition-colors"
                title="Simulate EcoCash timeout"
              >
                <AlertTriangle className="w-3 h-3" />
                <span className="hidden lg:inline">Fail USSD</span>
              </button>

              {/* Offline mode toggle */}
              <button
                onClick={() => setIsOffline(!isOffline)}
                className={`px-2 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors ${
                  isOffline
                    ? 'bg-[#C8432F] text-white'
                    : 'bg-stone-800 hover:bg-stone-700 text-stone-400'
                }`}
                title="Toggle offline state simulation"
              >
                <WifiOff className="w-3 h-3" />
                <span>{isOffline ? 'Offline' : 'Online'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
