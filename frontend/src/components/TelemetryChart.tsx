import React, { useState } from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import type { TelemetryData } from '../context/TelemetryContext';

type ChartMetric = 'RPM' | 'TEMP' | 'PRESS' | 'FLOW';

export const TelemetryChart: React.FC = () => {
  const { telemetryHistory } = useTelemetry();
  const [activeMetric, setActiveMetric] = useState<ChartMetric>('RPM');

  // Configure min/max ranges and lines for each metric tab
  const getMetricConfig = () => {
    switch (activeMetric) {
      case 'RPM':
        return {
          title: 'Engine Crankshaft Speed',
          unit: 'RPM',
          yMin: 0,
          yMax: 3000,
          gridSteps: 4,
          lines: [
            {
              key: 'rpm' as keyof TelemetryData,
              label: 'Engine RPM',
              color: '#0e8ee9', // Aero Blue
              strokeWidth: 2,
            }
          ]
        };
      case 'TEMP':
        return {
          title: 'Cylinder Head & Exhaust Gas Temperatures',
          unit: '°F',
          yMin: 0,
          yMax: 1800,
          gridSteps: 4,
          lines: [
            {
              key: 'egt' as keyof TelemetryData,
              label: 'EGT (Exhaust Gas Temp)',
              color: '#0f172a', // Dark Navy
              strokeWidth: 2.5,
            },
            {
              key: 'cht' as keyof TelemetryData,
              label: 'CHT (Cylinder Head Temp)',
              color: '#10b981', // Green
              strokeWidth: 2,
            }
          ]
        };
      case 'PRESS':
        return {
          title: 'Lubrication Oil Pressure',
          unit: 'PSI',
          yMin: 0,
          yMax: 100,
          gridSteps: 4,
          lines: [
            {
              key: 'oilPressure' as keyof TelemetryData,
              label: 'Oil Pressure',
              color: '#0e8ee9', // Aero Blue
              strokeWidth: 2,
            }
          ]
        };
      case 'FLOW':
        return {
          title: 'Fuel Consumption Rate',
          unit: 'GPH',
          yMin: 0,
          yMax: 20,
          gridSteps: 4,
          lines: [
            {
              key: 'fuelFlow' as keyof TelemetryData,
              label: 'Fuel Flow',
              color: '#10b981', // Green
              strokeWidth: 2,
            }
          ]
        };
      default:
        return {
          title: 'Engine Crankshaft Speed',
          unit: 'RPM',
          yMin: 0,
          yMax: 3000,
          gridSteps: 4,
          lines: [
            {
              key: 'rpm' as keyof TelemetryData,
              label: 'Engine RPM',
              color: '#0e8ee9',
              strokeWidth: 2,
            }
          ]
        };
    }
  };

  const config = getMetricConfig();

  // SVG Dimension Constants
  const width = 800;
  const height = 240;
  const paddingLeft = 50;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Convert telemetry point index and value to SVG coordinates
  const getCoordinates = (index: number, total: number, value: number) => {
    const x = paddingLeft + (index / Math.max(1, total - 1)) * chartWidth;
    const y = paddingTop + chartHeight - ((value - config.yMin) / (config.yMax - config.yMin)) * chartHeight;
    return { x, y };
  };

  // Generate SVG Path for a series of values using Bezier curves
  const generatePath = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      // Control points for a smooth cubic bezier curve
      const cpX1 = p0.x + (p1.x - p0.x) / 3;
      const cpY1 = p0.y;
      const cpX2 = p0.x + 2 * (p1.x - p0.x) / 3;
      const cpY2 = p1.y;
      d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  // Generate SVG Filled Path for area charts
  const generateAreaPath = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return '';
    const linePath = generatePath(points);
    const bottomY = paddingTop + chartHeight;
    const firstX = points[0].x;
    const lastX = points[points.length - 1].x;
    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  };

  // Ensure we have mock points if the history is empty
  const historyData = telemetryHistory.length > 0 ? telemetryHistory : Array(10).fill(null).map(() => ({
    rpm: 2450,
    cht: 380,
    egt: 1450,
    oilPressure: 65,
    fuelFlow: 12.4,
    timestamp: '00:00:00'
  } as unknown as TelemetryData));

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col h-full">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-6 shrink-0 select-none">
        <div>
          <h3 className="text-base font-bold text-slate-900">Real-Time Telemetry</h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">{config.title} ({config.unit})</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
          {(['RPM', 'TEMP', 'PRESS', 'FLOW'] as ChartMetric[]).map((metric) => (
            <button
              key={metric}
              onClick={() => setActiveMetric(metric)}
              className={`px-3 py-1.5 rounded-md transition-all duration-150 ${
                activeMetric === metric
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {metric}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="flex-1 min-h-[220px] relative w-full">
        {historyData.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-400 font-medium">
            Waiting for live telemetry link...
          </div>
        ) : (
          <svg 
            viewBox={`0 0 ${width} ${height}`} 
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            {/* Grids and Axes */}
            {Array.from({ length: config.gridSteps + 1 }).map((_, stepIdx) => {
              const fraction = stepIdx / config.gridSteps;
              const yVal = config.yMin + fraction * (config.yMax - config.yMin);
              const yPos = paddingTop + chartHeight - fraction * chartHeight;
              
              return (
                <g key={stepIdx}>
                  {/* Gridline */}
                  <line 
                    x1={paddingLeft} 
                    y1={yPos} 
                    x2={width - paddingRight} 
                    y2={yPos} 
                    stroke="#f1f5f9" 
                    strokeWidth={1} 
                  />
                  {/* Axis Label */}
                  <text 
                    x={paddingLeft - 8} 
                    y={yPos + 4} 
                    textAnchor="end" 
                    className="text-[10px] font-medium font-mono fill-slate-400"
                  >
                    {Math.round(yVal)}
                  </text>
                </g>
              );
            })}

            {/* Vertical grid lines (Time steps) */}
            {Array.from({ length: 6 }).map((_, i) => {
              const fraction = i / 5;
              const xPos = paddingLeft + fraction * chartWidth;
              const dataIdx = Math.round(fraction * (historyData.length - 1));
              const label = historyData[dataIdx]?.timestamp || '';
              
              return (
                <g key={i}>
                  <line 
                    x1={xPos} 
                    y1={paddingTop} 
                    x2={xPos} 
                    y2={paddingTop + chartHeight} 
                    stroke="#f1f5f9" 
                    strokeWidth={1} 
                  />
                  <text 
                    x={xPos} 
                    y={height - 8} 
                    textAnchor="middle" 
                    className="text-[10px] font-medium font-mono fill-slate-400"
                  >
                    {label}
                  </text>
                </g>
              );
            })}

            {/* Render chart paths */}
            {config.lines.map((lineConfig) => {
              const linePoints = historyData.map((d, index) => {
                const rawVal = d[lineConfig.key] as number;
                return getCoordinates(index, historyData.length, rawVal);
              });

              return (
                <g key={lineConfig.key}>
                  {/* Area gradient under line */}
                  <path 
                    d={generateAreaPath(linePoints)} 
                    fill={`url(#gradient-${lineConfig.key})`} 
                    opacity={0.06}
                  />

                  {/* Gradient definition */}
                  <defs>
                    <linearGradient id={`gradient-${lineConfig.key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={lineConfig.color} />
                      <stop offset="100%" stopColor={lineConfig.color} stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Stroke path */}
                  <path 
                    d={generatePath(linePoints)} 
                    fill="none" 
                    stroke={lineConfig.color} 
                    strokeWidth={lineConfig.strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-all duration-200"
                  />

                  {/* End/latest point blink dot */}
                  {linePoints.length > 0 && (
                    <circle 
                      cx={linePoints[linePoints.length - 1].x} 
                      cy={linePoints[linePoints.length - 1].y} 
                      r={4} 
                      fill={lineConfig.color} 
                      className="animate-pulse"
                    />
                  )}
                </g>
              );
            })}
          </svg>
        )}
      </div>
      
      {/* Legend */}
      <div className="flex items-center gap-4 mt-2 text-xs font-semibold text-slate-500 shrink-0 select-none px-12">
        {config.lines.map((l) => (
          <div key={l.key} className="flex items-center gap-2">
            <span className="w-3 h-0.5 rounded-full" style={{ backgroundColor: l.color, borderTop: `2px solid ${l.color}` }}></span>
            <span>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
