import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_STATE, ROADMAP_PRESETS, getCustomGoalPreset } from '../data/data.js';
import { supabaseAdapter } from '../supabase.js';

const StateContext = createContext();

const LEVEL_THRESHOLDS = [
  { name: "Beginner", min: 0, max: 99 },
  { name: "Learner", min: 100, max: 299 },
  { name: "Builder", min: 300, max: 599 },
  { name: "Consistent", min: 600, max: 999 },
  { name: "AI Engineer Candidate", min: 1000, max: 1499 },
  { name: "Future AI Engineer", min: 1500, max: 99999 }
];

export const StateProvider = ({ children }) => {
  const [state, setState] = useState(() => {
    let raw = localStorage.getItem('shavex_os_state_v4');
    if (!raw) {
      // Fallback migration from v3
      raw = localStorage.getItem('shavex_os_state_v3');
    }
    if (!raw) {
      return JSON.parse(JSON.stringify(INITIAL_STATE));
    }
    try {
      const parsed = JSON.parse(raw);
      // Migrate and merge baseline schemas
      return deepMerge(JSON.parse(JSON.stringify(INITIAL_STATE)), parsed);
    } catch (e) {
      console.error("Failed to restore cached state:", e);
      return JSON.parse(JSON.stringify(INITIAL_STATE));
    }
  });

  const [loading, setLoading] = useState(true);
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);

  // Sync to database or local cache on change
  const saveState = async (newState) => {
    const updatedWithAI = runAILearningEngine(newState);
    setState(updatedWithAI);
    localStorage.setItem('shavex_os_state_v4', JSON.stringify(updatedWithAI));
    localStorage.setItem('shavex_os_state_v3', JSON.stringify(updatedWithAI));

    const user = updatedWithAI.auth.user;
    if (user) {
      try {
        await supabaseAdapter.syncPush(user.id, user.email, updatedWithAI);
      } catch (e) {
        console.error("Cloud push sync failed:", e);
      }
    }
  };

  const updateState = (path, value) => {
    const parts = path.split('.');
    const cloned = JSON.parse(JSON.stringify(state));
    let current = cloned;
    
    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) {
        current[parts[i]] = {};
      }
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;
    saveState(cloned);
  };

  // Auth login/logout adapters
  const handleUserLogin = async (user) => {
    setLoading(true);
    const cloned = JSON.parse(JSON.stringify(state));
    cloned.auth.user = user;
    
    try {
      const { state: cloudState } = await supabaseAdapter.syncPull(user.id, user.email);
      if (cloudState) {
        const merged = deepMerge(cloned, cloudState);
        await saveState(merged);
      } else {
        await saveState(cloned);
      }
    } catch (e) {
      console.error("Cloud pull sync failed during login:", e);
      await saveState(cloned);
    } finally {
      setLoading(false);
    }
  };

  const handleUserLogout = async () => {
    setLoading(true);
    try {
      await supabaseAdapter.signOut();
    } catch (e) {
      console.error("Signout error:", e);
    }
    const cloned = JSON.parse(JSON.stringify(state));
    cloned.auth.user = null;
    await saveState(cloned);
    setLoading(false);
  };

  // Check if a specific date was active (e.g. logged focus, reflection, steps, or milestones)
  const isDayActive = (dateStr) => {
    if (state.reflections?.[dateStr]) return true;
    
    const steps = state.fitness?.steps?.[dateStr] || 0;
    const water = state.fitness?.waterIntake?.[dateStr] || 0;
    if (steps > 0 || water > 0) return true;

    return false;
  };

  // Streak flame logic based on last N active days
  const calculateStreak = () => {
    let streakCount = 0;
    const today = new Date();
    
    // Check backwards from today
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date();
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      if (isDayActive(dateStr)) {
        streakCount++;
      } else {
        if (i === 0) continue; // Allow today to not be active yet
        break;
      }
    }
    return streakCount;
  };

  // Calculate dynamic goals progression values
  const calculateTrackProgress = (goalName) => {
    const goal = state.goals?.[goalName];
    if (!goal || !goal.phases || goal.phases.length === 0) return 0;

    let totalMilestones = 0;
    let completedMilestones = 0;

    goal.phases.forEach(p => {
      p.milestones.forEach(m => {
        totalMilestones++;
        if (m.completed === true) completedMilestones++;
      });
    });

    if (totalMilestones === 0) return 0;
    return Math.round((completedMilestones / totalMilestones) * 100);
  };

  const calculateXP = () => {
    let xpTotal = 0;

    // 1. Journey Map Milestones (+10 XP each)
    Object.values(state.goals || {}).forEach(g => {
      (g.phases || []).forEach(p => {
        (p.milestones || []).forEach(m => {
          if (m.completed === true) xpTotal += 10;
        });
      });
    });

    // 2. Fitness GPS parameter logs (+10 XP per day with weight/steps logs)
    if (state.fitness?.steps) {
      Object.keys(state.fitness.steps).forEach(d => {
        if (state.fitness.steps[d] > 0) xpTotal += 10;
      });
    }

    // 3. Daily Reflections (+5 XP each)
    if (state.reflections) {
      Object.keys(state.reflections).forEach(d => {
        const ref = state.reflections[d];
        if (ref && ref.learned && ref.learned.trim().length > 0) xpTotal += 5;
      });
    }

    // 4. Custom Vault Uploads (+5 XP each)
    if (Array.isArray(state.vault)) {
      xpTotal += state.vault.length * 5;
    }

    return xpTotal + 120; // Base starting XP
  };

  const getXPLevel = () => {
    const xpVal = calculateXP();
    const level = LEVEL_THRESHOLDS.find(t => xpVal >= t.min && xpVal <= t.max) || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
    const range = level.max - level.min;
    const progressXP = xpVal - level.min;
    const percent = Math.min(100, Math.round((progressXP / range) * 100));

    return {
      levelName: level.name,
      xp: xpVal,
      nextXP: level.max + 1,
      minXP: level.min,
      percent: percent
    };
  };

  const calculateOverallProgress = () => {
    const goalsList = Object.keys(state.goals || {});
    if (goalsList.length === 0) return 0;

    let totalProg = 0;
    goalsList.forEach(gName => {
      totalProg += calculateTrackProgress(gName);
    });

    return Math.round(totalProg / goalsList.length);
  };

  // Generate default roadmap structure when selecting/creating a goal
  const generateRoadmap = (goalName, userType) => {
    const cloned = JSON.parse(JSON.stringify(state));
    cloned.profile.mainGoal = goalName;
    cloned.profile.primaryGoal = goalName;
    cloned.profile.userType = userType || cloned.profile.userType;
    cloned.currentGoalName = goalName;

    // Check presets
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

    updateNextMoveEngine(cloned, goalName);
    saveState(cloned);
  };

  // Evaluate uncompleted milestones to find the next target move
  const updateNextMoveEngine = (targetState, goalName) => {
    const goal = targetState.goals[goalName];
    if (!goal || !goal.phases || goal.phases.length === 0) return;

    let targetPhaseIndex = -1;
    let targetMilestoneIndex = -1;
    let targetMilestoneName = "";

    // Iterate phases sequentially to find the first uncompleted milestone
    for (let pIdx = 0; pIdx < goal.phases.length; pIdx++) {
      const phase = goal.phases[pIdx];
      const mIdx = phase.milestones.findIndex(m => !m.completed);
      if (mIdx !== -1) {
        targetPhaseIndex = pIdx;
        targetMilestoneIndex = mIdx;
        targetMilestoneName = phase.milestones[mIdx].name;
        break;
      }
    }

    if (targetPhaseIndex !== -1 && targetMilestoneIndex !== -1) {
      targetState.nextMove = {
        task: targetMilestoneName,
        estimatedTime: "45 Minutes",
        impact: "High",
        goalName: goalName,
        phaseIndex: targetPhaseIndex,
        milestoneIndex: targetMilestoneIndex
      };
      goal.activePhaseIndex = targetPhaseIndex;
    } else {
      // All items completed
      targetState.nextMove = {
        task: "All milestones complete! Select a new journey.",
        estimatedTime: "--",
        impact: "Completed",
        goalName: goalName,
        phaseIndex: 0,
        milestoneIndex: 0
      };
    }
  };

  // Re-run engine and save
  const triggerNextMoveCheck = () => {
    const cloned = JSON.parse(JSON.stringify(state));
    updateNextMoveEngine(cloned, state.currentGoalName);
    saveState(cloned);
  };

  // Hook validation for momentum Welcome Back
  useEffect(() => {
    const fetchSession = async () => {
      if (supabaseAdapter.isCloudEnabled()) {
        try {
          const client = supabaseAdapter.getClient();
          const { data: { session } } = await client.auth.getSession();
          if (session && session.user) {
            await handleUserLogin(session.user);
          }
        } catch (e) {
          console.error("Session restore failure:", e);
        }
      }

      // Momentum welcome recovery logic
      const lastDate = state.momentum?.lastActiveDate;
      const todayStr = new Date().toISOString().split('T')[0];

      if (lastDate && lastDate !== todayStr) {
        const lastTime = new Date(lastDate).getTime();
        const nowTime = new Date(todayStr).getTime();
        const diffDays = Math.round((nowTime - lastTime) / (1000 * 60 * 60 * 24));

        if (diffDays >= 2) {
          setShowWelcomeBack(true);
        }
      }

      // Update active time
      const cloned = JSON.parse(JSON.stringify(state));
      if (!cloned.momentum) cloned.momentum = {};
      cloned.momentum.lastActiveDate = todayStr;
      setState(cloned);
      localStorage.setItem('shavex_os_state_v4', JSON.stringify(cloned));

      setLoading(false);
    };

    fetchSession();
  }, []);

  // Profile completion percentage calculator
  const calculateProfileCompletion = (profileObj = state.profile) => {
    if (!profileObj) return 0;
    const fields = ['name', 'username', 'missionStatement', 'primaryGoal', 'targetYear', 'skillLevel', 'preferredStudyTime', 'learningStyle'];
    let completed = 0;
    fields.forEach(f => {
      if (profileObj[f] && profileObj[f].toString().trim() !== '') {
        completed++;
      }
    });
    if (profileObj.secondaryGoals && profileObj.secondaryGoals.length > 0) {
      completed++;
    }
    return Math.round((completed / 9) * 100);
  };

  // Smart username builder
  const generateUsernameSuggestions = (name) => {
    if (!name) return ["shavex_leader", "mindful_builder", "os_captain"];
    const base = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!base) return ["shavex_os_user"];
    return [
      `${base}_os`,
      `captain_${base}`,
      `build_with_${base}`,
      `${base}_2027`,
      `ceo_${base}`
    ];
  };

  // Username validation check
  const isUsernameAvailable = (username) => {
    if (!username || username.length < 3) return false;
    const reserved = ["admin", "root", "system", "shavex", "null", "undefined", "dashboard"];
    if (reserved.includes(username.toLowerCase())) return false;
    return /^[a-zA-Z0-9_]{3,20}$/.test(username);
  };

  // AI Road Health Analyzer
  const calculateRoadHealth = (stateObj = state) => {
    const consistency = stateObj.aiProfile?.consistencyScore || 90;
    
    let totalMilestones = 0;
    let completedMilestones = 0;
    Object.values(stateObj.goals || {}).forEach(g => {
      (g.phases || []).forEach(p => {
        (p.milestones || []).forEach(m => {
          totalMilestones++;
          if (m.completed) completedMilestones++;
        });
      });
    });
    const completionRate = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 75;

    // Burnout Risk calculation
    const dailyTimeStr = stateObj.profile?.dailyTime || "4 hr";
    const dailyHrs = parseInt(dailyTimeStr) || 4;
    const isBurnoutRisk = (consistency > 92 && dailyHrs >= 6);
    const burnoutScore = isBurnoutRisk ? 40 : 100;

    const streak = stateObj.reflections ? Object.keys(stateObj.reflections).length : 0;
    const momentumScore = Math.min(100, Math.max(50, streak * 10));

    const profileCompleted = calculateProfileCompletion(stateObj.profile);
    const goalAlignmentScore = Math.max(60, profileCompleted);

    const score = Math.round(
      (consistency * 0.3) +
      (completionRate * 0.3) +
      (burnoutScore * 0.1) +
      (momentumScore * 0.1) +
      (goalAlignmentScore * 0.2)
    );

    let status = "Good";
    if (score >= 85) status = "Excellent";
    else if (score < 65) status = "At Risk";

    return {
      score,
      status,
      burnoutRisk: isBurnoutRisk ? "High" : "Low"
    };
  };

  // AI Learning DNA and Forgetting Curve continuous calculator
  const runAILearningEngine = (stateObj) => {
    const cloned = JSON.parse(JSON.stringify(stateObj));
    if (!cloned.aiProfile) {
      cloned.aiProfile = {};
    }

    // 1. Calculate consistencyScore (active days in last 14 days)
    let activeDays = 0;
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const checkDate = new Date();
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      if (cloned.reflections?.[dateStr]) {
        activeDays++;
        continue;
      }
      const steps = cloned.fitness?.steps?.[dateStr] || 0;
      const water = cloned.fitness?.waterIntake?.[dateStr] || 0;
      if (steps > 0 || water > 0) {
        activeDays++;
      }
    }
    const consistencyScore = Math.max(60, Math.min(100, Math.round((activeDays / 14) * 100)));
    cloned.aiProfile.consistencyScore = consistencyScore;

    // 2. Calculate learningSpeed
    let completedMilestones = 0;
    Object.values(cloned.goals || {}).forEach(g => {
      (g.phases || []).forEach(p => {
        (p.milestones || []).forEach(m => {
          if (m.completed === true) completedMilestones++;
        });
      });
    });
    const milestoneWeekVal = (completedMilestones / 1.5 + 1.2).toFixed(1);
    cloned.aiProfile.learningSpeed = `${milestoneWeekVal} milestones/wk`;

    // 3. Preferred Study Window (dynamic based on preference)
    cloned.aiProfile.preferredStudyWindow = cloned.profile?.preferredStudyTime || "18:00 - 21:00 (Evening)";

    // 4. Forgetting Curve / Knowledge Health per phase
    const forgettingCurve = {};
    const currentGoalName = cloned.currentGoalName;
    const activeGoal = cloned.goals?.[currentGoalName];
    
    if (activeGoal && activeGoal.phases) {
      activeGoal.phases.forEach((p, idx) => {
        const completed = p.milestones.filter(m => m.completed).length;
        const total = p.milestones.length;
        if (total === 0) {
          forgettingCurve[p.name] = 100;
          return;
        }
        const ratio = completed / total;
        if (ratio === 1) {
          forgettingCurve[p.name] = 85; // Decayed completed
        } else if (ratio > 0) {
          forgettingCurve[p.name] = Math.round(50 + ratio * 45); // Active study
        } else {
          forgettingCurve[p.name] = 100; // Untouched nominal
        }
      });
    } else {
      forgettingCurve["Foundations"] = 100;
    }
    cloned.aiProfile.forgettingCurve = forgettingCurve;

    // 5. Strong & Weak Areas
    const strongAreas = [];
    const weakAreas = [];
    Object.entries(forgettingCurve).forEach(([pName, val]) => {
      if (val >= 80) {
        strongAreas.push(pName);
      } else if (val < 65) {
        weakAreas.push(pName);
      }
    });

    cloned.aiProfile.strongAreas = strongAreas.length > 0 ? strongAreas.slice(0, 2) : ["Computer Fundamentals", "Programming Foundations"];
    cloned.aiProfile.weakAreas = weakAreas.length > 0 ? weakAreas.slice(0, 2) : ["Mathematics", "Data Science"];

    // 6. Revision Requirement
    const lowHealthPhases = Object.entries(forgettingCurve).filter(([_, val]) => val < 65);
    cloned.aiProfile.revisionRequirement = lowHealthPhases.length > 0 ? `High (${lowHealthPhases[0][0]})` : "None (All systems nominal)";

    // 7. Adaptive Roadmap AI Injection Logic
    if (activeGoal && activeGoal.phases && activeGoal.phases[activeGoal.activePhaseIndex]) {
      const activePhase = activeGoal.phases[activeGoal.activePhaseIndex];
      const milestones = activePhase.milestones || [];
      const hasCheckpoint = milestones.some(m => m.name.includes("AI Checkpoint"));
      
      // Inject checkpoint if struggles detected
      if (consistencyScore < 75 && !hasCheckpoint && milestones.length > 0) {
        activePhase.milestones.push({
          name: `⚠️ AI Checkpoint: Revise ${activePhase.name} Basics`,
          completed: false
        });
      }
    }

    return cloned;
  };

  // Dynamic Day Planner AI engine generator
  const generateDailyMissions = (duration) => {
    const cloned = JSON.parse(JSON.stringify(state));
    const nextMoveTask = cloned.nextMove?.task || "Study active phase milestones";
    const currentGoal = cloned.currentGoalName || "AI Engineer";

    let missions = [];
    if (duration === '15 min') {
      missions = [
        { id: 'dm_1', text: `Quick review of next move: ${nextMoveTask}`, completed: false },
        { id: 'dm_2', text: `Review 1 concept note in Knowledge Vault`, completed: false }
      ];
    } else if (duration === '30 min') {
      missions = [
        { id: 'dm_1', text: `Execute milestone sprint: ${nextMoveTask}`, completed: false },
        { id: 'dm_2', text: `Log daily stats in Reflections`, completed: false }
      ];
    } else if (duration === '45 min') {
      missions = [
        { id: 'dm_1', text: `Complete active focus block: ${nextMoveTask} (45 mins)`, completed: false },
        { id: 'dm_2', text: `Check active phase references in vault catalog`, completed: false }
      ];
    } else if (duration === '1 hr') {
      missions = [
        { id: 'dm_1', text: `Deep study block: ${nextMoveTask} (60 mins)`, completed: false },
        { id: 'dm_2', text: `Bookmark 1 new resource to vault catalog`, completed: false },
        { id: 'dm_3', text: `Submit daily reflection audit log`, completed: false }
      ];
    } else if (duration === '2 hr') {
      missions = [
        { id: 'dm_1', text: `Core execution block: ${nextMoveTask}`, completed: false },
        { id: 'dm_2', text: `Construct implementation draft prototype script`, completed: false },
        { id: 'dm_3', text: `Submit daily reflection audit & fitness stats`, completed: false }
      ];
    } else if (duration === '3 hr') {
      missions = [
        { id: 'dm_1', text: `Double milestone intensive sprint: ${nextMoveTask}`, completed: false },
        { id: 'dm_2', text: `Design practical mini-project application`, completed: false },
        { id: 'dm_3', text: `Reinforcement exercises for weak areas`, completed: false },
        { id: 'dm_4', text: `Log comprehensive reflections log`, completed: false }
      ];
    } else { // Custom
      missions = [
        { id: 'dm_1', text: `Custom duration execution sprint: ${nextMoveTask}`, completed: false },
        { id: 'dm_2', text: `Organize notes and document concepts in vault`, completed: false }
      ];
    }

    cloned.missions.today = missions;
    cloned.xp += 5; // Award planning XP
    
    // Track memory update
    cloned.memory.lastMission = missions.length > 0 ? missions[0].text : "Custom Daily Mission Block";
    
    saveState(cloned);
  };

  // AI Success Predictions
  const getSuccessPredictions = () => {
    const consistency = state.aiProfile?.consistencyScore || 90;
    const probability = Math.max(45, Math.min(99, Math.round(55 + consistency * 0.44)));
    
    let completedCount = 0;
    let totalCount = 0;
    const currentGoalName = state.currentGoalName;
    const activeGoal = state.goals?.[currentGoalName];
    
    if (activeGoal && activeGoal.phases) {
      activeGoal.phases.forEach(p => {
        p.milestones.forEach(m => {
          totalCount++;
          if (m.completed) completedCount++;
        });
      });
    }

    const remaining = totalCount - completedCount;
    const daysNeeded = Math.max(7, Math.round(remaining * 5.2));
    const target = new Date();
    target.setDate(target.getDate() + daysNeeded);
    const estDate = target.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return {
      probability,
      pace: `${(completedCount / 3.5 + 1.1).toFixed(1)} phases / month`,
      estDate,
      roadHealth: Math.round((consistency + 88) / 2)
    };
  };

  // AI Weekly CEO Report compiler
  const getWeeklyCEOReport = () => {
    let completedThisWeek = 0;
    const currentGoalName = state.currentGoalName;
    const activeGoal = state.goals?.[currentGoalName];
    if (activeGoal && activeGoal.phases) {
      activeGoal.phases.forEach(p => {
        p.milestones.forEach(m => {
          if (m.completed) completedThisWeek++;
        });
      });
    }

    const profile = state.aiProfile || {};
    const studyHours = Math.max(4, Math.round((profile.consistencyScore || 90) * 0.15));

    return {
      studyHours: `${studyHours} hrs`,
      milestonesCompleted: Math.min(completedThisWeek, 5) || 2,
      strongAreas: profile.strongAreas || ["Computer Fundamentals"],
      weakAreas: profile.weakAreas || ["Mathematics"],
      consistency: `${profile.consistencyScore || 92}%`,
      recommendations: [
        `Dedicate more focus sessions to: ${profile.weakAreas?.[0] || 'Mathematics'}.`,
        `Maintain the standard preferred evening study window.`,
        `Inject a revision block for: ${profile.weakAreas?.[0] || 'Mathematics'} to boost knowledge health.`
      ]
    };
  };

  // Real-time AI Coach statements observer
  const getCoachInsights = () => {
    const insights = [];
    const profile = state.aiProfile || {};
    const consistency = profile.consistencyScore || 92;
    const forgettingCurve = profile.forgettingCurve || {};

    if (consistency > 90) {
      insights.push("🔥 Exceptional consistency! Your current study routine is highly optimal.");
    } else {
      insights.push("💡 Try establishing a fixed 1-hour study window to rebuild consistency.");
    }

    if (profile.weakAreas && profile.weakAreas.length > 0) {
      insights.push(`📚 Reinforcement exercises recommended for ${profile.weakAreas[0]}.`);
    }

    const lowHealthPhases = Object.entries(forgettingCurve).filter(([name, val]) => val < 60);
    if (lowHealthPhases.length > 0) {
      insights.push(`⚠️ Knowledge Health for ${lowHealthPhases[0][0]} is low (${lowHealthPhases[0][1]}%). Review recommended.`);
    } else {
      insights.push("✅ Knowledge health is nominal across all completed milestones.");
    }

    if (consistency > 95) {
      insights.push("⚡ Warning: High daily activity detected. Consider a 15-minute recovery buffer to prevent burnout.");
    }

    return insights;
  };

  // Goal & Journey CRUD Handlers
  const addCustomGoal = (goalName) => {
    const cloned = JSON.parse(JSON.stringify(state));
    if (!cloned.goals[goalName]) {
      cloned.goals[goalName] = {
        name: goalName,
        phases: [
          {
            name: "Initial Research",
            milestones: [{ name: "Audit core units", completed: false }],
            resources: []
          }
        ],
        activePhaseIndex: 0
      };
      if (!cloned.profile.secondaryGoals.includes(goalName)) {
        cloned.profile.secondaryGoals.push(goalName);
      }
      saveState(cloned);
    }
  };

  const deleteGoal = (goalName) => {
    const cloned = JSON.parse(JSON.stringify(state));
    delete cloned.goals[goalName];
    cloned.profile.secondaryGoals = cloned.profile.secondaryGoals.filter(g => g !== goalName);
    if (cloned.currentGoalName === goalName) {
      const remaining = Object.keys(cloned.goals);
      cloned.currentGoalName = remaining.length > 0 ? remaining[0] : "AI Engineer";
    }
    updateNextMoveEngine(cloned, cloned.currentGoalName);
    saveState(cloned);
  };

  const addPhase = (goalName, phaseName) => {
    const cloned = JSON.parse(JSON.stringify(state));
    const goal = cloned.goals[goalName];
    if (goal) {
      goal.phases.push({
        name: phaseName,
        milestones: [],
        resources: []
      });
      saveState(cloned);
    }
  };

  const editPhase = (goalName, phaseIndex, newName) => {
    const cloned = JSON.parse(JSON.stringify(state));
    const goal = cloned.goals[goalName];
    if (goal && goal.phases[phaseIndex]) {
      goal.phases[phaseIndex].name = newName;
      saveState(cloned);
    }
  };

  const deletePhase = (goalName, phaseIndex) => {
    const cloned = JSON.parse(JSON.stringify(state));
    const goal = cloned.goals[goalName];
    if (goal && goal.phases[phaseIndex]) {
      goal.phases.splice(phaseIndex, 1);
      if (goal.activePhaseIndex >= goal.phases.length) {
        goal.activePhaseIndex = Math.max(0, goal.phases.length - 1);
      }
      updateNextMoveEngine(cloned, goalName);
      saveState(cloned);
    }
  };

  const reorderPhases = (goalName, startIndex, endIndex) => {
    const cloned = JSON.parse(JSON.stringify(state));
    const goal = cloned.goals[goalName];
    if (goal && goal.phases) {
      const [removed] = goal.phases.splice(startIndex, 1);
      goal.phases.splice(endIndex, 0, removed);
      updateNextMoveEngine(cloned, goalName);
      saveState(cloned);
    }
  };

  const addMilestone = (goalName, phaseIndex, milestoneName) => {
    const cloned = JSON.parse(JSON.stringify(state));
    const goal = cloned.goals[goalName];
    if (goal && goal.phases[phaseIndex]) {
      goal.phases[phaseIndex].milestones.push({
        name: milestoneName,
        completed: false
      });
      updateNextMoveEngine(cloned, goalName);
      saveState(cloned);
    }
  };

  const editMilestone = (goalName, phaseIndex, milestoneIndex, newName) => {
    const cloned = JSON.parse(JSON.stringify(state));
    const goal = cloned.goals[goalName];
    if (goal && goal.phases[phaseIndex] && goal.phases[phaseIndex].milestones[milestoneIndex]) {
      goal.phases[phaseIndex].milestones[milestoneIndex].name = newName;
      updateNextMoveEngine(cloned, goalName);
      saveState(cloned);
    }
  };

  const deleteMilestone = (goalName, phaseIndex, milestoneIndex) => {
    const cloned = JSON.parse(JSON.stringify(state));
    const goal = cloned.goals[goalName];
    if (goal && goal.phases[phaseIndex] && goal.phases[phaseIndex].milestones[milestoneIndex]) {
      goal.phases[phaseIndex].milestones.splice(milestoneIndex, 1);
      updateNextMoveEngine(cloned, goalName);
      saveState(cloned);
    }
  };

  const toggleMilestone = (goalName, phaseIndex, milestoneIndex) => {
    const cloned = JSON.parse(JSON.stringify(state));
    const goal = cloned.goals[goalName];
    if (goal && goal.phases[phaseIndex] && goal.phases[phaseIndex].milestones[milestoneIndex]) {
      const targetM = goal.phases[phaseIndex].milestones[milestoneIndex];
      targetM.completed = !targetM.completed;

      // Update AI Memory Engine details!
      if (targetM.completed) {
        cloned.xp += 10; // Award XP
        cloned.memory.lastCompletedMilestone = targetM.name;
        cloned.memory.lastActiveRoadmapPhase = goal.phases[phaseIndex].name;
        cloned.memory.lastStudySession = new Date().toISOString();
        
        // Try to fetch resource for memory if available
        if (goal.phases[phaseIndex].resources && goal.phases[phaseIndex].resources.length > 0) {
          cloned.memory.lastStudyResource = goal.phases[phaseIndex].resources[0].title;
        }
      }

      updateNextMoveEngine(cloned, goalName);
      saveState(cloned);
    }
  };

  const addResourceToPhase = (goalName, phaseIndex, title, url, type) => {
    const cloned = JSON.parse(JSON.stringify(state));
    const goal = cloned.goals[goalName];
    if (goal && goal.phases[phaseIndex]) {
      if (!goal.phases[phaseIndex].resources) {
        goal.phases[phaseIndex].resources = [];
      }
      goal.phases[phaseIndex].resources.push({
        id: 'res_' + Date.now(),
        title,
        url,
        type: type || 'Website'
      });
      saveState(cloned);
    }
  };

  const deleteResourceFromPhase = (goalName, phaseIndex, resourceId) => {
    const cloned = JSON.parse(JSON.stringify(state));
    const goal = cloned.goals[goalName];
    if (goal && goal.phases[phaseIndex] && goal.phases[phaseIndex].resources) {
      goal.phases[phaseIndex].resources = goal.phases[phaseIndex].resources.filter(r => r.id !== resourceId);
      saveState(cloned);
    }
  };

  const restartJourney = () => {
    const cloned = JSON.parse(JSON.stringify(state));
    cloned.goals = {};
    cloned.currentGoalName = "";
    cloned.missions = { today: [], weekly: [], monthly: [] };
    cloned.memory = {
        lastCompletedMilestone: "None",
        lastActiveRoadmapPhase: "None",
        lastMission: "None",
        lastStudyResource: "None",
        lastStudySession: null,
        consistencyHistory: []
    };
    cloned.vault = [];
    cloned.reflections = {};
    cloned.fitness = { steps: {}, waterIntake: {}, weight: {} };
    cloned.xp = 0;
    cloned.onboarded = false;
    
    saveState(cloned);
  };

  const exportWorkspace = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "shavex_os_workspace.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const importWorkspace = (jsonStr) => {
    try {
      const parsed = JSON.parse(jsonStr);
      const merged = deepMerge(JSON.parse(JSON.stringify(INITIAL_STATE)), parsed);
      saveState(merged);
      return true;
    } catch (err) {
      console.error("Import failed", err);
      return false;
    }
  };


  return (
    <StateContext.Provider value={{
      state,
      updateState,
      saveState,
      handleUserLogin,
      handleUserLogout,
      loading,
      isDayActive,
      calculateStreak,
      calculateTrackProgress,
      calculateXP,
      getXPLevel,
      calculateOverallProgress,
      generateRoadmap,
      updateNextMoveEngine,
      triggerNextMoveCheck,
      showWelcomeBack,
      setShowWelcomeBack,
      generateDailyMissions,
      getSuccessPredictions,
      getWeeklyCEOReport,
      getCoachInsights,
      calculateProfileCompletion,
      generateUsernameSuggestions,
      isUsernameAvailable,
      calculateRoadHealth,
      addCustomGoal,
      deleteGoal,
      addPhase,
      editPhase,
      deletePhase,
      reorderPhases,
      addMilestone,
      editMilestone,
      deleteMilestone,
      toggleMilestone,
      addResourceToPhase,
      deleteResourceFromPhase,
      restartJourney,
      exportWorkspace,
      importWorkspace
    }}>
      {children}
    </StateContext.Provider>
  );
};

export const useAppState = () => useContext(StateContext);

function deepMerge(target, source) {
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!target[key]) target[key] = {};
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}
