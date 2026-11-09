import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  Doctor, 
  Pharmacy, 
  Prescription, 
  Appointment, 
  Slot, 
  FloatRx, 
  Bid, 
  Order, 
  PushNotification, 
  SystemEvent, 
  ConfigurableRules, 
  Role, 
  Language, 
  Currency, 
  ThemeMode,
  PaymentMethod
} from '../types';
import { 
  SEED_DOCTORS, 
  SEED_PHARMACIES, 
  INITIAL_SLOTS, 
  INITIAL_PRESCRIPTIONS, 
  INITIAL_APPOINTMENTS 
} from '../data/seed';

export interface MushongaState {
  // Global App State
  language: Language;
  currency: Currency;
  themeMode: ThemeMode;
  isOffline: boolean;
  viewMode: 'ecosystem' | 'single';
  activeSingleRole: Role;
  touchRipple: { role: Role; x: number; y: number } | null;
  activeParticle: { id: string; from: Role; to: Role[]; summary: string } | null;
  storyStep: number; // -1 if idle, 0..8 if playing
  storyCaption: string | null;

  // Data Collections
  doctors: Doctor[];
  slots: Slot[];
  appointments: Appointment[];
  prescriptions: Prescription[];
  pharmacies: Pharmacy[];
  floats: FloatRx[];
  bids: Bid[];
  orders: Order[];
  notifications: PushNotification[];
  systemEvents: SystemEvent[];

  // Configurable Business Rules
  rules: ConfigurableRules;

  // Rejection history (private to pharmacy)
  rejectedRxIdsByPharmacy: Record<string, string[]>; // pharmacyId -> rxId[]

  // Actions
  setLanguage: (lang: Language) => void;
  setCurrency: (curr: Currency) => void;
  setThemeMode: (mode: ThemeMode) => void;
  setIsOffline: (val: boolean) => void;
  setViewMode: (mode: 'ecosystem' | 'single') => void;
  setActiveSingleRole: (role: Role) => void;
  setTouchRipple: (val: { role: Role; x: number; y: number } | null) => void;
  setActiveParticle: (val: { id: string; from: Role; to: Role[]; summary: string } | null) => void;
  setStoryStep: (step: number, caption?: string | null) => void;
  updateRules: (partial: Partial<ConfigurableRules>) => void;

  // App Actions
  bookSlot: (slotId: string, doctorId: string, patientName: string, feeUSD: number) => Appointment;
  cancelAppointment: (appointmentId: string) => void;
  issuePrescription: (data: Omit<Prescription, 'id' | 'rxNumber' | 'dateIssued' | 'status' | 'isDoctorVerified'>) => Prescription;
  floatPrescription: (rxId: string, radiusKm: number, patientName: string) => FloatRx;
  submitBid: (floatId: string, pharmacyId: string, priceUSD: number, readyMinutes: number, inStock: boolean, note?: string) => Bid;
  reviseBid: (bidId: string, newPriceUSD: number) => void;
  acceptBid: (bidId: string, paymentMethod: PaymentMethod, simulateFail?: boolean) => Promise<Order>;
  markOrderReady: (orderId: string) => void;
  collectOrder: (orderId: string, pickupCode?: string) => boolean;
  rejectRxPrivately: (pharmacyId: string, rxId: string, reason: string) => void;
  addNotification: (notif: Omit<PushNotification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  triggerSystemEvent: (event: Omit<SystemEvent, 'id' | 'timestamp'>) => void;
  resetAllData: () => void;
}

const memoryStore = new Map<string, string>();

const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch (e) {
      // sandbox restricted
    }
    return memoryStore.get(key) || null;
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch (e) {
      // sandbox restricted
    }
    memoryStore.set(key, value);
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (e) {
      // sandbox restricted
    }
    memoryStore.delete(key);
  }
};

