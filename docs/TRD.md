# ARES — Technical Requirements Document

## Architecture
```text
React Client
    ↓
Express REST API
    ↓
Controllers
    ↓
Services
    ↓
Analysis Engines
    ↓
Prisma
    ↓
PostgreSQL
```

## Frontend
React, Vite, TypeScript, Tailwind CSS, React Router, Axios, Recharts, Lucide React.

## Backend
Node.js, Express, TypeScript, Prisma, PostgreSQL, JWT, bcrypt, Zod, Helmet, express-rate-limit.

## Backend Layers
Routes define endpoints.
Controllers handle HTTP concerns.
Services contain business logic and orchestration.
Engines contain deterministic analysis.
Middleware handles authentication, roles, validation, uploads, errors, and rate limiting.

## Backend Structure
```text
server/src/
├── controllers/
├── routes/
├── services/
├── engines/
├── middleware/
├── validators/
├── utils/
└── server.ts
```

Required engines:
- detectionEngine.ts
- adversarialEngine.ts
- robustnessEngine.ts
- defenseEngine.ts
- featureContributionEngine.ts
- recommendationEngine.ts

## Frontend Structure
```text
client/src/
├── components/
├── layouts/
├── pages/
├── hooks/
├── services/
├── types/
├── utils/
└── App.tsx
```

## API Contract
Success:
```json
{"success":true,"data":{}}
```

Error:
```json
{"success":false,"error":{"code":"ERROR_CODE","message":"Human readable message","details":[]}}
```

## Required Endpoints
```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me

GET  /api/dashboard

GET  /api/datasets
POST /api/datasets
GET  /api/datasets/:id

POST /api/detection/analyze
POST /api/evaluation/clean

POST /api/attacks/padding
POST /api/attacks/gamma

POST /api/robustness/evaluate
GET  /api/robustness/:experimentId

POST /api/defenses/adversarial-training
POST /api/defenses/monotonic
GET  /api/defenses/compare

POST /api/explainability/analyze
POST /api/recommendation

POST /api/reports/generate
GET  /api/reports/:id

POST /api/demo/run
```

## Authentication
JWT payload may contain sub, email, role, iat, exp. Never store passwords or secrets in JWT.

## Validation
Use Zod for all external input.

## Uploads
Only data formats such as CSV/JSON are allowed. Reject executable formats. Limit size. Never execute content.

## Security
Helmet, CORS, rate limiting, bcrypt, JWT, secure environment variables, Prisma, centralized errors.

## Performance
Use pagination, indexes, efficient queries, batch operations, transactions, and bounded dataset sizes.

## Testing
Include unit, integration, API, frontend, end-to-end, security, and build tests.

## Environment
```text
DATABASE_URL=
JWT_SECRET=
PORT=
CLIENT_URL=
NODE_ENV=
```

## Build
```bash
npm run build
```
must succeed for both frontend and backend.
