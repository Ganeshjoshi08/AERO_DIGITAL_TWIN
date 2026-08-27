import React from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { FileText, Printer, Download, Award, ShieldAlert } from 'lucide-react';

export const Reports: React.FC = () => {
  const { currentTelemetry } = useTelemetry();

  // Print function
  const handlePrint = () => {
    window.print();
  };

  const getSafetyGrade = () => {
    if (currentTelemetry.healthIndex >= 90) return { grade: 'A+', color: 'text-green-600 bg-green-50 border-green-200' };
    if (currentTelemetry.healthIndex >= 80) return { grade: 'A', color: 'text-blue-600 bg-blue-50 border-blue-200' };
    if (currentTelemetry.healthIndex >= 70) return { grade: 'B', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    return { grade: 'D', color: 'text-red-600 bg-red-50 border-red-200' };
  };

  const safety = getSafetyGrade();

  return (
    <div className="space-y-6 print:p-8 print:bg-white">
      
      {/* Reports controls */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 flex items-center justify-between gap-4 select-none print:hidden">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Post-Mission Flight Report Generator</h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Compile operational statistics, temperature cycles, and diagnostic safety reviews.
          </p>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Report
          </button>
          <button 
            onClick={() => alert('PDF export simulated successfully. Backend report service will receive request.')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Main printable report block */}
      <div className="bg-white border border-slate-200 rounded-lg p-8 space-y-8 print:border-none print:p-0">
        
        {/* Document Header */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-6 select-none">
          <div className="space-y-1">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">AEROTWIN ENGINE MISSION SUMMARY</h1>
            <p className="text-xs text-slate-400 font-semibold uppercase font-mono">MISSION RECORD: {currentTelemetry.mission.id} / PLATFORM: NX-204</p>
          </div>
          
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Generated On</span>
            <span className="font-mono text-xs font-bold text-slate-800">{new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Overview grids */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 select-none">
          
          {/* Performance Card */}
          <div className="border border-slate-100 p-4 rounded-lg bg-slate-50/50">
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-3">
              <span>Flight Performance</span>
              <FileText className="w-4 h-4 text-slate-400" />
            </div>
            
            <div className="space-y-2 text-xs font-semibold text-slate-600 font-mono">
              <div className="flex items-center justify-between">
                <span>Flight Duration</span>
                <span className="text-slate-900 font-bold">{currentTelemetry.mission.flightTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Fuel Consumed</span>
                <span className="text-slate-900 font-bold">{currentTelemetry.fuelConsumed} Gallons</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Ambient Mean Temp</span>
                <span className="text-slate-900 font-bold">{currentTelemetry.mission.ambient} °C</span>
              </div>
            </div>
          </div>

          {/* Engine Parameters Mean Card */}
          <div className="border border-slate-100 p-4 rounded-lg bg-slate-50/50">
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-3">
              <span>ECU Core Means</span>
              <FileText className="w-4 h-4 text-slate-400" />
            </div>
            
            <div className="space-y-2 text-xs font-semibold text-slate-600 font-mono">
              <div className="flex items-center justify-between">
                <span>Average Speed</span>
                <span className="text-slate-900 font-bold">{currentTelemetry.rpm} RPM</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Average CHT</span>
                <span className="text-slate-900 font-bold">{currentTelemetry.cht} °F</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Average EGT</span>
                <span className="text-slate-900 font-bold">{currentTelemetry.egt} °F</span>
              </div>
            </div>
          </div>

          {/* Safety Review Card */}
          <div className="border border-slate-100 p-4 rounded-lg bg-slate-50/50">
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-3">
              <span>Safety Assessment</span>
              <Award className="w-4 h-4 text-slate-400" />
            </div>
            
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-xl border ${safety.color}`}>
                {safety.grade}
              </div>
              <div className="text-xs font-semibold text-slate-600">
                <div>Health: <span className="text-slate-900 font-bold">{currentTelemetry.healthIndex}%</span></div>
                <div className="text-[10px] text-slate-400 font-medium mt-0.5">Anomaly threshold met: {currentTelemetry.anomalyScore > 0.4 ? 'WARNING' : 'NOMINAL'}</div>
              </div>
            </div>
          </div>

        </div>

        {/* AI Prognostic Report Section */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 select-none">
            Prognostic Degradation Analysis
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed font-semibold">
            Based on structural wear models and telemetry residuals tracking, the engine currently shows an anomaly index of 
            <strong className="text-slate-950"> {currentTelemetry.anomalyScore.toFixed(2)}</strong> and wear degradation of 
            <strong className="text-slate-950"> {currentTelemetry.degradationStatus}%</strong>. 
            The remaining useful life is estimated at 
            <strong className="text-slate-950"> {currentTelemetry.rulCycles}</strong> cycles. 
            {currentTelemetry.anomalyScore > 0.4 ? (
              <span className="text-amber-700 block mt-2 font-bold flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                Warning: Thermal anomalies on Cylinder 3 accelerate the expected wear rate. visual inspection is advised.
              </span>
            ) : (
              <span className="text-emerald-700 block mt-2 font-bold">
                Status: All parameters normal. No structural anomalies detected.
              </span>
            )}
          </p>
        </div>

        {/* Print Disclaimer */}
        <div className="border-t border-slate-200 pt-6 text-[10px] text-slate-400 font-medium select-none flex justify-between">
          <span>AeroTwin ground support software v2.1</span>
          <span>DRDO UAV propulsion monitoring systems</span>
        </div>

      </div>

    </div>
  );
};
