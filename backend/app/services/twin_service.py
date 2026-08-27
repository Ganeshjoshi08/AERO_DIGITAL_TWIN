from typing import Optional, Dict, Any
from digital_twin.core import DigitalTwinCore
from digital_twin.models import DigitalTwinOutput, MissionContext, ExpectedEngineState

class DigitalTwinService:
    """
    Singleton service wrapper around the DigitalTwinCore.
    Maintains persistent virtual state across REST and WebSocket connections.
    """
    _instance: Optional["DigitalTwinService"] = None

    def __new__(cls, *args: Any, **kwargs: Any) -> "DigitalTwinService":
        if not cls._instance:
            cls._instance = super(DigitalTwinService, cls).__new__(cls, *args, **kwargs)
            cls._instance._init_service()
        return cls._instance

    def _init_service(self) -> None:
        self.core = DigitalTwinCore()
        
        # Nominal default telemetry matching HMI baseline specifications
        self.default_telemetry = {
            "rpm": 2450.0,
            "throttle": 75.0,
            "engine_load": 78.0,
            "map": 1013.0,
            "cht": 380.0,
            "egt": 1450.0,
            "oil_pressure": 65.0,
            "oil_temperature": 195.0,
            "fuel_flow": 12.4,
            "fuel_pressure": 45.0,
            "vibration": 1.2,
            "battery_voltage": 27.8,
            "alternator_status": "OK",
            "ambient_temperature": -10.0,
            "ambient_pressure": 715.0,
            "altitude": 8500.0
        }
        
        # Pre-populate the twin state so endpoints are instantly available
        self.last_output = self.core.update(self.default_telemetry)

    def get_latest_output(self) -> DigitalTwinOutput:
        """
        Retrieves the current evaluated state of the virtual engine.
        """
        return self.last_output

    def update_telemetry(
        self, 
        raw_telemetry: Dict[str, Any], 
        mission: Optional[MissionContext] = None
    ) -> DigitalTwinOutput:
        """
        Ingests new sensor readings, executes the physical/thermodynamic update cycle,
        and saves the resulting DigitalTwinOutput.
        """
        self.last_output = self.core.update(raw_telemetry, mission)
        return self.last_output

    def run_simulation_what_if(
        self, 
        target_rpm: float, 
        throttle: float, 
        altitude: float, 
        ambient_temp: float
    ) -> ExpectedEngineState:
        """
        Runs a simulation what-if calculations block, completely isolated from
        the active running state of the digital twin.
        """
        return self.core.run_what_if(
            target_rpm=target_rpm,
            throttle=throttle,
            altitude=altitude,
            ambient_temp=ambient_temp
        )
