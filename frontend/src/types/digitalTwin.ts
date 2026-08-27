export interface EngineState {
  timestamp?: string;
  rpm: number;
  throttle: number;
  engine_load: number;
  map: number;
  cht: number;
  egt: number;
  oil_pressure: number;
  oil_temperature: number;
  fuel_flow: number;
  fuel_pressure: number;
  vibration: number;
  battery_voltage: number;
  alternator_status: 'OK' | 'FAULT';
  ambient_temperature: number;
  ambient_pressure: number;
  altitude: number;
  operating_mode?: string;
  health_state?: string;
}

export interface ExpectedEngineState {
  rpm: number;
  fuel_flow: number;
  egt: number;
  cht: number;
  engine_load: number;
  map: number;
  oil_pressure: number;
  vibration: number;
}

export interface SubsystemHealth {
  mechanical: number;
  combustion: number;
  fuel_system: number;
  lubrication: number;
  thermal: number;
  electrical: number;
  sensor: number;
}

export interface MissionContext {
  mission_id: string;
  flight_phase: string;
  altitude: number;
  ambient_temperature: number;
  ambient_pressure: number;
  duration: number;
  operating_condition: string;
}

export interface DigitalTwinOutput {
  timestamp: string;
  current_engine_state: EngineState;
  expected_engine_state: ExpectedEngineState;
  residuals: Record<string, number>;
  operating_mode: string;
  subsystem_health: SubsystemHealth;
  overall_health: number;
  degradation_indicators: {
    anomaly_score: number;
    degradation_rate: number;
  };
  mission_context: MissionContext;
}
