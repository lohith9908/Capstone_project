# ARES — Implementation Plan

**Project:** Automated Robustness Evaluation System
**Application Type:** Full-Stack Cybersecurity Research Demonstration Platform
**Primary Goal:** Build a production-style, database-backed ARES application using only Node.js/TypeScript-based deterministic logic.

---

# 0. IMPLEMENTATION PRINCIPLES

This document is the primary implementation playbook for ARES.

Before implementing anything:

1. Read all files inside `docs/`.
2. Understand the PRD.
3. Understand the TRD.
4. Understand the database architecture.
5. Understand the application flow.
6. Understand the design system.
7. Understand the testing requirements.
8. Inspect the existing repository before modifying files.

Do not blindly overwrite existing work.

---

# 1. NON-NEGOTIABLE TECHNOLOGY RULES

## 1.1 Allowed

Use:

* Node.js
* TypeScript
* JavaScript
* React
* Vite
* Express.js
* Tailwind CSS
* React Router
* Axios
* Recharts
* Lucide React
* MongoDB
* Mongoose ODM
* JWT
* bcrypt
* Zod
* Helmet
* express-rate-limit
* Docker Compose

## 1.2 Forbidden

Never install or use:

* Python
* Flask
* Django
* FastAPI
* TensorFlow
* PyTorch
* scikit-learn
* LightGBM
* SHAP
* Python ML frameworks
* External ML models
* Cloud AI/ML APIs

## 1.3 Academic Transparency

The system is a deterministic demonstration platform.

Never claim that the implementation contains:

* a real LightGBM model
* real SHAP
* real ML training
* executable malware transformation
* production malware analysis

Use:

**ARES Detection Engine**

**ARES Feature Contribution Analysis**

**GAMMA-inspired Feature Transformation Simulation**

**Adversarial Training Simulation**

**Monotonic Constraint Simulation**

---

# 2. SECURITY AND SAFETY RULES

ARES must never execute uploaded executable files.

The application must not:

* execute malware
* generate malware
* modify real executable malware
* create deployable malware
* invoke arbitrary shell commands
* execute uploaded scripts
* use `eval()`
* use uploaded content as executable code

All attack functionality operates on:

```text
Synthetic feature vectors
+
Dataset records
```

Uploaded CSV/JSON files are treated only as data.

---

# 3. TARGET ARCHITECTURE

The final project should follow:

```text
ARES/
│
├── client/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── server/
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
│
├── docs/
│
├── docker-compose.yml
├── package.json
├── README.md
├── LICENSE
├── .env.example
└── .gitignore
```

Backend architecture:

```text
Routes
  ↓
Controllers
  ↓
Services
  ↓
Engines
  ↓
Mongoose
  ↓
MongoDB
```

Frontend architecture:

```text
Pages
  ↓
Components / Hooks
  ↓
API Services
  ↓
REST API
```

---

# 4. DEVELOPMENT STRATEGY

ARES must be implemented in sequential phases.

Each phase has:

* Objective
* Tasks
* Expected files
* Deliverables
* Verification
* Completion gate

Do not move to the next phase when the current phase has unresolved critical errors.

---

# PHASE 0 — DOCUMENTATION AND REPOSITORY AUDIT

## Objective

Understand the project before coding.

## Tasks

Read:

```text
docs/PRD.md
docs/TRD.md
docs/DATABASE_ARCHITECTURE.md
docs/APP_FLOW.md
docs/DESIGN.md
docs/TESTING_QA.md
docs/Implementation.md
```

Also read any other files in `docs/`.

Inspect:

```text
package.json
client/
server/
.gitignore
.env*
docker-compose.yml
```

Determine whether any implementation already exists.

## Deliverable

Create an internal implementation plan based on the documentation.

Do not unnecessarily delete existing files.

## Completion Gate

Before proceeding:

```text
[ ] All documentation understood
[ ] Existing repository inspected
[ ] Existing implementation identified
[ ] Technology restrictions confirmed
```

---

# PHASE 1 — MONOREPO AND DEVELOPMENT ENVIRONMENT

## Objective

