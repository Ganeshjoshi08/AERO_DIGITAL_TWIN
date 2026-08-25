EP-03 — Exhaust Gas Temperature (EGT)
1. Parameter Identification
Field	Specification
Parameter ID	EP-03
Parameter Name	Exhaust Gas Temperature
Abbreviation	EGT
Parameter Category	Thermal / Combustion Health Parameter
Criticality	Critical
2. Parameter Description

Exhaust Gas Temperature (EGT) represents the temperature of the exhaust gas measured at the designated exhaust measurement location.

EGT is an important indicator of:

Combustion behaviour
Thermal loading
Engine operating condition
Fuel-air/combustion behaviour
Performance changes
Abnormal combustion
Engine degradation

For this project, EGT will be particularly important because it provides a direct thermal signature that can be compared against the Digital Twin's expected engine behaviour.

3. Unit
Unit: °C

Example:

EGT = 700 °C

The system shall preserve the original measurement unit and perform conversions only when required.

4. Measurement / Data Source

EGT may be obtained from:

Thermocouple
Exhaust temperature sensor
Engine ECU
CAN telemetry
Engine instrumentation
Engine simulator

Typical architecture:

Exhaust Gas
     ↓
Temperature Sensor
     ↓
Signal Conditioning
     ↓
ECU / DAQ
     ↓
CAN / Telemetry
     ↓
Digital Twin System

The exact sensor type, sensor location and installation method shall depend on the selected reference engine.

5. Measurement Type

EGT is primarily a directly measured thermal parameter.

The Digital Twin may additionally estimate expected EGT based on:

RPM
Engine load
Fuel flow
Throttle
Ambient conditions
Engine state

Therefore:

Measured EGT
     ↓
Actual Combustion / Thermal State

Expected EGT
     ↓
Digital Twin State
6. Operating Condition Dependency

EGT depends on several operating parameters:

RPM
Engine load
Throttle
Fuel flow
Injection timing
Ambient temperature
Altitude
Engine operating state
Mission phase

Conceptually:

Engine Load
     +
Fuel Flow
     +
Combustion Conditions
     ↓
Exhaust Gas Temperature

Therefore, EGT should always be interpreted in its operating context.

7. Expected Operating Behaviour

During normal operation, EGT should remain within the engine-specific thermal operating envelope.

Typical behaviour:

Engine Start
     ↓
EGT rises
     ↓
Combustion Stabilizes
     ↓
Stable Operating Region
     ↓
Throttle / Load Change
     ↓
EGT Response

A change in engine load or throttle can legitimately produce a corresponding EGT change.

Exact EGT operating limits shall be obtained from the selected engine's manufacturer documentation and validated engine/test data.

No generic numeric limit shall be permanently hard-coded at this stage.

8. Validation Rules

EGT data shall undergo:

Range validation

Detect impossible or invalid values.

Rate-of-change validation

Detect unrealistic instantaneous temperature changes.

Example:

690°C
695°C
700°C
705°C
950°C ← suspicious
Missing-data validation

Detect absent samples.

Stale-data validation

Detect measurements that have stopped updating.

Cross-parameter validation

Compare EGT with:

RPM
Fuel flow
CHT
Engine load
Throttle
Digital Twin validation

Compare measured EGT against model-predicted EGT.

9. Sampling / Update Requirement

EGT shall be sampled frequently enough to capture:

Engine start
Warm-up
Steady-state operation
Throttle transitions
Load changes
Rapid thermal changes
Abnormal combustion events

The exact acquisition frequency shall be determined by:

Sensor response
ECU/DAQ capability
Engine thermal dynamics
Communication architecture

For the software prototype, the update rate shall remain configurable.

10. Digital Twin Relevance

EGT shall be an important variable in the Digital Twin's combustion and thermal state estimation.

The Digital Twin may estimate expected EGT using:

RPM
+
Load
+
Fuel Flow
+
Injection Timing
+
Ambient Conditions
        ↓
Combustion / Thermal Model
        ↓
Expected EGT

The system shall calculate the EGT residual:

EGT Residual =
Measured EGT − Expected EGT

The residual shall be available to:

Health Monitoring
Fault Detection
AI/ML
Degradation Analysis
11. Health Monitoring Relevance

EGT shall contribute to:

Thermal Health
EGT behaviour
    ↓
Thermal condition
Combustion Health
EGT behaviour
    ↓
Combustion condition
Performance Health

Unexpected EGT behaviour may indicate changes in engine performance.

The system shall evaluate EGT together with other parameters rather than using it independently.

12. Fault Detection Relevance

Abnormal EGT behaviour may contribute to detection of:

