SA-10 — Security Architecture
1. Purpose

The Security Architecture defines security controls for protecting:

Engine telemetry
CAN communication
UAV-to-GCS communication
Digital Twin data
AI/ML models
Database
Dashboard
User access
System logs
Maintenance information

The architecture shall follow a defence-in-depth approach.

2. Security Architecture Overview
                  ┌───────────────────┐
                  │   AERO ENGINE     │
                  │ Sensors + ECU     │
                  └─────────┬─────────┘
                            │
                           CAN
                            │
                            ▼
                  ┌───────────────────┐
                  │   EDGE / UAV      │
                  │                   │
                  │ Authentication    │
                  │ Validation        │
                  │ Secure Storage    │
                  └─────────┬─────────┘
                            │
                       Secure Link
                            │
                            ▼
              ┌───────────────────────────┐
              │       GROUND SYSTEM       │
              │                           │
              │ Gateway                   │
              │ Digital Twin              │
              │ AI/ML                     │
              │ Database                  │
              │ Dashboard                 │
              └───────────────────────────┘
3. Defence-in-Depth Principle

Security should not depend on one mechanism.

Instead:

Authentication
      +
Authorization
      +
Encryption
      +
Integrity
      +
Validation
      +
Logging
      +
Monitoring

If one layer fails, other layers should still provide protection.

4. Security Zones

Our architecture will define logical security zones.

┌─────────────────────┐
│ ZONE 1              │
│ ENGINE / UAV        │
│                     │
│ Sensors / ECU / CAN │
└──────────┬──────────┘
           │
       Protected
       Interface
           │
           ▼
┌─────────────────────┐
│ ZONE 2              │
│ EDGE                │
│                     │
│ DAQ / Processing    │
└──────────┬──────────┘
           │
      Secure Link
           │
           ▼
┌─────────────────────┐
│ ZONE 3              │
│ GROUND SYSTEM       │
│                     │
│ DT / AI / DB / HMI  │
└─────────────────────┘
5. CAN Security

CAN itself should not be assumed to provide complete application-level security.

Therefore, our system should add controls around CAN data.

Required controls
Message validation
CAN ID allowlisting
Message freshness checking
Rate monitoring
Timeout detection
Source/interface validation
Invalid message rejection
Event logging

Concept:

CAN Frame
    ↓
CAN ID Check
    ↓
Format Check
    ↓
Freshness Check
    ↓
Range Check
    ↓
VALID / REJECT
6. CAN Message Allowlisting

Only expected message IDs should be accepted by the application.

Example:

Allowed:
0x100
0x101
0x102
0x103
...

Unexpected message:

0x7FF
   ↓
Unexpected
   ↓
Log + Reject

The actual allowed IDs will depend on the selected ECU/prototype CAN specification.

7. Message Freshness

A valid message that is extremely old should not be treated as current.

Example:

Timestamp
   ↓
Age Check
   ↓
Fresh → ACCEPT
Old   → STALE

This prevents stale telemetry from appearing as live engine state.

8. Replay Protection

Repeated old messages can cause incorrect system behaviour.

Therefore, the application should use:

Timestamps
Sequence numbers where available
Mission/session identifiers

Concept:

Message
 ↓
Timestamp
 +
Sequence
 +
Session
 ↓
Fresh / Duplicate / Old
9. UAV-to-GCS Communication Security

The telemetry link should provide:

UAV
 │
 │ Authentication
 │ Encryption
 │ Integrity
 ▼
GCS

The exact protocol will be finalized during implementation.

For the architecture, the requirements are:

Confidentiality where required
Authentication
Integrity
Replay resistance
Session management
10. Authentication

Only trusted devices/services should connect to the system.

Potential identities:

UAV Edge Device
Ground Gateway
Backend Service
Dashboard User
AI Service
Database Service

Concept:

Connection Request
       ↓
Identity Verification
       ↓
Authenticated?
    ↙       ↘
  YES        NO
   ↓          ↓