Create the basic full-stack development environment.

## Tasks

Configure:

```text
Node.js
TypeScript
React
Vite
Express
Tailwind
Mongoose
MongoDB
```

Create npm workspace configuration if appropriate.

Create:

```text
client/
server/
```

Create:

```text
docker-compose.yml
.env.example
.gitignore
README.md
LICENSE
```

## Environment Variables

```env
MONGODB_URI=
JWT_SECRET=
PORT=
CLIENT_URL=
NODE_ENV=
```

Never commit `.env`.

## Deliverable

Both applications should start successfully.

Expected commands:

```bash
npm install
npm run dev
```

## Completion Gate

Verify:

```text
[ ] Client starts
[ ] Server starts
[ ] TypeScript works
[ ] Tailwind works
[ ] MongoDB container starts
[ ] Environment configuration works
```

---

# PHASE 2 — DATABASE AND MONGOOSE

## Objective

Implement the complete MongoDB data layer using Mongoose.

## Tasks

Implement Mongoose schemas and models according to:

```text
docs/DATABASE_ARCHITECTURE.md
```

Required models:

```text
User
Dataset
DatasetSample
Experiment
AttackResult
DefenseResult
FeatureContribution
Recommendation
Report
```

Implement:

* enums and TypeScript types
* Mongoose schemas and models
* indexes
* timestamps
* cascading behavior
* validation rules

## Commands

Run:

```bash
docker compose up -d
npm run seed
```

## Seed

Create deterministic seed data:

```text
Demo user
ARES Demonstration Dataset
Synthetic samples
Demo experiments
Demo attack results
Demo defense results
Demo feature contributions
Demo recommendation
Demo report
```

Do not invent dashboard numbers separately from database records.

## Completion Gate

```text
[ ] MongoDB connects
[ ] Mongoose models initialized
[ ] Indexes created
[ ] Seed succeeds
[ ] Relationships work
[ ] Database queries work
```

---

# PHASE 3 — BACKEND FOUNDATION

## Objective

Create a clean Express backend architecture.

## Structure

```text
server/src/

controllers/
routes/
services/
engines/
middleware/
validators/
utils/
```

Create:

```text
server.ts
```

Implement:

* Express configuration
* JSON parsing
* CORS
* Helmet
* rate limiting
* environment configuration
* request logging
* centralized error handling
* 404 handling

## API Response Format

Success:

```json
{
  "success": true,
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": []
  }
}
```

## Completion Gate

```text
[ ] Server starts
[ ] Health endpoint works
[ ] Error middleware works
[ ] CORS works
[ ] Helmet enabled
[ ] Rate limiting enabled
```

---

# PHASE 4 — AUTHENTICATION AND AUTHORIZATION

## Objective

Implement secure authentication.

## Endpoints

```text
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
```

## Tasks

Registration:

```text
Validate
 ↓
Check email
 ↓
Hash password
 ↓
Create user
 ↓
Generate JWT
```

Login:

```text
Validate
 ↓
Find user
 ↓
Verify password
 ↓
Generate JWT
```

Implement:

```text
authMiddleware
roleMiddleware
```

Roles:

```text
ADMIN
ANALYST
USER
```

## Completion Gate

```text
[ ] Register works
[ ] Duplicate email rejected
[ ] Password hashed
[ ] Login works
[ ] Invalid password rejected
[ ] JWT generated
[ ] Protected routes reject unauthenticated requests
[ ] Role restrictions work
```

---

# PHASE 5 — DATASET ENGINE

## Objective

Create the safe data ingestion and demonstration dataset subsystem.

## Feature Schema

```text
fileSize
entropy
sectionCount
importCount
exportCount
resourceCount
stringCount
apiCount
headerSize
codeSize
dataSize
imageCount
certificatePresent
suspiciousApiCount
packedIndicator
```

## Tasks

Create:

```text
datasetService.ts
datasetController.ts
datasetRoutes.ts
datasetValidators.ts
```

Support:

* ARES Demonstration Dataset
* CSV upload
* JSON upload
* sample listing
* dataset statistics
* feature statistics
* missing values
* malware/benign distribution

