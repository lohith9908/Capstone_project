# ARES — Application Flow

## High-Level
```text
Landing
 ↓
Authentication
 ↓
Dashboard
 ↓
Dataset
 ↓
Detection
 ↓
Clean Evaluation
 ↓
Attack Simulation
 ├── Padding
 └── GAMMA-inspired
 ↓
Robustness
 ↓
Explainability
 ↓
Defense Simulation
 ├── Adversarial Training
 └── Monotonic Constraints
 ↓
Defense Comparison
 ↓
Recommendation
 ↓
Report
```

## Registration
```text
Register → validate → POST API → bcrypt → create user → JWT → Dashboard
```

## Login
```text
Login → validate → verify bcrypt → JWT → authenticated dashboard
```

## Dashboard
Call `GET /api/dashboard`. Aggregate database-backed experiment, sample, detection, robustness, defense, and recommendation metrics.

## Dataset
User selects demo dataset or uploads CSV/JSON. Backend validates, parses, stores, and returns statistics and samples.

## Detection
Feature vector → POST API → Detection Engine → score → prediction → risk → contributions.

## Clean Evaluation
Dataset → retrieve samples → detect each → compare labels → metrics → persist experiment → display.

## Attack
Experiment → select attack → feature transformation → original detection → adversarial detection → compare → attack success → persist.

## Robustness
Attack results → detection retention + attack success + stability → robustness formula → score → classification.

## Defense
Experiment → select defense → apply deterministic configuration → evaluate → calculate metrics → persist.

## Explainability
Clean/adversarial features → Feature Contribution Engine → contribution comparison → unstable features.

## Recommendation
Collect experiment metrics → rank defense options → account for cost → generate reasoning → persist.

## Report
Experiment → gather related records → construct report → store → viewer → print/JSON/PDF.

## Complete Demo
```text
START
 ↓
Dataset
 ↓
Clean Evaluation
 ↓
Padding
 ↓
GAMMA
 ↓
Robustness
 ↓
Adversarial Training
 ↓
Monotonic Constraints
 ↓
Explainability
 ↓
Comparison
 ↓
Recommendation
 ↓
Report
 ↓
COMPLETE
```

## Progress UI
Show:
- Dataset loaded
- Clean evaluation completed
- Padding completed
- GAMMA completed
- Robustness completed
- Defense completed
- Explainability completed
- Recommendation generated
- Report generated

## Experiment Lifecycle
```text
PENDING → RUNNING → COMPLETED
                 ↘ FAILED
```

## Error Flow
API error → centralized handler → structured JSON → frontend toast/error state → retry/actionable message.

## Mobile
Sidebar becomes drawer, cards stack, tables scroll horizontally, charts resize, forms become single-column.
