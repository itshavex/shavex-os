import React, { useState, useEffect, useRef } from 'react';
import { useAppState } from '../context/StateContext';
import { Play, Pause, RotateCw, ExternalLink, Award, Sparkles } from 'lucide-react';

export default function FocusMode() {
  const { state, saveState, calculateTrackProgress } = useAppState();

  const currentGoalName = state.currentGoalName || "AI Engineer";
  const goal = state.goals?.[currentGoalName];
  const nextMove = state.nextMove;

  // Active Phase Resources
  const activePhase = goal?.phases?.[nextMove?.phaseIndex || 0];
  const resources = activePhase?.resources || [];
  
  // Progress ratio strictly milestone-based
  const goalProgress = calculateTrackProgress(currentGoalName);

  // Timer states
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1500); // 25 mins initial
  const [totalDuration, setTotalDuration] = useState(1500);
  const [xpAwarded, setXpAwarded] = useState(false);
  const [isFullscreenFocus, setIsFullscreenFocus] = useState(false);

  const timerRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsPlaying(false);
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isPlaying]);

  const handleTimerComplete = () => {
    const cloned = JSON.parse(JSON.stringify(state));
    cloned.xp += 15; // Award focus XP
    
    // Update memory
    cloned.memory.lastCompletedMilestone = nextMove?.task || "Focus Session";
    cloned.memory.lastStudySession = new Date().toISOString();
    
    saveState(cloned);
    setXpAwarded(true);
  };

  const handleToggleTimer = () => {
    setIsPlaying(!isPlaying);
  };

  const handleResetTimer = () => {
    setIsPlaying(false);
    setTimeLeft(totalDuration);
    setXpAwarded(false);
  };

  const handleChangeDuration = (minutes) => {
    setIsPlaying(false);
    const secs = minutes * 60;
    setTotalDuration(secs);
    setTimeLeft(secs);
    setXpAwarded(false);
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const timerProgress = ((totalDuration - timeLeft) / totalDuration) * 100;

  return (
    <div className={`tab-pane active ${isFullscreenFocus ? 'fullscreen-focus-mode' : ''}`} id="focus" style={{ display: 'flex', justifyContent: 'center', transition: 'all 0.3s' }}>
      
      <div 
        style={{ 
          maxWidth: '520px', 
          width: '100%',
          textAlign: 'center', 
          padding: '24px 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px' 
        }}
      >
        
        {/* Destination & Mission Details */}
        <div>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800 }}>
            🎯 Destination Goal: {currentGoalName}
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', fontWeight: 800, color: '#fff', margin: '6px 0 12px 0', lineHeight: 1.3 }}>
            {nextMove?.task || "Define curriculum study units"}
          </h2>
          <button
            onClick={() => setIsFullscreenFocus(!isFullscreenFocus)}
            className="priority-toggle"
            style={{ fontSize: '0.62rem', height: '24px', padding: '0 10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}
          >
            {isFullscreenFocus ? "Exit Fullscreen" : "Toggle Fullscreen Mode"}
          </button>
        </div>

        {/* Circular Timer Display */}
        <div 
          className="glass animate-pulse" 
          style={{ 
            width: '240px', 
            height: '240px', 
            borderRadius: '50%', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            position: 'relative',
            background: 'radial-gradient(circle, rgba(3,3,4,0.7) 40%, rgba(255,255,255,0.01) 100%)',
            boxShadow: isPlaying ? '0 0 25px rgba(0, 102, 255, 0.15)' : 'none',
            border: '1px solid rgba(255,255,255,0.03)',
            transition: 'box-shadow 0.3s'
          }}
        >
          <svg style={{ position: 'absolute', transform: 'rotate(-90deg)', width: '236px', height: '236px' }}>
            <circle 
              cx="118" 
              cy="118" 
              r="110" 
              fill="transparent" 
              stroke="rgba(255,255,255,0.01)" 
              strokeWidth="4" 
            />
            <circle 
              cx="118" 
              cy="118" 
              r="110" 
              fill="transparent" 
              stroke="var(--primary)" 
              strokeWidth="4" 
              strokeDasharray={691}
              strokeDashoffset={691 - (691 * timerProgress) / 100}
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
          </svg>

          <div style={{ fontSize: '3rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff', zIndex: 2 }}>
            {formatTime(timeLeft)}
          </div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', zIndex: 2, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '2px' }}>
            {isPlaying ? "Focus Active" : "Paused"}
          </div>
        </div>

        {/* Timer Presets Selection */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {[15, 25, 45, 60].map(mins => (
            <button
              key={mins}
              className={`priority-toggle ${totalDuration === mins * 60 ? 'active' : ''}`}
              style={{ height: '28px', fontSize: '0.7rem', padding: '0 10px' }}
              onClick={() => handleChangeDuration(mins)}
            >
              {mins} Min
            </button>
          ))}
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button 
            onClick={handleToggleTimer} 
            className="focus-btn" 
            style={{ 
              height: '42px', 
              padding: '0 24px', 
              fontSize: '0.85rem', 
              fontWeight: 700, 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px' 
            }}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            {isPlaying ? "Pause Mission" : "🚀 Start Mission"}
          </button>

          <button 
            onClick={handleResetTimer} 
            className="delete-task-btn" 
            style={{ width: '42px', height: '42px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Reset Timer"
          >
            <RotateCw size={14} />
          </button>
        </div>

        {xpAwarded && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-green)', fontSize: '0.75rem', animation: 'fade-in 0.5s' }}>
            <Award size={14} />
            <span>Mission Completed! +15 OS XP added.</span>
          </div>
        )}

        {/* Dynamic Journey Progress Bar */}
        <div className="glass p-4 text-left" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justify: 'space-between', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            <span>Journey Progress</span>
            <strong>{goalProgress}%</strong>
          </div>
          <div className="xp-bar-container" style={{ height: '5px', background: 'rgba(255,255,255,0.02)' }}>
            <div className="xp-bar-fill" style={{ width: `${goalProgress}%`, background: 'var(--primary)' }} />
          </div>
        </div>

        {/* Active Phase Resources Launcher */}
        <div className="glass p-4 text-left" style={{ width: '100%' }}>
          <h4 style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={12} color="var(--primary)" /> Knowledge Vault Source Launcher
          </h4>
          {resources.length === 0 ? (
            <p style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontStyle: 'italic', margin: 0 }}>
              No study links associated with this Journey phase.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {resources.map(res => (
                <a
                  key={res.id}
                  href={res.url}
                  target="_blank"
                  rel="noreferrer"
                  className="task-item cursor-pointer"
                  style={{ 
                    padding: '8px 12px', 
                    textDecoration: 'none', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    background: 'rgba(255,255,255,0.01)', 
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px'
                  }}
                >
                  <span className="res-tag-badge general" style={{ fontSize: '0.55rem', padding: '2px 6px' }}>{res.type}</span>
                  <span style={{ fontSize: '0.78rem', color: '#fff', fontWeight: 600, flexGrow: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {res.title}
                  </span>
                  <ExternalLink size={10} style={{ color: 'var(--text-secondary)', marginLeft: 'auto' }} />
                </a>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
