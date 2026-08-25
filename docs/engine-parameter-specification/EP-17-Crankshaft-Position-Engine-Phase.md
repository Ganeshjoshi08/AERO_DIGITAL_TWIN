EP-17 — Crankshaft Position / Engine Phase Reference
1. Parameter Identification
Field	Specification
Parameter ID	EP-17
Parameter Name	Crankshaft Position / Engine Phase Reference
Abbreviation	CPS / CRANK_POS
Parameter Category	Engine Synchronization / Timing / Control Parameter
Criticality	Critical
2. Parameter Description

Crankshaft Position represents the angular position of the engine crankshaft relative to a defined reference point.

It provides the engine's rotational phase reference required to synchronize engine events.

It is important for:

RPM calculation
Injection timing
Engine-cycle synchronization
Misfire analysis
Combustion analysis
Vibration analysis
ECU operation
Digital Twin engine-state estimation

For our system, crankshaft position acts as a time/phase reference that allows different sensor signals to be aligned correctly.

3. Unit

The preferred representation shall be:

Unit: degrees crank angle (°CA)

Example:

Crankshaft Position = 120° CA

The system may also store:

Tooth / Encoder Index
Crankshaft Pulse Count
Timestamp

The exact angular convention shall be defined according to the selected engine and crankshaft sensor.

4. Measurement / Data Source

Crankshaft position may be obtained using:

Crankshaft Position Sensor
Hall-effect sensor
Variable Reluctance (VR) sensor
Magnetic pickup
Encoder
ECU/FADEC
Engine simulator

Typical architecture:

Crankshaft
    ↓
Position / Speed Sensor
    ↓
Signal Conditioning
    ↓
ECU / Edge Processor
    ↓
Timestamp + Crank Angle
    ↓
Digital Twin
5. Measurement Type

Crankshaft position may be:

Directly measured
ECU-derived
Encoder-derived
Simulator-generated

The system should distinguish between:

Measured Position
        vs
Estimated Position

Where available, the raw synchronization event should also be retained.

6. Operating Condition Dependency

Crankshaft position continuously changes while the engine rotates.

It is related to:

RPM
Engine cycle
Cylinder phase
Injection event
Ignition event where applicable
Combustion event

Concept:

Crankshaft Rotation
       ↓
Engine Phase
       ↓
Injection / Ignition / Combustion
7. Expected Operating Behaviour

During normal engine operation:

0°
 ↓
90°
 ↓
180°
 ↓
270°
 ↓
360°
 ↓
Repeat

The exact cycle interpretation depends on the engine configuration.

During engine shutdown:

RPM → 0
     ↓
Crankshaft Position stops changing

During starting:

Crankshaft begins rotating
        ↓
Position pulses detected
        ↓
Engine synchronization established
8. Validation Rules

Crankshaft position shall undergo:

Position range validation

For normalized angular representation:

0° ≤ Position < 360°
Continuity validation

The position should progress consistently with engine rotation.

RPM consistency

Crankshaft position changes must be consistent with measured RPM.

Sensor pulse validation

Check:

Missing pulses
Extra pulses
Irregular pulse spacing
Synchronization loss
Timestamp validation

Ensure crankshaft events are correctly time-stamped.

9. Sampling / Update Requirement

Crankshaft position is a high-frequency synchronization signal.

Therefore, it shall not necessarily be transmitted as ordinary low-rate telemetry.

Recommended architecture:

Crankshaft Sensor
       ↓
High-Speed Edge Processing
       ↓
Crank Angle / Timing Features
       ↓
Telemetry

The system may transmit derived values such as:

RPM
Engine phase
Timing events
Synchronization status

while retaining high-rate raw pulse information locally where required.

10. Digital Twin Relevance

Crankshaft position is an important synchronization input for the Digital Twin.

Concept:

Crankshaft Position
        ↓
Engine Phase
        ↓
Injection Timing
        ↓
Combustion Model
        ↓
Expected Engine Behaviour

It allows the Digital Twin to align time-series information from:

Vibration
Injection timing
Fuel flow
RPM
Combustion indicators

This is especially useful for advanced fault analysis.

11. Health Monitoring Relevance

Crankshaft position provides a reference for evaluating:

Rotational consistency
Engine-cycle consistency
Timing stability
Sensor health
Engine synchronization

Example:

Crankshaft Rotation
       ↓
Expected Periodic Behaviour
       ↓
Actual Periodic Behaviour
       ↓
Deviation

Such deviations can be useful for detecting abnormal engine behaviour.

12. Fault Detection Relevance

Crankshaft-position information can contribute to detecting:

Crankshaft sensor failure
Synchronization loss
Irregular rotational behaviour
Misfire-related irregularity
Timing inconsistencies
ECU synchronization problems

