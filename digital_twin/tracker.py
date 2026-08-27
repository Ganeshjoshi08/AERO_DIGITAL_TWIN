from typing import List, Dict, Any, Optional
from datetime import datetime
from .models import DigitalTwinOutput

class DegradationTracker:
    """
    Maintains historical logs of digital twin outputs to track wear trends.
    Computes rolling degradation parameters and prepares feature vectors for AI/ML models.
    """

    def __init__(self, max_history_len: int = 500):
        self.max_history_len = max_history_len
        self.history: List[Dict[str, Any]] = []

    def add_record(self, twin_output: DigitalTwinOutput) -> None:
        """
        Ingests a completed DigitalTwinOutput and appends it to the history.
        """
        record = {
            "timestamp": twin_output.timestamp,
            "overall_health": twin_output.overall_health,
            "operating_mode": twin_output.operating_mode,
            "residuals": twin_output.residuals.copy(),
            "rpm": twin_output.current_engine_state.rpm,
            "cht": twin_output.current_engine_state.cht,
            "egt": twin_output.current_engine_state.egt,
            "oil_pressure": twin_output.current_engine_state.oil_pressure,
            "fuel_flow": twin_output.current_engine_state.fuel_flow,
            "vibration": twin_output.current_engine_state.vibration,
            "engine_load": twin_output.current_engine_state.engine_load
        }
        
        self.history.append(record)
        
        # Enforce rolling window memory bounds
        if len(self.history) > self.max_history_len:
            self.history.pop(0)

    def calculate_degradation_rate(self) -> float:
        """
        Calculates the rate of overall health decline per step based on history.
        A return value of 0.05 indicates the engine overall health is losing 0.05 points per cycle/step.
        """
        if len(self.history) < 2:
            return 0.0

        first_health = self.history[0]["overall_health"]
        last_health = self.history[-1]["overall_health"]
        steps = len(self.history) - 1

        # Rate of change: (Start - End) / Total Steps
        # A positive value represents health loss rate
        rate = (first_health - last_health) / steps
        return round(rate, 4)

    def get_feature_vector(self) -> Dict[str, float]:
        """
        Compiles the current raw inputs and residuals into a flattened feature dict
        suitable for feeding directly into downstream XGBoost or scikit-learn models.
        """
        if not self.history:
            return {}

        latest = self.history[-1]
        features = {}

        # Core operating measurements
        features["rpm"] = latest["rpm"]
        features["cht"] = latest["cht"]
        features["egt"] = latest["egt"]
        features["oil_pressure"] = latest["oil_pressure"]
        features["fuel_flow"] = latest["fuel_flow"]
        features["vibration"] = latest["vibration"]
        features["engine_load"] = latest["engine_load"]

        # Deviation Residuals (extremely useful features for predictive ML pipelines)
        for key, val in latest["residuals"].items():
            features[f"residual_{key}"] = val

        # Rolling degradation trend
        features["degradation_rate"] = self.calculate_degradation_rate()

        return features

    def clear_history(self) -> None:
        """
        Resets the tracker database window.
        """
        self.history.clear()
