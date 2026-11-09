import { Doctor, Pharmacy, Prescription, Appointment, Slot } from '../types';

export const SEED_DOCTORS: Doctor[] = [
  {
    id: 'doc-chikwanha',
    name: 'Dr. Rumbidzai Chikwanha',
    title: 'Specialist Physician',
    specialty: 'Physician',
    suburb: 'Belgravia',
    city: 'Harare',
    feeUSD: 35,
    rating: 4.9,
    visitCount: 318,
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    qualifications: 'MBChB (UZ), MMed Internal Med, FCP (ECSA)',
    bio: 'Consultant physician specializing in cardiovascular health, hypertension, and metabolic conditions. Belgravia Medical Centre.',
    availableToday: true,
    workingHours: '08:30 – 16:30'
  },
  {
    id: 'doc-moyo',
    name: 'Dr. Tendai Moyo',
    title: 'Consultant Paediatrician',
    specialty: 'Paediatrics',
    suburb: 'Avondale',
    city: 'Harare',
    feeUSD: 40,
    rating: 4.8,
    visitCount: 245,
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    qualifications: 'MBChB (UZ), DCH, FCPaed',
    bio: 'Compassionate paediatrician dedicated to child wellness, immunization, and paediatric acute care in Avondale.',
    availableToday: true,
    workingHours: '09:00 – 17:00'
  },
  {
    id: 'doc-marufu',
    name: 'Dr. Kudakwashe Marufu',
    title: 'General Practitioner',
    specialty: 'General Practice',
    suburb: 'Milton Park',
    city: 'Harare',
    feeUSD: 25,
    rating: 4.7,
    visitCount: 412,
    avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
    qualifications: 'MBChB (UZ), Dip Family Med',
    bio: 'Family doctor providing primary care, chronic disease management, and wellness checks at Milton Park Clinic.',
    availableToday: true,
    workingHours: '08:00 – 16:00'
  },
  {
    id: 'doc-mutasa',
    name: 'Dr. Nyasha Mutasa',
    title: 'Obstetrician & Gynaecologist',
    specialty: 'Gynaecology',
    suburb: 'Borrowdale',
    city: 'Harare',
    feeUSD: 50,
    rating: 4.9,
    visitCount: 280,
    avatarUrl: 'https://images.unsplash.com/photo-1594824813620-410e0520633b?auto=format&fit=crop&q=80&w=400',
    qualifications: 'MBChB (UZ), MMed O&G, FCOG',
    bio: 'Women’s health specialist focusing on maternal wellbeing, fertility consultations, and minimally invasive procedures.',
    availableToday: false,
    workingHours: '10:00 – 17:00'
  },
  {
    id: 'doc-sibanda',
    name: 'Dr. Tatenda Sibanda',
    title: 'Consultant Dermatologist',
    specialty: 'Dermatology',
    suburb: 'Mt Pleasant',
    city: 'Harare',
    feeUSD: 45,
    rating: 4.8,
    visitCount: 194,
    avatarUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
    qualifications: 'MBChB (UZ), MSc Dermatology (Cardiff)',
    bio: 'Expert care for chronic skin disorders, eczema, pigmentation, and dermatological surgical procedures.',
    availableToday: true,
    workingHours: '08:30 – 15:30'
  },
  {
    id: 'doc-dube',
    name: 'Dr. Chipo Dube',
    title: 'Dental Surgeon',
    specialty: 'Dentistry',
    suburb: 'Belgravia',
    city: 'Harare',
    feeUSD: 30,
    rating: 4.8,
    visitCount: 210,
    avatarUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=400',
    qualifications: 'BDS (UZ), Dip Implantology',
    bio: 'Comprehensive dental care, preventive dentistry, cosmetic alignment, and oral health restoration.',
    availableToday: true,
    workingHours: '09:00 – 16:00'
  },
  {
    id: 'doc-ncube',
    name: 'Dr. Farai Ncube',
    title: 'Cardiologist',
    specialty: 'Physician',
    suburb: 'Hillside',
    city: 'Bulawayo',
    feeUSD: 55,
    rating: 4.9,
    visitCount: 180,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    qualifications: 'MBChB (UZ), FCP, Cert Cardiology',
    bio: 'Cardiac diagnostic care, ECG, echocardiography and heart wellness in Bulawayo.',
    availableToday: false,
    workingHours: '08:30 – 14:30'
  },
  {
    id: 'doc-makoni',
    name: 'Dr. Tariro Makoni',
    title: 'General Practitioner',
    specialty: 'General Practice',
    suburb: 'Greendale',
    city: 'Harare',
    feeUSD: 25,
    rating: 4.7,
    visitCount: 310,
    avatarUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=400',
    qualifications: 'MBChB (UZ)',
    bio: 'Community medicine, health checks, vaccinations, and preventive healthcare services.',
    availableToday: true,
    workingHours: '08:00 – 17:00'
  },
  {
    id: 'doc-chiwenga',
    name: 'Dr. Rufaro Chiwenga',
    title: 'Consultant Paediatrician',
    specialty: 'Paediatrics',
    suburb: 'Borrowdale',
    city: 'Harare',
    feeUSD: 45,
    rating: 4.9,
    visitCount: 165,
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    qualifications: 'MBChB (UZ), MMed Paed',
    bio: 'Paediatric pulmonology and neonatal support at Borrowdale Village Clinic.',
    availableToday: true,
    workingHours: '09:00 – 16:00'
  },
  {
    id: 'doc-munetsi',
    name: 'Dr. Marshal Munetsi',
    title: 'Orthopaedic Specialist',
    specialty: 'Physician',
    suburb: 'Avondale',
    city: 'Harare',
    feeUSD: 50,
    rating: 4.8,
    visitCount: 198,
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    qualifications: 'MBChB (UZ), FCS (ECSA) Ortho',
    bio: 'Joint and musculoskeletal injury recovery, arthritis rehabilitation.',
    availableToday: true,
    workingHours: '10:00 – 17:00'
  },
  {
    id: 'doc-shumba',
    name: 'Dr. Memory Shumba',
    title: 'General Practitioner',
    specialty: 'General Practice',
    suburb: 'Suburbs',
    city: 'Bulawayo',
    feeUSD: 25,
    rating: 4.7,
    visitCount: 220,
    avatarUrl: 'https://images.unsplash.com/photo-1594824813620-410e0520633b?auto=format&fit=crop&q=80&w=400',
    qualifications: 'MBChB (UZ)',
    bio: 'Holistic patient care and outpatient wellness at Suburbs Medical Practice, Bulawayo.',
    availableToday: true,
    workingHours: '08:30 – 16:30'
  },
  {
    id: 'doc-maposa',
    name: 'Dr. Blessing Maposa',
    title: 'Dental Surgeon',
    specialty: 'Dentistry',
    suburb: 'Milton Park',
    city: 'Harare',
    feeUSD: 30,
    rating: 4.8,
    visitCount: 145,
    avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
    qualifications: 'BDS (Wits)',
    bio: 'Orthodontics, teeth whitening, and pediatric dental hygiene.',
    availableToday: false,
    workingHours: '09:00 – 15:00'
  }
];

