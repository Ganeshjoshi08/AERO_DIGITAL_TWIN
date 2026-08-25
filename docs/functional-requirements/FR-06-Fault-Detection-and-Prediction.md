1. Objective

The system shall detect, identify, classify, and predict abnormal engine conditions and probable faults using processed telemetry, Digital Twin residuals, health indicators, operating conditions, historical information, and AI/ML techniques.

The system shall move beyond purely reactive threshold-based monitoring toward early and intelligent fault detection.

2. Scope

FR-06 covers detection and prediction of:

Misfire
Injector abnormality
Lubrication issues
Cooling degradation
Overheating
Combustion instability
Abnormal vibration
Sensor drift/failure
Other abnormal engine behaviour identified through the Digital Twin

The module shall support both model-based and data-driven diagnostic approaches.

ISO 13374's condition-monitoring architecture separates state detection, health assessment, prognostic assessment and advisory functions, providing a useful architectural basis for this separation.

3. Fault Detection Architecture
              PROCESSED TELEMETRY
                      +
               DIGITAL TWIN
                      +
                HEALTH DATA
                      +
              HISTORICAL DATA
                      ↓
             FAULT DETECTION
                      ↓
          ┌───────────┼───────────┐
          ↓           ↓           ↓
       Anomaly      Fault       Sensor
       Detection   Diagnosis     Fault
          │           │           │
          └───────────┼───────────┘
                      ↓
               FAULT PREDICTION
                      ↓
            Severity + Confidence
                      ↓
                Dashboard
4. Fault Categories

The system shall initially support the following fault categories:

Category	Example
Combustion	Misfire, unstable combustion
Fuel system	Injector abnormality
Lubrication	Low oil pressure
Thermal	Overheating/cooling degradation
Mechanical	Abnormal vibration
Sensor	Drift, stuck sensor, dropout
Performance	Unexpected engine performance degradation

The architecture shall remain extensible for additional fault classes.

5. Misfire Detection

The system shall detect probable misfire conditions by correlating multiple parameters rather than relying on a single threshold.

Potential indicators:

RPM fluctuation
     +
EGT deviation
     +
Vibration pattern
     +
Fuel-flow behaviour
     ↓
Misfire Detection

The system shall generate:

Misfire indication
Severity
Confidence
Supporting parameters
Event timestamp
6. Injector Abnormality Detection

The system shall identify behaviour potentially associated with injector abnormalities.

Relevant parameters may include:

Fuel flow
EGT
RPM
Injection timing
Throttle
Engine load

Example:

Fuel Flow abnormal
       +
EGT deviation
       +
Injection Timing deviation
       ↓
Possible Injector Abnormality

The final diagnosis shall be based on multi-parameter evidence rather than one measurement.

7. Lubrication Fault Detection

The system shall detect probable lubrication problems using:

Oil pressure
Oil temperature
RPM
Engine load
Historical oil behaviour
Digital Twin residuals

Example:

Oil Pressure ↓
Oil Temperature ↑
      +
Persistent deviation
      ↓
Possible Lubrication Fault
8. Cooling & Overheating Detection

The system shall identify abnormal thermal behaviour.

Relevant parameters:

CHT
EGT
Ambient temperature
Altitude
Engine load
RPM
Thermal Digital Twin state

The system shall distinguish:

Expected high temperature due to operating conditions

from

Unexpected thermal degradation.

9. Combustion Instability Detection

The system shall detect abnormal combustion behaviour using correlated indicators such as:

EGT
CHT
RPM
Fuel flow
Injection timing
Vibration

Concept:

EGT variation
     +
RPM variation
     +
Fuel-flow deviation
     +
Vibration change
     ↓
Combustion Instability

This will later become an important AI/ML classification feature.

10. Abnormal Vibration Detection

The system shall identify abnormal vibration behaviour.

Detection may use:

Vibration amplitude
RMS
Statistical features
Frequency-domain features when suitable data is available
RPM correlation
Engine load
Historical baseline

Example:

Normal vibration
      ↓
Baseline
      ↓
Current vibration
      ↓
Significant deviation
      ↓
Possible mechanical / combustion anomaly
11. Sensor Fault & Drift Detection

The system shall detect possible sensor problems including:

Sensor dropout
Stuck value
Bias/drift
Implausible value
Excessive noise
Communication failure

The Digital Twin provides an important analytical reference:

Sensor Value
     vs
Twin Expected Value
     ↓
Residual
     ↓
Persistent unexplained deviation
     ↓
Possible Sensor Fault

NASA aircraft-engine diagnostic research has demonstrated model-based analytical channels for detecting and isolating both component and sensor faults.

12. Multi-Parameter Fault Correlation

The system shall correlate multiple parameters before declaring a probable fault.

Example:

CHT ↑
EGT ↑
Fuel Flow ↑
RPM unstable
       ↓
