EP-07 — Engine Vibration
1. Parameter Identification
Field	Specification
Parameter ID	EP-07
Parameter Name	Engine Vibration
Abbreviation	VIB
Parameter Category	Mechanical Health / Condition Monitoring
Criticality	Critical
2. Parameter Description

Engine vibration represents the mechanical oscillations produced by the engine and its associated rotating/reciprocating components.

Vibration monitoring is important for identifying changes in mechanical condition and detecting abnormal operating behaviour.

It can support detection of:

Mechanical imbalance
Misalignment
Bearing-related abnormalities
Combustion-related vibration
Abnormal reciprocating behaviour
Structural/mechanical degradation
Changes in engine operating condition

For the Digital Twin, vibration provides an important mechanical-health observation.

3. Measurement Unit

Vibration can be represented using different measurement quantities depending on the sensor and processing method.

Common units include:

Acceleration → g or m/s²
Velocity → mm/s
Displacement → µm or mm

For the prototype, the preferred raw measurement representation shall be:

Acceleration
Unit: g or m/s²

The exact unit shall be determined by the selected accelerometer and acquisition system.

4. Measurement / Data Source

Vibration may be obtained using:

MEMS accelerometer
Piezoelectric accelerometer
Engine-mounted accelerometer
DAQ system
ECU where vibration data is available
CAN/telemetry interface
Engine simulator

Typical architecture:

Engine Structure
      ↓
Accelerometer
      ↓
Signal Conditioning
      ↓
DAQ / Edge Processor
      ↓
Feature Extraction
      ↓
CAN / Telemetry
      ↓
Digital Twin / AI

The sensor mounting location is important because vibration measurements are strongly dependent on installation position and direction.

5. Measurement Type

Vibration should be treated as a time-series measurement, rather than only a single scalar value.

Raw signal:

Acceleration
     │
     │  /\    /\      /\
     │ /  \  /  \    /  \
─────┼/────\/────\──/────\── Time

From the raw signal, the system may calculate:

RMS
Peak
Peak-to-peak
Crest factor
Frequency spectrum
Dominant frequency
Band energy
Statistical features

Therefore:

Raw Vibration
      ↓
Signal Processing
      ↓
Vibration Features
      ↓
Health / Fault / AI
6. Operating Condition Dependency

Vibration is strongly influenced by:

RPM
Engine load
Combustion state
Propeller/load condition
Engine mounting
Operating condition
Mission phase

A vibration level that is normal at one RPM may not be normal at another RPM.

Therefore:

Vibration shall be evaluated relative to the current operating condition.

Concept:

RPM + Load + Engine State
          ↓
Expected Vibration
          ↓
Actual Vibration
          ↓
Deviation
7. Expected Operating Behaviour

During normal engine operation, vibration will naturally exist because of rotating and reciprocating components.

The objective is therefore not to eliminate vibration, but to identify abnormal changes from the expected vibration pattern.

Typical behaviour:

Engine OFF
   ↓
Low baseline vibration
   ↓
Engine Start
   ↓
Vibration increases
   ↓
Stable Operation
   ↓
Characteristic vibration pattern

Changes in RPM can change both vibration amplitude and frequency content.

The normal vibration signature shall be established using:

Engine test data
Historical mission data
Simulator data
Baseline measurements
8. Validation Rules

Vibration data shall undergo:

Signal integrity validation

Check:

Missing samples
Signal saturation
Clipping
Excessive noise
Sensor disconnection
Amplitude validation

Check whether measured amplitude is within the valid measurement range.

Sampling validation

Ensure sufficient sampling frequency for the frequency content being analysed.

Operating-condition validation

Correlate vibration with:

RPM
Engine load
Mission phase
Sensor consistency

Where multiple vibration sensors are available, compare their behaviour.

9. Sampling / Update Requirement

Unlike slow-changing temperatures, vibration may contain relatively high-frequency information.

Therefore, two levels of data handling may be used:

Raw vibration

High-rate acquisition for detailed signal analysis.

Derived vibration features

Lower-rate telemetry transmission.

Concept:

Accelerometer
     ↓
High-rate Raw Signal
     ↓
Edge Processing
     ↓
RMS / Peak / Spectrum / Features
     ↓
Telemetry

The exact sampling frequency shall be determined from:

Sensor bandwidth
Expected vibration frequencies
Engine RPM
Required fault-detection resolution
DAQ capability
10. Digital Twin Relevance

Vibration shall contribute to the Digital Twin's mechanical-health representation.

The Digital Twin may estimate an expected vibration signature based on:

RPM
Engine operating state
Load
Historical baseline

Concept:

RPM
+
Load
+
Engine State
      ↓
Expected Mechanical Signature
      ↓
Actual Vibration
      ↓
Residual / Deviation

A vibration residual may be defined as:

Vibration Residual =
Measured Feature − Expected Feature

This can be used for anomaly detection and mechanical-health assessment.

11. Health Monitoring Relevance

Vibration shall contribute to Mechanical Health.

Important indicators may include:

RMS vibration
Peak vibration
Vibration trend
Dominant frequency
Frequency-band energy
Vibration asymmetry
Changes relative to baseline

