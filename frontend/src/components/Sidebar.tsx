import React from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  Binary, 
  ShieldAlert, 
  TrendingUp, 
  History, 
  Sliders, 
  FileText, 
  Settings,
  Plane
} from 'lucide-react';

export type ActiveTab = 
  | 'overview' 
  | 'monitoring' 
  | 'twin' 
  | 'faults' 
  | 'ai_rul' 
  | 'replay' 
  | 'simulation' 
  | 'reports' 
  | 'settings';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'monitoring', label: 'Live Monitoring', icon: Activity },
    { id: 'twin', label: 'Digital Twin', icon: Binary },
    { id: 'faults', label: 'Health & Faults', icon: ShieldAlert },
    { id: 'ai_rul', label: 'AI/RUL', icon: TrendingUp },
    { id: 'replay', label: 'Mission Replay', icon: History },
    { id: 'simulation', label: 'Simulation', icon: Sliders },
    { id: 'reports', label: 'Reports', icon: FileText },
  ] as const;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen select-none shrink-0">
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-100">
        <div className="bg-slate-900 text-white p-2 rounded-lg">
          <Plane className="w-6 h-6 rotate-45" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-none">AeroTwin</h1>
          <span className="text-[11px] text-slate-500 font-medium tracking-wide uppercase">Aerospace Systems</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${
                isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
              }`} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Bottom Settings Link */}
      <div className="p-4 border-t border-slate-100">
        <button
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 group ${
            activeTab === 'settings'
              ? 'bg-blue-50 text-blue-600 font-semibold'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <Settings className={`w-5 h-5 shrink-0 ${
            activeTab === 'settings' ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
          }`} />
          Settings
        </button>
      </div>
    </aside>
  );
};
