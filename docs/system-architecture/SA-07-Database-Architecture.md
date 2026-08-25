SA-07 — Database Architecture
1. Purpose

Database Architecture defines the storage structure required for real-time and historical engine health monitoring.

The database shall support:

Real-time telemetry storage
Engine configuration
Mission history
Digital Twin states
Health indices
Fault events
AI/ML predictions
RUL estimates
Maintenance records
Mission replay
Analytics and reporting
2. Database Architecture

Our architecture will logically divide data into:

                    DATABASE
                       │
       ┌───────────────┼────────────────┐
       │               │                │
       ▼               ▼                ▼
  MASTER DATA     TIME-SERIES DATA   ANALYTICS
       │               │                │
       ▼               ▼                ▼
   Engines          Telemetry        Predictions
   Missions         Twin State       Faults
   Sensors          Events           RUL
   Parameters       Health           Maintenance
3. Recommended Storage Strategy

For our prototype, we should use a relational database with time-series-friendly design.

A strong initial choice is:

PostgreSQL

Why:

Open-source
Reliable
Good relational modelling
Strong SQL support
Suitable for structured engineering data
Can handle time-series workloads
Easy integration with Python/backend
Can later be extended for larger deployments

We don't need to lock ourselves into a specific production database yet; the architecture should keep the storage layer replaceable.

4. High-Level Database Structure
┌───────────────────────────┐
│       MASTER DATA         │
├───────────────────────────┤
│ Engine                    │
│ Sensor                    │
│ Parameter                 │
│ Mission                   │
│ Configuration             │
└──────────────┬────────────┘
               │
               ▼
┌───────────────────────────┐
│      OPERATIONAL DATA     │
├───────────────────────────┤
│ Telemetry                 │
│ Engine State              │
│ Health                    │
│ Events                    │
└──────────────┬────────────┘
               │
               ▼
┌───────────────────────────┐
│      AI / ANALYTICS       │
├───────────────────────────┤
│ Anomalies                 │
│ Fault Predictions         │
│ Degradation               │
│ RUL                       │
│ Maintenance Advisory      │
└───────────────────────────┘
5. Main Tables

We'll initially define these major tables:

ID	Table	Purpose
DB-01	engines	Engine master information
DB-02	engine_parameters	EP-01 → EP-17 definitions
DB-03	sensors	Sensor information
DB-04	missions	Mission information
DB-05	telemetry	Time-series sensor data
DB-06	engine_states	Digital Twin state
DB-07	health_records	Health indices
DB-08	fault_events	Detected fault events
DB-09	ai_predictions	AI/ML outputs
DB-10	rul_predictions	RUL estimates
DB-11	maintenance_records	Maintenance history
DB-12	simulation_runs	Simulation/what-if runs
DB-13	model_registry	ML/model versions
6. DB-01 — Engines

Stores engine master information.

Concept:

engines
----------------
engine_id
engine_serial
engine_type
manufacturer
model
configuration
installation_date
status
created_at

Example:

engine_id: E001
engine_type: Aero Piston
status: ACTIVE
7. DB-02 — Engine Parameters

This table contains our EP specifications.

engine_parameters
--------------------------
parameter_id
parameter_name
abbreviation
unit
category
criticality
description
min_value
max_value
update_rate
status

Examples:

EP-01 → RPM
EP-02 → CHT
EP-03 → EGT
...
EP-17 → Crankshaft Position

This means the application doesn't need to hard-code every parameter definition.

8. DB-03 — Sensors

Stores sensor metadata.

sensors
--------------------------
sensor_id
engine_id
parameter_id
sensor_type
manufacturer
model
serial_number
location
interface
status
calibration_date

Example:

Sensor:
S001

Parameter:
EP-03 EGT

Interface:
CAN

Status:
ACTIVE
9. DB-04 — Missions

Every flight/mission gets a unique record.

missions
--------------------------
mission_id
engine_id
mission_type
start_time
end_time
route / area reference
environment_profile
status

Example:

Mission ID: M001
Engine ID: E001
Mission Type: Endurance

This is extremely important because all telemetry can be associated with a mission.

10. DB-05 — Telemetry ⭐

This is one of the largest tables.