ALLOW       REJECT
11. Authorization

Authentication answers:

Who are you?

Authorization answers:

What are you allowed to do?

Our dashboard roles:

Operator
Engineer
Maintenance
Administrator

Example:

Operation	Operator	Engineer	Maintenance	Admin
View Live Data	✅	✅	✅	✅
View Alerts	✅	✅	✅	✅
View AI Results	Limited	✅	✅	✅
Run Simulation	❌	✅	Limited	✅
View Maintenance	Limited	✅	✅	✅
Modify Configuration	❌	Limited	❌	✅
Manage Users	❌	❌	❌	✅
12. Principle of Least Privilege

Each user/service should receive only the permissions it needs.

Example:

Dashboard
   ↓
READ telemetry
READ health
READ alerts

But NOT:

DELETE telemetry
CHANGE ML models
MODIFY ECU configuration

This reduces the impact of compromised accounts.

13. Database Security

Database security controls:

Authentication
Role-based access
Least privilege
Encrypted connections
Backup
Audit logging
Input validation
Data integrity checks

Concept:

Application
     ↓
Authenticated DB Connection
     ↓
Authorized Query
     ↓
Database
14. Data Encryption

Sensitive data should be protected:

In transit
UAV
 ↓
Encrypted Communication
 ↓
GCS
At rest
Database
 ↓
Protected Storage

The exact cryptographic algorithms and key-management scheme should be finalized based on the deployment environment and applicable defence requirements.

15. Credential Management

Credentials should never be hard-coded.

Bad:

username = "admin"
password = "123456"

Instead use:

Environment Configuration
+
Secrets Management
+
Key Rotation

For development, environment variables/secrets files can be used.

Production deployment should use an appropriate secure secret-management mechanism.

16. API Security

Dashboard communicates with backend through APIs.

Dashboard
     │
 Authentication
     ▼
Backend API
     │
 Authorization
     ▼
Data

API security should include:

Authentication
Authorization
Input validation
Rate limiting where appropriate
Error handling
Request logging
Secure transport
17. Input Validation

All external data should be treated as untrusted until validated.

Sources include:

CAN
Telemetry
API
CSV
Simulation Input
User Input

Pipeline:

Input
 ↓
Schema Validation
 ↓
Range Validation
 ↓
Type Validation
 ↓
Sanitization
 ↓
Process
18. Engine Data Integrity

We must preserve the distinction between:

RAW DATA
     ↓
PROCESSED DATA
     ↓
ESTIMATED DATA
     ↓
AI PREDICTION

These must not be confused.

For example:

EGT
720°C
Source: SENSOR
Quality: VALID

versus:

Expected EGT
680°C
Source: DIGITAL_TWIN

versus:

Fault Probability
72%
Source: AI MODEL
19. AI/ML Security

AI models also require protection.

Threats include:

Unauthorized model replacement
Training-data poisoning
Incorrect model version
Unauthorized access
Manipulated inference inputs

Controls:

Model
 ↓
Version
 ↓
Integrity Check
 ↓
Approved Model Registry
 ↓
Deployment

Only approved model versions should be deployed.

20. Model Registry Security

Our model_registry should record:

Model ID
Model Name
Version
Training Dataset
Training Date
Metrics
Approval Status
Checksum / Integrity Reference

Example:

Model:
Anomaly Detector

Version:
1.2

Status:
APPROVED
21. Explainability and Auditability

When an AI model generates an important prediction, the system should retain:

Prediction
+
Timestamp
+
Engine
+
Mission
+
Model Version
+
Important Features
+
Confidence

This allows engineers to understand which model produced which prediction and why.

22. Audit Logging

Important actions should be logged.

Examples:

User Login
Configuration Change
Model Deployment
Fault Acknowledgement
Maintenance Update
Simulation Run
Report Generation
Data Export

Example:

2026-08-25 20:32
User: Engineer01
Action: Simulation Started
Mission: M001
23. System Health Monitoring

