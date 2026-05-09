# Production-Ready Architecture Plan
## Aegis HIoT - Healthcare IoT Security Platform

---

## 1. Target Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      CDN (CloudFlare)                          │
│                    SSL/TLS Termination                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   FRENDEND (Vercel)                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐   │
│  │   React 18  │  │   Tailwind  │  │   Socket.io Client │   │
│  │   + Vite    │  │     CSS     │  │   (real-time)      │   │
│  └─────────────┘  └─────────────┘  └─────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
┌─────────────────────────────┐   ┌─────────────────────────────┐
│   BACKEND API (Render)      │   │   WEBSOCKET (Render)      │
│   Express + MongoDB        │   │   Socket.io              │
│   - REST Endpoints         │   │   - Live updates         │
│   - JWT Auth               │   │   - Push notifications   │
│   - Rate Limiting          │   │   - Device status        │
└─────────────────────────────┘   └─────────────────────────────┘
              │                               │
              ▼                               ▼
┌─────────────────────────────┐   ┌─────────────────────────────┐
│   ML SERVICE (Railway)     │   │   MQTT BROKER (Railway)   │
│   FastAPI + TensorFlow      │   │   Mosquitto + TLS         │
│   - Threat Classification  │   │   - Device telemetry      │
│   - Anomaly Detection      │   │   - Commands              │
└─────────────────────────────┘   └─────────────────────────────┘
              │                               │
              ▼                               ▼