## Upload Rules

Accept only approved data formats.

Reject executable formats.

Maximum upload size must be configured.

Never execute uploaded files.

## Completion Gate

```text
[ ] Demo dataset loads
[ ] Samples stored
[ ] CSV import works
[ ] JSON import works
[ ] Invalid data rejected
[ ] Executable uploads rejected
[ ] Statistics calculated from database
```

---

# PHASE 6 — ARES DETECTION ENGINE

## Objective

Implement the deterministic detection system.

Create:

```text
server/src/engines/detectionEngine.ts
```

## Input

A feature vector.

## Output

```text
prediction
malwareScore
benignScore
riskLevel
featureContributions
```

## Algorithm

Use deterministic rules.

Examples:

```text
High entropy
+
High suspicious API count
+
Packed indicator
+
Unusual section count
+
Suspicious import behavior
```

increase risk.

Weights must be centralized and configurable.

## Score

Normalize to:

```text
0–100
```

Default classification:

```text
score >= 50 → MALWARE
score < 50 → BENIGN
```

## Risk

Use configurable risk thresholds.

## Important

Do not call this LightGBM.

Use:

**ARES Detection Engine**

## Completion Gate

```text
[ ] Engine implemented
[ ] Same input gives same output
[ ] Score always 0–100
[ ] Prediction works
[ ] Risk level works
[ ] Contributions generated
[ ] Unit tests pass
```

---

# PHASE 7 — DETECTION API AND FRONTEND

## Objective

Expose the detection engine through the REST API and UI.

## API

```text
POST /api/detection/analyze
```

## Frontend

Create:

```text
/pages/Detection
```

Allow users to:

* enter/select a feature vector
* run analysis
* view malware score
* view prediction
* view risk
* view feature contributions

## Completion Gate

```text
[ ] Frontend calls real API
[ ] API calls detection engine
[ ] Result displayed
[ ] Errors handled
[ ] Loading state implemented
```

---

# PHASE 8 — CLEAN EVALUATION ENGINE

## Objective

Evaluate the detector against labeled demonstration data.

## Metrics

Calculate:

```text
TP
TN
FP
FN
Accuracy
Precision
Recall
F1
Detection Rate
False Positive Rate
```

## API

```text
POST /api/evaluation/clean
```

## Database

Persist experiment/evaluation information.

## Frontend

Create:

```text
/pages/Evaluation
```

Display:

* metric cards
* confusion matrix
* prediction table
* charts

## Completion Gate

```text
[ ] Evaluation uses actual dataset samples
[ ] Predictions come from Detection Engine
[ ] Metrics are calculated
[ ] Results persist
[ ] UI displays API results
```

---

# PHASE 9 — ADVERSARIAL ENGINE FOUNDATION

## Objective

Create the common attack transformation framework.

Create:

```text
server/src/engines/adversarialEngine.ts
```

Pipeline:

```text
Original Feature Vector
        ↓
Attack Transformation
        ↓
Modified Feature Vector
        ↓
Detection
        ↓
Comparison
```

Return:

```text
originalPrediction
adversarialPrediction
originalScore
adversarialScore
changedFeatures
attackSuccessful
```

## Safety

Only modify synthetic feature values.

Never modify executable files.

## Completion Gate

```text
[ ] Engine works
[ ] Original vector preserved
[ ] Modified vector bounded
[ ] Detection recalculated
[ ] Attack success calculated
```

---

# PHASE 10 — PADDING ATTACK SIMULATION

## Objective

Implement a safe feature-level Padding simulation.

## Endpoint

```text
POST /api/attacks/padding
```

## Allowed Feature Transformations

Examples:

```text
fileSize
dataSize
resourceCount
section-related values
bounded entropy changes
```

Transformations must have configurable limits.

## UI

Create:

```text
/pages/Attacks/Padding
```

Display:

```text
Original
Score
Prediction
Risk

VS

Adversarial
Score
Prediction
Risk
```

Also show changed features.

## Completion Gate

