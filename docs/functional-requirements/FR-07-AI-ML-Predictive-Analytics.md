FR-07 — AI/ML Predictive Analytics
1. Objective

The system shall use Artificial Intelligence and Machine Learning techniques to analyze processed engine telemetry, Digital Twin outputs, health indicators, operating conditions, and historical engine data for anomaly detection, fault prediction, degradation analysis, Remaining Useful Life (RUL) estimation, and predictive maintenance.

The AI/ML layer shall complement the physics-based Digital Twin rather than completely replacing it.

2. Scope

FR-07 covers:

AI/ML architecture
Data inputs
Feature engineering
Normal behaviour modelling
Anomaly detection
Anomaly scoring
Fault classification
Fault probability
Degradation prediction
RUL estimation
Predictive maintenance
Operating-condition awareness
Training and validation
Model evaluation
Explainable AI
Confidence and uncertainty
Model management
Future adaptive learning
3. AI/ML Architecture

The AI/ML layer shall receive information from multiple project modules.

              PROCESSED DATA
                    +
              DIGITAL TWIN
                    +
             HEALTH INDICATORS
                    +
              FAULT HISTORY
                    +
          OPERATING CONDITIONS
                    ↓
             FEATURE ENGINE
                    ↓
              AI / ML LAYER
                    │
       ┌────────────┼────────────┐
       ↓            ↓            ↓
   Anomaly       Fault        Degradation
   Detection   Classification   Model
       │            │            │
       ↓            ↓            ↓
    Score       Probability      RUL
       └────────────┼────────────┘
                    ↓
          Predictive Maintenance
4. AI/ML Data Inputs

The system shall use relevant information from:

Engine parameters
RPM
CHT
EGT
Oil pressure
Oil temperature
Fuel flow
Vibration
Battery voltage
Alternator output
Injection timing
Operating conditions
Throttle
Engine load
Altitude
Ambient temperature
Ambient pressure
Mission phase
Derived information
Digital Twin residuals
Health indicators
Health trends
Fault history
Previous anomaly scores

This multi-source architecture is important because aerospace health-management systems can combine sensor, model and historical information rather than relying exclusively on raw measurements.

5. Feature Engineering

The system shall generate meaningful features from processed telemetry.

Statistical features
Mean
Maximum
Minimum
Standard deviation
Variance
Rate of change
Engine-specific features
RPM variation
CHT rise rate
EGT deviation
Oil-pressure trend
Fuel-flow deviation
Vibration RMS
Actual-vs-expected residual

Example:

Raw Telemetry
      ↓
Feature Engineering
      ↓
RPM Variation
CHT Rate
EGT Residual
Oil Pressure Trend
Vibration RMS
Fuel Deviation
      ↓
AI / ML
6. Normal Engine Behaviour Learning

The system shall learn or represent normal engine behaviour under different operating conditions.

Normal behaviour should account for:

RPM
Load
Throttle
Altitude
Ambient temperature
Mission phase

Example:

Normal Engine Data
        ↓
Training
        ↓
Normal Behaviour Model
        ↓
Current Engine
        ↓
Deviation Detection

This allows the system to identify abnormalities that may not violate a simple fixed threshold.

7. Anomaly Detection

The system shall detect deviations from expected/learned engine behaviour.

Potential approaches include:

Statistical anomaly detection
Isolation Forest
One-Class classification
Autoencoder-based detection
Model-residual analysis

The exact algorithm will be selected after evaluating the available dataset.

Concept:

Normal Behaviour
      ↓
Current Data
      ↓
Deviation
      ↓
ANOMALY
8. Anomaly Score Generation

Each detected anomaly shall have an anomaly score.

Example:

Anomaly Score

0.08 → Normal
0.35 → Low
0.68 → Moderate
0.91 → High

The score should represent how strongly current behaviour differs from the learned/expected normal state.

The exact score scale and decision boundaries will be established during model validation.

9. Fault Classification

The AI/ML layer shall classify probable fault categories.

Initial classes:

Normal
Misfire
Injector Abnormality
Lubrication Issue
Cooling Degradation
Combustion Instability
Abnormal Vibration
Sensor Fault

Example:

Input Features
      ↓
AI Classifier
      ↓
Possible Fault:
Injector Abnormality
10. Fault Probability Estimation

For classification-based predictions, the system shall provide probability/confidence information where supported.

Example:

Possible Faults

Injector abnormality      82%
Combustion instability    11%
Sensor issue                7%

This allows the operator to understand that an AI prediction is probabilistic rather than an absolute diagnosis.

11. Degradation Trend Prediction

The system shall analyse health and parameter trends to identify progressive degradation.

Example:

Health