┌─────────────────────────────┐   ┌─────────────────────────────┐
│   MongoDB Atlas             │   │   Healthcare IoT Devices │
│   - Users, Devices         │   │   - Patient monitors       │
│   - Incidents, Logs        │   │   - Infusion pumps         │
│   - Certificates          │   │   - Imaging equipment      │
└─────────────────────────────┘   └─────────────────────────────┘
```

---

## 2. Scalable Folder Structure

```
healthcare-iot-security/
│
├── frontend/                        # React SPA (Vercel deployable)
│   ├── public/
│   │   ├── index.html
│   │   ├── favicon.svg
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Toast.jsx
│   │   │   │   └── Loader.jsx
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Header.jsx
│   │   │   │   └── Layout.jsx
│   │   │   ├── dashboard/
│   │   │   │   ├── StatCard.jsx
│   │   │   │   ├── TrafficChart.jsx
│   │   │   │   ├── ThreatPie.jsx
│   │   │   │   └── DeviceMap.jsx
│   │   │   ├── devices/
│   │   │   │   ├── DeviceTable.jsx
│   │   │   │   ├── DeviceRow.jsx
│   │   │   │   └── AddDeviceModal.jsx
│   │   │   ├── threats/
│   │   │   │   ├── Radar.jsx
│   │   │   │   ├── IncidentList.jsx
│   │   │   │   └── IncidentCard.jsx
│   │   │   ├── encryption/
│   │   │   │   ├── EncryptPanel.jsx
│   │   │   │   └── DecryptPanel.jsx
│   │   │   ├── ml/
│   │   │   │   ├── MLDetector.jsx
│   │   │   │   └── FeatureSliders.jsx
│   │   │   └── compliance/
│   │   │       ├── ComplianceCard.jsx
│   │   │       ├── ReportGenerator.jsx
│   │   │       └── AuditLog.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Devices.jsx
│   │   │   ├── Threats.jsx
│   │   │   ├── Encryption.jsx
│   │   │   ├── MLDetector.jsx
│   │   │   ├── Compliance.jsx
│   │   │   └── About.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useDevices.js
│   │   │   ├── useIncidents.js
│   │   │   └── useSocket.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── deviceService.js
│   │   │   ├── incidentService.js
│   │   │   └── encryptionService.js
│   │   ├── store/
│   │   │   ├── authStore.js
│   │   │   ├── deviceStore.js
│   │   │   └── incidentStore.js
│   │   ├── utils/
│   │   │   ├── encryption.js
│   │   │   ├── format.js
│   │   │   └── validators.js
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/                         # Express API (Render deployable)
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js        # MongoDB connection
│   │   │   ├── redis.js        # Redis (caching)
│   │   │   └── env.js          # Environment vars
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── deviceController.js
│   │   │   ├── incidentController.js
│   │   │   ├── encryptionController.js
│   │   │   ├── complianceController.js
│   │   │   └── auditController.js
│   │   ├── middleware/
│   │   │   ├── auth.js         # JWT verification
│   │   │   ├── rateLimit.js    # Rate limiting
│   │   │   ├── validate.js    # Input validation
│   │   │   └── errorHandler.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Device.js
│   │   │   ├── Incident.js
│   │   │   ├── AuditLog.js
│   │   │   └── Certificate.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── devices.js
│   │   │   ├── incidents.js
│   │   │   ├── encryption.js
│   │   │   ├── compliance.js
│   │   │   └── audit.js
│   │   ├── services/
│   │   │   ├── mqttService.js    # MQTT handler
│   │   │   ├── mlService.js    # ML API calls
│   │   │   ├── socketService.js # Socket.io
│   │   │   └── alertService.js
│   │   ├── utils/
│   │   │   ├── crypto.js
│   │   │   ├── logger.js
│   │   │   └── helpers.js
│   │   └── app.js
│   ├── package.json
│   └── .env.example
│
├── ml-service/                    # Python ML API (Railway deployable)
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── routes/
│   │   │   ├── predict.py
│   │   │   └── health.py
│   │   ├── models/
│   │   │   ├── random_forest.pkl
│   │   │   └── scaler.pkl
│   │   ├── preprocessing/
│   │   │   ├── feature_extraction.py
│   │   │   └── normalization.py
│   │   └── training/
│   │       ├── train.py
│   │       └── evaluate.py
│   ├── data/
│   │   ├── unsw_nb15_subset.csv
│   │   └── ton_iot_subset.csv
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
├── mqtt-broker/                   # MQTT configuration
│   ├── config/
│   │   └── mosquitto.conf
│   ├── Dockerfile
│   └── tls/
│       ├── server.crt
│       ├── server.key
│       └── ca.pem
│
├── docker/                      # Docker Compose setup
│   ├── docker-compose.yml
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   ├── Dockerfile.ml
│   └── nginx.conf
│
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── .env.example
├── docker-compose.yml
├── README.md
└── ARCHITECTURE_ANALYSIS.md
```

---

## 3. API Contract

### Authentication Endpoints
```
POST /api/auth/register     # Create new user
POST /api/auth/login     # Get JWT token
POST /api/auth/refresh   # Refresh token
GET  /api/auth/me      # Get current user
DELETE /api/auth/logout # Invalidate token
```

### Device Endpoints
```
GET    /api/devices           # List all devices
POST   /api/devices          # Register new device
GET    /api/devices/:id      # Get device details
PATCH  /api/devices/:id      # Update device
DELETE /api/devices/:id     # Remove device
GET    /api/devices/:id/telemetry  # Get device data
```

### Incident Endpoints
```
GET    /api/incidents           # List incidents
POST   /api/incidents          # Create incident
GET    /api/incidents/:id     # Get incident
PATCH  /api/incidents/:id     # Update status
DELETE /api/incidents/:id     # Resolve incident
```

### ML Endpoints
```
POST   /ml/predict          # Classify flow
POST   /ml/predict/batch   # Batch classify
GET   /ml/model/info     # Model metadata
```

### Encryption Endpoints
```
POST   /api/encrypt      # Encrypt data
POST   /api/decrypt     # Decrypt data
```

### Compliance Endpoints
```
GET    /api/audit          # Get audit logs
POST   /api/audit         # Create audit entry
POST   /api/report/generate # Generate report
GET    /api/compliance/hipaa   # HIPAA status
GET    /api/compliance/gdpr     # GDPR status
GET    /api/compliance/dpdpa    # DPDPA status
```

---

## 4. Environment Configuration

### Frontend (.env)
```
VITE_API_URL=http://localhost:4000
VITE_WS_URL=ws://localhost:4000
VITE_MQTT_URL=mqtt://localhost:1883
```

### Backend (.env)
```
PORT=4000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
ML_SERVICE_URL=http://localhost:8000
MQTT_BROKER=mqtt://localhost
MQTT_USERNAME=aegis
MQTT_PASSWORD=your-password
RATE_LIMIT=100
```

### ML Service (.env)
```
PORT=8000
MODEL_PATH=/app/models
UNSW_NB15_PATH=/data
LOG_LEVEL=info
CORS_ORIGINS=http://localhost:3000
```

---

## 5. Security Layers

### 1. Network Security
- CloudFlare CDN with WAF
- SSL/TLS everywhere
- MQTT over TLS (8883)

### 2. Application Security
- JWT with short expiry
- Rate limiting (100/min)
- Input validation (Joi)
- CORS configuration
- Helmet headers

### 3. Data Security
- AES-256 encryption at rest
- TLS 1.3 in transit
- Encrypted MQTT messages
- Secure cookie flags

### 4. Compliance
- HIPAA audit logging
- GDPR data handling
- DPDPA 2023 compliance

---

## 6. Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|--------|
| Frontend | React 18 + Vite | UI |
| Styling | Tailwind CSS | Styles |
| Backend | Node.js + Express | API |
| Database | MongoDB Atlas | Storage |
| Auth | JWT + bcrypt | Security |
| Realtime | Socket.io | Live updates |
| IoT | Mosquitto MQTT | Device comms |
| ML | FastAPI + TensorFlow | Threat detection |
| Deployment | Vercel + Render | Hosting |
| Docker | Docker Compose | Containerization |

---

*Plan: Production Architecture Complete*