```text
[ ] Feature-only transformation
[ ] Bounds enforced
[ ] Before/after comparison works
[ ] Attack success works
[ ] Results persisted
```

---

# PHASE 11 — GAMMA-INSPIRED SIMULATION

## Objective

Implement a safe GAMMA-inspired feature transformation simulation.

## Endpoint

```text
POST /api/attacks/gamma
```

## Concept

Apply controlled changes representing benign-looking feature characteristics.

Possible features:

```text
entropy
resourceCount
stringCount
imageCount
fileSize
certificatePresent
section-related values
```

## Naming

Use:

**GAMMA-inspired Feature Transformation Simulation**

Do not claim this is the actual executable GAMMA attack.

## Completion Gate

```text
[ ] Feature-only transformation
[ ] Bounded modifications
[ ] Detection recalculated
[ ] Attack success calculated
[ ] Results persisted
```

---

# PHASE 12 — ROBUSTNESS ENGINE

## Objective

Calculate detector robustness.

Create:

```text
server/src/engines/robustnessEngine.ts
```

Calculate:

```text
detectionRetention
attackSuccessRate
stabilityScore
performanceDegradation
robustnessScore
```

## Formula

Use:

```text
robustnessScore =
    detectionRetention * 0.40
    +
    (1 - attackSuccessRate) * 0.40
    +
    stabilityScore * 0.20
```

Normalize:

```text
0–100
```

Classification:

```text
80–100 HIGH
60–79 MEDIUM
0–59 LOW
```

All thresholds/configuration must be centralized.

## API

```text
POST /api/robustness/evaluate
GET /api/robustness/:experimentId
```

## Completion Gate

```text
[ ] Formula implemented
[ ] Score bounded
[ ] Attack results used
[ ] Retention calculated
[ ] Classification works
[ ] Results persisted
```

---

# PHASE 13 — DEFENSE ENGINE

## Objective

Implement deterministic defense simulations.

Create:

```text
server/src/engines/defenseEngine.ts
```

---

## 13.1 Adversarial Training Simulation

Use observed adversarial samples to calibrate the deterministic detection configuration.

Process:

```text
Clean Samples
+
Adversarial Samples
↓
Calibration
↓
Updated Detection Configuration
```

Do not train an ML model.

---

## 13.2 Monotonic Constraint Simulation

Implement deterministic feature constraints.

For configured risk-sensitive features:

```text
Feature risk increases
        ↓
Risk score must not unexpectedly decrease
```

Return:

```text
originalScore
constrainedScore
violations
corrections
prediction
```

---

# PHASE 14 — DEFENSE APIs

Implement:

```text
POST /api/defenses/adversarial-training
POST /api/defenses/monotonic
GET /api/defenses/compare
```

Store:

```text
cleanDetectionRate
adversarialDetectionRate
attackSuccessRate
robustnessScore
processingTimeMs
estimatedCost
configuration
metrics
```

## Completion Gate

```text
[ ] Both defenses execute
[ ] Results differ when inputs justify differences
[ ] Results persist
[ ] Metrics are calculated
[ ] No fake defense behavior
```

---

# PHASE 15 — ARES EXPLAINABILITY

## Objective

Implement rule-based feature contribution analysis.

Create:

```text
server/src/engines/featureContributionEngine.ts
```

Do not use SHAP.

## Output

```text
feature
value
contribution
importance
direction
```

## UI

Create:

```text
/pages/Explainability
```

Display:

```text
Positive Contributors
Negative Contributors
Feature Importance
Clean vs Adversarial
Unstable Features
```

## Completion Gate

```text
[ ] Contributions generated
[ ] Positive/negative direction works
[ ] Importance works
[ ] Clean/adversarial comparison works
[ ] Charts use API data
```

---

# PHASE 16 — DEFENSE COMPARISON

## Objective

Create a complete defense comparison system.

Compare:

```text
Baseline
Adversarial Training Simulation
Monotonic Constraint Simulation
```

Metrics:

```text
Clean Detection Rate
Adversarial Detection Rate
Attack Success Rate
Robustness Score
Processing Time
Estimated Computational Cost
Improvement Percentage
```

