EP-12 — Engine Load
1. Parameter Identification
Field	Specification
Parameter ID	EP-12
Parameter Name	Engine Load
Abbreviation	Engine Load / LOAD
Parameter Category	Performance / Operating-State Parameter
Criticality	Critical
2. Parameter Description

Engine Load represents the level of demand placed on the engine relative to its available operating capability.

Depending on the selected engine architecture, load may be represented using:

Percentage of rated load
Torque
Power
Manifold pressure-related estimate
ECU-calculated load
Propulsion demand

For the Digital Twin, engine load is one of the most important contextual parameters because it helps explain changes in:

RPM
Fuel flow
EGT
CHT
Oil temperature
Vibration
Electrical generation
3. Unit

The preferred normalized representation shall be:

Unit: %

Example:

Engine Load = 65%

Where the engine/ECU provides a physical quantity, the system may additionally store:

Torque → N·m
Power → W / kW

The raw source representation shall be preserved.

4. Measurement / Data Source

Engine load may be obtained from:

ECU/FADEC
Engine-control system
Torque sensor
Power measurement
Manifold-pressure-based calculation
RPM + engine-map estimation
Propulsion-system model
Engine simulator

Typical architecture:

Engine Sensors
     +
RPM
     +
Throttle
     +
Torque / Power
        ↓
Load Estimation
        ↓
ECU / Edge Processor
        ↓
CAN / Telemetry
        ↓
Digital Twin
5. Measurement Type

Engine load can be:

Directly measured
ECU-calculated
Model-estimated
Simulator-generated

If load is calculated rather than directly measured, the system shall record the estimation method.

Example:

Source Type:
ECU-derived

or:

Source Type:
Digital Twin Estimated

This distinction is important for traceability.

6. Operating Condition Dependency

Engine load is related to:

Throttle
RPM
Propeller/load demand
Aircraft operating condition
Altitude
Air density
Mission phase
Engine power requirement

Concept:

Mission Demand
      ↓
Propulsion Demand
      ↓
Engine Load
      ↓
Fuel + Combustion + RPM

Therefore, load provides essential context for interpreting almost every other engine parameter.

7. Expected Operating Behaviour

Typical qualitative behaviour:

Engine OFF
    ↓
Load ≈ 0
    ↓
Engine Start
    ↓
Low Load
    ↓
Cruise
    ↓
Higher Load
    ↓
High-Power Operation

During throttle transitions, engine load may change rapidly.

During steady cruise, load should generally remain within a relatively stable operating region unless mission conditions change.

Exact load limits and mapping shall be engine/platform-specific.

8. Validation Rules

Engine-load data shall undergo:

Range validation

For normalized load:

Load < 0% or > 100%
          ↓
Potentially INVALID

If the source uses a different convention, the platform-specific range shall apply.

Rate-of-change validation

Detect unrealistic transitions.

60%
62%
65%
95%

The 95% value may be valid during a high-load transition, so validation shall consider mission and throttle context.

Cross-parameter validation

Compare load against:

Throttle
RPM
Fuel flow
EGT
CHT
Digital Twin validation

Compare measured/estimated load with expected engine state.

9. Sampling / Update Requirement

Engine load shall be updated frequently enough to capture:

Start
Idle
Cruise
Acceleration
Deceleration
Throttle transitions
High-load events
Mission-phase changes

The exact update rate shall depend on the source system.

For the prototype, it shall remain configurable.

10. Digital Twin Relevance

Engine load is a core Digital Twin state variable.

Concept:

RPM
+
Throttle
+
Engine Load
+
Fuel Flow
+
Ambient Conditions
        ↓
Digital Twin Engine Model
        ↓
Expected Engine Behaviour

Load can be used to predict:

Expected RPM
Expected fuel flow
Expected EGT
Expected CHT
Expected oil temperature
Expected vibration

This makes load particularly useful for residual-based anomaly detection.

Example:

Expected EGT @ 70% Load
          vs
Actual EGT @ 70% Load
11. Health Monitoring Relevance

Engine load is mainly a contextual health parameter.

It helps determine whether other parameters are behaving normally.

Example:

Load ↑
+
Fuel Flow ↑
+
EGT ↑
+
CHT ↑
        ↓
Expected high-load behaviour

But:

