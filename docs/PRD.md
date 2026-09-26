# ARES — Product Requirements Document

## Product
**ARES — Automated Robustness Evaluation System**

Tagline: **Test. Understand. Improve.**

## Vision
ARES is a safe cybersecurity research demonstration platform for evaluating how a deterministic static malware detection system behaves under feature-level adversarial transformations.

## Problem
Static malware detectors can degrade under adversarial feature transformations. ARES provides a unified workflow to establish a baseline, simulate attacks, measure robustness, analyze unstable features, compare defenses, recommend a mitigation, and produce a report.

## Target Users
- Students/researchers
- Security analysts
- Academic evaluators
- Administrators

## Goals
- End-to-end robustness workflow
- Reproducible experiments
- Persistent MongoDB results
- Transparent deterministic calculations
- Visual analytics
- Automated reports
- Professional cybersecurity UX

## Non-Goals
ARES must not:
- execute malware
- generate malware
- modify real executable malware
- train a real ML model
- implement actual LightGBM
- implement actual SHAP
- use cloud ML inference

## Core User Journey
```text
Register → Login → Dashboard → Dataset → Clean Evaluation
→ Attack Simulation → Robustness → Explainability
→ Defense Simulation → Comparison → Recommendation → Report
```

## Functional Requirements
Authentication: register, login, logout, current user.
Dataset: demo dataset, CSV/JSON import, statistics, feature inspection.
Detection: feature-vector analysis, score, prediction, risk, contributions.
Evaluation: clean metrics and confusion matrix.
Attacks: Padding and GAMMA-inspired feature simulations.
Robustness: retention, attack success, degradation, robustness score.
Defenses: adversarial training simulation and monotonic constraint simulation.
Explainability: feature contributions and clean/adversarial comparison.
Recommendation: dynamic defense ranking with reasoning.
Reports: view, print, JSON, and optional PDF export.
Experiments: create, run, compare, view, delete.

## Dashboard
Show database-backed:
- Total Experiments
- Samples Analyzed
- Clean Detection Rate
- Attack Success Rate
- Robustness Score
- Recommended Defense

Charts:
- clean vs adversarial detection
- attack success
- defense comparison
- robustness trend
- malware/benign distribution

## Demo
Provide **Run Complete ARES Demo** to execute the full safe pipeline.

## UX
Use loading states, error states, empty states, disabled duplicate actions, clear terminology, and methodology notes.

## Academic Transparency
State clearly that the project uses deterministic TypeScript simulations rather than actual LightGBM, SHAP, executable malware transformation, or real model training.

## Success Criteria
A new user can complete the entire workflow without manually changing the database. All important UI actions perform real backend operations and results persist in MongoDB.
