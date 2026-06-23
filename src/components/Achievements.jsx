import React from 'react';
import { useAppState } from '../context/StateContext';
import { Award } from 'lucide-react';

const ACHIEVEMENTS = [
  {
    id: "streak_7",
    name: "Consistent Start",
    desc: "Maintain a 7-day active consistency streak.",
    icon: "🔥",
    check: (state, calculateStreak) => calculateStreak() >= 7
  },
  {
    id: "streak_30",
    name: "Momentum King",
    desc: "Maintain a 30-day active consistency streak.",
    icon: "⚡",
    check: (state, calculateStreak) => calculateStreak() >= 30
  },
  {
    id: "first_milestone",
    name: "First Milestone Met",
    desc: "Complete your first roadmap milestone task.",
    icon: "🎯",
    check: (state) => {
      let completedCount = 0;
      Object.values(state.goals || {}).forEach(g => {
        (g.phases || []).forEach(p => {
          (p.milestones || []).forEach(m => {
            if (m.completed) completedCount++;
          });
        });
      });
      return completedCount >= 1;
    }
  },
  {
    id: "phase_complete",
    name: "Phase Master",
    desc: "Fully complete all milestones in any study phase.",
    icon: "🎓",
    check: (state) => {
      let phaseDone = false;
      Object.values(state.goals || {}).forEach(g => {
        (g.phases || []).forEach(p => {
          if (p.milestones && p.milestones.length > 0) {
            const completed = p.milestones.filter(m => m.completed).length;
            if (completed === p.milestones.length) phaseDone = true;
          }
        });
      });
      return phaseDone;
    }
  },
  {
    id: "vault_cataloger",
    name: "Vault Librarian",
    desc: "Catalog 5+ study resources in your Knowledge Vault.",
    icon: "📚",
    check: (state) => (state.vault || []).length >= 5
  },
  {
    id: "reflection_master",
    name: "Mindful Builder",
    desc: "Submit 5+ daily reflection audits.",
    icon: "📝",
    check: (state) => Object.keys(state.reflections || {}).length >= 5
  },
  {
    id: "milestones_10",
    name: "Milestone Conqueror",
    desc: "Complete 10+ roadmap milestones in your journey.",
    icon: "🏆",
    check: (state) => {
      let completedCount = 0;
      Object.values(state.goals || {}).forEach(g => {
        (g.phases || []).forEach(p => {
          (p.milestones || []).forEach(m => {
            if (m.completed) completedCount++;
          });
        });
      });
      return completedCount >= 10;
    }
  }
];

export default function Achievements() {
  const { state, calculateStreak } = useAppState();

  const unlockedCount = ACHIEVEMENTS.filter(badge => badge.check(state, calculateStreak)).length;

  return (
    <div className="tab-pane active" id="badges">
      <div className="smart-learning-banner glass mb-6" style={{ justifyContent: 'space-between', padding: '16px 24px' }}>
        <div>
          <span className="smart-badge">
            <Award className="inline-block mr-1" size={12} /> Achievements
          </span>
          <h3 className="mt-1" style={{ fontSize: '1.25rem' }}>Evolve Badges</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Unlock achievements by hitting consistency milestones, study targets, and milestone goals.
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Badges Unlocked</span>
          <strong style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>
            {unlockedCount} / {ACHIEVEMENTS.length}
          </strong>
        </div>
      </div>

      <div className="achievements-grid" id="badges-container">
        {ACHIEVEMENTS.map(badge => {
          const isUnlocked = badge.check(state, calculateStreak);
          return (
            <div key={badge.id} className={`badge-card glass ${isUnlocked ? 'unlocked' : ''}`}>
              <div className="badge-icon">{badge.icon}</div>
              <div className="badge-name" style={{ color: isUnlocked ? '#fff' : 'var(--text-secondary)' }}>{badge.name}</div>
              <div className="badge-desc" style={{ color: isUnlocked ? 'var(--text-secondary)' : 'var(--text-tertiary)' }}>{badge.desc}</div>
              {!isUnlocked && (
                <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', marginTop: '8px', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '6px' }}>
                  Locked
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
