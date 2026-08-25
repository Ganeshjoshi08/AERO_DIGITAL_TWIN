EP-02 — Cylinder Head Temperature (CHT)
1. Parameter Identification
Field	Specification
Parameter ID	EP-02
Parameter Name	Cylinder Head Temperature
Abbreviation	CHT
Parameter Category	Thermal / Engine Health Parameter
Criticality	Critical
2. Parameter Description

Cylinder Head Temperature (CHT) represents the temperature of the engine cylinder head at the sensor measurement location.

CHT is an important indicator of the engine's thermal condition and is useful for monitoring:

Combustion heat transfer
Cooling effectiveness
Thermal loading
Engine operating condition
Overheating tendency
Thermal degradation

CHT is particularly important for an aero-piston engine because sustained abnormal cylinder-head temperature can indicate excessive thermal loading or cooling/combustion problems.

3. Unit
Unit: °C

Example:

CHT = 175 °C

The system shall retain the original sensor unit and perform conversions only where required by the application.

4. Measurement / Data Source

CHT may be obtained from:

Thermocouple
RTD/temperature sensor where applicable
Engine ECU
CAN telemetry
Engine instrumentation system
Engine simulator

Typical architecture:

Cylinder Head
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

The exact sensor type and installation location shall depend on the selected reference engine.

5. Measurement Type

CHT is a directly measured thermal parameter.

The Digital Twin may additionally calculate an expected CHT based on:

RPM
Load
Fuel flow
Ambient conditions
Engine operating state

Therefore:

Measured CHT
     ↓
Actual Thermal State

Model CHT
     ↓
Expected Thermal State
6. Operating Condition Dependency

CHT is strongly influenced by:

Engine RPM
Engine load
Throttle
Fuel flow
Ambient temperature
Altitude
Cooling conditions
Mission phase
Duration of operation

Conceptually:

Load ↑
  +
Fuel / Combustion ↑
  ↓
Heat Generation ↑
  ↓
CHT Response

Therefore, CHT must be interpreted according to the engine's current operating condition.

7. Expected Operating Behaviour

During normal operation, CHT should remain within the engine-specific thermal operating envelope.

Typical behaviour:

Engine Start
    ↓
CHT increases
    ↓
Warm-up
    ↓
Stable operating region
    ↓
Load / throttle change
    ↓
CHT changes

During increased engine load, CHT may increase.

During reduced load, CHT may decrease.

Exact numerical CHT limits shall be taken from the selected engine's manufacturer documentation, instrumentation specifications, and/or validated test data.

8. Validation Rules

CHT data shall be validated using:

Range validation

Detect physically impossible or invalid values.

Rate-of-change validation

Detect unrealistic temperature jumps.

Example:

170°C
171°C
172°C
173°C
280°C  ← suspicious
Sensor quality

Check:

Missing samples
Stuck values
Communication loss
Excessive noise
Operating-condition validation

Compare CHT with:

RPM
Engine load
Fuel flow
Ambient temperature
Digital Twin validation

Compare measured CHT against expected CHT.

9. Sampling / Update Requirement

CHT shall be sampled frequently enough to capture:

Engine warm-up
Steady-state thermal behaviour
Load transitions
Throttle transitions
Thermal excursions
Overheating events

The exact sampling frequency shall be determined from the selected temperature sensor, DAQ/ECU interface, engine thermal dynamics, and system architecture.

For the prototype, the telemetry update interval shall remain configurable.

10. Digital Twin Relevance

CHT shall be an important thermal-state variable in the Digital Twin.

The Digital Twin may estimate expected CHT using:

RPM
+
Engine Load
+
Fuel Flow
+
Ambient Conditions
+
Engine State
        ↓
Thermal Model
        ↓
Expected CHT

The difference between measured and expected CHT becomes a useful residual.

CHT Residual =
Measured CHT − Expected CHT

This residual can support health and fault analysis.

11. Health Monitoring Relevance

CHT shall contribute to the Thermal Health assessment.

It can help identify:

Excessive thermal loading
Cooling degradation
Abnormal combustion behaviour
Persistent overheating trends
Abnormal operating conditions

Example:

CHT ↑
+
Persistent deviation
+
Normal ambient conditions
        ↓
