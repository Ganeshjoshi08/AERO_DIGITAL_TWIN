SA-06 — AI/ML Architecture
1. Purpose

The AI/ML Architecture defines the intelligent analytics layer responsible for:

Anomaly detection
Fault identification
Fault probability estimation
Degradation tracking
Remaining Useful Life (RUL) estimation
Predictive maintenance
Trend analysis
Explainable diagnostics

AI/ML shall work together with the Digital Twin rather than replacing the physics/model-based layer.

2. Overall AI/ML Architecture
                ENGINE DATA
                     │
                     ▼
          ┌────────────────────┐
          │ Data Validation    │
          │ & Preprocessing    │
          └─────────┬──────────┘
                    │
                    ▼
          ┌────────────────────┐
          │ Feature Engineering│
          └─────────┬──────────┘
                    │
                    ▼
          ┌────────────────────┐
          │ Digital Twin State │
          │ + Residuals        │
          └─────────┬──────────┘
                    │
                    ▼
        ╔════════════════════════╗
        ║      AI/ML LAYER       ║
        ║                        ║
        ║ Anomaly Detection      ║
        ║ Fault Classification   ║
        ║ Degradation Model      ║
        ║ RUL Estimation         ║
        ╚═══════════╤════════════╝
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
   Health Assessment    Maintenance
                         Recommendation
          │                   │
          └─────────┬─────────┘
                    ▼
                Dashboard
3. AI/ML Layer Components

Humare AI system ko 5 major intelligence modules mein divide karenge:

ID	Module	Purpose
ML-01	Feature Engineering	Raw data → meaningful features
ML-02	Anomaly Detection	Abnormal behaviour detect
ML-03	Fault Classification	Probable fault identify
ML-04	Degradation & RUL	Health deterioration + RUL
ML-05	Explainability	Why model predicted it
4. ML-01 — Feature Engineering

AI ko directly raw sensor streams dena ideal nahi hai.

Pipeline:

Raw Sensor Data
      ↓
Cleaning
      ↓
Normalization
      ↓
Windowing
      ↓
Feature Extraction
      ↓
ML Features
5. Feature Categories
A. Direct Features
RPM
CHT
EGT
Oil Pressure
Oil Temperature
Fuel Flow
Vibration
Battery Voltage
Throttle
MAP
Fuel Pressure
B. Statistical Features
Mean
Median
Minimum
Maximum
Standard Deviation
Variance
RMS
Peak
C. Trend Features
Rate of Change
Moving Average
Slope
Trend
Temperature Rise Rate
Pressure Drop Rate
D. Cross-Parameter Features
Fuel Flow / Load
EGT / Load
CHT / Ambient Temperature
MAP / Throttle
RPM / Load
Fuel Pressure / Fuel Flow
E. Digital Twin Features

This is where our architecture becomes stronger.

Actual Value
     −
Expected Value
     ↓
Residual

Examples:

EGT Residual
CHT Residual
RPM Residual
Fuel Flow Residual
MAP Residual
6. Feature Windowing

Engine data is time-series data.

Therefore we should analyze time windows.

Example:

10:00 ───────────────── 10:10
       Time Window

Within each window:

RPM Mean
RPM Variance
EGT Mean
EGT Slope
Vibration RMS
Fuel Flow Trend

These become one feature vector.

7. ML-02 — Anomaly Detection

This is the first intelligence layer.

Purpose:

Identify behaviour that deviates from expected normal engine operation.

Architecture:

Features
   +
Digital Twin Residuals
   +
Operating Context
        ↓
Anomaly Detection Model
        ↓
Anomaly Score

Example:

Anomaly Score = 0.87
8. Anomaly Detection Strategy

We should not depend on only one algorithm.

Initial prototype

Use:

Isolation Forest

Why:

Works well for tabular anomaly detection
Does not require every fault class to be labelled
Relatively lightweight
Good for prototype development

Later we can evaluate:

Autoencoder
One-Class SVM
Local Outlier Factor
Temporal models
9. Context-Aware Anomaly Detection

This is very important.

A value should not be considered abnormal without considering operating conditions.

Example:

EGT = 720°C

By itself:

Cannot conclude → Fault

But:

EGT = 720°C
+
Load = 85%
+
Ambient = Hot

may be expected.

Whereas:

EGT = 720°C
+
Load = 50%
+
Ambient = Normal
+
Expected EGT = 670°C