export const useMushongaStore = create<MushongaState>()(
  persist(
    (set, get) => ({
      language: 'en',
      currency: 'USD',
      themeMode: 'light',
      isOffline: false,
      viewMode: 'ecosystem',
      activeSingleRole: 'patient',
      touchRipple: null,
      activeParticle: null,
      storyStep: -1,
      storyCaption: null,

      doctors: SEED_DOCTORS,
      slots: INITIAL_SLOTS,
      appointments: INITIAL_APPOINTMENTS,
      prescriptions: INITIAL_PRESCRIPTIONS,
      pharmacies: SEED_PHARMACIES,
      floats: [],
      bids: [],
      orders: [],
      notifications: [],
      systemEvents: [],
      rejectedRxIdsByPharmacy: {},

      rules: {
        bidBinding: true,
        bidWindowSeconds: 60, // accelerated 60s for live pitch
        maxBidsPerPharmacy: 2,
        bidRadiusKm: 10,
        autoCancelHours: 48
      },

      setLanguage: (language) => set({ language }),
      setCurrency: (currency) => set({ currency }),
      setThemeMode: (themeMode) => set({ themeMode }),
      setIsOffline: (isOffline) => set({ isOffline }),
      setViewMode: (viewMode) => set({ viewMode }),
      setActiveSingleRole: (activeSingleRole) => set({ activeSingleRole }),
      setTouchRipple: (touchRipple) => set({ touchRipple }),
      setActiveParticle: (activeParticle) => set({ activeParticle }),
      setStoryStep: (storyStep, storyCaption = null) => set({ storyStep, storyCaption }),
      updateRules: (partial) => set((s) => ({ rules: { ...s.rules, ...partial } })),

      bookSlot: (slotId, doctorId, patientName, feeUSD) => {
        const doc = get().doctors.find((d) => d.id === doctorId);
        const slot = get().slots.find((s) => s.id === slotId);
        const dateStr = slot ? slot.dateStr : '2026-11-14';
        const timeStr = slot ? slot.timeStr : '10:00';

        const newAppointment: Appointment = {
          id: `apt-${Date.now()}`,
          doctorId,
          doctorName: doc?.name || 'Dr. Rumbidzai Chikwanha',
          doctorSpecialty: doc?.specialty || 'Physician',
          doctorSuburb: doc?.suburb || 'Belgravia',
          doctorAvatarUrl: doc?.avatarUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
          patientId: 'patient-tendai',
          patientName,
          patientPhone: '+263 77 234 5678',
          dateStr,
          timeStr,
          feeUSD,
          status: 'upcoming',
          createdAt: Date.now()
        };

        set((state) => ({
          slots: state.slots.map((s) =>
            s.id === slotId ? { ...s, isBooked: true, bookedByPatientId: 'patient-tendai', bookedPatientName: patientName } : s
          ),
          appointments: [newAppointment, ...state.appointments]
        }));

        // Event & Notification to Doctor
        get().triggerSystemEvent({
          type: 'slot.booked',
          sourceRole: 'patient',
          targetRoles: ['doctor'],
          summary: `New booking: ${patientName} at ${timeStr}`,
          payload: { appointmentId: newAppointment.id, slotId }
        });

        get().addNotification({
          targetRole: 'doctor',
          title: 'New Clinic Booking',
          body: `${patientName} booked ${timeStr} today for ${doc?.specialty || 'Consultation'}.`,
          screen: 'Calendar',
          type: 'booking'
        });

        return newAppointment;
      },

      cancelAppointment: (appointmentId) => {
        set((state) => ({
          appointments: state.appointments.map((a) =>
            a.id === appointmentId ? { ...a, status: 'cancelled' } : a
          )
        }));
      },

      issuePrescription: (data) => {
        const id = `rx-${Date.now()}`;
        const rxNumber = `MSH-RX-${Math.floor(10000 + Math.random() * 90000)}`;
        const newRx: Prescription = {
          ...data,
          id,
          rxNumber,
          dateIssued: '14 Nov 2026',
          status: 'issued',
          isDoctorVerified: true
        };

        set((state) => ({
          prescriptions: [newRx, ...state.prescriptions]
        }));

        get().triggerSystemEvent({
          type: 'rx.issued',
          sourceRole: 'doctor',
          targetRoles: ['patient'],
          summary: `Rx ${rxNumber} issued with Doctor-Verified seal`,
          payload: { rxId: id }
        });

        get().addNotification({
          targetRole: 'patient',
          title: 'Prescription Issued',
          body: `${newRx.doctorName} issued ${rxNumber} with cryptographic seal. Ready to float.`,
          screen: 'FloatRx',
          type: 'rx'
        });

        return newRx;
      },

      floatPrescription: (rxId, radiusKm, patientName) => {
        const floatId = `flt-${Date.now()}`;
        const newFloat: FloatRx = {
          id: floatId,
          prescriptionId: rxId,
          patientId: 'patient-tendai',
          patientName,
          patientPhone: '+263 77 234 5678',
          suburb: 'Avondale',
          radiusKm,
          createdAt: Date.now(),
          expiresAt: Date.now() + (get().rules.bidWindowSeconds * 1000),
          status: 'bidding',
          bidsCount: 0
        };

        set((state) => ({
          prescriptions: state.prescriptions.map((rx) =>
            rx.id === rxId ? { ...rx, status: 'floated' } : rx
          ),
          floats: [newFloat, ...state.floats]
        }));

        get().triggerSystemEvent({
          type: 'rx.floated',
          sourceRole: 'patient',
          targetRoles: ['pharmacy'],
          summary: `Tender open: ${patientName} floated Rx (${radiusKm}km radius)`,
          payload: { floatId, rxId }
        });

        get().addNotification({
          targetRole: 'pharmacy',
          title: 'New Floated Prescription',
          body: `Live tender from Avondale (${radiusKm}km). Submit your bid now.`,
          screen: 'LiveRx',
          type: 'bid'
        });

        return newFloat;
      },

      submitBid: (floatId, pharmacyId, priceUSD, readyMinutes, inStock, note) => {
        const pharmacy = get().pharmacies.find((p) => p.id === pharmacyId);
        const bidId = `bid-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const newBid: Bid = {
          id: bidId,
          floatId,
          pharmacyId,
          pharmacyName: pharmacy?.name || 'Local Pharmacy',
          pharmacySuburb: pharmacy?.suburb || 'Avondale',
          pharmacyDistanceKm: pharmacy?.distanceKm || 1.8,
          priceUSD,
          readyInMinutes: readyMinutes,
          inStock,
          note: note || 'All items fresh batch. Dispensed with seal.',
          createdAt: Date.now(),
          status: 'pending'
        };

        const existingBids = get().bids.filter((b) => b.floatId === floatId);
        const allBids = [...existingBids, newBid].sort((a, b) => a.priceUSD - b.priceUSD);
        const rankedBids = allBids.map((b, idx) => ({ ...b, rank: idx + 1 }));

        const otherBids = get().bids.filter((b) => b.floatId !== floatId);

        set((state) => ({
          bids: [...otherBids, ...rankedBids],
          floats: state.floats.map((f) =>
            f.id === floatId ? { ...f, bidsCount: rankedBids.length, lowestBidUSD: rankedBids[0]?.priceUSD } : f
          )
        }));

        get().triggerSystemEvent({
          type: 'bid.placed',
          sourceRole: 'pharmacy',
          targetRoles: ['patient'],
          summary: `Bid US$${priceUSD.toFixed(2)} from ${newBid.pharmacyName}`,
          payload: { bidId, floatId, priceUSD }
        });

        get().addNotification({
          targetRole: 'patient',
          title: 'New Bid Received',
          body: `${newBid.pharmacyName} offered US$${priceUSD.toFixed(2)} (${readyMinutes}m pickup).`,
          screen: 'LiveBids',
          type: 'bid'
        });

        return newBid;
      },

      reviseBid: (bidId, newPriceUSD) => {
        const targetBid = get().bids.find((b) => b.id === bidId);
        if (!targetBid) return;

        const floatId = targetBid.floatId;
        const otherBids = get().bids.filter((b) => b.id !== bidId && b.floatId === floatId);

        const updatedTarget: Bid = {
          ...targetBid,
          originalPriceUSD: targetBid.originalPriceUSD || targetBid.priceUSD,
          priceUSD: newPriceUSD,
          isRevised: true
        };

        const sorted = [...otherBids, updatedTarget].sort((a, b) => a.priceUSD - b.priceUSD);
        const ranked = sorted.map((b, idx) => ({ ...b, rank: idx + 1 }));
        const unperturbed = get().bids.filter((b) => b.floatId !== floatId);

        set((state) => ({
          bids: [...unperturbed, ...ranked],
          floats: state.floats.map((f) =>
            f.id === floatId ? { ...f, lowestBidUSD: ranked[0]?.priceUSD } : f
          )
        }));

        get().triggerSystemEvent({
          type: 'bid.revised',
          sourceRole: 'pharmacy',
          targetRoles: ['patient'],
          summary: `Price drop: ${updatedTarget.pharmacyName} reduced to US$${newPriceUSD.toFixed(2)}`,
          payload: { bidId, newPriceUSD }
        });
      },

      acceptBid: async (bidId, paymentMethod, simulateFail = false) => {
        if (simulateFail) {
          throw new Error('EcoCash USSD timeout: Network did not receive PIN in 45s. Please retry.');
        }

        const bid = get().bids.find((b) => b.id === bidId);
        if (!bid) throw new Error('Bid not found');

        const float = get().floats.find((f) => f.id === bid.floatId);
        const rx = get().prescriptions.find((r) => r.id === float?.prescriptionId);
        const pharmacy = get().pharmacies.find((p) => p.id === bid.pharmacyId);

        const orderId = `ord-${Date.now()}`;
        const orderNumber = `MSH-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
        const pickupCode = `${Math.floor(100000 + Math.random() * 900000)}`;

        const newOrder: Order = {
          id: orderId,
          orderNumber,
          floatId: bid.floatId,
          prescriptionId: float ? float.prescriptionId : 'rx-1',
          patientId: 'patient-tendai',
          patientName: 'Tendai Moyo',
          patientPhone: '+263 77 234 5678',
          pharmacyId: bid.pharmacyId,
          pharmacyName: bid.pharmacyName,
          pharmacyAddress: pharmacy?.address || 'Avondale Shopping Centre, Harare',
          pharmacySuburb: bid.pharmacySuburb,
          pharmacyPhone: pharmacy?.phone || '+263 77 123 4567',
          items: rx?.items || [{ id: '1', name: 'Medication Pack', strength: 'Standard', dosage: 'As directed', quantity: '1 pack' }],
          totalUSD: bid.priceUSD,
          paymentMethod,
          paymentStatus: paymentMethod === 'cash' ? 'pending_cash' : 'paid',
          paymentRef: paymentMethod === 'cash' ? 'CASH-PENDING' : `MSH-PAY-${Math.floor(10000 + Math.random() * 90000)}`,
          status: 'accepted',
          pickupCode,
          createdAt: Date.now()
        };

        set((state) => ({
          bids: state.bids.map((b) =>
            b.floatId === bid.floatId
              ? b.id === bidId ? { ...b, status: 'accepted' } : { ...b, status: 'rejected' }
              : b
          ),
          floats: state.floats.map((f) =>
            f.id === bid.floatId ? { ...f, status: 'accepted' } : f
          ),
          prescriptions: state.prescriptions.map((r) =>
            r.id === float?.prescriptionId ? { ...r, status: 'ordered' } : r
          ),
          orders: [newOrder, ...state.orders]
        }));

        // Event for payment captured & order placed
        get().triggerSystemEvent({
          type: 'bid.accepted',
          sourceRole: 'patient',
          targetRoles: ['pharmacy'],
          summary: `Tender won by ${bid.pharmacyName} (US$${bid.priceUSD.toFixed(2)})`,
          payload: { orderId, bidId }
        });

        get().addNotification({
          targetRole: 'pharmacy',
          title: 'You Won the Tender! 🎉',
          body: `Patient accepted US$${bid.priceUSD.toFixed(2)} (${paymentMethod === 'cash' ? 'Cash on pickup' : 'EcoCash paid'}). Prepare order now.`,
          screen: 'Orders',
          type: 'order'
        });

        return newOrder;
      },

      markOrderReady: (orderId) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId ? { ...o, status: 'ready', readyAt: Date.now() } : o
          )
        }));

        const ord = get().orders.find((o) => o.id === orderId);

        get().triggerSystemEvent({
          type: 'order.ready',
          sourceRole: 'pharmacy',
          targetRoles: ['patient'],
          summary: `Order ${ord?.orderNumber} is ready for pickup!`,
          payload: { orderId }
        });

        get().addNotification({
          targetRole: 'patient',
          title: 'Medicine Ready for Pickup',
          body: `Your prescription is packaged at ${ord?.pharmacyName}. Show your 6-digit pickup code.`,
          screen: 'Orders',
          type: 'order'
        });
      },

      collectOrder: (orderId, pickupCode) => {
        const ord = get().orders.find((o) => o.id === orderId);
        if (!ord) return false;

        // If code provided and doesn't match, return false
        if (pickupCode && ord.pickupCode !== pickupCode.trim()) {
          return false;
        }

        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId ? { ...o, status: 'collected', paymentStatus: 'paid', collectedAt: Date.now() } : o
          ),
          prescriptions: state.prescriptions.map((r) =>
            r.id === ord.prescriptionId ? { ...r, status: 'completed' } : r
          )
        }));

        get().triggerSystemEvent({
          type: 'order.collected',
          sourceRole: 'pharmacy',
          targetRoles: ['patient', 'doctor'],
          summary: `Medicine collected: Pass ${ord.pickupCode} verified`,
          payload: { orderId }
        });

        get().addNotification({
          targetRole: 'patient',
          title: 'Medicine Collected',
          body: `Dispensed by ${ord.pharmacyName}. Thank you for using Mushonga!`,
          screen: 'Orders',
          type: 'order'
        });

        return true;
      },

      rejectRxPrivately: (pharmacyId, rxId, reason) => {
        set((state) => {
          const list = state.rejectedRxIdsByPharmacy[pharmacyId] || [];
          return {
            rejectedRxIdsByPharmacy: {
              ...state.rejectedRxIdsByPharmacy,
              [pharmacyId]: [...list, rxId]
            }
          };
        });

        get().triggerSystemEvent({
          type: 'rx.rejected',
          sourceRole: 'pharmacy',
          targetRoles: ['pharmacy'], // ONLY visible to this pharmacy!
          summary: `Prescription rejected privately: "${reason}" (Only this pharmacy sees this)`,
          payload: { pharmacyId, rxId, reason }
        });
      },

      addNotification: (notif) => {
        const id = `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const item: PushNotification = {
          ...notif,
          id,
          timestamp: Date.now(),
          read: false
        };
        set((state) => ({
          notifications: [item, ...state.notifications]
        }));
      },

      markNotificationRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          )
        }));
      },

      triggerSystemEvent: (event) => {
        const id = `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const sysEvent: SystemEvent = {
          ...event,
          id,
          timestamp: Date.now()
        };

        set((state) => ({
          systemEvents: [sysEvent, ...state.systemEvents.slice(0, 49)],
          activeParticle: {
            id,
            from: event.sourceRole,
            to: event.targetRoles,
            summary: event.summary
          }
        }));

        // Reset active particle after 2.4s animation
        setTimeout(() => {
          if (get().activeParticle?.id === id) {
            set({ activeParticle: null });
          }
        }, 2400);
      },

      resetAllData: () => {
        set({
          doctors: SEED_DOCTORS,
          slots: INITIAL_SLOTS,
          appointments: INITIAL_APPOINTMENTS,
          prescriptions: INITIAL_PRESCRIPTIONS,
          pharmacies: SEED_PHARMACIES,
          floats: [],
          bids: [],
          orders: [],
          notifications: [],
          systemEvents: [],
          rejectedRxIdsByPharmacy: {},
          storyStep: -1,
          storyCaption: null
        });
      }
    }),
    {
      name: 'mushonga-storage-v2',
      storage: createJSONStorage(() => safeStorage),
      partialize: (state) => ({
        language: state.language,
        currency: state.currency,
        themeMode: state.themeMode,
        rules: state.rules,
        appointments: state.appointments,
        prescriptions: state.prescriptions,
        floats: state.floats,
        bids: state.bids,
        orders: state.orders
      })
    }
  )
);
