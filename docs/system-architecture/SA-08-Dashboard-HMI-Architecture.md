SA-08 — Dashboard / HMI Architecture
1. Purpose

Dashboard/HMI shall provide a centralized interface for:

Real-time engine monitoring
Engine health visualization
Fault alerts
AI/ML predictions
RUL display
Maintenance recommendations
Mission monitoring
Mission replay
Historical trends
Simulation results
Reports
2. User Types

System mein initially 3 primary user roles rahenge:

                 DASHBOARD
                     │
       ┌─────────────┼─────────────┐
       ▼             ▼             ▼
   OPERATOR       ENGINEER      MAINTENANCE
Operator

Focus:

Current engine status
Critical alerts
Mission status
Key parameters
Propulsion Engineer

Focus:

Detailed parameters
Digital Twin state
Trends
Residuals
AI diagnostics
Simulation
Maintenance Engineer

Focus:

Fault history
Degradation
RUL
Maintenance recommendations
Maintenance history
3. Dashboard Architecture
                  BACKEND / API
                       │
          ┌────────────┼────────────┐
          │            │            │
          ▼            ▼            ▼
     Live Data      Analytics     History
          │            │            │
          └────────────┼────────────┘
                       ▼
               DASHBOARD FRONTEND
                       │
      ┌────────────────┼────────────────┐
      ▼                ▼                ▼
   Operator         Engineer        Maintenance
     View             View             View
4. Main Dashboard Screens

We will initially define 8 screens:

ID	Screen	Purpose
UI-01	Overview	Overall engine status
UI-02	Live Monitoring	Real-time parameters
UI-03	Digital Twin	Virtual engine state
UI-04	Fault & Alerts	Abnormalities
UI-05	AI / Prediction	AI results + RUL
UI-06	Trends & Analytics	Historical analysis
UI-07	Mission Replay	Replay past missions
UI-08	Reports	Mission/maintenance reports
5. UI-01 — Overview Dashboard ⭐

This is the main screen.

Concept:

┌──────────────────────────────────────────────────────┐
│           AERO ENGINE DIGITAL TWIN                   │
├──────────────────────────────────────────────────────┤
│ Engine: E001        Mission: M001      ● LIVE        │
├──────────────────────────────────────────────────────┤
│                                                      │
│              ENGINE HEALTH                           │
│                                                      │
│                   86%                                │
│                NORMAL                                │
│                                                      │
├──────────────────────────────────────────────────────┤
│ RPM       CHT       EGT       OIL P       FUEL FLOW │
│ 5200      165°C     720°C      XX          XX       │
├──────────────────────────────────────────────────────┤
│ ACTIVE ALERTS                                        │
│ ⚠ Possible fuel-system abnormality                  │
├──────────────────────────────────────────────────────┤
│ RUL: 420 h       Confidence: 78%                     │
└──────────────────────────────────────────────────────┘
6. Health Indicator

Health should be represented visually.

ENGINE HEALTH

█████████████████░░░

86%
NORMAL

Possible states:

HEALTHY
NORMAL
DEGRADED
CRITICAL
UNKNOWN

Do not rely only on colors; include text/icons so the interface remains understandable in different viewing conditions.

7. UI-02 — Live Monitoring

Detailed real-time parameter screen.

┌─────────────────────────────────────────────┐
│ LIVE ENGINE MONITORING                      │
├─────────────────────────────────────────────┤
│ RPM                 5200                    │
│ CHT                 165 °C                  │
│ EGT                 720 °C                  │
│ Oil Pressure        XX                      │
│ Oil Temperature     XX °C                  │
│ Fuel Flow           XX                      │
│ Fuel Pressure       XX                      │
│ Vibration           XX                      │
│ Battery             XX V                    │
│ Alternator          ACTIVE                  │
│ Injection Timing    XX                      │
│ Throttle            XX %                    │
│ MAP                 XX kPa                  │
│ Crank Position      XX °CA                 │
└─────────────────────────────────────────────┘

Every parameter should show:

Value
Unit
Timestamp
Quality
Status

Example:

RPM
5200
VALID
Updated: 10:32:01.250
8. Parameter Quality Indicator

A value should not just display a number.

Example:

EGT
720 °C

● VALID

or:

EGT
---

⚠ STALE

Possible states:

VALID
WARNING
STALE
MISSING
INVALID
SENSOR FAULT
9. UI-03 — Digital Twin View ⭐

This is one of our unique screens.