Stores time-series engine data.

Concept:

telemetry
--------------------------------
timestamp
mission_id
engine_id
parameter_id
value
unit
quality_status
source

Example:

10:32:01.250
M001
E001
EP-01
5200
RPM
VALID
CAN
11. Telemetry Data Strategy

We should preserve:

Raw telemetry
Original CAN / source value
Normalized telemetry
Engineering-unit value
Quality
VALID
WARNING
MISSING
STALE
INVALID

This helps with traceability and debugging.

12. DB-06 — Engine States

Stores the Digital Twin's reconstructed state.

engine_states
--------------------------
timestamp
mission_id
engine_id

rpm
engine_load
throttle
map
fuel_pressure
fuel_flow

cht
egt
oil_pressure
oil_temperature

ambient_temperature
ambient_pressure

operating_state
health_state

This is different from raw telemetry.

Telemetry

What the sensors reported.

Engine State

What the Digital Twin believes the engine state is.

13. DB-07 — Health Records

Stores health assessment.

health_records
--------------------------
timestamp
engine_id
mission_id

overall_health
mechanical_health
combustion_health
fuel_system_health
lubrication_health
thermal_health
electrical_health
sensor_health

health_status

Example:

Overall Health: 84%
Fuel Health: 74%
Thermal Health: 82%
Status: DEGRADED
14. DB-08 — Fault Events

Stores detected abnormalities.

fault_events
--------------------------
event_id
timestamp
mission_id
engine_id

fault_type
subsystem
severity
confidence

parameter_id
description
status
resolved_at

Example:

Fault:
Possible Fuel-System Abnormality

Confidence:
78%

Severity:
HIGH
15. DB-09 — AI Predictions

Stores AI/ML predictions separately.

ai_predictions
--------------------------
prediction_id
timestamp
engine_id
mission_id

model_id
model_version

prediction_type
anomaly_score
fault_probability
prediction
confidence

Example:

Prediction:
Injector Abnormality

Probability:
72%

Model:
fault_classifier_v1
16. DB-10 — RUL Predictions

RUL needs its own historical record.

rul_predictions
--------------------------
prediction_id
timestamp
engine_id
mission_id

rul_value
rul_unit
lower_bound
upper_bound
confidence
model_id
model_version

Example:

RUL:
420 hours

Range:
350–500 hours

Confidence:
78%

This lets us track whether RUL predictions are changing over time.

17. DB-11 — Maintenance Records

Stores maintenance history.

maintenance_records
--------------------------
maintenance_id
engine_id
mission_id
timestamp

maintenance_type
subsystem
issue
action_taken
technician_reference
status

Example:

Subsystem:
Fuel System

Issue:
Pressure deviation

Action:
Inspection performed

This historical information can later become valuable training data.

18. DB-12 — Simulation Runs

Every simulation should be reproducible.

simulation_runs
--------------------------
simulation_id
created_at
engine_id

scenario
duration
parameters
environment
model_version
result_location
status

Example:

Simulation:
High Altitude

Altitude:
6000 m

Scenario:
Endurance
19. DB-13 — Model Registry

AI models need version control.

model_registry
--------------------------
model_id
model_name
model_type
version
training_dataset
training_date
metrics
status

Example:

Model:
Anomaly Detector

Version:
1.2

Type:
Isolation Forest

Status:
ACTIVE

This is important for reproducibility.

20. Database Relationships

Main relationship:

ENGINE
  │
  ├────────── SENSOR
  │              │
  │              ▼
  │         PARAMETER
  │
  └────────── MISSION
                 │
                 ▼
             TELEMETRY
                 │
                 ▼
          DIGITAL TWIN STATE
                 │
       ┌─────────┼──────────┐
       ▼         ▼          ▼
     HEALTH     AI/ML      EVENTS
       │         │
       │         ├──── RUL
       │         │
       │         └──── PREDICTIONS
       │
       ▼
   MAINTENANCE
21. Simplified ER Diagram
┌──────────────┐
│   ENGINES    │
└──────┬───────┘
       │
       ├──────────────┐
       │              │
       ▼              ▼
