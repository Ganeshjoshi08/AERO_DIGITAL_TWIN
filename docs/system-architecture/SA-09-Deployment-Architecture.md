SA-09 — Deployment Architecture
1. Purpose

The Deployment Architecture defines how the Digital Twin system will be deployed across:

Engine/UAV side
Edge computing platform
Communication/telemetry layer
Ground Control Station (GCS)
Local server
Database
AI/ML services
Dashboard
Optional cloud infrastructure

The architecture shall support both prototype development and future UAV deployment.

2. Deployment Strategy

We will design the project in three deployment levels:

LEVEL 1
Development Prototype
        ↓
LEVEL 2
Ground / Test-Rig Deployment
        ↓
LEVEL 3
Future UAV + GCS Deployment

This is important because we don't want to build software that works only on our laptop.

3. Level 1 — Development Prototype

Initially, everything can run on one development machine.

┌─────────────────────────────────────────┐
│           DEVELOPMENT PC                │
│                                         │
│ ┌────────────┐    ┌──────────────────┐ │
│ │ Simulator  │───►│ Data Acquisition │ │
│ └────────────┘    └────────┬─────────┘ │
│                            ▼            │
│                   ┌─────────────────┐  │
│                   │ Data Processing  │  │
│                   └────────┬────────┘  │
│                            ▼            │
│                   ┌─────────────────┐  │
│                   │ Digital Twin    │  │
│                   └────────┬────────┘  │
│                            ▼            │
│                   ┌─────────────────┐  │
│                   │ AI / ML         │  │
│                   └────────┬────────┘  │
│                            ▼            │
│                   ┌─────────────────┐  │
│                   │ Database        │  │
│                   └────────┬────────┘  │
│                            ▼            │
│                   ┌─────────────────┐  │
│                   │ Dashboard       │  │
│                   └─────────────────┘  │
└─────────────────────────────────────────┘
Purpose

This is where we will develop and demonstrate the complete software prototype.

4. Level 1 Benefits

Single-machine deployment gives us:

Easy development
Easy debugging
No hardware dependency
Faster iteration
Simple demonstration
Reproducible testing

We can simulate:

Engine
↓
CAN
↓
Telemetry
↓
Digital Twin
↓
AI
↓
Dashboard

on one PC.

5. Level 2 — Test-Rig / Ground Deployment

Once the prototype works:

              TEST ENGINE
                   │
                   ▼
              ECU / CAN
                   │
                   ▼
            ┌──────────────┐
            │ EDGE COMPUTER│
            └──────┬───────┘
                   │
              Local Network
                   │
          ┌────────▼────────┐
          │ GROUND COMPUTER │
          │ / GCS           │
          └────────┬────────┘
                   │
       ┌───────────┼───────────┐
       ▼           ▼           ▼
    Digital      AI/ML     Dashboard
     Twin
       │
       ▼
    Database

This gives us a realistic test environment without requiring actual UAV deployment.

6. Level 3 — Future UAV + GCS Deployment

This is our target architecture.

                     UAV
┌───────────────────────────────────────────┐
│                                           │
│       AERO PISTON ENGINE                  │
│               │                           │
│          Sensors / ECU                    │
│               │                           │
│              CAN                          │
│               │                           │
│       ┌───────▼────────┐                  │
│       │ EDGE COMPUTER  │                  │
│       │                │                  │
│       │ CAN Interface  │                  │
│       │ Data Processing│                  │
│       │ Basic AI       │                  │
│       └───────┬────────┘                  │
│               │                           │
│           Telemetry                       │
└───────────────┼───────────────────────────┘
                │
                │ Communication Link
                ▼
┌───────────────────────────────────────────┐
│           GROUND CONTROL STATION          │
│                                           │
│  ┌─────────────┐    ┌──────────────────┐ │
│  │ Data Gateway│───►│ Digital Twin     │ │
│  └─────────────┘    └────────┬─────────┘ │
│                              ▼            │
│                       ┌───────────────┐   │
│                       │ AI / ML       │   │
│                       └───────┬───────┘   │
│                               ▼           │
│                       ┌───────────────┐   │
│                       │ Database      │   │
│                       └───────┬───────┘   │
│                               ▼           │
│                       ┌───────────────┐   │
│                       │ Dashboard     │   │
│                       └───────────────┘   │
└───────────────────────────────────────────┘
7. Edge Computing Layer

Edge computing is important because the UAV cannot depend completely on the ground connection.

Edge system can perform:

CAN Acquisition
      ↓
Validation
      ↓
Filtering
      ↓
Feature Extraction
      ↓
Critical Anomaly Detection
      ↓
Telemetry Preparation

Potential future functions:

Lightweight AI
Sensor health monitoring
Local event detection
Data buffering
Communication-loss handling
8. Why Edge Processing?

Suppose the telemetry connection is temporarily lost:

UAV
 │
 │ ✕ Communication Lost
 ▼
Ground

The engine monitoring system should not simply stop.

Instead:

UAV Edge Computer
       ↓
