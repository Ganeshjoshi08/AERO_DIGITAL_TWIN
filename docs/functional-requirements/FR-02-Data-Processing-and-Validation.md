FR-02 — Data Processing & Validation
1. Objective

The system shall process, validate, clean, transform, and qualify acquired engine telemetry before the data is supplied to the Digital Twin, AI/ML, health monitoring, and visualization modules.

The processing layer shall ensure that downstream analytics are not based on corrupted, incomplete, inconsistent, noisy, or unreliable sensor data.

2. Scope

FR-02 covers:

Data preprocessing
Missing-data handling
Outlier detection
Noise reduction
Range validation
Cross-parameter consistency checking
Unit normalization
Sensor quality assessment
Sensor drift detection
Feature generation
Processed-data generation

This approach is aligned with established condition-monitoring architectures that separate data processing from subsequent diagnostics and presentation.

3. Data Preprocessing

The system shall preprocess incoming telemetry before further analysis.

Processing may include:

Data type validation
Timestamp ordering
Duplicate removal
Missing-value identification
Unit conversion
Scaling
Resampling where required
Data synchronization

General flow:

Raw Telemetry
      ↓
Format Check
      ↓
Timestamp Check
      ↓
Missing Data Check
      ↓
Unit Normalization
      ↓
Validation
      ↓
Filtering
      ↓
Processed Telemetry
4. Missing Data Handling

The system shall detect missing or unavailable sensor measurements.

Possible conditions:

Missing
   ↓
Identify duration
   ↓
Check parameter importance
   ↓
Flag / Handle

The system shall distinguish between:

Single missing sample
Short-duration data gap
Long-duration data loss
Complete sensor failure

For short gaps, controlled interpolation may be considered where technically appropriate.

For critical parameters, the system should not blindly fabricate data; instead, it should retain a quality flag.

5. Outlier Detection

The system shall identify measurements that deviate significantly from expected behaviour.

Example:

EGT:

702
705
707
704
1500  ← Possible outlier
706
708

The outlier detection layer may use:

Physical limits
Statistical methods
Rolling statistics
Rate-of-change checks
Model-based residuals

Importantly, an outlier should not automatically be deleted because an unusual value can represent either bad data or a genuine engine event. NIST explicitly notes this distinction.

Therefore:

Outlier
   ↓
Detect
   ↓
Classify
   ├── Possible bad data
   └── Possible real engine event
6. Noise Filtering

The system shall reduce measurement noise while preserving meaningful engine behaviour.

Possible processing techniques:

Moving average
Median filtering
Low-pass filtering
Exponential smoothing
Parameter-specific filtering

Filtering shall be selected according to the dynamics of each parameter.

For example:

Raw Vibration
      ↓
Noise Filtering
      ↓
Useful Vibration Signal
      ↓
Feature Extraction

Important: filtering should not remove real fault signatures.

7. Range & Consistency Validation

Data shall be checked against:

A. Physical limits

Example:

Temperature < physically possible minimum
Temperature > physically possible maximum
B. Operational limits

Parameter behaviour should be evaluated relative to the engine operating condition.

C. Rate-of-change

Example:

CHT:

175 → 176 → 177 → 178 → 300

                     ↑
                suspicious jump
D. Cross-parameter consistency

Multiple parameters can be compared.

Example:

RPM ↑
Throttle ↑
Fuel Flow ↑

is generally more plausible than a situation where one sensor changes dramatically while related parameters remain unchanged.

NASA research on propulsion health management specifically discusses sensor data qualification using relationships between physically related sensors, rather than relying only on simple red-line checks.

8. Unit Conversion & Normalization

All incoming data shall be converted to the project's standardized internal units.

Example:

Parameter	Internal Unit
RPM	rpm
Temperature	°C
Pressure	bar / kPa
Fuel Flow	L/h or kg/h
Vibration	g
Voltage	V
Altitude	m
Throttle	%

Normalization may also be required before ML processing.

Example:

Raw Features
      ↓
Scaling / Normalization
      ↓
ML-Ready Features
9. Sensor Quality & Drift Detection

This is very important for our project because the problem statement specifically asks for sensor failure/drift detection.

The system shall monitor sensor quality using:

Range checks
Rate-of-change checks
Stuck-value detection
Missing-data detection
Cross-sensor consistency
Model-based residuals
Historical behaviour

Example:

Actual CHT sensor
       ↓
      180°C

Digital Twin expected
       ↓
      165°C

Difference = 15°C
       ↓
Check other parameters
       ↓
Possible sensor drift

NASA's sensor-validation work specifically describes using physics-based relationships/analytical redundancy to identify sensors that may be failing, going beyond simple threshold checks.

10. Feature Generation

Processed telemetry shall be transformed into useful features for the Digital Twin and AI/ML modules.

Examples:

Time-domain features
Mean
Minimum
Maximum
Standard deviation
Rate of change
Moving average
Engine-specific features
RPM variation
CHT rise rate
EGT deviation
Oil-pressure trend
Fuel-flow deviation
Vibration RMS
Temperature difference
Actual-vs-expected residual

Example:

Raw Data
   ↓
RPM
CHT
EGT
Oil Pressure
Vibration
   ↓
Feature Engineering
   ↓
RPM_variation
CHT_rate
EGT_deviation
Oil_pressure_trend
Vibration_RMS
   ↓
AI / Digital Twin
11. Processed Data Output

FR-02 shall generate a standardized processed telemetry record.

Conceptually:

timestamp
mission_id
engine_id

processed_rpm
processed_cht
processed_egt
processed_oil_pressure
processed_oil_temperature
processed_fuel_flow
processed_vibration

battery_voltage
alternator_status
injection_timing

engine_load
throttle_position
altitude
ambient_temperature
ambient_pressure

quality_flags
anomaly_flags
derived_features

This processed dataset will be supplied to:

                 PROCESSED DATA
                       │
          ┌────────────┼────────────┐
          ↓            ↓            ↓
    Digital Twin      AI/ML      Dashboard

Data fusion is particularly relevant here because propulsion health information can come from multiple sensors, maintenance history and component models; combining these sources can improve diagnostic visibility and reduce false alarms.

12. Acceptance Criteria

FR-02 shall be considered complete when:

 Raw telemetry can be preprocessed.
 Missing data can be detected.
 Outliers can be identified and flagged.
 Noise can be reduced without destroying meaningful trends.
 Physical/operational consistency checks are defined.
 Units are standardized.
 Sensor quality status is generated.
 Sensor drift/stuck-value conditions can be identified.
 Derived features can be generated.
 Processed telemetry is available to Digital Twin and AI/ML modules.
 Original raw data remains available for audit/replay.