## Frontend

Create:

```text
/pages/Defenses
```

Use:

* comparison cards
* tables
* grouped bar charts

## Completion Gate

```text
[ ] All defense results loaded from API
[ ] Metrics calculated
[ ] Comparison chart works
[ ] Improvement calculated
[ ] No hard-coded results
```

---

# PHASE 17 — RECOMMENDATION ENGINE

## Objective

Build dynamic defense recommendation.

Create:

```text
server/src/engines/recommendationEngine.ts
```

Input:

```text
attackSuccessRate
robustnessScore
detectionRetention
featureInstability
defensePerformance
computationalCost
```

Output:

```text
recommendedDefense
confidence
reasoning
observedWeaknesses
ranking
```

The recommendation must be calculated from actual experiment results.

## Completion Gate

```text
[ ] Multiple scenarios tested
[ ] Ranking works
[ ] Cost considered
[ ] Confidence calculated
[ ] Reasoning generated
[ ] Result persisted
```

---

# PHASE 18 — EXPERIMENT MANAGEMENT

## Objective

Create complete experiment lifecycle management.

Route:

```text
/experiments
```

Users can:

* create experiment
* select dataset
* select attack
* select defense
* run experiment
* view experiment
* compare experiments
* delete experiment

## Lifecycle

```text
PENDING
 ↓
RUNNING
 ↓
COMPLETED
```

Failure:

```text
RUNNING
 ↓
FAILED
```

## Completion Gate

```text
[ ] Experiment creation works
[ ] Status updates work
[ ] Results connected
[ ] History works
[ ] Delete works
[ ] Authorization enforced
```

---

# PHASE 19 — REPORT ENGINE

## Objective

Generate complete automated ARES reports.

Create:

```text
server/src/services/reportService.ts
```

Report sections:

```text
Executive Summary
Experiment Information
Dataset Information
Detection Engine
Clean Evaluation
Padding Results
GAMMA Results
Robustness Metrics
Feature Contribution Analysis
Defense Comparison
Computational Cost
Detected Weaknesses
Recommendation
Overall Robustness Rating
Methodology
Limitations
```

## API

```text
POST /api/reports/generate
GET /api/reports/:id
```

## Export

Support:

* HTML
* JSON
* Print
* PDF where feasible using a Node-compatible solution

## Completion Gate

```text
[ ] Report generated from database data
[ ] Report persisted
[ ] Report viewer works
[ ] JSON export works
[ ] Print works
[ ] PDF works if implemented
```

---

# PHASE 20 — FRONTEND APPLICATION SHELL

## Objective

Build the complete professional UI.

Use:

```text
React
TypeScript
Tailwind
React Router
Recharts
Lucide
```

Create:

```text
AppShell
Sidebar
Topbar
```

## Routes

```text
/
 /login
 /register
 /forgot-password
 /dashboard
 /dataset
 /detection
 /evaluation
 /attacks
 /attacks/padding
 /attacks/gamma
 /robustness
 /explainability
 /defenses
 /defenses/adversarial-training
 /defenses/monotonic
 /experiments
 /recommendations
 /reports
 /settings
```

---

# PHASE 21 — REUSABLE COMPONENT SYSTEM

Create:

```text
Sidebar
Topbar
StatCard
MetricCard
ChartCard
DataTable
Badge
StatusIndicator
RiskGauge
ProgressBar
AttackCard
DefenseCard
FeatureContributionChart
ConfusionMatrix
ComparisonTable
RecommendationCard
ReportViewer
ExperimentTimeline
```

Components must be reusable and typed.

Avoid duplicating UI logic.

---

# PHASE 22 — DASHBOARD

## Objective

Create the main ARES command center.

## Metrics

Load from:

```text
GET /api/dashboard
```

Display:

```text
Total Experiments
Samples Analyzed
Clean Detection Rate
Attack Success Rate
Robustness Score
Recommended Defense
```

## Charts

Implement:

```text
Clean vs Adversarial Detection
Attack Success Rate
Defense Comparison
Robustness Trend
Malware/Benign Distribution
```

## Rule

