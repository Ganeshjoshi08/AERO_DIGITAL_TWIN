# AeroTwin Digital Twin Core V0.1

This package implements the core **Digital Twin Engine (V0.1)** for the AeroTwin project. It acts as the virtual representation of the aero-piston engine, continuously validating, updating, and comparing physical telemetry inputs against thermodynamic expected baselines to detect residuals and assess subsystem health.

---

## 1. What the Digital Twin IS and IS NOT

### What it IS:
* A **computational engineering state model** running physics and thermodynamic approximations.
* A **deterministic residual generator** comparing sensor telemetry against expected behavior under identical environmental conditions.
* A **diagnostic calculator** evaluating subsystem wear indexes (0-100) and overall safety ratings.
* An **extensible, modular foundation** designed to run on the ground station server (FastAPI) and consume telemetry streams.

### What it IS NOT:
* **NOT** a 3D animation tool. (The React 4-cylinder visual animation is merely the HMI representation layer).
* **NOT** a standalone Machine Learning model. (The AI models for Remaining Useful Life (RUL) and anomaly classification reside in separate prognostic layers).
* **NOT** a certified aviation safety instrument or flight simulator. (V0.1 calculations represent prototype calibrations and must not be used as actual airworthiness limits).

---

## 2. Core Architecture & Update Cycle

The Digital Twin behaves as a state model updated sequentially over time ($t_0, t_1, t_2...$):

```
       [Raw Telemetry Frame]
                 ↓
      [Validation & Ingestion] (models.py: Pydantic range validation)
                 ↓
       [Engine State Update] (models.py: EngineState updated)
                 ↓
     [Operating Mode Classify] (operating_state.py: Idle/Cruise/Starting)
                 ↓
      [Run Thermodynamic Curve] (performance.py: PerformanceModel)
                 ↓
     [Calculate Expected State] (models.py: ExpectedEngineState)
                 ↓
      [Evaluate Sensor Deltas] (residuals.py: Residual = Actual - Expected)
                 ↓
     [Assess Structural Health] (health.py: Subsystem Deductions)
                 ↓
      [Log Degradation History] (tracker.py: Sliding Window, Rates)
                 ↓
      [JSON Output Compilation] (models.py: DigitalTwinOutput)
```

---

## 3. Mathematical & Physics Assumptions

The physics calculators in [`physics.py`](physics.py) and performance estimators in [`performance.py`](performance.py) implement transparent, deterministic relationships:

1. **Air Density (Ideal Gas Law)**:
   $$\rho = \frac{P}{R \cdot T}$$
   * *Assumption:* Dry air constants apply. Pressure is scaled from hectopascals (hPa) to Pascals (Pa), and ambient temperature is converted to Kelvin ($K = °C + 273.15$). SPECIFIC gas constant $R = 287.058 \text{ J}/(\text{kg}\cdot\text{K})$.
   
2. **Crankshaft Angular Velocity**:
   $$\omega = \frac{2\pi \cdot \text{RPM}}{60}$$
   * Used to establish Torque/Power relations ($\text{Torque} = \text{Power} / \omega$).

3. **Performance Curves (Hypothetical Aero-Piston Engine)**:
   * **Expected MAP:** Air restriction scales linearly with throttle $\text{MAP} = P_{\text{amb}} \cdot (0.3 + 0.7 \cdot \text{throttle}\%)$.
   * **Expected Fuel Flow:** Fuel burn rate increases with throttle/RPM and is scaled by the local air density ratio ($\rho_{\text{actual}} / \rho_{\text{sea\_level}}$) to represent automatic mixture altitude compensation.
   * **Expected Temperatures (EGT & CHT):** Driven by commanded load and cooled by ambient temperatures at speed. EGT decreases with altitude pressure losses, while CHT responds to ambient air convective cooling.
   * **Expected Oil Pressure:** Scaled to oil pump speed (RPM), with pressure losing efficiency at high temperatures due to lubricant viscosity drops.

---

## 4. Subsystem Health Indexing

Health values are derived by deducting scores from 100 based on absolute residual deviations:
* **Thermal:** Penalized when CHT deviations exceed 15°F or EGT deviations exceed 80°F.
* **Combustion:** Monitored via EGT residual spikes and RPM instability.
* **Lubrication:** Deductions triggered by oil pressure residuals exceeding 8 PSI, absolute pressure dropping below 40 PSI, or oil temperature exceeding 230°F.
* **Mechanical:** Tracked via structural vibration levels (warnings at >0.6g deviations or >2.5g absolute).
* **Electrical:** Alternator failure immediately drops Electrical health by 40%; voltage limits warnings at <24.5V or >29.5V.
* **Sensor:** Plausibility checks flag impossible readings (e.g. fuel flow while RPM is 0).

The **Overall Engine Health Index** is calculated using a safety-first model combining the weighted average and the lowest subsystem score:
$$\text{Overall Health} = 0.7 \cdot \text{Mean Subsystems} + 0.3 \cdot \min(\text{Subsystems})$$

---

## 5. Downstream Integration (AI/ML & FastAPI)

### AI/ML Feature Vectors:
The `DegradationTracker` provides a flat feature representation combining raw sensor values, computed residuals, and health degradation rates:
```python
tracker = DegradationTracker()
# ...
features = tracker.get_feature_vector()
# Output: {"rpm": 2450.0, "residual_egt": 12.0, "degradation_rate": -0.005, ...}
```
This is easily ingested by XGBoost classifiers or LSTM time-series forecast models for RUL calculation.

### JSON Payload Contract:
The `DigitalTwinOutput` compiles the complete state evaluation. Call `output.model_dump_json()` to generate clean JSON strings that can be exposed via FastAPI endpoints or sent over WebSockets to feed the React HMI dashboard.
