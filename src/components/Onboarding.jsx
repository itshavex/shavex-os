import React, { useState, useEffect } from 'react';
import { useAppState } from '../context/StateContext';
import { useNavigate } from 'react-router-dom';
import { Check, CheckCircle, AlertTriangle, Cpu } from 'lucide-react';
import { ROADMAP_PRESETS, getCustomGoalPreset } from '../data/data';

const CAREER_GOALS = [
  "AI Engineer",
  "Data Scientist",
  "Backend Developer",
  "Full Stack Developer",
  "Java Developer",
  "Content Creator",
  "Entrepreneur",
  "Custom"
];

const LOADING_STAGES = [
  "Building Your Personal System...",
  "Generating Roadmaps...",
  "Creating Missions...",
  "Preparing Dashboard...",
  "Almost Ready..."
];

const GOAL_LIBRARY = {
  "Education": [
    "JEE", "NEET", "CUET", "NDA", "Olympiads", "Boards", 
    "GATE", "CAT", "UPSC", "SSC", "Banking", "Railways", "State Exams"
  ],
  "Technology": [
    "AI Engineer", "Machine Learning Engineer", "Data Analyst", "Data Scientist", 
    "Software Engineer", "Backend Developer", "Frontend Developer", "Full Stack Developer", 
    "Cloud Engineer", "DevOps Engineer", "Cyber Security Engineer", "UI UX Designer", 
    "Product Manager", "Blockchain Developer", "Mobile App Developer"
  ],
  "Commerce": [
    "CA", "CS", "CMA", "Finance"
  ],
  "Medical": [
    "MBBS", "BDS", "Nursing", "Pharmacy"
  ],
  "Career": [
    "Internship", "Placement", "Freelancing", "Startup"
  ],
  "Fitness": [
    "Weight Gain", "Weight Loss", "Muscle Building", "Running", "Sports"
  ],
  "Personal Development": [
    "Reading", "Public Speaking", "English Speaking", "Communication Skills", "Productivity"
  ]
};

