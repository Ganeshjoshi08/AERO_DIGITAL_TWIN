SA-04 — CAN / Telemetry Architecture
1. Purpose

CAN/Telemetry Architecture defines how engine sensor and ECU data will be transmitted, received, decoded, validated and delivered to the Digital Twin.

Primary objectives:

Real-time engine data acquisition
CAN communication support
SocketCAN support
ECU/FADEC integration
Simulator integration
Message decoding
Timestamping
Data validation
Communication fault detection
Future hardware integration
2. Overall CAN Architecture
                 ┌──────────────────────┐
                 │   AERO PISTON ENGINE │
                 └──────────┬───────────┘
                            │
                 ┌──────────▼───────────┐
                 │     SENSORS          │
                 │ RPM / CHT / EGT /    │
                 │ Oil / Fuel / Vib etc.│
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │       ECU / FADEC    │
                 └──────────┬───────────┘
                            │
                       CAN BUS
                            │
                            ▼
                 ┌──────────────────────┐
                 │ CAN INTERFACE        │
                 │ Hardware / Adapter   │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │ SocketCAN / Driver   │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │ CAN DATA ACQUISITION │
                 │       M01            │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │ Message Decoder      │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │ Validation &          │
                 │ Preprocessing M02     │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │ DIGITAL TWIN CORE    │
                 └──────────────────────┘
3. Supported Data Sources

Our architecture shall support:

Primary
CAN Bus
Development
SocketCAN
Additional interfaces
Serial
Ethernet
UDP
TCP
REST / API
Simulator
CSV Replay

But CAN will remain the primary engine-telemetry interface in our architecture.

4. Why CAN?

CAN is suitable for engine/vehicle-type embedded systems because it provides:

Multi-node communication
Message prioritization
Error detection
Robust communication
Deterministic arbitration
Low overhead
Widely used automotive/aerospace-adjacent embedded interfaces

For our prototype, CAN also gives us a realistic pathway from:

Simulator
   ↓
Virtual CAN
   ↓
SocketCAN
   ↓
Our Software

to eventually:

Real Engine
   ↓
ECU
   ↓
Physical CAN
   ↓
CAN Interface
   ↓
Our Software
5. CAN Network Nodes

Our conceptual network:

                    ┌──────────────┐
                    │ ECU / FADEC  │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │   CAN BUS    │
                    └──┬─────┬─────┘
                       │     │
              ┌────────▼─┐ ┌─▼──────────┐
              │ DAQ Node │ │ Other ECU/ │
              │          │ │ Avionics   │
              └────┬─────┘ └────────────┘
                   │
                   ▼
            ┌───────────────┐
            │ Edge Computer │
            └───────────────┘
                   │
                   ▼
             Digital Twin

For our prototype, we can simplify this to:

Simulator / ECU
      ↓
Virtual CAN
      ↓
SocketCAN
      ↓
Edge Computer
      ↓
Backend
6. CAN Message Architecture

A CAN message conceptually contains:

┌──────────────┬──────────────┐
│ CAN ID       │ Data Payload │
└──────────────┴──────────────┘

Additional metadata handled by our software:

Timestamp
Interface
Channel
Data Quality
Sequence Information
7. Parameter-to-CAN Mapping

We shall maintain a mapping between our EP parameters and CAN messages.

Example:

Parameter	ID	CAN Message	Payload
RPM	EP-01	TBD	RPM value
CHT	EP-02	TBD	Temperature
EGT	EP-03	TBD	Temperature
Oil Pressure	EP-04	TBD	Pressure
Oil Temperature	EP-05	TBD	Temperature
Fuel Flow	EP-06	TBD	Flow
Vibration	EP-07	TBD	Vibration feature/raw data
Battery Voltage	EP-08	TBD	Voltage
Alternator	EP-09	TBD	Status/output
Injection Timing	EP-10	TBD	Timing
Throttle	EP-11	TBD	Percentage
Engine Load	EP-12	TBD	Percentage
Ambient Temp	EP-13	TBD	Temperature
Ambient Pressure	EP-14	TBD	Pressure
MAP	EP-15	TBD	Pressure
Fuel Pressure	EP-16	TBD	Pressure
Crank Position	EP-17	TBD	Position/phase
Important

TBD CAN IDs are intentional.

