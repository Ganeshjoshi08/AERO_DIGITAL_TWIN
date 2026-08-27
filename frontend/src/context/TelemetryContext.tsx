import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { fetchEngineState } from '../services/api';
import { TelemetryWebSocketService, type ConnectionStatus } from '../services/websocket';
import type { ExpectedEngineState, DigitalTwinOutput } from '../types/digitalTwin';

// Define the structure of engine telemetry parameters
export interface TelemetryData {
  timestamp: string;
  rpm: number;
  cht: number; // Cylinder Head Temp in °F
  egt: number; // Exhaust Gas Temp in °F
  oilPressure: number; // PSI
  oilTemperature: number; // °F
  fuelFlow: number; // GPH
  vibration: number; // g (acceleration)
  batteryVoltage: number; // V
  alternatorStatus: 'OK' | 'FAULT';
  injectionTiming: number; // °BTDC
  throttlePosition: number; // %
  engineLoad: number; // %
  ambientTemperature: number; // °C
  ambientPressure: number; // hPa
  altitude: number; // ft
  fuelConsumed: number; // Gallons
  engineStatus: 'RUNNING' | 'IDLE' | 'STOPPED' | 'OVERHEATING' | 'FAULT';
  healthIndex: number; // %
  rulCycles: number; // Remaining Useful Life in cycles
  anomalyScore: number; // 0.0 to 1.0
  faultPrediction: string;
  degradationStatus: number; // 0 to 100%
  modelConfidence: number; // %
  
  // Subsystem health percentages
  subsystemHealth: {
    thermal: number;
    fuel: number;
    electrical: number;
    mechanical: number;
    combustion: number;
    lubrication: number;
    sensor: number;
  };
  
  // Mission Status details
  mission: {
    id: string;
    phase: 'Pre-flight' | 'Takeoff' | 'Climb' | 'Cruise' | 'Descent' | 'Landing' | 'Post-flight';
    flightTime: string;
    flightTimeSeconds: number;
    altitude: number;
    ambient: number;
  };
}

// Alert structure for visual notifications
export interface AlertEvent {
  id: string;
  timestamp: string;
  message: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  component: 'THERMAL' | 'FUEL' | 'ELECTRICAL' | 'MECHANICAL' | 'GENERAL';
  acknowledged: boolean;
}

// Context API exposed to components
export interface TelemetryContextType {
  currentTelemetry: TelemetryData;
  telemetryHistory: TelemetryData[];
  alerts: AlertEvent[];
  isConnected: boolean;
  isSimulated: boolean;
  isReplayMode: boolean;
  expectedTelemetry: ExpectedEngineState | null;
  residuals: Record<string, number> | null;
  connectionStatus: ConnectionStatus;
  
  // Simulation Inputs (client-side demo controls)
  simulationInputs: {
    throttle: number; // %
    targetRpm: number; // RPM
    altitude: number; // ft
    ambientTemp: number; // °C
    fuelOctane: number; // Octane rating
  };
  
  // Setters for simulation sliders
  setSimulationInputs: React.Dispatch<React.SetStateAction<{
    throttle: number;
    targetRpm: number;
    altitude: number;
    ambientTemp: number;
    fuelOctane: number;
  }>>;
  
  // Replay Controls
  replayState: {
    isPlaying: boolean;
    speed: number; // 1, 2, 5, 10
    currentTime: number; // seconds
    duration: number; // seconds
  };
  
  // Actions
  toggleConnection: () => void;
  startReplay: () => void;
  pauseReplay: () => void;
  setReplaySpeed: (speed: number) => void;
  seekReplay: (timeSeconds: number) => void;
  toggleReplayMode: (active: boolean) => void;
  triggerMockFault: (type: string) => void;
  clearAlerts: () => void;
  acknowledgeAlert: (id: string) => void;
}