Continue Monitoring
       ↓
Store Critical Events
       ↓
Buffer Data
       ↓
Communication Restored
       ↓
Synchronize

This improves resilience.

9. Ground Control Station

The GCS will be the primary location for the full Digital Twin in our target architecture.

It can host:

Digital Twin Core
AI/ML
Database
Mission Replay
Simulation
Dashboard
Reporting

For a future defence-grade system, these components could be distributed across multiple machines rather than one GCS computer.

10. Backend Server

Backend acts as the central application layer.

Edge / Telemetry
       ↓
Data Gateway
       ↓
Backend
       ├── Digital Twin
       ├── AI/ML
       ├── Database
       └── API

Responsibilities:

Data routing
Authentication
API
Real-time communication
Processing orchestration
Event management
11. Database Deployment

Initially:

Development PC
     │
     └── PostgreSQL

Later:

GCS / Local Server
        │
        └── PostgreSQL

Future larger deployment:

Database Server
       │
 ┌─────┼─────┐
 ▼     ▼     ▼
Engine Mission Analytics
Data    Data
12. AI/ML Deployment

We should support two AI execution locations.

Ground AI

Heavy models:

Training
RUL
Complex Models
Historical Analytics
Large-scale Processing
Edge AI

Lightweight models:

Critical Anomaly Detection
Sensor Fault Detection
Fast Inference

Architecture:

                 AI/ML
                  │
          ┌───────┴────────┐
          ▼                ▼
      EDGE AI          GROUND AI
     Lightweight        Advanced
13. Model Training vs Inference

This distinction is important.

Training
Historical Data
      ↓
Training Server
      ↓
Model
      ↓
Validation
      ↓
Model Registry
Inference
Live Data
   ↓
Trained Model
   ↓
Prediction

The training environment doesn't need to run continuously during a mission.

14. Containerized Deployment

For our software prototype, we should design the modules so they can eventually be deployed independently.

Concept:

┌─────────────────────────────────┐
│           HOST MACHINE          │
│                                 │
│ ┌─────────┐ ┌─────────────────┐ │
│ │ Backend │ │ Digital Twin    │ │
│ └─────────┘ └─────────────────┘ │
│                                 │
│ ┌─────────┐ ┌─────────────────┐ │
│ │ AI/ML   │ │ PostgreSQL      │ │
│ └─────────┘ └─────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Dashboard                   │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘

Later these services can be moved to separate machines.

15. Prototype Deployment

Our first actual implementation should look like:

                DEVELOPMENT PC
┌──────────────────────────────────────────┐
│                                          │
│  Engine Simulator                        │
│        ↓                                 │
│  Virtual CAN / Data Input                │
│        ↓                                 │
│  Data Acquisition                        │
│        ↓                                 │
│  Backend                                 │
│        ↓                                 │
│  Digital Twin                            │
│        ↓                                 │
│  AI/ML                                   │
│        ↓                                 │
│  PostgreSQL                              │
│        ↓                                 │
│  Dashboard                               │
│                                          │
└──────────────────────────────────────────┘

This is what we should target first.

16. Prototype → Real Engine Migration

Our architecture should allow:

SIMULATOR
    │
    ▼
Virtual CAN
    │
    ▼
Data Acquisition

to become:

REAL ENGINE
    │
    ▼
ECU / FADEC
    │
    ▼
Physical CAN
    │
    ▼
CAN Interface
    │
    ▼
Data Acquisition

The downstream architecture remains largely unchanged.

This is a major design principle.

17. Communication Architecture

Conceptually:

ENGINE
  │
 CAN
  ▼
EDGE
  │
Telemetry
  ▼
GCS
  │
Internal Network
  ▼
Backend
  │
 ┌┴──────────────┐
 ▼               ▼
Database       Dashboard
18. Communication Loss Handling

If communication fails:

UAV Edge
   │
   │ X
   ▼
GCS

Edge should:

Continue acquisition
Continue local health checks
Buffer data
Record communication event
Resume synchronization when link returns

Concept:

Live Data
   ↓
Local Buffer
   ↓
Communication Restored
   ↓
Data Synchronization
19. Local vs Cloud

For the prototype, cloud is not mandatory.

Recommended:

Engine
 ↓
Edge
 ↓
Local GCS
 ↓
Local Database
 ↓
Dashboard

This is better for our initial demonstration because:

Lower complexity
No internet dependency
Easier testing
Better control of data
Easier offline demo

Cloud can be an optional future deployment.

20. Optional Cloud Architecture

Future fleet-level system:

UAV Fleet
   │
   ▼
Ground Systems
   │
   ▼
Secure Gateway
   │
   ▼
Cloud / Data Center
   │
   ├── Fleet Database
   ├── AI Training
   ├── Analytics
   ├── Model Management
   └── Fleet Digital Twins
21. Fleet-Level Expansion

Eventually:

                 FLEET
                   │
       ┌───────────┼───────────┐
       ▼           ▼           ▼
      UAV-01      UAV-02      UAV-03
       │           │           │
      Edge        Edge        Edge
       │           │           │
       └───────────┼───────────┘
                   ▼
              GROUND SYSTEM
                   │
                   ▼
             FLEET ANALYTICS