Correlation Engine
       ↓
Possible Combustion / Thermal Fault

This is important because single-sensor thresholding can create false alarms.

NASA's propulsion-health research specifically identifies multi-source data fusion as a way to improve diagnostic reliability and reduce false alarms.

13. Early Fault Detection

The system shall attempt to detect abnormal behaviour before a critical failure condition occurs.

Concept:

Normal
  ↓
Subtle deviation
  ↓
Persistent anomaly
  ↓
Predicted fault
  ↓
Critical condition

The system should use:

Trend changes
Digital Twin residuals
Health degradation
Anomaly scores
Historical patterns

to identify early-stage degradation.

14. Fault Severity Classification

Detected faults shall be assigned a severity level.

Initial levels:

INFO
 ↓
MINOR
 ↓
WARNING
 ↓
CRITICAL

Example:

Severity	Meaning
INFO	Weak/low-impact abnormality
MINOR	Early deviation requiring observation
WARNING	Probable fault requiring attention
CRITICAL	Severe condition requiring immediate action

Exact thresholds will be determined later using validated engine data and fault scenarios.

15. Fault Confidence & Uncertainty

Every intelligent fault diagnosis should provide a confidence value where possible.

Example:

Possible Fault:
Injector Abnormality

Confidence:
87%

Evidence:
Fuel Flow       HIGH
EGT Deviation   HIGH
RPM Variation   MEDIUM
Injection Time  HIGH

Confidence shall be affected by:

Data quality
Number of supporting parameters
Model uncertainty
AI model confidence
Operating condition
Historical evidence

NASA PHM research has explored information-fusion methods specifically to obtain more reliable diagnostic inference from multiple information sources.

16. Fault Persistence & Confirmation

The system shall avoid declaring a fault from a single transient abnormal measurement when persistence is required.

Concept:

Abnormal Sample
      ↓
Candidate Fault
      ↓
Check Persistence
      ↓
Cross-check Parameters
      ↓
Confirmed / Rejected

Example:

One abnormal EGT reading
        ↓
Possible anomaly

Repeated EGT deviation
+
Supporting sensor evidence
        ↓
Confirmed probable fault

This mechanism helps reduce nuisance/false alarms.

17. Fault Diagnosis & Isolation

The system shall attempt to determine the most probable source of an abnormal condition.

Example:

Observed:
EGT ↑
RPM unstable
Fuel Flow ↑

Possible Causes:
1. Injector abnormality
2. Combustion instability
3. Sensor error

         ↓

Evidence Fusion
         ↓

Most Probable Cause

The output should include:

Probable fault
Alternative possibilities where relevant
Confidence
Supporting evidence
Affected subsystem

Model-based FDI architectures have demonstrated this general approach by comparing measured and model-estimated engine parameters and using discrepancy patterns to determine likely fault sources.

18. Digital Twin & AI/ML Integration

FR-06 shall receive information from both:

Digital Twin
Expected Value
     ↓
Residual
     ↓
Fault Detection
AI/ML
Historical Patterns
     +
Current Features
     ↓
Anomaly / Fault Probability

Combined architecture:

            ENGINE DATA
                 │
        ┌────────┴────────┐
        ↓                 ↓
 DIGITAL TWIN           AI / ML
        ↓                 ↓
   Residuals          Predictions
        └────────┬────────┘
                 ↓
          FAULT ENGINE
                 ↓
       Diagnosis + Confidence

This hybrid approach is one of the key differentiators of our project.

19. Fault History & Diagnostic Output

Every detected/predicted fault shall be stored with:

Mission ID
Engine ID
Timestamp
Fault type
Severity
Confidence
Supporting parameters
Digital Twin residuals
Current health state
Status

Example:

Mission: M024
Time: 14:32:18

Fault:
Possible Cooling Degradation

Severity:
WARNING

Confidence:
89%

Evidence:
CHT trend ↑
Thermal residual ↑
Ambient-adjusted deviation ↑

This history will later support:

Mission replay
Maintenance records
Model training
RUL estimation
Fleet-level analysis
20. Acceptance Criteria

FR-06 shall be considered complete when:

 Misfire detection is supported.
 Injector abnormality detection is supported.
 Lubrication fault detection is supported.
 Cooling/overheating detection is supported.
 Combustion instability detection is supported.
 Abnormal vibration detection is supported.
 Sensor fault/drift detection is supported.
 Multiple parameters can be correlated.
 Early abnormality detection is supported.
 Fault severity can be classified.
 Fault confidence can be represented.
 Fault persistence can be evaluated.
 Probable fault source can be identified.
 Digital Twin residuals can contribute to diagnosis.
 AI/ML predictions can contribute to diagnosis.
 Fault events are stored historically.
 Diagnostic output contains supporting evidence.
 False-positive reduction mechanisms are implemented.
 Fault information is available to RUL and maintenance modules.