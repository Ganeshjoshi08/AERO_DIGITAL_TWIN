EP-16 — Fuel Pressure
1. Parameter Identification
Field	Specification
Parameter ID	EP-16
Parameter Name	Fuel Pressure
Abbreviation	FP
Parameter Category	Fuel System / Combustion Health Parameter
Criticality	Critical
2. Parameter Description

Fuel Pressure represents the pressure of fuel at the designated measurement location within the engine's fuel-delivery system.

It provides information about the ability of the fuel system to deliver fuel to the engine at the required pressure.

Fuel pressure is important for:

Fuel-system health
Injector operation
Fuel delivery
Combustion stability
Engine performance
Fault detection
Predictive maintenance

For our Digital Twin, fuel pressure combined with Fuel Flow + RPM + Injection Timing can provide a much stronger representation of the fuel-delivery state.

3. Unit

Preferred internal unit:

Unit: bar

Other possible source units:

kPa
psi
MPa

Example:

Fuel Pressure = 3.5 bar

The raw source unit shall be preserved where possible.

4. Measurement / Data Source

Fuel pressure may be obtained from:

Fuel-pressure transducer
Fuel rail pressure sensor where applicable
Fuel pump monitoring system
ECU
Fuel-system instrumentation
CAN telemetry
DAQ
Engine simulator

Typical architecture:

Fuel Tank
   ↓
Fuel Pump
   ↓
Fuel Filter
   ↓
Fuel Delivery System
   ↓
Pressure Sensor
   ↓
ECU / DAQ
   ↓
CAN / Telemetry
   ↓
Digital Twin

The exact measurement location depends on the selected engine fuel-system architecture.

5. Measurement Type

Fuel pressure is primarily a direct pressure measurement.

It may also be:

ECU-derived
Pump-derived
Calculated
Simulated

The system shall record the source type.

Example:

Source:
FUEL PRESSURE SENSOR

or:

Source:
ECU
6. Operating Condition Dependency

Fuel pressure may depend on:

Engine RPM
Fuel-pump operation
Fuel demand
Engine load
Fuel temperature
Fuel-system configuration
Injector demand
Fuel-regulation strategy

Concept:

Engine Demand
     +
Fuel Pump
     +
Fuel Regulation
        ↓
Fuel Pressure

The exact relationship depends on the selected fuel-system architecture.

7. Expected Operating Behaviour

Typical qualitative behaviour:

Engine OFF
     ↓
Low / System-dependent pressure
     ↓
Fuel System Activation
     ↓
Pressure Establishment
     ↓
Engine Start
     ↓
Stable Fuel Pressure

During normal operation, fuel pressure should remain within the engine-specific fuel-system operating envelope.

Exact fuel-pressure limits shall be obtained from the selected engine/fuel-system documentation and validated test data.

8. Validation Rules

Fuel-pressure data shall undergo:

Range validation

Reject physically impossible values.

Fuel Pressure = -2 bar
        ↓
INVALID
Rate-of-change validation

Detect unrealistic pressure jumps.

3.4
3.5
3.5
3.6
8.5 ← suspicious
Operating-state validation

Interpret fuel pressure according to:

Engine OFF
Fuel-system priming
Starting
Running
Shutdown
Cross-parameter validation

Compare with:

Fuel flow
RPM
Injection timing
Engine load
Throttle
9. Sampling / Update Requirement

Fuel pressure shall be updated frequently enough to capture:

Fuel-system startup
Pressure build-up
Stable operation
Throttle transitions
Load changes
Pressure drops
Pressure fluctuations
Abnormal fuel-system events

The exact sampling rate shall depend on:

Sensor response
Fuel-system dynamics
ECU interface
Communication architecture

The prototype update rate shall remain configurable.

10. Digital Twin Relevance

Fuel pressure shall be an important variable in the Digital Twin's fuel-system state model.

Concept:

RPM
+
Engine Load
+
Fuel Flow
+
Injection Timing
+
Fuel Pressure
        ↓
Fuel-System Model
        ↓
Expected Fuel Delivery
        ↓
Combustion Model

The system may calculate:

Fuel Pressure Residual =
Measured Fuel Pressure
−
Expected Fuel Pressure

This residual can support fuel-system health assessment.

11. Health Monitoring Relevance

Fuel pressure shall contribute to Fuel-System Health.

Potential indicators:

Low fuel pressure
Pressure instability
Pressure drop under load
Pressure inconsistent with fuel flow
Pressure inconsistent with engine operating state

Example:

Fuel Pressure ↓
+
Fuel Flow ↓
+
RPM unstable
        ↓
Possible fuel-delivery problem
12. Fault Detection Relevance

Fuel pressure may contribute to detection of:

Fuel-pump abnormalities
Fuel-filter restriction
Fuel-delivery problems
Fuel-system leakage-related conditions
Fuel-regulation abnormalities
Injector-system issues
Sensor faults

