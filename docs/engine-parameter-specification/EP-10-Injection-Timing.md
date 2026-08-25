EP-10 — Injection Timing
1. Parameter Identification
Field	Specification
Parameter ID	EP-10
Parameter Name	Fuel Injection Timing
Abbreviation	Injection Timing
Parameter Category	Combustion / Fuel-System Control Parameter
Criticality	Critical
2. Parameter Description

Injection Timing represents the timing of fuel injection relative to the engine's crankshaft position or another engine-synchronization reference.

It determines when fuel is introduced into the combustion process and therefore influences combustion behaviour and engine performance.

Injection timing is relevant to:

Combustion efficiency
Engine performance
EGT
CHT
Fuel consumption
Misfire detection
Injector abnormality detection
Combustion instability
Digital Twin combustion modelling

The exact definition of injection timing depends on the selected engine and its fuel-injection architecture.

3. Unit

Injection timing may be represented using:

Crank Angle: degrees (°CA)

or, depending on the ECU/system:

Time: milliseconds (ms)

For crank-angle referenced systems, the specification shall define the reference convention, for example:

Injection Timing = crank angle relative to defined engine reference

The exact reference point and sign convention shall be taken from the selected engine/ECU documentation.

4. Measurement / Data Source

Injection timing may be obtained from:

ECU
Engine control system
Fuel-injection controller
Crankshaft position sensor + ECU calculation
CAN telemetry
Engine test instrumentation
Engine simulator

Typical architecture:

Crankshaft Position
       +
Injection Control
       ↓
ECU
       ↓
Injection Timing
       ↓
CAN / Telemetry
       ↓
Digital Twin
5. Measurement Type

Injection timing may be:

ECU-commanded value
ECU-calculated value
Directly measured/validated timing
Derived from crankshaft and injector events
Simulated

For the prototype, the source shall be explicitly recorded.

Important distinction:

Commanded Timing
       vs
Actual Injection Event

If only commanded timing is available, the system shall not automatically assume that actual injector behaviour is identical.

6. Operating Condition Dependency

Injection timing may depend on:

RPM
Engine load
Throttle
Engine temperature
Ambient conditions
Fuel-system state
Engine operating mode
Control strategy

Concept:

RPM + Load + Engine State
          ↓
ECU Control Logic
          ↓
Injection Timing

Therefore, timing must be evaluated against the current operating condition.

7. Expected Operating Behaviour

Injection timing should follow the engine's control strategy for the current operating condition.

Typical concept:

Engine Start
    ↓
Start Timing
    ↓
Idle Timing
    ↓
Cruise Timing
    ↓
Load / RPM Change
    ↓
Timing Adjustment

A change in injection timing during an operating-condition transition may therefore be completely normal.

Exact timing values shall be obtained from the selected engine/ECU documentation or validated test data.

8. Validation Rules

Injection timing shall undergo:

Range validation

Detect values outside the ECU/engine's valid representation.

Rate-of-change validation

Detect implausibly rapid timing changes.

Operating-condition validation

Compare timing against:

RPM
Engine load
Throttle
Engine temperature
Operating mode
Commanded-vs-response validation

Where possible, compare commanded injection timing with observed engine response.

Cross-parameter validation

Compare timing behaviour with:

EGT
CHT
Fuel flow
RPM
Vibration
9. Sampling / Update Requirement

Injection timing shall be acquired frequently enough to capture:

Start operation
Idle
Cruise
Load transitions
RPM transitions
Control-system changes
Abnormal timing behaviour

The exact update rate shall depend on:

ECU interface
Engine control architecture
Communication protocol
Required diagnostic resolution

For the prototype, the telemetry update rate shall remain configurable.

10. Digital Twin Relevance

Injection timing is an important input to the Digital Twin's combustion model.

Concept:

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
Combustion Model
        ↓
Expected Engine Behaviour

The Digital Twin may use injection timing to estimate:

Combustion behaviour
EGT
CHT
Fuel consumption
Engine performance

Where appropriate:

Timing Residual =
Observed / Validated Timing
−
Expected Timing
11. Health Monitoring Relevance

Injection timing contributes to Combustion Health.

Potential indicators:

Timing deviation
Timing instability
Unexpected timing change
Timing inconsistent with operating condition
Timing/thermal mismatch

Example:

Injection Timing Deviation
          +
EGT Deviation
          +
Fuel Flow Deviation
          ↓
Combustion Health Concern
12. Fault Detection Relevance

Injection timing can contribute to detection of:

