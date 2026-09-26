# ARES — Testing & QA Specification

## Testing Objective
Verify ARES is functional, secure, deterministic, reproducible, database-backed, and safe.

## Test Layers
```text
Unit → Integration → API → Frontend → E2E → Security
```

## Detection Tests
- benign sample classification
- high-risk sample classification
- threshold boundary
- score range 0–100
- deterministic repeated output

## Feature Contribution Tests
- every configured feature represented
- numeric contribution
- non-negative importance
- correct direction
- deterministic output

## Attack Tests
Padding:
- original vector unchanged
- bounded transformations
- only allowed features change
- no file creation/execution

GAMMA-inspired:
- feature-only transformation
- bounded changes
- detection recalculated

## Robustness Tests
Test attack success and retention extremes. Score must remain 0–100. Verify HIGH/MEDIUM/LOW boundaries.

## Defense Tests
Adversarial Training Simulation must use adversarial observations and change configuration where appropriate. Monotonic simulation must ensure configured risk-sensitive features do not reduce risk when increased.

## Recommendation Tests
Test multiple scenarios:
- high attack success
- low attack success
- robustness vs computational cost tradeoff

## Authentication Tests
Test registration, duplicate email, invalid email, password validation, valid/invalid login, missing/expired/malformed token, role restrictions.

## Dataset Tests
Test valid CSV/JSON, malformed data, unsupported extension, oversized upload, missing features, invalid types.

## Security Tests
Verify:
- Helmet
- CORS
- rate limiting
- bcrypt
- environment secrets
- Mongoose queries and schema validations
- executable rejection
- no file execution
- no shell execution
- no eval()
- no arbitrary code execution

## API Tests
Cover every endpoint documented in TRD.md.

## E2E Test
```text
Register → Login → Dashboard → Dataset → Clean Evaluation
→ Padding → GAMMA → Robustness → Defenses
→ Explainability → Recommendation → Report
```

## Demo Test
Click **Run Complete ARES Demo** and verify all stages complete.

## UI QA
Verify responsive behavior, navigation, loading states, errors, empty states, toasts, charts, tables, forms, and modals.

## Accessibility
Keyboard navigation, visible focus, semantic labels, contrast, accessible errors, and status messaging.

## Regression Checklist
```text
[ ] npm install
[ ] MongoDB
[ ] Mongoose models
[ ] database indexes
[ ] seed
[ ] backend build
[ ] frontend build
[ ] registration
[ ] login
[ ] JWT
[ ] dataset
[ ] detection
[ ] evaluation
[ ] padding
[ ] GAMMA
[ ] robustness
[ ] defenses
[ ] explainability
[ ] recommendation
[ ] report
[ ] experiment history
[ ] complete demo
[ ] security
[ ] responsive UI
[ ] README
```

Do not mark the project complete while a critical workflow fails.