// Additional doctors up to 26 for realistic roster
for (let i = 13; i <= 26; i++) {
  const specialties = ['General Practice', 'Paediatrics', 'Gynaecology', 'Physician', 'Dermatology', 'Dentistry'];
  const suburbs = ['Avondale', 'Borrowdale', 'Belgravia', 'Milton Park', 'Mt Pleasant', 'Greendale', 'Gweru'];
  const names = ['Kudzai', 'Panashe', 'Tinashe', 'Gamuchirai', 'Vimbai', 'Chengetai', 'Tapiwa', 'Tawanda', 'Makanaka', 'Simbarashe', 'Ngonidzashe', 'Fadzai', 'Tafadzwa', 'Kumbirai'];
  const surnames = ['Gumbo', 'Mutendi', 'Ndlovu', 'Mpofu', 'Chuma', 'Mupfumi', 'Mashingaidze', 'Mataranyika', 'Kanyangarara', 'Nyandoro', 'Ruzvidzo', 'Tsvangirai', 'Nengomasha', 'Bhasera'];
  const name = `Dr. ${names[(i - 13) % names.length]} ${surnames[(i - 13) % surnames.length]}`;
  const spec = specialties[i % specialties.length];
  const sub = suburbs[i % suburbs.length];
  SEED_DOCTORS.push({
    id: `doc-${i}`,
    name,
    title: spec === 'Dentistry' ? 'Dental Surgeon' : spec === 'General Practice' ? 'General Practitioner' : `Consultant in ${spec}`,
    specialty: spec,
    suburb: sub,
    city: sub === 'Gweru' ? 'Gweru' : 'Harare',
    feeUSD: 25 + ((i * 7) % 30),
    rating: Number((4.6 + ((i % 4) * 0.1)).toFixed(1)),
    visitCount: 120 + ((i * 17) % 250),
    avatarUrl: i % 2 === 0 
      ? 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400'
      : 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    qualifications: 'MBChB (UZ), Registrar',
    bio: `Practicing medicine with focus on modern evidence-based clinical protocols in ${sub}.`,
    availableToday: i % 2 === 1,
    workingHours: '08:30 – 16:00'
  });
}

