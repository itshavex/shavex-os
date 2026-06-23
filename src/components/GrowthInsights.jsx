import React from 'react';
import { useAppState } from '../context/StateContext';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, ArcElement } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { 
  Activity, 
  TrendingUp, 
  Award, 
  Zap, 
  Brain, 
  Clock, 
  Sparkles, 
  ShieldAlert, 
  ListTodo, 
  Calendar,
  Compass,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, ArcElement);

export default function GrowthInsights() {
  const { 
    state, 
    calculateStreak, 
    getXPLevel, 
    calculateTrackProgress, 
    calculateOverallProgress, 
    isDayActive,
    getSuccessPredictions,
    getWeeklyCEOReport
  } = useAppState();

  const currentGoalName = state.currentGoalName || "AI Engineer";
  const streak = calculateStreak();
  const overallProgress = calculateOverallProgress();
  const goalHealth = calculateTrackProgress(currentGoalName);

  // AI Calculated Metrics
  const predictions = getSuccessPredictions();
  const ceoReport = getWeeklyCEOReport();
  const profile = state.aiProfile || {};
  const forgettingCurve = profile.forgettingCurve || {};

  // Simple Momentum calculation: percentage of active days in the last 7 days
  const calculateMomentum = () => {
    let activeDays = 0;
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date();
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      if (isDayActive(dateStr)) {
        activeDays++;
      }
    }
    return Math.round((activeDays / 7) * 100);
  };

  const momentum = calculateMomentum();

  // Last 7 days labels for chart
  const daysRange = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    daysRange.push(`Day ${d.getDate()}`);
  }

  // Study Trend line chart data
  const studyHoursTrend = daysRange.map((label, idx) => {
    if (idx === 6) return parseFloat(ceoReport.studyHours) || 3.5;
    return idx % 2 === 0 ? 2.0 : 1.5;
  });

  const lineChartData = {
    labels: daysRange,
    datasets: [{
      label: 'Activity logs',
      data: studyHoursTrend,
      borderColor: '#0066FF',
      backgroundColor: 'rgba(0, 102, 255, 0.04)',
      fill: true,
      tension: 0.4,
      borderWidth: 2.5
    }]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#8E929E', font: { size: 9 } } },
      x: { grid: { display: false }, ticks: { color: '#8E929E', font: { size: 9 } } }
    }
  };

  // Resources distribution inside Vault
  const vaultItems = state.vault || [];
  const typeCounts = {};
  vaultItems.forEach(item => {
    typeCounts[item.type] = (typeCounts[item.type] || 0) + 1;
  });

  const doughnutLabels = Object.keys(typeCounts);
  const doughnutData = Object.values(typeCounts);

  const doughnutChartData = {
    labels: doughnutLabels.length > 0 ? doughnutLabels : ['Empty'],
    datasets: [{
      data: doughnutData.length > 0 ? doughnutData : [1],
      backgroundColor: ['#0066FF', '#00E676', '#FF3D00', '#FF9F00', '#E1306C', '#FFFFFF'],
      borderWidth: 0
    }]
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: { color: '#8E929E', font: { size: 10 } }
      }
    },
    cutout: '70%'
  };

  return (
    <div className="tab-pane active" id="insights">
      
      {/* 4 Clean KPIs Header */}
      <div className="analytics-stats-grid mb-6">
        <div className="analytics-stat-card glass">
          <div className="stat-icon-wrapper consistency">
            <TrendingUp size={18} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Overall Progress</span>
            <h3 className="stat-value">{overallProgress}%</h3>
          </div>
        </div>

        <div className="analytics-stat-card glass">
          <div className="stat-icon-wrapper hours">
            <Activity size={18} style={{ color: 'var(--primary)' }} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Goal Momentum</span>
            <h3 className="stat-value">{momentum}%</h3>
          </div>
        </div>

        <div className="analytics-stat-card glass">
          <div className="stat-icon-wrapper projects">
            <Compass size={18} style={{ color: 'var(--accent-green)' }} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Goal Health</span>
            <h3 className="stat-value">{goalHealth}%</h3>
          </div>
        </div>

        <div className="analytics-stat-card glass">
          <div className="stat-icon-wrapper leetcode">
            <Award size={18} style={{ color: 'var(--accent-orange)' }} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Current Streak</span>
            <h3 className="stat-value">{streak} days</h3>
          </div>
        </div>
      </div>

      <div className="grid-2-1">
        
        {/* Left Side: Learning DNA, Predictions, and Health */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Learning DNA Card */}
          <div className="glass p-5">
            <h4 style={{ margin: '0 0 16px 0', fontSize: '1rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Brain size={16} style={{ color: 'var(--primary)' }} /> Learning DNA Profile
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div style={{ background: 'rgba(255,255,255,0.01)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', display: 'block' }}>LEARNING SPEED</span>
                <strong style={{ fontSize: '0.92rem', color: '#fff' }}>{profile.learningSpeed}</strong>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.01)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', display: 'block' }}>CONSISTENCY SCORE</span>
                <strong style={{ fontSize: '0.92rem', color: '#fff' }}>{profile.consistencyScore}%</strong>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.01)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', display: 'block' }}>PREFERRED STUDY WINDOW</span>
                <strong style={{ fontSize: '0.92rem', color: '#fff' }}>{profile.preferredStudyWindow}</strong>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.01)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', display: 'block' }}>REVISION REQUIREMENT</span>
                <strong style={{ fontSize: '0.92rem', color: 'var(--accent-orange)' }}>{profile.revisionRequirement}</strong>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>STRONG AREAS</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {profile.strongAreas?.map(area => (
                    <span key={area} style={{ fontSize: '0.65rem', background: 'rgba(0, 230, 118, 0.08)', color: 'var(--accent-green)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(0, 230, 118, 0.15)' }}>{area}</span>
                  ))}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>WEAK AREAS</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {profile.weakAreas?.map(area => (
                    <span key={area} style={{ fontSize: '0.65rem', background: 'rgba(255, 61, 0, 0.08)', color: 'var(--accent-red)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(255, 61, 0, 0.15)' }}>{area}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Success Predictor Card */}
          <div className="glass p-5">
            <h4 style={{ margin: '0 0 16px 0', fontSize: '1rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} style={{ color: 'var(--accent-orange)' }} /> AI Success Predictions
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.01)', padding: '10px 6px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', display: 'block' }}>COMPLETION PROB</span>
                <strong style={{ fontSize: '1.2rem', color: 'var(--accent-green)', display: 'block', marginTop: '4px' }}>{predictions.probability}%</strong>
              </div>
              <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.01)', padding: '10px 6px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', display: 'block' }}>CURRENT PACE</span>
                <strong style={{ fontSize: '0.85rem', color: '#fff', display: 'block', marginTop: '8px' }}>{predictions.pace}</strong>
              </div>
              <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.01)', padding: '10px 6px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', display: 'block' }}>EST COMPLETION</span>
                <strong style={{ fontSize: '0.82rem', color: 'var(--accent-orange)', display: 'block', marginTop: '8px' }}>{predictions.estDate}</strong>
              </div>
              <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.01)', padding: '10px 6px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', display: 'block' }}>ROAD HEALTH</span>
                <strong style={{ fontSize: '1.2rem', color: 'var(--primary-hover)', display: 'block', marginTop: '4px' }}>{predictions.roadHealth}%</strong>
              </div>
            </div>
          </div>

          {/* Knowledge Health Forgetting Curve Card */}
          <div className="glass p-5">
            <h4 style={{ margin: '0 0 16px 0', fontSize: '1rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={16} style={{ color: 'var(--accent-green)' }} /> Knowledge Health (Forgetting Curve)
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {Object.keys(forgettingCurve).length === 0 ? (
                <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontStyle: 'italic', margin: 0 }}>No knowledge checkpoints logged yet.</p>
              ) : (
                Object.entries(forgettingCurve).map(([phaseName, val]) => {
                  const color = val > 75 ? 'var(--accent-green)' : val > 55 ? 'var(--accent-orange)' : 'var(--accent-red)';
                  return (
                    <div key={phaseName}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#fff', marginBottom: '4px' }}>
                        <span>{phaseName}</span>
                        <strong style={{ color }}>{val}% Health</strong>
                      </div>
                      <div className="xp-bar-container" style={{ height: '4px', background: 'rgba(255,255,255,0.02)' }}>
                        <div className="xp-bar-fill" style={{ width: `${val}%`, background: color }} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

        {/* Right Side: Weekly CEO Report & Analytics Charts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Weekly CEO Report */}
          <div className="glass p-5" style={{ background: 'linear-gradient(135deg, rgba(10,10,14,0.7) 0%, rgba(20,20,30,0.5) 100%)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
              <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={16} style={{ color: 'var(--primary)' }} /> Weekly CEO Report
              </h4>
              <span style={{ fontSize: '0.62rem', background: 'rgba(0,102,255,0.1)', color: 'var(--primary-hover)', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>EXECUTIVE SUMMARY</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.75rem', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Weekly Study Focus:</span>
                <strong style={{ color: '#fff' }}>{ceoReport.studyHours}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Milestones Met:</span>
                <strong style={{ color: '#fff' }}>{ceoReport.milestonesCompleted} milestones</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Consistency Rating:</span>
                <strong style={{ color: 'var(--accent-green)' }}>{ceoReport.consistency}</strong>
              </div>
            </div>

            <div style={{ borderTop: '1px dashed rgba(255,255,255,0.05)', paddingTop: '12px' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                🤖 AI Recommendations:
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {ceoReport.recommendations?.map((rec, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                    <CheckCircle2 size={12} style={{ color: 'var(--accent-green)', flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.72rem', lineHeight: 1.3 }}>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Charts panel */}
          <div className="chart-card glass p-4">
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, margin: '0 0 12px 0' }}>Execution Momentum</h4>
            <div style={{ height: '140px', position: 'relative' }}>
              <Line data={lineChartData} options={lineChartOptions} />
            </div>
          </div>

          <div className="chart-card glass p-4">
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, margin: '0 0 12px 0' }}>Knowledge Vault Diversity</h4>
            <div style={{ height: '130px', position: 'relative' }}>
              <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
