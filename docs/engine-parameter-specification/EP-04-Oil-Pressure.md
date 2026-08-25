EP-04 — Oil Pressure
1. Parameter Identification
Field	Specification
Parameter ID	EP-04
Parameter Name	Engine Oil Pressure
Abbreviation	Oil Pressure
Parameter Category	Lubrication / Engine Health Parameter
Criticality	Critical
2. Parameter Description

Engine Oil Pressure represents the pressure of lubricating oil at the designated measurement point within the engine lubrication system.

Oil pressure is an important indicator of the lubrication system's ability to supply oil to engine components.

It is relevant to:

Lubrication health
Bearing and moving-component protection
Engine operating condition
Mechanical health
Fault detection
Degradation monitoring
Predictive maintenance

For the Digital Twin, oil pressure provides an important input for estimating the engine's lubrication state.

3. Unit

The preferred engineering unit for the project shall be:

Unit: bar

Other units may be received from external systems and converted internally.

Common alternatives include:

kPa
psi

The original source unit shall be preserved in raw data where possible.

4. Measurement / Data Source

Oil pressure may be obtained from:

Oil-pressure transducer
Engine ECU
CAN telemetry
Engine instrumentation
DAQ system
Engine simulator

Typical architecture:

Engine Oil Circuit
       ↓
Pressure Sensor
       ↓
Signal Conditioning
       ↓
ECU / DAQ
       ↓
CAN / Telemetry
       ↓
Digital Twin System

The exact sensor type and measurement location shall depend on the selected reference engine.

5. Measurement Type

Oil pressure is primarily a directly measured parameter.

The Digital Twin may additionally estimate expected oil pressure using:

RPM
Oil temperature
Engine operating state
Engine load
Lubrication model

Concept:

Measured Oil Pressure
        ↓
Actual Lubrication State

Expected Oil Pressure
        ↓
Digital Twin Lubrication State
6. Operating Condition Dependency

Oil pressure can vary with:

Engine RPM
Oil temperature
Engine load
Oil viscosity
Engine operating state
Lubrication-system condition
Ambient/environmental conditions

A cold engine and a fully warmed engine may exhibit different oil-pressure behaviour.

Therefore:

Oil pressure shall not be evaluated using a single fixed threshold independent of engine operating conditions.

Concept:

RPM + Oil Temperature + Engine State
              ↓
       Expected Oil Pressure
              ↓
       Health Assessment
7. Expected Operating Behaviour

Typical qualitative behaviour:

Engine OFF
    ↓
Very low / no pressure
    ↓
Engine Start
    ↓
Oil Pressure develops
    ↓
Warm-up
    ↓
Operating pressure stabilizes

Oil pressure may change with RPM and oil temperature.

Exact minimum, normal and maximum oil-pressure limits shall be obtained from the selected engine's manufacturer documentation and validated test data.

No generic pressure threshold shall be permanently defined at this stage.

8. Validation Rules

Oil-pressure data shall undergo:

Range validation

Detect impossible or invalid values.

Rate-of-change validation

Detect unrealistic pressure changes.

Example:

4.1 bar
4.2 bar
4.2 bar
4.1 bar
9.8 bar ← suspicious
Operating-state validation

An oil-pressure reading shall be interpreted according to whether the engine is:

OFF
Starting
Idle
Operating
Shutdown
Temperature correlation

Oil pressure shall be compared with oil temperature.

RPM correlation

Oil pressure shall be compared with engine RPM.

Digital Twin validation

Measured oil pressure shall be compared against expected lubrication behaviour.

9. Sampling / Update Requirement

Oil pressure shall be acquired frequently enough to capture:

Engine start
Pressure build-up
Stable operation
RPM changes
Load changes
Pressure drops
Abnormal pressure events
Shutdown behaviour

The exact sampling/update rate shall be determined from:

Sensor characteristics
ECU/DAQ interface
Engine lubrication dynamics
Communication architecture

The prototype implementation shall keep the update rate configurable.

10. Digital Twin Relevance

Oil pressure shall be an important input to the Digital Twin's lubrication-state model.

Concept:

RPM
+
Oil Temperature
+
Engine Load
+
Engine State
        ↓
Lubrication Model
        ↓
Expected Oil Pressure

The system shall calculate:

Oil Pressure Residual =
Measured Oil Pressure
−
Expected Oil Pressure

This residual shall be available to health and fault modules.

11. Health Monitoring Relevance

Oil pressure shall contribute to Lubrication Health.

Potential indicators:

Low pressure
Abnormal pressure trend
Pressure instability
Pressure inconsistent with RPM
Pressure inconsistent with oil temperature

Example:

Oil Pressure ↓
+
Oil Temperature ↑
+
Persistent deviation
        ↓
Lubrication Health degradation

The system shall consider multiple indicators before assigning a degraded health state.

