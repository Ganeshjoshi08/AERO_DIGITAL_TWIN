# FR-01 — Engine Data Acquisition

## 1. Objective

The system shall acquire, standardize, validate, and provide aero-piston engine telemetry for downstream Digital Twin, health monitoring, AI/ML analytics, mission simulation, and visualization modules.

The acquisition architecture shall initially support simulated and historical engine data and shall remain extensible for future real-time sensor, ECU/FADEC, CAN, and SocketCAN integration.

---

## 2. Scope

FR-01 covers:

- Engine telemetry acquisition
- Multiple data sources
- Timestamping
- Data validation
- Data quality monitoring
- Data normalization
- Data buffering
- Mission association
- Telemetry storage
- Future CAN/ECU interface readiness

---

## 3. Required Engine Parameters

| ID | Parameter | Unit | Priority |
|---|---|---|---|
| DA-01 | Engine RPM | rpm | Critical |
| DA-02 | Cylinder Head Temperature (CHT) | °C | Critical |
| DA-03 | Exhaust Gas Temperature (EGT) | °C | Critical |
| DA-04 | Oil Pressure | bar | Critical |
| DA-05 | Oil Temperature | °C | High |
| DA-06 | Fuel Flow | L/h or kg/h | High |
| DA-07 | Vibration | g | High |
| DA-08 | Battery Voltage | V | High |
| DA-09 | Alternator Status/Output | V/A or status | High |
| DA-10 | Injection Timing | °CA | High |
| DA-11 | Throttle Position | % | High |
| DA-12 | Engine Load | % | High |
| DA-13 | Ambient Temperature | °C | High |
| DA-14 | Ambient Pressure | kPa | High |
| DA-15 | Altitude | m | High |
| DA-16 | Fuel Consumed | L/kg | Medium |

---

## 4. Data Sources

The system shall support the following data sources:

1. Engine simulator
2. Historical CSV/recorded telemetry
3. Real-time telemetry stream
4. Future CAN interface
5. Future SocketCAN interface
6. Future ECU/FADEC interface

The Digital Twin shall use a common telemetry format independent of the original data source.

---

## 5. Timestamping

Every telemetry measurement shall contain a timestamp.

Timestamping is required for:

- Real-time synchronization
- Mission replay
- Trend analysis
- Fault timeline generation
- Sensor synchronization
- Historical analysis

---

## 6. Data Validation

Incoming data shall pass through validation before being provided to the Digital Twin and AI/ML modules.

Validation shall include:

- Data format validation
- Missing-value detection
- Range validation
- Timestamp validation
- Duplicate detection
- Communication interruption detection
- Sensor data quality checking

---

## 7. Data Quality Status

Each parameter shall have an associated quality status.

Possible states:

- VALID
- WARNING
- INVALID
- MISSING
- STALE

Example:

```text
RPM
Value: 4200 rpm
Status: VALID

EGT
Value: ---
Status: MISSING

## 8. Sampling and Update Rate

The software prototype shall support a configurable telemetry update rate.

An initial prototype stream may be used for development and testing.

Actual sensor sampling frequencies shall be finalized during sensor/interface specification based on the selected sensor, ECU/FADEC interface, engine dynamics, and acquisition hardware.

## 9. Data Normalization

Data from different sources shall be converted into a common internal representation.

Examples:

Temperature → °C
Pressure → bar/kPa
RPM → rpm
Fuel Flow → L/h or kg/h
Vibration → g
Voltage → V

## 10. CAN / SocketCAN Readiness

The acquisition layer shall be modular so that future CAN or SocketCAN interfaces can be added without modifying the Digital Twin core.

Concept:

CSV ───────┐
Simulator ─┤
CAN ───────┤
API ───────┤
Sensors ───┘
      ↓
Common Telemetry Model
      ↓
Digital Twin

## 11. Data Buffering

The acquisition layer shall provide short-term buffering for incoming telemetry.

Buffering shall help handle:

Temporary processing delays
Data bursts
Communication jitter
Streaming synchronization

## 12. Data Storage

Validated telemetry shall be stored with:

Mission ID
Engine ID
Timestamp
Parameter values
Units
Data quality status

Example:

Mission ID	Timestamp	Parameter	Value	Unit	Quality
M001	10:32:01	RPM	4200	rpm	VALID
M001	10:32:01	CHT	175	°C	VALID
M001	10:32:01	EGT	702	°C	VALID

## 13. Mission Association

Every telemetry record shall be associated with a mission/session.

A mission record may contain:

Mission ID
Engine ID
Start time
End time
Environmental conditions
Telemetry data

This information will support mission replay, historical analysis, and fleet-level health monitoring.

## 14. Telemetry Data Contract

The common telemetry representation shall contain:

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
alternator_status
injection_timing

throttle_position
engine_load
altitude
ambient_temperature
ambient_pressure
fuel_consumed

data_quality

This data contract will be used by the simulator, database, Digital Twin, AI/ML modules, and dashboard.

## 15. Acceptance Criteria

FR-01 shall be considered complete when:

 Required engine parameters are defined.
 Simulator data source is supported.
 Historical CSV data source is supported.
 Future CAN/SocketCAN interface is defined.
 Every telemetry record has a timestamp.
 Data validation rules are defined.
 Missing/invalid/stale data can be identified.
 Units are standardized.
 Mission ID association is defined.
 Validated telemetry storage is defined.
 Common telemetry data contract is defined.

## 16. Status

FR-01 — Engine Data Acquisition: DEFINED

Implementation will begin after completion of the complete Functional Requirements specification and system architecture.