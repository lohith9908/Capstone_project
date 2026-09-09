# ARES — Implementation Specification

## Purpose
Build ARES (Automated Robustness Evaluation System), a genuine full-stack cybersecurity research demonstration application for evaluating static malware detector robustness using safe, deterministic feature-level simulations.

## Critical Technology Restrictions
Do NOT use Python, Flask, Django, FastAPI, TensorFlow, PyTorch, scikit-learn, LightGBM, SHAP, external ML models, or cloud AI/ML APIs.

Use only Node.js, TypeScript/JavaScript, React, Express, PostgreSQL, Prisma, REST APIs, deterministic algorithms, and rule-based scoring.

## Architecture
```text
ARES/
├── client/
├── server/
├── docs/
├── docker-compose.yml
├── package.json
├── README.md
├── .env.example
└── .gitignore
```

## Required Stack
Frontend: React, Vite, TypeScript, Tailwind CSS, React Router, Recharts, Axios, Lucide React.
Backend: Node.js, Express, TypeScript, JWT, bcrypt, Zod, Helmet, rate limiting.
Database: PostgreSQL + Prisma.

## Implementation Phases
1. Repository setup
2. Prisma schema, migrations, seed
3. Authentication
4. Dataset system
5. ARES Detection Engine
6. Clean evaluation
7. Padding simulation
8. GAMMA-inspired simulation
9. Robustness engine
10. Defense simulations
11. Feature contribution analysis
12. Recommendation engine
13. Reports
14. Frontend pages/components
15. API integration
16. Demo pipeline
17. Security/error handling
18. Testing/documentation

## Detection Engine
Create `server/src/engines/detectionEngine.ts`.

Use a deterministic rule-based scoring algorithm over:
- fileSize
- entropy
- sectionCount
- importCount
- exportCount
- resourceCount
- stringCount
- apiCount
- headerSize
- codeSize
- dataSize
- imageCount
- certificatePresent
- suspiciousApiCount
- packedIndicator

Return prediction, malwareScore, benignScore, riskLevel, and feature contributions. Normalize risk to 0–100. Default threshold: 50.

Call it **ARES Detection Engine**, never LightGBM.

## Dataset
Support the **ARES Demonstration Dataset**, CSV import, and JSON import. Never claim the demo dataset is EMBER. Uploaded files are data only.

## Clean Evaluation
Calculate and persist:
TP, TN, FP, FN, accuracy, precision, recall, F1, detection rate, false positive rate.

## Attack Simulations
Padding and GAMMA-inspired attacks operate only on synthetic feature vectors. Never generate, modify, or execute executable malware.

Padding may safely alter bounded values such as fileSize, dataSize, resourceCount, section-related values, and entropy.

GAMMA-inspired simulation may alter benign-looking feature characteristics.

Attack success occurs when an originally MALWARE prediction becomes BENIGN.

## Robustness
Create `robustnessEngine.ts`.

Default conceptual formula:
```text
robustnessScore =
  detectionRetention * 0.40 +
  (1 - attackSuccessRate) * 0.40 +
  stabilityScore * 0.20
```

Normalize 0–100:
- 80–100 HIGH
- 60–79 MEDIUM
- 0–59 LOW

## Defenses
Create `defenseEngine.ts`.

Implement:
- Adversarial Training Simulation: deterministic recalibration using observed adversarial samples.
- Monotonic Constraint Simulation: enforce configured risk-sensitive feature relationships.

Do not claim either is actual ML training or actual LightGBM constraints.

## Explainability
Create `featureContributionEngine.ts`.

Do not use SHAP. Implement deterministic rule-based feature contributions. Call the feature:
**ARES Feature Contribution Analysis**.

## Recommendation
Create `recommendationEngine.ts`. Dynamically rank defenses using attack success, robustness, detection retention, feature instability, and computational cost. Do not always recommend the same defense.

## Reports
Create a report service containing experiment information, dataset, detection, attacks, robustness, explainability, defense comparison, cost, weaknesses, recommendation, and overall rating. Support HTML/JSON/print and PDF where feasible with a Node-compatible library.

## Complete Demo
Provide `POST /api/demo/run` and a dashboard button **Run Complete ARES Demo** that executes:
Dataset → Clean Evaluation → Padding → GAMMA → Robustness → Defenses → Explainability → Comparison → Recommendation → Report.

## Security
Use JWT, bcrypt, Zod, Helmet, CORS, rate limiting, secure environment variables, upload validation, upload limits, Prisma parameterization, and centralized errors.

Reject executable extensions and NEVER execute uploaded files.

## Completion Criteria
Frontend/backend build, PostgreSQL connection, migrations, seed, authentication, protected routes, dataset, detection, evaluation, attacks, robustness, defenses, explainability, recommendations, reports, experiment history, demo pipeline, security, testing, and README must all work.

No Python or external ML library may exist in the implementation.