export default function Onboarding() {
  const { generateRoadmap, saveState, state } = useAppState();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  // Form states
  const [userType, setUserType] = useState('College Student');
  const [selectedCategory, setSelectedCategory] = useState('Technology');
  const [selectedGoal, setSelectedGoal] = useState('AI Engineer');
  const [customGoal, setCustomGoal] = useState('');
  const [skillLevel, setSkillLevel] = useState('Beginner');
  const [targetYear, setTargetYear] = useState('2027');
  const [dailyTime, setDailyTime] = useState('4 hr');

  // Loading & Flow state
  const [flowState, setFlowState] = useState('input'); // input, loading, success, fail
  const [loadingStageIdx, setLoadingStageIdx] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [finalGoalName, setFinalGoalName] = useState('');

  // Cycle through loading stages
  useEffect(() => {
    let interval;
    if (flowState === 'loading') {
      interval = setInterval(() => {
        setLoadingStageIdx((prev) => {
          if (prev < LOADING_STAGES.length - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            executeWorkspaceGeneration();
            return prev;
          }
        });
      }, 700);
    }
    return () => clearInterval(interval);
  }, [flowState]);

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  // Launch Build System Loader
  const handleBuildSystem = () => {
    const goalName = selectedCategory === 'Custom' ? customGoal.trim() : selectedGoal;
    console.log("[Onboarding] 🚀 Build My System clicked.");
    console.log("[Onboarding] Onboarding selections:", { userType, goalName, skillLevel, targetYear, dailyTime });

    if (selectedCategory === 'Custom' && !customGoal.trim()) {
      console.warn("[Onboarding] Validation failed: Custom goal is empty.");
      setErrorMessage("Please enter a custom goal name.");
      setFlowState('fail');
      return;
    }

    setFinalGoalName(goalName);
    setLoadingStageIdx(0);
    setFlowState('loading');
  };

  // Generation logic
  const executeWorkspaceGeneration = async () => {
    try {
      console.log("[Onboarding] Beginning workspace generation...");
      const goalName = finalGoalName;

      // 1. Setup default state payload
      const cloned = JSON.parse(JSON.stringify(state));
      cloned.profile.name = cloned.profile.name || "Shashwat Tiwari";
      cloned.profile.username = cloned.profile.username || "shashwat";
      cloned.profile.avatar = cloned.profile.avatar || "🚀";
      cloned.profile.userType = userType;
      cloned.profile.mainGoal = goalName;
      cloned.profile.primaryGoal = goalName;
      cloned.profile.missionStatement = `I want to become a ${goalName} by ${targetYear}.`;
      cloned.profile.preferredStudyTime = "18:00 - 21:00 (Evening)";
      cloned.profile.learningStyle = "Visual Learner";
      cloned.profile.secondaryGoals = ["Fitness"];
      cloned.profile.skillLevel = skillLevel;
      cloned.profile.targetYear = targetYear;
      cloned.profile.dailyTime = dailyTime;
      
      cloned.memory = {
        lastCompletedMilestone: "Initial onboarding setup",
        lastActiveRoadmapPhase: "Computer Fundamentals",
        lastMission: `Initialize baseline study materials for ${goalName}`,
        lastStudyResource: "Core objectives documentation",
        lastStudySession: new Date().toISOString(),
        consistencyHistory: [true, true, true, true, true, true, true]
      };
      
      console.log("[Onboarding] Profile data successfully configured.");

      // 2. Build goal roadmap phases presets
      let phases = [];
      if (ROADMAP_PRESETS[goalName]) {
        phases = ROADMAP_PRESETS[goalName].map(p => ({
          name: p.name,
          milestones: p.milestones.map(m => ({ name: m, completed: false })),
          resources: []
        }));
      } else {
        phases = getCustomGoalPreset(goalName).map(p => ({
          name: p.name,
          milestones: p.milestones.map(m => ({ name: m, completed: false })),
          resources: []
        }));
      }

      cloned.goals[goalName] = {
        name: goalName,
        phases: phases,
        activePhaseIndex: 0
      };

      console.log("[Onboarding] Roadmap engine generation completed.");

      // 3. Create user initial missions
      cloned.missions = {
        today: [
          { id: "m_t1", text: `Initialize baseline study materials for ${goalName}`, completed: false },
          { id: "m_t2", text: `Review Phase 1 objectives in your roadmap pipeline`, completed: false }
        ],
        weekly: [
          { id: "m_w1", text: `Establish 4-day sprint schedule for ${goalName}`, completed: false }
        ],
        monthly: [
          { id: "m_m1", text: `Complete Phase 1 foundations checkoff`, completed: false }
        ]
      };
      
      console.log("[Onboarding] Mission workspace creation completed.");

      // 4. Default Vault bookmark
      cloned.vault = [
        {
          id: "v_init",
          title: `${goalName} Core Objectives Documentation`,
          type: "Website",
          url: "https://github.com",
          notes: "Main reference directory",
          tags: [goalName.substring(0, 10)]
        }
      ];

      console.log("[Onboarding] Knowledge Vault creation completed.");

      // 5. Update Next Move Engine target parameters
      cloned.currentGoalName = goalName;
      
      // Auto-trigger next move check inside context logic helper
      const goalObj = cloned.goals[goalName];
      if (goalObj.phases && goalObj.phases.length > 0) {
        const firstPhase = goalObj.phases[0];
        if (firstPhase.milestones && firstPhase.milestones.length > 0) {
          cloned.nextMove = {
            task: firstPhase.milestones[0].name,
            estimatedTime: "45 Minutes",
            impact: "High",
            goalName: goalName,
            phaseIndex: 0,
            milestoneIndex: 0
          };
        }
      }

      console.log("[Onboarding] Next Move Engine target updated.");

      // 6. Push final state payload
      await saveState(cloned);
      console.log("[Onboarding] Workspace state successfully synchronized.");

      setFlowState('success');
    } catch (err) {
      console.error("[Onboarding] Critical generation error:", err);
      setErrorMessage(err.message || "Failed to update workspace configuration.");
      setFlowState('fail');
    }
  };

  const handleEnterDashboard = () => {
    console.log("[Onboarding] Entering dashboard workspace.");
    const cloned = JSON.parse(JSON.stringify(state));
    cloned.onboarded = true;
    
    saveState(cloned);
    
    console.log("[Onboarding] Navigation redirecting to /dashboard");
    navigate('/dashboard');
  };

  const handleRetry = () => {
    setFlowState('input');
    setStep(1); // Return to goal selection step
  };

  return (
    <div id="onboarding-screen-overlay" className="auth-overlay" style={{ display: 'flex', zIndex: 150 }}>
      <div className="auth-card glass" style={{ maxWidth: '560px', padding: '40px', width: '95%' }}>
        
        {/* Brand Header */}
        {flowState !== 'loading' && flowState !== 'success' && flowState !== 'fail' && (
          <>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, textTransform: 'uppercase', textAlign: 'center', marginBottom: '6px', letterSpacing: '0.5px' }}>
              Initialize ShaVex OS
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '30px' }}>
              "Choose Your Destination. Build Your System."
            </p>
          </>
        )}

        {/* 1. Loading Experience */}
        {flowState === 'loading' && (
          <div style={{ textAlign: 'center', padding: '30px 0' }}>
            <div style={{ width: '45px', height: '45px', border: '3.5px solid rgba(0, 102, 255, 0.05)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 24px auto' }} />
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
              {LOADING_STAGES[loadingStageIdx]}
            </h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Assembling customized components and mapping goal GPS timelines...
            </p>
          </div>
        )}

        {/* 2. Success Screen */}
        {flowState === 'success' && (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div style={{ width: '50px', height: '50px', background: 'rgba(0,230,118,0.1)', color: 'var(--accent-green)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
              <CheckCircle size={30} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
              Welcome to ShaVex OS
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Your personalized system is ready.
            </p>

            <div className="glass p-4 mb-6 text-left" style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justify: 'space-between', marginBottom: '8px', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Primary Destination:</span>
                <strong style={{ color: '#fff' }}>{finalGoalName}</strong>
              </div>
              <div style={{ display: 'flex', justify: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Target Timeline:</span>
                <strong style={{ color: 'var(--accent-orange)' }}>Target {targetYear}</strong>
              </div>
            </div>

            <button 
              onClick={handleEnterDashboard} 
              className="focus-btn" 
              style={{ width: '100%', height: '42px', fontWeight: 700 }}
            >
              Enter Dashboard
            </button>
          </div>
        )}

        {/* 3. Fail Safe Screen */}
        {flowState === 'fail' && (
          <div style={{ textAlign: 'center', padding: '15px 0' }}>
            <div style={{ width: '50px', height: '50px', background: 'rgba(255,61,0,0.1)', color: 'var(--accent-orange)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
              <AlertTriangle size={30} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
              Something went wrong
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              {errorMessage || "Failed to configure goal workspace."}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button onClick={handleRetry} className="focus-btn" style={{ height: '40px' }}>
                Retry
              </button>
              <button onClick={() => setFlowState('input')} className="priority-toggle" style={{ height: '40px', justifyContent: 'center' }}>
                Go Back
              </button>
            </div>
          </div>
        )}

        {/* 4. Input Questionnaire Slides */}
        {flowState === 'input' && (
          <div className="onboarding-slides-container">
            {/* Step 1: Who are you? */}
            {step === 0 && (
              <div className="onboarding-slide active">
                <label className="onboard-label">1. Who are you?</label>
                <div className="onboard-list-vertical" style={{ gap: '8px' }}>
                  {[
                    'School Student',
                    'College Student',
                    'Working Professional',
                    'Teacher',
                    'Entrepreneur',
                    'Fitness Enthusiast',
                    'Other'
                  ].map((val) => (
                    <div
                      key={val}
                      className={`onboard-row-opt ${userType === val ? 'active' : ''}`}
                      style={{ padding: '10px 14px' }}
                      onClick={() => setUserType(val)}
                    >
                      <strong>{val}</strong>
                    </div>
                  ))}
                </div>
                <button onClick={handleNext} className="focus-btn" style={{ width: '100%', height: '42px', marginTop: '24px' }}>
                  Continue
                </button>
              </div>
            )}

            {/* Step 2: Goal selection */}
            {step === 1 && (
              <div className="onboarding-slide active">
                <label className="onboard-label">2. What are you working towards?</label>
                
                {/* Category tabs */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                  {Object.keys(GOAL_LIBRARY).concat(['Custom']).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={`priority-toggle ${selectedCategory === cat ? 'active' : ''}`}
                      style={{ height: '28px', padding: '0 10px', fontSize: '0.7rem' }}
                      onClick={() => {
                        setSelectedCategory(cat);
                        if (cat !== 'Custom') {
                          setSelectedGoal(GOAL_LIBRARY[cat][0]);
                        }
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {selectedCategory === 'Custom' ? (
                  <div className="form-group" style={{ marginTop: '16px' }}>
                    <input
                      type="text"
                      className="task-input"
                      placeholder="Enter custom goal (e.g. UPSC Exam, CA Prep)"
                      value={customGoal}
                      onChange={(e) => setCustomGoal(e.target.value)}
                      required
                    />
                  </div>
                ) : (
                  <div className="onboard-options-grid" style={{ maxHeight: '200px', overflowY: 'auto', gap: '8px' }}>
                    {(GOAL_LIBRARY[selectedCategory] || []).map((goalOption) => {
                      const isSelected = selectedGoal === goalOption;
                      return (
                        <div
                          key={goalOption}
                          className={`onboard-opt ${isSelected ? 'active' : ''}`}
                          style={{ 
                            fontSize: '0.8rem', 
                            padding: '10px',
                            border: isSelected ? '1px solid var(--primary)' : '1px solid transparent',
                            boxShadow: isSelected ? '0 0 10px rgba(0, 102, 255, 0.2)' : 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                          onClick={() => setSelectedGoal(goalOption)}
                        >
                          {isSelected ? `✔ ${goalOption} Selected` : goalOption}
                        </div>
                      );
                    })}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px', marginTop: '24px' }}>
                  <button type="button" className="priority-toggle" onClick={handleBack}>Back</button>
                  <button onClick={handleNext} className="focus-btn">Continue</button>
                </div>
              </div>
            )}

            {/* Step 3: Skill Level */}
            {step === 2 && (
              <div className="onboarding-slide active">
                <label className="onboard-label">3. What is your current skill level?</label>
                <div className="onboard-list-vertical" style={{ gap: '10px' }}>
                  {[
                    { val: 'Beginner', title: 'Beginner', desc: 'No prior background in this field' },
                    { val: 'Intermediate', title: 'Intermediate', desc: 'Familiar with core concepts and baseline execution' },
                    { val: 'Advanced', title: 'Advanced', desc: 'Can build complex setups and solve professional problems' }
                  ].map((item) => (
                    <div
                      key={item.val}
                      className={`onboard-row-opt ${skillLevel === item.val ? 'active' : ''}`}
                      onClick={() => setSkillLevel(item.val)}
                    >
                      <strong>{item.title}</strong>
                      <span>{item.desc}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px', marginTop: '24px' }}>
                  <button type="button" className="priority-toggle" onClick={handleBack}>Back</button>
                  <button onClick={handleNext} className="focus-btn">Continue</button>
                </div>
              </div>
            )}

            {/* Step 4: Target Year */}
            {step === 3 && (
              <div className="onboarding-slide active">
                <label className="onboard-label">4. What is your target year?</label>
                <div className="onboard-list-vertical" style={{ gap: '10px' }}>
                  {[
                    { val: '2027', title: 'Target 2027', desc: 'Accelerated execution pipeline' },
                    { val: '2028', title: 'Target 2028', desc: 'Comprehensive growth system' },
                    { val: 'Custom', title: 'Custom pace', desc: 'Self-guided roadmap milestones' }
                  ].map((item) => (
                    <div
                      key={item.val}
                      className={`onboard-row-opt ${targetYear === item.val ? 'active' : ''}`}
                      onClick={() => setTargetYear(item.val)}
                    >
                      <strong>{item.title}</strong>
                      <span>{item.desc}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px', marginTop: '24px' }}>
                  <button type="button" className="priority-toggle" onClick={handleBack}>Back</button>
                  <button onClick={handleNext} className="focus-btn">Continue</button>
                </div>
              </div>
            )}

            {/* Step 5: Daily Available Time */}
            {step === 4 && (
              <div className="onboarding-slide active">
                <label className="onboard-label">5. Daily Available Time?</label>
                <div className="onboard-options-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {['30 min', '1 hr', '2 hr', '4 hr', '6+ hr'].map((val) => (
                    <div
                      key={val}
                      className={`onboard-opt ${dailyTime === val ? 'active' : ''}`}
                      style={val === '6+ hr' ? { gridColumn: 'span 2' } : {}}
                      onClick={() => setDailyTime(val)}
                    >
                      {val}
                    </div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px', marginTop: '24px' }}>
                  <button type="button" className="priority-toggle" onClick={handleBack}>Back</button>
                  <button 
                    onClick={handleBuildSystem} 
                    className="focus-btn" 
                    style={{ background: 'var(--accent-green)', color: '#000', fontWeight: 700 }}
                  >
                    🚀 Start My Journey
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
