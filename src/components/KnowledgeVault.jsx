import React, { useState } from 'react';
import { useAppState } from '../context/StateContext';
import { 
  Search, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Library, 
  Tag,
  Youtube,
  GraduationCap,
  FileText,
  Globe,
  Book,
  FileEdit,
  Briefcase,
  Lightbulb,
  Compass
} from 'lucide-react';

const getTypeDetails = (type) => {
  switch (type) {
    case 'Playlist':
      return {
        label: 'YouTube Playlist',
        icon: Youtube,
        color: '#FF0000',
        bg: 'rgba(255, 0, 0, 0.06)',
        border: 'rgba(255, 0, 0, 0.25)',
      };
    case 'Course':
      return {
        label: 'Online Course',
        icon: GraduationCap,
        color: '#00E676',
        bg: 'rgba(0, 230, 118, 0.06)',
        border: 'rgba(0, 230, 118, 0.25)',
      };
    case 'PDF':
      return {
        label: 'PDF Ebook',
        icon: FileText,
        color: '#FF9100',
        bg: 'rgba(255, 145, 0, 0.06)',
        border: 'rgba(255, 145, 0, 0.25)',
      };
    case 'Website':
      return {
        label: 'Website Link',
        icon: Globe,
        color: '#0066FF',
        bg: 'rgba(0, 102, 255, 0.06)',
        border: 'rgba(0, 102, 255, 0.25)',
      };
    case 'Book':
      return {
        label: 'Physical Book',
        icon: Book,
        color: '#B200FF',
        bg: 'rgba(178, 0, 255, 0.06)',
        border: 'rgba(178, 0, 255, 0.25)',
      };
    case 'Notes':
      return {
        label: 'Concept Notes',
        icon: FileEdit,
        color: '#FFEB3B',
        bg: 'rgba(255, 235, 59, 0.06)',
        border: 'rgba(255, 235, 59, 0.25)',
      };
    case 'Resource':
      return {
        label: 'General Resource',
        icon: Briefcase,
        color: '#9E9E9E',
        bg: 'rgba(158, 158, 158, 0.06)',
        border: 'rgba(158, 158, 158, 0.25)',
      };
    case 'Idea':
      return {
        label: 'Productivity Idea',
        icon: Lightbulb,
        color: '#E91E63',
        bg: 'rgba(233, 30, 99, 0.06)',
        border: 'rgba(233, 30, 99, 0.25)',
      };
    default:
      return {
        label: 'General Resource',
        icon: Globe,
        color: 'var(--primary)',
        bg: 'rgba(0, 102, 255, 0.06)',
        border: 'rgba(0, 102, 255, 0.25)',
      };
  }
};