// Initialize nominal default telemetry matching the Stitch dashboard screenshot
const INITIAL_TELEMETRY: TelemetryData = {
  timestamp: new Date().toLocaleTimeString(),
  rpm: 2450,
  cht: 380,
  egt: 1450,
  oilPressure: 65,
  oilTemperature: 195,
  fuelFlow: 12.4,
  vibration: 1.2,
  batteryVoltage: 27.8,
  alternatorStatus: 'OK',
  injectionTiming: 18.5,
  throttlePosition: 75,
  engineLoad: 78,
  ambientTemperature: -10,
  ambientPressure: 715,
  altitude: 8500,
  fuelConsumed: 21.6,
  engineStatus: 'RUNNING',
  healthIndex: 92,
  rulCycles: 142,
  anomalyScore: 0.12,
  faultPrediction: 'None Detected',
  degradationStatus: 8,
  modelConfidence: 98.4,
  subsystemHealth: {
    thermal: 94,
    fuel: 98,
    electrical: 100,
    mechanical: 91,
    combustion: 100,
    lubrication: 100,
    sensor: 100,
  },
  mission: {
    id: 'Alpha-7',
    phase: 'Cruise',
    flightTime: '01:42:00',
    flightTimeSeconds: 6120,
    altitude: 8500,
    ambient: -10,
  }
};

const TelemetryContext = createContext<TelemetryContextType | undefined>(undefined);

export const useTelemetry = () => {
  const context = useContext(TelemetryContext);
  if (!context) {
    throw new Error('useTelemetry must be used within a TelemetryProvider');
  }
  return context;
};

// Generates static mission replay logs for the replay tab
const generateReplayLogs = (duration: number): TelemetryData[] => {
  const logs: TelemetryData[] = [];
  const baseTime = new Date();
  baseTime.setHours(baseTime.getHours() - 2);

  for (let i = 0; i <= duration; i += 10) {
    const progress = i / duration;
    let phase: TelemetryData['mission']['phase'] = 'Pre-flight';
    let alt = 0;
    let throttle = 0;
    let rpm = 0;
    let temp = 15;

    if (progress < 0.05) {
      phase = 'Pre-flight';
      alt = 0;
      throttle = 15;
      rpm = 1050;
      temp = 15;
    } else if (progress < 0.15) {
      phase = 'Takeoff';
      alt = (progress - 0.05) * 10 * 1500;
      throttle = 95;
      rpm = 2780;
      temp = 15 - alt * 0.002;
    } else if (progress < 0.3) {
      phase = 'Climb';
      alt = 1500 + (progress - 0.15) * 6.6 * 7000;
      throttle = 85;
      rpm = 2600;
      temp = 15 - alt * 0.002;
    } else if (progress < 0.8) {
      phase = 'Cruise';
      alt = 8500 + Math.sin(progress * 20) * 100;
      throttle = 75;
      rpm = 2450 + Math.sin(progress * 15) * 15;
      temp = -10 + Math.sin(progress * 10) * 0.5;
    } else if (progress < 0.95) {
      phase = 'Descent';
      alt = 8500 - (progress - 0.8) * 6.6 * 7500;
      throttle = 35;
      rpm = 1800;
      temp = -10 + (8500 - alt) * 0.003;
    } else {
      phase = 'Landing';
      alt = 1000 - (progress - 0.95) * 20 * 1000;
      throttle = 15;
      rpm = 1100;
      temp = 15;
    }

    const currentSecs = i;
    const hrs = Math.floor(currentSecs / 3600).toString().padStart(2, '0');
    const mins = Math.floor((currentSecs % 3600) / 60).toString().padStart(2, '0');
    const secs = (currentSecs % 60).toString().padStart(2, '0');
    const timeString = `${hrs}:${mins}:${secs}`;

    const chtVal = 100 + (throttle / 100) * 280 + Math.sin(i / 100) * 5 + (alt / 1000) * 2;
    const egtVal = 400 + (throttle / 100) * 1050 + Math.cos(i / 80) * 15 - (alt / 1000) * 8;

    logs.push({
      timestamp: timeString,
      rpm: phase === 'Pre-flight' || phase === 'Landing' && alt <= 0 ? (alt <= 0 ? 0 : rpm) : rpm,
      cht: Math.round(chtVal),
      egt: Math.round(egtVal),
      oilPressure: Math.round(40 + (rpm / 3000) * 35 + Math.sin(i / 50) * 2),
      oilTemperature: Math.round(150 + (rpm / 3000) * 50 + Math.cos(i / 120) * 4),
      fuelFlow: Math.round((2 + (throttle / 100) * 12 + Math.sin(i / 100) * 0.3) * 10) / 10,
      vibration: Math.round((0.5 + (rpm / 3000) * 1.0 + Math.sin(i / 10) * 0.1) * 10) / 10,
      batteryVoltage: Math.round((27.5 + Math.sin(i / 200) * 0.2) * 10) / 10,
      alternatorStatus: 'OK',
      injectionTiming: Math.round((15 + (throttle / 100) * 5 + Math.sin(i / 50) * 0.5) * 10) / 10,
      throttlePosition: throttle,
      engineLoad: Math.round(throttle * 1.04),
      ambientTemperature: Math.round(temp),
      ambientPressure: Math.round(1013 - (alt / 30)),
      altitude: Math.round(alt),
      fuelConsumed: Math.round((i * 0.0034) * 10) / 10,
      engineStatus: alt <= 0 && phase === 'Landing' ? 'STOPPED' : (rpm > 2700 ? 'RUNNING' : 'RUNNING'),
      healthIndex: Math.round(92 - (i / duration) * 1),
      rulCycles: Math.round(142 - (i / duration) * 0.2),
      anomalyScore: Math.round((0.05 + Math.sin(i / 1000) * 0.05 + (i > duration * 0.8 ? 0.04 : 0)) * 100) / 100,
      faultPrediction: 'None Detected',
      degradationStatus: Math.round(8 + (i / duration) * 0.5),
      modelConfidence: 98.4,
      subsystemHealth: {
        thermal: Math.round(94 - (i / duration) * 0.6),
        fuel: Math.round(98 - (i / duration) * 0.3),
        electrical: 100,
        mechanical: Math.round(91 - (i / duration) * 0.8),
        combustion: 100,
        lubrication: 100,
        sensor: 100,
      },
      mission: {
        id: 'Alpha-7',
        phase,
        flightTime: timeString,
        flightTimeSeconds: i,
        altitude: Math.round(alt),
        ambient: Math.round(temp),
      }
    });
  }

  return logs;
};

