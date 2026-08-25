 AI-Enabled Real-Time Digital Twin for Aero Piston Engine
 
                           ┌─────────────────────────────────────┐
                           │          AERO PISTON ENGINE          │
                           │                                     │
                           │  Sensors + ECU / Engine Controller │
                           │                                     │
                           │  RPM | CHT | EGT | Oil | Fuel       │
                           │  Vibration | Battery | Injection   │
                           └──────────────────┬──────────────────┘
                                              │
                                      CAN / SENSOR DATA
                                              │
                                              ▼
                    ╔══════════════════════════════════════════╗
                    ║          DATA ACQUISITION LAYER          ║
                    ║                                          ║
                    ║  CAN Interface / SocketCAN              ║
                    ║  Telemetry Receiver                     ║
                    ║  Data Parser                            ║
                    ║  Timestamping                           ║
                    ╚════════════════════┬═════════════════════╝
                                         │
                                         ▼
                    ╔══════════════════════════════════════════╗
                    ║       DATA PROCESSING & QUALITY          ║
                    ║                                          ║
                    ║  Validation                             ║
                    ║  Filtering                              ║
                    ║  Missing Data Handling                  ║
                    ║  Outlier Detection                      ║
                    ║  Unit Conversion                        ║
                    ╚════════════════════┬═════════════════════╝
                                         │
                                         ▼
              ╔════════════════════════════════════════════════════╗
              ║                 DIGITAL TWIN CORE                 ║
              ║                                                    ║
              ║  ┌────────────────────────────────────────────┐   ║
              ║  │        ENGINE STATE MODEL                  │   ║
              ║  │ RPM | Load | Throttle | Temperature        │   ║
              ║  │ Pressure | Fuel | Vibration | Environment  │   ║
              ║  └──────────────────────┬─────────────────────┘   ║
              ║                         │                         ║
              ║  ┌──────────────────────▼─────────────────────┐   ║
              ║  │       PHYSICS / PERFORMANCE MODEL          │   ║
              ║  │ Thermodynamic Behaviour + Engine Maps     │   ║
              ║  └──────────────────────┬─────────────────────┘   ║
              ║                         │                         ║
              ║  ┌──────────────────────▼─────────────────────┐   ║
              ║  │          STATE ESTIMATION                  │   ║
              ║  │ Actual Engine State + Estimated State     │   ║
              ║  └──────────────────────┬─────────────────────┘   ║
              ║                         │                         ║
              ║  ┌──────────────────────▼─────────────────────┐   ║
              ║  │       ACTUAL vs EXPECTED ENGINE           │   ║
              ║  │             RESIDUAL ENGINE               │   ║
              ║  └──────────────────────┬─────────────────────┘   ║
              ╚═════════════════════════╪════════════════════════╝
                                        │
                         ┌──────────────┼──────────────┐
                         │              │              │
                         ▼              ▼              ▼
               ╔══════════════╗ ╔══════════════╗ ╔══════════════╗
               ║ HEALTH       ║ ║   AI / ML    ║ ║ SIMULATION   ║
               ║ MONITORING   ║ ║    LAYER     ║ ║   ENGINE     ║
               ║              ║ ║              ║ ║              ║
               ║ Health Index ║ ║ Anomaly      ║ ║ Mission      ║
               ║ Subsystems   ║ ║ Detection    ║ ║ Simulation   ║
               ║ Trends       ║ ║ Fault        ║ ║ What-if      ║
               ║              ║ ║ Prediction   ║ ║ Scenarios    ║
               ╚══════╤═══════╝ ║ Degradation  ║ ╚══════╤═══════╝
                      │          ║ RUL          ║        │
                      │          ║ Explainable  ║        │
                      │          ║ AI           ║        │
                      │          ╚══════╤═══════╝        │
                      │                 │                │
                      └─────────────────┼────────────────┘
                                        ▼
                         ╔══════════════════════════╗
                         ║   PREDICTIVE INTELLIGENCE║
                         ║                          ║
                         ║ Fault Probability       ║
                         ║ Degradation Status      ║
                         ║ RUL Estimation          ║
                         ║ Maintenance Advisory    ║
                         ╚─────────────┬────────────╝
                                       │
                                       ▼
                         ╔══════════════════════════╗
                         ║       DATA LAYER         ║
                         ║                          ║
                         ║ PostgreSQL               ║
                         ║                          ║
                         ║ Telemetry                ║
                         ║ Engine State             ║
                         ║ Health Records           ║
                         ║ Fault Events             ║
                         ║ AI Predictions           ║
                         ║ RUL History              ║
                         ║ Mission Data             ║
                         ║ Maintenance History      ║
                         ╚─────────────┬────────────╝
                                       │
                                       ▼
                         ╔══════════════════════════╗
                         ║      BACKEND / API       ║
                         ║                          ║
                         ║ Data Services            ║
                         ║ Digital Twin Services   ║
                         ║ AI Services             ║
                         ║ Mission Services        ║
                         ║ Authentication           ║
                         ║ Real-Time API            ║
                         ╚─────────────┬────────────╝
                                       │
                                       ▼
             ╔════════════════════════════════════════════╗
             ║              DASHBOARD / HMI              ║
             ║                                            ║
             ║ ┌──────────┐ ┌──────────┐ ┌─────────────┐ ║
             ║ │ Overview │ │   Live   │ │ Digital Twin│ ║
             ║ │          │ │Monitoring│ │             │ ║
             ║ └──────────┘ └──────────┘ └─────────────┘ ║
             ║                                            ║
             ║ ┌──────────┐ ┌──────────┐ ┌─────────────┐ ║
             ║ │  Faults  │ │AI/RUL    │ │   Trends    │ ║
             ║ │ & Alerts │ │          │ │ & Analytics  │ ║
             ║ └──────────┘ └──────────┘ └─────────────┘ ║
             ║                                            ║
             ║ ┌──────────┐ ┌──────────┐ ┌─────────────┐ ║
             ║ │ Mission  │ │Simulation│ │  Reports    │ ║
             ║ │ Replay   │ │          │ │             │ ║
             ║ └──────────┘ └──────────┘ └─────────────┘ ║
             ╚════════════════════════════════════════════╝

             But this is still the software view. Our MAIN project architecture should show 4 major worlds:
                 ┌─────────────────────────┐
                 │       PHYSICAL WORLD    │
                 │                         │
                 │ Aero Piston Engine      │
                 │ Sensors + ECU           │
                 └────────────┬────────────┘
                              │
                         CAN / Telemetry
                              │
                              ▼
                 ┌─────────────────────────┐
                 │      EDGE / UAV         │
                 │                         │
                 │ Data Acquisition        │
                 │ Preprocessing           │
                 │ Local Monitoring        │
                 │ Edge AI (Future)        │
                 └────────────┬────────────┘
                              │
                         Telemetry Link
                              │
                              ▼
                 ┌─────────────────────────┐
                 │      GROUND SYSTEM      │
                 │                         │
                 │ Digital Twin            │
                 │ Physics Model           │
                 │ AI/ML                   │
                 │ Database                │
                 │ Simulation              │
                 └────────────┬────────────┘
                              │
                              ▼
                 ┌─────────────────────────┐
                 │       USER / GCS        │
                 │                         │
                 │ Dashboard               │
                 │ Alerts                  │
                 │ RUL                     │
                 │ Mission Replay          │
                 │ Maintenance Advisory    │
                 └─────────────────────────┘