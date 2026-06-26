import React, { useState } from 'react';
import { useAppState } from '../context/StateContext';
import { Milestone, Plus, Trash2, Calendar, Award, BookOpen, Dumbbell, FolderGit2 } from 'lucide-react';

export default function Timeline() {
  const { state, updateState } = useAppState();

  const [year, setYear] = useState('2026');
  const [type, setType] = useState('Goal');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const handleAddTimelineEvent = (e) => {
    e.preventDefault();
    if (!title.trim() || !year.trim()) return;

    const newEvent = {
      id: 'tl_' + Date.now(),
      year: year.trim(),
      type: type,
      title: title.trim(),
      desc: desc.trim()
    };

    const activeList = [...(state.lifeTimeline || [])];
    activeList.push(newEvent);
    updateState('lifeTimeline', activeList);

    // Reset Form
    setTitle('');
    setDesc('');
  };

  const handleDeleteEvent = (id) => {
    const updated = (state.lifeTimeline || []).filter(e => e.id !== id);
    updateState('lifeTimeline', updated);
  };

  // Group events by year
  const timelineEvents = state.lifeTimeline || [];
  const groupedEvents = {};
  timelineEvents.forEach(e => {
    if (!groupedEvents[e.year]) {
      groupedEvents[e.year] = [];
    }
    groupedEvents[e.year].push(e);
  });

  const sortedYears = Object.keys(groupedEvents).sort((a, b) => b - a);

  const getIcon = (eventType) => {
    switch (eventType) {
      case 'Goal': return <Milestone size={14} style={{ color: 'var(--primary)' }} />;
      case 'Project': return <FolderGit2 size={14} style={{ color: 'var(--accent-green)' }} />;
      case 'Skill': return <BookOpen size={14} style={{ color: 'var(--accent-purple)' }} />;
      case 'Achievement': return <Award size={14} style={{ color: 'var(--accent-orange)' }} />;
      case 'Fitness': return <Dumbbell size={14} style={{ color: '#FF3D00' }} />;
      default: return <Calendar size={14} style={{ color: 'var(--text-secondary)' }} />;
    }
  };

  return (
    <div className="tab-pane active" id="timeline">
      
      <div className="grid-2-1">
        
        {/* Left Column: Visual timeline display */}
        <div>
          <h3 className="section-title mb-4">
            <Milestone size={16} className="inline mr-1" /> Life Growth Timeline
          </h3>

          <div className="timeline-container glass" style={{ padding: '24px 30px' }}>
            <div className="timeline-connector" style={{ left: '20px', background: 'rgba(255, 255, 255, 0.03)' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', position: 'relative' }}>
              {sortedYears.length === 0 ? (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic', paddingLeft: '20px' }}>
                  No growth events recorded. Add a milestone achievement using the sidebar form to populate your timeline.
                </p>
              ) : (
                sortedYears.map(yr => (
                  <div key={yr} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    
                    {/* Year badge */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', zIndex: 2 }}>
                      <div className="timeline-bullet" style={{ width: '12px', height: '12px', left: '14px', background: 'var(--primary)', border: '2px solid #030304' }} />
                      <strong style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)', color: 'var(--primary)' }}>
                        {yr}
                      </strong>
                    </div>

                    {/* Events inside this year */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '32px' }}>
                      {groupedEvents[yr].map(event => (
                        <div key={event.id} className="task-item" style={{ padding: '10px 12px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexGrow: 1 }}>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', background: 'rgba(255,255,255,0.02)', borderRadius: '4px' }}>
                                {getIcon(event.type)}
                              </span>
                              <strong style={{ fontSize: '0.85rem', color: '#fff' }}>{event.title}</strong>
                              <span className="res-tag-badge general" style={{ fontSize: '0.6rem', padding: '1px 5px' }}>{event.type}</span>
                            </div>

                            {event.desc && (
                              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '4px 0 0 30px' }}>
                                {event.desc}
                              </p>
                            )}

                          </div>
                          
                          <button className="delete-task-btn" onClick={() => handleDeleteEvent(event.id)}>
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>

                  </div>
                ))
              )}
            </div>

          </div>
        </div>

        {/* Right Column: Log Event Form */}
        <div>
          <h3 className="section-title mb-4">Log Growth Event</h3>
          
          <div className="glass p-4">
            <form onSubmit={handleAddTimelineEvent} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              <div className="form-group">
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Event Year</label>
                <input
                  type="number"
                  className="task-input"
                  placeholder="e.g. 2026"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Event Type</label>
                <select
                  className="form-select"
                  style={{ background: '#131314' }}
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="Goal">Goal Destination</option>
                  <option value="Project">Project Build</option>
                  <option value="Skill">Skill Acquired</option>
                  <option value="Achievement">Badge Achievement</option>
                  <option value="Fitness">Fitness Milestone</option>
                </select>
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Milestone / Title</label>
                <input
                  type="text"
                  className="task-input"
                  placeholder="e.g. Launched first ML model"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Description / Details</label>
                <textarea
                  className="form-input-textarea"
                  style={{ minHeight: '50px' }}
                  placeholder="Notes, concepts used, stack, or final stats..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                <Plus size={14} className="inline mr-1" /> Log Growth Milestone
              </button>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
