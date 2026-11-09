import { useState } from 'react';
import { useMushongaStore } from '../../store/useMushongaStore';
import { Doctor, Slot } from '../../types';
import { api } from '../../lib/api';
import { formatPrice } from '../../lib/realtime';
import { translations } from '../../i18n/translations';
import { Search, MapPin, Star, Calendar, Clock, CheckCircle2, ChevronRight, X } from 'lucide-react';

export function PatientDoctors() {
  const language = useMushongaStore((s) => s.language);
  const currency = useMushongaStore((s) => s.currency);
  const doctors = useMushongaStore((s) => s.doctors);
  const slots = useMushongaStore((s) => s.slots);

  const t = translations[language];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [selectedDateStr, setSelectedDateStr] = useState('2026-11-14');
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  const specialties = ['All', 'Physician', 'General Practice', 'Paediatrics', 'Gynaecology', 'Dermatology', 'Dentistry'];

  // Filter doctors
  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.suburb.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpec = selectedSpecialty === 'All' || doc.specialty.toLowerCase() === selectedSpecialty.toLowerCase();
    return matchesSearch && matchesSpec;
  });

  // Doctor slots for selected doctor & date
  const doctorSlots = selectedDoctor
    ? slots.filter((s) => s.doctorId === selectedDoctor.id && s.dateStr === selectedDateStr)
    : [];

  const handleBookSlot = async () => {
    if (!selectedDoctor || !selectedSlot) return;
    setBookingLoading(true);
    try {
      await api.bookSlot(selectedSlot.id, selectedDoctor.id, 'Tendai Moyo', selectedDoctor.feeUSD);
      setIsBookingSuccess(true);
      setTimeout(() => {
        setIsBookingSuccess(false);
        setSelectedSlot(null);
        setSelectedDoctor(null);
      }, 1800);
    } catch (err) {
      console.error(err);
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto phone-scroll p-4 pb-24 space-y-4 select-none">
      {/* Header */}
      <div>
        <h2 className="font-fraunces text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
          Find a Doctor
        </h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Live clinic schedules in Harare and Bulawayo
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.searchDoctors}
          className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#0F3B34]"
        />
      </div>

      {/* Specialty Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {specialties.map((spec) => (
          <button
            key={spec}
            onClick={() => setSelectedSpecialty(spec)}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap font-bold transition-all ${
              selectedSpecialty === spec
                ? 'bg-[#0F3B34] text-white shadow-xs'
                : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300'
            }`}
          >
            {spec}
          </button>
        ))}
      </div>

      {/* Doctor Cards List */}
      <div className="space-y-3">
        {filteredDoctors.map((doc) => (
          <div
            key={doc.id}
            onClick={() => {
              setSelectedDoctor(doc);
              setSelectedSlot(null);
            }}
            className="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs hover:border-stone-300 dark:hover:border-stone-700 cursor-pointer active:scale-98 transition-all flex items-start gap-3"
          >
            {/* Avatar with fallback */}
            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 shrink-0 border border-stone-200 dark:border-stone-700 relative">
              <img
                src={doc.avatarUrl}
                alt={doc.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-[#2B4C7E]/20 flex items-center justify-center font-bold text-xs text-[#2B4C7E] -z-10">
                {doc.name.split(' ').map((n) => n[0]).join('')}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-1">
                <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 truncate">
                  {doc.name}
                </h4>
                <span className="font-mono-jb text-xs font-bold text-[#0F3B34] dark:text-[#389182] shrink-0">
                  {formatPrice(doc.feeUSD, currency)}
                </span>
              </div>

              <div className="text-[11px] text-stone-500 truncate mt-0.5">
                {doc.title} · {doc.qualifications}
              </div>

              <div className="flex items-center gap-2 mt-2 text-[11px] text-stone-500">
                <span className="flex items-center gap-0.5 text-stone-700 dark:text-stone-300 font-semibold">
                  <Star className="w-3 h-3 text-[#D99A1E] fill-current" />
                  {doc.rating} · {doc.visitCount} visits
                </span>
                <span>·</span>
                <span className="flex items-center gap-0.5 truncate">
                  <MapPin className="w-3 h-3 text-stone-400" />
                  {doc.suburb}, {doc.city}
                </span>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-stone-400 self-center shrink-0" />
          </div>
        ))}
      </div>

      {/* DOCTOR DETAIL & LIVE CALENDAR SHEET */}
      {selectedDoctor && (
        <div className="absolute inset-0 z-50 bg-black/75 backdrop-blur-xs flex flex-col justify-end p-2 animate-in fade-in">
          <div className="w-full max-h-[92%] rounded-3xl bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 flex flex-col overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-start justify-between shrink-0">
              <div className="flex items-center gap-3">
                <img
                  src={selectedDoctor.avatarUrl}
                  alt={selectedDoctor.name}
                  className="w-12 h-12 rounded-xl object-cover border border-stone-200 dark:border-stone-700"
                />
                <div>
                  <h3 className="font-bold text-sm">{selectedDoctor.name}</h3>
                  <p className="text-[11px] text-stone-500">
                    {selectedDoctor.title} · {selectedDoctor.suburb}
                  </p>
                  <div className="font-mono-jb text-xs font-bold text-[#0F3B34] dark:text-[#389182]">
                    {formatPrice(selectedDoctor.feeUSD, currency)} consultation fee
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedDoctor(null)}
                className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Calendar & Slots Body */}
            <div className="p-4 overflow-y-auto phone-scroll space-y-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-2">
                  Select Clinic Date
                </span>
                <div className="flex items-center gap-2">
                  {[
                    { label: 'Today', date: '2026-11-14', day: '14 Nov' },
                    { label: 'Tomorrow', date: '2026-11-15', day: '15 Nov' }
                  ].map((d) => (
                    <button
                      key={d.date}
                      onClick={() => {
                        setSelectedDateStr(d.date);
                        setSelectedSlot(null);
                      }}
                      className={`flex-1 p-2.5 rounded-xl text-center border font-bold transition-all ${
                        selectedDateStr === d.date
                          ? 'border-[#0F3B34] bg-[#0F3B34] text-white shadow-xs'
                          : 'border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      <div className="text-xs">{d.label}</div>
                      <div className="text-[10px] font-mono-jb opacity-80">{d.day}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots Grid (Live calendar moment) */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-2">
                  Live Available Slots ({doctorSlots.filter((s) => !s.isBooked).length} open)
                </span>

                <div className="grid grid-cols-3 gap-2">
                  {doctorSlots.map((slot) => {
                    const isSelected = selectedSlot?.id === slot.id;
                    if (slot.isBooked) {
                      return (
                        <div
                          key={slot.id}
                          className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800/50 text-stone-400 border border-stone-200 dark:border-stone-800 text-center font-mono-jb text-xs cursor-not-allowed select-none"
                        >
                          <div className="line-through">{slot.timeStr}</div>
                          <span className="text-[9px] font-sans font-bold block text-stone-400">
                            Booked
                          </span>
                        </div>
                      );
                    }

                    return (
                      <button
                        key={slot.id}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-2 rounded-xl text-center font-mono-jb text-xs font-bold transition-all active:scale-95 ${
                          isSelected
                            ? 'bg-[#D9673A] text-white shadow-sm ring-2 ring-[#D9673A]/50'
                            : 'bg-white dark:bg-stone-800 border border-[#0F3B34]/30 text-[#0F3B34] dark:text-[#389182] hover:border-[#0F3B34]'
                        }`}
                      >
                        <div>{slot.timeStr}</div>
                        <span className="text-[9px] font-sans font-semibold block opacity-80">
                          Available
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bio & Clinic note */}
              <div className="text-[11px] text-stone-500 bg-stone-50 dark:bg-stone-800/40 p-3 rounded-xl border border-stone-100 dark:border-stone-800">
                <span className="font-bold text-stone-700 dark:text-stone-300">Belgravia Practice: </span>
                {selectedDoctor.bio}
              </div>
            </div>

            {/* Bottom Book CTA */}
            <div className="p-4 border-t border-stone-200 dark:border-stone-800 shrink-0">
              {isBookingSuccess ? (
                <div className="w-full py-3 rounded-2xl bg-[#1F8A5B] text-white font-bold text-xs flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Slot Booked! Synchronized with Doctor's Calendar</span>
                </div>
              ) : (
                <button
                  disabled={!selectedSlot || bookingLoading}
                  onClick={handleBookSlot}
                  className={`w-full py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 active:scale-98 transition-all ${
                    selectedSlot
                      ? 'bg-[#D9673A] text-white shadow-md hover:bg-[#c25930]'
                      : 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>
                    {selectedSlot
                      ? `Confirm Booking at ${selectedSlot.timeStr} (${formatPrice(selectedDoctor.feeUSD, currency)})`
                      : 'Select a Time Slot Above'}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
