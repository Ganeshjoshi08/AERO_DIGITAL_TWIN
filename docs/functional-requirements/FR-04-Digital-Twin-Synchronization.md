FR-04 — Digital Twin Synchronization
1. Objective

The system shall maintain a continuously updated virtual representation of the aero-piston engine by synchronizing processed engine telemetry with a physics-based virtual engine model.

The Digital Twin shall represent the current operating state, expected behaviour, health condition, degradation state, and relevant model deviations of the corresponding physical or simulated engine.

2. Scope

FR-04 covers:

Virtual engine model
Physical-to-virtual data mapping
Real-time synchronization
Engine state estimation
Physics-based model integration
Expected engine behaviour
Actual-vs-expected comparison
Residual/deviation generation
Operating-condition awareness
Health-state synchronization
Degradation tracking
Confidence/uncertainty
Twin-state updates
Digital Twin outputs
Interfaces with AI/ML, fault detection, RUL and maintenance modules

A Digital Twin should be treated as more than a visualization; NASA describes it as a dynamically updated virtual representation of an individual physical asset, while aerospace Digital Twin research emphasizes integrating physics-based models with sensor data.

3. Digital Twin Virtual Engine Model

The system shall maintain a virtual model representing the major operating behaviour of the aero-piston engine.

The initial model shall represent relevant relationships involving:

Engine speed
Throttle/load
Fuel flow
Thermal behaviour
Exhaust behaviour
Lubrication condition
Environmental conditions
Engine performance

The model may initially be reduced-order rather than a full high-fidelity engine simulation.

This is important because aerospace propulsion Digital Twin research commonly considers multi-fidelity modelling and data assimilation rather than requiring maximum-fidelity simulation for every real-time application.

4. Physical-to-Virtual Data Mapping

Processed telemetry from FR-02 shall be mapped to corresponding variables in the Digital Twin.

Example:

Physical / Simulated Engine
          │
          ↓
       RPM = 4200
       CHT = 178°C
       EGT = 705°C
       Oil P = 4.1 bar
          │
          ↓
      Digital Twin
          │
          ├── Engine Speed State
          ├── Thermal State
          ├── Combustion State
          └── Lubrication State

Each physical parameter shall have a defined relationship with one or more virtual-engine states.

5. Real-Time Synchronization

The Digital Twin shall be updated whenever new validated telemetry becomes available.

Basic process:

New Telemetry
      ↓
FR-02 Validation
      ↓
Digital Twin Update
      ↓
Virtual Engine State
      ↓
Health / Fault / Prediction

The synchronization mechanism shall maintain temporal consistency between telemetry and the virtual engine state.

Real-time data ingestion and model updating are established elements of predictive Digital Twin architectures.

6. Engine State Estimation

The system shall estimate the current internal/virtual operating state of the engine using available measurements and model outputs.

The estimated state may include:

Operating condition
Engine load
Thermal state
Combustion state
Lubrication state
Mechanical condition
Electrical condition
Degradation state

Where direct measurement is unavailable, the system may estimate the state using model relationships and available sensor measurements.

7. Physics-Based Model Integration

The Digital Twin shall incorporate physics-based relationships representing engine behaviour.

Possible model areas:

Engine Speed
     ↓
Load / Torque

Fuel Flow
     ↓
Combustion Behaviour
     ↓
EGT / CHT

Oil Pressure + Temperature
     ↓
Lubrication State

Altitude + Ambient Conditions
     ↓
Engine Operating Environment

The physics model will provide the expected engine behaviour against which actual measurements can be compared.

Hybrid approaches combining physics-based and data-driven models are particularly relevant for engine Digital Twins because they can retain physical interpretability while improving adaptability. Recent 2026 engine research specifically investigates physics-informed neural-network approaches for engine health monitoring.

8. Expected Engine Behaviour

For a given operating condition, the Digital Twin shall calculate or estimate expected engine parameters.

Example:

Inputs:

RPM          = 4200
Throttle     = 70%
Altitude     = 4000 m
Ambient Temp = 30°C

          ↓

DIGITAL TWIN

          ↓

Expected CHT = 175°C
Expected EGT = 700°C
Expected Oil P = 4.2 bar

These expected values become the reference behaviour for subsequent health analysis.

9. Actual vs Expected Comparison

The system shall continuously compare measured values with Digital Twin predictions.

Example:

Parameter       Actual       Expected

CHT             181°C        175°C
EGT             735°C        700°C
Oil Pressure    4.0 bar      4.2 bar

The system shall calculate the deviation between actual and expected behaviour.

This comparison is a core mechanism in model-based engine health monitoring; propulsion research has used model outputs and sensor measurements to identify abnormal operation and degradation.

10. Residual / Deviation Calculation

For relevant parameters, the Digital Twin shall generate residuals.

Basic concept:

Residual = Actual Value − Expected Value

Example:

Actual EGT     = 735°C
Expected EGT   = 700°C