Security monitoring should include the software infrastructure itself.

CAN Interface
Backend
Database
AI Service
Digital Twin
Telemetry
Dashboard

If something fails:

Service Failure
      ↓
System Alert
      ↓
Log Event
      ↓
Recovery / Investigation
24. Communication Failure

If UAV-GCS communication is lost:

Telemetry Lost
     ↓
Edge Continues
     ↓
Local Buffer
     ↓
Critical Event Logging
     ↓
Connection Restored
     ↓
Synchronization

This is both a reliability and security-related design consideration.

25. Backup & Recovery

Database should have a backup strategy.

Live Database
      ↓
Backup
      ↓
Protected Storage

Backup should cover:

Telemetry
Mission history
Fault events
Maintenance records
Model registry
Configuration

Recovery procedures should be tested rather than merely documented.

26. Software Update Security

Future edge devices may require software/model updates.

Update process:

Update Package
      ↓
Verify Source
      ↓
Integrity Verification
      ↓
Version Check
      ↓
Install
      ↓
Health Check

If update fails:

Rollback
27. Secure Development

Our development process should follow basic secure-development practices:

Dependency management
Version control
Code review
Secret scanning
Input validation
Logging
Vulnerability checks
Separate development/testing/production configurations
28. Security Boundaries

Complete security boundary:

                 UAV ZONE
┌───────────────────────────────────┐
│ Engine → ECU → CAN → Edge        │
└─────────────────┬─────────────────┘
                  │
             SECURE LINK
                  │
                  ▼
┌───────────────────────────────────┐
│ GROUND ZONE                        │
│                                   │
│ Gateway                           │
│ Digital Twin                      │
│ AI/ML                             │
│ Database                          │
│ Dashboard                         │
└───────────────────────────────────┘
                  │
            Optional Cloud
                  │
                  ▼
         Fleet Analytics
29. Security Event Flow
Security Event
      ↓
Detection
      ↓
Validation
      ↓
Classification
      ↓
Logging
      ↓
Alert
      ↓
Response

Example:

Unexpected CAN Message
        ↓
Message Rejected
        ↓
Security Event Logged
        ↓
Operator Alert
30. Security + Digital Twin

Security is especially important because manipulated telemetry could affect the Digital Twin.

False Sensor Data
      ↓
Digital Twin
      ↓
Wrong Engine State
      ↓
Wrong AI Prediction
      ↓
Wrong Maintenance Advice

Therefore:

Data integrity is as important as data confidentiality.

Our system should prioritize protecting the correctness and provenance of telemetry.

31. Security + AI

Similarly:

Manipulated Input
       ↓
AI Model
       ↓
Wrong Prediction

Therefore AI inputs should carry:

Source
Timestamp
Quality
Validation Status
32. Security Architecture — Complete
                       ENGINE
                          │
                         CAN
                          │
                          ▼
                 ┌─────────────────┐
                 │ EDGE SECURITY   │
                 │                 │
                 │ Validation      │
                 │ Allowlisting    │
                 │ Freshness       │
                 │ Local Logging   │
                 └────────┬────────┘
                          │
                     Secure Link
                          │
                          ▼
              ┌─────────────────────────┐
              │     GROUND SECURITY     │
              │                         │
              │ Authentication          │
              │ Authorization            │
              │ Encryption               │
              │ API Security             │
              │ Input Validation         │
              └────────────┬────────────┘
                           │
          ┌────────────────┼─────────────────┐
          ▼                ▼                 ▼
      Digital Twin       AI/ML           Database
          │                │                 │
          └────────────────┼─────────────────┘
                           ▼
                       Dashboard
                           │
                           ▼
                     Audit Logging
33. Security Principles

Our system will follow:

Defense in depth
Least privilege
Zero trust between services where practical
Secure communication
Data integrity
Authentication
Authorization
Auditability
Secure model management
Failure containment
Backup and recovery
Secure updates