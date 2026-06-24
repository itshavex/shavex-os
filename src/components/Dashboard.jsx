import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../context/StateContext';
import { Zap, Target, Check, Bot, Flame, Heart, TrendingUp, Clock, Compass } from 'lucide-react';

export default function Dashboard() {
  const { 
    state, 
    saveState,
    calculateStreak, 
    getXPLevel, 
    calculateTrackProgress,
    calculateOverallProgress,
    showWelcomeBack,
    setShowWelcomeBack,
    generateDailyMissions,
    getCoachInsights,
    calculateRoadHealth
  } = useAppState();
  
  const navigate = useNavigate();
  const streak = calculateStreak();
  const overallProgress = calculateOverallProgress();
  const currentGoalName = state.currentGoalName || "AI Engineer";
  const coachInsights = getCoachInsights();
  const roadHealthInfo = calculateRoadHealth();

  const handleStartNextMoveFocus = () => {
    navigate('/focus');
  };

  const handleToggleMission = (id) => {
    const cloned = JSON.parse(JSON.stringify(state));
    const item = cloned.missions.today.find(m => m.id === id);
    if (item) {
      item.completed = !item.completed;
      if (item.completed) {
        cloned.xp += 5;
        // Update memory
        cloned.memory.lastCompletedMilestone = item.text;
        cloned.memory.lastStudySession = new Date().toISOString();
      }
      saveState(cloned);
    }
  };

  const todayMissions = state.missions?.today || [];
  const completedMissionsCount = todayMissions.filter(m => m.completed).length;
  const expectedProgressVal = todayMissions.length > 0 
    ? Math.round((completedMissionsCount / todayMissions.length) * 100) 
    : 0;

  const goal = state.goals?.[currentGoalName];
  const activePhase = goal?.phases?.[state.nextMove?.phaseIndex || 0];

  // Road Health Badge styling helper
  const getRoadHealthClass = (status) => {
    if (status === 'Excellent') return 'status-badge-excellent';
    if (status === 'Good') return 'status-badge-good';
    return 'status-badge-risk';
  };

  return (
    <section className="content-pane active" id="pane-dashboard">
      
      {/* Momentum Recovery Banner */}
      {showWelcomeBack && (
        <div className="glass p-4 mb-5 animate-fade-in" style={{ borderLeft: '4px solid var(--primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.92rem', color: '#fff', fontWeight: 800 }}>Welcome Back</h4>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Resume exactly where you left off. Your AI coach has preserved your session state.
            </p>
          </div>
          <button 
            onClick={() => setShowWelcomeBack(false)} 
            className="priority-toggle" 
            style={{ height: '28px', fontSize: '0.7rem', padding: '0 10px' }}
          >
            Resume Journey
          </button>
        </div>
      )}

      {/* AI Memory Resume Banner (Always visible if there is a last session) */}
      {state.memory?.lastCompletedMilestone && (
        <div className="glass p-4 mb-6" style={{ background: 'linear-gradient(to right, rgba(0, 102, 255, 0.05), transparent)', borderLeft: '3px solid var(--primary)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justify: 'space-between', alignItems: 'center', gap: '12px' }}>
            <div>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--primary)', fontWeight: 800 }}>AI System Memory</span>
              <h4 style={{ fontSize: '0.88rem', margin: '4px 0 2px 0', color: '#fff' }}>
                Last Completed: <strong style={{ color: 'var(--accent-green)' }}>{state.memory.lastCompletedMilestone}</strong>
              </h4>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0 }}>
                Phase: {state.memory.lastActiveRoadmapPhase || "Foundations"} • Resource: {state.memory.lastStudyResource || "Vault Reference"}
              </p>
            </div>
            <button 
              onClick={() => navigate('/focus')}
              className="priority-toggle active"
              style={{ fontSize: '0.72rem', height: '30px', padding: '0 12px' }}
            >
              Resume Focus Mode
            </button>
          </div>
        </div>
      )}

      {/* Dashboard Grid showing requested elements */}
      <div className="grid-2-1">
        
        {/* Left Side: Destination, Position, Next Move, Insights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Core GPS Tracking Card */}
          <div className="glass p-6" style={{ background: 'linear-gradient(135deg, rgba(3,3,4,0.6) 0%, rgba(255,255,255,0.01) 100%)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}>
              <div>
                <span className="stat-label" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem' }}>
                  <Target size={12} color="var(--primary)" /> 🎯 Destination
                </span>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '4px 0 0 0', color: '#fff', lineHeight: '1.4' }}>
                  {Object.keys(state.goals || {}).length > 0 ? currentGoalName : "Choose your destination to begin your journey."}
                </h3>
              </div>
              <div>
                <span className="stat-label" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem' }}>
                  <Compass size={12} color="var(--accent-orange)" /> 📍 Current Position
                </span>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '4px 0 0 0', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {Object.keys(state.goals || {}).length > 0 ? (activePhase?.name || "Create your first journey map.") : "--"}
                </h3>
              </div>
            </div>

            {/* Next Move Engine Cockpit */}
            <div>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.5px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                🚀 Next Move Engine
              </span>
              <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '16px' }}>
                <div style={{ display: 'flex', justify: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <h4 style={{ fontSize: '1rem', margin: 0, color: '#fff', fontWeight: 700, lineHeight: '1.4' }}>
                    {Object.keys(state.goals || {}).length > 0 ? (state.nextMove?.task || "Create your first journey map.") : "Choose your destination to begin your journey."}
                  </h4>
                  {Object.keys(state.goals || {}).length > 0 && state.nextMove?.estimatedTime && state.nextMove?.estimatedTime !== "--" && (
                    <span className="timeline-badge active" style={{ fontSize: '0.65rem', whiteSpace: 'nowrap' }}>
                      ⏱ {state.nextMove?.estimatedTime}
                    </span>
                  )}
                </div>
                
                <div style={{ display: 'flex', justify: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  <span>Expected Impact: <strong style={{ color: 'var(--accent-orange)' }}>{Object.keys(state.goals || {}).length > 0 ? (state.nextMove?.impact || "--") : "--"}</strong></span>
                  {Object.keys(state.goals || {}).length > 0 && state.nextMove?.task && (
                    <button 
                      onClick={handleStartNextMoveFocus} 
                      className="focus-btn" 
                      style={{ height: '28px', padding: '0 12px', fontSize: '0.72rem', fontWeight: 700 }}
                    >
                      Start Mission
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* AI Coach Insights Panel */}
          <div className="glass p-6" style={{ borderLeft: '4px solid var(--accent-orange)' }}>
            <h4 style={{ margin: 0, fontSize: '0.92rem', color: '#fff', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Bot size={16} style={{ color: 'var(--accent-orange)' }} /> 🤖 Coach Insight
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {coachInsights.length === 0 ? (
                <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontStyle: 'italic', margin: 0 }}>
                  Analyzing your learning patterns. Insights will compile as you complete missions.
                </p>
              ) : (
                coachInsights.map((insight, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                      {insight}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Right Side: Today's Mission, Momentum, Progress, Road Health */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Today's Mission Engine */}
          <div className="glass p-5" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justify: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: '#fff' }}>
                📝 Today's Mission
              </h4>
              {todayMissions.length > 0 && (
                <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 700 }}>
                  {expectedProgressVal}% Expected Progress
                </span>
              )}
            </div>

            {/* Time Budget Selector */}
            <div style={{ background: 'rgba(255,255,255,0.01)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                How much time do you have today?
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {['15 min', '30 min', '45 min', '1 hr', '2 hr', '3 hr', 'Custom'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => generateDailyMissions(opt)}
                    className="priority-toggle"
                    style={{ height: '24px', padding: '0 8px', fontSize: '0.65rem' }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Missions Checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {todayMissions.length === 0 ? (
                <p style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', fontStyle: 'italic', padding: '16px 0', textAlign: 'center', margin: 0 }}>
                  Select available time above to generate today's missions.
                </p>
              ) : (
                todayMissions.map(item => (
                  <div key={item.id} className={`task-item ${item.completed ? 'completed' : ''}`} style={{ padding: '8px 10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexGrow: 1 }}>
                      <div 
                        className="checkbox-custom" 
                        onClick={() => handleToggleMission(item.id)}
                        style={{ cursor: 'pointer', flexShrink: 0 }}
                      >
                        {item.completed && <Check size={10} style={{ color: 'var(--accent-color)' }} />}
                      </div>
                      <span style={{ fontSize: '0.78rem', color: '#fff', lineHeight: 1.3 }}>{item.text}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Diagnostics Card: Momentum, Journey Progress, Road Health */}
          <div className="glass p-5" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              System Diagnostics
            </h4>

            {/* Momentum */}
            <div style={{ display: 'flex', justify: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Flame size={16} color="var(--accent-orange)" />
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>🔥 Momentum</span>
              </div>
              <strong style={{ fontSize: '0.9rem', color: '#fff' }}>{streak} day streak</strong>
            </div>

            {/* Journey Progress */}
            <div>
              <div style={{ display: 'flex', justify: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <TrendingUp size={16} color="var(--primary)" />
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>📈 Journey Progress</span>
                </div>
                <strong style={{ fontSize: '0.85rem', color: 'var(--primary)' }}>{overallProgress}%</strong>
              </div>
              <div className="xp-bar-container" style={{ height: '5px', background: 'rgba(255,255,255,0.02)' }}>
                <div className="xp-bar-fill" style={{ width: `${overallProgress}%`, background: 'var(--primary)' }}></div>
              </div>
            </div>

            {/* Road Health */}
            <div style={{ display: 'flex', justify: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Heart size={16} color="var(--accent-green)" />
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>🏥 Road Health</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>({roadHealthInfo.score}%)</span>
                <span 
                  className={`status-badge ${getRoadHealthClass(roadHealthInfo.status)}`}
                  style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}
                >
                  {roadHealthInfo.status}
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
