FR-08 — Mission Simulation & What-if Analysis
1. Objective

The system shall provide a simulation environment capable of reproducing historical engine missions and simulating engine behaviour under different operating, environmental, and mission conditions.

The module shall allow users to perform what-if analysis and evaluate potential effects on engine health, performance, degradation, faults, and mission reliability.

2. Scope

FR-08 shall cover:

Engine behaviour simulation
Historical mission replay
Mission scenario creation
Environmental-condition simulation
High-altitude simulation
Endurance mission simulation
Hot-weather operation
Rapid throttle transitions
What-if analysis
Digital Twin simulation
Parameter modification
Simulation comparison
Health/fault response
Mission risk indicators
Simulation results
Scenario history
3. Simulation Architecture
             MISSION INPUT
                  │
       ┌──────────┼──────────┐
       ↓          ↓          ↓
 Environmental  Engine     Mission
 Conditions     Inputs     Profile
       │          │          │
       └──────────┼──────────┘
                  ↓
          DIGITAL TWIN MODEL
                  ↓
          ENGINE SIMULATION
                  ↓
       ┌──────────┼──────────┐
       ↓          ↓          ↓
 Performance   Health      Fault Risk
       │          │          │
       └──────────┼──────────┘
                  ↓
           SIMULATION OUTPUT

The simulation layer shall use the Digital Twin model developed in FR-04 rather than creating an independent disconnected engine model.

4. Engine Behaviour Simulation

The system shall simulate relevant engine behaviour based on:

RPM
Throttle
Engine load
Fuel flow
CHT
EGT
Oil pressure
Oil temperature
Vibration
Injection timing
Environmental conditions

The simulation shall generate a time-dependent engine response.

Example:

Throttle
   ↓
Engine Load
   ↓
RPM / Fuel Flow
   ↓
Combustion
   ↓
EGT / CHT
   ↓
Engine Health

The initial prototype may use a reduced-order model rather than a high-fidelity computational fluid dynamics model.

5. Historical Mission Replay

The system shall allow previously recorded missions to be replayed.

Mission replay shall reproduce:

Engine telemetry
Mission timeline
Operating conditions
Engine health
Fault events
Digital Twin state
Alerts

Example:

Mission M001
     ↓
Historical Dataset
     ↓
Replay Engine
     ↓
Digital Twin
     ↓
Dashboard

The user shall be able to observe the mission approximately as it occurred originally.

6. Mission Scenario Creation

The system shall allow users to create configurable mission scenarios.

Example:

Mission Scenario

Altitude:       5000 m
Duration:       8 hours
Cruise RPM:     4200
Throttle:       70%
Ambient Temp:   35°C
Fuel Load:      Defined

Users should be able to modify relevant mission parameters before running a simulation.

7. Environmental Condition Simulation

The simulator shall support changes in environmental conditions.

Initial parameters:

Altitude
Ambient temperature
Ambient pressure
Mission duration

Concept:

Environment
     │
     ├── Altitude
     ├── Temperature
     └── Pressure
           ↓
      Engine Model
           ↓
    Engine Behaviour

This allows the Digital Twin to evaluate engine response under different environments.

8. High-Altitude Simulation

The system shall support high-altitude operating scenarios.

Example:

Altitude ↑
   ↓
Ambient Pressure ↓
   ↓
Engine Operating Conditions
   ↓
Performance / Thermal Response

The exact altitude range will be defined later according to the selected engine/UAV reference configuration.

The system shall allow comparison between baseline and high-altitude scenarios.

9. Endurance Mission Simulation

The system shall support long-duration mission scenarios.

Example:

Mission Start
     ↓
Cruise
     ↓
Long-duration Operation
     ↓
Health Monitoring
     ↓
Degradation Tracking
     ↓
Mission End

The simulator should allow health and degradation indicators to evolve over the mission duration.

This will support demonstration of the MALE UAV long-endurance use case.

10. Hot-Weather Operation

The simulator shall support high ambient-temperature scenarios.

Example:

Ambient Temperature ↑
        ↓
Thermal Conditions
        ↓
CHT / EGT Response
        ↓
Thermal Health
        ↓
Fault Risk

The user should be able to compare:

Normal Weather
       vs
Hot Weather

and observe changes in engine behaviour and health.

11. Rapid Throttle Transitions

The simulator shall support rapid changes in throttle/load.

Example:

Throttle

20% ──────┐
          │
          └────── 80%
                  │
                  └────── 40%

The system shall simulate the corresponding transient response in:

RPM
Fuel flow
EGT
CHT
Vibration
Engine load

This is important because transient operation can produce different behaviour from steady-state operation.

12. What-if Analysis

