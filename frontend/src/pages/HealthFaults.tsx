import React from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { ShieldAlert, AlertTriangle, CheckCircle, Info, FileText, Wrench } from 'lucide-react';

export const HealthFaults: React.FC = () => {
  const { currentTelemetry } = useTelemetry();

  // Hardcoded list of past completed repairs (Maintenance Log)
  const historicalFaults = [
    { id: 'f-1', date: '2026-08-15', component: 'FUEL SYSTEM', description: 'Fuel injection nozzle replacement on Cylinder 1 (rough idle)', resolution: 'Replaced nozzle assembly, calibrated flow rate' },
    { id: 'f-2', date: '2026-08-01', component: 'ELECTRICAL', description: 'Unstable battery voltage readout during takeoff climb', resolution: 'Tightened alternator ground cable, inspected fuses' },
    { id: 'f-3', date: '2026-07-12', component: 'MECHANICAL', description: 'Slight vibration increase at 2600 RPM cruise', resolution: 'Inspected propeller mounting bolts; torque adjustments done' },
  ];

  // Dynamically calculate diagnostics details based on the current engine state
  const getDiagnosticStatus = () => {
    if (currentTelemetry.anomalyScore > 0.8) {
      return {
        title: 'Immediate Inspection Required',
        description: `Severe performance deviation detected. Estimated fault: ${currentTelemetry.faultPrediction}.`,
        severity: 'CRITICAL',
        color: 'text-red-700 bg-red-50 border-red-200',
        recommendations: [
          'Perform immediately: Shut down engine operations and abort active flight profile.',
          'Drain and inspect engine oil for metallic contaminants (wear indicators).',
          'Inspect the primary oil pump pressure valves and oil line seals.'
        ]
      };
    } else if (currentTelemetry.anomalyScore > 0.4) {
      return {
        title: 'Maintenance Advisory Active',
        description: `Thermal or mechanical degradation noticed. Predicted fault: ${currentTelemetry.faultPrediction}.`,
        severity: 'WARNING',
        color: 'text-amber-700 bg-amber-50 border-amber-200',
        recommendations: [
          'Schedule a diagnostic check after current flight mission.',
          'Verify cylinder 3 thermocouple connections and cylinder head structure.',
          'Check oil coolant radiator for visual airflow blockage.'
        ]
      };
    }
    return {
      title: 'Subsystems Fully Functional',
      description: 'AI model parameters indicate all engine parts are within normal baseline thresholds.',
      severity: 'NOMINAL',
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      recommendations: [
        'Continue current mission parameters.',
        'Perform standard visual checks after 50 operating hours.',
        'Maintain current cruise throttle levels (75% commanded).'
      ]
    };
  };

  const diagnostic = getDiagnosticStatus();

  return (
    <div className="space-y-6">
      
      {/* Active Diagnostics Summary */}
      <div className={`border rounded-lg p-5 flex flex-col md:flex-row gap-5 justify-between select-none ${diagnostic.color}`}>
        <div className="flex items-start gap-4">
          <div className="bg-white/80 p-2.5 rounded-lg border border-inherit shrink-0">
            {diagnostic.severity === 'CRITICAL' ? (
              <ShieldAlert className="w-6 h-6 text-red-600 animate-bounce" />
            ) : diagnostic.severity === 'WARNING' ? (
              <AlertTriangle className="w-6 h-6 text-amber-600 animate-pulse" />
            ) : (
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            )}
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-85 block">Engine Diagnostics Status</span>
            <h3 className="text-base font-bold mt-0.5">{diagnostic.title}</h3>
            <p className="text-xs mt-1 leading-relaxed opacity-90">{diagnostic.description}</p>
          </div>
        </div>

        {/* AI metrics indicators */}
        <div className="flex gap-4 text-xs shrink-0 self-center md:self-auto font-semibold font-mono border-t border-slate-200/20 pt-4 md:pt-0 md:border-none">
          <div className="border-r border-slate-200/30 pr-4">
            <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block">Anomaly</span>
            <span className="text-sm font-bold mt-0.5 block">{currentTelemetry.anomalyScore.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block">Wear Rate</span>
            <span className="text-sm font-bold mt-0.5 block">{currentTelemetry.degradationStatus}%</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Maintenance Advisory Left, Fault List Right */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Maintenance Recommendations Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 xl:col-span-2">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-slate-700" />
            Active Maintenance Advisories
          </h3>

          <div className="space-y-4">
            <p className="text-xs text-slate-500 font-medium">
              Actions recommended by ground system prognostic algorithms to mitigate potential in-flight failures.
            </p>

            <ul className="space-y-3">
              {diagnostic.recommendations.map((rec, idx) => (
                <li key={idx} className="flex gap-3 text-xs font-semibold leading-relaxed text-slate-700 bg-slate-50 border border-slate-100 p-3 rounded-lg">
                  <span className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 shrink-0 select-none">
                    {idx + 1}
                  </span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
            
            <div className="flex items-center gap-2 bg-blue-50/50 p-3 rounded-lg border border-blue-100 text-[11px] text-blue-800 font-medium">
              <Info className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Calibrations are predicted based on XGBoost degradation forecasts. Maintenance advisory data is updated in real-time.</span>
            </div>
          </div>
        </div>

        {/* Right Side Stack: Subsystems Monitor & Repair Log */}
        <div className="space-y-6">
          
          {/* Subsystem Health Monitor */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-slate-700" />
              Subsystem Integrity Monitor
            </h3>
            
            <div className="space-y-3.5">
              {[
                { name: 'Mechanical Assemblies', key: 'mechanical' },
                { name: 'Combustion Chamber', key: 'combustion' },
                { name: 'Fuel Delivery System', key: 'fuel' },
                { name: 'Lubrication & Oil Loop', key: 'lubrication' },
                { name: 'Thermal Systems', key: 'thermal' },
                { name: 'Electrical Grid', key: 'electrical' },
                { name: 'Sensor Array Array', key: 'sensor' }
              ].map((sub) => {
                const score = currentTelemetry.subsystemHealth[sub.key as keyof typeof currentTelemetry.subsystemHealth] ?? 100;
                
                let badgeColor = 'text-emerald-700 bg-emerald-50 border-emerald-100';
                let badgeText = 'Nominal';
                let progressColor = 'bg-emerald-500';
                
                if (score < 70) {
                  badgeColor = 'text-red-700 bg-red-50 border-red-100';
                  badgeText = 'Fault';
                  progressColor = 'bg-red-500';
                } else if (score < 90) {
                  badgeColor = 'text-amber-700 bg-amber-50 border-amber-100';
                  badgeText = 'Monitor';
                  progressColor = 'bg-amber-500';
                }

                return (
                  <div key={sub.key} className="text-xs font-semibold">
                    <div className="flex items-center justify-between text-slate-500 mb-1">
                      <span>{sub.name}</span>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-slate-800 font-bold">{score}%</span>
                        <span className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border ${badgeColor}`}>
                          {badgeText}
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                      <div 
                        className={`h-full ${progressColor} transition-all duration-300`}
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Diagnostic Fault Log Card */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-700" />
            Completed Repair Log
          </h3>

          <div className="space-y-4 overflow-y-auto max-h-[300px] pr-1">
            {historicalFaults.map((log) => (
              <div key={log.id} className="border border-slate-100 p-3 rounded-lg hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400 mb-1">
                  <span>{log.date}</span>
                  <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold uppercase">{log.component}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-800">{log.description}</h4>
                <p className="text-[11px] text-slate-500 font-medium mt-1 leading-relaxed border-t border-slate-50 pt-1.5 mt-1.5">
                  <strong className="text-slate-700">Resolution:</strong> {log.resolution}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>

  </div>
  );
};
