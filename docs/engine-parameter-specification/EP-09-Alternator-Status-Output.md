EP-09 — Alternator Status / Output
1. Parameter Identification
Field	Specification
Parameter ID	EP-09
Parameter Name	Alternator Status / Output
Abbreviation	ALT
Parameter Category	Electrical / Power Generation Parameter
Criticality	Critical
2. Parameter Description

The alternator status/output parameter represents the operating condition and, where measurable, electrical output of the engine-driven power-generation system.

It is important for determining whether the engine-driven electrical system is:

Generating power
Charging the battery
Supplying electrical loads
Operating normally
Experiencing abnormal output

For our Digital Twin, alternator information helps establish the electrical subsystem state and interpret battery-voltage behaviour.

3. Parameter Representation

Alternator information may consist of more than one signal.

Status
OFF
STARTING / TRANSITION
ACTIVE
FAULT
UNKNOWN
Output

Depending on available instrumentation:

Voltage → V
Current → A
Power → W

Where:

Power ≈ Voltage × Current

The exact measurable output shall depend on the selected electrical architecture.

4. Measurement / Data Source

Alternator information may be obtained from:

Alternator/generator controller
ECU
Voltage/current sensors
BMS/power-management system
Electrical control unit
CAN telemetry
DAQ
Simulator

Typical architecture:

Engine Rotation
      ↓
Alternator
      ↓
Rectification / Regulation
      ↓
Electrical System
      ↓
Voltage / Current Measurement
      ↓
ECU / CAN
      ↓
Digital Twin
5. Measurement Type

Alternator information can be:

Directly measured

For example:

Output voltage
Output current
ECU/controller-derived

For example:

Alternator active
Charging status
Fault status
Calculated

For example:

Power = Voltage × Current
Simulated

The prototype can generate alternator behaviour based on engine RPM and electrical load.

6. Operating Condition Dependency

Alternator output may depend on:

Engine RPM
Electrical load
Alternator characteristics
Regulator behaviour
Battery state
Temperature
System voltage

Concept:

Engine RPM
     +
Electrical Load
     +
Battery State
       ↓
Alternator Behaviour
       ↓
Electrical Output

The exact relationship shall depend on the selected alternator and electrical architecture.

7. Expected Operating Behaviour

Typical qualitative behaviour:

Engine OFF
    ↓
Alternator inactive
    ↓
Engine Start
    ↓
Alternator activation
    ↓
Electrical generation
    ↓
Battery charging / Load supply

During normal engine operation, the alternator should provide electrical power according to the system's designed operating conditions.

Exact activation conditions and output limits shall be obtained from the selected platform's electrical-system documentation.

8. Validation Rules

Alternator data shall undergo:

Status validation

Check whether reported status is a valid state.

ACTIVE
OFF
FAULT
UNKNOWN
Output validation

Check:

Voltage range
Current range
Power consistency
Cross-parameter validation

Compare with:

Engine RPM
Battery voltage
Electrical load
Mission state
Logical consistency

Example:

Engine OFF
+
Alternator ACTIVE
        ↓
Suspicious state

Another example:

Alternator ACTIVE
+
Output = 0
        ↓
Possible abnormality
9. Sampling / Update Requirement

Alternator status shall be updated frequently enough to detect:

Activation
Deactivation
Output loss
Output recovery
Electrical instability

Voltage/current output may require a faster update rate than simple status information.

The exact rate shall be determined by the controller, sensors and electrical-system dynamics.

For the prototype, the update rate shall remain configurable.

10. Digital Twin Relevance

Alternator information shall contribute to the Digital Twin's electrical subsystem.

Concept:

RPM
+
Alternator State
+
Electrical Load
+
Battery State
       ↓
Electrical Model
       ↓
Expected Power Generation
       ↓
Expected System Voltage

The system may calculate:

Output Residual =
Measured Output − Expected Output

This can support electrical health assessment.

11. Health Monitoring Relevance

Alternator status/output shall contribute to Electrical Health.

Important indicators include:

Alternator active/inactive state
Output voltage
Output current
Generated power
Output stability
Charging behaviour

Example:

Alternator Active
+
Output Stable
+
Battery Voltage Stable
        ↓