produces a stronger anomaly signal.

10. Digital Twin + Anomaly Detection

Our preferred pipeline:

Sensor Data
    ↓
Digital Twin
    ↓
Expected Behaviour
    ↓
Residual
    ↓
AI Anomaly Model
    ↓
Anomaly Score

This is a hybrid / physics-informed approach.

11. ML-03 — Fault Classification

Once anomaly is detected:

Anomaly
   ↓
Feature Vector
   ↓
Fault Classifier
   ↓
Fault Probabilities

Possible fault classes from the problem statement:

Misfire
Injector Abnormality
Lubrication Issue
Sensor Drift
Sensor Failure
Combustion Instability
Overheating
Abnormal Vibration

Additional classes can be added later.

12. Fault Classification Output

Instead of saying:

"Injector fault = YES"

the system should preferably produce probabilities.

Example:

Possible Faults

Injector Abnormality     72%
Combustion Instability   18%
Sensor Issue              7%
Other                     3%

This is more realistic for diagnostic systems.

13. Fault Severity

Fault probability and severity are separate concepts.

Example:

Fault Probability = 72%
Severity = HIGH

Severity may depend on:

Safety impact
Engine performance impact
Rate of degradation
Operating condition
Persistence
14. ML-04 — Degradation Tracking

Fault detection tells us:

Something abnormal is happening.

Degradation tracking asks:

Is the engine health getting progressively worse?

Architecture:

Historical Health Data
        ↓
Trend Analysis
        ↓
Degradation Indicator
        ↓
Health Trajectory

Example:

Health

95% ──────────
90%          ╲
85%           ╲
80%            ╲
75%             ╲
15. Health Indicator

We can construct a normalized health indicator:

Health Index ∈ [0,100]

Example:

100 → Healthy
 80 → Normal
 60 → Degraded
 40 → Serious
 20 → Critical

Again, these are prototype interpretation bands, not certified engine limits.

16. ML-04 — RUL Estimation

RUL means:

Remaining Useful Life.

Architecture:

Historical Degradation
        +
Current Health
        +
Operating Conditions
        ↓
RUL Model
        ↓
Estimated Remaining Life

Example:

Estimated RUL:
≈ 420 operating hours

For our prototype, this should be presented as a model estimate with uncertainty, not a guaranteed maintenance deadline.

17. RUL Architecture
Sensor History
      ↓
Health Trend
      ↓
Degradation Model
      ↓
Future Health Prediction
      ↓
Threshold / Failure Criterion
      ↓
RUL

For example:

Health
100 ┤───────
 80 ┤       ╲
 60 ┤        ╲
 40 ┤         ╲
 20 ┤          ╲
  0 ┤-----------╲
    └────────────── Time
                  ↑
              Failure/
              Limit
18. RUL Uncertainty

We should not output only:

RUL = 420 hours

Better:

Estimated RUL: 420 hours
Confidence:    78%
Range:         350–500 hours

This makes the system more realistic.

19. Predictive Maintenance

AI outputs go to maintenance logic.

Anomaly
   ↓
Fault Probability
   ↓
Degradation
   ↓
RUL
   ↓
Maintenance Recommendation

Example:

Fuel System Health ↓

Possible Cause:
Fuel-pressure degradation

Recommendation:
Inspect fuel delivery system
20. ML-05 — Explainable AI

Because this is a defence-oriented engineering system, blindly showing an AI prediction is not enough.

The system should provide:

Prediction
    +
Reason
    +
Important Features

Example:

⚠ Possible Overheating

Probability: 81%

Contributing factors:
• CHT increasing rapidly
• EGT residual elevated
• Ambient temperature high
• Cooling trend abnormal
21. Explainability Architecture
ML Prediction
     ↓
Feature Importance
     ↓
Explanation Generator
     ↓
Human-Readable Reason

Possible techniques later:

SHAP
Feature importance
Partial dependence
Rule-based explanation layer

For the prototype, SHAP + feature importance is a strong option.

22. Model Training Pipeline

Training will be separated from real-time inference.

Training
Historical Data
      ↓
Cleaning
      ↓
Feature Engineering
      ↓
Train / Validation / Test
      ↓
Model Training
      ↓
Evaluation
      ↓
Model Registry
Inference
Live Data
   ↓
Feature Engineering
   ↓
Trained Model
   ↓
Prediction
23. Training Data Strategy