export const SEED_PHARMACIES: Pharmacy[] = [
  {
    id: 'pharma-msasa-avondale',
    name: 'Msasa Pharmacy Avondale',
    suburb: 'Avondale',
    city: 'Harare',
    address: 'Shop 4, Avondale Shopping Centre, King George Rd',
    rating: 4.9,
    phone: '+263 77 123 4567',
    distanceKm: 1.4,
    acceptedPaymentMethods: ['ecocash', 'onemoney', 'innbucks', 'card', 'cash']
  },
  {
    id: 'pharma-kopje-belgravia',
    name: 'Kopje Chemists Belgravia',
    suburb: 'Belgravia',
    city: 'Harare',
    address: '14 Baines Avenue, Belgravia',
    rating: 4.8,
    phone: '+263 77 234 5678',
    distanceKm: 2.1,
    acceptedPaymentMethods: ['ecocash', 'innbucks', 'card', 'cash']
  },
  {
    id: 'pharma-granite-borrowdale',
    name: 'Granite Care Pharmacy Borrowdale',
    suburb: 'Borrowdale',
    city: 'Harare',
    address: 'Borrowdale Village Walk, Shop 19',
    rating: 4.9,
    phone: '+263 77 345 6789',
    distanceKm: 3.8,
    acceptedPaymentMethods: ['ecocash', 'onemoney', 'card', 'cash']
  },
  {
    id: 'pharma-jacaranda-milton',
    name: 'Jacaranda Pharmacy Milton Park',
    suburb: 'Milton Park',
    city: 'Harare',
    address: '22 Lincoln Rd, Milton Park',
    rating: 4.7,
    phone: '+263 77 456 7890',
    distanceKm: 2.7,
    acceptedPaymentMethods: ['ecocash', 'innbucks', 'cash']
  },
  {
    id: 'pharma-bvumba-mtpleasant',
    name: 'Bvumba Health Chemists Mt Pleasant',
    suburb: 'Mt Pleasant',
    city: 'Harare',
    address: 'Bond Street Shopping Mall, Shop 8',
    rating: 4.8,
    phone: '+263 77 567 8901',
    distanceKm: 4.2,
    acceptedPaymentMethods: ['ecocash', 'card', 'cash']
  },
  {
    id: 'pharma-flame-greendale',
    name: 'Flame Lily Pharmacy Greendale',
    suburb: 'Greendale',
    city: 'Harare',
    address: 'Kamfinsa Shopping Centre, Court 2',
    rating: 4.6,
    phone: '+263 77 678 9012',
    distanceKm: 5.5,
    acceptedPaymentMethods: ['ecocash', 'onemoney', 'cash']
  },
  {
    id: 'pharma-hillside-byo',
    name: 'Matopos Care Chemists Hillside',
    suburb: 'Hillside',
    city: 'Bulawayo',
    address: 'Hillside Shopping Centre, Bulawayo',
    rating: 4.8,
    phone: '+263 77 789 0123',
    distanceKm: 6.9,
    acceptedPaymentMethods: ['ecocash', 'innbucks', 'card', 'cash']
  },
  {
    id: 'pharma-central-harare',
    name: 'Samora Machel Express Pharmacy',
    suburb: 'Belgravia',
    city: 'Harare',
    address: '88 Samora Machel Ave, Harare',
    rating: 4.7,
    phone: '+263 77 890 1234',
    distanceKm: 2.9,
    acceptedPaymentMethods: ['ecocash', 'card', 'cash']
  },
  {
    id: 'pharma-suburbs-byo',
    name: 'Royal Oak Pharmacy Suburbs',
    suburb: 'Suburbs',
    city: 'Bulawayo',
    address: '12th Avenue & Park Rd, Bulawayo',
    rating: 4.9,
    phone: '+263 77 901 2345',
    distanceKm: 7.4,
    acceptedPaymentMethods: ['ecocash', 'cash']
  },
  {
    id: 'pharma-gweru-clover',
    name: 'Midlands Clover Dispensary',
    suburb: 'Gweru',
    city: 'Gweru',
    address: 'Main Street & 6th, Gweru',
    rating: 4.7,
    phone: '+263 77 012 3456',
    distanceKm: 9.0,
    acceptedPaymentMethods: ['ecocash', 'card', 'cash']
  },
  {
    id: 'pharma-alexandra-park',
    name: 'Highlands Health Corner',
    suburb: 'Borrowdale',
    city: 'Harare',
    address: 'Enterprise Rd, Harare',
    rating: 4.8,
    phone: '+263 77 111 2233',
    distanceKm: 4.6,
    acceptedPaymentMethods: ['ecocash', 'innbucks', 'cash']
  },
  {
    id: 'pharma-kensington',
    name: 'Kensington Community Chemist',
    suburb: 'Avondale',
    city: 'Harare',
    address: '11 Kensington Rd, Avondale West',
    rating: 4.7,
    phone: '+263 77 222 3344',
    distanceKm: 1.9,
    acceptedPaymentMethods: ['ecocash', 'card', 'cash']
  },
  {
    id: 'pharma-eastlea',
    name: 'Chitepo Care Pharmacy',
    suburb: 'Milton Park',
    city: 'Harare',
    address: 'Herbert Chitepo Ave, Harare',
    rating: 4.8,
    phone: '+263 77 333 4455',
    distanceKm: 3.1,
    acceptedPaymentMethods: ['ecocash', 'card', 'cash']
  },
  {
    id: 'pharma-borrowdale-west',
    name: 'Sam Levy Dispensary',
    suburb: 'Borrowdale',
    city: 'Harare',
    address: 'Sam Levy’s Village, Block D',
    rating: 4.9,
    phone: '+263 77 444 5566',
    distanceKm: 4.1,
    acceptedPaymentMethods: ['ecocash', 'onemoney', 'innbucks', 'card', 'cash']
  }
];

