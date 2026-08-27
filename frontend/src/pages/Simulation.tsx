import React from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { Sliders, Thermometer, Gauge, Compass, Zap, HelpCircle } from 'lucide-react';

export const Simulation: React.FC = () => {
  const { currentTelemetry, simulationInputs, setSimulationInputs } = useTelemetry();

  // Handle slider modifications
  const handleSliderChange = (key: keyof typeof simulationInputs, value: number) => {
    setSimulationInputs(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Basic mock formulas demonstrating wear acceleration rate
  const calculateMockWearAcceleration = () => {
    const throttleFactor = Math.pow(simulationInputs.throttle / 75, 2);
    const altFactor = 1 + (simulationInputs.altitude / 10000) * 0.2;
    const octaneFactor = 100 / simulationInputs.fuelOctane;
    return Math.round(1.0 * throttleFactor * altFactor * octaneFactor * 10) / 10;
  };

  const wearAccel = calculateMockWearAcceleration();

  return (
    <div className="space-y-6">
      
      {/* Simulation Architecture Disclaimer banner */}
      <div className="bg-amber-50 text-amber-900 border border-amber-200 rounded-lg p-5 flex flex-col md:flex-row items-start gap-4 select-none">
        <div className="bg-white/80 p-2.5 rounded-lg border border-amber-200 shrink-0">
          <HelpCircle className="w-6 h-6 text-amber-600" />
        </div>
        <div>
          <h3 className="text-sm font-bold">Prototyping Sandbox (Client-Side Math)</h3>
          <p className="text-xs text-amber-800 font-medium mt-0.5 leading-relaxed">
            <strong>Architecture Notice:</strong> The slider calculations shown below run client-side to demonstrate HMI behaviour. 
            They are isolated from the core Digital Twin. In the final system, these parameters will trigger 
            physics-based thermodynamics algorithms (using Python, NumPy, and SciPy) hosted as FastAPI microservices.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Sliders Control Panel */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 xl:col-span-2 space-y-6">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 mb-2 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-slate-700" />
            What-If Parameters Configurator
          </h3>

          <div className="space-y-5">
            {/* Slider 1: Throttle */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1.5">
                <span className="flex items-center gap-1">Command Throttle</span>
                <span className="font-mono text-slate-950 font-bold">{simulationInputs.throttle}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={simulationInputs.throttle} 
                onChange={(e) => handleSliderChange('throttle', parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-900 border border-slate-200"
              />
              <div className="flex justify-between text-[9px] font-bold text-slate-400 mt-1 select-none font-mono">
                <span>0% (IDLE)</span>
                <span>50%</span>
                <span>100% (WOT)</span>
              </div>
            </div>

            {/* Slider 2: Target RPM */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1.5">
                <span className="flex items-center gap-1">Target Governor RPM</span>
                <span className="font-mono text-slate-950 font-bold">{simulationInputs.targetRpm} RPM</span>
              </div>
              <input 
                type="range" 
                min="1000" 
                max="3000" 
                step="50"
                value={simulationInputs.targetRpm} 
                onChange={(e) => handleSliderChange('targetRpm', parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-900 border border-slate-200"
              />
              <div className="flex justify-between text-[9px] font-bold text-slate-400 mt-1 select-none font-mono">
                <span>1000 RPM</span>
                <span>2000 RPM</span>
                <span>3000 RPM (REDLINE)</span>
              </div>
            </div>

            {/* Slider 3: Altitude */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1.5">
                <span className="flex items-center gap-1">Simulation Flight Altitude</span>
                <span className="font-mono text-slate-950 font-bold">{simulationInputs.altitude.toLocaleString()} ft</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="18000" 
                step="500"
                value={simulationInputs.altitude} 
                onChange={(e) => handleSliderChange('altitude', parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-900 border border-slate-200"
              />
              <div className="flex justify-between text-[9px] font-bold text-slate-400 mt-1 select-none font-mono">
                <span>0 ft (SEA LEVEL)</span>
                <span>9000 ft</span>
                <span>18000 ft (MAX CEILING)</span>
              </div>
            </div>

            {/* Slider 4: Ambient Temp */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1.5">
                <span className="flex items-center gap-1">Ambient Temperature</span>
                <span className="font-mono text-slate-950 font-bold">{simulationInputs.ambientTemp} °C</span>
              </div>
              <input 
                type="range" 
                min="-50" 
                max="45" 
                value={simulationInputs.ambientTemp} 
                onChange={(e) => handleSliderChange('ambientTemp', parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-900 border border-slate-200"
              />
              <div className="flex justify-between text-[9px] font-bold text-slate-400 mt-1 select-none font-mono">
                <span>-50 °C (COLD ALPS)</span>
                <span>0 °C</span>
                <span>45 °C (DESERT RUN)</span>
              </div>
            </div>

            {/* Slider 5: Fuel Octane */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1.5">
                <span className="flex items-center gap-1">Fuel Octane Rating</span>
                <span className="font-mono text-slate-950 font-bold">{simulationInputs.fuelOctane} Octane</span>
              </div>
              <input 
                type="range" 
                min="80" 
                max="110" 
                value={simulationInputs.fuelOctane} 
                onChange={(e) => handleSliderChange('fuelOctane', parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-900 border border-slate-200"
              />
              <div className="flex justify-between text-[9px] font-bold text-slate-400 mt-1 select-none font-mono">
                <span>80 Octane (Low quality)</span>
                <span>95 Octane (Nominal)</span>
                <span>110 (Aviation Gas)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Prediction Results Panel */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col justify-between h-[480px]">
          <div>
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-600" />
              Predicted Engine Response
            </h3>

            <div className="space-y-4 text-xs font-semibold text-slate-500">
              <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                <span className="flex items-center gap-1.5"><Gauge className="w-4 h-4 text-slate-700" /> Crankshaft Speed</span>
                <span className="font-mono text-slate-900 font-bold">{currentTelemetry.rpm} RPM</span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                <span className="flex items-center gap-1.5"><Thermometer className="w-4 h-4 text-slate-700" /> Cyl Head Temp (CHT)</span>
                <span className={`font-mono font-bold ${currentTelemetry.cht > 410 ? 'text-red-600' : 'text-slate-900'}`}>{currentTelemetry.cht} °F</span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                <span className="flex items-center gap-1.5"><Thermometer className="w-4 h-4 text-slate-700" /> Exhaust Gas Temp (EGT)</span>
                <span className="font-mono text-slate-900 font-bold">{currentTelemetry.egt} °F</span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                <span className="flex items-center gap-1.5"><Compass className="w-4 h-4 text-slate-700" /> Fuel Flow</span>
                <span className="font-mono text-slate-900 font-bold">{currentTelemetry.fuelFlow} GPH</span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <span className="block">Engine Wear Multiplier</span>
                  <span className="text-[10px] text-slate-400 font-medium">Degradation rate speed scale</span>
                </div>
                <span className={`font-mono text-base font-bold ${wearAccel > 1.5 ? 'text-amber-600' : 'text-slate-900'}`}>{wearAccel}x</span>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 font-medium select-none bg-slate-50 p-3 rounded-lg border border-slate-200/50 mt-4 leading-normal">
            <strong>Notes:</strong> Changing variables triggers real-time values update on all pages. Exit simulated state by normalizing variables to baseline values (75% throttle, 8500 ft altitude, -10°C ambient).
          </div>
        </div>

      </div>

    </div>
  );
};
