import { useState } from 'react';
import { TabBar, TabItem } from '../../components/common/TabBar';
import { PatientHome } from './PatientHome';
import { PatientDoctors } from './PatientDoctors';
import { PatientFloatRx } from './PatientFloatRx';
import { PatientLiveBids } from './PatientLiveBids';
import { PatientOrders } from './PatientOrders';
import { PatientProfile } from './PatientProfile';
import { Home, Users, Plus, PackageCheck, UserCircle } from 'lucide-react';
import { Role } from '../../types';

interface PatientAppProps {
  onSwitchRole?: (role: Role) => void;
  dark?: boolean;
}

export function PatientApp({ onSwitchRole, dark = false }: PatientAppProps) {
  const [activeTab, setActiveTab] = useState<string>('Home');
  const [liveFloatId, setLiveFloatId] = useState<string | undefined>(undefined);
  const [preselectedRxId, setPreselectedRxId] = useState<string | undefined>(undefined);

  const tabs: TabItem[] = [
    { id: 'Home', label: 'Home', icon: Home },
    { id: 'Doctors', label: 'Doctors', icon: Users },
    { id: 'FloatRx', label: 'Float Rx', icon: Plus, isCenterCTA: true },
    { id: 'Orders', label: 'Orders', icon: PackageCheck },
    { id: 'Profile', label: 'Profile', icon: UserCircle }
  ];

  const handleNavigate = (tab: string, meta?: any) => {
    if (tab === 'LiveBids') {
      if (meta?.floatId) setLiveFloatId(meta.floatId);
      setActiveTab('LiveBids');
      return;
    }
    if (tab === 'FloatRx' && meta?.selectedRxId) {
      setPreselectedRxId(meta.selectedRxId);
    }
    setActiveTab(tab);
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden">
      {/* Content Area */}
      <div className="relative flex-1 overflow-hidden flex flex-col">
        {activeTab === 'Home' && <PatientHome onNavigate={handleNavigate} />}
        {activeTab === 'Doctors' && <PatientDoctors />}
        {activeTab === 'FloatRx' && (
          <PatientFloatRx
            preselectedRxId={preselectedRxId}
            onLaunched={(fId) => {
              setLiveFloatId(fId);
              setActiveTab('LiveBids');
            }}
          />
        )}
        {activeTab === 'LiveBids' && (
          <PatientLiveBids
            floatId={liveFloatId}
            onViewOrders={() => setActiveTab('Orders')}
          />
        )}
        {activeTab === 'Orders' && <PatientOrders />}
        {activeTab === 'Profile' && <PatientProfile onSwitchRole={onSwitchRole} />}
      </div>

      {/* 5-Tab Floating Glass TabBar */}
      <TabBar
        role="patient"
        tabs={tabs}
        activeTab={activeTab === 'LiveBids' ? 'FloatRx' : activeTab}
        onSelectTab={(tabId) => setActiveTab(tabId)}
        dark={dark}
      />
    </div>
  );
}