Dashboard values must come from API/database data.

Never permanently hard-code them.

## Completion Gate

```text
[ ] Dashboard API works
[ ] Cards use real data
[ ] Charts use real data
[ ] Recent experiments work
[ ] Recommendation works
[ ] Loading state works
[ ] Error state works
```

---

# PHASE 23 — DATASET UI

Create `/dataset`.

Include:

* dataset selector
* upload
* statistics
* feature list
* sample table
* distribution chart
* missing values
* quality indicators

Use actual API data.

---

# PHASE 24 — EVALUATION UI

Create `/evaluation`.

Include:

* dataset selector
* Run Evaluation button
* metric cards
* confusion matrix
* prediction distribution
* evaluation history

Buttons must invoke real APIs.

---

# PHASE 25 — ATTACK UI

Create:

```text
/attacks
/attacks/padding
/attacks/gamma
```

Provide:

* experiment selection
* attack configuration
* Run Attack button
* progress indicator
* before/after comparison
* changed feature table
* attack success indicator

Display the safety methodology note.

---

# PHASE 26 — ROBUSTNESS UI

Create `/robustness`.

Display:

* robustness gauge
* attack success
* detection retention
* degradation
* stability
* robustness classification
* experiment history

---

# PHASE 27 — EXPLAINABILITY UI

Create `/explainability`.

Display:

* feature contributions
* contribution chart
* positive contributors
* negative contributors
* clean vs adversarial feature changes
* unstable features

---

# PHASE 28 — DEFENSE UI

Create:

```text
/defenses
/defenses/adversarial-training
/defenses/monotonic
```

Show:

* defense configuration
* execution status
* metrics
* comparison
* processing time
* estimated cost

---

# PHASE 29 — RECOMMENDATION UI

Create `/recommendations`.

Display:

```text
Recommended Defense
Confidence
Reasoning
Observed Weaknesses
Defense Ranking
```

Recommendation must come from backend.

---

# PHASE 30 — REPORT UI

Create `/reports`.

Users can:

* browse reports
* open report
* print
* download JSON
* export PDF if available

Create a professional security-report viewer.

---

# PHASE 31 — COMPLETE DEMO PIPELINE

## Objective

Create the primary academic demonstration feature.

Button:

**Run Complete ARES Demo**

## API

```text
POST /api/demo/run
```

## Pipeline

```text
ARES Demonstration Dataset
        ↓
Clean Evaluation
        ↓
Padding Simulation
        ↓
GAMMA Simulation
        ↓
Robustness Evaluation
        ↓
Adversarial Training Simulation
        ↓
Monotonic Constraint Simulation
        ↓
Explainability
        ↓
Defense Comparison
        ↓
Recommendation
        ↓
Report
```

## Progress UI

Display:

```text
✓ Dataset loaded
✓ Clean evaluation completed
✓ Padding simulation completed
✓ GAMMA simulation completed
✓ Robustness calculated
✓ Defense evaluation completed
✓ Feature analysis completed
✓ Recommendation generated
✓ Report generated
```

## Important

The progress must reflect real backend stages.

Do not simulate fake progress using arbitrary timers.

---

# PHASE 32 — FRONTEND API SERVICE LAYER

Create:

```text
authService.ts
dashboardService.ts
datasetService.ts
detectionService.ts
evaluationService.ts
attackService.ts
robustnessService.ts
defenseService.ts
explainabilityService.ts
recommendationService.ts
reportService.ts
experimentService.ts
```

All API communication should go through these services.

Use Axios.

---

# PHASE 33 — FRONTEND HOOKS

Create reusable hooks where appropriate:

```text
useAuth
useDashboard
useDataset
useDetection
useEvaluation
useAttack
useRobustness
useDefense
useExplainability
useRecommendation
useReport
useExperiment
```

Hooks must correctly manage:

* loading
* data
* errors
* refetching

---

# PHASE 34 — ERROR HANDLING

## Frontend

Implement:

* API error notifications
* empty states
* loading states
* retry buttons
* validation messages
* disabled processing buttons
* error boundaries where useful

## Backend

Implement:

