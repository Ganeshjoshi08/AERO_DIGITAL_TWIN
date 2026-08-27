import React, { useState } from 'react';
import { Sliders, Save, RefreshCw, Eye } from 'lucide-react';

export const Settings: React.FC = () => {
  // Mock form states
  const [thresholds, setThresholds] = useState({
    chtWarning: 420,
    chtCritical: 450,
    egtWarning: 1550,
    egtCritical: 1650,
    oilWarning: 45,
    oilCritical: 35,
  });

  const [refreshRate, setRefreshRate] = useState('1Hz');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Settings saved. Safety alert thresholds updated in local cache.');
  };

  return (
    <div className="space-y-6">
      
      {/* Settings Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 select-none">
        
        {/* Left Col: Core thresholds */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-slate-700" />
            Safety Threshold Configuration
          </h3>

          <form onSubmit={handleSave} className="space-y-4 text-xs font-semibold text-slate-600">
            
            {/* Cylinder Head Temp (CHT) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-slate-50 pb-4">
              <div>
                <label className="block text-slate-500 mb-1.5">CHT Warning Limit (°F)</label>
                <input 
                  type="number" 
                  value={thresholds.chtWarning} 
                  onChange={(e) => setThresholds({ ...thresholds, chtWarning: parseInt(e.target.value) })}
                  className="w-full border border-slate-200 rounded-lg p-2.5 font-mono text-slate-900 bg-slate-50 focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1.5">CHT Critical Limit (°F)</label>
                <input 
                  type="number" 
                  value={thresholds.chtCritical} 
                  onChange={(e) => setThresholds({ ...thresholds, chtCritical: parseInt(e.target.value) })}
                  className="w-full border border-slate-200 rounded-lg p-2.5 font-mono text-slate-900 bg-slate-50 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Exhaust Gas Temp (EGT) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-slate-50 pb-4">
              <div>
                <label className="block text-slate-500 mb-1.5">EGT Warning Limit (°F)</label>
                <input 
                  type="number" 
                  value={thresholds.egtWarning} 
                  onChange={(e) => setThresholds({ ...thresholds, egtWarning: parseInt(e.target.value) })}
                  className="w-full border border-slate-200 rounded-lg p-2.5 font-mono text-slate-900 bg-slate-50 focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1.5">EGT Critical Limit (°F)</label>
                <input 
                  type="number" 
                  value={thresholds.egtCritical} 
                  onChange={(e) => setThresholds({ ...thresholds, egtCritical: parseInt(e.target.value) })}
                  className="w-full border border-slate-200 rounded-lg p-2.5 font-mono text-slate-900 bg-slate-50 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Oil Pressure */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2">
              <div>
                <label className="block text-slate-500 mb-1.5">Oil Pressure Low Warning (PSI)</label>
                <input 
                  type="number" 
                  value={thresholds.oilWarning} 
                  onChange={(e) => setThresholds({ ...thresholds, oilWarning: parseInt(e.target.value) })}
                  className="w-full border border-slate-200 rounded-lg p-2.5 font-mono text-slate-900 bg-slate-50 focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1.5">Oil Pressure Low Critical (PSI)</label>
                <input 
                  type="number" 
                  value={thresholds.oilCritical} 
                  onChange={(e) => setThresholds({ ...thresholds, oilCritical: parseInt(e.target.value) })}
                  className="w-full border border-slate-200 rounded-lg p-2.5 font-mono text-slate-900 bg-slate-50 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button 
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold text-white bg-slate-950 hover:bg-slate-800 transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                Save Threshold Parameters
              </button>
            </div>

          </form>
        </div>

        {/* Right Col: HMI config */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 mb-2 flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-slate-700" />
            HMI Sync Rate
          </h3>

          <div className="space-y-4 text-xs font-semibold text-slate-600">
            <div>
              <label className="block text-slate-500 mb-1.5">Telemetry Update Rate</label>
              <div className="grid grid-cols-3 gap-2 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                {['1Hz', '2Hz', '5Hz'].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setRefreshRate(rate)}
                    className={`py-2 rounded-md transition-all duration-150 ${
                      refreshRate === rate
                        ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {rate}
                  </button>
                ))}
              </div>
            </div>

            <div className="border border-slate-100 p-3 rounded-lg bg-slate-50/50 mt-4">
              <span className="flex items-center gap-1.5 text-slate-700"><Eye className="w-4 h-4" /> Interface Profile</span>
              <p className="text-[10px] text-slate-400 font-medium mt-1 leading-relaxed">
                Standard aerospace cockpit layout configured. Theme utilizes pure light values, prioritizing high contrast under outdoor ground station lighting conditions.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