Injector abnormalities
Combustion instability
Misfire-related behaviour
Fuel-system control abnormalities
Timing-control faults
Engine performance degradation

Example:

Injection Timing abnormal
+
Fuel Flow abnormal
+
EGT abnormal
        ↓
Possible injection / combustion problem

Another:

Timing stable
+
Engine response abnormal
        ↓
Investigate injector delivery / combustion

This distinction is important because an injection timing command can be correct while the physical injector or fuel system may still behave abnormally.

13. AI/ML Relevance

Injection timing shall be available as an AI/ML feature.

Direct feature
Injection Timing
Timing deviation
Actual / Validated Timing
−
Expected Timing
Statistical features
Mean Timing
Timing Variance
Timing Stability
Combined features
Injection Timing
+
RPM
+
Fuel Flow
+
EGT
+
CHT

These features may support:

Combustion anomaly detection
Injector-fault classification
Misfire detection
Degradation analysis
Predictive maintenance
14. Dashboard Representation

Injection timing shall be available primarily in the engineering/maintenance view.

Example:

┌──────────────────────┐
│   INJECTION TIMING   │
│                      │
│       18° CA         │
│                      │
│       ● NORMAL       │
└──────────────────────┘

Where applicable:

Actual/Reported: 18° CA
Expected:        17° CA
Deviation:       +1° CA

A trend graph should show timing changes over mission time.

15. Data Quality Requirements

Injection timing data shall support:

VALID
WARNING
INVALID
MISSING
STALE
UNKNOWN

Additional checks:

ECU communication validity
Invalid command value
Timing discontinuity
Timestamp synchronization
Crank-angle reference validity

If the source is commanded timing rather than measured timing, the metadata shall identify it accordingly.

16. Fault / Failure Signatures
Timing deviation
Expected: 18°
Actual:   24°
          ↑
Significant deviation

May indicate control/calibration abnormality or another system condition.

Timing instability
18 → 19 → 17 → 21 → 16°

May indicate:

Control instability
Operating transitions
Sensor/reference issue
Data-quality problem
Timing/thermal mismatch
Timing apparently normal
+
EGT abnormal
+
Fuel Flow abnormal
        ↓
Investigate injector / combustion behaviour
Stuck timing value
18
18
18
18

despite changing engine conditions may indicate telemetry/control-data issues.

17. Parameter Relationships
Injection Timing ↔ RPM
RPM
 ↓
ECU Control Strategy
 ↓
Injection Timing
Injection Timing ↔ Fuel Flow
Injection Command
       ↓
Fuel Delivery
       ↓
Combustion
Injection Timing ↔ EGT
Injection Timing
       ↓
Combustion Phasing
       ↓
EGT
Injection Timing ↔ CHT
Combustion Behaviour
       ↓
Heat Transfer
       ↓
CHT
Injection Timing ↔ Vibration

Abnormal combustion can produce changes in both injection-related behaviour and vibration signatures.

18. Criticality
Criticality: CRITICAL

Reason:

Injection timing directly influences combustion behaviour and is an important parameter for detecting and explaining abnormal engine behaviour.

Reliable injection-timing information supports:

Combustion modelling
Digital Twin accuracy
Fault diagnosis
AI/ML analysis
Engine performance analysis
19. Data Storage Requirements

Each timing record shall contain:

timestamp
mission_id
engine_id
parameter_id
value
unit
reference_convention
source_type
quality_status

Example:

Mission ID: M001
Engine ID: E001
Parameter: EP-10
Value: 18
Unit: °CA
Reference: Engine-specific
Source: ECU
Quality: VALID
Timestamp: 10:32:01.250

Derived fields may include:

expected_injection_timing
timing_deviation
timing_stability
combustion_indicator
20. Verification & Validation

Injection timing implementation shall be verified using:

A. Engine / ECU documentation

Verify:

Timing definition
Reference point
Units
Sign convention
Valid range
Interface
B. Engine test data

Compare timing against operating conditions.

C. Controlled simulation

Simulate:

Start
Idle
Cruise
Load transitions
RPM changes
Timing deviation
Timing instability
Sensor/telemetry failure
D. Cross-parameter validation

Compare injection timing with:

RPM
Fuel flow
EGT
CHT
Vibration
Engine load
E. Digital Twin validation

Verify whether the Digital Twin produces expected combustion behaviour when timing changes.

Example:

Injection Timing
       ↓
Digital Twin
       ↓
Expected EGT / CHT / Fuel Flow
       ↓
Compare with Actual