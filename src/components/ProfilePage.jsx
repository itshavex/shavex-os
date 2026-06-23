import React, { useState, useEffect } from 'react';
import { useAppState } from '../context/StateContext';
import { User, X, Check, AlertCircle, Plus, Sparkles, Trophy, Award, Flame, Calendar, Heart } from 'lucide-react';

export default function ProfilePage({ active, onClose }) {
  const { 
    state, 
    saveState,
    calculateStreak, 
    getXPLevel, 
    calculateProfileCompletion,
    generateUsernameSuggestions,
    isUsernameAvailable,
    calculateRoadHealth
  } = useAppState();

  const user = state.auth.user;

  // Form States initialized from state.profile
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('');
  const [missionStatement, setMissionStatement] = useState('');
  const [primaryGoal, setPrimaryGoal] = useState('');
  const [secondaryGoals, setSecondaryGoals] = useState([]);
  const [targetYear, setTargetYear] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [preferredStudyTime, setPreferredStudyTime] = useState('');
  const [learningStyle, setLearningStyle] = useState('');

  // Editing state variables
  const [newSecGoal, setNewSecGoal] = useState('');
  const [usernameValid, setUsernameValid] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [isModified, setIsModified] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync state.profile on active slide open
  useEffect(() => {
    if (state.profile) {
      setName(state.profile.name || '');
      setUsername(state.profile.username || '');
      setAvatar(state.profile.avatar || '');
      setMissionStatement(state.profile.missionStatement || '');
      setPrimaryGoal(state.profile.primaryGoal || state.currentGoalName || '');
      setSecondaryGoals(state.profile.secondaryGoals || []);
      setTargetYear(state.profile.targetYear || '2027');
      setSkillLevel(state.profile.skillLevel || 'Intermediate');
      setPreferredStudyTime(state.profile.preferredStudyTime || '18:00 - 21:00 (Evening)');
      setLearningStyle(state.profile.learningStyle || 'Visual Learner');
    }
  }, [state.profile, active]);

  // Username validation & suggestions builder
  useEffect(() => {
    const isValid = isUsernameAvailable(username);
    setUsernameValid(isValid);
    if (!isValid || username === '') {
      setSuggestions(generateUsernameSuggestions(name || 'shavex'));
    } else {
      setSuggestions([]);
    }
    setIsModified(true);
  }, [username, name]);

  useEffect(() => {
    setIsModified(true);
  }, [avatar, missionStatement, primaryGoal, secondaryGoals, targetYear, skillLevel, preferredStudyTime, learningStyle]);

  if (!user) return null;

  const email = user.email || "shashwat@shavex.ai";
  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  // Read-only values calculation
  let completedMilestones = 0;
  Object.values(state.goals || {}).forEach(g => {
    (g.phases || []).forEach(p => {
      (p.milestones || []).forEach(m => {
        if (m.completed) completedMilestones++;
      });
    });
  });

  const xpInfo = getXPLevel();
  const streak = calculateStreak();
  const roadHealthInfo = calculateRoadHealth();
  const completionPercent = calculateProfileCompletion({
    name, username, avatar, missionStatement, primaryGoal, secondaryGoals, targetYear, skillLevel, preferredStudyTime, learningStyle
  });

  const handleSave = () => {
    if (!usernameValid) return;
    const cloned = JSON.parse(JSON.stringify(state));
    cloned.profile = {
      ...cloned.profile,
      name,
      username,
      avatar,
      missionStatement,
      primaryGoal,
      secondaryGoals,
      targetYear,
      skillLevel,
      preferredStudyTime,
      learningStyle
    };
    
    // Update active primary goal targeting if modified
    if (primaryGoal !== state.currentGoalName && primaryGoal !== '') {
      cloned.currentGoalName = primaryGoal;
      if (!cloned.goals[primaryGoal]) {
        // Init roadmap dynamically
        const ROADMAP_PRESETS = {
          "AI Engineer": [
            { name: "Computer Fundamentals", milestones: ["Internet", "Operating Systems", "Git", "GitHub", "Terminal"], resources: [] }
          ]
        };
        const phases = ROADMAP_PRESETS[primaryGoal] 
          ? ROADMAP_PRESETS[primaryGoal].map(p => ({ name: p.name, milestones: p.milestones.map(m => ({ name: m, completed: false })), resources: [] }))
          : [{ name: "Initial Study Phase", milestones: [{ name: "Audit study modules", completed: false }], resources: [] }];
        cloned.goals[primaryGoal] = {
          name: primaryGoal,
          phases: phases,
          activePhaseIndex: 0
        };
      }
      
      // Sync Next Move targeting
      const goal = cloned.goals[primaryGoal];
      if (goal && goal.phases && goal.phases.length > 0) {
        cloned.nextMove = {
          task: goal.phases[0].milestones[0]?.name || "Study first units",
          estimatedTime: "45 Minutes",
          impact: "High",
          goalName: primaryGoal,
          phaseIndex: 0,
          milestoneIndex: 0
        };
      }
    }

    saveState(cloned);
    setSavedSuccess(true);
    setIsModified(false);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleAddSecondaryGoal = (e) => {
    e.preventDefault();
    if (!newSecGoal.trim()) return;
    if (!secondaryGoals.includes(newSecGoal.trim())) {
      setSecondaryGoals([...secondaryGoals, newSecGoal.trim()]);
    }
    setNewSecGoal('');
  };

  const handleRemoveSecondaryGoal = (g) => {
    setSecondaryGoals(secondaryGoals.filter(item => item !== g));
  };

  // Emojis lists for avatars presets
  const AVATAR_PRESETS = ["🤖", "🚀", "💻", "🧠", "🔥", "🎓", "⚙️", "🌟"];

  return (
    <div
      id="profile-page-overlay"
      className={`profile-slider-overlay ${active ? 'active' : ''}`}
      onClick={onClose}
    >
      <div
        className="profile-slider-card glass"
        onClick={(e) => e.stopPropagation()}
        style={{ width: '90%', maxWidth: '640px', overflowY: 'auto' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <User style={{ color: 'var(--primary)' }} size={20} /> Profile Control Center
          </h3>
          <button
            id="profile-close-btn"
            className="control-btn"
            style={{ border: 'none', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>

        {/* Top Split: Completion Dial + Quick Summary */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', background: 'rgba(255,255,255,0.01)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '24px' }}>
          {/* Radial Completion Percentage */}
          <div style={{ position: 'relative', width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg style={{ position: 'absolute', transform: 'rotate(-90deg)', width: '70px', height: '70px' }}>
              <circle cx="35" cy="35" r="30" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="4" />
              <circle cx="35" cy="35" r="30" fill="transparent" stroke="var(--primary)" strokeWidth="4" strokeDasharray={188.4} strokeDashoffset={188.4 - (188.4 * completionPercent) / 100} style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
            </svg>
            <strong style={{ fontSize: '0.85rem', color: '#fff' }}>{completionPercent}%</strong>
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.92rem', color: '#fff' }}>System Completion Status</h4>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Complete your profile configurations to optimize AI Coach feedback algorithms.
            </p>
          </div>
        </div>

        {/* Editable Form Fields Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {/* Full Name */}
            <div>
              <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Name</label>
              <input type="text" className="task-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" style={{ height: '36px', fontSize: '0.78rem' }} />
            </div>

            {/* Username Selection & Availability Check */}
            <div>
              <div style={{ display: 'flex', justify: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700 }}>Username</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {usernameValid ? (
                    <span style={{ fontSize: '0.62rem', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '2px' }}><Check size={10} /> Available</span>
                  ) : (
                    <span style={{ fontSize: '0.62rem', color: 'var(--accent-orange)', display: 'flex', alignItems: 'center', gap: '2px' }}><AlertCircle size={10} /> Invalid</span>
                  )}
                </div>
              </div>
              <input type="text" className="task-input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" style={{ height: '36px', fontSize: '0.78rem', borderColor: usernameValid ? 'var(--border-color)' : 'var(--accent-orange)' }} />
              
              {/* Smart Suggestions Chips */}
              {suggestions.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                  <span style={{ fontSize: '0.62rem', color: 'var(--text-tertiary)', alignSelf: 'center', display: 'flex', alignItems: 'center', gap: '2px' }}><Sparkles size={8} /> Suggestions:</span>
                  {suggestions.slice(0, 3).map(sug => (
                    <button 
                      key={sug} 
                      onClick={() => setUsername(sug)}
                      className="priority-toggle" 
                      style={{ height: '18px', padding: '0 6px', fontSize: '0.6rem' }}
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Preset Profile Picture Selector */}
          <div>
            <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Profile Picture Preset</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justify: 'center', fontSize: '1.25rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                {avatar || initials || "👤"}
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {AVATAR_PRESETS.map(emoji => (
                  <button 
                    key={emoji} 
                    onClick={() => setAvatar(emoji)} 
                    className={`priority-toggle ${avatar === emoji ? 'active' : ''}`}
                    style={{ width: '30px', height: '30px', padding: 0, fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mission Statement (Why Am I Doing This?) */}
          <div>
            <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Why Am I Doing This? (Mission Statement)</label>
            <textarea 
              className="task-input" 
              value={missionStatement} 
              onChange={(e) => setMissionStatement(e.target.value)} 
              placeholder="e.g. I want to become an AI Engineer by 2027." 
              rows={2} 
              style={{ fontSize: '0.78rem', padding: '8px 10px', height: 'auto' }}
            />
          </div>

          {/* Study Parameters: Primary Goal, Skill Level, Study Time, Learning Style */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Primary Goal</label>
              <select className="task-input" value={primaryGoal} onChange={(e) => setPrimaryGoal(e.target.value)} style={{ height: '36px', fontSize: '0.78rem', background: '#030304', color: '#fff' }}>
                {["AI Engineer", "Data Scientist", "ML Engineer", "Data Analyst", "Full Stack", "Backend", "Cloud", "Cyber Security", "Fitness", "Weight Loss", "Weight Gain", "Startup", "Freelancing", "JEE", "NEET", "UPSC", "CAT"].map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Skill Level</label>
              <select className="task-input" value={skillLevel} onChange={(e) => setSkillLevel(e.target.value)} style={{ height: '36px', fontSize: '0.78rem', background: '#030304', color: '#fff' }}>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Preferred Study Time</label>
              <input type="text" className="task-input" value={preferredStudyTime} onChange={(e) => setPreferredStudyTime(e.target.value)} placeholder="e.g. 18:00 - 21:00 (Evening)" style={{ height: '36px', fontSize: '0.78rem' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Learning Style</label>
              <select className="task-input" value={learningStyle} onChange={(e) => setLearningStyle(e.target.value)} style={{ height: '36px', fontSize: '0.78rem', background: '#030304', color: '#fff' }}>
                <option value="Visual Learner">Visual Learner</option>
                <option value="Auditory Learner">Auditory Learner</option>
                <option value="Kinesthetic Learner">Kinesthetic Learner</option>
                <option value="Reading & Writing">Reading & Writing</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Target Graduation Year</label>
              <input type="text" className="task-input" value={targetYear} onChange={(e) => setTargetYear(e.target.value)} placeholder="Target Year" style={{ height: '36px', fontSize: '0.78rem' }} />
            </div>
            <div>
              {/* Dummy spacing or placeholder */}
            </div>
          </div>

          {/* Secondary Goals Setup */}
          <div>
            <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Secondary Focus Areas</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
              {secondaryGoals.map(sg => (
                <span key={sg} className="timeline-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.68rem', padding: '3px 8px' }}>
                  {sg}
                  <button type="button" onClick={() => handleRemoveSecondaryGoal(sg)} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', padding: 0, fontSize: '9px', fontWeight: 800 }}>×</button>
                </span>
              ))}
            </div>
            <form onSubmit={handleAddSecondaryGoal} style={{ display: 'flex', gap: '6px' }}>
              <input 
                type="text" 
                className="task-input" 
                placeholder="Add focus field (e.g. Fitness, Statistics)" 
                value={newSecGoal} 
                onChange={(e) => setNewSecGoal(e.target.value)} 
                style={{ height: '30px', fontSize: '0.75rem' }} 
              />
              <button type="submit" className="focus-btn" style={{ height: '30px', padding: '0 10px', fontSize: '0.72rem' }}>Add</button>
            </form>
          </div>

        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginBottom: '24px' }}>
          <button 
            onClick={handleSave} 
            disabled={!isModified || !usernameValid} 
            className="focus-btn" 
            style={{ flexGrow: 1, height: '40px', background: savedSuccess ? 'var(--accent-green)' : 'var(--primary)', color: savedSuccess ? '#000' : '#fff' }}
          >
            {savedSuccess ? '✔ Changes Saved' : 'Save System Profile'}
          </button>
        </div>

        {/* Read-Only System Statistics Block */}
        <h4 style={{ fontSize: '0.75rem', fontWeight: 800, marginBottom: '12px', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.5px' }}>
          Read-Only Diagnostics
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div className="glass p-3" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={16} color="var(--primary)" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.62rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>OS Progression</span>
              <strong style={{ fontSize: '0.82rem', color: '#fff' }}>{xpInfo.xp} XP • {xpInfo.levelName}</strong>
            </div>
          </div>

          <div className="glass p-3" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Trophy size={16} color="var(--accent-green)" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.62rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Milestones Met</span>
              <strong style={{ fontSize: '0.82rem', color: '#fff' }}>{completedMilestones} Completed</strong>
            </div>
          </div>

          <div className="glass p-3" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Flame size={16} color="var(--accent-orange)" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.62rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Consistency Streak</span>
              <strong style={{ fontSize: '0.82rem', color: '#fff' }}>{streak} Days Active</strong>
            </div>
          </div>

          <div className="glass p-3" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={16} color="var(--accent-color)" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.62rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Workspace Created</span>
              <strong style={{ fontSize: '0.82rem', color: '#fff' }}>{state.profile.joinDate}</strong>
            </div>
          </div>

          <div className="glass p-3" style={{ display: 'flex', alignItems: 'center', gap: '8px', gridColumn: 'span 2' }}>
            <Heart size={16} color="var(--accent-green)" />
            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              <div style={{ display: 'flex', justify: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.62rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Road Health Diagnostics</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--accent-green)', fontWeight: 800 }}>{roadHealthInfo.status} ({roadHealthInfo.score}%)</span>
              </div>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
                Burnout Risk: {roadHealthInfo.burnoutRisk} • Consistency Syncing: Active
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
