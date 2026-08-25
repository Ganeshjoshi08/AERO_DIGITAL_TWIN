                    ┌──────────────────────────────┐
                    │       UAV AERO ENGINE        │
                    │                              │
                    │  Engine + Sensors + ECU      │
                    └──────────────┬───────────────┘
                                   │
                         CAN / Telemetry
                                   │
                                   ▼
                    ┌──────────────────────────────┐
                    │    DATA ACQUISITION LAYER    │
                    │                              │
                    │ CAN / SocketCAN / Simulator  │
                    └──────────────┬───────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────────┐
                    │     DATA PROCESSING LAYER    │
                    │                              │
                    │ Validation                   │
                    │ Filtering                    │
                    │ Synchronization              │
                    │ Feature Extraction           │
                    └──────────────┬───────────────┘
                                   │
                                   ▼
              ┌──────────────────────────────────────────┐
              │          DIGITAL TWIN CORE               │
              │                                          │
              │  Virtual Engine Model                    │
              │  State Estimation                        │
              │  Physics / Performance Model             │
              │  Expected Behaviour                      │
              │  Real-Time Synchronization               │
              └───────────────────┬──────────────────────┘
                                  │
                   ┌──────────────┴──────────────┐
                   │                             │
                   ▼                             ▼
       ┌────────────────────────┐    ┌────────────────────────┐
       │      AI / ML LAYER     │    │   MISSION SIMULATION   │
       │                        │    │                        │
       │ Anomaly Detection      │    │ Mission Replay         │
       │ Fault Prediction       │    │ High Altitude          │
       │ Degradation Analysis   │    │ Hot Weather            │
       │ RUL Estimation         │    │ Endurance              │
       └────────────┬───────────┘    └────────────┬───────────┘
                    │                             │
                    └──────────────┬──────────────┘
                                   ▼
                    ┌──────────────────────────────┐
                    │       HEALTH ENGINE          │
                    │                              │
                    │ Health Index                 │
                    │ Fault Severity               │
                    │ Maintenance Advisory         │
                    └──────────────┬───────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────────┐
                    │       DATABASE / HISTORY      │
                    │                              │
                    │ Telemetry                    │
                    │ Events                       │
                    │ Faults                       │
                    │ Health Trends                │
                    │ Mission History               │
                    └──────────────┬───────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────────┐
                    │        DASHBOARD / HMI       │
                    │                              │
                    │ Real-Time Health             │
                    │ Alerts                       │
                    │ Trends                       │
                    │ RUL                          │
                    │ Mission Replay               │
                    │ Reports                      │
                    └──────────────────────────────┘