Example:

RPM Sensor → Normal
Crankshaft Position → Irregular
        ↓
Possible position-sensor issue

Another:

Crankshaft Phase
+
Vibration
+
RPM
        ↓
Abnormal cycle behaviour
        ↓
Possible combustion / mechanical issue

It should be noted that crankshaft-position data alone should not be used to confirm a specific fault.

13. AI/ML Relevance

Crankshaft-related features can be very valuable for advanced AI/ML analysis.

Direct features
Crankshaft Position
Crankshaft Speed
Derived features
Cycle Duration
Angular Velocity
Angular Acceleration
Cycle-to-Cycle Variation
Combined features
Crankshaft Phase
+
Vibration
+
RPM
+
Injection Timing
+
EGT

These can support:

Misfire detection
Combustion anomaly detection
Mechanical anomaly detection
Timing analysis
Engine degradation analysis
14. Dashboard Representation

For the operator dashboard, raw crankshaft position is generally unnecessary.

Instead, display synchronization health:

┌────────────────────────┐
│ ENGINE SYNCHRONIZATION │
│                        │
│       ● NORMAL         │
│                        │
│ Crank Signal: VALID    │
└────────────────────────┘

For engineering view:

Crank Position: 145° CA
RPM:            5200
Sync Status:    VALID
Signal Quality: GOOD
15. Data Quality Requirements

Crankshaft-position data shall support:

VALID
WARNING
INVALID
MISSING
STALE
SYNC_LOST
UNKNOWN

Additional quality indicators:

Pulse quality
Synchronization status
Sensor confidence
Timestamp validity
Missing pulse count

Example:

Crank Signal: VALID
Synchronization: LOCKED
Quality: GOOD
16. Fault / Failure Signatures
Missing crank pulses
Pulse
Pulse
Pulse
Missing
Pulse

Potential indication of:

Sensor issue
Wiring issue
Signal-processing issue
Synchronization loss
Engine Running
+
Crank Signal Lost
        ↓
SYNC_LOST

This should generate a high-priority diagnostic event.

Irregular pulse spacing
Normal → Normal → Irregular → Normal

May indicate:

Sensor problem
Mechanical irregularity
Signal noise
Engine transient
Crank/RPM mismatch
Crankshaft Signal
       ≠
RPM Estimate

May indicate sensor or signal-processing problems.

17. Parameter Relationships
Crankshaft Position ↔ RPM
Crankshaft Position
       ↓
Position Change / Time
       ↓
RPM
Crankshaft Position ↔ Injection Timing
Crankshaft Position
       ↓
Engine Phase
       ↓
Injection Event

This is one of the most important relationships for EP-10.

Crankshaft Position ↔ Vibration
Crankshaft Phase
       +
Vibration Signal
       ↓
Cycle-Synchronous Analysis
Crankshaft Position ↔ Misfire Detection
Crankshaft Speed Variation
       ↓
Cycle-to-Cycle Analysis
       ↓
Potential Misfire Signature
18. Criticality
Criticality: CRITICAL

Reason:

Crankshaft position is fundamental to engine synchronization and timing.

A failure or loss of crankshaft synchronization can affect:

ECU operation
Injection timing
Engine-state estimation
Misfire detection
Digital Twin synchronization
Sensor-data alignment
19. Data Storage Requirements

Because raw crankshaft signals can be high-rate, storage should be divided into two levels.

Raw event data
timestamp
engine_id
sensor_id
pulse_index
pulse_timestamp
signal_quality
Derived data
timestamp
mission_id
engine_id
parameter_id
crank_angle
rpm
cycle_duration
angular_velocity
angular_acceleration
sync_status
quality_status

Example:

Mission ID: M001
Engine ID: E001
Parameter: EP-17

Crank Position: 145° CA
RPM: 5200
Sync: LOCKED
Quality: VALID
20. Verification & Validation

Crankshaft-position implementation shall be verified using:

A. Sensor documentation

Verify:

Sensor type
Pulse characteristics
Resolution
Reference position
Installation location
Interface
B. Signal testing

Test:

Normal pulses
Missing pulses
Noisy pulses
Synchronization loss
C. RPM correlation

Verify:

Crankshaft Pulse Timing
        ↓
Calculated RPM
        =
Reference RPM
D. Timing validation

Compare crankshaft reference against:

Injection timing
ECU timing signals
Engine-cycle events
E. Fault-injection testing

Simulate:

Sensor Disconnect
Missing Pulse
Extra Pulse
Noisy Signal
Synchronization Loss
F. Digital Twin validation

Verify that crankshaft phase correctly synchronizes:

RPM
+
Injection Timing
+
Vibration
+
Engine Cycle