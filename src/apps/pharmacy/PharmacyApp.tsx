import { useState } from 'react';
import { TabBar, TabItem } from '../../components/common/TabBar';
import { PharmacyLiveRx } from './PharmacyLiveRx';
import { PharmacyMyBids } from './PharmacyMyBids';
import { PharmacyScan } from './PharmacyScan';
import { PharmacyOrders } from './PharmacyOrders';
import { PharmacyProfile } from './PharmacyProfile';
import { Radio, Trophy, QrCode, PackageCheck, Store } from 'lucide-react';
import { Role } from '../../types';

interface PharmacyAppProps {
  onSwitchRole?: (role: Role) => void;
  dark?: boolean;
}

export function PharmacyApp({ onSwitchRole, dark = false }: PharmacyAppProps) {
  const [activeTab, setActiveTab] = useState<string>('LiveRx');

  const tabs: TabItem[] = [
    { id: 'LiveRx', label: 'Live Rx', icon: Radio },
    { id: 'MyBids', label: 'My Bids', icon: Trophy },
    { id: 'Scan', label: 'Scan', icon: QrCode, isCenterCTA: true },
    { id: 'Orders', label: 'Orders', icon: PackageCheck },
    { id: 'Profile', label: 'Profile', icon: Store }
  ];

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden">
      {/* Content Area */}
      <div className="relative flex-1 overflow-hidden flex flex-col">
        {activeTab === 'LiveRx' && (
          <PharmacyLiveRx
            onNavigateToMyBids={() => setActiveTab('MyBids')}
          />
        )}
        {activeTab === 'MyBids' && (
          <PharmacyMyBids
            onViewOrder={() => setActiveTab('Orders')}
          />
        )}
        {activeTab === 'Scan' && (
          <PharmacyScan
            onSuccessCollected={() => setActiveTab('Orders')}
          />
        )}
        {activeTab === 'Orders' && <PharmacyOrders />}
        {activeTab === 'Profile' && <PharmacyProfile onSwitchRole={onSwitchRole} />}
      </div>

      {/* 5-Tab Floating Glass TabBar */}
      <TabBar
        role="pharmacy"
        tabs={tabs}
        activeTab={activeTab}
        onSelectTab={(tabId) => setActiveTab(tabId)}
        dark={dark}
      />
    </div>
  );
}