* central error middleware
* structured errors
* correct HTTP codes
* validation errors
* database errors

Never silently ignore failures.

---

# PHASE 35 — SECURITY HARDENING

Audit the entire project.

Verify:

```text
[ ] Passwords hashed
[ ] JWT secure
[ ] Secrets environment-based
[ ] Helmet enabled
[ ] CORS configured
[ ] Rate limiting enabled
[ ] Zod validation
[ ] Mongoose queries and schema validation
[ ] Upload limits
[ ] File extension validation
[ ] No executable execution
[ ] No shell execution
[ ] No eval()
[ ] No arbitrary code execution
```

Search the source code for dangerous execution patterns.

---

# PHASE 36 — TESTING

Use:

```text
docs/TESTING_QA.md
```

Implement tests for:

```text
Detection Engine
Feature Contributions
Padding
GAMMA
Robustness
Defense Engine
Recommendation
Authentication
Dataset
REST APIs
Frontend
Demo Pipeline
Security
```

At minimum, ensure all deterministic engines are tested for reproducibility.

---

# PHASE 37 — END-TO-END TEST

Run the complete user journey:

```text
Register
 ↓
Login
 ↓
Dashboard
 ↓
Load Demo Dataset
 ↓
Clean Evaluation
 ↓
Padding
 ↓
GAMMA
 ↓
Robustness
 ↓
Explainability
 ↓
Adversarial Training
 ↓
Monotonic Constraints
 ↓
Defense Comparison
 ↓
Recommendation
 ↓
Report
```

Then test:

**Run Complete ARES Demo**

from the dashboard.

---

# PHASE 38 — PERFORMANCE AND UX REVIEW

Check:

* unnecessary API calls
* duplicate requests
* large dataset handling
* chart rendering
* pagination
* loading performance
* database query performance
* responsive layouts

Ensure large tables use pagination.

---

# PHASE 39 — ACCESSIBILITY REVIEW

Verify:

* keyboard navigation
* semantic buttons
* labels
* focus states
* readable contrast
* form error messages
* status messages
* accessible navigation

---

# PHASE 40 — RESPONSIVE DESIGN REVIEW

Test:

```text
Mobile
Tablet
Desktop
Large Desktop
```

Ensure:

* sidebar becomes drawer
* cards stack
* charts resize
* tables scroll
* forms adapt

---

# PHASE 41 — DOCUMENTATION

Update `README.md`.

Include:

```text
ARES
Overview
Problem Statement
Objectives
Features
Architecture
Technology Stack
Database
API
Installation
Environment Variables
Running Locally
Docker
Demo Workflow
Testing
Security
GitHub Setup
Limitations
Academic Transparency
```

Include:

> This implementation uses deterministic JavaScript/TypeScript-based detection, attack simulation, defense simulation, and feature contribution analysis for demonstration purposes. It does not implement a real LightGBM model or SHAP library.

---

# PHASE 42 — GITHUB READINESS

Ensure:

```text
.gitignore
.env.example
README.md
LICENSE
```

Never commit:

```text
.env
node_modules
dist
build
database credentials
private keys
uploaded executable files
```

Review the Git status before completion.

---

# PHASE 43 — FINAL SOURCE AUDIT

Perform a repository-wide search.

Confirm:

```text
[ ] No Python files
[ ] No Python dependencies
[ ] No ML framework dependencies
[ ] No LightGBM dependency
[ ] No SHAP dependency
[ ] No cloud AI API
[ ] No executable malware
[ ] No fake dashboard values
[ ] No fake buttons
[ ] No placeholder critical functionality
[ ] No hard-coded credentials
[ ] No unsafe execution
```

---

# PHASE 44 — FINAL BUILD

Run:

```bash
npm install
```

```bash
npm run build
```

Build both:

```text
client
server
```

Fix every build error.

---

# PHASE 45 — FINAL ACCEPTANCE TEST

The project is complete only when all of the following pass:

