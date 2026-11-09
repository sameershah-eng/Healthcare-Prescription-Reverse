import { useState } from 'react';
import { useMushongaStore } from '../../store/useMushongaStore';
import { MedicineItem } from '../../types';
import { ZIM_COMMON_MEDS } from '../../data/seed';
import { api } from '../../lib/api';
import { translations } from '../../i18n/translations';
import { ShieldCheck, Plus, Trash2, CheckCircle2, FileSignature, Sparkles } from 'lucide-react';

interface DoctorIssueRxProps {
  defaultPatientName?: string;
  onIssuedSuccess?: () => void;
}

export function DoctorIssueRx({ defaultPatientName = 'Tendai Moyo', onIssuedSuccess }: DoctorIssueRxProps) {
  const language = useMushongaStore((s) => s.language);
  const t = translations[language];

  const [patientName, setPatientName] = useState(defaultPatientName);
  const [diagnosis, setDiagnosis] = useState('Acute bacterial sinus infection');
  const [notes, setNotes] = useState('Take medications with meals. Complete full 7-day course.');
  const [items, setItems] = useState<MedicineItem[]>([
    {
      id: 'med-1',
      name: 'Amoxicillin & Clavulanate (Augmentin)',
      strength: '625mg',
      dosage: '1 tablet twice daily with food',
      quantity: '14 tablets',
      instructions: 'Take 12 hours apart'
    },
    {
      id: 'med-2',
      name: 'Paracetamol',
      strength: '500mg',
      dosage: '2 tablets four times daily prn',
      quantity: '20 tablets',
      instructions: 'For fever or sinus pain'
    }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleAddMedication = (commonMed?: (typeof ZIM_COMMON_MEDS)[0]) => {
    const newItem: MedicineItem = {
      id: `med-${Date.now()}`,
      name: commonMed ? commonMed.name : 'Amlodipine Besylate',
      strength: commonMed ? commonMed.strength : '5mg',
      dosage: commonMed ? commonMed.defaultDose : '1 tablet daily mane',
      quantity: commonMed ? commonMed.defaultQty : '30 tablets',
      instructions: 'As directed'
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const handleSignAndIssue = async () => {
    if (items.length === 0) return;
    setIsSubmitting(true);
    try {
      await api.issuePrescription({
        doctorId: 'doc-chikwanha',
        doctorName: 'Dr. Rumbidzai Chikwanha',
        doctorSpecialty: 'Specialist Physician',
        doctorRegNumber: 'MCZ-MD-44819',
        patientId: 'patient-tendai',
        patientName,
        items,
        diagnosis,
        notes
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        if (onIssuedSuccess) onIssuedSuccess();
      }, 1600);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto phone-scroll p-4 pb-24 space-y-4 select-none">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="font-fraunces text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
            Issue Digital Rx
          </h2>
          <span className="flex items-center gap-1 text-[10px] font-bold text-[#1F8A5B] bg-[#1F8A5B]/10 px-2 py-0.5 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Digital Seal Ready</span>
          </span>
        </div>
        <p className="text-xs text-stone-500 mt-0.5">
          Doctor cryptographic sign & direct patient dispatch
        </p>
      </div>

      {/* Patient & Diagnosis Information */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-3">
        <div>
          <label className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
            Selected Patient
          </label>
          <select
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            className="w-full text-xs p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-bold focus:outline-none focus:ring-2 focus:ring-[#2B4C7E]"
          >
            <option value="Tendai Moyo">Tendai Moyo (Avondale · Seen Today)</option>
            <option value="Farai Ncube">Farai Ncube (Belgravia · Chronic Care)</option>
            <option value="Chipo Dube">Chipo Dube (Milton Park)</option>
            <option value="Nyasha Mutasa">Nyasha Mutasa (Borrowdale)</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
            Clinical Diagnosis
          </label>
          <input
            type="text"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            placeholder="e.g. Acute bacterial sinus infection"
            className="w-full text-xs p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#2B4C7E]"
          />
        </div>
      </div>

      {/* Prescribed Medications Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Prescribed Drugs ({items.length})
          </label>
          <button
            onClick={() => handleAddMedication()}
            className="text-xs font-bold text-[#2B4C7E] dark:text-[#608bcf] flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Drug</span>
          </button>
        </div>

        {/* Quick Zimbabwe Common Drugs Chips */}
        <div className="mb-2.5 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
          <span className="text-stone-400 font-medium text-[10px] shrink-0">Quick Add:</span>
          {ZIM_COMMON_MEDS.slice(0, 5).map((med, idx) => (
            <button
              key={idx}
              onClick={() => handleAddMedication(med)}
              className="px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold whitespace-nowrap hover:bg-stone-200"
            >
              + {med.name.split(' ')[0]} {med.strength}
            </button>
          ))}
        </div>

        {/* Medication Cards */}
        <div className="space-y-2">
          {items.map((it, idx) => (
            <div
              key={it.id}
              className="p-3 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-stone-900 dark:text-stone-100">
                  {idx + 1}. {it.name}
                </span>
                <button
                  onClick={() => handleRemoveItem(it.id)}
                  className="p-1 text-stone-400 hover:text-[#C8432F]"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-stone-400 block">Strength</span>
                  <span className="font-mono-jb font-semibold">{it.strength}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block">Quantity</span>
                  <span className="font-mono-jb font-semibold">{it.quantity}</span>
                </div>
              </div>

              <div className="text-[11px] text-stone-500 bg-stone-50 dark:bg-stone-800/60 p-2 rounded-lg">
                <span className="font-semibold text-stone-700 dark:text-stone-300">Dose: </span>
                {it.dosage}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Doctor Stamp & Digital Seal Notice */}
      <div className="p-3 rounded-2xl bg-[#0F3B34]/10 border border-[#0F3B34]/20 text-xs text-[#0F3B34] dark:text-[#389182] flex items-center gap-2.5">
        <ShieldCheck className="w-5 h-5 text-[#D9673A] shrink-0" />
        <div className="text-[11px] leading-tight">
          <strong>Medical Council of Zimbabwe Authenticated:</strong> Automatically signed with Dr. Chikwanha's cryptographic token (MCZ-MD-44819).
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        {isSuccess ? (
          <div className="w-full py-3.5 rounded-2xl bg-[#1F8A5B] text-white font-bold text-xs flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Digital Rx Issued & Dispatched to Patient Phone!</span>
          </div>
        ) : (
          <button
            disabled={isSubmitting || items.length === 0}
            onClick={handleSignAndIssue}
            className="w-full py-3.5 rounded-2xl bg-[#D9673A] text-white font-extrabold text-xs flex items-center justify-center gap-2 hover:bg-[#c25930] active:scale-98 transition-all shadow-md"
          >
            <FileSignature className="w-4 h-4" />
            <span>{isSubmitting ? 'Signing & Encrypting...' : 'Digitally Sign & Issue Rx'}</span>
          </button>
        )}
      </div>
    </div>
  );
}
