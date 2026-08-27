from typing import Dict
from .models import EngineState, ExpectedEngineState

class ResidualGenerator:
    """
    Computes differences between actual sensor readouts and physics-performance expectations:
    Residual = Actual Value - Expected Value
    
    Residuals serve as features/signals for downstream health scoring and AI/ML algorithms.
    """

    @staticmethod
    def calculate_residuals(actual: EngineState, expected: ExpectedEngineState) -> Dict[str, float]:
        """
        Calculates residuals for key telemetry parameters.
        
        :param actual: Current actual EngineState.
        :param expected: Current ExpectedEngineState from physics models.
        :return: A dictionary of parameter residuals.
        """
        # If engine is off, residuals are force-zeroed to prevent noise
        if actual.rpm < 100.0:
            return {
                "rpm": 0.0,
                "cht": 0.0,
                "egt": 0.0,
                "oil_pressure": 0.0,
                "fuel_flow": 0.0,
                "map": 0.0,
                "vibration": 0.0
            }

        return {
            "rpm": round(actual.rpm - expected.rpm, 1),
            "cht": round(actual.cht - expected.cht, 1),
            "egt": round(actual.egt - expected.egt, 1),
            "oil_pressure": round(actual.oil_pressure - expected.oil_pressure, 1),
            "fuel_flow": round(actual.fuel_flow - expected.fuel_flow, 2),
            "map": round(actual.map - expected.map, 1),
            "vibration": round(actual.vibration - expected.vibration, 2)
        }