```text
[ ] Project installs
[ ] MongoDB starts
[ ] Mongoose works
[ ] Seed works

[ ] Registration
[ ] Login
[ ] JWT
[ ] Protected routes
[ ] Role authorization

[ ] Demo dataset
[ ] CSV import
[ ] JSON import
[ ] Dataset statistics

[ ] Detection engine
[ ] Detection API
[ ] Detection UI

[ ] Clean evaluation
[ ] Metrics
[ ] Confusion matrix

[ ] Padding simulation
[ ] GAMMA simulation
[ ] Attack success

[ ] Robustness engine
[ ] Robustness API
[ ] Robustness UI

[ ] Adversarial Training Simulation
[ ] Monotonic Constraint Simulation

[ ] Explainability
[ ] Feature contributions
[ ] Feature comparison

[ ] Defense comparison

[ ] Recommendation engine
[ ] Recommendation UI

[ ] Experiment management
[ ] Experiment history

[ ] Report generation
[ ] Report viewer
[ ] JSON export
[ ] Print
[ ] PDF if implemented

[ ] Complete demo pipeline

[ ] Error handling
[ ] Loading states
[ ] Empty states

[ ] Security audit
[ ] Accessibility
[ ] Responsive UI

[ ] Frontend build
[ ] Backend build
[ ] Tests

[ ] README
[ ] .gitignore
[ ] .env.example
[ ] GitHub readiness
```

---

# 46. DEFINITION OF DONE

ARES is considered complete only when:

1. The frontend is functional.
2. The backend is functional.
3. MongoDB is functional.
4. Mongoose models and queries work.
5. Authentication works.
6. The dataset system works.
7. The ARES Detection Engine works.
8. Clean evaluation works.
9. Padding simulation works.
10. GAMMA-inspired simulation works.
11. Robustness evaluation works.
12. Defense simulations work.
13. Explainability works.
14. Defense comparison works.
15. Recommendation works.
16. Reports work.
17. Experiment persistence works.
18. Complete Demo works.
19. All important dashboard values come from the backend/database.
20. Security controls are implemented.
21. Tests pass.
22. Production builds pass.
23. No Python exists in the implementation.
24. No external ML library exists.
25. No uploaded executable is executed.
26. No critical button is fake.
27. Documentation is complete.

---

# 47. IMPLEMENTATION AGENT RULES

While implementing ARES:

### Rule 1

Do not skip phases.

### Rule 2

Do not mark unfinished functionality as complete.

### Rule 3

Do not replace backend functionality with frontend mock data.

### Rule 4

Do not hard-code metrics that should be calculated.

### Rule 5

Do not introduce forbidden technologies.

### Rule 6

Do not execute uploaded files.

### Rule 7

Do not silently swallow errors.

### Rule 8

Use the documentation as the source of truth.

### Rule 9

After each phase, run verification.

### Rule 10

Fix errors before continuing.

### Rule 11

Prefer simple deterministic algorithms over unnecessary dependencies.

### Rule 12

Keep the architecture modular.

### Rule 13

Use TypeScript strongly throughout the project.

### Rule 14

Every major frontend button must perform a real backend operation.

### Rule 15

Do not finish at scaffolding. Implement the actual application.

---

# 48. FINAL IMPLEMENTATION OUTPUT

When all phases are complete, provide:

## Implementation Summary

Explain what was built.

## Architecture Summary

Explain:

```text
Frontend
Backend
Database
Engines
API
Authentication
```

## Feature Summary

List:

```text
Dataset
Detection
Evaluation
Attacks
Robustness
Defenses
Explainability
Recommendation
Reports
Demo
```

## Verification Summary

Report:

```text
Build status
Test status
Database status
Authentication status
Demo status
Security status
```

## Known Limitations

Clearly identify limitations of the deterministic demonstration approach.

Do not claim ML performance.

---

# FINAL INSTRUCTION

Start with **PHASE 0**.

Read and understand the entire `docs/` directory.

Inspect the repository.

Then execute the phases sequentially.

Do not stop at UI scaffolding.

Do not create a static mockup.

Build the complete working ARES application with real frontend → API → service → engine → database integration.

**The final application must be safe, deterministic, database-backed, testable, professional, and GitHub-ready.**
