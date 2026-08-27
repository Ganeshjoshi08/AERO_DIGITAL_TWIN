import React from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { TelemetryChart } from '../components/TelemetryChart';
import { 
  CheckCircle, 
  TrendingUp, 
  Clock, 
  Gauge, 
  Thermometer, 
  Droplet, 
  Fuel, 
  AlertTriangle, 
  Cpu, 
  Activity,
  Zap,
  Hammer,
  HelpCircle
} from 'lucide-react';

export const Overview: React.FC = () => {
  const { currentTelemetry, alerts, triggerMockFault, acknowledgeAlert } = useTelemetry();

  // Helper to format anomaly score badge
  const getAnomalyBadge = (score: number) => {
    if (score < 0.2) return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-green-50 text-green-700 border border-green-200">Low</span>;
    if (score < 0.6) return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">Moderate</span>;
    return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-red-50 text-red-700 border border-red-200">High</span>;
  };

  // Helper for alert colors
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'WARNING':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Simulation Banner Notice (Requirement: Do not claim mock values are real) */}
      <div className="bg-blue-50/50 border border-blue-200/60 rounded-lg p-3 px-4 flex items-center justify-between text-xs text-blue-800 font-medium">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
          <span><strong>System Notice:</strong> AeroTwin is currently running in <strong>Simulation Sandbox Mode</strong> using mock telemetry and mock AI services for frontend layout demonstration.</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 bg-blue-100/80 px-2 py-0.5 rounded font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
          DEMO ACTIVE
        </div>
      </div>

      {/* Row 1: Parameter Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 select-none">
        
        {/* Engine Status */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between h-[100px]">
          <div className="flex items-center justify-between text-slate-400 font-medium text-xs">
            <span>Engine Status</span>
            <CheckCircle className={`w-4 h-4 ${currentTelemetry.engineStatus === 'RUNNING' ? 'text-emerald-500' : currentTelemetry.engineStatus === 'FAULT' ? 'text-red-500' : 'text-amber-500'}`} />
          </div>
          <div className={`text-sm font-bold font-mono tracking-tight ${
            currentTelemetry.engineStatus === 'RUNNING' ? 'text-emerald-600' : currentTelemetry.engineStatus === 'FAULT' ? 'text-red-600' : 'text-amber-600'
          }`}>
            {currentTelemetry.engineStatus}
          </div>
        </div>

        {/* Health Index */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between h-[100px]">
          <div className="flex items-center justify-between text-slate-400 font-medium text-xs">
            <span>Health Index</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900">
            {currentTelemetry.healthIndex}%
          </div>
        </div>

        {/* RUL */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between h-[100px]">
          <div className="flex items-center justify-between text-slate-400 font-medium text-xs">
            <span>RUL</span>
            <Clock className="w-4 h-4 text-slate-900" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 whitespace-nowrap">
            {currentTelemetry.rulCycles} <span className="text-xs text-slate-500">Cycles</span>
          </div>
        </div>

        {/* RPM */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between h-[100px]">
          <div className="flex items-center justify-between text-slate-400 font-medium text-xs">
            <span>RPM</span>
            <Gauge className="w-4 h-4 text-slate-800" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900">
            {currentTelemetry.rpm} <span className="text-xs text-slate-500">RPM</span>
          </div>
        </div>

        {/* EGT */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between h-[100px]">
          <div className="flex items-center justify-between text-slate-400 font-medium text-xs">
            <span>EGT</span>
            <Thermometer className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900">
            {currentTelemetry.egt} <span className="text-xs text-slate-500">°F</span>
          </div>
        </div>

        {/* CHT */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between h-[100px]">
          <div className="flex items-center justify-between text-slate-400 font-medium text-xs">
            <span>CHT</span>
            <Thermometer className="w-4 h-4 text-slate-900" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900">
            {currentTelemetry.cht} <span className="text-xs text-slate-500">°F</span>
          </div>
        </div>

        {/* Oil Pressure */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between h-[100px]">
          <div className="flex items-center justify-between text-slate-400 font-medium text-xs">
            <span>Oil Pressure</span>
            <Droplet className="w-4 h-4 text-slate-900" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900">
            {currentTelemetry.oilPressure} <span className="text-xs text-slate-500">PSI</span>
          </div>
        </div>

        {/* Fuel Flow */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between h-[100px]">
          <div className="flex items-center justify-between text-slate-400 font-medium text-xs">
            <span>Fuel Flow</span>
            <Fuel className="w-4 h-4 text-slate-800" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900">
            {currentTelemetry.fuelFlow} <span className="text-xs text-slate-500">GPH</span>
          </div>
        </div>

      </div>

      {/* Row 2: Live Telemetry Chart */}
      <div className="h-[320px]">
        <TelemetryChart />
      </div>

      {/* Row 3: Bottom Subsystems and Data Panels Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Digital Twin Preview & Alerts */}
        <div className="space-y-6 flex flex-col">
          
          {/* Digital Twin Preview */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col flex-1">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-slate-700" />
                Digital Twin Preview
              </h3>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                <Activity className="w-3.5 h-3.5 animate-spin" />
                Residual Sync
              </div>
            </div>

            {/* Schematic rendering of the twin */}
            <div className="flex-1 flex flex-col justify-center items-center py-2 bg-slate-50 border border-slate-200/50 rounded-lg relative overflow-hidden">
              <svg viewBox="0 0 320 160" className="w-11/12 h-auto max-w-[280px]">
                {/* Engine Block Outline */}
                <rect x="50" y="30" width="220" height="90" rx="10" fill="none" stroke="#64748b" strokeWidth="2.5" strokeDasharray="3,3" />
                {/* Cylinders */}
                {[0, 1, 2, 3].map((cylIdx) => {
                  const xPos = 75 + cylIdx * 48;
                  const isAnomaly = cylIdx === 2 && currentTelemetry.anomalyScore > 0.4;
                  return (
                    <g key={cylIdx}>
                      {/* Cylinder wall */}
                      <rect x={xPos} y="40" width="34" height="60" rx="4" fill={isAnomaly ? '#fef2f2' : '#ffffff'} stroke={isAnomaly ? '#ef4444' : '#94a3b8'} strokeWidth="1.5" />
                      {/* Piston head */}
                      <rect x={xPos + 3} y={isAnomaly ? "48" : "55"} width="28" height="15" rx="2" fill={isAnomaly ? '#fee2e2' : '#cbd5e1'} stroke={isAnomaly ? '#ef4444' : '#64748b'} strokeWidth="1.5" />
                      {/* Cylinder labels */}
                      <text x={xPos + 17} y="115" textAnchor="middle" className="text-[9px] font-bold font-mono fill-slate-500">Cyl {cylIdx + 1}</text>
                      {/* Cylinder specific data */}
                      <text x={xPos + 17} y="72" textAnchor="middle" className={`text-[8px] font-bold font-mono ${isAnomaly ? 'fill-red-600' : 'fill-slate-900'}`}>
                        {cylIdx === 2 ? `${currentTelemetry.cht + 15}°F` : `${currentTelemetry.cht - 10}°F`}
                      </text>
                    </g>
                  );
                })}
                
                {/* Crankshaft */}
                <line x1="60" y1="90" x2="260" y2="90" stroke="#475569" strokeWidth="3" />
                <circle cx="160" cy="90" r="8" fill="#475569" />
              </svg>

              {/* Status Badge Overlays */}
              <div className="absolute top-2 left-2 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded select-none">
                System: Active
              </div>
              <div className={`absolute bottom-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded select-none ${
                currentTelemetry.anomalyScore > 0.4 ? 'bg-red-500 text-white' : 'bg-slate-900 text-slate-200'
              }`}>
                Piston 3 - {currentTelemetry.anomalyScore > 0.4 ? 'DEGRADED' : 'OPTIMAL'}
              </div>
            </div>

            <div className="text-[11px] text-slate-500 font-medium mt-2 leading-relaxed text-center px-1">
              Residual monitoring tracks physical outputs against <strong>physics-expected values</strong> in real time.
            </div>
          </div>

          {/* Alerts & Events */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col h-[200px]">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3 shrink-0 border-b border-slate-100 pb-2">
              <AlertTriangle className="w-4 h-4 text-slate-700" />
              Alerts & Events
            </h3>
            
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {alerts.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-slate-400 font-medium">
                  No active system alerts.
                </div>
              ) : (
                alerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    className={`p-2 border rounded-lg flex items-start gap-2.5 transition-all text-xs ${getSeverityBadge(alert.severity)}`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between font-semibold">
                        <span className="uppercase text-[9px] tracking-wider">{alert.component}</span>
                        <span className="font-mono text-[9px] opacity-70">{alert.timestamp}</span>
                      </div>
                      <p className="mt-0.5 font-medium leading-normal">{alert.message}</p>
                      {!alert.acknowledged && (
                        <button 
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="mt-1 text-[9px] font-bold underline hover:opacity-85"
                        >
                          Acknowledge
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Middle Column: AI Intelligence & Mission Status */}
        <div className="space-y-6 flex flex-col">
          
          {/* AI Intelligence */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col flex-1">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
              <Zap className="w-4 h-4 text-indigo-600" />
              AI Intelligence
            </h3>

            <div className="space-y-4 flex-1 flex flex-col justify-between">
              
              {/* Anomaly Score */}
              <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                <span className="text-xs font-semibold text-slate-500">Anomaly Score</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold">{currentTelemetry.anomalyScore.toFixed(2)}</span>
                  {getAnomalyBadge(currentTelemetry.anomalyScore)}
                </div>
              </div>

              {/* Fault Prediction */}
              <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                <span className="text-xs font-semibold text-slate-500">Fault Prediction</span>
                <span className={`text-xs font-bold font-mono ${currentTelemetry.faultPrediction === 'None Detected' ? 'text-slate-500' : 'text-red-600'}`}>
                  {currentTelemetry.faultPrediction}
                </span>
              </div>

              {/* Degradation Status */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1.5">
                  <span>Engine Wear (Degradation)</span>
                  <span className="font-mono font-bold text-slate-800">{currentTelemetry.degradationStatus}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div 
                    className="h-full bg-slate-800 transition-all duration-500" 
                    style={{ width: `${currentTelemetry.degradationStatus}%` }}
                  ></div>
                </div>
              </div>

              {/* Model Confidence */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-semibold text-slate-500">Model Confidence</span>
                <span className="text-sm font-bold font-mono text-slate-800">{currentTelemetry.modelConfidence}%</span>
              </div>

            </div>
          </div>

          {/* Mission Status (Clean Grid Element layout, NOT floating!) */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col h-[200px]">
            <h3 className="text-sm font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">
              Mission Status
            </h3>
            
            <div className="grid grid-cols-2 gap-4 flex-1 text-xs">
              <div className="border border-slate-100 p-2.5 rounded-lg bg-slate-50/50">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Phase</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">{currentTelemetry.mission.phase}</span>
              </div>
              <div className="border border-slate-100 p-2.5 rounded-lg bg-slate-50/50">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Flight Time</span>
                <span className="font-bold font-mono text-slate-800 text-sm mt-0.5 block">{currentTelemetry.mission.flightTime}</span>
              </div>
              <div className="border border-slate-100 p-2.5 rounded-lg bg-slate-50/50">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Altitude</span>
                <span className="font-bold font-mono text-slate-800 text-sm mt-0.5 block">{currentTelemetry.mission.altitude.toLocaleString()} ft</span>
              </div>
              <div className="border border-slate-100 p-2.5 rounded-lg bg-slate-50/50">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Ambient</span>
                <span className="font-bold font-mono text-slate-800 text-sm mt-0.5 block">{currentTelemetry.mission.ambient} °C</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Subsystem Health & Fault Injector */}
        <div className="space-y-6 flex flex-col">
          
          {/* Subsystem Health */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col flex-1">
            <h3 className="text-sm font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">
              Subsystem Health
            </h3>

            <div className="space-y-4 flex-1 justify-center flex flex-col">
              {/* Thermal */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Thermometer className="w-3.5 h-3.5 text-slate-700" />
                    Thermal System
                  </span>
                  <span className="font-mono font-bold text-slate-800">{currentTelemetry.subsystemHealth.thermal}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${currentTelemetry.subsystemHealth.thermal}%` }}
                  ></div>
                </div>
              </div>

              {/* Fuel System */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Fuel className="w-3.5 h-3.5 text-slate-700" />
                    Fuel System
                  </span>
                  <span className="font-mono font-bold text-slate-800">{currentTelemetry.subsystemHealth.fuel}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${currentTelemetry.subsystemHealth.fuel}%` }}
                  ></div>
                </div>
              </div>

              {/* Electrical */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-slate-700" />
                    Electrical (Power grid)
                  </span>
                  <span className="font-mono font-bold text-slate-800">{currentTelemetry.subsystemHealth.electrical}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${currentTelemetry.subsystemHealth.electrical}%` }}
                  ></div>
                </div>
              </div>

              {/* Mechanical */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Hammer className="w-3.5 h-3.5 text-slate-700" />
                    Mechanical Assemblies
                  </span>
                  <span className="font-mono font-bold text-slate-800">{currentTelemetry.subsystemHealth.mechanical}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${currentTelemetry.subsystemHealth.mechanical}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Fault Injector Panel */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col h-[200px]">
            <h3 className="text-sm font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">
              Diagnostics Test Sandbox
            </h3>
            
            <p className="text-[11px] text-slate-500 font-medium mb-3">
              Trigger mock physical anomalies to verify residual deviation calculations, alarm indicators, and AI prognostics updates.
            </p>
            
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <button 
                onClick={() => triggerMockFault('Piston Degradation')}
                className="bg-amber-50 text-amber-700 border border-amber-200 rounded-lg p-2 hover:bg-amber-100 transition-colors"
              >
                Piston Hot Wear
              </button>
              <button 
                onClick={() => triggerMockFault('Oil Pressure Drop')}
                className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-2 hover:bg-red-100 transition-colors"
              >
                Oil Leak Drop
              </button>
              <button 
                onClick={() => triggerMockFault('Alternator Fault')}
                className="bg-orange-50 text-orange-700 border border-orange-200 rounded-lg p-2 hover:bg-orange-100 transition-colors"
              >
                Alternator Fail
              </button>
              <button 
                onClick={() => triggerMockFault('Normal')}
                className="bg-slate-100 text-slate-700 border border-slate-200 rounded-lg p-2 hover:bg-slate-200 transition-colors"
              >
                Clear/Normalize
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
