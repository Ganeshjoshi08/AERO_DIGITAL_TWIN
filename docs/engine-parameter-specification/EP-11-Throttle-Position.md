EP-11 — Throttle Position
1. Parameter Identification
Field	Specification
Parameter ID	EP-11
Parameter Name	Throttle Position
Abbreviation	TPS / Throttle Position
Parameter Category	Engine Control / Operating-State Parameter
Criticality	High
2. Parameter Description

Throttle Position represents the commanded or measured throttle setting that controls the engine's operating demand.

Depending on the engine/control architecture, throttle position may represent:

Pilot/operator command
ECU command
Throttle valve position
Electronic throttle position
Engine power-demand request

For the Digital Twin, throttle position provides important operating context for interpreting RPM, fuel flow, temperature, vibration and engine load.

3. Unit

Throttle position is commonly represented as:

Percentage (%)

Example:

Throttle Position = 70%

Some systems may provide:

ADC counts
Voltage
Normalized command
Angle in degrees

The internal Digital Twin representation shall preferably normalize throttle position to:

0–100 %

while preserving the original source representation.

4. Measurement / Data Source

Throttle position may be obtained from:

Throttle-position sensor
Electronic throttle controller
ECU/FADEC
Pilot command interface
CAN telemetry
Flight-control system
Engine simulator

Typical architecture:

Pilot / Flight Controller
          ↓
Throttle Command
          ↓
ECU / Engine Control
          ↓
Throttle Position
          ↓
CAN / Telemetry
          ↓
Digital Twin

Depending on the architecture, commanded throttle and actual throttle position may be separate signals.

5. Measurement Type

Throttle position may be:

Directly measured
ECU-derived
Commanded
Simulated

Important distinction:

Throttle Command
       vs
Actual Throttle Position

If both are available, the system shall maintain both.

The difference can be useful for detecting control-system or actuator abnormalities.

6. Operating Condition Dependency

Throttle position influences:

Engine load
RPM
Fuel flow
Combustion
EGT
CHT
Engine power output

Concept:

Throttle
   ↓
Engine Demand
   ↓
Fuel + Air / Combustion
   ↓
Engine Output
   ↓
RPM / Temperatures / Load

Throttle position therefore provides important context for almost every engine parameter.

7. Expected Operating Behaviour

Typical qualitative behaviour:

0%
 ↓
Low / Idle Demand
 ↓
Cruise Throttle
 ↓
High Load
 ↓
100%

During normal operation:

Throttle should remain within its valid command range.
Throttle transitions should produce a corresponding engine response.
Sudden throttle changes may cause temporary transients in RPM, fuel flow and temperature.

Exact throttle mapping and operating limits shall be defined according to the selected engine/ECU architecture.

8. Validation Rules

Throttle position shall undergo:

Range validation

For normalized throttle:

< 0% or > 100%
        ↓
INVALID
Rate-of-change validation

Detect implausible transitions.

Example:

60%
62%
65%
67%
100% ← investigate

A rapid transition may be valid if commanded by the mission profile, so validation must consider command context.

Command-vs-actual validation

If both signals are available:

Commanded Position
        vs
Actual Position
Cross-parameter validation

Compare throttle with:

RPM
Fuel flow
Engine load
EGT
CHT
9. Sampling / Update Requirement

Throttle position shall be updated frequently enough to capture:

Normal control changes
Rapid throttle transitions
Engine acceleration
Engine deceleration
Mission-phase transitions

The exact update rate shall be determined by the ECU/control architecture.

For the prototype, the update rate shall remain configurable.

10. Digital Twin Relevance

Throttle position shall be a major Digital Twin operating-state input.

Concept:

Throttle
+
RPM
+
Engine Load
+
Fuel Flow
+
Environment
        ↓
Digital Twin
        ↓
Expected Engine State

Throttle changes can be used to simulate expected future engine behaviour.

For example:

Throttle 50%
      ↓
What-if Simulation
      ↓
Expected RPM / Fuel / EGT / CHT

This connects EP-11 directly with FR-08 Mission Simulation & What-if Analysis.

11. Health Monitoring Relevance

Throttle position provides context for engine health.

Examples:

Throttle ↑
+
RPM response normal
        ↓
Expected behaviour

versus:

Throttle ↑
+
RPM response weak
+
Fuel Flow abnormal
        ↓
Possible engine performance issue

