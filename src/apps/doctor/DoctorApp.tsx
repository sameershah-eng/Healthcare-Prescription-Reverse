import { useState } from 'react';
import { TabBar, TabItem } from '../../components/common/TabBar';
import { DoctorToday } from './DoctorToday';
import { DoctorCalendar } from './DoctorCalendar';
import { DoctorIssueRx } from './DoctorIssueRx';
import { DoctorPatients } from './DoctorPatients';
import { DoctorProfile } from './DoctorProfile';
import { CalendarCheck, CalendarDays, Plus, Users, UserCircle } from 'lucide-react';
import { Role } from '../../types';

interface DoctorAppProps {
  onSwitchRole?: (role: Role) => void;
  dark?: boolean;
}

export function DoctorApp({ onSwitchRole, dark = false }: DoctorAppProps) {
  const [activeTab, setActiveTab] = useState<string>('Today');
  const [targetPatientName, setTargetPatientName] = useState<string>('Tendai Moyo');

  const tabs: TabItem[] = [
    { id: 'Today', label: 'Today', icon: CalendarCheck },
    { id: 'Calendar', label: 'Calendar', icon: CalendarDays },
    { id: 'IssueRx', label: 'Issue Rx', icon: Plus, isCenterCTA: true },
    { id: 'Patients', label: 'Patients', icon: Users },
    { id: 'Profile', label: 'Profile', icon: UserCircle }
  ];

  const handleNavigate = (tab: string, meta?: any) => {
    if (tab === 'IssueRx' && meta?.patientName) {
      setTargetPatientName(meta.patientName);
    }
    setActiveTab(tab);
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden">
      {/* Content Area */}
      <div className="relative flex-1 overflow-hidden flex flex-col">
        {activeTab === 'Today' && <DoctorToday onNavigate={handleNavigate} />}
        {activeTab === 'Calendar' && <DoctorCalendar />}
        {activeTab === 'IssueRx' && (
          <DoctorIssueRx
            defaultPatientName={targetPatientName}
            onIssuedSuccess={() => setActiveTab('Today')}
          />
        )}
        {activeTab === 'Patients' && (
          <DoctorPatients
            onIssueRxForPatient={(pName) => {
              setTargetPatientName(pName);
              setActiveTab('IssueRx');
            }}
          />
        )}
        {activeTab === 'Profile' && <DoctorProfile onSwitchRole={onSwitchRole} />}
      </div>

      {/* 5-Tab Floating Glass TabBar */}
      <TabBar
        role="doctor"
        tabs={tabs}
        activeTab={activeTab}
        onSelectTab={(tabId) => setActiveTab(tabId)}
        dark={dark}
      />
    </div>
  );
}
