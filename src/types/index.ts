/**
 * Mushonga Core Type Definitions
 * Shared types across Patient, Doctor, and Pharmacy apps.
 */

export type Role = 'patient' | 'doctor' | 'pharmacy';

export type Language = 'en' | 'sn';
export type Currency = 'USD' | 'ZiG';
export type ThemeMode = 'light' | 'dark' | 'system';

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  suburb: string;
  city: string;
  feeUSD: number;
  rating: number;
  visitCount: number;
  avatarUrl: string;
  qualifications: string;
  bio: string;
  availableToday: boolean;
  workingHours: string;
}

export interface Slot {
  id: string;
  doctorId: string;
  dateStr: string; // YYYY-MM-DD
  timeStr: string; // HH:mm (e.g. "09:00", "09:30")
  isBooked: boolean;
  bookedByPatientId?: string;
  bookedPatientName?: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorSuburb: string;
  doctorAvatarUrl: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  dateStr: string;
  timeStr: string;
  feeUSD: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  createdAt: number;
}

export interface MedicineItem {
  id: string;
  name: string;
  strength: string;
  dosage: string;
  quantity: string;
  instructions?: string;
}

export interface Prescription {
  id: string;
  rxNumber: string;
  doctorId?: string;
  doctorName: string;
  doctorSpecialty?: string;
  doctorRegNumber?: string;
  patientId: string;
  patientName: string;
  dateIssued: string;
  items: MedicineItem[];
  diagnosis: string;
  notes?: string;
  isDoctorVerified: boolean;
  stampPhotoUrl?: string; // for uploaded external Rx
  status: 'issued' | 'floated' | 'ordered' | 'completed';
}

export interface Pharmacy {
  id: string;
  name: string;
  suburb: string;
  city: string;
  address: string;
  rating: number;
  phone: string;
  distanceKm: number;
  avatarUrl?: string;
  acceptedPaymentMethods: ('ecocash' | 'onemoney' | 'innbucks' | 'card' | 'cash')[];
}

export interface FloatRx {
  id: string;
  prescriptionId: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  suburb: string;
  radiusKm: number;
  createdAt: number;
  expiresAt: number;
  status: 'bidding' | 'accepted' | 'expired';
  lowestBidUSD?: number;
  bidsCount: number;
}

export interface Bid {
  id: string;
  floatId: string;
  pharmacyId: string;
  pharmacyName: string;
  pharmacySuburb: string;
  pharmacyDistanceKm: number;
  priceUSD: number;
  originalPriceUSD?: number;
  isRevised?: boolean;
  readyInMinutes: number;
  inStock: boolean;
  note?: string;
  rank?: number;
  createdAt: number;
  status: 'pending' | 'accepted' | 'rejected';
}

export type PaymentMethod = 'ecocash' | 'onemoney' | 'innbucks' | 'card' | 'cash';
export type OrderStatus = 'accepted' | 'preparing' | 'ready' | 'collected';

export interface Order {
  id: string;
  orderNumber: string;
  floatId: string;
  prescriptionId: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  pharmacyId: string;
  pharmacyName: string;
  pharmacyAddress: string;
  pharmacySuburb: string;
  pharmacyPhone: string;
  items: MedicineItem[];
  totalUSD: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'pending_cash' | 'failed';
  paymentRef: string;
  status: OrderStatus;
  pickupCode: string;
  createdAt: number;
  readyAt?: number;
  collectedAt?: number;
}

export interface PushNotification {
  id: string;
  targetRole: Role;
  title: string;
  body: string;
  screen?: string;
  timestamp: number;
  read: boolean;
  type?: 'booking' | 'rx' | 'bid' | 'order';
}

export interface ConfigurableRules {
  bidBinding: boolean;
  bidWindowSeconds: number; // 60s for demo
  maxBidsPerPharmacy: number; // 1, 2, or 3
  bidRadiusKm: number; // 5, 10, 25
  autoCancelHours: number; // 48
}

export interface SystemEvent {
  id: string;
  type: 
    | 'slot.booked' 
    | 'slot.cancelled' 
    | 'rx.issued' 
    | 'rx.floated' 
    | 'bid.placed' 
    | 'bid.revised' 
    | 'bid.accepted' 
    | 'payment.captured' 
    | 'order.ready' 
    | 'order.collected' 
    | 'rx.rejected';
  sourceRole: Role;
  targetRoles: Role[];
  summary: string;
  timestamp: number;
  payload?: any;
}
