# ARES — UI/UX Design Specification

## Design Direction
Professional enterprise cybersecurity platform combining SOC aesthetics with research analytics.

Avoid generic admin dashboards, excessive gradients, excessive glassmorphism, cartoonish imagery, and fake malware visuals.

## Brand
ARES
Automated Robustness Evaluation System
Tagline: **Test. Understand. Improve.**

## Visual Theme
Dark navy/black background with restrained green and blue accents, clean typography, subtle borders, moderate glass effects, subtle animations.

Suggested palette:
- Background #050816
- Surface #0B1220
- Elevated #111827
- Border #1E293B
- Green #22C55E
- Blue #38BDF8
- Warning #F59E0B
- Danger #EF4444
- Muted #94A3B8

## Typography
Inter or system-ui. Bold compact headings, readable body text.

## Layout
Desktop:
```text
┌──────────────────────────────────────────┐
│ TOPBAR                                   │
├─────────────┬────────────────────────────┤
│ SIDEBAR     │ MAIN CONTENT               │
│             │                            │
└─────────────┴────────────────────────────┘
```

Sidebar approximately 240–260px. Main content max-width around 1600px.

## Navigation
```text
OVERVIEW
Dashboard

ANALYSIS
Dataset
Detection
Evaluation

ADVERSARIAL
Attacks
 ├── Padding
 └── GAMMA

ROBUSTNESS
Robustness
Explainability

DEFENSE
Adversarial Training
Monotonic Constraints

MANAGEMENT
Experiments
Recommendations
Reports

SYSTEM
Settings
```

## Reusable Components
Sidebar, Topbar, StatCard, MetricCard, ChartCard, DataTable, Badge, StatusIndicator, RiskGauge, ProgressBar, AttackCard, DefenseCard, FeatureContributionChart, ConfusionMatrix, ComparisonTable, RecommendationCard, ReportViewer, ExperimentTimeline.

## Dashboard
Six primary cards:
- Total Experiments
- Samples Analyzed
- Clean Detection Rate
- Attack Success Rate
- Robustness Score
- Recommended Defense

Charts:
- robustness trend
- defense comparison
- dataset distribution
- clean vs adversarial detection

## Risk
Risk score 0–100. Robustness:
- 0–59 LOW
- 60–79 MEDIUM
- 80–100 HIGH

## Tables
Sorting, pagination, hover, status badges, responsive horizontal scrolling.

## Confusion Matrix
```text
                 Predicted
              Malware   Benign
Actual Malware   TP       FN
Actual Benign    FP       TN
```

## Attack Page
Title: **Adversarial Attack Simulation**

Always display:
> ARES operates only on synthetic feature vectors. No executable files are created or modified.

## Before/After
Show clean and adversarial score, prediction, risk, and changed features side-by-side.

## Explainability
Title: **ARES Explainability**
Subtitle: **Rule-based feature contribution analysis**
Display positive contributors, negative contributors, importance, and clean/adversarial comparison.

## Defense Comparison
Compare Baseline, Adversarial Training Simulation, and Monotonic Constraint Simulation using detection, attack success, robustness, processing time, and estimated cost.

## Recommendation
Use a prominent card containing defense, confidence, reasoning, and observed weaknesses. Content must be dynamic.

## Reports
Professional security-assessment style:
- Executive Summary
- Experiment Details
- Dataset
- Detection
- Attack Results
- Robustness
- Explainability
- Defense Comparison
- Recommendation
- Limitations

## Methodology Note
Use:
> ARES uses deterministic TypeScript-based simulations for demonstration. It does not implement a production LightGBM model, SHAP, or executable malware transformation.

## Responsive
Support mobile, tablet, desktop, and large desktop. Mobile uses sidebar drawer and stacked cards.

## Animation
Use subtle fade/slide/progress/hover animations. Avoid distracting effects.

## Accessibility
Keyboard navigation, semantic controls, visible focus, readable contrast, labels, accessible errors, and status messages.

## Design Principle
Prioritize:
```text
Insight → Metric → Evidence → Action
```
