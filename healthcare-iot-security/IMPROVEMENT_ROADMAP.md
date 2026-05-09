# Improvement Roadmap - Aegis HIoT
## Healthcare IoT Security Dashboard

---

## Executive Summary

This roadmap provides a phased approach to transform the current demo/prototype into a production-ready Healthcare IoT Security platform.

| Phase | Focus | Duration | Priority |
|-------|-------|----------|---------|
| 1 | Core Security | 2 weeks | CRITICAL |
| 2 | IoT Integration | 3 weeks | HIGH |
| 3 | ML Pipeline | 3 weeks | HIGH |
| 4 | Real-time & Scale | 2 weeks | MEDIUM |
| 5 | Production | 2 weeks | MEDIUM |

---

## Phase 1: Core Security & Authentication
**Duration**: 2 weeks  
**Priority**: CRITICAL  
**Dependencies**: None

### Goals
- [ ] Implement JWT authentication
- [ ] Create user management system
- [ ] Add role-based access control
- [ ] Set up MongoDB database

### Tasks

#### Week 1: Authentication System
```
Day 1-2: Database Design
- Design MongoDB schemas
- Create User, Device, Incident models
- Set up MongoDB Atlas cluster

Day 3-4: User API
- POST /api/auth/register
- POST /api/auth/login
- JWT token generation
- Password hashing with bcrypt

Day 5: Middleware
- JWT verification middleware
- Role checking (admin/user)
- Rate limiting
```

#### Week 2: Security Hardening
```
Day 6-7: Session Management
- Token refresh endpoints
- Session invalidation
- Remember me functionality

Day 8-9: Access Control
- Admin-only routes
- Device ownership
- Audit logging

Day 10: Testing
- Auth flow tests
- Security audit
```

### Deliverables
- ✓ User registration/login API
- ✓ JWT authentication working
- ✓ MongoDB replace SQLite
- ✓ Role-based access control

---

## Phase 2: IoT Integration (MQTT)
**Duration**: 3 weeks  
**Priority**: HIGH  
**Dependencies**: Phase 1

### Goals
- [ ] Set up MQTT broker
- [ ] Implement device communication
- [ ] Handle telemetry data
- [ ] Add device commands

### Tasks

#### Week 1: MQTT Setup
```
Day 11-12: Broker Setup
- Install Mosquitto
- Configure TLS/SSL
- Set up authentication

Day 13-14: Client Library
- Add mqtt.js to backend
- Create connection handlers
- Implement reconnection logic
```

#### Week 2: Device Communication
```
Day 15-16: Topics & Handlers
- Define MQTT topic structure
- Create message handlers
- Implement QoS levels

Day 17-18: Telemetry
- Device data ingestion
- Store in MongoDB
- Real-time processing
```

#### Week 3: Commands & Control
```
Day 19-20: Device Commands
- Server-to-device commands
- Command queue
- Acknowledgment handling

Day 21: Testing
- End-to-end device test
- Performance testing
```

### Deliverables
- ✓ Mosquitto MQTT broker running
- ✓ Device telemetry flowing
- ✓ Command/control working

---

## Phase 3: ML Pipeline
**Duration**: 3 weeks  
**Priority**: HIGH  
**Dependencies**: Phase 1

### Goals
- [ ] Set up Python ML service
- [ ] Train Random Forest model
- [ ] Create inference API
- [ ] Integrate with backend

### Tasks

#### Week 1: ML Service Setup
```
Day 11-12: Environment
- Create FastAPI service
- Set up virtual environment
- Add TensorFlow, Scikit-learn

Day 13-14: Data Preparation
- Download UNSW-NB15 dataset
- Data cleaning
- Feature extraction
```

#### Week 2: Model Training
```
Day 15-17: Training
- Train Random Forest
- Train LSTM (optional)
- Hyperparameter tuning

Day 18: Evaluation
- Accuracy metrics
- Precision/recall
- Confusion matrix
```

#### Week 3: API Integration
```
Day 19-20: Inference API
- POST /predict endpoint
- Batch prediction
- Model versioning

Day 21: Integration
- Connect to backend
- Real-time scoring
- Alert generation
```

