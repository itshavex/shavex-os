import React, { useState, useEffect, useRef } from 'react';
import { useAppState } from '../context/StateContext';
import { Dumbbell, Droplet, Clock, Moon, Flame, Heart, Activity, ShieldCheck, RefreshCw, Bluetooth, Zap, AlertCircle } from 'lucide-react';

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

  // Wearables Connection States
  const [appleHealthConn, setAppleHealthConn] = useState(false);
  const [googleFitConn, setGoogleFitConn] = useState(false);
  const [fitbitConn, setFitbitConn] = useState(false);
  const [syncingWearables, setSyncingWearables] = useState(false);

  // BLE & Biometrics Simulator States
  const [bleDevice, setBleDevice] = useState(null);
  const [bleConnected, setBleConnected] = useState(false);
  const [liveHeartRate, setLiveHeartRate] = useState(null);
  const [bleError, setBleError] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simActivity, setSimActivity] = useState('Resting');
  const [hrHistory, setHrHistory] = useState([72, 70, 71, 73, 72, 74, 73, 75, 74, 76]);
  const [simSteps, setSimSteps] = useState(4820);
  const [simCalories, setSimCalories] = useState(120);

  const timerRef = useRef(null);

  // Helper to determine heart rate zone
  const getHRZone = (bpm) => {
    if (!bpm) return { name: 'OFFLINE', color: 'var(--text-secondary)', level: 'Rest' };
    if (bpm < 60) return { name: 'CHILL (Resting)', color: 'var(--text-secondary)', level: 'Rest' };
    if (bpm < 100) return { name: 'RECOVERY (Warmup)', color: 'var(--accent-green)', level: 'Warmup' };
    if (bpm < 140) return { name: 'AEROBIC (Fat Burn)', color: 'var(--accent-orange)', level: 'Aerobic' };
    if (bpm < 170) return { name: 'ANAEROBIC (Cardio)', color: 'var(--primary)', level: 'Cardio' };
    return { name: 'PEAK (Max Effort)', color: 'var(--accent-red)', level: 'Peak' };
  };

  const currentZone = getHRZone(liveHeartRate);

  // Handle BLE Heart Rate Connect
  const connectBluetoothHR = async () => {
    setBleError(null);
    setIsSimulating(false);
    if (timerRef.current) clearInterval(timerRef.current);

    try {
      if (!navigator.bluetooth) {
        throw new Error("Web Bluetooth not supported on this browser.");
      }
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['heart_rate'] }]
      });
      setBleDevice(device);

      const server = await device.gatt.connect();
      const service = await server.getPrimaryService('heart_rate');
      const characteristic = await service.getCharacteristic('heart_rate_measurement');

      await characteristic.startNotifications();
      characteristic.addEventListener('characteristicvaluechanged', (event) => {
        const value = event.target.value;
        const flags = value.getUint8(0);
        const rate16 = flags & 0x01;
        let bpm = 0;
        if (rate16) {
          bpm = value.getUint16(1, true);
        } else {
          bpm = value.getUint8(1);
        }
        setLiveHeartRate(bpm);
        setHrHistory(prev => {
          const nextHist = [...prev, bpm];
          if (nextHist.length > 15) nextHist.shift();
          return nextHist;
        });

        // Accumulate mock calculations
        setSimCalories(prev => Math.round(prev + Math.max(0.1, (bpm - 60) * 0.02)));
        setSimSteps(prev => prev + (bpm > 100 ? 5 : 1));
      });

      setBleConnected(true);
      device.addEventListener('gattserverdisconnected', () => {
        setBleConnected(false);
        setLiveHeartRate(null);
      });
    } catch (err) {
      console.warn("BLE HR Connection failed or cancelled, starting simulation fallback", err);
      setBleError(err.message || "GATT Connection failed.");
      startBiometricsSimulation();
    }
  };

  const disconnectBluetoothHR = () => {
    if (bleDevice && bleDevice.gatt.connected) {
      bleDevice.gatt.disconnect();
    }
    setBleConnected(false);
    setLiveHeartRate(null);
  };

  // Start simulated metrics generator
  const startBiometricsSimulation = () => {
    setIsSimulating(true);
    setBleConnected(false);
    if (timerRef.current) clearInterval(timerRef.current);

    let baseBpm = liveHeartRate || 72;
    timerRef.current = setInterval(() => {
      let targetBpm = 72;
      let variance = 3;
      if (simActivity === 'Warmup') {
        targetBpm = 95; variance = 5;
      } else if (simActivity === 'Aerobic') {
        targetBpm = 125; variance = 8;
      } else if (simActivity === 'Cardio') {
        targetBpm = 155; variance = 10;
      } else if (simActivity === 'Peak') {
        targetBpm = 182; variance = 6;
      }

      baseBpm = Math.round(baseBpm + (targetBpm - baseBpm) * 0.15 + (Math.random() - 0.5) * variance);
      baseBpm = Math.max(45, Math.min(200, baseBpm));

      setLiveHeartRate(baseBpm);
      setHrHistory(prev => {
        const nextHist = [...prev, baseBpm];
        if (nextHist.length > 15) nextHist.shift();
        return nextHist;
      });

      // Calorie burn formula based on HR zone
      const multiplier = simActivity === 'Peak' ? 0.35 :
                         simActivity === 'Cardio' ? 0.22 :
                         simActivity === 'Aerobic' ? 0.14 :
                         simActivity === 'Warmup' ? 0.08 : 0.02;

      setSimCalories(prev => Math.round(prev + multiplier * 4));
      if (simActivity !== 'Resting') {
        const stepsAdd = simActivity === 'Peak' ? 14 :
                         simActivity === 'Cardio' ? 10 :
                         simActivity === 'Aerobic' ? 7 : 4;
        setSimSteps(prev => prev + stepsAdd);
      }
    }, 1000);
  };

  // Auto sync simulated/live fitness values to the log form
  const handleSyncSimData = () => {
    setSteps(String(simSteps));
    setCalories(String(simCalories));
    const distanceVal = ((simSteps * 0.74) / 1000).toFixed(2);
    setWalking(distanceVal);
    if (!water) setWater('2000');
    if (!sleep) setSleep('7.5');
  };

  useEffect(() => {
    if (isSimulating) {
      startBiometricsSimulation();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [simActivity, isSimulating]);

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

  const renderSparkline = () => {
    if (hrHistory.length === 0) return null;
    const width = 150;
    const height = 30;
    const maxVal = Math.max(...hrHistory, 120);
    const minVal = Math.min(...hrHistory, 60);
    const range = maxVal - minVal || 1;
    const points = hrHistory.map((val, idx) => {
      const x = (idx / (hrHistory.length - 1)) * width;
      const y = height - ((val - minVal) / range) * height;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width={width} height={height} style={{ overflow: 'visible', opacity: 0.8 }}>
        <polyline
          fill="none"
          stroke={currentZone.color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="mb-4">
            <h3 className="section-title" style={{ margin: 0 }}>Log Daily Parameters</h3>
            {(liveHeartRate || isSimulating) && (
              <button 
                type="button"
                onClick={handleSyncSimData} 
                className="priority-toggle active"
                style={{ height: '28px', fontSize: '0.7rem', background: 'var(--accent-green)', color: '#000', cursor: 'pointer' }}
              >
                ⚡ Autofill Form from Sensor
              </button>
            )}
          </div>
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
                  step="0.01"
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
                  step="0.01"
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
                  step="0.01"
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
          <h3 className="section-title mb-4">Cloud Wearables APIs</h3>
          <div className="glass p-5 mb-6" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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

        {/* Right Side Live Biometrics Monitor */}
        <div>
          <h3 className="section-title mb-4">Live Wearable GPS</h3>
          
          <div className="glass p-5 mb-6" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Connection Status & Device Manager */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>DEVICE SOURCE</span>
                <span style={{ 
                  fontSize: '0.65rem', 
                  fontWeight: 800, 
                  color: bleConnected ? 'var(--accent-green)' : isSimulating ? 'var(--accent-orange)' : 'var(--text-tertiary)',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span style={{ 
                    display: 'inline-block', 
                    width: '6px', 
                    height: '6px', 
                    borderRadius: '50%', 
                    background: bleConnected ? 'var(--accent-green)' : isSimulating ? 'var(--accent-orange)' : 'var(--text-tertiary)'
                  }}></span>
                  {bleConnected ? 'BLE Connected' : isSimulating ? 'Simulator Mode' : 'Disconnected'}
                </span>
              </div>
              
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <button
                  type="button"
                  onClick={bleConnected ? disconnectBluetoothHR : connectBluetoothHR}
                  className="focus-btn"
                  style={{ 
                    flex: 1, 
                    height: '32px', 
                    fontSize: '0.72rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '6px',
                    background: bleConnected ? 'rgba(255, 61, 0, 0.15)' : 'rgba(0, 102, 255, 0.15)',
                    border: bleConnected ? '1px solid var(--accent-red)' : '1px solid var(--primary)',
                    color: bleConnected ? 'var(--accent-red)' : '#fff'
                  }}
                >
                  <Bluetooth size={14} />
                  {bleConnected ? 'Disconnect HR' : 'Connect BLE HR'}
                </button>

                <button
                  type="button"
                  onClick={isSimulating ? () => setIsSimulating(false) : () => setIsSimulating(true)}
                  className="priority-toggle"
                  style={{ 
                    height: '32px', 
                    fontSize: '0.72rem', 
                    padding: '0 12px',
                    background: isSimulating ? 'rgba(255, 145, 0, 0.2)' : 'rgba(255, 255, 255, 0.02)',
                    borderColor: isSimulating ? 'var(--accent-orange)' : 'var(--border-color)',
                    color: isSimulating ? 'var(--accent-orange)' : 'var(--text-secondary)'
                  }}
                >
                  {isSimulating ? 'Stop Sim' : 'Simulate'}
                </button>
              </div>

              {bleError && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.62rem', color: 'var(--accent-orange)', marginTop: '4px' }}>
                  <AlertCircle size={10} />
                  <span>{bleError.length > 40 ? bleError.substring(0, 40) + '...' : bleError}</span>
                </div>
              )}
            </div>

            {/* Heart Rate Metric Box */}
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.01)', 
              border: '1px solid var(--border-color)', 
              borderRadius: '8px', 
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>LIVE PULSE RATE</span>
                {liveHeartRate && renderSparkline()}
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', position: 'relative' }}>
                <Heart 
                  size={36} 
                  style={{ 
                    color: liveHeartRate ? 'var(--accent-red)' : 'var(--text-tertiary)'
                  }} 
                />
                <span style={{ fontSize: '3rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: liveHeartRate ? '#fff' : 'var(--text-tertiary)' }}>
                  {liveHeartRate || '--'}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700 }}>BPM</span>
              </div>

              <div style={{ 
                fontSize: '0.72rem', 
                fontWeight: 800, 
                color: currentZone.color,
                background: `rgba(255, 255, 255, 0.03)`,
                border: `1px solid ${currentZone.color}`,
                padding: '4px 10px',
                borderRadius: '12px',
                textAlign: 'center',
                width: '100%'
              }}>
                ZONE: {currentZone.name}
              </div>
            </div>

            {/* Sim Activity Profile Controls (only active when simulating) */}
            {isSimulating && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-secondary)' }}>SELECT SIMULATION TRACK</span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  {['Resting', 'Warmup', 'Aerobic', 'Cardio', 'Peak'].map(act => (
                    <button
                      key={act}
                      type="button"
                      onClick={() => setSimActivity(act)}
                      className={`priority-toggle ${simActivity === act ? 'active' : ''}`}
                      style={{ 
                        height: '24px', 
                        fontSize: '0.65rem',
                        gridColumn: act === 'Peak' ? 'span 2' : 'span 1',
                        cursor: 'pointer'
                      }}
                    >
                      {act.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Simulated Live Accumulated Parameters */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Sensor Calories Burned</span>
                <strong style={{ fontSize: '0.82rem', color: '#fff' }}>{simCalories} kcal</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Sensor Total Steps</span>
                <strong style={{ fontSize: '0.82rem', color: '#fff' }}>{simSteps} steps</strong>
              </div>
            </div>

          </div>

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
