EP-08 — Battery Voltage
1. Parameter Identification
Field	Specification
Parameter ID	EP-08
Parameter Name	Engine Electrical System / Battery Voltage
Abbreviation	VBAT
Parameter Category	Electrical / Engine Support-System Parameter
Criticality	Critical
2. Parameter Description

Battery Voltage represents the electrical potential of the engine/UAV electrical power system at the designated battery measurement point.

For the Digital Twin system, battery voltage is important because the engine's electrical system supports components such as:

ECU/FADEC
Sensors
Fuel-system electronics
Ignition/control electronics where applicable
Communication interfaces
Data-acquisition systems

Battery voltage monitoring can therefore provide an indication of electrical-system health and data-source reliability.

3. Unit
Unit: Volt (V)

Example:

Battery Voltage = 24.2 V

The exact nominal electrical-system voltage shall depend on the selected UAV/engine architecture.

Do not hard-code a 12 V or 24 V system until the reference platform is selected.

4. Measurement / Data Source

Battery voltage may be obtained from:

Battery voltage sensor
Voltage divider + ADC
ECU/FADEC
BMS where applicable
Power-management controller
CAN telemetry
DAQ system
Engine simulator

Typical architecture:

Battery
   ↓
Voltage Measurement
   ↓
ADC / ECU / BMS
   ↓
CAN / Telemetry
   ↓
Digital Twin
5. Measurement Type

Battery voltage is a direct electrical measurement.

The system may additionally calculate derived electrical indicators such as:

Voltage deviation
Voltage trend
Voltage drop during load
Charging-state indicator
Electrical-system health indicator

Concept:

Measured Voltage
       ↓
Electrical State
       ↓
Health Assessment
6. Operating Condition Dependency

Battery voltage can depend on:

Battery state of charge
Electrical load
Alternator/generator state
Engine RPM
Battery temperature
Charging system condition
Mission phase
Startup conditions

Concept:

Engine RPM
     +
Electrical Load
     +
Alternator Output
     +
Battery State
        ↓
Battery Voltage

Therefore, battery voltage shall not be evaluated independently of charging-system state.

7. Expected Operating Behaviour

Typical qualitative behaviour:

Engine OFF
     ↓
Battery supplies electrical loads
     ↓
Engine Start
     ↓
Electrical load changes
     ↓
Alternator / Generator becomes active
     ↓
System voltage stabilizes

Voltage behaviour may differ between:

Engine OFF
Engine starting
Engine running
High electrical load
Charging condition
Alternator fault

Exact voltage limits shall be based on the selected electrical architecture, battery chemistry, ECU requirements and manufacturer/test documentation.

8. Validation Rules

Battery voltage shall undergo:

Range validation

Detect impossible values.

Voltage = -5 V
     ↓
INVALID
Rate-of-change validation

Detect unrealistic voltage jumps.

24.1
24.2
24.2
31.5 ← suspicious
Operating-state validation

Interpret voltage according to:

Engine OFF
Starting
Running
Charging
High-load operation
Cross-parameter validation

Compare with:

RPM
Alternator output/status
Electrical load where available
Mission state
9. Sampling / Update Requirement

Battery voltage changes relatively slowly compared with vibration or RPM.

The acquisition system shall still sample frequently enough to capture:

Engine start voltage behaviour
Voltage dips
Charging transitions
Load changes
Electrical faults

The exact sampling/update rate shall depend on the electrical architecture and monitoring requirements.

For the prototype, the update interval shall remain configurable.

10. Digital Twin Relevance

Battery voltage shall contribute to the Digital Twin's electrical subsystem state.

Concept:

Battery State
+
Alternator State
+
Electrical Load
+
Engine RPM
       ↓
Electrical Model
       ↓
Expected System Voltage

The system may calculate:

Voltage Residual =
Measured Voltage
−
Expected Voltage

This can support electrical health assessment.

11. Health Monitoring Relevance

Battery voltage shall contribute to Electrical Health.

Possible indicators:

Low-voltage trend
Excessive voltage fluctuation
Abnormal startup voltage drop
Charging-related voltage behaviour
Voltage instability

Example:

Battery Voltage ↓
+
Alternator Output ↓
        ↓
Electrical Health degradation
12. Fault Detection Relevance

Battery voltage may contribute to detection of:

Battery degradation
Charging-system abnormalities
Alternator-related problems
Electrical overload
Wiring/power-distribution issues
Sensor/measurement faults