### Deliverables
- ✓ Python ML service running
- ✓ Random Forest model trained
- ✓ Real-time threat classification

---

## Phase 4: Real-time & Scaling
**Duration**: 2 weeks  
**Priority**: MEDIUM  
**Dependencies**: Phases 1, 2, 3

### Goals
- [ ] Implement WebSocket
- [ ] Replace polling with sockets
- [ ] Performance optimization

### Tasks

#### Week 1: WebSocket
```
Day 22-23: Socket.io Setup
- Install Socket.io server
- Connection handling
- Room management

Day 24-25: Events
- Device updates
- Incident alerts
- Dashboard metrics
```

#### Week 2: Optimization
```
Day 26-27: Performance
- Database indexing
- Query optimization
- Caching (Redis)

Day 28: Integration
- Replace setInterval calls
- Test real-time updates
```

### Deliverables
- ✓ Socket.io working
- ✓ Live dashboard updates
- ✓ Optimized performance

---

## Phase 5: Production Deployment
**Duration**: 2 weeks  
**Priority**: MEDIUM  
**Dependencies**: All previous phases

### Goals
- [ ] Docker setup
- [ ] CI/CD pipeline
- [ ] Production monitoring

### Tasks

#### Week 1: Containerization
```
Day 29-30: Docker
- Create Dockerfiles
- Docker Compose setup
- nginx configuration

Day 31-32: Deployment Platforms
- Vercel frontend setup
- Render backend setup
- Railway ML setup
```

#### Week 2: CI/CD & Monitoring
```
Day 33-34: CI/CD
- GitHub Actions
- Automated testing
- Deploy pipelines

Day 35-36: Monitoring
- Error tracking
- Performance monitoring
- Health checks
```

### Deliverables
- ✓ Docker containers
- ✓ Automated deployment
- ✓ Production ready

---

## Task Breakdown by File

### Backend Files to Create
```
backend/src/
├── config/database.js       # MongoDB connection
├── config/env.js       # Environment config
├── controllers/authController.js
├── controllers/deviceController.js
├── controllers/incidentController.js
├── middleware/auth.js
├── middleware/rateLimit.js
├── models/User.js
├── models/Device.js
├── models/Incident.js
├── routes/auth.js
├── routes/devices.js
├── routes/incidents.js
├── services/mqttService.js
├── services/socketService.js
└── app.js
```

### ML Service Files to Create
```
ml-service/
├── app/main.py
├── app/routes/predict.py
├── app/routes/health.py
├── app/models/  (train first)
├── requirements.txt
└── Dockerfile
```

### Frontend Updates
- Add Socket.io client
- Replace localStorage with API calls
- Add authentication UI
- Add real-time updates

---

## Dependencies Summary

| Package | Purpose | Phase |
|---------|---------|-------|
| bcryptjs | Password hashing | 1 |
| jsonwebtoken | JWT tokens | 1 |
| mongoose | MongoDB | 1 |
| mqtt | MQTT client | 2 |
| socket.io | WebSocket | 4 |
| fastapi | ML API | 3 |
| tensorflow | ML models | 3 |
| scikit-learn | ML models | 3 |

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|----------|--------|-----------|
| ML model accuracy low | Medium | High | Use proven datasets |
| MQTT performance | Low | Medium | QoS tuning |
| MongoDB costs | Medium | Medium | Start with free tier |
| Deployment complexity | High | Medium | Docker Compose |

---

## Success Metrics

### Phase 1 Success
- User can register and login
- JWT validates correctly
- MongoDB stores data

### Phase 2 Success
- Device connects via MQTT
- Telemetry stores in DB
- Commands execute

### Phase 3 Success
- ML classifies >90% accuracy
- <500ms inference time
- Integrated with backend

### Phase 4 Success
- Real-time updates work
- No polling needed
- <100ms latency

### Phase 5 Success
- Docker deploys
- CI/CD passes
- Production stable

---

*Roadmap: Implementation Planning Complete*
