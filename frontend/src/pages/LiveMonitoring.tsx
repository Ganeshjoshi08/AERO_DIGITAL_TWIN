import React, { useState } from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { ShieldCheck, ShieldAlert, Battery, Thermometer, Gauge, Fuel } from 'lucide-react';

export const LiveMonitoring: React.FC = () => {
  const { currentTelemetry } = useTelemetry();
  const [filterCategory, setFilterCategory] = useState<'ALL' | 'CORE' | 'FLUIDS' | 'AVIONICS' | 'ENV'>('ALL');

  // Define parameter limits for status color checks
  const paramSpecs = [
    { id: 'rpm', name: 'Engine Speed', value: currentTelemetry.rpm, unit: 'RPM', category: 'CORE', min: 1000, max: 2750 },
    { id: 'cht', name: 'Cylinder Head Temp (CHT)', value: currentTelemetry.cht, unit: '°F', category: 'CORE', min: 280, max: 420 },
    { id: 'egt', name: 'Exhaust Gas Temp (EGT)', value: currentTelemetry.egt, unit: '°F', category: 'CORE', min: 1100, max: 1600 },
    { id: 'oilPressure', name: 'Engine Oil Pressure', value: currentTelemetry.oilPressure, unit: 'PSI', category: 'FLUIDS', min: 45, max: 85 },
    { id: 'oilTemperature', name: 'Engine Oil Temp', value: currentTelemetry.oilTemperature, unit: '°F', category: 'FLUIDS', min: 160, max: 230 },
    { id: 'fuelFlow', name: 'Fuel Consumption Rate', value: currentTelemetry.fuelFlow, unit: 'GPH', category: 'FLUIDS', min: 4.0, max: 15.0 },
    { id: 'vibration', name: 'Torsional Vibration', value: currentTelemetry.vibration, unit: 'g', category: 'CORE', min: 0.2, max: 2.2 },
    { id: 'batteryVoltage', name: 'Avionics Battery Voltage', value: currentTelemetry.batteryVoltage, unit: 'V', category: 'AVIONICS', min: 24.0, max: 29.5 },
    { id: 'injectionTiming', name: 'Ignition/Injection Timing', value: currentTelemetry.injectionTiming, unit: '°BTDC', category: 'CORE', min: 14.0, max: 22.0 },
    { id: 'throttlePosition', name: 'Command Throttle Position', value: currentTelemetry.throttlePosition, unit: '%', category: 'CORE', min: 0, max: 100 },
    { id: 'engineLoad', name: 'Calculated Engine Load', value: currentTelemetry.engineLoad, unit: '%', category: 'CORE', min: 0, max: 100 },
    { id: 'ambientTemperature', name: 'Ambient Temp (Outside)', value: currentTelemetry.ambientTemperature, unit: '°C', category: 'ENV', min: -55, max: 45 },
    { id: 'ambientPressure', name: 'Ambient Pressure', value: currentTelemetry.ambientPressure, unit: 'hPa', category: 'ENV', min: 300, max: 1020 },
    { id: 'altitude', name: 'UAV Flight Altitude', value: currentTelemetry.altitude, unit: 'ft', category: 'ENV', min: 0, max: 18000 },
    { id: 'fuelConsumed', name: 'Accumulated Fuel Consumed', value: currentTelemetry.fuelConsumed, unit: 'Gal', category: 'FLUIDS', min: 0, max: 60 },
  ];

  const filteredParams = paramSpecs.filter(p => filterCategory === 'ALL' || p.category === filterCategory);

  const getStatus = (val: number, min: number, max: number) => {
    if (val < min || val > max) return { text: 'OUT OF LIMITS', color: 'text-red-600 bg-red-50 border-red-200' };
    if (val < min + (max - min) * 0.1 || val > max - (max - min) * 0.1) return { text: 'NOMINAL (LIMIT)', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    return { text: 'NOMINAL', color: 'text-green-600 bg-green-50 border-green-200' };
  };

  // Helper to build responsive SVG Gauge arcs
  const renderGauge = (label: string, value: number, min: number, max: number, unit: string, icon: React.ReactNode, strokeColor = '#0e8ee9') => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    // Semi-circle gauge (180 deg)
    const strokeDasharray = `${circumference}`;
    const percent = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
    const strokeDashoffset = `${circumference - (percent / 100) * (circumference / 2)}`;

    return (
      <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col items-center select-none justify-between h-[180px]">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold uppercase">
          {icon}
          {label}
        </div>
        
        {/* SVG Circular Dial */}
        <div className="relative w-28 h-16 mt-2 overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 100 50">
            {/* Background Track */}
            <circle 
              cx="50" 
              cy="50" 
              r={radius} 
              fill="none" 
              stroke="#e2e8f0" 
              strokeWidth="10" 
              strokeDasharray={strokeDasharray}
              strokeDashoffset={circumference / 2}
              transform="rotate(-180 50 50)"
            />
            {/* Value fill arc */}
            <circle 
              cx="50" 
              cy="50" 
              r={radius} 
              fill="none" 
              stroke={strokeColor} 
              strokeWidth="10" 
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-180 50 50)"
              className="transition-all duration-300"
            />
          </svg>
          {/* Display readout text */}
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end">
            <span className="text-lg font-bold font-mono text-slate-800 leading-none">{value}</span>
            <span className="text-[9px] font-bold text-slate-400 mt-0.5">{unit}</span>
          </div>
        </div>

        <div className="text-[10px] text-slate-400 font-semibold font-mono">
          RANGE: {min} - {max} {unit}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Dial Gauges Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {renderGauge('Crankshaft Speed', currentTelemetry.rpm, 0, 3000, 'RPM', <Gauge className="w-3.5 h-3.5" />, currentTelemetry.rpm > 2750 ? '#ef4444' : '#0e8ee9')}
        {renderGauge('Cylinder Head Temp', currentTelemetry.cht, 0, 500, '°F', <Thermometer className="w-3.5 h-3.5" />, currentTelemetry.cht > 420 ? '#ef4444' : '#0f172a')}
        {renderGauge('Fuel Burn Rate', currentTelemetry.fuelFlow, 0, 20, 'GPH', <Fuel className="w-3.5 h-3.5" />, currentTelemetry.fuelFlow > 15 ? '#f59e0b' : '#10b981')}
        {renderGauge('Avionics Bus Voltage', currentTelemetry.batteryVoltage, 0, 32, 'V', <Battery className="w-3.5 h-3.5" />, currentTelemetry.batteryVoltage < 24.5 ? '#f59e0b' : '#0e8ee9')}
      </div>

      {/* Filter and Table View */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">ECU Sensor Parameters Log</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Real-time parameters parsed from CAN frames</p>
          </div>

          {/* Filtering Toggles */}
          <div className="flex flex-wrap gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-semibold text-slate-600 border border-slate-200">
            {[
              { id: 'ALL', label: 'All Sensors' },
              { id: 'CORE', label: 'Engine Core' },
              { id: 'FLUIDS', label: 'Fluids & Fuel' },
              { id: 'AVIONICS', label: 'Avionics Bus' },
              { id: 'ENV', label: 'Environment' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-md transition-all duration-150 ${
                  filterCategory === cat.id
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50'
                    : 'hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Parameter Grid Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold tracking-wider select-none">
                <th className="pb-3 pl-4">Parameter Name</th>
                <th className="pb-3">Subsystem</th>
                <th className="pb-3">Current Readout</th>
                <th className="pb-3">Safety Thresholds</th>
                <th className="pb-3 pr-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
              {filteredParams.map(param => {
                const status = getStatus(param.value, param.min, param.max);
                return (
                  <tr key={param.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 pl-4 font-bold text-slate-950">{param.name}</td>
                    <td className="py-3.5">
                      <span className="text-[10px] tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold uppercase">
                        {param.category}
                      </span>
                    </td>
                    <td className="py-3.5 font-mono text-slate-900">
                      {typeof param.value === 'number' ? param.value.toLocaleString() : param.value} <span className="text-xs text-slate-400 font-semibold">{param.unit}</span>
                    </td>
                    <td className="py-3.5 font-mono text-xs text-slate-400 font-medium">
                      {param.min} - {param.max} {param.unit}
                    </td>
                    <td className="py-3.5 pr-4 text-right">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${status.color}`}>
                        {status.text === 'NOMINAL' ? (
                          <ShieldCheck className="w-3.5 h-3.5" />
                        ) : (
                          <ShieldAlert className="w-3.5 h-3.5" />
                        )}
                        {status.text}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