export const INITIAL_SLOTS: Slot[] = [
  // Today's slots for Dr. Chikwanha
  { id: 'slot-1', doctorId: 'doc-chikwanha', dateStr: '2026-11-14', timeStr: '09:00', isBooked: true, bookedByPatientId: 'pat-1', bookedPatientName: 'Farai Ncube' },
  { id: 'slot-2', doctorId: 'doc-chikwanha', dateStr: '2026-11-14', timeStr: '09:30', isBooked: false },
  { id: 'slot-3', doctorId: 'doc-chikwanha', dateStr: '2026-11-14', timeStr: '10:00', isBooked: true, bookedByPatientId: 'pat-2', bookedPatientName: 'Chipo Dube' },
  { id: 'slot-4', doctorId: 'doc-chikwanha', dateStr: '2026-11-14', timeStr: '10:30', isBooked: false },
  { id: 'slot-5', doctorId: 'doc-chikwanha', dateStr: '2026-11-14', timeStr: '11:00', isBooked: false },
  { id: 'slot-6', doctorId: 'doc-chikwanha', dateStr: '2026-11-14', timeStr: '11:30', isBooked: false },
  { id: 'slot-7', doctorId: 'doc-chikwanha', dateStr: '2026-11-14', timeStr: '14:00', isBooked: false },
  { id: 'slot-8', doctorId: 'doc-chikwanha', dateStr: '2026-11-14', timeStr: '14:30', isBooked: false },
  { id: 'slot-9', doctorId: 'doc-chikwanha', dateStr: '2026-11-14', timeStr: '15:00', isBooked: false },

  // Tomorrow's slots
  { id: 'slot-10', doctorId: 'doc-chikwanha', dateStr: '2026-11-15', timeStr: '09:00', isBooked: false },
  { id: 'slot-11', doctorId: 'doc-chikwanha', dateStr: '2026-11-15', timeStr: '09:30', isBooked: false },
  { id: 'slot-12', doctorId: 'doc-chikwanha', dateStr: '2026-11-15', timeStr: '10:00', isBooked: false },
  { id: 'slot-13', doctorId: 'doc-chikwanha', dateStr: '2026-11-15', timeStr: '11:00', isBooked: false },
  { id: 'slot-14', doctorId: 'doc-chikwanha', dateStr: '2026-11-15', timeStr: '14:00', isBooked: false },
  
  // Dr. Moyo slots
  { id: 'slot-20', doctorId: 'doc-moyo', dateStr: '2026-11-14', timeStr: '09:30', isBooked: false },
  { id: 'slot-21', doctorId: 'doc-moyo', dateStr: '2026-11-14', timeStr: '10:30', isBooked: false },
  { id: 'slot-22', doctorId: 'doc-moyo', dateStr: '2026-11-14', timeStr: '14:00', isBooked: true, bookedByPatientId: 'pat-3', bookedPatientName: 'Tatenda Sibanda' },

  // Dr. Marufu slots
  { id: 'slot-30', doctorId: 'doc-marufu', dateStr: '2026-11-14', timeStr: '09:00', isBooked: false },
  { id: 'slot-31', doctorId: 'doc-marufu', dateStr: '2026-11-14', timeStr: '11:00', isBooked: false },
  { id: 'slot-32', doctorId: 'doc-marufu', dateStr: '2026-11-14', timeStr: '15:30', isBooked: false }
];