Concept:

┌─────────────────────────────────────────────┐
│              DIGITAL TWIN                   │
├─────────────────────────────────────────────┤
│                                             │
│             VIRTUAL ENGINE                  │
│                                             │
│       ┌──────────────────────┐              │
│       │       ENGINE         │              │
│       │                      │              │
│       │  RPM     5200        │              │
│       │  LOAD    64%         │              │
│       │  STATE   CRUISE      │              │
│       └──────────────────────┘              │
│                                             │
├─────────────────────────────────────────────┤
│ ACTUAL vs EXPECTED                          │
│                                             │
│ EGT      Actual: 720   Expected: 680       │
│ CHT      Actual: 165   Expected: 158       │
│ Fuel     Actual: XX    Expected: XX        │
└─────────────────────────────────────────────┘
10. Residual Visualization

Digital Twin screen should show:

Parameter       Actual    Expected    Residual

EGT              720°C     680°C       +40°C
CHT              165°C     158°C        +7°C
Fuel Flow         XX        XX           +X
RPM              5200      5150         +50

This makes the Digital Twin's intelligence explainable.

11. UI-04 — Fault & Alert Screen

This screen manages abnormal events.

┌────────────────────────────────────────────┐
│ FAULT & ALERT CENTER                       │
├────────────────────────────────────────────┤
│ HIGH     Fuel System Abnormality           │
│          Confidence: 78%                    │
│          10:32:05                          │
├────────────────────────────────────────────┤
│ MEDIUM   EGT Trend Increasing              │
│          Confidence: 84%                    │
│          10:31:55                          │
└────────────────────────────────────────────┘

Each alert should include:

Alert ID
Time
Severity
Subsystem
Detected Parameter
Probability
Status
Recommended Action
12. Alert Lifecycle
Detection
   ↓
Alert Generated
   ↓
Severity Assigned
   ↓
Displayed
   ↓
Acknowledged
   ↓
Investigated
   ↓
Resolved

Statuses:

ACTIVE
ACKNOWLEDGED
UNDER INVESTIGATION
RESOLVED
13. UI-05 — AI / Prediction

This screen displays AI intelligence.

┌────────────────────────────────────────────┐
│ AI PREDICTIVE ANALYTICS                    │
├────────────────────────────────────────────┤
│ ANOMALY SCORE                              │
│                                            │
│ 0.87                                       │
│                                            │
├────────────────────────────────────────────┤
│ POSSIBLE FAULT                             │
│                                            │
│ Injector Abnormality        72%             │
│ Combustion Instability      18%             │
│ Sensor Issue                 7%             │
├────────────────────────────────────────────┤
│ HEALTH TREND                               │
│ 95 ───────╲                                │
│ 90         ╲                               │
│ 85          ╲                              │
└────────────────────────────────────────────┘
14. Explainable AI Display

Instead of just:

Injector Abnormality = 72%

show:

WHY?

• Fuel pressure deviation
• Fuel-flow trend abnormal
• EGT residual increased
• RPM fluctuation detected

This is important for engineer trust.

15. RUL Display

RUL should include uncertainty.

┌──────────────────────────────┐
│ REMAINING USEFUL LIFE        │
├──────────────────────────────┤
│                              │
│        ~420 HOURS            │
│                              │
│ Confidence: 78%              │
│ Estimated Range:             │
│ 350 – 500 hours              │
│                              │
└──────────────────────────────┘

Never represent an ML RUL estimate as an exact guaranteed lifetime.

16. UI-06 — Trends & Analytics

Historical parameters can be plotted.

Example:

EGT Trend

750 ┤              ╭──
700 ┤──────────────╯
650 ┤
600 ┤
    └──────────────────── Time

Available trends:

RPM
CHT
EGT
Oil Pressure
Oil Temperature
Fuel Flow
Fuel Pressure
Vibration
Health Index
RUL
Fault probability
17. Multi-Parameter Correlation

Engineer view should allow selecting multiple parameters.

Example:

EGT
   +
Fuel Flow
   +
RPM
   +
Throttle

This helps determine whether an abnormal value is:

Operating-condition related
Sensor-related
Engine-related
18. UI-07 — Mission Replay

This directly satisfies the problem statement.

