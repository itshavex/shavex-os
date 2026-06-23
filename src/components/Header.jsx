import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAppState } from '../context/StateContext.jsx';
import { Flame } from 'lucide-react';

const TAB_META = {
  '/dashboard': { title: "Mission Control", subtitle: "AI-Powered Personal Operating System" },
  '/roadmaps': { title: "Journey Maps", subtitle: "Visual Milestone Pipeline to Destination Goal" },
  '/focus': { title: "Focus Mode", subtitle: "Distraction-Free Sprint Cockpit" },
  '/vault': { title: "Knowledge Vault", subtitle: "Sleek Bookmark Catalog & Concept Notes" },
  '/reflections': { title: "Reflection Log", subtitle: "Daily Milestone & Performance Audits" },
  '/fitness': { title: "Fitness GPS", subtitle: "Gym, Weight Target, and Hydration Logs" },
  '/timeline': { title: "Life Timeline", subtitle: "Gamified Personal Growth Milestone Pipeline" },
  '/insights': { title: "Growth Insights", subtitle: "AI Analytics Profile & Weekly CEO Reports" },
  '/achievements': { title: "Achievements", subtitle: "Evolve Badges & Milestone Verification" }
};

export default function Header() {
  const location = useLocation();
  const { calculateStreak, calculateOverallProgress } = useAppState();
  
  const path = location.pathname;
  const meta = TAB_META[path] || { title: "ShaVex OS", subtitle: "Choose Your Destination. Build Your System." };

  const streak = calculateStreak();
  const overallProgress = calculateOverallProgress();

  return (
    <header className="header">
      <div className="header-title-section">
        <h1 id="page-title">{meta.title}</h1>
        <p id="page-subtitle">{meta.subtitle}</p>
      </div>
      <div className="header-actions">
        <div className="streak-counter">
          <Flame size={16} fill="var(--accent-orange)" color="var(--accent-orange)" />
          <span>{streak} Day Streak</span>
        </div>
        <div className="progress-header-badge">
          <div className="progress-header-text">
            <div>OS Progress</div>
            <strong>{overallProgress}% Completed</strong>
          </div>
          <div className="progress-header-bar">
            <div className="progress-header-fill" style={{ width: `${overallProgress}%` }}></div>
          </div>
        </div>
      </div>
    </header>
  );
}