This project may face a major problem:

Real aero-piston engine fault datasets may be limited.

Therefore we will use a layered strategy:

Real Engine Data
      +
Test-Rig Data
      +
Validated Simulation Data
      +
Synthetic Fault Data
      +
Historical Public Datasets

But we must clearly label the source.

REAL
SIMULATED
SYNTHETIC

We should never present synthetic data as real engine data.

24. Fault Data Generation

For prototype development, the simulator can generate controlled fault scenarios.

Example:

Overheating
CHT ↑
EGT ↑
Oil Temp ↑
Low Oil Pressure
Oil Pressure ↓
Oil Temperature ↑
Injector Abnormality
Fuel Flow deviation
+
EGT deviation
+
RPM fluctuation
Vibration Abnormality
Vibration RMS ↑

These scenarios will later become labelled training/test cases.

25. Dataset Structure

Conceptual dataset:

timestamp
mission_id
engine_id

rpm
cht
egt
oil_pressure
oil_temperature
fuel_flow
vibration

battery_voltage
alternator_output
injection_timing

throttle
engine_load
ambient_temperature
ambient_pressure
map
fuel_pressure
crank_position

operating_state
fault_label
severity

And derived features:

egt_residual
cht_residual
fuel_pressure_residual
rpm_residual
vibration_rms
temperature_rate
pressure_rate
26. Model Selection Strategy

We will not choose every ML algorithm immediately.

We'll select based on data availability and experiments.

Initial candidate architecture:

Task	Initial Candidate
Anomaly Detection	Isolation Forest
Fault Classification	Random Forest / XGBoost
Time-Series Analysis	XGBoost + engineered temporal features initially
Degradation	Regression / trend model
RUL	Survival/regression/time-series model
Explainability	SHAP

Later we can evaluate:

Autoencoders
LSTM/GRU
Temporal CNN
Transformer-based time-series models

The simplest model that performs adequately should be preferred for the prototype.

27. Model Evaluation
Anomaly Detection

Metrics:

Precision
Recall
F1
False Alarm Rate
Detection Delay
Fault Classification
Accuracy
Precision
Recall
F1-score
Confusion Matrix
RUL
MAE
RMSE
Prediction Error
Uncertainty Coverage

Most importantly, we should track false alarms because an operator-facing health system that constantly raises incorrect alerts is not useful.

28. Real-Time Inference Pipeline
Live Telemetry
      ↓
Preprocessing
      ↓
Feature Extraction
      ↓
Digital Twin State
      ↓
Residual Generation
      ↓
Anomaly Detection
      ↓
Fault Classification
      ↓
Health Update
      ↓
RUL
      ↓
Maintenance Recommendation
      ↓
Dashboard
29. AI/ML Architecture — Complete
                 LIVE ENGINE DATA
                        │
                        ▼
               ┌────────────────┐
               │ Preprocessing  │
               └───────┬────────┘
                       ▼
               ┌────────────────┐
               │ Feature        │
               │ Engineering    │
               └───────┬────────┘
                       ▼
             ┌────────────────────┐
             │   DIGITAL TWIN     │
             │ State + Residuals  │
             └─────────┬──────────┘
                       ▼
            ┌──────────────────────┐
            │ ANOMALY DETECTION    │
            └──────────┬───────────┘
                       ▼
            ┌──────────────────────┐
            │ FAULT CLASSIFICATION │
            └──────────┬───────────┘
                       ▼
            ┌──────────────────────┐
            │ DEGRADATION ANALYSIS │
            └──────────┬───────────┘
                       ▼
            ┌──────────────────────┐
            │ RUL ESTIMATION       │
            └──────────┬───────────┘
                       ▼
            ┌──────────────────────┐
            │ EXPLAINABILITY       │
            └──────────┬───────────┘
                       ▼
            ┌──────────────────────┐
            │ MAINTENANCE ADVISORY │
            └──────────┬───────────┘
                       ▼
                  DASHBOARD
30. Important Architecture Decision ⭐

Our AI architecture will be:

        PHYSICS / DIGITAL TWIN
                  +
              DATA-DRIVEN ML
                  +
             EXPLAINABLE AI
                  ↓
          HYBRID INTELLIGENCE

Not:

Sensors → Black Box AI → Fault

This hybrid approach directly supports the problem statement's physics-informed AI / hybrid thermodynamic + data-driven modelling innovation direction.