Thermal Health degradation indicator
12. Fault Detection Relevance

CHT may contribute to detection of:

Overheating
Cooling-system degradation
Combustion abnormalities
Excessive engine loading
Abnormal thermal behaviour
Sensor malfunction

Example:

CHT ↑
+
EGT ↑
+
Fuel Flow ↑
        ↓
Possible combustion / thermal abnormality

CHT alone should not be used to declare a specific fault.

13. AI/ML Relevance

CHT shall be available to the AI/ML layer as:

Direct feature
CHT
Statistical features
CHT mean
CHT maximum
CHT standard deviation
Trend features
CHT rate of increase
CHT rate of decrease
CHT long-term trend
Digital Twin feature
CHT residual
=
Actual CHT − Expected CHT

These features can support anomaly detection, fault classification and degradation analysis.

14. Dashboard Representation

CHT shall be displayed in real time.

Example:

┌────────────────────┐
│ CYLINDER HEAD TEMP │
│                    │
│      175 °C        │
│                    │
│      ● NORMAL      │
└────────────────────┘

The dashboard shall also provide:

Current value
Trend
Health status
Alert status
Expected vs actual value where available

Example:

Actual CHT:    181°C
Expected CHT:  175°C
Deviation:      +6°C
15. Data Quality Requirements

CHT data shall support:

VALID
WARNING
INVALID
MISSING
STALE

Example:

CHT: 175°C
Quality: VALID

If the sensor stops updating:

CHT: 175°C
Quality: STALE
Last Update: 2.1 s ago

The system shall not treat a stale value as a fresh measurement.

16. Fault / Failure Signatures

Potential abnormal CHT patterns include:

High CHT
165 → 172 → 180 → 188°C

Potential indication of:

Increased thermal loading
Cooling degradation
Combustion abnormality
Operating-condition change
Rapid CHT increase

May indicate a transient or abnormal thermal event.

Persistent high CHT

May indicate a sustained thermal problem.

CHT inconsistent with operating condition

Example:

Normal RPM
Normal Load
Normal Ambient Conditions
        +
Unexpected CHT increase
        ↓
Possible abnormal thermal behaviour
Frozen CHT
175
175
175
175

despite changing engine conditions may indicate sensor/telemetry failure.

These patterns are diagnostic evidence, not standalone fault conclusions.

17. Parameter Relationships

CHT shall be correlated with other engine parameters.

CHT ↔ RPM
RPM / Load
    ↓
Heat Generation
    ↓
CHT
CHT ↔ EGT
Combustion
    ↓
EGT + CHT
CHT ↔ Fuel Flow
Fuel Flow
    ↓
Combustion Heat
    ↓
CHT
CHT ↔ Ambient Conditions
Ambient Temp / Altitude
          ↓
Cooling Conditions
          ↓
CHT

These relationships are important for Digital Twin modelling and AI/ML feature engineering.

18. Criticality
Criticality: CRITICAL

Reason:

CHT provides direct information about engine thermal loading and is an important indicator for detecting potential overheating and thermal degradation.

Loss of reliable CHT information can reduce confidence in:

Thermal health assessment
Digital Twin state estimation
Overheating detection
Fault prediction
AI/ML analysis
19. Data Storage Requirements

Each CHT measurement shall be stored with:

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
Parameter: EP-02
Value: 175
Unit: °C
Quality: VALID
Timestamp: 10:32:01.250
Source: Simulator

For Digital Twin analysis, derived information may additionally be stored:

expected_cht
cht_residual
health_indicator
20. Verification & Validation

CHT implementation shall be verified through:

A. Sensor documentation

Verify:

Sensor type
Measurement range
Accuracy
Response characteristics
Installation location
B. Engine test data

Compare measured CHT with documented/validated operating behaviour.

C. Controlled simulation

Generate:

Warm-up
Stable operation
Load increase
Load decrease
High-temperature condition
Cooling degradation scenario
D. Cross-parameter validation

Compare CHT with:

RPM
EGT
Fuel flow
Engine load
Ambient temperature
Altitude
E. Digital Twin validation

Compare:

Measured CHT
      vs
Expected CHT

and verify the residual behaviour.