Therefore, throttle itself is not necessarily a health indicator; its relationship with engine response is highly valuable.

12. Fault Detection Relevance

Throttle position may contribute to detection of:

Throttle sensor fault
Actuator/control abnormality
Engine response degradation
Combustion abnormalities
Performance degradation
Control-system inconsistency

Example:

Throttle Command ↑
        ↓
Expected RPM ↑
        ↓
Actual RPM does not respond
        ↓
Possible engine/control abnormality

Another:

Commanded Throttle ≠ Actual Throttle
        ↓
Possible actuator/sensor issue
13. AI/ML Relevance

Throttle position shall be an important contextual AI/ML feature.

Direct feature
Throttle Position
Derived features
Throttle Rate of Change
Throttle Stability
Throttle Duration
Throttle Transient
Response features
Throttle Change
      +
RPM Response
      +
Fuel Flow Response
Combined features
Throttle
+
RPM
+
Fuel Flow
+
EGT
+
CHT

These features may support:

Anomaly detection
Engine-response modelling
Fault classification
Degradation detection
14. Dashboard Representation

Throttle position shall be displayed in the dashboard.

Example:

┌────────────────────┐
│  THROTTLE POSITION │
│                    │
│        70 %        │
│                    │
│      ● STABLE      │
└────────────────────┘

A trend graph shall show throttle transitions.

Example:

Throttle

100% ┤       ╭────
 80% ┤      ╱
 60% ┤─────╯
 40% ┤
     └────────────── Time

Where both are available:

Commanded: 70%
Actual:    69%
Deviation: -1%
15. Data Quality Requirements

Throttle data shall support:

VALID
WARNING
INVALID
MISSING
STALE
UNKNOWN

Additional checks:

Sensor range
Command validity
Signal continuity
Command/actual consistency
Communication status

Example:

Throttle: 70%
Quality: VALID
16. Fault / Failure Signatures
Throttle sensor stuck
70%
70%
70%
70%

despite changing operator/mission commands may indicate a sensor or telemetry issue.

Command/actual mismatch
Commanded: 80%
Actual:    55%

May indicate:

Actuator problem
Sensor problem
Control limitation
Communication issue
Throttle increase without expected engine response
Throttle ↑
   ↓
RPM remains low
   +
Fuel Flow abnormal

May indicate an engine-performance or fuel/combustion issue.

17. Parameter Relationships
Throttle ↔ RPM
Throttle
   ↓
Engine Demand
   ↓
RPM Response
Throttle ↔ Fuel Flow
Throttle ↑
   ↓
Fuel Demand ↑
   ↓
Fuel Flow ↑
Throttle ↔ EGT / CHT
Throttle / Load ↑
       ↓
Combustion ↑
       ↓
EGT / CHT Response
Throttle ↔ Engine Load
Throttle
   ↓
Engine Demand
   ↓
Engine Load

These relationships will be important for Digital Twin modelling and AI/ML feature engineering.

18. Criticality
Criticality: HIGH

Reason:

Throttle position is a major operating-state input and is required to interpret engine response.

An incorrect throttle signal can lead to incorrect interpretation of:

RPM
Fuel flow
Engine load
Temperature
Engine performance

If commanded and actual throttle signals are both available, their consistency should be continuously monitored.

19. Data Storage Requirements

Each throttle measurement shall contain:

timestamp
mission_id
engine_id
parameter_id
value
unit
source_type
quality_status

If both commanded and actual positions are available:

commanded_throttle
actual_throttle
throttle_deviation

Example:

Mission ID: M001
Engine ID: E001
Parameter: EP-11
Value: 70
Unit: %
Source: ECU
Quality: VALID
Timestamp: 10:32:01.250
20. Verification & Validation

Throttle implementation shall be verified using:

A. ECU / control documentation

Verify:

Signal definition
Valid range
Units
Command meaning
Interface
Update behaviour
B. Controlled simulation

Simulate:

0% throttle
Idle
Cruise
High throttle
Rapid throttle increase
Rapid throttle decrease
Sensor failure
Command/actual mismatch
C. Cross-parameter validation

Compare throttle with:

RPM
Fuel flow
Engine load
EGT
CHT
D. Digital Twin validation

Verify:

Throttle Change
      ↓
Digital Twin
      ↓
Expected Engine Response
      ↓
Actual Engine Response
E. What-if validation

Use throttle as an input to FR-08 simulations and verify expected engine response.