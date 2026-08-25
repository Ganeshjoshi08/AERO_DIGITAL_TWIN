SA-05 — Digital Twin Architecture
1. Purpose

The Digital Twin Architecture defines the virtual representation of the aero-piston engine and the mechanisms used to continuously synchronize the virtual engine with real or simulated engine data.

The Digital Twin shall support:

Real-time engine-state estimation
Engine behaviour modelling
Actual-vs-expected comparison
Health assessment
Anomaly detection
Degradation tracking
RUL estimation
Mission simulation
Historical mission replay
What-if analysis
2. Digital Twin Concept

Our system will maintain two representations:

┌────────────────────────┐
│    PHYSICAL ENGINE     │
│                        │
│ Engine + Sensors + ECU │
└───────────┬────────────┘
            │
       Live Telemetry
            │
            ▼
┌────────────────────────┐
│      DIGITAL TWIN      │
│                        │
│ Virtual Engine Model   │
│ Engine State            │
│ Performance Model       │
│ Health State             │
└────────────────────────┘

The Digital Twin is not simply a dashboard.

It continuously uses engine data to maintain a virtual representation of the current engine state.

3. Core Digital Twin Architecture
                 PHYSICAL ENGINE
                        │
                        │ Sensors / ECU
                        ▼
                ┌───────────────┐
                │ DATA INGESTION│
                └───────┬───────┘
                        │
                        ▼
                ┌───────────────┐
                │ DATA QUALITY  │
                └───────┬───────┘
                        │
                        ▼
          ┌────────────────────────────┐
          │      DIGITAL TWIN CORE     │
          │                            │
          │  ┌──────────────────────┐  │
          │  │ Engine State Model   │  │
          │  └──────────────────────┘  │
          │                            │
          │  ┌──────────────────────┐  │
          │  │ Physics / Performance│  │
          │  │ Model                │  │
          │  └──────────────────────┘  │
          │                            │
          │  ┌──────────────────────┐  │
          │  │ State Estimator      │  │
          │  └──────────────────────┘  │
          └──────────────┬─────────────┘
                         │
                         ▼
                ┌────────────────┐
                │ Expected State │
                └───────┬────────┘
                        │
             Actual vs Expected
                        │
                        ▼
                ┌────────────────┐
                │ Health / AI/ML │
                └────────────────┘
4. Physical Engine Representation

The physical engine will be represented through multiple subsystems.

ENGINE
│
├── Mechanical
│   ├── Crankshaft
│   ├── Pistons
│   ├── Cylinders
│   └── Propulsion Load
│
├── Combustion
│   ├── Fuel
│   ├── Air
│   ├── Injection
│   └── Combustion
│
├── Lubrication
│   ├── Oil Pressure
│   └── Oil Temperature
│
├── Thermal
│   ├── CHT
│   └── EGT
│
├── Fuel
│   ├── Fuel Flow
│   └── Fuel Pressure
│
├── Electrical
│   ├── Battery
│   └── Alternator
│
└── Environmental
    ├── Ambient Temperature
    ├── Ambient Pressure
    └── Altitude
5. Digital Twin State Model

The Twin shall maintain an internal representation of the engine state.

Example:

EngineState {

    rpm
    throttle
    engine_load

    cht
    egt

    oil_pressure
    oil_temperature

    fuel_flow
    fuel_pressure
    map

    vibration

    battery_voltage
    alternator_status

    injection_timing
    crankshaft_position

    ambient_temperature
    ambient_pressure

    operating_mode
    health_state
}

This is the current virtual state of the engine.

6. Operating State

The Digital Twin should identify the current engine operating condition.

Possible states:

ENGINE_OFF
     ↓
STARTING
     ↓
IDLE
     ↓
LOW_LOAD
     ↓
CRUISE
     ↓
HIGH_LOAD
     ↓
TRANSIENT
     ↓
SHUTDOWN

Abnormal conditions can be represented separately:

ABNORMAL
FAULT
DEGRADED
7. State Estimation

Sensor values are not always perfect.

Therefore, the Twin shall estimate the actual engine state using:

Sensor Data
+
Historical State
+
Physics Model
+
Operating Context
        ↓
State Estimator
        ↓
Estimated Engine State

Example:

RPM = 5200
MAP = 85 kPa
Throttle = 70%
Fuel Flow = 18 L/h

        ↓

Estimated Load = 64%

The exact estimation method will depend on the final engine model.

8. Physics-Based Model

The Digital Twin should include simplified physics/engineering relationships.

Examples:

Air Density
ρ = P / (R × T)

where:

ρ = air density
P = absolute pressure
T = absolute temperature
R = specific gas constant
Engine Power

Conceptually:

Power = Torque × Angular Velocity
Engine Speed
RPM ↔ Crankshaft Angular Velocity

These relationships allow the Twin to behave more realistically than a pure black-box ML model.

9. Performance Model

The Twin shall estimate expected engine performance based on operating conditions.

Inputs:

Throttle
RPM
Load
MAP
Ambient Temperature
Ambient Pressure
Fuel Flow

Outputs may include:

Expected RPM
Expected Fuel Flow
Expected EGT
Expected CHT
Expected Engine Load
Expected Performance

Concept:

Operating Conditions
        ↓
Performance Model
        ↓
Expected Engine Behaviour
10. Actual vs Expected Model ⭐

This is one of the most important features.

             ┌───────────────┐
             │ ACTUAL ENGINE │
             └───────┬───────┘
                     │
                     ▼
               Sensor Data
                     │
                     ▼
              ┌─────────────┐
              │ Digital Twin│
              └──────┬──────┘
                     │
             Expected Values
                     │
                     ▼
              ┌─────────────┐
              │ COMPARATOR   │
              └──────┬──────┘
                     │
                 Residual
                     │
                     ▼
                AI / Health

Example:

Parameter: EGT

Expected = 680°C
Actual   = 720°C

Residual = +40°C

The residual becomes an important feature for anomaly detection.

11. Residual Generation

For each relevant parameter:

Residual =
Measured Value − Expected Value

Examples:

RPM Residual
CHT Residual
EGT Residual
Oil Pressure Residual
Fuel Flow Residual
MAP Residual
Vibration Residual

Concept:

Expected EGT ─────┐
                  ├──► Residual
Actual EGT ───────┘
12. Health State Model

The Twin will maintain health states for major subsystems.

Engine Health
│
├── Mechanical Health
├── Combustion Health
├── Fuel System Health
├── Lubrication Health
├── Thermal Health
├── Electrical Health
└── Sensor Health

Example:

Mechanical      91%
Combustion      86%
Fuel System     74%
Lubrication     88%
Thermal         82%
Electrical      95%
Sensors         97%

These subsystem scores can contribute to an overall engine health index.

13. Health Index

Concept:

Subsystem Health
       ↓
Weighted Health Model
       ↓
Overall Engine Health

Example:

ENGINE HEALTH = 84%

Status classification:

90–100  → HEALTHY
75–89   → NORMAL / MONITOR
50–74   → DEGRADED
<50     → CRITICAL

These thresholds are prototype defaults only and must be calibrated/validated rather than presented as engine-certified limits.

14. Digital Twin + AI/ML

The Twin and AI/ML should work together.

                 Digital Twin
                      │
              Expected Behaviour
                      │
                      ▼
                  Residuals
                      │
                      ▼
                  AI / ML
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
       Anomaly      Fault      Degradation
       Score      Probability     Trend
          │           │           │
          └───────────┼───────────┘
                      ▼
                     RUL

This is a hybrid architecture rather than pure ML.

15. Physics + AI Hybrid Model

This is one of the strongest innovation areas for our project.

Instead of:

Sensor Data → ML → Fault

we use:

Sensor Data
     ↓
Digital Twin / Physics Model
     ↓
Expected Behaviour
     ↓
Residuals
     ↓
AI/ML
     ↓
Intelligent Diagnosis

Advantages:

Better interpretability
Better physical consistency
Reduced false alarms
Better behaviour under changing operating conditions
More useful for limited datasets
16. Real-Time Synchronization

The Digital Twin must continuously synchronize with incoming engine data.

New Telemetry
      ↓
Validate
      ↓
Update Engine State
      ↓
Run Model
      ↓
Calculate Expected State
      ↓
Calculate Residual
      ↓
Update Health
      ↓
Update Dashboard

This process repeats continuously.

17. Digital Twin Update Cycle

Conceptually:

t0
 ↓
Sensor Data
 ↓
Twin State Update
 ↓
Prediction
 ↓
Health Update

t1
 ↓
New Sensor Data
 ↓
Twin State Update
 ↓
Prediction
 ↓
Health Update

t2
 ↓
...

Thus:

The Digital Twin is a continuously updated state model, not a static simulation.

18. Degradation Tracking

The Twin should maintain historical health trends.

Example:

Health

100% ┤───────────╮
 90% ┤            ╲
 80% ┤             ╲
 70% ┤              ╲
 60% ┤               ╲
     └──────────────────── Time