Electrical Health: NORMAL
12. Fault Detection Relevance

Alternator information may contribute to detection of:

Alternator failure
Charging-system abnormality
Voltage-regulation problems
Output degradation
Electrical connection issues
Sensor/telemetry failure

Example:

Alternator ACTIVE
+
Output ↓
+
RPM Normal
        ↓
Possible alternator abnormality

Another:

Alternator ACTIVE
+
Battery Voltage ↓
+
Electrical Load Normal
        ↓
Possible charging-system issue

These conditions require supporting evidence before a fault is confirmed.

13. AI/ML Relevance

Alternator data shall be available as AI/ML features.

Categorical feature
Alternator Status
Numeric features
Output Voltage
Output Current
Output Power
Derived features
Power Stability
Output Deviation
Charging Duration
Output Trend
Combined features
Alternator Output
+
Battery Voltage
+
RPM
+
Electrical Load

These can support:

Electrical anomaly detection
Charging-system fault prediction
Electrical degradation monitoring
Mission reliability analysis
14. Dashboard Representation

The dashboard shall display alternator status prominently.

Example:

┌─────────────────────────┐
│      ALTERNATOR         │
│                         │
│       ● ACTIVE          │
│                         │
│ Output:  500 W          │
│ Voltage: 24.2 V         │
└─────────────────────────┘

If only status is available:

ALTERNATOR: ● ACTIVE

If a fault occurs:

⚠ ALTERNATOR OUTPUT LOW
15. Data Quality Requirements

Alternator data shall support:

VALID
WARNING
INVALID
MISSING
STALE
UNKNOWN

For status:

ACTIVE
OFF
FAULT
UNKNOWN

For numeric output:

Range validation
Missing-data detection
Sensor consistency
Communication validation
16. Fault / Failure Signatures
Alternator inactive during expected operation
Engine Running
+
Alternator OFF
        ↓
Potential abnormality
Output lower than expected
Expected Output: High
Actual Output: Low
        ↓
Possible alternator degradation
Output instability
500W → 350W → 510W → 320W

May indicate:

Electrical instability
Regulator issue
Load changes
Sensor problem
Battery voltage falling while alternator active
Alternator ACTIVE
+
Battery Voltage ↓
        ↓
Possible charging-system abnormality
17. Parameter Relationships
Alternator ↔ RPM
Engine RPM
     ↓
Alternator Rotation
     ↓
Electrical Generation

The exact relationship depends on the alternator architecture and regulator.

Alternator ↔ Battery Voltage
Alternator Output
      ↓
Battery Charging
      ↓
Battery Voltage
Alternator ↔ Electrical Load
Electrical Load
      ↓
Required Power
      ↓
Alternator Output
Alternator ↔ Engine State
Engine State
      ↓
Alternator Availability
18. Criticality
Criticality: CRITICAL

Reason:

The alternator/power-generation system can affect:

Battery charging
ECU operation
Sensor operation
Communication
Data acquisition
Overall engine/UAV electrical reliability

Therefore, alternator status/output should be monitored continuously.

19. Data Storage Requirements

The system shall store status and available output information.

timestamp
mission_id
engine_id
parameter_id
status
voltage
current
power
quality_status
source

Example:

Mission ID: M001
Engine ID: E001
Parameter: EP-09

Status: ACTIVE
Voltage: 24.2 V
Current: 20.7 A
Power: ~501 W

Quality: VALID
Source: Simulator

Derived information may include:

expected_output
output_residual
output_trend
electrical_health_indicator
charging_state
20. Verification & Validation

Alternator implementation shall be verified using:

A. Electrical-system documentation

Verify:

Alternator type
Rated output
Voltage
Current
Regulation characteristics
Controller interface
B. Controlled simulation

Simulate:

Engine OFF
Engine start
Alternator activation
Normal output
High electrical load
Low output
Alternator failure
Output instability
C. Cross-parameter validation

Compare alternator behaviour with:

RPM
Battery voltage
Electrical load
Engine state
D. Digital Twin validation

Compare:

Measured Output
      vs
Expected Output
E. Fault-injection testing

Test system response to:

Alternator OFF
Output LOW
Output UNSTABLE
Status UNKNOWN
Sensor FAILURE