SA-03 — Data Flow Architecture
1. Purpose

Data Flow Architecture defines the complete movement of engine data from the physical/simulated engine to the Digital Twin, AI/ML systems, database and dashboard.

The architecture shall support:

Real-time telemetry
Historical data
Sensor validation
Data synchronization
Digital Twin updates
AI/ML analytics
Mission replay
Fault/event generation
Dashboard visualization
2. Overall Data Flow

Our complete data pipeline:

┌───────────────────────┐
│ ENGINE / ENGINE       │
│ SIMULATOR             │
└──────────┬────────────┘
           │
           ▼
┌───────────────────────┐
│ SENSORS / ECU / FADEC │
└──────────┬────────────┘
           │
           ▼
┌───────────────────────┐
│ CAN / TELEMETRY       │
│ INTERFACE              │
└──────────┬────────────┘
           │
           ▼
┌───────────────────────┐
│ DATA ACQUISITION      │
│ M01                    │
└──────────┬────────────┘
           │ Raw Data
           ▼
┌───────────────────────┐
│ VALIDATION &          │
│ PREPROCESSING M02     │
└──────────┬────────────┘
           │ Clean Data
           ▼
┌───────────────────────┐
│ SENSOR FUSION &       │
│ FEATURE EXTRACTION M03│
└──────────┬────────────┘
           │
           ▼
╔═══════════════════════╗
║   DIGITAL TWIN CORE   ║
║         M04           ║
╚══════════╤════════════╝
           │
     ┌─────┼───────────┐
     │     │           │
     ▼     ▼           ▼
   Health AI/ML     Simulation
   M05   M06          M07
     │     │           │
     └─────┼───────────┘
           ▼
┌───────────────────────┐
│ RUL & MAINTENANCE     │
│ ENGINE M08            │
└──────────┬────────────┘
           │
     ┌─────┴───────────┐
     ▼                 ▼
 DATABASE M09       DASHBOARD M10
3. Data Sources

Our system will support multiple data sources.

A. Real Engine
Engine
 ↓
Sensors
 ↓
ECU
 ↓
CAN
B. Engine Test Rig
Test Engine
 ↓
DAQ
 ↓
CAN / Network
C. Simulator
Engine Simulation
 ↓
Synthetic Telemetry
D. Historical Dataset
CSV / Database
 ↓
Replay Engine

This is important because initially we may not have continuous access to a real aero-piston engine.

4. Raw Data Flow

The first data received by M01 is raw telemetry.

Example:

Timestamp:       10:32:01.250
Engine ID:       E001
RPM:             5200
CHT:             165
EGT:             720
Oil Pressure:    XX
Oil Temperature: XX
Fuel Flow:       XX
Vibration:       XX
Battery Voltage: XX

The raw record shall not immediately be modified.

It should first be preserved for traceability.

5. Data Acquisition Flow

M01 receives data from:

CAN
CAN FD
SocketCAN
Serial
Ethernet
Simulator API
Historical Dataset

Concept:

Data Source
    ↓
Interface Adapter
    ↓
Message Decoder
    ↓
Raw Telemetry Object

The architecture should use an adapter approach so that changing the physical interface does not require rewriting the rest of the system.

6. Data Validation Flow

Raw data enters M02.

Raw Data
   ↓
Schema Validation
   ↓
Range Validation
   ↓
Timestamp Validation
   ↓
Missing Data Detection
   ↓
Sensor Status
   ↓
Clean / Flagged Data

Example:

RPM = 5200
       ↓
Valid Range?
       ↓
YES
       ↓
VALID

But:

RPM = -500
       ↓
INVALID
7. Data Quality Status

Every important parameter should carry a quality state.

Recommended:

VALID
WARNING
INVALID
MISSING
STALE
SENSOR_FAULT
COMMUNICATION_FAULT

Example:

RPM:
Value = 5200
Quality = VALID

Another:

EGT:
Value = NULL
Quality = MISSING

This is extremely important for AI/ML because the model should know whether a value is real, estimated or missing.

8. Timestamp Synchronization

All engine parameters need a common time reference.

Example:

Timestamp
    │
    ├── RPM
    ├── CHT
    ├── EGT
    ├── Oil Pressure
    ├── Fuel Flow
    ├── Vibration
    └── MAP

Without synchronization:

RPM → t1
EGT → t2
Vibration → t3

AI/ML correlations can become incorrect.

Therefore:

Timestamp synchronization is a core requirement of the data architecture.

9. Unit Normalization

Different sensors may provide different units.

Example:

Pressure:
psi
bar
kPa

System converts them into standard internal units.

Concept:

Raw Unit
   ↓
Unit Converter
   ↓
Standard Unit
   ↓
Digital Twin

The original raw value/unit should preferably remain available for traceability.

10. Data Processing Flow

After validation:

Validated Data
      ↓
Filtering
      ↓
Normalization
      ↓
Synchronization
      ↓
Feature Extraction
      ↓
Processed Data

Examples:

Vibration
Raw Signal
   ↓
Filtering
   ↓
RMS
   ↓
Peak
   ↓
Frequency Features
Temperature
CHT
 ↓
Temperature Trend
 ↓
Rate of Increase
Fuel
Fuel Flow
+
Fuel Pressure
 ↓
Fuel-System Features
11. Sensor Fusion

Multiple parameters are combined to understand engine state.

Example:

RPM
+
Throttle
+
MAP
+
Fuel Flow
+
EGT
+
CHT
        ↓
