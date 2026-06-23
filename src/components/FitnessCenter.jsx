import React, { useState } from 'react';
import { useAppState } from '../context/StateContext';
import { Dumbbell, Droplet, Clock, Moon, Flame, Heart, Activity, ShieldCheck, RefreshCw } from 'lucide-react';

export default function FitnessCenter() {
  const { state, saveState } = useAppState();

  const todayStr = new Date().toISOString().split('T')[0];
  const fitness = state.fitness || {};

  // Form states initialized with today's logged values if existing
  const [steps, setSteps] = useState(fitness.steps?.[todayStr] || '');
  const [walking, setWalking] = useState(fitness.walkingDistance?.[todayStr] || '');
  const [running, setRunning] = useState(fitness.runningDistance?.[todayStr] || '');
  const [cycling, setCycling] = useState(fitness.cyclingDistance?.[todayStr] || '');
  const [calories, setCalories] = useState(fitness.calories?.[todayStr] || '');
  const [water, setWater] = useState(fitness.waterIntake?.[todayStr] || '');
  const [sleep, setSleep] = useState(fitness.sleepHours?.[todayStr] || '');
  const [weight, setWeight] = useState(fitness.weight?.[todayStr] || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Wearables Connection mock state
  const [appleHealthConn, setAppleHealthConn] = useState(false);
  const [googleFitConn, setGoogleFitConn] = useState(false);
  const [fitbitConn, setFitbitConn] = useState(false);
  const [syncingWearables, setSyncingWearables] = useState(false);

  const handleSaveFitness = (e) => {
    e.preventDefault();

    const cloned = JSON.parse(JSON.stringify(state));
    if (!cloned.fitness) {
      cloned.fitness = {
        steps: {}, walkingDistance: {}, runningDistance: {}, cyclingDistance: {},
        calories: {}, waterIntake: {}, sleepHours: {}, weight: {}
      };
    }

    // Assign today's values
    cloned.fitness.steps[todayStr] = parseInt(steps) || 0;
    cloned.fitness.walkingDistance[todayStr] = parseFloat(walking) || 0;
    cloned.fitness.runningDistance[todayStr] = parseFloat(running) || 0;
    cloned.fitness.cyclingDistance[todayStr] = parseFloat(cycling) || 0;
    cloned.fitness.calories[todayStr] = parseInt(calories) || 0;
    cloned.fitness.waterIntake[todayStr] = parseInt(water) || 0;
    cloned.fitness.sleepHours[todayStr] = parseFloat(sleep) || 0;
    cloned.fitness.weight[todayStr] = parseFloat(weight) || 0;

    // Award +10 XP for fitness log entry if it wasn't already logged
    const isNew = !fitness.steps?.[todayStr];
    if (isNew) {
      cloned.xp += 10;
    }

    saveState(cloned);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleSyncWearables = () => {
    if (!appleHealthConn && !googleFitConn && !fitbitConn) return;
    setSyncingWearables(true);
    setTimeout(() => {
      setSyncingWearables(false);
      // Populate mock data into inputs
      setSteps('10432');
      setWalking('3.2');
      setRunning('1.5');
      setCalories('420');
      setWater('2500');
      setSleep('7.8');
    }, 1500);
  };

  return (
    <div className="tab-pane active" id="fitness">
      
      {/* Fitness GPS Header Banner */}
      <div className="smart-learning-banner glass mb-6" style={{ background: 'linear-gradient(to right, rgba(0, 230, 118, 0.05), transparent)', borderLeft: '3.5px solid var(--accent-green)' }}>
        <div>
          <span className="smart-badge" style={{ background: 'var(--accent-green)', color: '#000', fontWeight: 800 }}>
            Fitness GPS
          </span>
          <h3 className="mt-1" style={{ fontSize: '1.25rem' }}>Core Biometrics & Activity Sync</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Track physical execution and integrate health tracking with roadmap planning for overall system synchronization.
          </p>
        </div>
      </div>

      <div className="grid-2-1">
        
        {/* Fitness Log Form */}
        <div>
          <h3 className="section-title mb-4">Log Daily Parameters</h3>
          <div className="glass p-5 mb-6">
            <form onSubmit={handleSaveFitness} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              
              <div className="form-group">
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Daily Steps</label>
                <input
                  type="number"
                  className="task-input"
                  placeholder="e.g. 8000"
                  value={steps}
                  onChange={(e) => setSteps(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Walking Distance (km)</label>
                <input
                  type="number"
                  step="0.1"
                  className="task-input"
                  placeholder="e.g. 2.4"
                  value={walking}
                  onChange={(e) => setWalking(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Running Distance (km)</label>
                <input
                  type="number"
                  step="0.1"
                  className="task-input"
                  placeholder="e.g. 5.0"
                  value={running}
                  onChange={(e) => setRunning(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Cycling Distance (km)</label>
                <input
                  type="number"
                  step="0.1"
                  className="task-input"
                  placeholder="e.g. 10.5"
                  value={cycling}
                  onChange={(e) => setCycling(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Calories Burned (kcal)</label>
                <input
                  type="number"
                  className="task-input"
                  placeholder="e.g. 350"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Water Intake (ml)</label>
                <input
                  type="number"
                  className="task-input"
                  placeholder="e.g. 3000"
                  value={water}
                  onChange={(e) => setWater(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Sleep Hours</label>
                <input
                  type="number"
                  step="0.1"
                  className="task-input"
                  placeholder="e.g. 7.5"
                  value={sleep}
                  onChange={(e) => setSleep(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Current Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  className="task-input"
                  placeholder="e.g. 74.5"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>

              <button type="submit" className="focus-btn" style={{ gridColumn: 'span 2', height: '40px', background: 'var(--accent-green)', color: '#000', fontWeight: 850 }}>
                Save GPS Metrics & Earn +10 XP
              </button>

              {saveSuccess && (
                <div style={{ gridColumn: 'span 2', color: 'var(--accent-green)', fontSize: '0.75rem', textAlign: 'center', fontWeight: 700 }}>
                  ✔ Metrics successfully committed to database!
                </div>
              )}

            </form>
          </div>

          {/* Wearables Integration Console */}
          <h3 className="section-title mb-4">Wearables Sync Engine</h3>
          <div className="glass p-5" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justify: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={18} style={{ color: 'var(--primary)' }} />
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.85rem', color: '#fff' }}>Connected APIs</h4>
                  <p style={{ margin: 0, fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Enable automated background syncing</p>
                </div>
              </div>
              <button 
                onClick={handleSyncWearables} 
                disabled={syncingWearables || (!appleHealthConn && !googleFitConn && !fitbitConn)}
                className="priority-toggle" 
                style={{ height: '28px', fontSize: '0.68rem', gap: '4px', opacity: (appleHealthConn || googleFitConn || fitbitConn) ? 1 : 0.5 }}
              >
                <RefreshCw size={12} className={syncingWearables ? 'spin' : ''} />
                {syncingWearables ? 'Syncing...' : 'Sync Now'}
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Apple Health */}
              <div style={{ display: 'flex', justify: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.01)', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.78rem', color: '#fff', fontWeight: 600 }}>Apple Health SDK</span>
                <button 
                  onClick={() => setAppleHealthConn(!appleHealthConn)}
                  className={`priority-toggle ${appleHealthConn ? 'active' : ''}`}
                  style={{ height: '24px', fontSize: '0.65rem' }}
                >
                  {appleHealthConn ? 'Connected' : 'Connect'}
                </button>
              </div>

              {/* Google Fit */}
              <div style={{ display: 'flex', justify: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.01)', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.78rem', color: '#fff', fontWeight: 600 }}>Google Fit API</span>
                <button 
                  onClick={() => setGoogleFitConn(!googleFitConn)}
                  className={`priority-toggle ${googleFitConn ? 'active' : ''}`}
                  style={{ height: '24px', fontSize: '0.65rem' }}
                >
                  {googleFitConn ? 'Connected' : 'Connect'}
                </button>
              </div>

              {/* Fitbit */}
              <div style={{ display: 'flex', justify: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.01)', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.78rem', color: '#fff', fontWeight: 600 }}>Fitbit OAuth</span>
                <button 
                  onClick={() => setFitbitConn(!fitbitConn)}
                  className={`priority-toggle ${fitbitConn ? 'active' : ''}`}
                  style={{ height: '24px', fontSize: '0.65rem' }}
                >
                  {fitbitConn ? 'Connected' : 'Connect'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Stats Summary Cards */}
        <div>
          <h3 className="section-title mb-4">Today's Summary</h3>
          <div className="glass p-4" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={16} style={{ color: 'var(--accent-green)' }} />
                <span style={{ fontSize: '0.8rem', color: '#fff' }}>Total Steps</span>
              </div>
              <strong style={{ fontSize: '0.85rem' }}>{fitness.steps?.[todayStr] || steps || 0} steps</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Flame size={16} style={{ color: 'var(--accent-orange)' }} />
                <span style={{ fontSize: '0.8rem', color: '#fff' }}>Calories Burned</span>
              </div>
              <strong style={{ fontSize: '0.85rem' }}>{fitness.calories?.[todayStr] || calories || 0} kcal</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Droplet size={16} style={{ color: 'var(--primary)' }} />
                <span style={{ fontSize: '0.8rem', color: '#fff' }}>Water Level</span>
              </div>
              <strong style={{ fontSize: '0.85rem' }}>{fitness.waterIntake?.[todayStr] || water || 0} ml</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Moon size={16} style={{ color: 'var(--accent-purple)' }} />
                <span style={{ fontSize: '0.8rem', color: '#fff' }}>Sleep Logged</span>
              </div>
              <strong style={{ fontSize: '0.85rem' }}>{fitness.sleepHours?.[todayStr] || sleep || 0} hrs</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Heart size={16} style={{ color: 'var(--accent-red)' }} />
                <span style={{ fontSize: '0.8rem', color: '#fff' }}>Weight Logged</span>
              </div>
              <strong style={{ fontSize: '0.85rem' }}>{fitness.weight?.[todayStr] || weight || 0} kg</strong>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
