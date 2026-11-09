import { useMushongaStore } from '../store/useMushongaStore';
import { PaymentMethod, Prescription } from '../types';

// Helper to simulate network latency
const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  async getDoctors() {
    await delay(250);
    return useMushongaStore.getState().doctors;
  },

  async getSlots(doctorId?: string) {
    await delay(200);
    const slots = useMushongaStore.getState().slots;
    return doctorId ? slots.filter((s) => s.doctorId === doctorId) : slots;
  },

  async bookSlot(slotId: string, doctorId: string, patientName: string, feeUSD: number) {
    if (useMushongaStore.getState().isOffline) {
      throw new Error('Device is offline. Connection required to secure doctor slot.');
    }
    await delay(450);
    return useMushongaStore.getState().bookSlot(slotId, doctorId, patientName, feeUSD);
  },

  async getPrescriptions(patientId?: string) {
    await delay(250);
    const rxs = useMushongaStore.getState().prescriptions;
    return patientId ? rxs.filter((r) => r.patientId === patientId) : rxs;
  },

  async issuePrescription(data: Omit<Prescription, 'id' | 'rxNumber' | 'dateIssued' | 'status' | 'isDoctorVerified'>) {
    await delay(500);
    return useMushongaStore.getState().issuePrescription(data);
  },

  async floatPrescription(rxId: string, radiusKm: number, patientName: string) {
    await delay(450);
    const float = useMushongaStore.getState().floatPrescription(rxId, radiusKm, patientName);

    // Auto-trigger simulated pharmacy bids after float launches
    api.spawnSimulatedBids(float.id);

    return float;
  },

  async submitBid(floatId: string, pharmacyId: string, priceUSD: number, readyMinutes: number, inStock: boolean, note?: string) {
    await delay(400);
    return useMushongaStore.getState().submitBid(floatId, pharmacyId, priceUSD, readyMinutes, inStock, note);
  },

  async reviseBid(bidId: string, newPriceUSD: number) {
    await delay(350);
    useMushongaStore.getState().reviseBid(bidId, newPriceUSD);
  },

  async acceptBid(bidId: string, paymentMethod: PaymentMethod, simulateFail = false) {
    await delay(600);
    return useMushongaStore.getState().acceptBid(bidId, paymentMethod, simulateFail);
  },

  async markOrderReady(orderId: string) {
    await delay(350);
    useMushongaStore.getState().markOrderReady(orderId);
  },

  async collectOrder(orderId: string, pickupCode?: string) {
    await delay(400);
    return useMushongaStore.getState().collectOrder(orderId, pickupCode);
  },

  async rejectRxPrivately(pharmacyId: string, rxId: string, reason: string) {
    await delay(300);
    useMushongaStore.getState().rejectRxPrivately(pharmacyId, rxId, reason);
  },

  // Simulates 3-6 pharmacies competing in reverse auction
  spawnSimulatedBids(floatId: string) {
    const pharmacies = useMushongaStore.getState().pharmacies.slice(0, 5);
    const bidsData = [
      { phIdx: 0, price: 14.50, time: 20, note: 'All items fresh batch. Dispensed with seal.' },
      { phIdx: 1, price: 12.80, time: 30, note: 'Belgravia stock verified. Ready within 30 min.' },
      { phIdx: 2, price: 16.00, time: 15, note: 'Village walk branch. Drive-thru pickup available.' },
      { phIdx: 3, price: 13.50, time: 25, note: 'Full brand pack available.' }
    ];

    // Stagger bids over 2-6 seconds
    bidsData.forEach((b, index) => {
      setTimeout(() => {
        const currentFloats = useMushongaStore.getState().floats;
        const currentFloat = currentFloats.find((f) => f.id === floatId);
        // Only submit if still bidding
        if (currentFloat && currentFloat.status === 'bidding') {
          const pharmacy = pharmacies[b.phIdx];
          if (pharmacy) {
            useMushongaStore.getState().submitBid(
              floatId,
              pharmacy.id,
              b.price,
              b.time,
              true,
              b.note
            );
          }
        }
      }, 1500 + index * 1800);
    });

    // One pharmacy revises their price downwards to win the tender!
    setTimeout(() => {
      const currentFloats = useMushongaStore.getState().floats;
      const currentFloat = currentFloats.find((f) => f.id === floatId);
      if (currentFloat && currentFloat.status === 'bidding') {
        const floatBids = useMushongaStore.getState().bids.filter((b) => b.floatId === floatId);
        if (floatBids.length > 0) {
          // Pharmacy at index 0 drops price to $11.90 (becoming lowest!)
          const msasaBid = floatBids.find((b) => b.pharmacyId.includes('msasa'));
          if (msasaBid) {
            useMushongaStore.getState().reviseBid(msasaBid.id, 11.90);
          }
        }
      }
    }, 8500);
  }
};
