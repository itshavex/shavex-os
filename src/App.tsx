import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Roadmaps from './components/Roadmaps';
import FocusMode from './components/FocusMode';
import KnowledgeVault from './components/KnowledgeVault';
import { StateProvider } from './context/StateContext';

function App() {
  return (
    <StateProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="roadmaps" element={<Roadmaps />} />
            <Route path="vault" element={<KnowledgeVault />} />
            <Route path="profile" element={<div className="p-8 text-center text-secondary">Profile Coming Soon</div>} />
          </Route>
          
          {/* Focus Mode is full screen isolation */}
          <Route path="/focus" element={<FocusMode />} />
        </Routes>
      </Router>
    </StateProvider>
  );
}

export default App;