Example:

Fuel Pressure ↓
+
Fuel Flow ↓
+
Engine Load Stable
        ↓
Possible fuel-delivery abnormality

Another:

Fuel Pressure stable
+
Fuel Flow abnormal
+
EGT abnormal
        ↓
Investigate injector / combustion behaviour

This distinction is valuable because fuel pressure can help separate supply-side problems from injection/combustion problems.

13. AI/ML Relevance

Fuel pressure shall be a strong AI/ML feature.

Direct feature
Fuel Pressure
Statistical features
Mean
Minimum
Maximum
Standard Deviation
Trend features
Pressure Trend
Pressure Drop Rate
Pressure Recovery Rate
Combined fuel-system features
Fuel Pressure
+
Fuel Flow
+
RPM
+
Injection Timing

These features can support:

Fuel-system anomaly detection
Injector-fault analysis
Fuel-pump fault prediction
Combustion analysis
Degradation detection
RUL estimation
14. Dashboard Representation

Fuel pressure shall be displayed in the engineering/health dashboard.

Example:

┌────────────────────┐
│    FUEL PRESSURE   │
│                    │
│      3.5 bar       │
│                    │
│      ● NORMAL      │
└────────────────────┘

Additional information:

Fuel Pressure: 3.5 bar
Fuel Flow:      18 L/h
RPM:            5200
Status:         NORMAL

Trend visualization shall be available.

15. Data Quality Requirements

Fuel-pressure data shall support:

VALID
WARNING
INVALID
MISSING
STALE
UNKNOWN

Additional checks:

Sensor range
Signal continuity
Communication status
Timestamp validity
Cross-parameter consistency

Example:

Fuel Pressure: 3.5 bar
Quality: VALID
16. Fault / Failure Signatures
Low fuel pressure
3.5 → 3.2 → 2.8 → 2.4 bar

Potential indication of:

Fuel-delivery degradation
Pump issue
Restriction
Other fuel-system abnormality
Pressure drop during high demand
Load ↑
+
Fuel Pressure ↓
        ↓
Possible fuel-delivery limitation
Pressure instability
3.5 → 2.9 → 3.6 → 3.0 → 3.5 bar

May indicate:

Fuel-system instability
Pump/regulation issue
Sensor noise
Transient operation
Pressure normal but fuel flow abnormal
Fuel Pressure = Normal
Fuel Flow = Abnormal
        ↓
Investigate injector / control / measurement
17. Parameter Relationships
Fuel Pressure ↔ Fuel Flow

This is one of the most important relationships.

Fuel Pressure
      +
Fuel Flow
      ↓
Fuel Delivery Health
Fuel Pressure ↔ RPM
RPM / Load
    ↓
Fuel Demand
    ↓
Fuel-System Response
Fuel Pressure ↔ Injection Timing
Injection Timing
      +
Fuel Pressure
      ↓
Fuel Injection Behaviour
Fuel Pressure ↔ EGT
Fuel Delivery
     ↓
Combustion
     ↓
EGT
Fuel Pressure ↔ Engine Load
Load ↑
  ↓
Fuel Demand ↑
  ↓
Fuel Pressure / Flow Response
18. Criticality
Criticality: CRITICAL

Reason:

Fuel pressure directly affects fuel delivery and therefore can influence combustion stability and engine performance.

Reliable fuel-pressure data improves:

Fuel-system health monitoring
Injector diagnostics
Combustion analysis
Digital Twin accuracy
Predictive maintenance
19. Data Storage Requirements

Each fuel-pressure measurement shall contain:

timestamp
mission_id
engine_id
parameter_id
value
unit
source_type
quality_status

Example:

Mission ID: M001
Engine ID: E001
Parameter: EP-16
Value: 3.5
Unit: bar
Source: Fuel Pressure Sensor
Quality: VALID
Timestamp: 10:32:01.250

Derived fields may include:

expected_fuel_pressure
fuel_pressure_residual
pressure_trend
fuel_system_health_indicator
fuel_delivery_indicator
20. Verification & Validation

Fuel-pressure implementation shall be verified using:

A. Fuel-system documentation

Verify:

Sensor type
Measurement range
Accuracy
Installation location
Fuel-system architecture
Interface
B. Engine test/dataset data

Compare fuel pressure with:

RPM
Load
Fuel flow
Injection timing
C. Controlled simulation

Simulate:

Engine OFF
Fuel-system priming
Engine start
Stable operation
High load
Pressure drop
Pressure fluctuation
Fuel-pump degradation
Sensor failure
D. Cross-parameter validation

Verify:

Fuel Pressure
      ↓
Fuel Flow
      ↓
Injection
      ↓
Combustion
      ↓
EGT / CHT
E. Digital Twin validation

Verify that abnormal fuel pressure produces appropriate changes in the simulated fuel-system and combustion states.