┌────────────────────────────────────────────┐
│ MISSION REPLAY                             │
├────────────────────────────────────────────┤
│ Mission: M001                              │
│ Date: XXXXX                                │
│ Duration: XX                               │
├────────────────────────────────────────────┤
│ ▶ Play    ⏸ Pause    ⏩ Speed              │
│                                            │
│ ───────────●────────────────────           │
│            ↑                               │
│          42:15                             │
├────────────────────────────────────────────┤
│ Engine Health: 82%                         │
│ RPM: 5100                                  │
│ EGT: 710°C                                 │
│ Alert: Fuel System                         │
└────────────────────────────────────────────┘

User can move along the timeline and see engine state at that moment.

19. UI-08 — Reports

Reports should include:

Mission Report
Mission Summary
Engine Performance
Health Trend
Fault Events
AI Predictions
RUL
Environmental Conditions
Maintenance Report
Detected Faults
Severity
Recommended Action
Maintenance History
Post-maintenance Health
20. Dashboard Data Flow

Dashboard should consume processed backend data.

DATABASE
   │
   ▼
BACKEND / API
   │
   ├── Live Telemetry
   ├── Engine State
   ├── Health
   ├── AI Results
   ├── Faults
   ├── RUL
   └── Mission Data
   │
   ▼
DASHBOARD

Dashboard should not directly query the CAN bus.

21. Real-Time Update Architecture
Engine
  ↓
CAN
  ↓
Data Pipeline
  ↓
Digital Twin
  ↓
Health / AI
  ↓
Real-Time API
  ↓
Dashboard

For the prototype, the frontend can receive live updates through an appropriate real-time mechanism such as WebSocket/SSE.

We will decide the exact implementation in the technology/deployment phase.

22. Dashboard Navigation

Recommended structure:

DASHBOARD
│
├── Overview
│
├── Live Monitoring
│
├── Digital Twin
│
├── Faults & Alerts
│
├── AI Predictions
│
├── Trends & Analytics
│
├── Mission Replay
│
├── Simulation
│
├── Maintenance
│
└── Reports
23. Simulation Screen

Although UI-08 is reports, simulation deserves its own dashboard section.

SIMULATION
│
├── Mission Profile
├── Altitude
├── Ambient Temperature
├── Throttle Profile
├── Duration
├── Engine Condition
└── Run Simulation

Output:

Predicted RPM
Predicted EGT
Predicted CHT
Fuel Flow
Health
Fault Probability
24. User Role Permissions

Conceptual permissions:

Feature	Operator	Engineer	Maintenance
Live Monitoring	✅	✅	✅
Overview	✅	✅	✅
Digital Twin	Basic	Full	Basic
Faults	✅	✅	✅
AI Results	Basic	Full	Full
RUL	View	Full	Full
Simulation	❌/Limited	✅	Limited
Mission Replay	View	✅	✅
Maintenance	View	View	Full
Reports	View	Full	Full

Exact authorization will be finalized in SA-10 Security Architecture.

25. Dashboard Design Principles

Our UI should follow:

Simple first-level overview
Detailed engineering information on demand
Real-time status visibility
Clear alert hierarchy
Explainable AI
Traceable data
Minimal operator workload
No dependence on color alone
Responsive visualization
Role-based views
26. Dashboard Technology Boundary

We should keep the architecture technology-independent for now.

Concept:

              FRONTEND
                 │
             REST/API
                 │
          REAL-TIME CHANNEL
                 │
              BACKEND
                 │
      ┌──────────┼──────────┐
      ▼          ▼          ▼
   Digital      AI/ML    Database
    Twin

Later we'll select the exact stack.

27. Complete Dashboard Architecture
                 ┌───────────────────────┐
                 │   ENGINE / TELEMETRY  │
                 └───────────┬───────────┘
                             ▼
                    ┌─────────────────┐
                    │ DATA PROCESSING │
                    └────────┬────────┘
                             ▼
                  ┌─────────────────────┐
                  │ DIGITAL TWIN + AI   │
                  └──────────┬──────────┘
                             ▼
                     ┌───────────────┐
                     │ BACKEND / API │
                     └───────┬───────┘
                             ▼
                 ╔══════════════════════╗
                 ║      DASHBOARD       ║
                 ╠══════════════════════╣
                 ║ Overview             ║
                 ║ Live Monitoring      ║
                 ║ Digital Twin         ║
                 ║ Faults & Alerts      ║
                 ║ AI Predictions      ║
                 ║ Trends               ║
                 ║ Mission Replay       ║
                 ║ Simulation            ║
                 ║ Maintenance          ║
                 ║ Reports              ║
                 ╚══════════════════════╝