100 ┤────────
 95 ┤       ╲
 90 ┤        ╲
 85 ┤         ╲
 80 ┤          ╲
    └────────────── Time

The system shall identify trends such as:

Increasing temperature deviation
Increasing vibration
Increasing fuel consumption
Declining oil pressure
Increasing Digital Twin residuals
Declining subsystem health
12. Remaining Useful Life (RUL) Estimation

The system shall estimate the Remaining Useful Life of the engine or relevant subsystem when sufficient degradation/failure data is available.

Concept:

Historical Degradation
        +
Current Health
        +
Operating Conditions
        +
Fault History
        ↓
RUL Model
        ↓
Estimated Remaining Life

Example:

Estimated RUL

142 hours

Confidence:
± 18 hours

Important: RUL shall not be presented as an artificially precise number when training/failure data is insufficient.

13. Predictive Maintenance Analytics

AI/ML outputs shall support predictive maintenance decisions.

Example:

Degradation Detected
        ↓
Future Risk Increasing
        ↓
Maintenance Recommendation
        ↓
"Inspect cooling system
during next maintenance window."

Recommendations shall consider:

Fault probability
Health trend
RUL
Mission requirements
Severity
Confidence

Predictive maintenance should therefore be an output of the health/prognostic chain, not simply a threshold alarm.

14. Operating-Condition Awareness

AI/ML models shall consider engine operating conditions.

For example, the same EGT may have different meanings under different:

RPM
Load
Altitude
Ambient temperature
Throttle

Concept:

Engine Data
    +
Operating Condition
    ↓
AI Model
    ↓
Context-Aware Prediction

This reduces false anomaly detections caused by legitimate operating-condition changes.

15. Model Training & Validation

The AI/ML development process shall separate data for model development and unbiased evaluation.

Concept:

Complete Dataset
      ↓
Data Preparation
      ↓
┌──────────┬────────────┬──────────┐
Training   Validation    Testing
  Data        Data         Data

Training data shall be used to develop the model.

Validation data shall be used for:

Hyperparameter tuning
Model selection
Threshold selection

Testing data shall be reserved for final performance evaluation.

Where appropriate, cross-validation may be used during development.

16. Model Performance Evaluation

The system shall evaluate AI/ML performance using suitable metrics.

Classification
Accuracy
Precision
Recall
F1-score
Confusion matrix
ROC-AUC where appropriate
Anomaly detection
Detection rate
False-positive rate
False-negative rate
Detection latency
RUL
MAE
RMSE
Prediction error
Uncertainty/coverage where available

The metric selection shall depend on the specific model and dataset.

17. Explainable AI

The system shall provide an explanation for important AI predictions.

Example:

⚠ POSSIBLE INJECTOR ABNORMALITY

Confidence: 87%

Main contributing factors:

EGT deviation       HIGH
Fuel-flow deviation HIGH
Injection timing    HIGH
RPM variation       MEDIUM

The objective is not merely:

"Fault detected"

but:

"Why does the model believe this fault is likely?"

This is particularly valuable for maintenance-engineering users.

18. Model Confidence & Uncertainty

The AI/ML layer shall provide confidence or uncertainty information where technically supported.

Confidence may be affected by:

Data quality
Dataset size
Operating conditions
Model uncertainty
Out-of-distribution conditions
Lack of representative fault examples

Example:

Prediction:
Cooling degradation

Probability: 89%

Model confidence: Medium

The system should flag situations where the model is operating outside its validated domain.

19. Online / Adaptive Learning & Model Management

The architecture shall support future model updates.

Potential future capabilities:

New mission data incorporation
Model retraining
Model versioning
Performance monitoring
Dataset versioning
Drift monitoring

However, the first prototype shall use a controlled offline-trained model rather than allowing an AI model to continuously retrain itself without validation.

Concept:

New Mission Data
       ↓
Data Validation
       ↓
Performance Analysis
       ↓
Controlled Retraining
       ↓
Model Validation
       ↓
New Model Version

This gives us a safer and more reproducible development process.

20. Acceptance Criteria

FR-07 shall be considered complete when:

 AI/ML architecture is defined.
 Required data inputs are available.
 Features can be generated from engine telemetry.
 Normal engine behaviour can be modelled.
 Anomalies can be detected.
 Anomaly scores can be generated.
 Probable fault classes can be predicted.
 Fault probabilities/confidence can be represented.
 Degradation trends can be analysed.
 RUL estimation framework is available when sufficient data exists.
 Predictive maintenance outputs can be generated.
 Operating conditions are considered.
 Training, validation and testing datasets are separated.
 Appropriate performance metrics are calculated.
 Important predictions have explainable evidence.
 Model confidence/uncertainty is represented.
 Model versions can be managed.
 AI/ML outputs are integrated with the Digital Twin and health/fault modules.