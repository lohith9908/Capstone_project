# ARES — Automated Robustness Evaluation System

> **Test. Understand. Improve.**

ARES is a cybersecurity research and demonstration platform designed to evaluate the robustness of static malware detection systems against feature-level adversarial transformations.

---

## 1. Architecture

ARES follows a clean, layered architecture:

```text
React → Express → Services → Engines → Mongoose → MongoDB
```

```text
┌─────────────────────────────────────────────────────────────┐
│                    React Client (Vite + TS)                 │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / REST
┌──────────────────────────────▼──────────────────────────────┐
│                    Express API Controllers                  │
└──────────────────────────────┬──────────────────────────────┘
                               │ Orchestration
┌──────────────────────────────▼──────────────────────────────┐
│                    Application Services                     │
└──────────────────────────────┬──────────────────────────────┘
                               │ Analysis
┌──────────────────────────────▼──────────────────────────────┐
│                Deterministic Analysis Engines               │
│  - Detection Engine          - Defense Engine               │
│  - Adversarial Engine        - Feature Contribution Engine  │
│  - Robustness Engine         - Recommendation Engine        │
└──────────────────────────────┬──────────────────────────────┘
                               │ ODM
┌──────────────────────────────▼──────────────────────────────┐
│                      Mongoose Models                        │
└──────────────────────────────┬──────────────────────────────┘
                               │ Driver
┌──────────────────────────────▼──────────────────────────────┐
│                         MongoDB                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

### Frontend
- **Framework**: React 18+ with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **HTTP Client**: Axios
- **Data Visualization**: Recharts
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database ODM**: Mongoose
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens) & bcrypt
- **Input Validation**: Zod
- **Security**: Helmet, CORS, express-rate-limit

---

## 3. Database Architecture (MongoDB + Mongoose)

All persistent application state is stored in MongoDB and modeled through Mongoose schemas:

* **User**: Authentication credentials (bcrypt-hashed), roles (`ADMIN`, `ANALYST`, `USER`).
* **Dataset**: Dataset metadata, feature definitions, sample counts, ownership.
* **DatasetSample**: Synthetic feature vectors and ground-truth labels (`MALWARE`, `BENIGN`).
* **Experiment**: End-to-end experiment records, status, attack types, and aggregated scores.
* **AttackResult**: Sample-level evaluation before and after adversarial perturbation.
* **DefenseResult**: Metrics for Baseline, Adversarial Training Simulation, and Monotonic Constraint Simulation.
* **FeatureContribution**: Rule-based feature importance, contribution values, and directionality.
* **Recommendation**: Dynamic defense ranking, confidence scores, reasoning, and observed weaknesses.
* **Report**: Structured experiment summaries and audit reports.

---

## 4. Analysis Engines

All analytical workflows are deterministic, reproducible, and implemented entirely in TypeScript:

1. **Detection Engine** (`detectionEngine.ts`): Rule-based feature-vector scoring, threat classification, and risk tiering.
2. **Adversarial Engine** (`adversarialEngine.ts`): Safe feature-level perturbation simulations:
   - *Padding Simulation*: Simulates benign slack-space/overlay feature expansion.
   - *GAMMA-inspired Simulation*: Injects benign section-like features in a bounded space.
3. **Robustness Engine** (`robustnessEngine.ts`): Computes detection retention, attack degradation, and overall robustness score (0–100).
4. **Defense Engine** (`defenseEngine.ts`): Evaluates simulated hardening mitigations:
   - *Adversarial Training Simulation*: Retrains detection boundaries using adversarial observations.
   - *Monotonic Constraint Simulation*: Enforces directional monotonicity on risk-sensitive indicators.
5. **Feature Contribution Engine** (`featureContributionEngine.ts`): Transparent, rule-based feature contribution analysis.
6. **Recommendation Engine** (`recommendationEngine.ts`): Dynamically ranks defenses according to attack success, stability, retention, and computational cost.

---

## 5. Application Flow

```text
Register / Login
       ↓
   Dashboard ─── Aggregated database-backed metrics
       ↓
 Dataset Studio ─── Demo dataset or CSV/JSON feature vectors
       ↓
Clean Detection ─── Baseline detection rate & confusion matrix
       ↓
Attack Simulation ─── Padding & GAMMA feature transformations
       ↓
Robustness Studio ─── Retention rate & robustness scoring
       ↓
Explainability ─── Feature contribution comparison
       ↓
Defense Simulation ─── Adversarial Training & Monotonic Constraints
       ↓
Defense Comparison ─── Side-by-side trade-off analysis
       ↓
Recommendation ─── Dynamic defense selection & reasoning
       ↓
Security Report ─── View, JSON export, and printable report
```

---

## 6. Environment Variables

Create a `.env` file in the server directory with:

```env
MONGODB_URI=mongodb://localhost:27017/ares
JWT_SECRET=your_secure_jwt_secret_key_here
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

---

## 7. Safety & Academic Transparency Notice

> **IMPORTANT**: ARES is an educational and research demonstration platform.
> - ARES operates **exclusively** on tabular feature vectors and synthetic numeric samples.
> - ARES does **not** execute, generate, or modify real executable malware or binary files.
> - Uploaded files are restricted strictly to structured data formats (CSV/JSON). No uploaded binary or executable is ever accepted or executed.
> - ARES implements transparent, deterministic TypeScript algorithms for demonstration purposes rather than a production LightGBM model, SHAP library, or external AI cloud inference API.
