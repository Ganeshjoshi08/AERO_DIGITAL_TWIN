1. Objective

The system shall continuously assess the health condition of the aero-piston engine and its major subsystems using validated telemetry, Digital Twin state information, operating conditions, historical trends, and diagnostic indicators.

The system shall provide both subsystem-level health assessment and an overall engine health assessment.

2. Scope

FR-05 covers:

Engine health assessment
Subsystem health assessment
Thermal health
Lubrication health
Fuel and combustion health
Mechanical/vibration health
Electrical health
Operating-condition awareness
Health indicators
Overall Engine Health Index
Subsystem health scores
Health trends
Degradation detection
Confidence/uncertainty
Health history
Interfaces with fault prediction, RUL and maintenance

The architecture follows the principle of separating current health assessment from later prognostic prediction and advisory functions.

3. Engine Health Assessment Architecture

The Health Monitoring module shall combine information from multiple sources rather than relying on a single sensor.

Processed Telemetry
        +
Digital Twin State
        +
Operating Condition
        +
Historical Health
        +
Anomaly Indicators
        ↓
   HEALTH ASSESSMENT
        ↓
┌────────┼────────┐
↓        ↓        ↓
Subsystem Health  Overall Health
        ↓
 Degradation State

This multi-source approach is important because aircraft-engine health monitoring can benefit from combining measurements, models and other diagnostic information.

4. Subsystem Health Assessment

The system shall independently assess the health of major engine subsystems.

The initial subsystem groups shall be:

1. Thermal
2. Lubrication
3. Fuel / Combustion
4. Mechanical / Vibration
5. Electrical

Each subsystem shall generate:

Health indicator
Current state
Trend
Abnormality information
Confidence where available

Example:

Thermal         91%
Lubrication     86%
Combustion      89%
Mechanical      82%
Electrical      95%
5. Thermal Health Assessment

The system shall assess thermal health using parameters including:

CHT
EGT
Ambient temperature
Altitude
Engine load
RPM

The assessment shall consider both current values and trends.

Example:

CHT ↑
EGT ↑
Ambient Temp ↑
        ↓
Operating-condition analysis
        ↓
Thermal Health

The system should distinguish between high temperature caused by legitimate operating conditions and temperature behaviour that indicates abnormal thermal degradation.

6. Lubrication Health Assessment

The lubrication health module shall evaluate:

Oil pressure
Oil temperature
RPM
Engine load
Historical oil behaviour

Possible indicators:

Oil Pressure ↓
Oil Temperature ↑
       ↓
Possible lubrication degradation

The system shall track both instantaneous conditions and longer-term trends.

7. Fuel & Combustion Health Assessment

The fuel/combustion health module shall consider:

Fuel flow
EGT
RPM
Throttle
Injection timing
Engine load
Relevant Digital Twin residuals

Example:

Fuel Flow ↑
     +
EGT abnormal
     +
RPM variation
     ↓
Combustion Health degradation

This subsystem will later provide important features to the fault-detection and AI/ML modules.

8. Mechanical & Vibration Health Assessment

The system shall monitor mechanical health using:

Vibration amplitude
Vibration trends
RPM
Engine load
Operating condition

The module should support detection of abnormal vibration patterns.

Example:

Vibration ↑
     +
RPM-related pattern
     ↓
Mechanical / Combustion
abnormality indicator

For the first prototype, we can begin with statistical vibration features; later, frequency-domain features can be added if suitable vibration data is available.

9. Electrical Health Assessment

The electrical health module shall monitor:

Battery voltage
Alternator output/status
Engine operating condition
Electrical trends

Example:

Battery Voltage ↓
       +
Alternator Output abnormal
       ↓
Electrical Health degradation

This information will also be useful during long-endurance mission simulation.

10. Engine Operating Condition Awareness

Health assessment shall consider the current operating state before interpreting parameter values.

Relevant operating conditions include:

Engine OFF
Starting
Idle
Cruise
High load
Rapid throttle transition
Mission phase
Altitude
Ambient temperature
Ambient pressure

Example:

EGT = 720°C

At high load → potentially normal
At low load  → potentially abnormal

Therefore, the health engine shall avoid treating every absolute value as an unhealthy condition.

11. Health Indicator Generation

The system shall generate health indicators from processed telemetry and Digital Twin information.

Possible indicators include:

Parameter deviation
Rate of change
Trend slope
Model residual
Vibration RMS
Thermal deviation
Oil-pressure deviation
Fuel-flow deviation
Sensor-quality indicators

Example:

CHT deviation       +8°C
EGT deviation       +31°C
Oil pressure        -0.3 bar
Vibration RMS       +18%

These indicators become inputs to the health-assessment logic.

12. Overall Engine Health Index

The system shall generate an overall Engine Health Index representing the current estimated condition of the engine.

Example:

        ENGINE HEALTH

             87 / 100

        CONDITION: GOOD

The index shall be derived from relevant subsystem health information rather than a single sensor.

