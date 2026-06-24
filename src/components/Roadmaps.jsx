import React, { useState } from 'react';
import { useAppState } from '../context/StateContext';
import { Map, Plus, Trash2, Edit3, ArrowUp, ArrowDown, ExternalLink, Link, Check } from 'lucide-react';

export default function Roadmaps() {
  const { state, saveState, updateNextMoveEngine } = useAppState();

  const currentGoalName = state.currentGoalName || "AI Engineer";
  const goals = state.goals || {};
  const activeGoal = goals[currentGoalName];

  // UI edit triggers
  const [newGoalName, setNewGoalName] = useState('');
  const [newPhaseName, setNewPhaseName] = useState('');
  const [editingPhaseIdx, setEditingPhaseIdx] = useState(-1);
  const [editingPhaseName, setEditingPhaseName] = useState('');
  
  // Custom milestone/resource form inputs indexed by phase index
  const [newMilestoneText, setNewMilestoneText] = useState({});
  const [newResTitle, setNewResTitle] = useState({});
  const [newResUrl, setNewResUrl] = useState({});
  const [newResType, setNewResType] = useState({});
  const [newResNotes, setNewResNotes] = useState({});

  // Helper: auto recalculate next move on state change
  const saveGoalChanges = (updatedGoals) => {
    const cloned = JSON.parse(JSON.stringify(state));
    cloned.goals = updatedGoals;
    updateNextMoveEngine(cloned, currentGoalName);
    saveState(cloned);
  };

  // 1. Create Custom Goal
  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!newGoalName.trim()) return;

    const clonedGoals = JSON.parse(JSON.stringify(goals));
    clonedGoals[newGoalName] = {
      name: newGoalName,
      phases: [
        {
          name: "Initial Research",
          milestones: [{ name: "Identify baseline concepts", completed: false }],
          resources: []
        }
      ],
      activePhaseIndex: 0
    };

    const clonedState = JSON.parse(JSON.stringify(state));
    clonedState.goals = clonedGoals;
    clonedState.currentGoalName = newGoalName;
    updateNextMoveEngine(clonedState, newGoalName);
    saveState(clonedState);

    setNewGoalName('');
  };

  const handleSelectGoal = (gName) => {
    const cloned = JSON.parse(JSON.stringify(state));
    cloned.currentGoalName = gName;
    updateNextMoveEngine(cloned, gName);
    saveState(cloned);
  };

  const handleDeleteGoal = (gName) => {
    const clonedGoals = JSON.parse(JSON.stringify(goals));
    delete clonedGoals[gName];

    const keys = Object.keys(clonedGoals);
    const nextGoal = keys.length > 0 ? keys[0] : "";

    const clonedState = JSON.parse(JSON.stringify(state));
    clonedState.goals = clonedGoals;
    clonedState.currentGoalName = nextGoal;
    if (nextGoal) {
      updateNextMoveEngine(clonedState, nextGoal);
    } else {
      clonedState.nextMove = {
        task: "Set a goal destination to generate journey maps.",
        estimatedTime: "--",
        impact: "--",
        goalName: "",
        phaseIndex: 0,
        milestoneIndex: 0
      };
    }
    saveState(clonedState);
  };

  // 2. Phase modifiers
  const handleAddPhase = (e) => {
    e.preventDefault();
    if (!newPhaseName.trim() || !activeGoal) return;

    const clonedGoals = JSON.parse(JSON.stringify(goals));
    const phases = clonedGoals[currentGoalName].phases || [];
    phases.push({
      name: newPhaseName.trim(),
      milestones: [],
      resources: [],
      notes: ""
    });

    saveGoalChanges(clonedGoals);
    setNewPhaseName('');
  };

  const handleDeletePhase = (phaseIdx) => {
    const clonedGoals = JSON.parse(JSON.stringify(goals));
    clonedGoals[currentGoalName].phases.splice(phaseIdx, 1);
    saveGoalChanges(clonedGoals);
  };

  const handleRenamePhase = (phaseIdx) => {
    if (!editingPhaseName.trim()) return;
    const clonedGoals = JSON.parse(JSON.stringify(goals));
    clonedGoals[currentGoalName].phases[phaseIdx].name = editingPhaseName.trim();
    saveGoalChanges(clonedGoals);
    setEditingPhaseIdx(-1);
    setEditingPhaseName('');
  };

  const handleMovePhase = (phaseIdx, direction) => {
    const clonedGoals = JSON.parse(JSON.stringify(goals));
    const phases = clonedGoals[currentGoalName].phases;
    const targetIdx = phaseIdx + direction;
    
    if (targetIdx < 0 || targetIdx >= phases.length) return;
    
    const temp = phases[phaseIdx];
    phases[phaseIdx] = phases[targetIdx];
    phases[targetIdx] = temp;

    saveGoalChanges(clonedGoals);
  };

  // 3. Milestones modifiers
  const handleToggleMilestone = (phaseIdx, milestoneIdx) => {
    const clonedGoals = JSON.parse(JSON.stringify(goals));
    const milestone = clonedGoals[currentGoalName].phases[phaseIdx].milestones[milestoneIdx];
    milestone.completed = !milestone.completed;
    
    // Update Memory Engine variables
    const clonedState = JSON.parse(JSON.stringify(state));
    clonedState.goals = clonedGoals;
    if (milestone.completed) {
      clonedState.xp += 10;
      clonedState.memory.lastCompletedMilestone = milestone.name;
      clonedState.memory.lastActiveRoadmapPhase = clonedGoals[currentGoalName].phases[phaseIdx].name;
      clonedState.memory.lastStudySession = new Date().toISOString();
      if (clonedGoals[currentGoalName].phases[phaseIdx].resources?.length > 0) {
        clonedState.memory.lastStudyResource = clonedGoals[currentGoalName].phases[phaseIdx].resources[0].title;
      }
    }
    
    updateNextMoveEngine(clonedState, currentGoalName);
    saveState(clonedState);
  };

  const handleAddMilestone = (e, phaseIdx) => {
    e.preventDefault();
    const text = newMilestoneText[phaseIdx] || '';
    if (!text.trim()) return;

    const clonedGoals = JSON.parse(JSON.stringify(goals));
    clonedGoals[currentGoalName].phases[phaseIdx].milestones.push({
      name: text.trim(),
      completed: false
    });

    saveGoalChanges(clonedGoals);
    setNewMilestoneText({ ...newMilestoneText, [phaseIdx]: '' });
  };

  const handleDeleteMilestone = (phaseIdx, milestoneIdx) => {
    const clonedGoals = JSON.parse(JSON.stringify(goals));
    clonedGoals[currentGoalName].phases[phaseIdx].milestones.splice(milestoneIdx, 1);
    saveGoalChanges(clonedGoals);
  };

  // 4. Resources modifiers
  const handleAddResource = (e, phaseIdx) => {
    e.preventDefault();
    const title = newResTitle[phaseIdx] || '';
    const url = newResUrl[phaseIdx] || '';
    const type = newResType[phaseIdx] || 'Website';
    const notes = newResNotes[phaseIdx] || '';

    if (!title.trim() || !url.trim()) return;

    const clonedGoals = JSON.parse(JSON.stringify(goals));
    clonedGoals[currentGoalName].phases[phaseIdx].resources.push({
      id: 'res_' + Date.now(),
      title: title.trim(),
      url: url.trim(),
      type: type,
      notes: notes.trim()
    });

    saveGoalChanges(clonedGoals);

    // Reset inputs for this phase
    setNewResTitle({ ...newResTitle, [phaseIdx]: '' });
    setNewResUrl({ ...newResUrl, [phaseIdx]: '' });
    setNewResType({ ...newResType, [phaseIdx]: 'Website' });
    setNewResNotes({ ...newResNotes, [phaseIdx]: '' });
  };

  const handleDeleteResource = (phaseIdx, resourceId) => {
    const clonedGoals = JSON.parse(JSON.stringify(goals));
    const phase = clonedGoals[currentGoalName].phases[phaseIdx];
    phase.resources = phase.resources.filter(r => r.id !== resourceId);
    saveGoalChanges(clonedGoals);
  };

  const handleUpdateNotes = (phaseIdx, text) => {
    const clonedGoals = JSON.parse(JSON.stringify(goals));
    clonedGoals[currentGoalName].phases[phaseIdx].notes = text;
    saveState({ ...state, goals: clonedGoals });
  };

  return (
    <div className="tab-pane active" id="roadmaps">
      
      <div className="grid-2-1">
        
        {/* Main Journey Maps Visualizer */}
        <div>
          <h3 className="section-title mb-4">
            <Map size={16} className="inline mr-1" /> Journey Map Visual Pipeline
          </h3>

          {!activeGoal || Object.keys(goals).length === 0 ? (
            <div className="glass p-8 text-center">
              <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                Choose your destination to begin your journey.
              </p>
            </div>
          ) : !activeGoal.phases || activeGoal.phases.length === 0 ? (
            <div className="glass p-8 text-center">
              <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                Create your first journey map.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {activeGoal.phases?.map((phase, phaseIdx) => {
                const completedCount = phase.milestones?.filter(m => m.completed).length || 0;
                const totalCount = phase.milestones?.length || 0;
                const phaseProgress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

                return (
                  <div key={phaseIdx} className="glass p-5" style={{ borderLeft: phaseProgress === 100 ? '4px solid var(--accent-green)' : '1px solid var(--border-color)' }}>
                    
                    {/* Header bar */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="res-tag-badge general" style={{ borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justify: 'center', padding: 0 }}>
                          {phaseIdx + 1}
                        </span>
                        
                        {editingPhaseIdx === phaseIdx ? (
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <input
                              type="text"
                              className="task-input"
                              style={{ height: '28px', fontSize: '0.8rem', padding: '0 6px', width: '180px' }}
                              value={editingPhaseName}
                              onChange={(e) => setEditingPhaseName(e.target.value)}
                            />
                            <button onClick={() => handleRenamePhase(phaseIdx)} className="focus-btn" style={{ height: '28px', padding: '0 8px', fontSize: '0.75rem' }}>Save</button>
                            <button onClick={() => setEditingPhaseIdx(-1)} className="priority-toggle" style={{ height: '28px', padding: '0 8px', fontSize: '0.75rem' }}>Cancel</button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#fff' }}>{phase.name}</h4>
                            <span style={{ fontSize: '0.58rem', background: 'rgba(0, 102, 255, 0.08)', color: 'var(--primary-hover)', padding: '1px 6px', borderRadius: '4px', border: '1px solid rgba(0, 102, 255, 0.15)' }}>
                              Adaptive AI Enabled
                            </span>
                          </div>
                        )}

                        <button 
                          onClick={() => {
                            setEditingPhaseIdx(phaseIdx);
                            setEditingPhaseName(phase.name);
                          }}
                          style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                        >
                          <Edit3 size={12} />
                        </button>
                      </div>

                      {/* Control arrows & deletion */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button disabled={phaseIdx === 0} onClick={() => handleMovePhase(phaseIdx, -1)} className="delete-task-btn" style={{ padding: '4px' }} title="Move Phase Up">
                          <ArrowUp size={12} />
                        </button>
                        <button disabled={phaseIdx === activeGoal.phases.length - 1} onClick={() => handleMovePhase(phaseIdx, 1)} className="delete-task-btn" style={{ padding: '4px' }} title="Move Phase Down">
                          <ArrowDown size={12} />
                        </button>
                        <button onClick={() => handleDeletePhase(phaseIdx)} className="delete-task-btn" style={{ padding: '4px', color: 'var(--accent-orange)' }} title="Delete Phase">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>

                    {/* Journey Progress slider bar */}
                    {(() => {
                      const forgettingCurve = state.aiProfile?.forgettingCurve || {};
                      const healthVal = forgettingCurve[phase.name] !== undefined ? forgettingCurve[phase.name] : 100;
                      return (
                        <div style={{ display: 'flex', justify: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                          <span>Journey Progress: {phaseProgress}% ({completedCount}/{totalCount} Missions)</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            🧠 Knowledge Health: <strong style={{ color: healthVal > 75 ? 'var(--accent-green)' : healthVal > 55 ? 'var(--accent-orange)' : 'var(--accent-red)' }}>{healthVal}%</strong>
                          </span>
                        </div>
                      );
                    })()}

                    {/* Missions list */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                      {phase.milestones?.map((milestone, mIdx) => (
                        <div key={mIdx} className={`task-item ${milestone.completed ? 'completed' : ''}`} style={{ padding: '4px 8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexGrow: 1 }}>
                            <div 
                              className="checkbox-custom" 
                              onClick={() => handleToggleMilestone(phaseIdx, mIdx)}
                              style={{ cursor: 'pointer' }}
                            >
                              {milestone.completed && <Check size={10} style={{ color: 'var(--accent-color)' }} />}
                            </div>
                            <span style={{ fontSize: '0.8rem', color: '#fff' }}>{milestone.name}</span>
                          </div>
                          <button onClick={() => handleDeleteMilestone(phaseIdx, mIdx)} className="delete-task-btn">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}

                      {/* Add Mission Form */}
                      <form onSubmit={(e) => handleAddMilestone(e, phaseIdx)} style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                        <input
                          type="text"
                          className="task-input"
                          placeholder="Add new mission targeting this phase..."
                          style={{ height: '28px', fontSize: '0.75rem', flexGrow: 1 }}
                          value={newMilestoneText[phaseIdx] || ''}
                          onChange={(e) => setNewMilestoneText({ ...newMilestoneText, [phaseIdx]: e.target.value })}
                          required
                        />
                        <button type="submit" className="focus-btn" style={{ height: '28px', padding: '0 10px', fontSize: '0.75rem' }}>
                          Add
                        </button>
                      </form>
                    </div>

                    {/* Associated Phase Knowledge Vault */}
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '12px' }}>
                      <h5 style={{ margin: '0 0 8px 0', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.5px' }}>
                        Knowledge Vault Resources
                      </h5>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
                        {phase.resources?.length === 0 ? (
                          <p style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontStyle: 'italic', margin: 0 }}>No knowledge sources linked yet.</p>
                        ) : (
                          phase.resources?.map(res => (
                            <div key={res.id} className="task-item" style={{ padding: '6px' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flexGrow: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <span className="res-tag-badge general" style={{ fontSize: '0.6rem', padding: '1px 4px' }}>{res.type}</span>
                                  <a href={res.url} target="_blank" rel="noreferrer" style={{ fontSize: '0.78rem', color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                                    {res.title} <ExternalLink size={10} style={{ color: 'var(--text-secondary)' }} />
                                  </a>
                                </div>
                                {res.notes && <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginLeft: '4px' }}>"{res.notes}"</span>}
                              </div>
                              <button onClick={() => handleDeleteResource(phaseIdx, res.id)} className="delete-task-btn">
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Add Resource to Knowledge Vault */}
                      <form onSubmit={(e) => handleAddResource(e, phaseIdx)} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: 'rgba(255,255,255,0.01)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.03)' }}>
                        <input
                          type="text"
                          className="task-input"
                          placeholder="Source title"
                          style={{ height: '28px', fontSize: '0.75rem' }}
                          value={newResTitle[phaseIdx] || ''}
                          onChange={(e) => setNewResTitle({ ...newResTitle, [phaseIdx]: e.target.value })}
                          required
                        />
                        <input
                          type="url"
                          className="task-input"
                          placeholder="URL (https://...)"
                          style={{ height: '28px', fontSize: '0.75rem' }}
                          value={newResUrl[phaseIdx] || ''}
                          onChange={(e) => setNewResUrl({ ...newResUrl, [phaseIdx]: e.target.value })}
                          required
                        />
                        <select
                          className="form-select"
                          style={{ height: '28px', fontSize: '0.75rem', background: '#131314' }}
                          value={newResType[phaseIdx] || 'Website'}
                          onChange={(e) => setNewResType({ ...newResType, [phaseIdx]: e.target.value })}
                        >
                          <option value="Playlist">YouTube Playlist</option>
                          <option value="Course">Online Course</option>
                          <option value="PDF">Book PDF</option>
                          <option value="Repository">GitHub Repo</option>
                          <option value="GDrive">Google Drive</option>
                          <option value="Website">Website</option>
                        </select>
                        <input
                          type="text"
                          className="task-input"
                          placeholder="Short notes/tags"
                          style={{ height: '28px', fontSize: '0.75rem' }}
                          value={newResNotes[phaseIdx] || ''}
                          onChange={(e) => setNewResNotes({ ...newResNotes, [phaseIdx]: e.target.value })}
                        />
                        <button type="submit" className="focus-btn" style={{ gridColumn: 'span 2', height: '28px', fontSize: '0.75rem' }}>
                          <Link size={12} className="inline mr-1" /> Link Knowledge Source
                        </button>
                      </form>
                    </div>

                    {/* Phase Notes Textbox */}
                    <div style={{ marginTop: '12px' }}>
                      <label style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Phase Concept Notes</label>
                      <textarea
                        className="form-input-textarea"
                        style={{ minHeight: '36px', padding: '6px', fontSize: '0.75rem', marginTop: '4px' }}
                        placeholder="Write notes, formulas, or dynamic concept logs..."
                        value={phase.notes || ''}
                        onChange={(e) => handleUpdateNotes(phaseIdx, e.target.value)}
                      />
                    </div>

                  </div>
                );
              })}

              {/* Add New Phase Form */}
              <form onSubmit={handleAddPhase} className="glass p-4" style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  className="task-input"
                  placeholder="Insert custom phase name..."
                  style={{ height: '36px', fontSize: '0.8rem' }}
                  value={newPhaseName}
                  onChange={(e) => setNewPhaseName(e.target.value)}
                  required
                />
                <button type="submit" className="focus-btn" style={{ height: '36px', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Plus size={14} /> Append Phase
                </button>
              </form>

            </div>
          )}
        </div>

        {/* Goal Directory Sidebar Panel */}
        <div>
          <h3 className="section-title mb-4">Goal Destinations</h3>
          
          <div className="glass p-4 mb-6">
            <h4 style={{ fontSize: '0.9rem', marginBottom: '12px' }}>Add Target Destination</h4>
            <form onSubmit={handleAddGoal} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input
                type="text"
                className="task-input"
                placeholder="e.g. UPSC Exam, Fullstack Developer"
                value={newGoalName}
                onChange={(e) => setNewGoalName(e.target.value)}
                required
              />
              <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                <Plus size={14} className="inline mr-1" /> Create Custom Goal
              </button>
            </form>
          </div>

          <div className="glass p-4">
            <h4 style={{ fontSize: '0.9rem', marginBottom: '12px' }}>My Active Objectives</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {Object.keys(goals).length === 0 ? (
                <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
                  No active goals registered.
                </p>
              ) : (
                Object.keys(goals).map(gName => (
                  <div 
                    key={gName} 
                    className="task-item cursor-pointer"
                    style={{ 
                      padding: '8px 12px', 
                      background: currentGoalName === gName ? 'rgba(0,102,255,0.06)' : 'rgba(255,255,255,0.01)',
                      border: currentGoalName === gName ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleSelectGoal(gName)}
                  >
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', flexGrow: 1 }}>{gName}</span>
                    <button 
                      className="delete-task-btn" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteGoal(gName);
                      }}
                      style={{ padding: '4px' }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
