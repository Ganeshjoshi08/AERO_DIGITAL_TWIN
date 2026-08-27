import React from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { TrendingUp, Activity, AlertTriangle } from 'lucide-react';

export const AiRul: React.FC = () => {
  const { currentTelemetry } = useTelemetry();

  // SVG dimensions for the degradation curve chart
  const width = 600;
  const height = 240;
  const paddingLeft = 50;
  const paddingRight = 30;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Let's model a degradation curve: Health = 100 - (cycle / 300)^2 * 50
  // For a 300 cycles lifetime
  const getCoordinates = (cycle: number, health: number) => {
    const x = paddingLeft + (cycle / 300) * chartWidth;
    const y = paddingTop + chartHeight - (health / 100) * chartHeight;
    return { x, y };
  };

  // Generate SVG path for the mean degradation line
  const meanPoints = [];
  for (let c = 0; c <= 300; c += 15) {
    const health = 100 - Math.pow(c / 300, 1.8) * 35; // degrades to 65% at 300 cycles (critical limit)
    meanPoints.push(getCoordinates(c, health));
  }

  const generateLinePath = (points: { x: number; y: number }[]) => {
    return points.reduce((acc, p, idx) => idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`, '');
  };

  // Generate shaded area for 95% Confidence Interval band
  const upperPoints: { x: number; y: number }[] = [];
  const lowerPoints: { x: number; y: number }[] = [];

  for (let c = 0; c <= 300; c += 15) {
    const meanHealth = 100 - Math.pow(c / 300, 1.8) * 35;
    const spread = (c / 300) * 12; // spread increases as we project further out
    upperPoints.push(getCoordinates(c, Math.min(100, meanHealth + spread)));
    lowerPoints.push(getCoordinates(c, Math.max(0, meanHealth - spread)));
  }

  // Draw a closed path for the polygon band
  const generateBandPath = (upper: { x: number; y: number }[], lower: { x: number; y: number }[]) => {
    const upperPath = upper.reduce((acc, p, idx) => idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`, '');
    const lowerPathReverse = [...lower].reverse().reduce((acc, p) => `${acc} L ${p.x} ${p.y}`, '');
    return `${upperPath} ${lowerPathReverse} Z`;
  };

  // Current engine position along cycle
  // Cycles completed = Total expected - Remaining
  const currentCycle = 300 - currentTelemetry.rulCycles;
  const currentPos = getCoordinates(currentCycle, currentTelemetry.healthIndex);

  return (
    <div className="space-y-6">
      
      {/* RUL Prognostic Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Metric 1: Remaining Cycles */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between h-[120px] select-none">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Remaining Useful Life (RUL)</span>
            <h3 className="text-xl font-bold font-mono text-slate-900 mt-1">{currentTelemetry.rulCycles} Cycles</h3>
          </div>
          <p className="text-[11px] text-slate-500 font-semibold leading-normal">
            Estimated cycles before the engine reaches critical wear limits (70% health threshold).
          </p>
        </div>

        {/* Metric 2: Cycles Completed */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between h-[120px] select-none">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Accumulated Cycles</span>
            <h3 className="text-xl font-bold font-mono text-slate-800 mt-1">{currentCycle} Cycles</h3>
          </div>
          <p className="text-[11px] text-slate-500 font-semibold leading-normal">
            Total number of operational thermodynamic start/stop missions recorded.
          </p>
        </div>

        {/* Metric 3: Prognostic Confidence */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between h-[120px] select-none">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Model Confidence</span>
            <h3 className="text-xl font-bold font-mono text-emerald-600 mt-1">95.4% <span className="text-xs text-slate-400">CI bounds</span></h3>
          </div>
          <p className="text-[11px] text-slate-500 font-semibold leading-normal">
            Statistical accuracy rating computed based on historical baseline comparisons.
          </p>
        </div>

      </div>

      {/* RUL Wear Progression Chart */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Curve visualization */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 xl:col-span-2 flex flex-col h-[380px]">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 select-none">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-slate-700" />
                Remaining Useful Life Wear Curve
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">XGBoost degradation projections and uncertainty bands</p>
            </div>
          </div>

          <div className="flex-1 w-full relative">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
              {/* Horizontal Gridlines */}
              {[0, 25, 50, 75, 100].map((hVal) => {
                const yPos = paddingTop + chartHeight - (hVal / 100) * chartHeight;
                return (
                  <g key={hVal}>
                    <line x1={paddingLeft} y1={yPos} x2={width - paddingRight} y2={yPos} stroke="#f1f5f9" strokeWidth="1" />
                    <text x={paddingLeft - 8} y={yPos + 4} textAnchor="end" className="text-[10px] font-medium font-mono fill-slate-400">{hVal}%</text>
                  </g>
                );
              })}

              {/* Vertical Gridlines (Cycles) */}
              {[0, 50, 100, 150, 200, 250, 300].map((cVal) => {
                const xPos = paddingLeft + (cVal / 300) * chartWidth;
                return (
                  <g key={cVal}>
                    <line x1={xPos} y1={paddingTop} x2={xPos} y2={paddingTop + chartHeight} stroke="#f1f5f9" strokeWidth="1" />
                    <text x={xPos} y={height - 8} textAnchor="middle" className="text-[10px] font-medium font-mono fill-slate-400">{cVal}</text>
                  </g>
                );
              })}

              {/* Shaded Confidence Band */}
              <path d={generateBandPath(upperPoints, lowerPoints)} fill="#38a9f8" opacity={0.1} />

              {/* Threshold Danger Line (Health < 70%) */}
              {(() => {
                const limitY = paddingTop + chartHeight - (70 / 100) * chartHeight;
                return (
                  <g>
                    <line 
                      x1={paddingLeft} 
                      y1={limitY} 
                      x2={width - paddingRight} 
                      y2={limitY} 
                      stroke="#ef4444" 
                      strokeWidth="1.5" 
                      strokeDasharray="4,4" 
                    />
                    <text x={width - paddingRight} y={limitY - 5} textAnchor="end" className="text-[9px] font-bold fill-red-500">CRITICAL SAFETY THRESHOLD (70%)</text>
                  </g>
                );
              })()}

              {/* Mean Degradation Line */}
              <path d={generateLinePath(meanPoints)} fill="none" stroke="#0e8ee9" strokeWidth="2.5" strokeLinecap="round" />

              {/* Current Position Dot */}
              <circle cx={currentPos.x} cy={currentPos.y} r="6" fill="#0f172a" stroke="#ffffff" strokeWidth="1.5" className="cursor-help" />
              <text x={currentPos.x} y={currentPos.y - 12} textAnchor="middle" className="text-[9px] font-bold fill-slate-900 bg-white px-1">NX-204 (Current State)</text>
            </svg>
          </div>

          <div className="flex items-center justify-center gap-6 text-[10px] font-bold text-slate-500 mt-2 select-none border-t border-slate-50 pt-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-blue-500 rounded"></span>
              <span>Predicted Wear Mean</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-2 bg-blue-100 border border-blue-200 rounded"></span>
              <span>95% Confidence Bounds</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-slate-900 rounded-full"></span>
              <span>Current Operating Cycle</span>
            </div>
          </div>
        </div>

        {/* Prognostics Specifications Side Panel */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col justify-between h-[380px]">
          <div>
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-slate-700" />
              Wear Degradation Features
            </h3>
            
            <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">
              AI feature weights influencing Remaining Useful Life calculations, highlighting which components contribute most to degradation.
            </p>

            <div className="space-y-4">
              {/* Feature 1 */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1">
                  <span>Cylinder 3 Temperature Residuals</span>
                  <span className="font-bold">42% weight</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-800" style={{ width: '42%' }}></div>
                </div>
              </div>

              {/* Feature 2 */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1">
                  <span>Engine Vibration Profile</span>
                  <span className="font-bold">28% weight</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-800" style={{ width: '28%' }}></div>
                </div>
              </div>

              {/* Feature 3 */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1">
                  <span>Average Exhaust Gas Thermal Cycles</span>
                  <span className="font-bold">20% weight</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-800" style={{ width: '20%' }}></div>
                </div>
              </div>

              {/* Feature 4 */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1">
                  <span>Oil Pressure Degradation Ratio</span>
                  <span className="font-bold">10% weight</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-800" style={{ width: '10%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2 bg-amber-50 text-[10px] text-amber-800 border border-amber-200/50 rounded-lg p-2.5 mt-4 font-semibold leading-relaxed">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Thermal anomalies on cylinder 3 remain the primary catalyst accelerating wear rates.</span>
          </div>
        </div>

      </div>

    </div>
  );
};