export const TelemetryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTelemetry, setCurrentTelemetry] = useState<TelemetryData>(INITIAL_TELEMETRY);
  const [telemetryHistory, setTelemetryHistory] = useState<TelemetryData[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const [isSimulated, setIsSimulated] = useState(false);
  const [isReplayMode, setIsReplayMode] = useState(false);

  const [expectedTelemetry, setExpectedTelemetry] = useState<ExpectedEngineState | null>(null);
  const [residuals, setResiduals] = useState<Record<string, number> | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('DISCONNECTED');

  const wsServiceRef = useRef<TelemetryWebSocketService | null>(null);
  
  // Simulation input parameters (separated client-side calculations)
  const [simulationInputs, setSimulationInputs] = useState({
    throttle: 75,
    targetRpm: 2450,
    altitude: 8500,
    ambientTemp: -10,
    fuelOctane: 95
  });

  // Load initial REST state (when mock mode is false)
  useEffect(() => {
    const useMock = import.meta.env.VITE_USE_MOCK_TELEMETRY === 'true';
    if (useMock) return;

    async function loadInitialState() {
      try {
        const data = await fetchEngineState();
        handleIncomingTwinOutput(data);
      } catch (e) {
        console.error("[TelemetryContext] Failed to load initial REST state:", e);
      }
    }
    loadInitialState();
  }, []);

  // Connect WebSocket stream (when mock mode is false)
  useEffect(() => {
    const useMock = import.meta.env.VITE_USE_MOCK_TELEMETRY === 'true';
    if (useMock) {
      setIsConnected(true);
      setConnectionStatus('CONNECTED');
      return;
    }

    const wsService = new TelemetryWebSocketService(
      (data) => {
        handleIncomingTwinOutput(data);
      },
      (status) => {
        setConnectionStatus(status);
        setIsConnected(status === 'CONNECTED');
      }
    );

    wsServiceRef.current = wsService;
    wsService.connect();

    return () => {
      wsService.close();
      wsServiceRef.current = null;
    };
  }, []);

  const handleIncomingTwinOutput = (data: DigitalTwinOutput) => {
    if (isReplayMode) return;
    setExpectedTelemetry(data.expected_engine_state);
    setResiduals(data.residuals);
    
    setCurrentTelemetry(prev => {
      const prevConsumed = prev ? prev.fuelConsumed : 0;
      const prevTimeSec = prev ? prev.mission.flightTimeSeconds : 6120;
      return mapTwinOutputToTelemetry(data, prevConsumed, prevTimeSec);
    });
  };

  const mapTwinOutputToTelemetry = (data: DigitalTwinOutput, prevConsumed: number = 0, prevTimeSec: number = 6120): TelemetryData => {
    const actual = data.current_engine_state;
    
    // Calculate fuel consumed since start
    const currentFlow = actual.fuel_flow;
    const nextFuel = Math.round((prevConsumed + (currentFlow / 3600)) * 1000) / 1000;
    
    // Calculate running flight time
    const timeSec = prevTimeSec + 1;
    const hrs = Math.floor(timeSec / 3600).toString().padStart(2, '0');
    const mins = Math.floor((timeSec % 3600) / 60).toString().padStart(2, '0');
    const secs = (timeSec % 60).toString().padStart(2, '0');

    // Map backend subsystem health into frontend layout
    const mappedSubsystems = {
      thermal: data.subsystem_health.thermal,
      fuel: data.subsystem_health.fuel_system,
      electrical: data.subsystem_health.electrical,
      mechanical: data.subsystem_health.mechanical,
      combustion: data.subsystem_health.combustion,
      lubrication: data.subsystem_health.lubrication,
      sensor: data.subsystem_health.sensor
    };

    // Map flight phase string safely
    let phase: TelemetryData['mission']['phase'] = 'Cruise';
    const phaseStr = data.mission_context.flight_phase.toLowerCase();
    if (phaseStr.includes('pre-flight') || phaseStr.includes('preflight')) phase = 'Pre-flight';
    else if (phaseStr.includes('takeoff')) phase = 'Takeoff';
    else if (phaseStr.includes('climb')) phase = 'Climb';
    else if (phaseStr.includes('descent')) phase = 'Descent';
    else if (phaseStr.includes('landing')) phase = 'Landing';
    else if (phaseStr.includes('post-flight')) phase = 'Post-flight';

    // Map engineStatus based on health_state
    let status: TelemetryData['engineStatus'] = 'RUNNING';
    const healthStateStr = (actual.health_state || '').toUpperCase();
    if (healthStateStr === 'FAULT' || healthStateStr === 'CRITICAL') status = 'FAULT';
    else if (healthStateStr === 'DEGRADED') status = 'OVERHEATING';
    else if (data.operating_mode === 'IDLE') status = 'IDLE';
    else if (data.operating_mode === 'ENGINE_OFF') status = 'STOPPED';

    return {
      timestamp: data.timestamp,
      rpm: actual.rpm,
      cht: actual.cht,
      egt: actual.egt,
      oilPressure: actual.oil_pressure,
      oilTemperature: actual.oil_temperature,
      fuelFlow: actual.fuel_flow,
      vibration: actual.vibration,
      batteryVoltage: actual.battery_voltage,
      alternatorStatus: actual.alternator_status,
      injectionTiming: 15.0, // default placeholder
      throttlePosition: actual.throttle,
      engineLoad: actual.engine_load,
      ambientTemperature: actual.ambient_temperature,
      ambientPressure: actual.ambient_pressure,
      altitude: actual.altitude,
      fuelConsumed: nextFuel,
      engineStatus: status,
      healthIndex: data.overall_health,
      rulCycles: -1, // ML unavailable marker
      anomalyScore: data.degradation_indicators.anomaly_score,
      faultPrediction: data.current_engine_state.health_state === 'NOMINAL' ? 'None' : `${data.current_engine_state.health_state} Status Alert`,
      degradationStatus: Math.round(data.degradation_indicators.degradation_rate * 100),
      modelConfidence: 98,
      subsystemHealth: mappedSubsystems,
      mission: {
        id: data.mission_context.mission_id,
        phase,
        flightTime: `${hrs}:${mins}:${secs}`,
        flightTimeSeconds: timeSec,
        altitude: data.mission_context.altitude,
        ambient: data.mission_context.ambient_temperature
      }
    };
  };

  // Replay playback states
  const [replayState, setReplayState] = useState({
    isPlaying: false,
    speed: 1,
    currentTime: 6120, // matching the screenshot: 1hr 42mins (6120 secs)
    duration: 7200 // 2 hours
  });

  // Alert events
  const [alerts, setAlerts] = useState<AlertEvent[]>([
    {
      id: 'alt-1',
      timestamp: '10:15:32',
      message: 'EGT Normalizing after altitude climb transition',
      severity: 'INFO',
      component: 'THERMAL',
      acknowledged: false
    },
    {
      id: 'alt-2',
      timestamp: '10:02:14',
      message: 'Piston 3 temperature fluctuation detected; residual deviation ±2.5%',
      severity: 'WARNING',
      component: 'THERMAL',
      acknowledged: false
    }
  ]);

  const replayLogs = useRef<TelemetryData[]>([]);

  // Pre-generate logs on mount
  useEffect(() => {
    replayLogs.current = generateReplayLogs(7200);
    // Populate initial history with past 30 data points
    const initialHistory: TelemetryData[] = [];
    const baseSec = 6120;
    for (let i = baseSec - 300; i <= baseSec; i += 10) {
      const idx = Math.min(Math.floor(i / 10), replayLogs.current.length - 1);
      if (replayLogs.current[idx]) {
        initialHistory.push(replayLogs.current[idx]);
      }
    }
    setTelemetryHistory(initialHistory);
    
    // Set initial screen state
    if (replayLogs.current[Math.floor(baseSec / 10)]) {
      setCurrentTelemetry(replayLogs.current[Math.floor(baseSec / 10)]);
    }
  }, []);

  // Interval for live engine simulation (updates every 1s when active)
  useEffect(() => {
    const useMock = import.meta.env.VITE_USE_MOCK_TELEMETRY === 'true';
    if (!useMock || !isConnected || isReplayMode) return;

    const interval = setInterval(() => {
      setCurrentTelemetry(prev => {
        // If in simulation mode, calculate using client-side formulas
        if (isSimulated) {
          const throttle = simulationInputs.throttle;
          const alt = simulationInputs.altitude;
          const ambient = simulationInputs.ambientTemp;
          
          // Basic formulas for demonstration prototyping
          const calculatedRpm = Math.round(1000 + (throttle / 100) * 1650 + (alt > 10000 ? - (alt - 10000) * 0.05 : 0));
          const calculatedCht = Math.round(150 + (throttle / 100) * 230 + (calculatedRpm / 10) * 0.3 - (alt * 0.002));
          const calculatedEgt = Math.round(700 + (throttle / 100) * 750 + Math.random() * 8 - (alt * 0.01));
          const calculatedOilPres = Math.round(40 + (calculatedRpm / 2650) * 30 + Math.random() * 2);
          const calculatedFuelFlow = Math.round((3 + (throttle / 100) * 9.5 + Math.random() * 0.2) * 10) / 10;
          const calcVibration = Math.round((0.4 + (calculatedRpm / 2650) * 0.8 + Math.random() * 0.1) * 10) / 10;

          // Fuel consumed increases over time
          const nextFuel = Math.round((prev.fuelConsumed + (calculatedFuelFlow / 3600)) * 1000) / 1000;
          const timeSec = prev.mission.flightTimeSeconds + 1;
          const hrs = Math.floor(timeSec / 3600).toString().padStart(2, '0');
          const mins = Math.floor((timeSec % 3600) / 60).toString().padStart(2, '0');
          const secs = (timeSec % 60).toString().padStart(2, '0');

          return {
            ...prev,
            timestamp: new Date().toLocaleTimeString(),
            rpm: calculatedRpm,
            cht: calculatedCht,
            egt: calculatedEgt,
            oilPressure: calculatedOilPres,
            fuelFlow: calculatedFuelFlow,
            vibration: calcVibration,
            fuelConsumed: nextFuel,
            altitude: alt,
            ambientTemperature: ambient,
            engineStatus: calculatedCht > 420 ? 'OVERHEATING' : 'RUNNING',
            mission: {
              ...prev.mission,
              flightTime: `${hrs}:${mins}:${secs}`,
              flightTimeSeconds: timeSec,
              altitude: alt,
              ambient: ambient,
            }
          };
        } else {
          // Standard live telemetry simulation (connected, slightly fluctuating nominal values)
          const rpmNoise = (Math.random() - 0.5) * 8;
          const chtNoise = (Math.random() - 0.5) * 1.5;
          const egtNoise = (Math.random() - 0.5) * 5;
          const presNoise = (Math.random() - 0.5) * 0.8;
          const flowNoise = (Math.random() - 0.5) * 0.1;

          const timeSec = prev.mission.flightTimeSeconds + 1;
          const hrs = Math.floor(timeSec / 3600).toString().padStart(2, '0');
          const mins = Math.floor((timeSec % 3600) / 60).toString().padStart(2, '0');
          const secs = (timeSec % 60).toString().padStart(2, '0');
          const flow = Math.max(10.0, Math.min(14.0, prev.fuelFlow + flowNoise));

          return {
            ...prev,
            timestamp: new Date().toLocaleTimeString(),
            rpm: Math.round(Math.max(2400, Math.min(2500, prev.rpm + rpmNoise))),
            cht: Math.round(Math.max(375, Math.min(385, prev.cht + chtNoise))),
            egt: Math.round(Math.max(1440, Math.min(1460, prev.egt + egtNoise))),
            oilPressure: Math.round(Math.max(62, Math.min(68, prev.oilPressure + presNoise))),
            fuelFlow: Math.round(flow * 10) / 10,
            fuelConsumed: Math.round((prev.fuelConsumed + (flow / 3600)) * 1000) / 1000,
            mission: {
              ...prev.mission,
              flightTime: `${hrs}:${mins}:${secs}`,
              flightTimeSeconds: timeSec
            }
          };
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isConnected, isSimulated, isReplayMode, simulationInputs]);

  // Keep track of telemetry history (limit to 30 values for graphs)
  useEffect(() => {
    if (!isConnected) return;
    setTelemetryHistory(prev => {
      const updated = [...prev, currentTelemetry];
      if (updated.length > 30) {
        updated.shift();
      }
      return updated;
    });
  }, [currentTelemetry, isConnected]);

  // Replay playback logic
  useEffect(() => {
    if (!isReplayMode || !replayState.isPlaying) return;

    const playbackInterval = setInterval(() => {
      setReplayState(prev => {
        const nextTime = prev.currentTime + prev.speed;
        if (nextTime >= prev.duration) {
          clearInterval(playbackInterval);
          return { ...prev, isPlaying: false, currentTime: prev.duration };
        }

        // Update current telemetry based on logged replay logs
        const logIdx = Math.floor(nextTime / 10);
        if (replayLogs.current[logIdx]) {
          setCurrentTelemetry(replayLogs.current[logIdx]);
        }

        return { ...prev, currentTime: nextTime };
      });
    }, 1000);

    return () => clearInterval(playbackInterval);
  }, [isReplayMode, replayState.isPlaying, replayState.speed]);

  // Toggle engine connection
  const toggleConnection = () => {
    const useMock = import.meta.env.VITE_USE_MOCK_TELEMETRY === 'true';
    if (useMock) {
      setIsConnected(prev => !prev);
    } else {
      if (connectionStatus === 'CONNECTED') {
        if (wsServiceRef.current) wsServiceRef.current.close();
      } else {
        if (wsServiceRef.current) wsServiceRef.current.connect();
      }
    }
  };

  // Replay controls
  const startReplay = () => {
    setIsReplayMode(true);
    setIsSimulated(false);
    setReplayState(prev => ({ ...prev, isPlaying: true }));
  };

  const pauseReplay = () => {
    setReplayState(prev => ({ ...prev, isPlaying: false }));
  };

  const setReplaySpeed = (speed: number) => {
    setReplayState(prev => ({ ...prev, speed }));
  };

  const seekReplay = (timeSeconds: number) => {
    const clampedTime = Math.max(0, Math.min(replayState.duration, timeSeconds));
    setReplayState(prev => ({ ...prev, currentTime: clampedTime }));
    const logIdx = Math.floor(clampedTime / 10);
    if (replayLogs.current[logIdx]) {
      setCurrentTelemetry(replayLogs.current[logIdx]);
    }
  };

  const toggleReplayMode = (active: boolean) => {
    setIsReplayMode(active);
    if (active) {
      setIsSimulated(false);
      seekReplay(replayState.currentTime);
    } else {
      setReplayState(prev => ({ ...prev, isPlaying: false }));
      // Return to real-time mock data
      setCurrentTelemetry(INITIAL_TELEMETRY);
    }
  };

  // Trigger a mock engine fault (warning or critical alert)
  const triggerMockFault = (type: string) => {
    const time = new Date().toLocaleTimeString();
    const newAlert: AlertEvent = {
      id: `alt-${Date.now()}`,
      timestamp: time,
      message: '',
      severity: 'WARNING',
      component: 'GENERAL',
      acknowledged: false
    };

    if (type === 'Piston Degradation') {
      newAlert.message = 'Piston 3 high temperature deviation detected - potential rings micro-wear';
      newAlert.severity = 'WARNING';
      newAlert.component = 'MECHANICAL';
      setAlerts(prev => [newAlert, ...prev]);
      setCurrentTelemetry(prev => ({
        ...prev,
        anomalyScore: 0.68,
        faultPrediction: 'Piston 3 Thermal Wear',
        healthIndex: 84,
        rulCycles: 110,
        subsystemHealth: {
          ...prev.subsystemHealth,
          mechanical: 81,
          thermal: 88
        }
      }));
    } else if (type === 'Oil Pressure Drop') {
      newAlert.message = 'CRITICAL: Oil pressure drop below safety thresholds (42 PSI)';
      newAlert.severity = 'CRITICAL';
      newAlert.component = 'FUEL'; // related to lubricants/fluid loops
      setAlerts(prev => [newAlert, ...prev]);
      setCurrentTelemetry(prev => ({
        ...prev,
        oilPressure: 42,
        anomalyScore: 0.91,
        faultPrediction: 'Oil Leakage / Pump Fault',
        healthIndex: 65,
        rulCycles: 45,
        engineStatus: 'FAULT',
        subsystemHealth: {
          ...prev.subsystemHealth,
          mechanical: 78,
          fuel: 60
        }
      }));
    } else if (type === 'Alternator Fault') {
      newAlert.message = 'Alternator status output FAULT; battery voltage dropping (23.8V)';
      newAlert.severity = 'WARNING';
      newAlert.component = 'ELECTRICAL';
      setAlerts(prev => [newAlert, ...prev]);
      setCurrentTelemetry(prev => ({
        ...prev,
        alternatorStatus: 'FAULT',
        batteryVoltage: 23.8,
        anomalyScore: 0.52,
        faultPrediction: 'Alternator Charging Error',
        healthIndex: 82,
        subsystemHealth: {
          ...prev.subsystemHealth,
          electrical: 70
        }
      }));
    } else if (type === 'Normal') {
      setCurrentTelemetry(INITIAL_TELEMETRY);
      setAlerts(prev => [
        {
          id: `alt-${Date.now()}`,
          timestamp: time,
          message: 'All engine subsystems normalized; telemetry values stable',
          severity: 'INFO',
          component: 'GENERAL',
          acknowledged: false
        },
        ...prev
      ]);
    }
  };

  const clearAlerts = () => {
    setAlerts([]);
  };

  const acknowledgeAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
  };

  // If simulationInputs changes, toggle isSimulated flag
  useEffect(() => {
    if (simulationInputs.throttle !== 75 || simulationInputs.altitude !== 8500 || simulationInputs.ambientTemp !== -10) {
      setIsSimulated(true);
    }
  }, [simulationInputs]);

  return (
    <TelemetryContext.Provider value={{
      currentTelemetry,
      telemetryHistory,
      alerts,
      isConnected,
      isSimulated,
      isReplayMode,
      simulationInputs,
      setSimulationInputs,
      replayState,
      toggleConnection,
      startReplay,
      pauseReplay,
      setReplaySpeed,
      seekReplay,
      toggleReplayMode,
      triggerMockFault,
      clearAlerts,
      acknowledgeAlert,
      expectedTelemetry,
      residuals,
      connectionStatus
    }}>
      {children}
    </TelemetryContext.Provider>
  );
};
