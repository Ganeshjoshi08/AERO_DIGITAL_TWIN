import { Bell, HelpCircle, User, Wifi, WifiOff } from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';
import type { ActiveTab } from './Sidebar';

interface HeaderProps {
  activeTab: ActiveTab;
}

export const Header: React.FC<HeaderProps> = ({ activeTab }) => {
  const { isConnected, connectionStatus, currentTelemetry, alerts, toggleConnection } = useTelemetry();

  // Map active tab to reader-friendly title
  const getTitle = () => {
    switch (activeTab) {
      case 'overview':
        return 'Engine Overview';
      case 'monitoring':
        return 'Live Monitoring';
      case 'twin':
        return 'Digital Twin Sync';
      case 'faults':
        return 'Health & Diagnostics';
      case 'ai_rul':
        return 'AI Prognostics & RUL';
      case 'replay':
        return 'Mission Replay';
      case 'simulation':
        return 'What-If Simulation';
      case 'reports':
        return 'Mission Performance Reports';
      case 'settings':
        return 'System Settings';
      default:
        return 'Engine Overview';
    }
  };

  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);

  const activeStatus = connectionStatus || (isConnected ? 'CONNECTED' : 'DISCONNECTED');

  const getStatusStyles = () => {
    switch (activeStatus) {
      case 'CONNECTED':
        return 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100';
      case 'CONNECTING':
        return 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 animate-pulse';
      case 'DISCONNECTED':
      default:
        return 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100';
    }
  };

  const getStatusText = () => {
    switch (activeStatus) {
      case 'CONNECTED':
        return 'Status: Connected';
      case 'CONNECTING':
        return 'Status: Connecting...';
      case 'DISCONNECTED':
      default:
        return 'Status: Disconnected';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 select-none">
      {/* Page Title & Navigation Info */}
      <div className="flex items-center gap-8">
        <h2 className="text-xl font-bold text-slate-900">{getTitle()}</h2>
        
        <div className="hidden md:flex items-center gap-6 text-sm">
          <div className="flex flex-col relative py-4">
            <span className="font-semibold text-slate-800">Engine ID: {currentTelemetry.mission.id === 'Alpha-7' ? 'NX-204' : 'SIM-001'}</span>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-950"></div>
          </div>
          
          <div className="text-slate-500 font-medium">
            Mission: <span className="text-slate-800 font-semibold">{currentTelemetry.mission.id}</span>
          </div>

          <button 
            onClick={toggleConnection}
            title="Click to toggle telemetry stream connection"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-200 border ${getStatusStyles()}`}
          >
            {activeStatus === 'DISCONNECTED' ? (
              <>
                <WifiOff className="w-3.5 h-3.5" />
                {getStatusText()}
              </>
            ) : (
              <>
                <Wifi className={`w-3.5 h-3.5 ${activeStatus === 'CONNECTING' ? 'animate-pulse' : ''}`} />
                {getStatusText()}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Header Quick Controls */}
      <div className="flex items-center gap-4">
        {/* Alerts & Notifications */}
        <div className="relative">
          <button className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors relative">
            <Bell className="w-5 h-5" />
            {unacknowledgedAlerts.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            )}
          </button>
        </div>

        {/* Help Center */}
        <button className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-200"></div>

        {/* Profile */}
        <button className="flex items-center gap-2 px-3 py-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
          <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
            <User className="w-4 h-4 text-slate-500" />
          </div>
          <span className="text-sm font-semibold">Profile</span>
        </button>
      </div>
    </header>
  );
};