The system shall allow users to modify one or more operating conditions and evaluate the resulting engine behaviour.

Example:

BASELINE

Altitude = 3000 m
Temp     = 30°C
Throttle = 70%

             ↓

WHAT-IF

Altitude = 6000 m
Temp     = 40°C
Throttle = 70%

             ↓

Compare Results

The system shall calculate differences in:

Engine performance
Health
Temperature
Fuel consumption
Fault probability
Degradation indicators
13. Digital Twin Simulation

The simulation shall use the Digital Twin state and model from FR-04.

Concept:

Current Twin State
       +
Scenario Inputs
       ↓
Digital Twin
       ↓
Simulated Future State

This allows the system to answer questions such as:

"If the engine continues under these conditions, what behaviour should we expect?"

This is an important distinction between monitoring the current state and simulating a possible future state.

14. Parameter Modification

Users shall be able to modify selected simulation parameters.

Possible inputs:

RPM
Throttle
Engine load
Altitude
Ambient temperature
Ambient pressure
Mission duration
Fuel condition
Initial health state

The system shall validate user inputs before running the simulation.

15. Simulation Comparison

The system shall support comparison between two or more scenarios.

Example:

             Scenario A       Scenario B

Altitude       3000 m           6000 m
Temperature     30°C             40°C
Throttle         70%              70%

                 ↓

         COMPARE ENGINE RESPONSE

EGT              690°C            725°C
CHT              170°C            184°C
Fuel Flow         18 L/h           21 L/h
Health             94%              87%

Comparison shall support:

Parameter trends
Health trends
Fault indicators
Fuel consumption
Performance indicators
16. Health & Fault Response During Simulation

The simulation shall feed generated engine behaviour into the health and fault modules.

Simulation
    ↓
Simulated Telemetry
    ↓
FR-02 Processing
    ↓
FR-04 Digital Twin
    ↓
FR-05 Health
    ↓
FR-06 Fault Detection
    ↓
FR-07 AI/ML

This makes the simulator useful not only as a visualization but also as a test-data generation and validation environment.

17. Mission Risk Indicators

The system shall provide indicators showing potential mission-level risks identified during simulation.

Potential indicators:

Thermal risk
Lubrication risk
Fuel risk
Vibration risk
Electrical risk
Predicted fault risk
Health degradation risk
RUL risk

Example:

MISSION RISK

Thermal          LOW
Lubrication      LOW
Vibration        MEDIUM
Fuel             LOW
Overall          MEDIUM

These indicators should be derived from the health/fault/prognostic modules rather than independently inventing a second risk model.

18. Simulation Results

After simulation, the system shall generate a structured result containing:

Mission parameters
Engine response
Environmental conditions
Health evolution
Fault events
AI/ML predictions
RUL where available
Mission risk indicators
Performance metrics

Example:

Simulation Result

Duration: 8 hours
Altitude: 5000 m
Ambient Temp: 35°C

Final Health: 88%
Peak CHT: 184°C
Peak EGT: 724°C

Fault Risk: Medium
Estimated RUL: Available
19. Scenario History

The system shall store simulation scenarios and their results.

Each scenario should contain:

Scenario ID
Mission ID/reference
Engine ID
Input conditions
Model version
Simulation timestamp
Output results
Health/fault results

This will allow users to reproduce previous simulations.

20. Acceptance Criteria

FR-08 shall be considered complete when:

 Engine behaviour can be simulated.
 Historical missions can be replayed.
 Custom mission scenarios can be created.
 Environmental conditions can be modified.
 High-altitude scenarios are supported.
 Long-endurance scenarios are supported.
 Hot-weather scenarios are supported.
 Rapid throttle transitions can be simulated.
 What-if analysis is supported.
 Digital Twin is used for simulation.
 Simulation parameters can be modified.
 Multiple scenarios can be compared.
 Simulated data can pass through the health/fault/AI pipeline.
 Mission-level risk indicators can be generated.
 Simulation results can be visualized and stored.
 Previous simulation scenarios can be reproduced.


🔄 FR-08 project flow
             MISSION SCENARIO
                    │
       ┌────────────┼────────────┐
       ↓            ↓            ↓
   Altitude     Temperature    Throttle
       │            │            │
       └────────────┼────────────┘
                    ↓
             DIGITAL TWIN
                    ↓
             ENGINE SIMULATOR
                    ↓
             SIMULATED DATA
                    ↓
          ┌─────────┴─────────┐
          ↓                   ↓
       HEALTH              FAULT/AI
          ↓                   ↓
          └─────────┬─────────┘
                    ↓
             MISSION RESULT
                    ↓
          WHAT-IF COMPARISON