Residual       = +35°C

Residuals shall be available for:

Anomaly detection
Fault diagnosis
Sensor validation
Degradation tracking
AI/ML features

The residual should not automatically be interpreted as a fault because deviations can result from operating conditions, model error, sensor error, or genuine degradation.

11. Operating Condition Awareness

The Digital Twin shall consider engine operating conditions while interpreting telemetry.

Relevant conditions include:

RPM
Throttle
Engine load
Altitude
Ambient temperature
Ambient pressure
Mission phase

Example:

EGT = 720°C

At low load → potentially abnormal
At high load → potentially normal

Therefore, the Digital Twin shall avoid treating every absolute deviation as a fault.

This operating-condition awareness is important because Digital Twin models need to assimilate operational data to remain representative of the system's current state.

12. Health State Synchronization

The Digital Twin shall maintain a current health state based on:

Validated telemetry
Model predictions
Residuals
Historical behaviour
Detected anomalies
Fault information
Degradation indicators

Conceptually:

Telemetry
    +
Physics Model
    +
Historical State
    +
Anomaly Information
          ↓
    Digital Twin
          ↓
     Health State
13. Degradation State Tracking

The Digital Twin shall track gradual changes in engine behaviour over time.

Example:

Mission 01 → Health 96%
Mission 10 → Health 93%
Mission 20 → Health 89%
Mission 30 → Health 84%

The system shall maintain degradation trends for relevant subsystems.

Potential degradation indicators:

Increasing thermal deviation
Increasing vibration
Decreasing oil pressure
Increasing fuel consumption
Increasing model residuals
Reduced performance

These trends will later provide inputs to the RUL and predictive-maintenance modules.

14. Digital Twin Confidence / Uncertainty

The system shall maintain a confidence indicator for the current Digital Twin state where feasible.

Confidence can be affected by:

Sensor quality
Missing data
Model uncertainty
Operating conditions outside training/calibration range
Large model residuals
Insufficient historical data

Example:

Digital Twin State

Health:       87%
Confidence:   91%

This prevents the system from presenting model estimates as absolute truth.

15. Twin State Update

The Digital Twin shall update its internal state whenever new validated telemetry is received.

Concept:

Previous Twin State
        +
New Telemetry
        +
Physics Model
        ↓
State Estimation
        ↓
Updated Twin State

The system should preserve the previous state/history so that trends and mission replay remain possible.

16. Digital Twin Outputs

The Digital Twin shall provide:

Current virtual engine state
Expected parameter values
Actual-vs-expected deviations
Residuals
Health state
Degradation indicators
Operating state
Model confidence
Inputs for fault detection
Inputs for AI/ML
Inputs for RUL estimation
17. Interface with AI/ML

The Digital Twin shall provide model-derived features to the AI/ML layer.

Example:

Sensor Data
     +
Twin Prediction
     +
Residuals
     +
Operating State
     ↓
AI / ML

This allows AI/ML models to learn not only from raw sensor values but also from the difference between expected and observed engine behaviour.

Hybrid physics/data-driven Digital Twins have been investigated specifically for engine fault detection and improved prediction accuracy.

18. Interface with Fault Detection

The Digital Twin shall provide information to the fault-detection module.

Example:

EGT Residual ↑
CHT Residual ↑
Fuel Flow Deviation ↑
        ↓
Fault Detection
        ↓
Possible Combustion Abnormality

The fault engine shall use these deviations together with sensor data and AI/ML outputs rather than relying on a single parameter.

This multi-source fusion approach is consistent with NASA propulsion-health research, which describes combining sensor measurements, models and other information to improve diagnostic reliability and reduce false alarms.

19. Interface with RUL & Maintenance

The Digital Twin shall provide degradation-related information to the prognostic and maintenance modules.

Twin History
     ↓
Degradation Trend
     ↓
RUL Model
     ↓
Future Health
     ↓
Maintenance Advisory

The Digital Twin itself will not arbitrarily generate an RUL number. RUL will be estimated by the dedicated prognostic model using the available degradation history and uncertainty.

ISO's condition-monitoring architecture similarly separates health assessment from prognostic assessment, where prognostics project future equipment state using models and operational information.

20. Acceptance Criteria

FR-04 shall be considered complete when:

 A virtual engine model is defined.
 Physical/simulated parameters are mapped to virtual-engine variables.
 Processed telemetry can update the Digital Twin.
 Current engine state can be estimated.
 Physics-based model outputs are available.
 Expected engine behaviour can be generated.
 Actual and expected values can be compared.
 Residuals/deviations can be calculated.
 Operating conditions are considered during comparison.
 Health state can be synchronized.
 Degradation trends can be tracked.
 Digital Twin confidence/uncertainty can be represented.
 Twin outputs are available to AI/ML and fault-detection modules.
 Twin outputs can support RUL and maintenance modules.
 Historical Twin states can be retained for replay and analysis.