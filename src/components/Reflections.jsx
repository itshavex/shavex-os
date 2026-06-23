import React, { useState } from 'react';
import { useAppState } from '../context/StateContext';
import { PenTool, Calendar, BookOpen, Smile, AlertCircle, Compass, Award } from 'lucide-react';

export default function Reflections() {
  const { state, saveState } = useAppState();

  const todayStr = new Date().toISOString().split('T')[0];
  const reflections = state.reflections || {};

  // Form states
  const [learned, setLearned] = useState(reflections[todayStr]?.learned || '');
  const [wentWell, setWentWell] = useState(reflections[todayStr]?.wentWell || '');
  const [needsImprovement, setNeedsImprovement] = useState(reflections[todayStr]?.needsImprovement || '');
  const [tomorrowFocus, setTomorrowFocus] = useState(reflections[todayStr]?.tomorrowFocus || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveReflection = (e) => {
    e.preventDefault();

    const cloned = JSON.parse(JSON.stringify(state));
    if (!cloned.reflections) cloned.reflections = {};

    const isNew = !cloned.reflections[todayStr];

    cloned.reflections[todayStr] = {
      learned: learned.trim(),
      wentWell: wentWell.trim(),
      needsImprovement: needsImprovement.trim(),
      tomorrowFocus: tomorrowFocus.trim()
    };

    // If it's a first-time submission today, award +5 XP
    if (isNew) {
      cloned.xp += 5;
    }

    saveState(cloned);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  // Convert reflections dictionary to sorted list
  const sortedReflections = Object.keys(reflections)
    .sort((a, b) => new Date(b) - new Date(a))
    .map(date => ({ date, ...reflections[date] }));

  return (
    <div className="tab-pane active" id="reflections">
      
      <div className="grid-2-1">
        
        {/* Reflection Logger Form */}
        <div>
          <h3 className="section-title mb-4">
            <PenTool size={16} className="inline mr-1" /> Daily Reflection Audit
          </h3>

          <div className="glass p-5 mb-6" style={{ borderLeft: '3.5px solid var(--accent-purple)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Calendar size={16} style={{ color: 'var(--accent-purple)' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-purple)', letterSpacing: '0.5px' }}>
                Today's Reflection Log — {todayStr}
              </span>
            </div>

            <form onSubmit={handleSaveReflection} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              <div className="form-group">
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <BookOpen size={12} /> What did you learn today?
                </label>
                <textarea
                  className="form-input-textarea"
                  style={{ minHeight: '50px' }}
                  placeholder="Notes, concepts mastered, or algorithms studied..."
                  value={learned}
                  onChange={(e) => setLearned(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Smile size={12} /> What went well? (Log wins & achievements)
                </label>
                <textarea
                  className="form-input-textarea"
                  style={{ minHeight: '50px' }}
                  placeholder="Completed milestones, resolved bugs, or high productivity blocks..."
                  value={wentWell}
                  onChange={(e) => setWentWell(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertCircle size={12} /> What needs improvement? (Log bottlenecks/friction)
                </label>
                <textarea
                  className="form-input-textarea"
                  style={{ minHeight: '50px' }}
                  placeholder="Distractions, confusion, or issues to modify next time..."
                  value={needsImprovement}
                  onChange={(e) => setNeedsImprovement(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Compass size={12} /> What is tomorrow's focus?
                </label>
                <input
                  type="text"
                  className="task-input"
                  placeholder="Target next move or study objective..."
                  value={tomorrowFocus}
                  onChange={(e) => setTomorrowFocus(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="focus-btn" style={{ height: '42px', background: 'var(--accent-purple)', color: '#fff', fontWeight: 700 }}>
                Save Audit & Logging +5 XP
              </button>

              {saveSuccess && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-green)', fontSize: '0.75rem', justifyContent: 'center' }}>
                  <Award size={14} />
                  <span>Reflection logged. Check your 60-day consistency matrix grid.</span>
                </div>
              )}

            </form>
          </div>
        </div>

        {/* Reflection History Archive */}
        <div>
          <h3 className="section-title mb-4">Past Audits Logs</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '450px', overflowY: 'auto' }}>
            {sortedReflections.length === 0 ? (
              <div className="glass p-4 text-center">
                <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontStyle: 'italic', margin: 0 }}>
                  No reflections logged yet. Submit today's audit above.
                </p>
              </div>
            ) : (
              sortedReflections.map(ref => (
                <div key={ref.date} className="glass p-4" style={{ borderLeft: '3px solid rgba(255,255,255,0.06)' }}>
                  <strong style={{ fontSize: '0.82rem', color: 'var(--primary)', display: 'block', marginBottom: '8px' }}>
                    {ref.date} {ref.date === todayStr ? "(Today)" : ""}
                  </strong>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.75rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Learned:</span>
                      <p style={{ margin: '2px 0 0 0', color: '#fff' }}>{ref.learned}</p>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Wins:</span>
                      <p style={{ margin: '2px 0 0 0', color: '#fff' }}>{ref.wentWell}</p>
                    </div>
                    {ref.needsImprovement && (
                      <div>
                        <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Improvements:</span>
                        <p style={{ margin: '2px 0 0 0', color: '#fff' }}>{ref.needsImprovement}</p>
                      </div>
                    )}
                    <div>
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Next Focus:</span>
                      <p style={{ margin: '2px 0 0 0', color: 'var(--accent-orange)', fontWeight: 600 }}>{ref.tomorrowFocus}</p>
                    </div>
                  </div>

                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
