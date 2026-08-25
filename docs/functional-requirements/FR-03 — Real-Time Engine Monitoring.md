1. Objective

System shall continuously monitor processed engine telemetry and provide a real-time representation of engine operating condition, health status, trends, and abnormal conditions.

2. Scope

FR-03 covers:

Real-time parameter monitoring
Engine status display
Subsystem health monitoring
Trend visualization
Abnormal-condition indication
Alert generation
Severity classification
Health index display
Engine operating-state identification
Data freshness indication
Operator dashboard interface
Historical comparison
3. Real-Time Parameter Monitoring

System shall continuously display the required engine parameters:

RPM
CHT
EGT
Oil Pressure
Oil Temperature
Fuel Flow
Vibration
Battery Voltage
Alternator Status/Output
Injection Timing
Throttle Position
Engine Load
Altitude
Ambient Temperature
Ambient Pressure
4. Engine Operating Status

System shall determine and display the current engine operating state.

Example states:

OFF
STARTING
IDLE
CRUISE
HIGH LOAD
TRANSIENT
WARNING
CRITICAL

Operating-state classification will later help the Digital Twin and AI models interpret sensor values according to the current engine condition.

5. Subsystem Health Monitoring

The dashboard shall provide separate health information for major subsystems:

THERMAL
LUBRICATION
FUEL / COMBUSTION
MECHANICAL / VIBRATION
ELECTRICAL

Example:

Thermal          91%
Lubrication      87%
Combustion       94%
Vibration        82%
Electrical       96%
6. Real-Time Trend Visualization

System shall display time-series trends for important parameters.

Example:

EGT
750°C ┤                 ╭──
700°C ┤───────────────╯
650°C ┤
      └────────────────────
             TIME

The system should allow the user to inspect:

Current value
Previous values
Rate of change
Minimum/maximum
Trend direction

Technical displays with trends and abnormality zones are specifically identified as useful for condition analysis in ISO 13374 guidance.

7. Alert Generation

System shall generate alerts when abnormal engine conditions are detected.

Example:

⚠ WARNING

CHT increasing rapidly

Current: 188°C
Trend: Increasing
Severity: MEDIUM

Alerts should be generated from validated/processed data and later can incorporate Digital Twin and AI predictions.

8. Alert Severity Classification

Alerts shall have severity levels.

INFO
  ↓
WARNING
  ↓
CRITICAL

Example:

Level	Meaning
INFO	Informational condition
WARNING	Abnormal condition requiring attention
CRITICAL	Severe condition requiring immediate attention

The exact numerical thresholds will be defined later in the Engine Parameter Specification, rather than assuming them here.

9. Engine Health Index

System shall display an overall engine health indicator.

Example:

ENGINE HEALTH

       87%
      GOOD

Thermal       91%
Lubrication   85%
Combustion    90%
Vibration     79%
Electrical    94%

The Health Index will eventually combine information from FR-02 processed data, Digital Twin state, fault diagnostics and AI/ML outputs.

10. Data Freshness & Communication Status

Dashboard shall indicate whether incoming telemetry is current.

Example:

DATA LINK

● LIVE
Last Update: 120 ms ago

If data stops arriving:

⚠ DATA STALE

Last Update:
4.2 seconds ago

This prevents the operator from assuming that an old sensor value is a current engine condition.

11. Operator Visualization

The dashboard shall present information in a form suitable for:

UAV operator
Propulsion engineer
Maintenance engineer

The interface should provide:

MISSION OVERVIEW
       ↓
ENGINE STATUS
       ↓
LIVE PARAMETERS
       ↓
HEALTH
       ↓
ALERTS
       ↓
TRENDS

The presentation architecture should support both technical analysis and decision support, consistent with the role of presentation in ISO 13374-4.

12. Acceptance Criteria

FR-03 shall be considered complete when:

 Required engine parameters are displayed in real time.
 Current engine operating state is displayed.
 Major subsystem health status is available.
 Real-time trends can be visualized.
 Abnormal conditions generate alerts.
 Alerts have severity levels.
 Overall Engine Health Index is displayed.
 Data freshness/communication status is visible.
 Dashboard supports operator and engineering views.
 Historical values can be compared with current values.
 Dashboard receives only validated/processed data from FR-02.