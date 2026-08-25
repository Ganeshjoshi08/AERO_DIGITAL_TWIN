EP-06 — Fuel Flow
1. Parameter Identification
Field	Specification
Parameter ID	EP-06
Parameter Name	Engine Fuel Flow Rate
Abbreviation	Fuel Flow
Parameter Category	Fuel / Performance / Combustion Parameter
Criticality	High
2. Parameter Description

Fuel Flow represents the rate at which fuel is supplied to the engine during operation.

It is an important parameter for evaluating:

Engine operating condition
Fuel consumption
Combustion behaviour
Engine efficiency
Load response
Injector behaviour
Performance degradation
Mission endurance

For the Digital Twin, fuel flow is an important input for estimating expected combustion and engine performance.

3. Unit

The preferred internal unit shall be:

L/h — litres per hour

Other possible source units include:

mL/s
kg/h
g/s

If mass-based fuel-flow data is available, the system should preserve the original source unit and support conversion where fuel density is known.

Example:

Fuel Flow = 18 L/h
4. Measurement / Data Source

Fuel flow may be obtained from:

Fuel-flow sensor
Fuel-flow meter
ECU/FADEC
Injector command/ECU-derived data
CAN telemetry
Engine test instrumentation
Engine simulator

Typical architecture:

Fuel System
    ↓
Flow Sensor / ECU
    ↓
Signal Processing
    ↓
ECU / DAQ
    ↓
CAN / Telemetry
    ↓
Digital Twin

The actual measurement method shall depend on the selected engine and available instrumentation.

5. Measurement Type

Fuel flow may be:

Directly measured
ECU-derived
Calculated from fuel-system information
Simulated

The source type shall be recorded in the data metadata.

Example:

Fuel Flow
   ↓
Measured / ECU-derived
   ↓
Validated Telemetry
   ↓
System

For the prototype, simulated or dataset-derived fuel flow may be used when real fuel-flow instrumentation is unavailable.

6. Operating Condition Dependency

Fuel flow strongly depends on:

RPM
Throttle
Engine load
Engine operating state
Altitude
Ambient conditions
Injection timing
Mission phase

Concept:

Throttle + Load + RPM
          ↓
   Fuel Requirement
          ↓
      Fuel Flow

Fuel flow must therefore be interpreted in context.

For example, increased fuel flow at high engine load may be expected, whereas the same increase at unchanged operating conditions may indicate abnormal behaviour.

7. Expected Operating Behaviour

Typical qualitative behaviour:

Engine OFF
    ↓
Fuel Flow ≈ zero
    ↓
Engine Start
    ↓
Fuel Flow increases
    ↓
Idle
    ↓
Cruise
    ↓
Higher Load
    ↓
Fuel Flow increases

During stable operation, fuel flow should generally correlate with engine load and operating condition.

During rapid throttle changes, transient fuel-flow changes are expected.

Exact fuel-flow operating ranges shall be determined from the selected engine, fuel system, operating conditions and validated test/dataset information.

8. Validation Rules

Fuel-flow data shall undergo:

Range validation

Detect impossible negative or invalid values.

Fuel Flow = -5 L/h
       ↓
INVALID
Rate-of-change validation

Detect physically unrealistic jumps.

18 → 19 → 20 → 21 → 80 L/h
                         ↑
                    suspicious
Operating-state validation

Fuel flow should be consistent with:

Engine ON/OFF
RPM
Throttle
Engine load
Cross-parameter validation

Compare with:

RPM
EGT
CHT
Engine load
Injection timing
Digital Twin validation

Compare measured/estimated fuel flow with expected model behaviour.

9. Sampling / Update Requirement

Fuel flow shall be acquired frequently enough to capture:

Engine start
Idle
Cruise
Load changes
Throttle transitions
Abnormal fuel-flow behaviour
Long-duration fuel consumption

The exact update rate shall depend on:

Sensor response
ECU interface
Fuel-system dynamics
Communication architecture

The prototype implementation shall keep the update rate configurable.

10. Digital Twin Relevance

Fuel flow shall be an important Digital Twin input for:

Combustion modelling
Engine load estimation
Fuel-consumption estimation
Performance estimation
Thermal behaviour
Mission endurance

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
Digital Twin
       ↓
Expected Engine Behaviour

The system may calculate:

Fuel Flow Residual =
Measured Fuel Flow
−
Expected Fuel Flow

This residual shall be available to the health and fault-analysis modules.

11. Health Monitoring Relevance

Fuel flow shall contribute to:

Fuel-system health
Fuel Flow
   ↓
Fuel Delivery Health
Combustion health
Fuel Flow + EGT + RPM
            ↓
Combustion Health
Performance health
Fuel Flow
   +
Engine Output / Operating State
        ↓
Performance Efficiency

An increasing fuel requirement for the same operating condition may indicate degradation.

12. Fault Detection Relevance

Abnormal fuel-flow behaviour may contribute to detection of:

Injector abnormality
Fuel-delivery problems
Combustion instability
Misfire
Fuel-system leakage/abnormality
Engine performance degradation
Sensor/measurement fault

Example:

Fuel Flow ↑
+
RPM unchanged
+
Load unchanged
+
EGT ↑
       ↓
Possible combustion / fuel-system abnormality

Another example:

Fuel Flow ↓
+
RPM unstable
+
EGT abnormal
       ↓
Possible fuel-delivery / combustion abnormality

Fuel flow shall not be treated as a standalone fault diagnosis.

13. AI/ML Relevance

Fuel flow shall be an important AI/ML feature.

Direct feature
Fuel Flow
Statistical features
Mean Fuel Flow
Maximum Fuel Flow
Minimum Fuel Flow
Fuel Flow Variance
Trend features
Fuel Flow Trend
Fuel Flow Rate of Change
Long-Term Consumption Trend
Efficiency-related feature
Fuel Flow
     +
Engine Operating Condition
     ↓
Specific / Relative Fuel Consumption Indicator
Digital Twin feature
Fuel Flow Residual
=
Actual − Expected

These features may support:

Anomaly detection
Injector fault classification
Combustion analysis
Efficiency monitoring
Degradation prediction
RUL modelling
14. Dashboard Representation

Fuel flow shall be displayed in real time.

Example:

┌────────────────────┐
│     FUEL FLOW      │
│                    │
│      18 L/h        │
│                    │
│      ● NORMAL      │
└────────────────────┘

The dashboard should also provide:

Current fuel flow
Fuel-flow trend
Fuel consumed
Expected vs actual flow where available
Abnormality indicator

Example:

Actual:       18.5 L/h
Expected:     17.8 L/h
Deviation:    +0.7 L/h
15. Data Quality Requirements

Fuel-flow data shall support:

VALID
WARNING
INVALID
MISSING
STALE

Example:

Fuel Flow: 18 L/h
Quality: VALID

If the sensor/telemetry stops updating:

Fuel Flow: 18 L/h
Quality: STALE

The system shall distinguish between:

Engine OFF
Fuel Flow ≈ 0

and:

Engine RUNNING
Fuel Flow unexpectedly ≈ 0
16. Fault / Failure Signatures
Unexpected increase
18 → 18.5 → 19 → 21 L/h

Potentially associated with:

Increased load
Injector/fuel-system abnormality
Combustion inefficiency
Engine degradation
Unexpected decrease
18 → 16 → 13 L/h

while operating conditions remain unchanged may indicate:

Fuel-delivery abnormality
Combustion issue
Sensor problem
Fuel flow inconsistent with RPM/load
RPM stable
Load stable
Fuel Flow ↑
      ↓
Possible abnormal fuel behaviour
Fuel flow during engine OFF

A non-zero fuel-flow reading while the engine is confirmed OFF should trigger a data-quality or fuel-system investigation.

17. Parameter Relationships

Fuel flow shall be strongly correlated with:

Fuel Flow ↔ RPM
RPM / Load
    ↓
Fuel Requirement
    ↓
Fuel Flow
Fuel Flow ↔ Throttle
Throttle
    ↓
Engine Demand
    ↓
Fuel Flow
Fuel Flow ↔ EGT
Fuel Flow
    ↓
Combustion
    ↓
EGT
Fuel Flow ↔ CHT
Combustion Heat
    ↓
CHT
Fuel Flow ↔ Engine Load
Engine Load ↑
     ↓
Fuel Requirement ↑

These relationships are particularly important for Digital Twin residual analysis and AI/ML feature engineering.

18. Criticality
Criticality: HIGH

Reason:

Fuel flow is important for:

Engine performance
Combustion assessment
Fuel-system health
Mission endurance
Efficiency analysis
Fault prediction

However, its criticality can depend on whether independent fuel-flow information is available from the engine/ECU architecture.

19. Data Storage Requirements

Each fuel-flow measurement shall contain:

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
Parameter: EP-06
Value: 18
Unit: L/h
Quality: VALID
Timestamp: 10:32:01.250
Source: Simulator

Derived information may include:

expected_fuel_flow
fuel_flow_residual
fuel_consumed
fuel_efficiency_indicator
fuel_flow_trend
20. Verification & Validation

Fuel-flow implementation shall be verified using:

A. Sensor / ECU documentation

Verify:

Measurement method
Measurement range
Accuracy
Resolution
Response time
Interface
B. Engine test/dataset data

Compare fuel flow with known operating conditions.

C. Controlled simulation

Simulate:

Engine OFF
Engine start
Idle
Cruise
High load
Throttle transition
Fuel-flow abnormality
Sensor failure
D. Cross-parameter validation

Compare fuel flow with:

RPM
Throttle
Engine load
EGT
CHT
Injection timing
E. Digital Twin validation

Compare:

Measured / Estimated Fuel Flow
             vs
Expected Fuel Flow

and evaluate the residual.
