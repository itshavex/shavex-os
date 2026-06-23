import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppState } from './context/StateContext.jsx';
import Layout from './components/Layout.jsx';
import Dashboard from './components/Dashboard.jsx';
import Roadmaps from './components/Roadmaps.jsx';
import FocusMode from './components/FocusMode.jsx';
import KnowledgeVault from './components/KnowledgeVault.jsx';
import Reflections from './components/Reflections.jsx';
import FitnessCenter from './components/FitnessCenter.jsx';
import Timeline from './components/Timeline.jsx';
import GrowthInsights from './components/GrowthInsights.jsx';
import Achievements from './components/Achievements.jsx';
import Auth from './components/Auth.jsx';

import Onboarding from './components/Onboarding.jsx';
import { Error404 } from './components/ErrorPages.jsx';

function PrivateRoute({ children }) {
  const { state } = useAppState();
  return state.auth.user ? children : <Navigate to="/login" replace />;
}

function App() {
  const { state, loading } = useAppState();

  if (loading) {
    return (
      <div className="auth-overlay" style={{ display: 'flex', zIndex: 300, background: '#030304', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.08)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px auto' }}></div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: '#fff', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Booting ShaVex OS</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Initializing system modules...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      {/* Onboarding wizard modal overlay */}
      {state.auth.user && !state.onboarded && <Onboarding />}

      <Routes>
        <Route path="/login" element={state.auth.user ? <Navigate to="/dashboard" replace /> : <Auth />} />
        
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="roadmaps" element={<Roadmaps />} />
          <Route path="focus" element={<FocusMode />} />
          <Route path="vault" element={<KnowledgeVault />} />
          <Route path="reflections" element={<Reflections />} />
          <Route path="fitness" element={<FitnessCenter />} />
          <Route path="timeline" element={<Timeline />} />
          <Route path="insights" element={<GrowthInsights />} />
          <Route path="achievements" element={<Achievements />} />
        </Route>

        <Route path="*" element={<Error404 />} />
      </Routes>
    </Router>
  );
}

export default App;
