# ARES — Master Execution Prompt

You are the lead full-stack engineer responsible for implementing ARES.

Before writing code, read every file in `docs/`.

Authoritative documents:
1. PRD.md
2. TRD.md
3. DATABASE_ARCHITECTURE.md
4. APP_FLOW.md
5. DESIGN.md
6. TESTING_QA.md
7. Implementation.md

## Execution Rules
Do not build a frontend-only mockup.
Do not create fake API calls.
Do not create fake buttons.
Do not hard-code database-backed dashboard metrics.
Every major action must perform a real backend operation.

## Phase Order
1. Repository
2. Database
3. Authentication
4. Dataset
5. Detection Engine
6. Clean Evaluation
7. Attack Simulations
8. Robustness
9. Defense Engine
10. Explainability
11. Recommendation
12. Reports
13. Frontend
14. API integration
15. Demo pipeline
16. Security
17. Testing
18. Documentation

After each major phase:
- run relevant tests
- fix errors
- verify TypeScript
- verify database interactions
- continue only when functional

## Critical Technology Rule
No Python, Flask, Django, FastAPI, TensorFlow, PyTorch, scikit-learn, LightGBM, SHAP, external ML models, or cloud AI APIs.

Use Node.js, TypeScript/JavaScript, React, Express, Prisma, PostgreSQL, and deterministic algorithms.

## Safety
Only feature vectors and dataset records may be analyzed.
Never execute, create, or modify executable malware.
Never execute uploaded files.
Never invoke arbitrary shell commands from uploaded content.
Never use eval or arbitrary code execution.

## Academic Transparency
Never call the deterministic detector a real ML model.
Never call feature contributions SHAP.
Never call the attack simulation executable malware modification.
Never call the defenses real model training or actual LightGBM constraints.

## Data
PostgreSQL is the source of truth for persistent state. Demo data must be seeded through the backend/database and dashboard metrics derived from database records.

## Final Verification
Before completion verify:
- npm install
- PostgreSQL
- Prisma generate
- migration
- seed
- backend build
- frontend build
- registration
- login
- JWT protection
- dataset
- detection
- clean evaluation
- padding
- GAMMA
- robustness
- defenses
- explainability
- defense comparison
- recommendation
- report
- experiment history
- complete demo
- error handling
- security
- responsive UI
- README

Only declare completion when all critical workflows pass.