export const INITIAL_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'rx-tendai-1',
    rxNumber: 'MSH-RX-84920',
    doctorId: 'doc-chikwanha',
    doctorName: 'Dr. Rumbidzai Chikwanha',
    doctorSpecialty: 'Specialist Physician',
    doctorRegNumber: 'MCZ-MD-44819',
    patientId: 'patient-tendai',
    patientName: 'Tendai Moyo',
    dateIssued: '14 Nov 2026',
    items: [
      { id: 'med-1', name: 'Amoxicillin & Clavulanate', strength: '625mg', dosage: '1 tablet twice daily with food', quantity: '14 tablets', instructions: 'Finish full 7-day course' },
      { id: 'med-2', name: 'Paracetamol', strength: '500mg', dosage: '2 tablets four times daily prn for pain', quantity: '20 tablets', instructions: 'Do not exceed 8 tablets in 24 hours' }
    ],
    diagnosis: 'Acute bacterial sinus infection with mild frontal headache',
    notes: 'Drink plenty of water and rest. Return if fever persists beyond 48 hours.',
    isDoctorVerified: true,
    status: 'issued'
  },
  {
    id: 'rx-tendai-2',
    rxNumber: 'MSH-RX-73194',
    doctorId: 'doc-moyo',
    doctorName: 'Dr. Tendai Moyo',
    doctorSpecialty: 'Consultant Paediatrician',
    doctorRegNumber: 'MCZ-MD-39821',
    patientId: 'patient-tendai',
    patientName: 'Tendai Moyo (for Danai)',
    dateIssued: '10 Nov 2026',
    items: [
      { id: 'med-3', name: 'Salbutamol Inhaler (Ventolin)', strength: '100mcg/puff', dosage: '2 puffs as needed with spacer', quantity: '1 canister', instructions: 'Use before sports or on wheezing' }
    ],
    diagnosis: 'Exercise-induced bronchospasm',
    notes: 'Check spacer technique at pharmacy counter.',
    isDoctorVerified: true,
    status: 'completed'
  },
  {
    id: 'rx-uploaded-sample',
    rxNumber: 'EXT-RX-99231',
    doctorName: 'Dr. S. Kanyangarara',
    doctorSpecialty: 'General Practitioner',
    doctorRegNumber: 'MCZ-GP-21840',
    patientId: 'patient-tendai',
    patientName: 'Tendai Moyo',
    dateIssued: '12 Nov 2026',
    items: [
      { id: 'med-4', name: 'Amlodipine Besylate', strength: '5mg', dosage: '1 tablet daily each morning', quantity: '30 tablets', instructions: 'Blood pressure maintenance' },
      { id: 'med-5', name: 'Metformin HCl', strength: '500mg', dosage: '1 tablet with dinner', quantity: '60 tablets', instructions: 'Glycaemic control' }
    ],
    diagnosis: 'Hypertension Stage 1 & Impaired Fasting Glucose',
    notes: 'Refill approved for 3 months. Stamped at Avenues Clinic.',
    isDoctorVerified: false, // Uploaded external Rx with physical stamp!
    stampPhotoUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400',
    status: 'issued'
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    doctorId: 'doc-chikwanha',
    doctorName: 'Dr. Rumbidzai Chikwanha',
    doctorSpecialty: 'Specialist Physician',
    doctorSuburb: 'Belgravia',
    doctorAvatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    patientId: 'patient-tendai',
    patientName: 'Tendai Moyo',
    patientPhone: '+263 77 234 5678',
    dateStr: '14 Nov 2026',
    timeStr: '11:00',
    feeUSD: 35,
    status: 'upcoming',
    createdAt: Date.now() - 3600000
  }
];