Important: the final weighting/formula will not be arbitrarily fixed at this stage. It will be determined after parameter characterization, fault scenarios and validation.

13. Subsystem Health Scores

Each major subsystem shall have an individual health score.

Example:

THERMAL          91 / 100
LUBRICATION      85 / 100
COMBUSTION       89 / 100
MECHANICAL       78 / 100
ELECTRICAL       95 / 100

This allows the operator to identify where the health problem is occurring, instead of seeing only one overall number.

14. Health Trend Analysis

The system shall maintain health history and calculate health trends over time.

Example:

Health

100 ┤─────────
 95 ┤         ╲
 90 ┤          ╲
 85 ┤           ╲
 80 ┤            ╲
    └────────────────
          Time

Trend analysis shall support:

Gradual degradation identification
Mission comparison
Maintenance planning
RUL input generation
Post-flight analysis

Dynamic data-driven Digital Twin research has used evolving sensor information and health trends to maintain current engine health/RUL estimates.

15. Health State Classification

The system shall classify the current health condition into defined states.

Initial conceptual states:

HEALTHY
   ↓
DEGRADED
   ↓
WARNING
   ↓
CRITICAL

The exact boundaries will be established later using validated parameter limits, fault scenarios and model results.

The health state should also consider:

Severity
Persistence
Trend
Operating condition
Confidence
16. Health Degradation Detection

The system shall identify gradual deterioration even when no immediate critical fault exists.

Example:

Mission 01 → 97%
Mission 10 → 94%
Mission 20 → 91%
Mission 30 → 86%
                  ↓
          Degradation detected

Potential degradation indicators:

Increasing model residuals
Increasing vibration
Increasing fuel consumption
Decreasing oil pressure
Increasing thermal deviation
Reduced engine performance

This function forms the bridge between health monitoring and prognostics/RUL.

17. Health Confidence & Uncertainty

The system shall provide a confidence indicator where sufficient information is available.

Confidence may be reduced by:

Missing sensor data
Poor sensor quality
Large model uncertainty
Operation outside the calibrated model range
Conflicting sensor information
Insufficient historical data

Example:

ENGINE HEALTH

Health:       87 / 100
Confidence:   91%

This is important because the system should distinguish between “engine is healthy with high confidence” and “engine appears healthy but data quality is poor.”

NASA's recent Digital Twin work uses model updating and state-estimation methods to identify anomalous behaviour, reinforcing the importance of combining model state and measurements rather than relying on raw readings alone.

18. Health History & Mission Association

Health information shall be associated with:

Mission ID
Engine ID
Timestamp
Mission phase
Operating condition
Health state
Subsystem health
Detected anomalies

Example:

Mission M001
│
├── Cruise
│   └── Health = 94%
│
├── High Altitude
│   └── Health = 91%
│
├── High Load
│   └── Health = 86%
│
└── Landing
    └── Health = 88%

This will allow comparison between different missions and operating conditions.

19. Interface with Fault Prediction, RUL & Maintenance

Health Monitoring shall provide outputs to the downstream intelligence modules.

             HEALTH MONITORING
                    │
       ┌────────────┼────────────┐
       ↓            ↓            ↓
   Fault Engine    RUL       Maintenance
       │            │            │
       ↓            ↓            ↓
 Diagnosis      Future       Recommended
                Health         Action

The health module provides the current condition.

The RUL/prognostic module will estimate the future condition.

The maintenance/advisory module will convert these results into actionable recommendations.

This separation is consistent with the ISO 13374 architecture, which distinguishes health assessment, prognostic assessment and advisory generation.

20. Acceptance Criteria

FR-05 shall be considered complete when:

 Engine health can be assessed using multiple parameters.
 Thermal health assessment is available.
 Lubrication health assessment is available.
 Fuel/combustion health assessment is available.
 Mechanical/vibration health assessment is available.
 Electrical health assessment is available.
 Operating condition is considered during health assessment.
 Health indicators can be generated.
 Overall Engine Health Index is available.
 Individual subsystem health scores are available.
 Health trends can be calculated.
 Health states can be classified.
 Gradual degradation can be identified.
 Health confidence/uncertainty can be represented.
 Health history is associated with missions.
 Health outputs are available to fault prediction.
 Health outputs are available to RUL/prognostic models.
 Health outputs are available to maintenance advisory.
 Raw and processed evidence supporting the health assessment can be traced.

                  PROCESSED DATA
                       │
                       ▼
             DIGITAL TWIN STATE
                       │
                       ▼
              OPERATING CONDITION
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
     THERMAL       LUBRICATION     COMBUSTION
        │              │              │
        ▼              ▼              ▼
     HEALTH          HEALTH          HEALTH
     SCORE           SCORE           SCORE
        │              │              │
        └──────────────┼──────────────┘
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
       VIBRATION             ELECTRICAL
         HEALTH                HEALTH
             │                   │
             └─────────┬─────────┘
                       ▼
               ENGINE HEALTH INDEX
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
       HEALTH       DEGRADATION   FAULT/RUL
       STATUS         TREND        MODULES