We should not invent real ECU CAN IDs before selecting the actual engine/ECU protocol.

For our prototype we can define a project-specific simulation CAN ID map later.

8. Prototype CAN ID Strategy

For our simulated system, we can create our own logical message IDs.

Example:

0x100 → Engine Speed
0x101 → Temperatures
0x102 → Oil System
0x103 → Fuel System
0x104 → Electrical System
0x105 → Engine Control
0x106 → Environmental
0x107 → Vibration
0x108 → Engine State

But these are prototype IDs only.

When a real engine/ECU is selected:

Actual ECU CAN Specification
        ↓
Official CAN IDs
        ↓
Mapping Layer
        ↓
Our Internal Parameter IDs

This separation is important.

9. Internal Parameter Mapping

Our software should not directly depend on CAN IDs.

Instead:

CAN ID
  ↓
CAN Decoder
  ↓
Signal Definition
  ↓
Internal Parameter ID
  ↓
EP-01 / EP-02 / ...

Example:

CAN ID: 0x100
      ↓
Decode RPM
      ↓
EP-01
      ↓
RPM = 5200

This makes the system hardware-independent.

10. Message Decoder

The decoder converts raw CAN payload into meaningful engineering values.

Concept:

Raw CAN Frame
      ↓
CAN ID Identification
      ↓
Payload Extraction
      ↓
Byte Order / Scaling
      ↓
Engineering Unit
      ↓
Parameter Object

Example concept:

Raw Value
   ↓
Scaling
   ↓
RPM

For example, a signal may use:

Physical Value =
Raw Value × Scale + Offset

Actual scale, offset, byte order and bit positions shall come from the selected CAN specification.

11. CAN Data Object

Internally, decoded data should follow a common structure.

Concept:

EngineData {
    timestamp
    engine_id
    parameter_id
    value
    unit
    source
    quality
}

Example:

EngineData

timestamp    = 10:32:01.250
engine_id    = E001
parameter_id = EP-01
value        = 5200
unit         = RPM
source       = CAN
quality      = VALID

This common representation lets the rest of the system ignore whether data came from:

CAN
Simulator
CSV
API
12. Timestamp Strategy

CAN messages need reliable timestamps.

Architecture:

CAN Frame
    ↓
Receive Time
    ↓
Timestamp
    ↓
Decoded Data

For real hardware, the system should preferably preserve the most accurate available source timestamp.

For simulator data:

Simulation Time

may be used.

The system should distinguish:

Source Timestamp
vs
System Receive Timestamp

where both are available.

13. CAN Error Handling

CAN communication errors shall be monitored.

Potential conditions:

BUS_OFF
ERROR_PASSIVE
ERROR_WARNING
MESSAGE_TIMEOUT
INVALID_FRAME
CRC / Hardware Error
CAN Interface Failure

At application level:

No RPM message for expected interval
        ↓
Communication Warning

If prolonged:

Communication Fault
14. Message Timeout Monitoring

Every periodic CAN message should have an expected update interval.

Concept:

Expected:
RPM message every X ms

Received:
✓
✓
✓
✗
✗

Then:

Message Timeout
      ↓
Quality = STALE / COMMUNICATION_FAULT

This is important because missing data should not be interpreted as zero.

15. Data Quality Flow
CAN Frame
    ↓
Decoded
    ↓
Timestamp Valid?
    ↓
Range Valid?
    ↓
Message Fresh?
    ↓
Sensor Status OK?
    ↓
VALID / WARNING / INVALID

Example:

RPM = 5200
CAN received = YES
Timestamp = OK
Range = OK

        ↓

Quality = VALID
16. SocketCAN Architecture

For Linux-based development, SocketCAN provides the software interface to CAN.

Concept:

CAN Hardware / Virtual CAN
          ↓
      Linux Kernel
          ↓
       SocketCAN
          ↓
     CAN Application
          ↓
    Data Acquisition

For development without physical CAN hardware:

Virtual CAN Interface
        ↓
     SocketCAN
        ↓
   Our Application

This is very useful for our prototype.

17. Virtual CAN Development

We can eventually develop and test the entire CAN pipeline without physical hardware.

┌─────────────────────┐
│ Engine Simulator    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Virtual CAN         │
│ Interface           │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ SocketCAN           │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Data Acquisition    │
└─────────────────────┘

Later:

Virtual CAN
    ↓
