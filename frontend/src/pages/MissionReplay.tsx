import React from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { Play, Pause, Navigation, Info } from 'lucide-react';

export const MissionReplay: React.FC = () => {
  const { 
    currentTelemetry, 
    isReplayMode, 
    replayState, 
    startReplay, 
    pauseReplay, 
    setReplaySpeed, 
    seekReplay, 
    toggleReplayMode 
  } = useTelemetry();

  const formatTime = (secs: number) => {
    const hrs = Math.floor(secs / 3600).toString().padStart(2, '0');
    const mins = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${s}`;
  };

  // SVG dimensions for the UAV Flight Profile path
  const width = 500;
  const height = 150;
  const paddingLeft = 30;
  const paddingRight = 30;
  const paddingTop = 20;
  const paddingBottom = 20;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Let's draw a nice flight path trajectory representing Takeoff, Climb, Cruise, Descent, Landing
  const getCoordinates = (progress: number, alt: number) => {
    const x = paddingLeft + progress * chartWidth;
    const y = paddingTop + chartHeight - (alt / 10000) * chartHeight; // max altitude ~10000 ft
    return { x, y };
  };

  // Generate coordinates along the flight path
  const flightPoints = [
    getCoordinates(0.0, 0),
    getCoordinates(0.05, 0),
    getCoordinates(0.15, 3000),
    getCoordinates(0.3, 8500),
    getCoordinates(0.5, 8600),
    getCoordinates(0.8, 8500),
    getCoordinates(0.95, 1000),
    getCoordinates(1.0, 0)
  ];

  const pathD = flightPoints.reduce((acc, p, idx) => idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`, '');

  // Calculate current indicator dot position on the path based on progress percent
  const getCurrentDotPos = () => {
    const prog = replayState.currentTime / replayState.duration;
    // Map progress to altitude approximation (matching the pre-generated logs)
    let alt = 0;
    if (prog < 0.05) {
      alt = 0;
    } else if (prog < 0.15) {
      alt = (prog - 0.05) * 10 * 1500;
    } else if (prog < 0.3) {
      alt = 1500 + (prog - 0.15) * 6.6 * 7000;
    } else if (prog < 0.8) {
      alt = 8500 + Math.sin(prog * 20) * 100;
    } else if (prog < 0.95) {
      alt = 8500 - (prog - 0.8) * 6.6 * 7500;
    } else {
      alt = 1000 - (prog - 0.95) * 20 * 1000;
    }
    return getCoordinates(prog, Math.max(0, alt));
  };

  const dotPos = getCurrentDotPos();

  return (
    <div className="space-y-6">
      
      {/* Replay Status Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col md:flex-row items-center justify-between gap-5 select-none">
        <div className="flex items-center gap-4">
          <div className="bg-blue-50 text-blue-600 p-2.5 rounded-lg border border-blue-100 shrink-0">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Alpha-7 Mission Flight Logs Replay</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Select and replay past missions to inspect historical sensor values and AI outputs.
            </p>
          </div>
        </div>

        {/* Replay Mode Switcher */}
        <button
          onClick={() => toggleReplayMode(!isReplayMode)}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 border ${
            isReplayMode
              ? 'bg-blue-600 text-white border-blue-700 hover:bg-blue-700'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          {isReplayMode ? 'EXIT REPLAY MODE' : 'ENTER REPLAY MODE'}
        </button>
      </div>

      {/* Replay Main Interface Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
        
        {/* Playback Controls & Timeline */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Play/Pause */}
            <div className="flex items-center gap-3 select-none">
              {replayState.isPlaying ? (
                <button 
                  onClick={pauseReplay}
                  disabled={!isReplayMode}
                  className="bg-slate-900 text-white p-3 rounded-full hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Pause className="w-4 h-4 fill-white" />
                </button>
              ) : (
                <button 
                  onClick={startReplay}
                  disabled={!isReplayMode}
                  className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                </button>
              )}

              {/* Speed Buttons */}
              <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[10px] font-bold text-slate-500">
                {[1, 2, 5, 10].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setReplaySpeed(speed)}
                    disabled={!isReplayMode}
                    className={`px-2.5 py-1.5 rounded-md transition-all duration-150 ${
                      replayState.speed === speed && isReplayMode
                        ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50'
                        : 'hover:text-slate-900 disabled:opacity-50'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>

            {/* Readouts */}
            <div className="flex items-center gap-4 text-xs font-mono font-bold select-none text-slate-500">
              <div>Time: <span className="text-slate-900">{formatTime(replayState.currentTime)}</span></div>
              <div className="text-slate-300">/</div>
              <div>Duration: <span className="text-slate-950">{formatTime(replayState.duration)}</span></div>
            </div>
          </div>

          {/* Timeline Slider */}
          <div className="flex items-center gap-4">
            <input 
              type="range" 
              min="0" 
              max={replayState.duration} 
              step="10"
              value={replayState.currentTime}
              onChange={(e) => seekReplay(parseInt(e.target.value))}
              disabled={!isReplayMode}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* Visual Map / Flight Profile */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Flight Path Profile */}
          <div className="xl:col-span-2 bg-slate-50 border border-slate-200/50 p-4 rounded-lg flex flex-col justify-between h-[220px]">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider select-none">UAV Flight Altitude Profile</span>
            
            <div className="flex-1 flex items-center justify-center py-2 relative">
              <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
                {/* Horizontal lines */}
                {[0, 4000, 8000].map((altVal) => {
                  const y = paddingTop + chartHeight - (altVal / 10000) * chartHeight;
                  return (
                    <g key={altVal}>
                      <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="2,2" />
                      <text x={paddingLeft - 8} y={y + 3} textAnchor="end" className="text-[8px] font-bold font-mono fill-slate-400">{altVal} ft</text>
                    </g>
                  );
                })}

                {/* Main Path */}
                <path d={pathD} fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />

                {/* Progress highlight line */}
                {isReplayMode && (
                  <path 
                    d={flightPoints.reduce((acc, p, idx) => {
                      if (p.x > dotPos.x) return acc;
                      return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
                    }, '') + ` L ${dotPos.x} ${dotPos.y}`} 
                    fill="none" 
                    stroke="#0e8ee9" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                  />
                )}

                {/* Moving dot */}
                {isReplayMode && (
                  <circle cx={dotPos.x} cy={dotPos.y} r="5.5" fill="#0e8ee9" stroke="#ffffff" strokeWidth="1.5" />
                )}
              </svg>
            </div>

            <div className="flex justify-between text-[9px] font-mono font-bold text-slate-400 select-none px-4">
              <span>TAKEOFF</span>
              <span>CLIMB</span>
              <span>CRUISE (8,500 ft)</span>
              <span>DESCENT</span>
              <span>LANDED</span>
            </div>
          </div>

          {/* Sync Stats Preview */}
          <div className="bg-slate-50 border border-slate-200/50 p-4 rounded-lg flex flex-col justify-between h-[220px]">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider select-none mb-2">Replayed Telemetry Preview</span>

            <div className="space-y-3 flex-1 flex flex-col justify-center text-xs font-semibold text-slate-600">
              <div className="flex items-center justify-between border-b border-slate-200/40 pb-1.5">
                <span>Crankshaft RPM</span>
                <span className="font-mono text-slate-900 font-bold">{currentTelemetry.rpm} RPM</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200/40 pb-1.5">
                <span>Cylinder Temp (CHT)</span>
                <span className="font-mono text-slate-900 font-bold">{currentTelemetry.cht} °F</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200/40 pb-1.5">
                <span>Exhaust Temp (EGT)</span>
                <span className="font-mono text-slate-900 font-bold">{currentTelemetry.egt} °F</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Flight Altitude</span>
                <span className="font-mono text-slate-900 font-bold">{currentTelemetry.altitude.toLocaleString()} ft</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-blue-50 text-[10px] text-blue-800 border border-blue-100 rounded-md p-2 mt-2 font-medium leading-relaxed select-none">
              <Info className="w-3.5 h-3.5 shrink-0 text-blue-600" />
              <span>Telemetry changes sync across all active views in the dashboard.</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