Example:

Voltage ↓
+
Engine Running
+
Alternator Status Abnormal
       ↓
Possible charging-system issue

Another example:

Voltage suddenly drops
+
Electrical load increases
       ↓
Possible battery/load-related event

Battery voltage alone should not be used to identify a specific electrical fault.

13. AI/ML Relevance

Battery voltage shall be available as an AI/ML feature.

Direct feature
Battery Voltage
Statistical features
Mean
Minimum
Maximum
Standard Deviation
Trend features
Voltage Trend
Voltage Drop Rate
Voltage Recovery Rate
Event features
Startup Voltage Drop
Load-related Voltage Drop
Charging Transition
Combined features
Battery Voltage
+
Alternator Output
+
RPM

These may support:

Electrical anomaly detection
Battery health assessment
Charging-system fault prediction
Mission reliability analysis
14. Dashboard Representation

Battery voltage shall be displayed in the dashboard.

Example:

┌────────────────────┐
│   BATTERY VOLTAGE  │
│                    │
│       24.2 V       │
│                    │
│      ● NORMAL      │
└────────────────────┘

The dashboard may also show:

Voltage:       24.2 V
Trend:         Stable
Alternator:    ACTIVE
Electrical:    NORMAL

A historical voltage trend shall also be available.

15. Data Quality Requirements

Battery voltage shall support:

VALID
WARNING
INVALID
MISSING
STALE

Additional checks may include:

ADC saturation
Sensor disconnection
Communication failure
Implausible jumps

Example:

Battery Voltage: 24.2 V
Quality: VALID
16. Fault / Failure Signatures
Persistent low voltage
24.2 → 23.8 → 23.2 → 22.7 V

Potentially associated with:

Battery discharge
Charging-system problem
Excessive electrical load
Excessive voltage drop during startup

May indicate:

Battery weakness
High startup load
Electrical connection issue
Voltage fluctuation during engine operation
24.1 → 25.0 → 23.8 → 25.1

May indicate:

Charging-system instability
Load variation
Electrical fault
Measurement issue
Voltage inconsistent with alternator state
Alternator ACTIVE
+
Voltage not recovering
        ↓
Possible charging-system abnormality

These patterns require correlation with alternator state and other electrical measurements.

17. Parameter Relationships
Battery Voltage ↔ Alternator
Alternator Output
       ↓
Battery Charging
       ↓
Battery Voltage
Battery Voltage ↔ RPM

Alternator output can depend on engine speed depending on system architecture.

RPM
 ↓
Alternator
 ↓
Electrical System
Battery Voltage ↔ Electrical Load
Electrical Load ↑
       ↓
Battery / Charging Response
       ↓
Voltage
Battery Voltage ↔ ECU/Sensors
Battery Voltage
      ↓
ECU + Sensors + Communication
      ↓
Data Availability

This last relationship is particularly important for our Digital Twin system because electrical problems can also cause telemetry/data-quality problems.

18. Criticality
Criticality: CRITICAL

Reason:

Battery voltage can affect both the engine's electrical support systems and the availability/reliability of telemetry and control electronics.

Abnormal battery voltage can potentially cause:

Sensor issues
ECU instability
Communication loss
Data-quality degradation
Electrical-system faults

Therefore, battery voltage should be monitored continuously.

19. Data Storage Requirements

Each measurement shall contain:

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
Parameter: EP-08
Value: 24.2
Unit: V
Quality: VALID
Timestamp: 10:32:01.250
Source: Simulator

Derived information may include:

expected_voltage
voltage_residual
voltage_trend
electrical_health_indicator
startup_voltage_drop
20. Verification & Validation

Battery-voltage implementation shall be verified using:

A. Electrical-system documentation

Verify:

Nominal system voltage
Allowed operating range
Battery specifications
Measurement interface
Sensor accuracy
B. Controlled testing/simulation

Simulate:

Engine OFF
Engine start
Normal charging
High electrical load
Battery discharge
Charging-system abnormality
Sensor failure
C. Cross-parameter validation

Compare voltage with:

Alternator status/output
RPM
Electrical load
Mission state
D. Digital Twin validation

Compare:

Measured Voltage
      vs
Expected Voltage
E. Data-quality validation

Verify system response to:

Missing data
Stale data
Communication loss
Sensor out-of-range condition