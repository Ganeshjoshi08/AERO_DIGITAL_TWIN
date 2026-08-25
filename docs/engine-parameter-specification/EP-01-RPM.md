EP-01 — Engine RPM
1. Parameter Identification
Field	Specification
Parameter ID	EP-01
Parameter Name	Engine Speed / RPM
Abbreviation	RPM
Parameter Category	Engine Operating Parameter
Criticality	Critical
2. Parameter Description

Engine RPM represents the rotational speed of the engine crankshaft.

It is one of the primary indicators of engine operating state and is required for:

Engine performance monitoring
Operating-state estimation
Load interpretation
Combustion analysis
Digital Twin synchronization
Fault detection
AI/ML analytics

RPM is also required to interpret several other engine measurements because temperature, fuel flow, vibration and lubrication behaviour can vary with engine speed.

3. Unit
Unit: revolutions per minute (rpm)

Example:

RPM = 4200 rpm
4. Measurement / Data Source

RPM may be obtained from:

Crankshaft speed sensor
Engine ECU/FADEC
Tachometer interface
CAN/ECU telemetry
Engine simulator

For the prototype:

Simulator / Dataset
       ↓
RPM Telemetry
       ↓
Acquisition Layer

The actual sensor/interface will depend on the selected reference engine and hardware architecture.

5. Measurement Type

RPM is primarily a directly measured parameter.

Possible implementation:

Crankshaft Rotation
       ↓
Speed Sensor
       ↓
ECU / Acquisition Interface
       ↓
RPM Value

It may also be provided as an ECU-derived telemetry value.

6. Operating Condition Dependency

RPM is strongly related to:

Throttle position
Engine load
Fuel flow
Propeller load
Altitude
Ambient conditions
Mission phase
Engine operating state

Conceptually:

Throttle + Load + Environment
            ↓
        Engine RPM
            ↓
   Fuel / Thermal / Vibration
       Behaviour

Therefore, RPM should be interpreted together with other engine parameters rather than independently.

7. Expected Operating Behaviour

The system shall identify different RPM operating states, such as:

Engine OFF
    ↓
Starting
    ↓
Idle
    ↓
Normal Operation
    ↓
High Load / High RPM
    ↓
Shutdown

During stable operation, RPM should generally remain within the operating region appropriate to the engine's current operating condition.

During throttle transitions, temporary RPM changes are expected.

Exact RPM limits shall be specified from the selected engine's manufacturer/test documentation and shall not be assumed in this generic specification.

8. Validation Rules

RPM data shall undergo:

Range validation

Detect impossible or invalid values.

Rate-of-change validation

Detect unrealistic sudden changes.

4200
4210
4220
4230
7000  ← suspicious transition
Timestamp validation

Ensure measurements are correctly ordered.

Missing-data validation

Detect absent RPM samples.

Cross-parameter validation

Compare RPM behaviour with:

Throttle
Fuel flow
Engine load
Vibration
EGT/CHT
Digital Twin validation

Compare measured RPM with expected engine-state behaviour.

9. Sampling / Update Requirement

RPM shall be acquired at a rate sufficient to represent:

Steady-state operation
Engine acceleration
Engine deceleration
Rapid throttle transitions
Fault events

The exact acquisition/update rate shall be determined from the selected sensor/ECU interface and the dynamics of the reference engine.

For the software prototype, the telemetry update rate shall remain configurable.

10. Digital Twin Relevance

RPM is a primary Digital Twin state variable.

It can influence estimation of:

Engine operating state
Engine load
Expected fuel flow
Thermal behaviour
Lubrication behaviour
Vibration behaviour
Expected engine performance

Concept:

RPM
 ↓
Operating State
 ↓
Digital Twin
 ↓
Expected Engine Behaviour
11. Health Monitoring Relevance

RPM contributes to assessment of:

Engine operating stability
Performance
Combustion behaviour
Mechanical condition
Lubrication behaviour
Transient response

RPM should normally be interpreted together with other health indicators.

12. Fault Detection Relevance

Abnormal RPM behaviour may contribute to detection of:

Misfire
Combustion instability
Engine performance degradation
Mechanical abnormalities
Excessive load
Starting abnormalities
Sensor faults

Example:

RPM fluctuation
      +
EGT deviation
      +
Vibration change
      ↓
Possible abnormal engine behaviour

RPM alone should not be used as definitive evidence of a particular fault.

13. AI/ML Relevance

RPM shall be available as:

Direct feature
RPM
Derived features
RPM mean
RPM standard deviation
RPM rate of change
RPM deviation
RPM fluctuation
Context feature

RPM can also help the model understand the current operating condition.

Example:

RPM + Throttle + Altitude + Load
              ↓
       Operating Context
14. Dashboard Representation

RPM shall be displayed in real time.

Possible representations:

┌──────────────────┐
│ ENGINE RPM       │
│                  │
│     4200 rpm     │
│                  │
│      ● NORMAL    │
└──────────────────┘

The dashboard shall also provide:

Current value
Trend graph
Operating state
Alert indication where required
15. Data Quality Requirements

RPM data shall support the following quality states:

VALID
WARNING
INVALID
MISSING
STALE

Example:

RPM: 4200 rpm
Quality: VALID

If communication stops:

RPM: 4200 rpm
Quality: STALE
Last Update: 2.4 s ago
16. Fault / Failure Signatures

Potential abnormal RPM patterns include:

Excessive fluctuation
4200 → 3900 → 4300 → 4000

Potentially associated with abnormal combustion, load changes or other engine conditions.

Unexpected RPM drop
4200 → 3800 → 3500

May indicate changing load, combustion abnormality, performance degradation or another condition.

Unexpected RPM increase

May indicate abnormal load/throttle relationship or control behaviour.

Constant/stuck value
4200
4200
4200
4200
4200

despite changing operating conditions may indicate a sensor/telemetry problem.

These are diagnostic indicators, not standalone fault conclusions.

17. Parameter Relationships

RPM shall be correlated with other parameters.

Important relationships:

Throttle
   ↕
RPM
   ↕
Engine Load
   ↕
Fuel Flow

and:

RPM
 ↓
Combustion
 ↓
EGT / CHT

and:

RPM
 ↓
Mechanical Rotation
 ↓
Vibration

These relationships will be useful for:

Data validation
Digital Twin
Fault detection
AI/ML
Health assessment
18. Criticality
Criticality: CRITICAL

Reason:

RPM is a fundamental engine operating-state parameter and is used to interpret multiple other engine measurements.

Loss or corruption of RPM data can affect:

Engine-state estimation
Digital Twin synchronization
Health assessment
Fault detection
AI/ML inference

Therefore, RPM data quality should be continuously monitored.

19. Data Storage Requirements

Each RPM measurement shall be stored with appropriate metadata.

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
Parameter: EP-01
Value: 4200
Unit: rpm
Quality: VALID
Timestamp: 10:32:01.250
Source: Simulator
20. Verification & Validation

RPM implementation shall be verified using:

A. Sensor/ECU documentation

Verify:

Measurement method
Interface
Resolution
Accuracy
Update behaviour
B. Engine test data

Compare recorded RPM against expected operating behaviour.

C. Simulator

Generate:

Stable RPM
Acceleration
Deceleration
Throttle transitions
Abnormal RPM patterns
D. Cross-parameter validation

Compare RPM with:

Throttle
Fuel flow
Engine load
Vibration
Temperature
E. Digital Twin

Compare:

Measured RPM
      vs
Expected RPM

and evaluate the residual.