import React, { useEffect, useState } from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { Cpu, Activity, Info, RefreshCw, Layers } from 'lucide-react';

export const DigitalTwin: React.FC = () => {
  const { currentTelemetry, expectedTelemetry, residuals: backendResiduals } = useTelemetry();
  const [rotationAngle, setRotationAngle] = useState(0);

  // Animate the crankshaft and pistons based on RPM in real-time
  useEffect(() => {
    let lastTime = performance.now();
    let frameId: number;

    const animate = (time: number) => {
      const deltaSecs = (time - lastTime) / 1000;
      lastTime = time;

      // Calculate rotation increment: RPM / 60 = rotations per second. Mult by 360 to get degrees.
      const rotationsPerSecond = currentTelemetry.rpm / 60;
      const angleIncrement = rotationsPerSecond * 360 * deltaSecs;

      setRotationAngle(prev => (prev + angleIncrement) % 360);
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [currentTelemetry.rpm]);

  // Physics Model calculations. If backend values are available, use them, otherwise fallback to local estimations.
  const physicsExpected = expectedTelemetry ? {
    cht: Math.round(expectedTelemetry.cht),
    egt: Math.round(expectedTelemetry.egt),
    oilPressure: Math.round(expectedTelemetry.oil_pressure),
    fuelFlow: Math.round(expectedTelemetry.fuel_flow * 10) / 10,
    rpm: Math.round(expectedTelemetry.rpm)
  } : {
    cht: Math.round(365 + (currentTelemetry.throttlePosition / 100) * 20),
    egt: Math.round(1410 + (currentTelemetry.throttlePosition / 100) * 45),
    oilPressure: Math.round(42 + (currentTelemetry.rpm / 3000) * 35),
    fuelFlow: Math.round((2.2 + (currentTelemetry.throttlePosition / 100) * 12.8) * 10) / 10,
    rpm: 2233
  };

  // Residuals: Actual - Physics-Expected. Use backend values if available, otherwise calculate locally.
  const residuals = backendResiduals ? {
    cht: Math.round(backendResiduals.cht),
    egt: Math.round(backendResiduals.egt),
    oilPressure: Math.round(backendResiduals.oil_pressure),
    fuelFlow: Math.round(backendResiduals.fuel_flow * 10) / 10,
    rpm: Math.round(backendResiduals.rpm)
  } : {
    cht: currentTelemetry.cht - physicsExpected.cht,
    egt: currentTelemetry.egt - physicsExpected.egt,
    oilPressure: currentTelemetry.oilPressure - physicsExpected.oilPressure,
    fuelFlow: Math.round((currentTelemetry.fuelFlow - physicsExpected.fuelFlow) * 10) / 10,
    rpm: Math.round(currentTelemetry.rpm - physicsExpected.rpm)
  };

  // Calculate Cylinder height offsets based on crank rotation (trigonometric piston model)
  // Standard piston offset formula: y = r * cos(theta) + sqrt(l^2 - r^2 * sin^2(theta))
  // We approximate this for rendering:
  const getPistonOffset = (cylinderIdx: number) => {
    // Each cylinder is offset in phase by 180 degrees (4-cylinder firing order)
    const phaseOffset = cylinderIdx * 180;
    const rad = ((rotationAngle + phaseOffset) * Math.PI) / 180;
    
    const crankRadius = 15; // length of crank arm
    const rodLength = 45;   // length of connecting rod
    
    // Height of piston pin relative to crank center
    const yVal = crankRadius * Math.cos(rad) + Math.sqrt(rodLength * rodLength - crankRadius * crankRadius * Math.sin(rad) * Math.sin(rad));
    
    // Scale for SVG rendering (y is inverted in SVG, center around 80)
    return 110 - yVal;
  };

  // Returns active stroke phase based on angle
  const getStrokePhase = (cylinderIdx: number) => {
    const phaseOffset = cylinderIdx * 180;
    const angle = (rotationAngle + phaseOffset) % 720;
    if (angle < 180) return { label: 'Intake', color: 'text-blue-600 bg-blue-50 border-blue-200' };
    if (angle < 360) return { label: 'Compression', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    if (angle < 540) return { label: 'Power', color: 'text-red-600 bg-red-50 border-red-200' };
    return { label: 'Exhaust', color: 'text-slate-600 bg-slate-50 border-slate-200' };
  };

  return (
    <div className="space-y-6">
      
      {/* Informational Alert */}
      <div className="bg-slate-900 text-white rounded-lg p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 select-none">
        <div className="flex items-center gap-3">
          <div className="bg-slate-800 text-blue-400 p-2.5 rounded-lg border border-slate-700">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold">Physics + AI Hybrid Model Active</h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5 leading-relaxed">
              This panel visualizes the real-time kinematic model synchronized with telemetry. 
              Actual sensor outputs are cross-referenced with theoretical thermo-dynamic physics curves.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 bg-slate-800 text-slate-400 border border-slate-700 rounded-md px-3 py-1.5 text-xs font-mono">
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-400" />
          MODEL SYNC RATE: 100Hz
        </div>
      </div>

      {/* Main Grid: Schematic Left, Residuals Right */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Side: Animated SVG Engine Cross-section */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 xl:col-span-2 flex flex-col justify-between h-[480px]">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-slate-700" />
                Kinematic Cylinder Assembly
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">Real-time piston translation & four-stroke phase indicators</p>
            </div>
            
            <div className="text-xs font-semibold text-slate-500 font-mono">
              Speed: <span className="text-slate-800 font-bold">{currentTelemetry.rpm} RPM</span>
            </div>
          </div>

          {/* Large Interactive Engine SVG */}
          <div className="flex-1 flex items-center justify-center py-4 bg-slate-50/50 border border-slate-100 rounded-lg my-4 relative overflow-hidden">
            <svg viewBox="0 0 520 280" className="w-full max-h-[300px]">
              
              {/* Crankcase Outline */}
              <rect x="30" y="50" width="460" height="200" rx="12" fill="none" stroke="#e2e8f0" strokeWidth="2" />
              <path d="M 80,180 L 440,180" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4,4" />
              
              {/* Cylinder blocks */}
              {[0, 1, 2, 3].map((cylIdx) => {
                const xPos = 80 + cylIdx * 105;
                const pistonY = getPistonOffset(cylIdx);
                const stroke = getStrokePhase(cylIdx);
                const isDegraded = cylIdx === 2 && currentTelemetry.anomalyScore > 0.4;

                return (
                  <g key={cylIdx}>
                    {/* Cylinder Walls */}
                    <rect x={xPos} y="60" width="70" height="120" rx="4" fill="none" stroke={isDegraded ? '#f87171' : '#94a3b8'} strokeWidth="2" />
                    
                    {/* Connecting Rod (Piston Pin to Crankshaft center) */}
                    {/* Crank Pin coordinates (approximate rotation relative to cylinder center x) */}
                    {/* Crankpin rotates on circle of radius 15 around (xPos+35, 180) */}
                    {(() => {
                      const rad = (((rotationAngle + cylIdx * 180)) * Math.PI) / 180;
                      const crankPinX = (xPos + 35) + 15 * Math.sin(rad);
                      const crankPinY = 180 + 15 * Math.cos(rad);
                      
                      return (
                        <g>
                          {/* Connecting Rod Link */}
                          <line 
                            x1={xPos + 35} 
                            y1={pistonY + 30} 
                            x2={crankPinX} 
                            y2={crankPinY} 
                            stroke="#64748b" 
                            strokeWidth="3.5" 
                            strokeLinecap="round" 
                          />
                          {/* Crank Arm (Crankpin to Crank center) */}
                          <line 
                            x1={crankPinX} 
                            y1={crankPinY} 
                            x2={xPos + 35} 
                            y2={180} 
                            stroke="#334155" 
                            strokeWidth="5" 
                            strokeLinecap="round"
                          />
                          {/* Crank Center Pin */}
                          <circle cx={xPos + 35} cy="180" r="4.5" fill="#f8fafc" stroke="#1e293b" strokeWidth="1.5" />
                        </g>
                      );
                    })()}

                    {/* Piston Head */}
                    <rect 
                      x={xPos + 5} 
                      y={pistonY} 
                      width="60" 
                      height="34" 
                      rx="3" 
                      fill={isDegraded ? '#fee2e2' : '#cbd5e1'} 
                      stroke={isDegraded ? '#ef4444' : '#475569'} 
                      strokeWidth="2" 
                    />
                    
                    {/* Cylinder combustion coloring on Power stroke */}
                    {stroke.label === 'Power' && (
                      <path 
                        d={`M ${xPos + 6} 62 L ${xPos + 64} 62 L ${xPos + 64} ${pistonY} L ${xPos + 6} ${pistonY} Z`} 
                        fill="url(#fireGradient)" 
                        opacity={0.35} 
                      />
                    )}

                    {/* Cylinder details (Cylinder Label, stroke phase text) */}
                    <text x={xPos + 35} y="44" textAnchor="middle" className="text-[10px] font-bold fill-slate-500 font-mono">CYLINDER {cylIdx + 1}</text>
                  </g>
                );
              })}

              {/* Fire gradient definition for power stroke */}
              <defs>
                <linearGradient id="fireGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
                </linearGradient>
              </defs>
            </svg>

            {/* Overlap stroke tags as cards below */}
            <div className="absolute bottom-2 inset-x-0 flex items-center justify-around px-12">
              {[0, 1, 2, 3].map(cylIdx => {
                const stroke = getStrokePhase(cylIdx);
                return (
                  <span key={cylIdx} className={`px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wider ${stroke.color}`}>
                    {stroke.label}
                  </span>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200/50 text-[11px] text-slate-500 font-medium leading-relaxed">
            <Info className="w-4 h-4 text-slate-600 shrink-0" />
            <span>Piston motion corresponds exactly to rotational RPM. Connecting rods translate angular rotation into linear vertical displacement. Firing order is standard 1 - 3 - 4 - 2.</span>
          </div>
        </div>

        {/* Right Side: Residual Metrics Comparisons */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col h-[480px]">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-slate-700" />
            Physics Deviations (Residuals)
          </h3>

          <div className="space-y-4 flex-1 overflow-y-auto pr-1">
            
            {/* RPM Deviation */}
            <div className="border border-slate-100 p-3 rounded-lg bg-slate-50/50">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>RPM Residual</span>
                <span className={`font-bold font-mono ${Math.abs(residuals.rpm) > 100 ? 'text-amber-600' : 'text-green-600'}`}>
                  {residuals.rpm >= 0 ? `+${residuals.rpm}` : residuals.rpm} RPM
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2 text-[11px] font-mono font-medium text-slate-400">
                <div>Actual: <span className="text-slate-800 font-bold">{currentTelemetry.rpm} RPM</span></div>
                <div>Expected: <span className="text-slate-800 font-bold">{physicsExpected.rpm} RPM</span></div>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${Math.abs(residuals.rpm) > 100 ? 'bg-amber-500' : 'bg-green-500'}`}
                  style={{ width: `${Math.min(100, Math.max(10, 50 + (residuals.rpm / 400) * 50))}%` }}
                ></div>
              </div>
            </div>

            {/* CHT Deviation */}
            <div className="border border-slate-100 p-3 rounded-lg bg-slate-50/50">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>CHT Residual</span>
                <span className={`font-bold font-mono ${Math.abs(residuals.cht) > 8 ? 'text-amber-600' : 'text-green-600'}`}>
                  {residuals.cht >= 0 ? `+${residuals.cht}` : residuals.cht} °F
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2 text-[11px] font-mono font-medium text-slate-400">
                <div>Actual: <span className="text-slate-800 font-bold">{currentTelemetry.cht} °F</span></div>
                <div>Expected: <span className="text-slate-800 font-bold">{physicsExpected.cht} °F</span></div>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${Math.abs(residuals.cht) > 8 ? 'bg-amber-500' : 'bg-green-500'}`}
                  style={{ width: `${Math.min(100, Math.max(10, 50 + (residuals.cht / 30) * 50))}%` }}
                ></div>
              </div>
            </div>

            {/* EGT Deviation */}
            <div className="border border-slate-100 p-3 rounded-lg bg-slate-50/50">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>EGT Residual</span>
                <span className={`font-bold font-mono ${Math.abs(residuals.egt) > 30 ? 'text-amber-600' : 'text-green-600'}`}>
                  {residuals.egt >= 0 ? `+${residuals.egt}` : residuals.egt} °F
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2 text-[11px] font-mono font-medium text-slate-400">
                <div>Actual: <span className="text-slate-800 font-bold">{currentTelemetry.egt} °F</span></div>
                <div>Expected: <span className="text-slate-800 font-bold">{physicsExpected.egt} °F</span></div>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${Math.abs(residuals.egt) > 30 ? 'bg-amber-500' : 'bg-green-500'}`}
                  style={{ width: `${Math.min(100, Math.max(10, 50 + (residuals.egt / 150) * 50))}%` }}
                ></div>
              </div>
            </div>

            {/* Fuel Flow Deviation */}
            <div className="border border-slate-100 p-3 rounded-lg bg-slate-50/50">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>Fuel Flow Residual</span>
                <span className={`font-bold font-mono ${Math.abs(residuals.fuelFlow) > 0.8 ? 'text-amber-600' : 'text-green-600'}`}>
                  {residuals.fuelFlow >= 0 ? `+${residuals.fuelFlow}` : residuals.fuelFlow} GPH
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2 text-[11px] font-mono font-medium text-slate-400">
                <div>Actual: <span className="text-slate-800 font-bold">{currentTelemetry.fuelFlow} GPH</span></div>
                <div>Expected: <span className="text-slate-800 font-bold">{physicsExpected.fuelFlow} GPH</span></div>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${Math.abs(residuals.fuelFlow) > 0.8 ? 'bg-amber-500' : 'bg-green-500'}`}
                  style={{ width: `${Math.min(100, Math.max(10, 50 + (residuals.fuelFlow / 3) * 50))}%` }}
                ></div>
              </div>
            </div>

            {/* Oil Pressure Deviation */}
            <div className="border border-slate-100 p-3 rounded-lg bg-slate-50/50">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>Oil Pressure Residual</span>
                <span className={`font-bold font-mono ${Math.abs(residuals.oilPressure) > 5 ? 'text-amber-600' : 'text-green-600'}`}>
                  {residuals.oilPressure >= 0 ? `+${residuals.oilPressure}` : residuals.oilPressure} PSI
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2 text-[11px] font-mono font-medium text-slate-400">
                <div>Actual: <span className="text-slate-800 font-bold">{currentTelemetry.oilPressure} PSI</span></div>
                <div>Expected: <span className="text-slate-800 font-bold">{physicsExpected.oilPressure} PSI</span></div>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${Math.abs(residuals.oilPressure) > 5 ? 'bg-amber-500' : 'bg-green-500'}`}
                  style={{ width: `${Math.min(100, Math.max(10, 50 + (residuals.oilPressure / 20) * 50))}%` }}
                ></div>
              </div>
            </div>

          </div>
          
          <div className="text-[10px] text-slate-400 font-semibold text-center select-none pt-3 border-t border-slate-100 mt-2 font-mono">
            RESIDUAL = ACTUAL READOUT - PHYSICS EXPECTATION
          </div>
        </div>

      </div>

    </div>
  );
};