export default function KnowledgeVault() {
  const { state, updateState } = useAppState();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('All');
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState('All');

  // Add Item States
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Website');
  const [url, setUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  const [associatedPhase, setAssociatedPhase] = useState('All');
  const [difficulty, setDifficulty] = useState('Medium');
  const [priority, setPriority] = useState('High');
  const [revisionDate, setRevisionDate] = useState('');

  const currentGoalName = state.currentGoalName || "AI Engineer";
  const activeGoal = state.goals?.[currentGoalName];
  const phasesList = activeGoal?.phases || [];

  const handleAddVaultItem = (e) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    const tags = tagsStr
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const newItem = {
      id: 'v_' + Date.now(),
      title: title.trim(),
      type: type,
      url: url.trim(),
      notes: notes.trim(),
      tags: tags,
      phaseName: associatedPhase,
      difficulty,
      priority,
      revisionDate
    };

    const activeList = [...(state.vault || [])];
    activeList.push(newItem);
    updateState('vault', activeList);

    // Reset Form
    setTitle('');
    setUrl('');
    setNotes('');
    setTagsStr('');
    setAssociatedPhase('All');
    setDifficulty('Medium');
    setPriority('High');
    setRevisionDate('');
  };

  const handleDeleteVaultItem = (id) => {
    const updated = (state.vault || []).filter(item => item.id !== id);
    updateState('vault', updated);
  };

  // Searching, type filtering and phase filtering logic
  const filteredVault = (state.vault || []).filter(item => {
    const matchesType = selectedTypeFilter === 'All' || item.type === selectedTypeFilter;
    const matchesPhase = selectedPhaseFilter === 'All' || item.phaseName === selectedPhaseFilter;
    
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      item.title.toLowerCase().includes(query) ||
      (item.notes && item.notes.toLowerCase().includes(query)) ||
      item.tags?.some(tag => tag.toLowerCase().includes(query));

    return matchesType && matchesPhase && matchesSearch;
  });

  const vaultTypes = ['All', 'Notes', 'PDF', 'Course', 'Playlist', 'Website', 'Book', 'Resource', 'Idea'];

  return (
    <div className="tab-pane active" id="vault">
      
      <div className="grid-2-1">
        
        {/* Searchable Library */}
        <div>
          
          {/* Filters Control Room */}
          <div className="glass p-4 mb-6" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <Search size={14} style={{ color: 'var(--text-secondary)' }} />
              <input
                type="text"
                className="focus-input"
                placeholder="Search Knowledge Vault..."
                style={{ border: 'none', background: 'transparent', margin: 0, padding: 0 }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Phase Filters */}
            <div>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: 800 }}>Journey Phase Filter</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                <button
                  className={`priority-toggle ${selectedPhaseFilter === 'All' ? 'active' : ''}`}
                  style={{ height: '24px', padding: '0 8px', fontSize: '0.65rem' }}
                  onClick={() => setSelectedPhaseFilter('All')}
                >
                  All Phases
                </button>
                {phasesList.map(p => (
                  <button
                    key={p.name}
                    className={`priority-toggle ${selectedPhaseFilter === p.name ? 'active' : ''}`}
                    style={{ height: '24px', padding: '0 8px', fontSize: '0.65rem' }}
                    onClick={() => setSelectedPhaseFilter(p.name)}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Type Filters */}
            <div>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: 800 }}>Content Format</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {vaultTypes.map(t => (
                  <button
                    key={t}
                    className={`priority-toggle ${selectedTypeFilter === t ? 'active' : ''}`}
                    style={{ height: '22px', padding: '0 8px', fontSize: '0.62rem' }}
                    onClick={() => setSelectedTypeFilter(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <h3 className="section-title mb-4">
            <Library size={16} className="inline mr-1" /> Knowledge Vault Catalog
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
            {filteredVault.length === 0 ? (
              <div className="glass p-8 text-center" style={{ gridColumn: '1 / -1' }}>
                <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', margin: 0 }}>
                  No knowledge sources found matching current parameters.
                </p>
              </div>
            ) : (
              filteredVault.map(item => {
                const typeDetails = getTypeDetails(item.type);
                const IconComponent = typeDetails.icon;
                return (
                  <div 
                    key={item.id} 
                    className="glass glass-hover" 
                    style={{ 
                      padding: '16px', 
                      position: 'relative', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '12px',
                      borderLeft: `4px solid ${typeDetails.color}`,
                      background: `linear-gradient(to bottom right, ${typeDetails.bg}, rgba(10, 10, 14, 0.6))`,
                      borderRadius: '8px',
                      minHeight: '160px',
                    }}
                  >
                    {/* Top Row */}
                    <div style={{ display: 'flex', justify: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ 
                          width: '28px', 
                          height: '28px', 
                          borderRadius: '6px', 
                          background: typeDetails.bg, 
                          border: `1px solid ${typeDetails.border}`, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center' 
                        }}>
                          <IconComponent size={14} style={{ color: typeDetails.color }} />
                        </div>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          {typeDetails.label}
                        </span>
                      </div>
                      
                      <button 
                        className="delete-task-btn" 
                        onClick={() => handleDeleteVaultItem(item.id)}
                        style={{ padding: '4px', margin: '-4px' }}
                        title="Remove source"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    {/* Middle Row */}
                    <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noreferrer" 
                        style={{ 
                          fontSize: '0.9rem', 
                          fontWeight: 700, 
                          color: '#fff', 
                          textDecoration: 'none', 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '4px',
                          lineHeight: 1.3
                        }}
                      >
                        <span style={{ borderBottom: '1px dashed transparent', transition: 'border-color 0.2s' }}>{item.title}</span>
                        <ExternalLink size={11} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
                      </a>
                      
                      {item.notes && (
                        <p style={{ 
                          fontSize: '0.74rem', 
                          color: 'var(--text-secondary)', 
                          margin: 0, 
                          lineHeight: 1.4,
                          background: 'rgba(255, 255, 255, 0.02)',
                          padding: '6px 8px',
                          borderRadius: '4px',
                          borderLeft: `2px solid ${typeDetails.color}`,
                        }}>
                          {item.notes}
                        </p>
                      )}
                    </div>

                    {/* Bottom Row (Tags and Phase Target Name) */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '8px', marginTop: 'auto' }}>
                      {item.phaseName && item.phaseName !== 'All' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.62rem', color: 'var(--primary)' }}>
                          <Compass size={10} /> Journey Phase: {item.phaseName}
                        </div>
                      )}
                      
                      {item.tags && item.tags.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {item.tags.map(tag => (
                            <span 
                              key={tag} 
                              style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '2px', 
                                fontSize: '0.6rem', 
                                color: 'var(--text-secondary)', 
                                background: 'rgba(255,255,255,0.03)', 
                                border: '1px solid rgba(255,255,255,0.05)',
                                padding: '1px 5px', 
                                borderRadius: '3px' 
                              }}
                            >
                              <Tag size={8} style={{ color: typeDetails.color }} /> {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                        <span>Diff: {item.difficulty || 'Medium'} | Prio: {item.priority || 'High'}</span>
                        {item.revisionDate && <span>Revise by: {item.revisionDate}</span>}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* Add items panel */}
        <div>
          <h3 className="section-title mb-4">Add to Vault</h3>
          
          <div className="glass p-4">
            <form onSubmit={handleAddVaultItem} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              <div className="form-group">
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Resource Name</label>
                <input
                  type="text"
                  className="task-input"
                  placeholder="e.g. Backpropagation Math Sheet"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Resource URL</label>
                <input
                  type="url"
                  className="task-input"
                  placeholder="https://gdrive-link/file.pdf"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Resource Format</label>
                <select
                  className="form-select"
                  style={{ background: '#131314' }}
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="Notes">Notes / Document</option>
                  <option value="PDF">PDF Ebook</option>
                  <option value="Course">Online Course</option>
                  <option value="Playlist">YouTube Playlist</option>
                  <option value="Website">Website Link</option>
                  <option value="Book">Physical Book</option>
                  <option value="Resource">General Resource</option>
                  <option value="Idea">Productivity Idea</option>
                </select>
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Associate with Journey Phase</label>
                <select
                  className="form-select"
                  style={{ background: '#131314' }}
                  value={associatedPhase}
                  onChange={(e) => setAssociatedPhase(e.target.value)}
                >
                  <option value="All">General (No specific phase)</option>
                  {phasesList.map(p => (
                    <option key={p.name} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Concept Summary / Notes</label>
                <textarea
                  className="form-input-textarea"
                  style={{ minHeight: '50px' }}
                  placeholder="Write dynamic learnings, formulas, key ideas..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Tags (comma-separated)</label>
                <input
                  type="text"
                  className="task-input"
                  placeholder="AI, Math, Statistics"
                  value={tagsStr}
                  onChange={(e) => setTagsStr(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                <Plus size={14} className="inline mr-1" /> Add to Knowledge Vault
              </button>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