┌─────────────┐  ┌─────────────┐
│   SENSORS   │  │  MISSIONS   │
└──────┬──────┘  └──────┬──────┘
       │                │
       ▼                ▼
┌─────────────┐  ┌─────────────┐
│ PARAMETERS  │  │ TELEMETRY   │
└─────────────┘  └──────┬──────┘
                        │
                        ▼
                 ┌─────────────┐
                 │ ENGINE      │
                 │ STATES      │
                 └──────┬──────┘
                        │
              ┌─────────┼─────────┐
              ▼         ▼         ▼
         ┌────────┐ ┌───────┐ ┌────────┐
         │ HEALTH │ │ FAULT │ │ AI/ML  │
         └────────┘ └───────┘ └───┬────┘
                                  │
                              ┌───▼───┐
                              │  RUL  │
                              └───────┘
22. Telemetry Storage Optimization

Telemetry can become very large.

For example:

10 parameters
×
10 samples/sec
×
1 hour

already produces a large number of records.

Therefore:

Hot Data

Recent data:

Fast access
Dashboard
Real-time processing
Historical Data

Older data:

Long-term analysis
Mission replay
Training

We can eventually use:

Retention / archival policies
Aggregation
Partitioning
23. Data Retention Strategy

Conceptually:

REAL-TIME
   ↓
Recent Telemetry
   ↓
Historical Telemetry
   ↓
Aggregated Data
   ↓
Archive

We should not permanently retain every high-frequency raw signal in the same form if it becomes impractical.

24. Data Integrity

Every important record should have:

Timestamp
Engine ID
Mission ID where applicable
Parameter ID
Source
Quality status
Model version where applicable

This gives us traceability.

25. Database and Digital Twin

The relationship is:

Telemetry
   ↓
Digital Twin
   ↓
Engine State
   ↓
Database

And historical data can go back into the Twin:

Database
   ↓
Mission Replay
   ↓
Digital Twin

So the database is not just storage—it supports replay, analytics, training and validation.

26. Database and AI/ML

Training:

Historical Telemetry
       +
Fault Events
       +
Maintenance Records
       ↓
Training Dataset
       ↓
ML Model

Inference:

Live Data
   ↓
ML Model
   ↓
Prediction
   ↓
Database
27. Database and Dashboard

Dashboard should retrieve processed information rather than repeatedly querying huge raw telemetry datasets.

Database
   ↓
Backend/API
   ↓
Dashboard

For real-time display:

Live Data
   ↓
Real-Time Processing
   ↓
Dashboard
28. Security Considerations

Database should eventually support:

Authentication
Role-based access
Audit logging
Backup
Encryption
Data integrity
Model/version traceability

Detailed implementation will be covered in:

SA-10-Security-Architecture.md
29. Future Fleet Expansion

The schema should support multiple engines.

Fleet
 │
 ├── Engine E001
 ├── Engine E002
 ├── Engine E003
 └── Engine E004

Each engine can have:

Multiple Missions
Multiple Sensors
Multiple Faults
Multiple Maintenance Events

This allows future fleet-level analytics.

30. Complete Database Flow
                    LIVE DATA
                       │
                       ▼
                ┌──────────────┐
                │ TELEMETRY    │
                └──────┬───────┘
                       ▼
                ┌──────────────┐
                │ ENGINE STATE │
                └──────┬───────┘
                       ▼
                ┌──────────────┐
                │ HEALTH       │
                └──────┬───────┘
                       │
           ┌───────────┼───────────┐
           ▼           ▼           ▼
        FAULTS       AI/ML        RUL
           │           │           │
           └───────────┼───────────┘
                       ▼
                 MAINTENANCE
                       │
                       ▼
                 HISTORICAL DB
                       │
            ┌──────────┼───────────┐
            ▼          ▼           ▼
         Replay     Training    Reports
31. Important Design Decision

Raw telemetry, Digital Twin state aur AI prediction ko ek hi table mein nahi rakhenge.

Separate logical tables rahenge:

Telemetry
    ↓
Engine State
    ↓
Health
    ↓
AI Prediction
    ↓
RUL
    ↓
Maintenance

Isse:

Data traceability improve hogi
Debugging easy hoga
ML experiments easy honge
Historical analysis better hoga
Architecture scalable rahega