This is useful for identifying common failure patterns across engines.

22. Deployment Environments

We should define four environments:

Development
     ↓
Testing
     ↓
Demonstration
     ↓
Production / Field
Development

Developer machine.

Testing

Controlled test environment.

Demonstration

Stable prototype used for presentation.

Production/Field

Future UAV/GCS deployment.

23. Configuration Management

Environment-specific settings should not be hard-coded.

Example:

Development
CAN = virtual
Database = local

Testing
CAN = test interface
Database = test DB

Field
CAN = physical
Database = GCS DB

This makes deployment safer and easier.

24. Monitoring the System Itself

We should monitor not only the engine but also the software infrastructure.

System health:

CAN Interface
Backend
Database
AI Service
Digital Twin
Telemetry Link
Dashboard

Example:

SYSTEM STATUS

CAN Interface       ● OK
Data Pipeline       ● OK
Digital Twin        ● OK
AI Service           ● OK
Database             ● OK
Telemetry Link       ● OK
Dashboard            ● OK

This is system health, different from engine health.

25. Deployment Security Boundary

High-level security zones:

┌───────────────┐
│ ENGINE / UAV  │
└───────┬───────┘
        │
   Secure Link
        │
        ▼
┌───────────────┐
│ GCS / EDGE    │
└───────┬───────┘
        │
   Protected LAN
        │
        ▼
┌───────────────┐
│ Backend / DB  │
└───────────────┘

Detailed security will be handled in SA-10.

26. Recommended Prototype Deployment

For our actual project, I recommend this initial structure:

                    YOUR PC
┌───────────────────────────────────────────┐
│                                           │
│  ┌──────────────────┐                     │
│  │ Engine Simulator │                     │
│  └────────┬─────────┘                     │
│           ▼                               │
│  ┌──────────────────┐                     │
│  │ Virtual CAN      │                     │
│  └────────┬─────────┘                     │
│           ▼                               │
│  ┌──────────────────┐                     │
│  │ Data Acquisition │                     │
│  └────────┬─────────┘                     │
│           ▼                               │
│  ┌──────────────────┐                     │
│  │ Data Processing  │                     │
│  └────────┬─────────┘                     │
│           ▼                               │
│  ┌──────────────────┐                     │
│  │ Digital Twin     │                     │
│  └────────┬─────────┘                     │
│           ▼                               │
│  ┌──────────────────┐                     │
│  │ AI/ML            │                     │
│  └────────┬─────────┘                     │
│           ▼                               │
│  ┌──────────────────┐                     │
│  │ PostgreSQL       │                     │
│  └────────┬─────────┘                     │
│           ▼                               │
│  ┌──────────────────┐                     │
│  │ Dashboard        │                     │
│  └──────────────────┘                     │
│                                           │
└───────────────────────────────────────────┘

This is our first implementation target.

Then later:

PC
 ↓
Edge Computer + GCS
 ↓
Real CAN
 ↓
Real/Test Engine
27. Deployment Principles

Our architecture will follow:

Modular deployment
Hardware independence
Edge capability
Offline capability
Scalable services
Real-time processing
Data buffering
Environment-specific configuration
Secure communication
Future fleet scalability
28. Complete Deployment Architecture
                         ┌───────────────────┐
                         │   AERO ENGINE     │
                         │ Sensors + ECU     │
                         └─────────┬─────────┘
                                   │
                                  CAN
                                   │
                                   ▼
                         ┌───────────────────┐
                         │   EDGE COMPUTER   │
                         │                   │
                         │ Data Acquisition  │
                         │ Preprocessing     │
                         │ Local Monitoring  │
                         │ Buffering         │
                         │ Optional Edge AI  │
                         └─────────┬─────────┘
                                   │
                              TELEMETRY
                                   │
                                   ▼
                 ╔════════════════════════════════╗
                 ║       GROUND CONTROL           ║
                 ║                                ║
                 ║  ┌──────────────────────────┐  ║
                 ║  │ Data Gateway             │  ║
                 ║  └────────────┬─────────────┘  ║
                 ║               ▼                ║
                 ║  ┌──────────────────────────┐  ║
                 ║  │ Digital Twin             │  ║
                 ║  └────────────┬─────────────┘  ║
                 ║               ▼                ║
                 ║  ┌──────────────────────────┐  ║
                 ║  │ AI / ML                  │  ║
                 ║  └────────────┬─────────────┘  ║
                 ║               ▼                ║
                 ║  ┌──────────────────────────┐  ║
                 ║  │ Database                 │  ║
                 ║  └────────────┬─────────────┘  ║
                 ║               ▼                ║
                 ║  ┌──────────────────────────┐  ║
                 ║  │ Dashboard / HMI          │  ║
                 ║  └──────────────────────────┘  ║
                 ╚════════════════════════════════╝
                                   │
                                   ▼
                            Optional Cloud