Load stable
+
Fuel Flow ↑
+
EGT ↑
        ↓
Possible abnormality

Thus, load helps reduce false alarms.

12. Fault Detection Relevance

Engine load can contribute to detection of:

Engine performance degradation
Poor engine response
Combustion abnormalities
Fuel-system abnormalities
Control-system issues
Propulsion-load mismatch

Example:

Load ↑
    ↓
Expected RPM ↑
    ↓
Actual RPM fails to increase
        ↓
Possible performance/control abnormality

Another:

Load stable
+
Fuel Flow ↑
+
Temperature ↑
        ↓
Possible efficiency degradation
13. AI/ML Relevance

Engine load shall be a major AI/ML contextual feature.

Direct feature
Engine Load
Statistical features
Mean Load
Maximum Load
Minimum Load
Load Variance
Trend features
Load Trend
Load Rate of Change
High-Load Duration
Combined features
Load
+
RPM
+
Fuel Flow
+
EGT
+
CHT

These features can improve:

Anomaly detection
Fault classification
Performance modelling
Degradation detection
RUL estimation
14. Dashboard Representation

Engine load shall be prominently displayed.

Example:

┌────────────────────┐
│     ENGINE LOAD    │
│                    │
│        65 %        │
│                    │
│      ● NORMAL      │
└────────────────────┘

The dashboard may also show:

Load:       65%
RPM:        5200
Throttle:   68%
Fuel Flow:  18.5 L/h

This provides useful operating context to the operator.

15. Data Quality Requirements

Engine-load data shall support:

VALID
WARNING
INVALID
MISSING
STALE
UNKNOWN

Additional checks:

Range validity
Source validity
Calculation validity
Timestamp synchronization
Cross-parameter consistency

Example:

Engine Load: 65%
Quality: VALID
16. Fault / Failure Signatures
Load-response mismatch
Load ↑
+
RPM does not respond

Potential engine/control abnormality.

Unexpected load increase
Throttle Stable
+
Load ↑
+
RPM ↓

May indicate increased propulsion demand or engine-performance issue depending on mission context.

Load/fuel mismatch
Load Stable
+
Fuel Flow ↑

Potential efficiency degradation or fuel-system abnormality.

Load/temperature mismatch
Load Stable
+
EGT / CHT ↑

Potential thermal/combustion abnormality.

17. Parameter Relationships
Engine Load ↔ Throttle
Throttle
   ↓
Engine Demand
   ↓
Engine Load
Engine Load ↔ RPM
Load
 ↓
Engine Operating Point
 ↓
RPM
Engine Load ↔ Fuel Flow
Load ↑
   ↓
Fuel Requirement ↑
   ↓
Fuel Flow ↑
Engine Load ↔ EGT / CHT
Load ↑
   ↓
Combustion ↑
   ↓
EGT / CHT Response
Engine Load ↔ Vibration
Load
 ↓
Mechanical Forces
 ↓
Vibration

These relationships will be heavily used in the Digital Twin and AI/ML layers.

18. Criticality
Criticality: CRITICAL

Reason:

Engine load is one of the primary variables required to correctly interpret engine behaviour.

Without load context, the system may generate false anomaly indications because high fuel flow, high temperature or high vibration can be perfectly normal during high-load operation.

19. Data Storage Requirements

Each load measurement shall contain:

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
Parameter: EP-12
Value: 65
Unit: %
Source: ECU
Quality: VALID
Timestamp: 10:32:01.250

Derived information may include:

expected_load
load_deviation
high_load_duration
load_trend
engine_operating_point
20. Verification & Validation

Engine-load implementation shall be verified using:

A. Engine/ECU documentation

Verify:

Load definition
Units
Valid range
Calculation method
Source signal
B. Engine test/dataset data

Compare load against:

RPM
Throttle
Fuel flow
Power/torque where available
C. Controlled simulation

Simulate:

Engine OFF
Idle
Cruise
High load
Load transitions
Rapid throttle changes
Load abnormality
Sensor/ECU failure
D. Cross-parameter validation

Verify:

Throttle
  ↕
Load
  ↕
RPM
  ↕
Fuel Flow
  ↕
EGT / CHT
E. Digital Twin validation

Test whether the engine model produces expected outputs for different load conditions.