The system can identify:

Health Trend
     ↓
Degradation Rate
     ↓
Predicted Future State

This feeds the RUL system.

19. Mission Context

Digital Twin state should include mission context.

Example:

Mission Context
│
├── Mission ID
├── Flight Phase
├── Altitude
├── Ambient Temperature
├── Ambient Pressure
├── Duration
└── Engine Operating Condition

Therefore:

Same EGT value

may have different meanings under:

High Altitude
vs
Ground

or:

Hot Weather
vs
Normal Weather

This helps prevent incorrect diagnosis.

20. What-if Simulation

Digital Twin shall support controlled parameter changes.

Example:

Current State
      ↓
Change Throttle to 80%
      ↓
Digital Twin
      ↓
Predict:
RPM
Fuel Flow
EGT
CHT
Load

Another:

Altitude ↑
      ↓
Atmospheric Model
      ↓
Digital Twin
      ↓
Expected Engine Response

This directly supports the problem statement's mission simulation requirement.

21. Mission Replay

Historical telemetry can be fed into the Twin.

Historical Mission
        ↓
Time-Ordered Data
        ↓
Digital Twin
        ↓
State Reconstruction
        ↓
Health / AI Analysis

This allows engineers to investigate:

When an anomaly began
How it developed
What parameters changed
Whether the Digital Twin detected it early
22. Digital Twin Modes

The system should support three modes.

Mode 1 — Live
Real-time telemetry
        ↓
Digital Twin
Mode 2 — Replay
Historical data
        ↓
Digital Twin
Mode 3 — Simulation
Synthetic mission
        ↓
Digital Twin

Architecture:

              ┌────────────┐
              │ LIVE DATA  │
              └─────┬──────┘
                    │
              ┌─────▼─────┐
              │            │
              │ DIGITAL    │
              │ TWIN CORE  │
              │            │
              └─────▲─────┘
                    │
       ┌────────────┴────────────┐
       │                         │
 Historical Data           Simulation Data
23. Digital Twin Data Outputs

The Twin shall provide:

Current Engine State
Expected Engine State
Residuals
Health State
Operating State
Performance Estimate
Degradation Indicators
Simulation Results

These outputs feed:

AI/ML
Health Engine
RUL
Dashboard
Database
Mission Replay
24. Digital Twin Architecture — Complete
                 ┌─────────────────────┐
                 │ PHYSICAL ENGINE     │
                 │ Sensors + ECU       │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │ DATA INGESTION      │
                 └──────────┬──────────┘
                            ▼
                 ┌─────────────────────┐
                 │ VALIDATION &        │
                 │ PREPROCESSING       │
                 └──────────┬──────────┘
                            ▼
        ╔════════════════════════════════════╗
        ║         DIGITAL TWIN CORE         ║
        ║                                    ║
        ║  ┌──────────────────────────────┐  ║
        ║  │ Engine State Model           │  ║
        ║  └──────────────────────────────┘  ║
        ║                                    ║
        ║  ┌──────────────────────────────┐  ║
        ║  │ Physics / Thermodynamic      │  ║
        ║  │ Model                        │  ║
        ║  └──────────────────────────────┘  ║
        ║                                    ║
        ║  ┌──────────────────────────────┐  ║
        ║  │ Performance Model            │  ║
        ║  └──────────────────────────────┘  ║
        ║                                    ║
        ║  ┌──────────────────────────────┐  ║
        ║  │ State Estimator              │  ║
        ║  └──────────────────────────────┘  ║
        ║                                    ║
        ║  ┌──────────────────────────────┐  ║
        ║  │ Actual vs Expected           │  ║
        ║  │ Residual Generator           │  ║
        ║  └──────────────────────────────┘  ║
        ╚══════════════════╤═════════════════╝
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
         Health Engine   AI/ML      Simulation
              │            │            │
              └────────────┼────────────┘
                           ▼
                    RUL / Maintenance
                           │
                           ▼
                      Dashboard
25. Important Design Decision

Bhai, Digital Twin ko hum ek single ML model nahi banayenge.

Our architecture will be:

              DIGITAL TWIN
                   │
       ┌───────────┼───────────┐
       ▼           ▼           ▼
   Physics      State        Data/
   Model       Estimator     History
       │           │           │
       └───────────┼───────────┘
                   ▼
              Virtual State
                   │
                   ▼
            Actual vs Expected
                   │
                   ▼
                 AI/ML

This gives us a much stronger and more defensible architecture for the DRDO problem statement.