import { useState } from 'react';
import { TelemetryProvider } from './context/TelemetryContext';
import { Sidebar } from './components/Sidebar';
import type { ActiveTab } from './components/Sidebar';
import { Header } from './components/Header';
import { Overview } from './pages/Overview';
import { LiveMonitoring } from './pages/LiveMonitoring';
import { DigitalTwin } from './pages/DigitalTwin';
import { HealthFaults } from './pages/HealthFaults';
import { AiRul } from './pages/AiRul';
import { MissionReplay } from './pages/MissionReplay';
import { Simulation } from './pages/Simulation';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import './App.css';

function AppContent() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  // Render the current view page
  const renderActiveView = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview />;
      case 'monitoring':
        return <LiveMonitoring />;
      case 'twin':
        return <DigitalTwin />;
      case 'faults':
        return <HealthFaults />;
      case 'ai_rul':
        return <AiRul />;
      case 'replay':
        return <MissionReplay />;
      case 'simulation':
        return <Simulation />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      {/* Navigation Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Panel Content Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header activeTab={activeTab} />
        
        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto p-8 max-w-[1400px] w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <TelemetryProvider>
      <AppContent />
    </TelemetryProvider>
  );
}