Replace with
Physical CAN

The rest of the software can remain largely unchanged.

18. Telemetry Gateway

CAN data may need to travel from onboard/edge system to the Ground Control Station.

Concept:

ENGINE
  ↓
ECU
  ↓
CAN
  ↓
EDGE COMPUTER
  ↓
Telemetry Gateway
  ↓
Network
  ↓
Ground System
  ↓
Digital Twin

The telemetry gateway can handle:

Packetization
Timestamping
Data compression where appropriate
Communication status
Secure transport
Network transmission
19. Edge vs Ground Processing

We should not send every raw high-frequency signal to the ground.

Edge

Perform:

CAN decoding
Basic validation
Filtering
Feature extraction
Critical anomaly checks
Data compression/aggregation
Ground

Perform:

Digital Twin
Heavy AI/ML
Historical analytics
RUL
Mission replay
Visualization

Concept:

                UAV
┌────────────────────────────┐
│ Sensors → ECU → CAN        │
│             ↓              │
│       Edge Processing      │
└─────────────┬──────────────┘
              │
          Telemetry
              │
              ▼
┌────────────────────────────┐
│       Ground System        │
│                            │
│ Digital Twin               │
│ AI/ML                      │
│ Database                   │
│ Dashboard                  │
└────────────────────────────┘

For the prototype, we can initially run everything on one development machine while preserving these logical boundaries.

20. Telemetry Data Packet

At application level, we can use a normalized structure.

Concept:

{
    timestamp,
    engine_id,
    mission_id,
    parameter_id,
    value,
    unit,
    quality,
    source
}

For multiple parameters, batching can be used:

TelemetryPacket
 ├── timestamp
 ├── engine_id
 ├── mission_id
 └── parameters[]

This will reduce unnecessary communication overhead.

21. Security Considerations

The telemetry architecture should eventually support:

Authentication
Encryption
Message integrity
Device identification
Access control
Secure logging

However, security implementation will be documented separately in:

SA-10-Security-Architecture.md

For now, we only define the security boundary.

22. Real Engine vs Simulator

This is a very important design decision.

Simulator
Engine Simulator
      ↓
Synthetic CAN Messages
      ↓
SocketCAN
      ↓
Data Acquisition
Real Engine
Real Engine
      ↓
ECU / FADEC
      ↓
Physical CAN
      ↓
CAN Interface
      ↓
Data Acquisition

Both should produce the same internal format:

EngineData

Therefore:

           Simulator
               │
               ▼
            CAN Data
               │
               ├──────────────┐
               │              │
               ▼              ▼
          CAN Decoder    Real ECU CAN
               │              │
               └──────┬───────┘
                      ▼
                 EngineData
                      ↓
                 Digital Twin

This is one of the most important architectural principles for our prototype.

23. CAN/Telemetry Failure Handling

The system shall detect:

CAN interface unavailable
CAN Interface DOWN
        ↓
Communication Alert
Message timeout
No message
   ↓
Parameter = STALE
Invalid message
Invalid frame
   ↓
Discard / Flag
Sensor failure
ECU reports sensor fault
        ↓
Parameter Quality = SENSOR_FAULT
Telemetry link failure
UAV → GCS communication lost
        ↓
Ground data becomes stale

The edge system should continue local processing where possible.

24. Complete CAN/Telemetry Flow
┌─────────────────────────────┐
│      ENGINE + SENSORS       │
└──────────────┬──────────────┘
               ▼
        ┌─────────────┐
        │ ECU / FADEC │
        └──────┬──────┘
               ▼
          ┌─────────┐
          │ CAN BUS │
          └────┬────┘
               ▼
      ┌──────────────────┐
      │ CAN Interface    │
      └────────┬─────────┘
               ▼
      ┌──────────────────┐
      │ SocketCAN        │
      └────────┬─────────┘
               ▼
      ┌──────────────────┐
      │ M01 Acquisition  │
      └────────┬─────────┘
               ▼
      ┌──────────────────┐
      │ CAN Decoder      │
      └────────┬─────────┘
               ▼
      ┌──────────────────┐
      │ Validation       │
      └────────┬─────────┘
               ▼
      ┌──────────────────┐
      │ EngineData       │
      │ Internal Model   │
      └────────┬─────────┘
               ▼
       DIGITAL TWIN CORE