import math
from typing import Dict, Any, Optional
from datetime import datetime

class TelemetryMapper:
    """
    Service responsible for converting raw telemetry fields from CSV representation
    into physical/operational units and formats expected by the DigitalTwinCore.
    """

    @staticmethod
    def map_csv_to_engine_state(row: Dict[str, Any], default_fallback: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Maps a raw CSV dictionary row to a schema structure compatible with EngineState.
        Applies unit conversions:
          - CHT_C -> CHT in °F (CHT_C * 1.8 + 32.0)
          - EGT_C -> EGT in °F (EGT_C * 1.8 + 32.0)
          - Oil_Pressure_bar -> Oil Pressure in PSI (Oil_Pressure_bar * 14.5037738)
          - Oil_Temperature_C -> Oil Temperature in °F (Oil_Temperature_C * 1.8 + 32.0)
          - Fuel_Flow_L_h -> Fuel Flow in GPH (Fuel_Flow_L_h * 0.264172052)
          - Ambient_Pressure_kPa -> Ambient Pressure in hPa (Ambient_Pressure_kPa * 10.0)
          - Altitude_m -> Altitude in feet (Altitude_m * 3.2808399)
          - Alternate_Status_Output -> alternator_status 'OK' if >= 0.5 else 'FAULT'
          - MAP -> estimated as ambient_pressure_hPa * (0.3 + 0.7 * (throttle / 100))
          - Fuel Pressure -> default nominal value 45.0 PSI
        """
        if default_fallback is None:
            # Baseline nominal constants matching typical cruise parameters
            default_fallback = {
                "RPM": 2450.0,
                "Throttle_Position_pct": 75.0,
                "Engine_Load_pct": 78.0,
                "CHT_C": 193.33,         # ~380 °F
                "EGT_C": 787.78,         # ~1450 °F
                "Oil_Pressure_bar": 4.48, # ~65 PSI
                "Oil_Temperature_C": 90.56,# ~195 °F
                "Fuel_Flow_L_h": 46.94,   # ~12.4 GPH
                "Vibration_g": 1.2,
                "Battery_Voltage_V": 27.8,
                "Alternate_Status_Output": 1.0,
                "Ambient_Temperature_C": -10.0,
                "Ambient_Pressure_kPa": 71.5, # ~715 hPa
                "Altitude_m": 2590.8,     # ~8500 ft
            }

        def safe_float(key: str) -> float:
            val = row.get(key)
            if val is None or val == "":
                return default_fallback[key]
            try:
                f_val = float(val)
                if math.isnan(f_val) or math.isinf(f_val):
                    return default_fallback[key]
                return f_val
            except ValueError:
                return default_fallback[key]

        # Ingest and convert operational data
        rpm = safe_float("RPM")
        throttle = safe_float("Throttle_Position_pct")
        engine_load = safe_float("Engine_Load_pct")
        
        cht_c = safe_float("CHT_C")
        cht = cht_c * 1.8 + 32.0
        
        egt_c = safe_float("EGT_C")
        egt = egt_c * 1.8 + 32.0
        
        oil_pressure_bar = safe_float("Oil_Pressure_bar")
        oil_pressure = oil_pressure_bar * 14.5037738
        
        oil_temp_c = safe_float("Oil_Temperature_C")
        oil_temperature = oil_temp_c * 1.8 + 32.0
        
        fuel_flow_lh = safe_float("Fuel_Flow_L_h")
        fuel_flow = fuel_flow_lh * 0.264172052
        
        vibration = safe_float("Vibration_g")
        battery_voltage = safe_float("Battery_Voltage_V")
        
        alt_status_val = safe_float("Alternate_Status_Output")
        alternator_status = "OK" if alt_status_val >= 0.5 else "FAULT"
        
        ambient_temp = safe_float("Ambient_Temperature_C")
        ambient_pressure_kpa = safe_float("Ambient_Pressure_kPa")
        ambient_pressure = ambient_pressure_kpa * 10.0
        
        altitude_m = safe_float("Altitude_m")
        altitude = altitude_m * 3.2808399
        
        # Derive estimated Manifold Absolute Pressure (MAP)
        map_val = ambient_pressure * (0.3 + 0.7 * (throttle / 100.0))
        
        # Static baseline constant for fuel pressure
        fuel_pressure = 45.0
        
        # Format dataset Timestamp
        timestamp_str = row.get("Timestamp", "")
        if not timestamp_str or timestamp_str.strip() == "":
            timestamp_str = datetime.now().isoformat()

        # Clamp inputs to stay within EngineState validation constraints (prevent crashes under extreme failure states)
        rpm = max(0.0, min(4000.0, rpm))
        throttle = max(0.0, min(100.0, throttle))
        engine_load = max(0.0, min(120.0, engine_load))
        map_val = max(100.0, min(1500.0, map_val))
        cht = max(32.0, min(599.9, cht))
        egt = max(32.0, min(1999.9, egt))
        oil_pressure = max(0.0, min(149.9, oil_pressure))
        oil_temperature = max(32.0, min(299.9, oil_temperature))
        fuel_flow = max(0.0, min(29.9, fuel_flow))
        vibration = max(0.0, min(9.99, vibration))
        battery_voltage = max(0.0, min(36.0, battery_voltage))
        ambient_temp = max(-60.0, min(60.0, ambient_temp))
        ambient_pressure = max(100.0, min(1200.0, ambient_pressure))
        altitude = max(-1000.0, min(25000.0, altitude))

        return {
            "timestamp": timestamp_str,
            "rpm": round(rpm, 1),
            "throttle": round(throttle, 1),
            "engine_load": round(engine_load, 1),
            "map": round(map_val, 1),
            "cht": round(cht, 1),
            "egt": round(egt, 1),
            "oil_pressure": round(oil_pressure, 1),
            "oil_temperature": round(oil_temperature, 1),
            "fuel_flow": round(fuel_flow, 2),
            "fuel_pressure": fuel_pressure,
            "vibration": round(vibration, 2),
            "battery_voltage": round(battery_voltage, 1),
            "alternator_status": alternator_status,
            "ambient_temperature": round(ambient_temp, 1),
            "ambient_pressure": round(ambient_pressure, 1),
            "altitude": round(altitude, 1)
        }
