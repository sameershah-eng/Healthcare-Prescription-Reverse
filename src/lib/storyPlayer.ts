import { useMushongaStore } from '../store/useMushongaStore';
import confetti from 'canvas-confetti';

let storyTimeout: any = null;

export const storyPlayer = {
  isRunning: false,

  stop() {
    this.isRunning = false;
    if (storyTimeout) clearTimeout(storyTimeout);
    useMushongaStore.getState().setStoryStep(-1, null);
    useMushongaStore.getState().setTouchRipple(null);
  },

  async play() {
    if (this.isRunning) {
      this.stop();
      return;
    }

    this.isRunning = true;
    const store = useMushongaStore.getState();

    // Reset data first for clean pitch run
    store.resetAllData();
    await new Promise((r) => setTimeout(r, 600));

    // Helper step runner
    const step = async (
      stepNum: number,
      caption: string,
      ripple: { role: 'patient' | 'doctor' | 'pharmacy'; x: number; y: number } | null,
      action: () => Promise<void> | void,
      delayMs: number
    ) => {
      if (!this.isRunning) return;
      useMushongaStore.getState().setStoryStep(stepNum, caption);
      if (ripple) {
        useMushongaStore.getState().setTouchRipple(ripple);
        setTimeout(() => {
          if (useMushongaStore.getState().touchRipple === ripple) {
            useMushongaStore.getState().setTouchRipple(null);
          }
        }, 800);
      }
      await action();
      await new Promise((r) => {
        storyTimeout = setTimeout(r, delayMs);
      });
    };

    try {
      // Step 1: Patient browses Dr. Chikwanha and books a slot
      await step(
        1,
        'Step 1/9 · Patient books Dr. Rumbidzai Chikwanha in Belgravia',
        { role: 'patient', x: 180, y: 340 },
        async () => {
          // Find first available slot for Dr. Chikwanha
          const state = useMushongaStore.getState();
          const freeSlot = state.slots.find(
            (s) => s.doctorId === 'doc-chikwanha' && !s.isBooked
          );
          if (freeSlot) {
            state.bookSlot(freeSlot.id, 'doc-chikwanha', 'Tendai Moyo', 35);
          }
        },
        5000
      );

      // Step 2: Slot turns Booked instantly on Doctor's phone with live push
      await step(
        2,
        'Step 2/9 · Doctor calendar updates live: slot booked + push banner',
        { role: 'doctor', x: 280, y: 190 },
        async () => {
          // Already synchronized via Zustand & systemEvents
        },
        4500
      );

      // Step 3: Doctor issues digital prescription with cryptographic seal
      let createdRxId = '';
      await step(
        3,
        'Step 3/9 · Doctor issues digital Rx with verified tamper-proof seal',
        { role: 'doctor', x: 180, y: 650 },
        async () => {
          const state = useMushongaStore.getState();
          const rx = state.issuePrescription({
            doctorId: 'doc-chikwanha',
            doctorName: 'Dr. Rumbidzai Chikwanha',
            doctorSpecialty: 'Specialist Physician',
            doctorRegNumber: 'MCZ-MD-44819',
            patientId: 'patient-tendai',
            patientName: 'Tendai Moyo',
            items: [
              { id: 'm-1', name: 'Amoxicillin & Clavulanate', strength: '625mg', dosage: '1 tab bd with meals', quantity: '14 tabs' },
              { id: 'm-2', name: 'Paracetamol', strength: '500mg', dosage: '2 tabs qds prn for pain', quantity: '20 tabs' }
            ],
            diagnosis: 'Acute bacterial sinusitis with facial pressure',
            notes: 'Verified electronic prescription signed by Dr. Chikwanha'
          });
          createdRxId = rx.id;
        },
        5000
      );

      // Step 4: Rx appears verified on Patient phone; Patient floats to nearby pharmacies
      let floatId = '';
      await step(
        4,
        'Step 4/9 · Patient floats verified Rx to pharmacies within 10km radius',
        { role: 'patient', x: 180, y: 580 },
        async () => {
          const state = useMushongaStore.getState();
          const rx = state.prescriptions.find((r) => r.id === createdRxId) || state.prescriptions[0];
          const flt = state.floatPrescription(rx.id, 10, 'Tendai Moyo');
          floatId = flt.id;
        },
        5500
      );

      // Step 5: Pharmacies submit live bids in reverse auction; prices drop
      await step(
        5,
        'Step 5/9 · 4 pharmacies compete in live reverse auction; Msasa drops price',
        { role: 'pharmacy', x: 180, y: 320 },
        async () => {
          const state = useMushongaStore.getState();
          state.submitBid(floatId, 'pharma-granite-borrowdale', 16.50, 15, true, 'Borrowdale Village walk stock ready');
          setTimeout(() => {
            if (this.isRunning) {
              state.submitBid(floatId, 'pharma-kopje-belgravia', 13.90, 30, true, 'Belgravia dispensary verified');
            }
          }, 1200);
          setTimeout(() => {
            if (this.isRunning) {
              state.submitBid(floatId, 'pharma-msasa-avondale', 14.20, 20, true, 'Avondale central store, sealed batch');
            }
          }, 2400);
          setTimeout(() => {
            if (this.isRunning) {
              const msasa = useMushongaStore.getState().bids.find((b) => b.pharmacyId === 'pharma-msasa-avondale');
              if (msasa) {
                useMushongaStore.getState().reviseBid(msasa.id, 11.50); // Becomes lowest!
              }
            }
          }, 4000);
        },
        6500
      );

      // Step 6: Patient accepts lowest bid ($11.50) and pays via EcoCash
      let acceptedOrderId = '';
      await step(
        6,
        'Step 6/9 · Patient accepts lowest bid (US$11.50) & pays via EcoCash',
        { role: 'patient', x: 290, y: 440 },
        async () => {
          const state = useMushongaStore.getState();
          const lowest = state.bids.filter((b) => b.floatId === floatId).sort((a, b) => a.priceUSD - b.priceUSD)[0];
          if (lowest) {
            const ord = await state.acceptBid(lowest.id, 'ecocash');
            acceptedOrderId = ord.id;
          }
        },
        5500
      );

      // Step 7: Winning pharmacy receives "You won the tender" push; marks order Ready
      await step(
        7,
        'Step 7/9 · Winning pharmacy dispenses medication and marks Ready for pickup',
        { role: 'pharmacy', x: 180, y: 420 },
        async () => {
          const state = useMushongaStore.getState();
          const ord = state.orders.find((o) => o.id === acceptedOrderId) || state.orders[0];
          if (ord) {
            state.markOrderReady(ord.id);
          }
        },
        5000
      );

      // Step 8: Patient arrives at counter with 6-digit pickup code & QR pass
      await step(
        8,
        'Step 8/9 · Patient receives Ready push & opens Collection Pass with QR code',
        { role: 'patient', x: 180, y: 480 },
        async () => {
          // Collection pass is rendered on Patient phone
        },
        4500
      );

      // Step 9: Pharmacy scans QR code; marked Collected across all 3 apps!
      await step(
        9,
        'Step 9/9 · Pharmacist scans QR pass · Handover confirmed across all 3 apps!',
        { role: 'pharmacy', x: 180, y: 520 },
        async () => {
          const state = useMushongaStore.getState();
          const ord = state.orders.find((o) => o.id === acceptedOrderId) || state.orders[0];
          if (ord) {
            state.collectOrder(ord.id, ord.pickupCode);
            try {
              confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 }
              });
            } catch (e) {
              // ignore
            }
          }
        },
        5000
      );

      useMushongaStore.getState().setStoryStep(10, 'Story Complete! Full ecosystem loop demonstrated.');
      setTimeout(() => {
        if (useMushongaStore.getState().storyStep === 10) {
          useMushongaStore.getState().setStoryStep(-1, null);
        }
        this.isRunning = false;
      }, 4000);
    } catch (err) {
      console.error('Story player error:', err);
      this.stop();
    }
  }
};