export const ZIM_COMMON_MEDS = [
  { name: 'Amoxicillin', strength: '500mg', defaultDose: '1 cap tds', defaultQty: '21 caps' },
  { name: 'Amoxicillin / Clavulanate (Augmentin)', strength: '625mg', defaultDose: '1 tab bd', defaultQty: '14 tabs' },
  { name: 'Metformin HCl', strength: '500mg', defaultDose: '1 tab bd with food', defaultQty: '60 tabs' },
  { name: 'Amlodipine Besylate', strength: '5mg', defaultDose: '1 tab mane', defaultQty: '30 tabs' },
  { name: 'Paracetamol', strength: '500mg', defaultDose: '2 tabs qds prn', defaultQty: '20 tabs' },
  { name: 'Azithromycin', strength: '500mg', defaultDose: '1 tab daily for 3 days', defaultQty: '3 tabs' },
  { name: 'Omeprazole', strength: '20mg', defaultDose: '1 cap mane before food', defaultQty: '28 caps' },
  { name: 'Salbutamol Inhaler', strength: '100mcg/dose', defaultDose: '2 puffs prn with spacer', defaultQty: '1 inhaler' },
  { name: 'Losartan Potassium', strength: '50mg', defaultDose: '1 tab mane', defaultQty: '30 tabs' },
  { name: 'Ibuprofen', strength: '400mg', defaultDose: '1 tab tds after food', defaultQty: '15 tabs' },
  { name: 'Ciprofloxacin', strength: '500mg', defaultDose: '1 tab bd for 5 days', defaultQty: '10 tabs' },
  { name: 'Cetirizine HCl', strength: '10mg', defaultDose: '1 tab nocte', defaultQty: '30 tabs' }
];