Operating State

Possible operating states:

ENGINE OFF
STARTING
IDLE
CRUISE
HIGH LOAD
TRANSIENT
SHUTDOWN
ABNORMAL
12. Digital Twin Data Flow ⭐

This is the most important part.

               LIVE DATA
                  │
                  ▼
        ┌──────────────────┐
        │ Digital Twin     │
        │                  │
        │ Current State    │
        │ Expected State   │
        │ Physics Model    │
        └────────┬─────────┘
                 │
                 ▼
          State Difference
                 │
                 ▼
           Health / AI

The Digital Twin continuously receives validated data and updates its virtual engine state.

13. Actual vs Expected

One of the key principles of our system:

Actual Engine Behaviour
          ↓
          │
          ├──── Compare ────┐
          │                 │
          ▼                 ▼
Measured State       Expected State
                          ↑
                          │
                    Digital Twin

Then:

Residual =
Actual − Expected

Example:

Expected EGT = 680°C
Actual EGT   = 720°C

Residual = +40°C

This residual becomes useful for anomaly detection.

14. AI/ML Data Flow

AI/ML receives:

Processed Sensor Data
+
Digital Twin State
+
Residuals
+
Historical Data
+
Operating Context

Then:

Features
   ↓
ML Model
   ↓
Anomaly Score
   ↓
Fault Probability
   ↓
Degradation
   ↓
RUL
15. Health Engine Data Flow

M05 receives:

Sensor Data
+
Digital Twin State
+
AI Results

Then calculates:

Subsystem Health
       ↓
Overall Engine Health
       ↓
Health Index

Example:

Combustion Health      91%
Lubrication Health     82%
Fuel System Health     74%
Electrical Health      95%
Mechanical Health      88%

Overall:

ENGINE HEALTH = 86%
16. Fault Event Flow

When abnormality is detected:

Sensor / Twin
      ↓
Anomaly Detection
      ↓
Fault Assessment
      ↓
Fault Event
      ↓
Severity
      ↓
Maintenance Engine
      ↓
Dashboard Alert

Example:

Fuel Pressure ↓
      +
Fuel Flow ↓
      ↓
Anomaly
      ↓
Possible Fuel-System Fault
      ↓
Severity: HIGH
17. Database Flow

Database receives information from multiple modules.

                    ┌─────────────┐
                    │  Telemetry  │
                    └──────┬──────┘
                           │
┌──────────────┐           │
│ Digital Twin │───────────┤
└──────────────┘           │
                           ▼
┌──────────────┐     ┌─────────────┐
│ AI / ML      │────►│  DATABASE   │
└──────────────┘     └──────┬──────┘
                            │
┌──────────────┐            │
│ Fault Events │────────────┤
└──────────────┘            │
                            ▼
                     Historical Data

Stored information:

Telemetry
Health
Fault events
AI predictions
RUL
Mission data
Replay data
18. Dashboard Data Flow

Dashboard should not directly communicate with sensors.

Correct:

Sensors
  ↓
Data Pipeline
  ↓
Digital Twin / Backend
  ↓
Dashboard API
  ↓
Dashboard

This keeps the architecture secure and modular.

Dashboard receives:

Current State
Health
Alerts
Trends
AI Results
RUL
Mission State
19. Mission Replay Flow

Historical data:

Database
   ↓
Replay Engine
   ↓
Original Timestamp Sequence
   ↓
Data Processing
   ↓
Digital Twin
   ↓
AI/ML
   ↓
Dashboard

This allows us to reproduce previous missions.

20. Simulation Flow

For simulated engine operation:

Mission Scenario
      ↓
Environment Model
      ↓
Engine Model
      ↓
Synthetic Sensor Data
      ↓
Same Data Pipeline
      ↓
Digital Twin
      ↓
AI / Health / Dashboard

Important architectural principle:

Real engine data and simulated engine data should enter the system through the same logical data pipeline.

This will make our prototype much easier to test.

21. Complete End-to-End Flow
┌─────────────────────────┐
│ Physical Engine /       │
│ Engine Simulator        │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ Sensors / ECU / FADEC   │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ CAN / Telemetry         │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ M01 Data Acquisition    │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ M02 Validation          │
│ + Preprocessing         │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ M03 Sensor Fusion       │
│ + Feature Extraction    │
└────────────┬────────────┘
             │
             ▼
╔═════════════════════════╗
║ M04 DIGITAL TWIN CORE  ║
╚════════════╤════════════╝
             │
      ┌──────┼────────┐
      ▼      ▼        ▼
     M05    M06      M07
   Health   AI/ML   Simulation
      │      │        │
      └──────┼────────┘
             ▼
        M08 RUL /
        Maintenance
             │
      ┌──────┴──────┐
      ▼             ▼
    M09           M10
  Database      Dashboard
22. Real-Time vs Historical Data

Architecture mein dono paths rahenge:

Real-Time
Engine
 ↓
Telemetry
 ↓
Processing
 ↓
Digital Twin
 ↓
Dashboard
Historical
Database
 ↓
Replay / Analytics
 ↓
Digital Twin
 ↓
AI/ML
 ↓
Reports
23. Data Flow Design Principles

Our architecture will follow these principles:

Modular data pipeline
Real-time capable
Timestamp synchronized
Unit normalized
Quality-aware
Traceable
Scalable
Simulation compatible
Hardware-independent where possible
AI/ML-ready