Example:

Baseline Vibration
       ↓
Current Vibration
       ↓
Deviation
       ↓
Mechanical Health Indicator
12. Fault Detection Relevance

Vibration can contribute to detection of:

Mechanical imbalance
Misalignment
Bearing-related abnormalities
Structural vibration changes
Abnormal rotating behaviour
Combustion-related vibration changes
Sensor/mounting problems

Example:

Vibration RMS ↑
+
RPM stable
+
Load stable
        ↓
Possible mechanical abnormality

Another example:

Vibration Frequency Pattern
          +
RPM-related frequency
          ↓
Possible rotating-component abnormality

The exact fault interpretation shall depend on validated vibration signatures.

13. AI/ML Relevance

Vibration will be one of the most valuable parameters for AI/ML-based anomaly detection.

Time-domain features
RMS
Peak
Peak-to-Peak
Variance
Standard Deviation
Crest Factor
Kurtosis
Frequency-domain features
Dominant Frequency
Frequency Amplitude
Band Energy
Spectral Features
Trend features
RMS Trend
Peak Trend
Frequency Shift
Long-Term Degradation
Context features
Vibration + RPM + Load

These features may support:

Anomaly detection
Fault classification
Mechanical degradation detection
Predictive maintenance
RUL estimation
14. Dashboard Representation

The dashboard shall display both a simplified vibration indicator and detailed information for engineers.

Operator view
┌────────────────────┐
│     VIBRATION      │
│                    │
│     0.42 g RMS     │
│                    │
│      ● NORMAL      │
└────────────────────┘
Engineer view
Vibration

RMS:       0.42 g
Peak:      0.81 g
Dominant:  XX Hz

Trend:     ↑
Status:    WARNING

Where appropriate, a frequency spectrum shall also be available.

15. Data Quality Requirements

Vibration data shall support:

VALID
WARNING
INVALID
MISSING
STALE
SATURATED

Additional signal-quality checks may include:

Sensor saturation
Clipping
Excessive noise
Unexpected DC offset
Communication loss
Sampling irregularity

Example:

Vibration: 0.42 g RMS
Quality: VALID
16. Fault / Failure Signatures

Potential abnormal vibration patterns include:

Increased RMS
0.30 → 0.35 → 0.42 → 0.55 g

May indicate increasing mechanical abnormality or changing operating condition.

Sudden vibration spike
0.35 → 0.38 → 1.10 → 0.37 g

May represent:

Transient event
Mechanical impact
Sensor issue
Abnormal engine event
Frequency shift

A change in dominant frequency may indicate a change in mechanical behaviour.

RPM-correlated abnormality
RPM-related vibration amplitude ↑
          ↓
Potential rotating-system abnormality

These patterns shall be validated against engine-specific test data before being mapped to definitive faults.

17. Parameter Relationships

Vibration shall be correlated with:

Vibration ↔ RPM
RPM
 ↓
Rotational Dynamics
 ↓
Vibration Frequency
Vibration ↔ Engine Load
Load
 ↓
Mechanical Forces
 ↓
Vibration
Vibration ↔ CHT / EGT

Changes in combustion behaviour can produce changes in vibration together with thermal parameters.

Combustion
   ↓
EGT / CHT
   +
Vibration
Vibration ↔ Engine Health
Vibration Features
       ↓
Mechanical Health
18. Criticality
Criticality: CRITICAL

Reason:

Vibration provides information about mechanical condition and can reveal abnormalities that may not be visible through temperature, pressure or RPM alone.

Reliable vibration data can improve:

Mechanical health monitoring
Fault detection
Predictive maintenance
Digital Twin accuracy
AI/ML anomaly detection

However, vibration interpretation is highly dependent on sensor location and engine-specific baseline data.

19. Data Storage Requirements

Because vibration can be high-rate data, the system shall distinguish between raw vibration data and derived features.

Raw data
timestamp
mission_id
engine_id
sensor_id
axis
sample_rate
raw_value
unit
quality_status
Derived features
timestamp
mission_id
engine_id
parameter_id
RMS
Peak
Crest_Factor
Dominant_Frequency
Band_Energy
quality_status

Example:

Mission: M001
Engine: E001
Feature: RMS
Value: 0.42
Unit: g
Quality: VALID
20. Verification & Validation

Vibration implementation shall be verified using:

A. Sensor documentation

Verify:

Sensor type
Measurement range
Sensitivity
Frequency response
Sampling requirements
Mounting requirements
Interface
B. Baseline engine data

Establish normal vibration signatures under different:

RPM
Loads
Mission phases
C. Controlled simulation

Generate:

Normal vibration
Increased vibration
Transient vibration
Frequency changes
Sensor noise
Sensor failure
D. Signal processing validation

Verify calculation of:

RMS
Peak
Crest factor
FFT/frequency spectrum
Frequency-band features
E. Cross-parameter validation

Compare vibration against:

RPM
Engine load
CHT
EGT
Mission phase
F. AI/ML validation

Evaluate whether extracted vibration features improve:

Anomaly detection
Fault classification
Degradation detection