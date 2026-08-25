# AeroTwin — Technology Stack

## 1. Core Programming Language

### Python 3.12+

**Why?**

Python provides a single ecosystem for AI/ML, Digital Twin development, simulation, numerical computing, data processing, and backend development.

---

## 2. Backend Framework

### FastAPI

**Why?**

FastAPI is a lightweight and high-performance Python framework that provides excellent support for REST APIs and WebSocket-based real-time communication.

---

## 3. Database

### PostgreSQL

**Why?**

PostgreSQL is a reliable relational database suitable for managing structured engine data, missions, telemetry, faults, maintenance records, AI predictions, and Digital Twin states.

---

## 4. Time-Series Database Extension

### TimescaleDB

**Why?**

TimescaleDB extends PostgreSQL for efficient storage and querying of high-frequency time-series telemetry data.

**Note:** It will be considered when the telemetry workload requires it and will not be mandatory in the initial prototype.

---

## 5. Machine Learning

### scikit-learn

**Why?**

scikit-learn provides mature and easy-to-use algorithms for anomaly detection, classification, feature processing, and initial predictive models.

---

## 6. Advanced Machine Learning

### XGBoost

**Why?**

XGBoost performs strongly on structured and tabular engine data and can provide useful feature-importance information for fault prediction.

---

## 7. Deep Learning

### PyTorch

**Why?**

PyTorch provides a flexible platform for future advanced time-series models such as LSTM, GRU, Transformers, and advanced RUL estimation models.

**Stage:** Later implementation phase.

---

## 8. Data Processing

### Pandas

**Why?**

Pandas will be used for telemetry cleaning, transformation, analysis, dataset preparation, and time-series processing.

---

## 9. Numerical Computing

### NumPy

**Why?**

NumPy provides efficient numerical operations required for physics calculations, Digital Twin modelling, simulations, and feature calculations.

---

## 10. Scientific Computing

### SciPy

**Why?**

SciPy provides tools for engineering calculations, optimization, signal processing, numerical methods, and scientific analysis.

---

## 11. Digital Twin

### Python-Based Hybrid Model

**Why?**

The Digital Twin will combine physics-based engine behaviour with real-time telemetry and data-driven models, making Python suitable for integrating all components.

---

## 12. CAN Communication

### SocketCAN + python-can

**Why?**

SocketCAN provides Linux-based CAN support, while python-can allows the Python application to communicate with CAN interfaces and process CAN frames.

This provides a development path from:

**Simulator → Virtual CAN → Test CAN → Real CAN Hardware**

---

## 13. Frontend

### React + TypeScript

**Why?**

React provides a component-based architecture for building the complex real-time dashboard, while TypeScript improves type safety, maintainability, and reliability.

---

## 14. Frontend Build Tool

### Vite

**Why?**

Vite provides fast development startup, hot reloading, and efficient build tooling for the React application.

---

## 15. UI Styling

### Tailwind CSS

**Why?**

Tailwind CSS enables rapid development of responsive, consistent, and professional dashboard interfaces using a utility-based styling approach.

---

## 16. Data Visualization

### Plotly

**Why?**

Plotly will be used for interactive engineering visualizations such as telemetry trends, health curves, Digital Twin residuals, RUL, and mission replay.

---

## 17. API Communication

### REST API

**Why?**

REST provides a simple and standard communication mechanism between the frontend and backend for structured data access, configuration, missions, faults, and reports.

---

## 18. Real-Time Communication

### WebSocket

**Why?**

WebSocket enables continuous two-way communication and will be used for live engine telemetry, health updates, alerts, and real-time dashboard updates.

---

## 19. Engine & Mission Simulation

### Python-Based Simulator

**Why?**

Python provides the flexibility required to simulate engine behaviour, mission profiles, environmental conditions, operating conditions, and controlled fault scenarios.

---

## 20. Testing

### Pytest

**Why?**

Pytest provides a simple and powerful framework for automated testing of the backend, Digital Twin, simulator, data pipeline, and AI/ML modules.

---

## 21. Containerization

### Docker

**Why?**

Docker provides reproducible environments and allows backend, database, AI services, and other components to be deployed consistently.

**Stage:** Introduced after the basic local prototype is functional.

---

## 22. Version Control

### Git + GitHub

**Why?**

Git tracks code and documentation changes, while GitHub provides centralized project hosting, collaboration, version management, and backup.

---

# Final Technology Stack

The finalized baseline stack for AeroTwin is:

### Core
- Python 3.12+
- FastAPI
- PostgreSQL

### AI / ML
- scikit-learn
- XGBoost
- PyTorch *(Later)*

### Digital Twin & Engineering
- Python
- NumPy
- Pandas
- SciPy

### Communication
- SocketCAN
- python-can
- REST API
- WebSocket

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Plotly

### Simulation & Testing
- Python Simulator
- Pytest

### Deployment & Collaboration
- Docker
- Git
- GitHub

### Optional / Future
- TimescaleDB
- Advanced Deep Learning
- Edge AI
- Real CAN Hardware
- UAV/GCS Integration

---

# Technology Selection Principle

The technology stack has been selected based on:

1. **Open-source availability**
2. **Low development cost**
3. **Ease of integration**
4. **Real-time capability**
5. **AI/ML support**
6. **Engineering and scientific computing support**
7. **Scalability**
8. **Future UAV/GCS compatibility**
9. **Maintainability**
10. **Team learning and development feasibility**

---

# Technology Stack Status

**Status: BASELINE STACK FINALIZED ✅**

Major technology changes during implementation should be documented and justified before adoption.