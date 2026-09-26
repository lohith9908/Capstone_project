import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';

// Pages
import { Dashboard } from './pages/Dashboard';
import { DatasetStudio } from './pages/DatasetStudio';
import { DetectionStudio } from './pages/DetectionStudio';
import { EvaluationStudio } from './pages/EvaluationStudio';
import { AttackStudio } from './pages/AttackStudio';
import { RobustnessStudio } from './pages/RobustnessStudio';
import { ExplainabilityStudio } from './pages/ExplainabilityStudio';
import { DefenseStudio } from './pages/DefenseStudio';
import { ExperimentsStudio } from './pages/ExperimentsStudio';
import { RecommendationsStudio } from './pages/RecommendationsStudio';
import { ReportsStudio } from './pages/ReportsStudio';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

export const App: React.FC = () => {
  return (
    <AppLayout>
      <Routes>
        {/* Core Overview */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Analysis & Detection */}
        <Route path="/dataset" element={<DatasetStudio />} />
        <Route path="/datasets" element={<DatasetStudio />} />
        <Route path="/detection" element={<DetectionStudio />} />
        <Route path="/evaluation" element={<EvaluationStudio />} />

        {/* Adversarial Attacks */}
        <Route path="/attacks" element={<AttackStudio />} />
        <Route path="/attacks/padding" element={<AttackStudio />} />
        <Route path="/attacks/gamma" element={<AttackStudio />} />

        {/* Robustness & Explainability */}
        <Route path="/robustness" element={<RobustnessStudio />} />
        <Route path="/explainability" element={<ExplainabilityStudio />} />

        {/* Defense Simulations */}
        <Route path="/defenses" element={<DefenseStudio />} />
        <Route path="/defenses/adversarial-training" element={<DefenseStudio />} />
        <Route path="/defenses/monotonic" element={<DefenseStudio />} />

        {/* Management & Governance */}
        <Route path="/experiments" element={<ExperimentsStudio />} />
        <Route path="/recommendations" element={<RecommendationsStudio />} />
        <Route path="/reports" element={<ReportsStudio />} />
        <Route path="/settings" element={<SettingsPage />} />

        {/* Authentication */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  );
};

export default App;