12. Fault Detection Relevance

Oil-pressure behaviour may contribute to detection of:

Lubrication-system degradation
Low oil supply
Oil leakage-related conditions
Pump-related abnormalities
Excessive internal leakage/wear
Sensor malfunction
Abnormal engine operating conditions

Example:

Oil Pressure ↓
+
RPM normal
+
Oil Temperature abnormal
        ↓
Possible lubrication problem

Another example:

Oil Pressure ↓
+
RPM ↓
+
Fuel / thermal behaviour abnormal
        ↓
Possible broader engine abnormality

These are diagnostic indicators and shall not be treated as definitive fault identification without supporting evidence.

13. AI/ML Relevance

Oil pressure shall be available as an AI/ML feature.

Direct feature
Oil Pressure
Statistical features
Mean
Minimum
Maximum
Standard Deviation
Trend features
Pressure decline rate
Pressure recovery rate
Long-term pressure trend
Contextual features
Oil Pressure
+
RPM
+
Oil Temperature
Digital Twin feature
Oil Pressure Residual

These can support:

Anomaly detection
Lubrication-fault classification
Degradation prediction
RUL estimation
14. Dashboard Representation

Oil pressure shall be displayed in real time.

Example:

┌────────────────────┐
│   OIL PRESSURE     │
│                    │
│      4.1 bar       │
│                    │
│      ● NORMAL      │
└────────────────────┘

The dashboard should also display a trend:

Oil Pressure Trend
      ↘
4.5 ───────
4.3       ╲
4.1        ╲
3.9         ╲
3.7          ╲

Where available:

Actual:    4.1 bar
Expected:  4.3 bar
Deviation: -0.2 bar
15. Data Quality Requirements

Oil-pressure data shall support:

VALID
WARNING
INVALID
MISSING
STALE

Example:

Oil Pressure: 4.1 bar
Quality: VALID

If communication stops:

Oil Pressure: 4.1 bar
Quality: STALE
Last Update: 2.2 s ago

The system shall distinguish between zero pressure because the engine is off and zero/low pressure while the engine is expected to be operating.

16. Fault / Failure Signatures
Low oil pressure during operation
4.2 → 4.0 → 3.7 → 3.3 bar

Potential indication of lubrication degradation.

Pressure instability
4.1 → 3.6 → 4.3 → 3.5 → 4.2

May indicate:

Operating-condition changes
Lubrication-system abnormality
Sensor problem
Pressure not increasing after engine start

Potentially significant lubrication abnormality.

Pressure inconsistent with RPM

Example:

RPM ↑
Oil Pressure unchanged / ↓

May indicate abnormal lubrication behaviour.

Stuck sensor
4.1
4.1
4.1
4.1

despite significant changes in engine operating condition may indicate sensor/telemetry problems.

17. Parameter Relationships

Oil pressure shall be correlated with:

Oil Pressure ↔ RPM
RPM
 ↓
Oil Pump Behaviour
 ↓
Oil Pressure
Oil Pressure ↔ Oil Temperature
Oil Temperature
      ↓
Oil Properties
      ↓
Oil Pressure
Oil Pressure ↔ Engine Load
Engine Load
     ↓
Engine Operating State
     ↓
Lubrication Demand
Oil Pressure ↔ Vibration

Abnormal mechanical behaviour may affect lubrication-related health and should therefore be analysed alongside vibration.

18. Criticality
Criticality: CRITICAL

Reason:

Reliable oil-pressure information is important for identifying potentially serious lubrication abnormalities.

Loss or corruption of oil-pressure data can reduce confidence in:

Lubrication health
Digital Twin lubrication state
Fault detection
Engine degradation analysis
Predictive maintenance

The system shall therefore monitor the quality of the oil-pressure signal itself.

19. Data Storage Requirements

Each oil-pressure measurement shall contain:

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
Parameter: EP-04
Value: 4.1
Unit: bar
Quality: VALID
Timestamp: 10:32:01.250
Source: Simulator

Derived fields may include:

expected_oil_pressure
oil_pressure_residual
lubrication_health_indicator
pressure_trend
20. Verification & Validation

Oil-pressure implementation shall be verified using:

A. Sensor documentation

Verify:

Measurement range
Accuracy
Resolution
Response characteristics
Interface
Installation location
B. Engine documentation/test data

Verify expected pressure behaviour for relevant operating states.

C. Controlled simulation

Simulate:

Engine OFF
Engine start
Pressure build-up
Stable operation
RPM changes
Oil-temperature changes
Pressure degradation
Sensor failure
D. Cross-parameter validation

Compare oil pressure with:

RPM
Oil temperature
Engine load
Engine state
E. Digital Twin validation

Compare:

Measured Oil Pressure
        vs
Expected Oil Pressure

and verify residual behaviour.