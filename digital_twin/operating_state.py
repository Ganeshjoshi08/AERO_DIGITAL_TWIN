from enum import Enum
from typing import Optional

class OperatingMode(str, Enum):
    ENGINE_OFF = "ENGINE_OFF"
    STARTING = "STARTING"
    IDLE = "IDLE"
    LOW_LOAD = "LOW_LOAD"
    CRUISE = "CRUISE"
    HIGH_LOAD = "HIGH_LOAD"
    TRANSIENT = "TRANSIENT"
    SHUTDOWN = "SHUTDOWN"


class HealthState(str, Enum):
    NOMINAL = "NOMINAL"
    MONITOR = "MONITOR"
    DEGRADED = "DEGRADED"
    CRITICAL = "CRITICAL"
    FAULT = "FAULT"


class OperatingStateClassifier:
    """
    Classifies the current engine operating mode and health state based on
    telemetry parameters, residuals, and safety thresholds.
    """

    @staticmethod
    def classify_mode(
        rpm: float, 
        throttle: float, 
        engine_load: float, 
        fuel_flow: float,
        prev_throttle: Optional[float] = None
    ) -> OperatingMode:
        """
        Determines the engine operating mode from core telemetry.
        """
        # Engine is not rotating
        if rpm < 100.0:
            return OperatingMode.ENGINE_OFF

        # Engine is cranking but not self-sustaining
        if 100.0 <= rpm < 900.0:
            return OperatingMode.STARTING

        # Engine is winding down
        if rpm >= 900.0 and fuel_flow < 0.5 and throttle < 2.0:
            return OperatingMode.SHUTDOWN

        # Check for rapid throttle movements (Transient state)
        if prev_throttle is not None and abs(throttle - prev_throttle) > 10.0:
            return OperatingMode.TRANSIENT

        # Idle speed range
        if 900.0 <= rpm < 1200.0 and throttle < 15.0:
            return OperatingMode.IDLE

        # Load-based modes
        if throttle > 75.0 or engine_load > 80.0:
            return OperatingMode.HIGH_LOAD

        if 15.0 <= throttle <= 45.0 or engine_load <= 45.0:
            return OperatingMode.LOW_LOAD

        return OperatingMode.CRUISE

    @staticmethod
    def classify_health(
        overall_health: float,
        anomaly_score: float,
        alternator_status: str,
        oil_pressure: float,
        rpm: float
    ) -> HealthState:
        """
        Determines the overall health state categorisation.
        """
        # Alternator failure or critical lubrication drop is considered an active fault
        if alternator_status == "FAULT" or (rpm > 1000.0 and oil_pressure < 30.0):
            return HealthState.FAULT

        if overall_health < 50.0:
            return HealthState.CRITICAL

        if overall_health < 75.0 or anomaly_score >= 0.7:
            return HealthState.DEGRADED

        if overall_health < 90.0 or anomaly_score >= 0.35:
            return HealthState.MONITOR

        return HealthState.NOMINAL