Combustion instability
Misfire
Injector abnormality
Overheating
Incorrect fuel/combustion behaviour
Engine performance degradation
Sensor fault

Example:

EGT ↑
+
Fuel Flow ↑
+
CHT ↑
        ↓
Possible combustion / thermal abnormality

Another example:

EGT ↓ unexpectedly
+
RPM instability
+
Vibration change
        ↓
Possible combustion abnormality

These patterns are diagnostic indicators, not standalone fault conclusions.

13. AI/ML Relevance

EGT shall be available as both a direct and derived AI/ML feature.

Direct feature
EGT
Statistical features
EGT Mean
EGT Maximum
EGT Minimum
EGT Standard Deviation
Trend features
EGT Rate of Increase
EGT Rate of Decrease
EGT Long-Term Trend
Residual feature
EGT Residual
=
Actual EGT − Expected EGT
Combined features
EGT + RPM + Fuel Flow + CHT

These features may be used for:

Anomaly detection
Fault classification
Combustion analysis
Degradation prediction
RUL modelling
14. Dashboard Representation

EGT shall be displayed in real time.

Example:

┌────────────────────┐
│ EXHAUST GAS TEMP   │
│                    │
│       702 °C       │
│                    │
│      ● NORMAL      │
└────────────────────┘

The dashboard should also display:

Actual EGT:       702°C
Expected EGT:     695°C
Deviation:          +7°C

A trend chart shall allow the user to observe EGT behaviour over time.

15. Data Quality Requirements

EGT data shall support:

VALID
WARNING
INVALID
MISSING
STALE

Example:

EGT: 702°C
Quality: VALID

If the sensor stops updating:

EGT: 702°C
Quality: STALE
Last Update: 2.3 s ago

The system shall not interpret stale EGT data as a current measurement.

16. Fault / Failure Signatures

Potential EGT abnormal patterns include:

Persistent high EGT
690 → 700 → 715 → 730°C

Possible indications:

Abnormal combustion
Excessive thermal loading
Fuel/mixture-related abnormality
Cooling/operating condition changes
Unexpected EGT drop

Possible indications:

Combustion instability
Misfire
Fuel delivery abnormality
Sensor issue
Rapid EGT fluctuation
700 → 730 → 695 → 725 → 690

May indicate:

Combustion instability
Transient operation
Sensor noise
Other abnormal behaviour
EGT inconsistent with operating condition
Stable RPM
Stable Load
Stable Ambient Conditions
        +
Unexpected EGT change
        ↓
Possible abnormal behaviour
17. Parameter Relationships

EGT shall be correlated with several other parameters.

EGT ↔ RPM
RPM / Load
     ↓
Combustion Behaviour
     ↓
EGT
EGT ↔ Fuel Flow
Fuel Flow
     ↓
Combustion
     ↓
EGT
EGT ↔ CHT
Combustion
     ↓
EGT + CHT
EGT ↔ Injection Timing
Injection Timing
      ↓
Combustion Timing
      ↓
EGT

These relationships are valuable for:

Digital Twin modelling
Fault diagnosis
Sensor validation
AI/ML feature engineering
18. Criticality
Criticality: CRITICAL

Reason:

EGT provides important information about combustion and thermal behaviour.

Loss or corruption of EGT data can reduce confidence in:

Combustion health
Thermal health
Fault detection
Digital Twin accuracy
AI/ML predictions

Therefore, EGT data quality shall be continuously monitored.

19. Data Storage Requirements

Each EGT measurement shall contain:

timestamp
mission_id
engine_id
parameter_id
value
unit
quality_status
source

Example:

Mission ID: M001
Engine ID: E001
Parameter: EP-03
Value: 702
Unit: °C
Quality: VALID
Timestamp: 10:32:01.250
Source: Simulator

For Digital Twin analysis, derived fields may include:

expected_egt
egt_residual
thermal_indicator
combustion_indicator
20. Verification & Validation

EGT implementation shall be verified using:

A. Sensor documentation

Verify:

Sensor type
Measurement range
Accuracy
Response characteristics
Installation location
Interface
B. Engine test data

Compare measured EGT against validated engine behaviour.

C. Controlled simulation

Generate:

Engine start
Warm-up
Stable cruise
Load increase
Load decrease
Rapid throttle transition
High-temperature condition
Combustion abnormality scenario
D. Cross-parameter validation

Compare EGT against:

RPM
Fuel flow
CHT
Engine load
Injection timing
Ambient conditions
E. Digital Twin validation

Compare:

Measured EGT
      vs
Expected EGT

and evaluate the resulting residual.