import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Target, Compass, Flame, Activity } from 'lucide-react';
import { useAppState } from '../context/StateContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { state } = useAppState();

  // Mocks for now based on state
  const targetTime = "2 Hours";
  const currentGoal = state.currentGoalName || "React Mastery";
  const currentPhase = "Advanced React Hooks";
  const streak = 12;
  const roadHealth = 94;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-8 pb-12"
    >
      {/* 1. Where am I? */}
      <motion.div variants={itemVariants} className="flex flex-col gap-2">
        <p className="text-sm font-semibold tracking-widest text-secondary uppercase flex items-center gap-2">
          <Compass className="w-4 h-4 text-accent" /> Current GPS
        </p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
          {currentGoal}
        </h1>
        <p className="text-lg text-secondary">
          Phase: <span className="text-white font-medium">{currentPhase}</span>
        </p>
      </motion.div>

      {/* 2. Massive CTA - Start Mission */}
      <motion.div variants={itemVariants} className="w-full mt-2">
        <button 
          onClick={() => navigate('/focus')}
          className="w-full relative overflow-hidden group bg-white text-black rounded-3xl p-8 flex items-center justify-between transition-transform duration-300 hover:scale-[1.02] active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.15)]"
        >
          <div className="flex flex-col items-start gap-1 z-10">
            <span className="text-sm font-bold uppercase tracking-widest text-black/60">What should I do today?</span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-1">Start Mission</h2>
          </div>
          <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center z-10 group-hover:scale-110 transition-transform duration-300">
            <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
          </div>
          
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
        </button>
      </motion.div>

      {/* 3. Metrics Row (Today's Mission, Streak, Road Health) */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        
        {/* Target Time */}
        <div className="glass p-6 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-secondary">
            <Target className="w-5 h-5 text-accent" />
            <span className="text-sm font-semibold uppercase tracking-wider">Today's Target</span>
          </div>
          <p className="text-3xl font-bold text-white">{targetTime}</p>
        </div>

        {/* Streak */}
        <div className="glass p-6 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-secondary">
            <Flame className="w-5 h-5 text-warning" />
            <span className="text-sm font-semibold uppercase tracking-wider">Momentum</span>
          </div>
          <p className="text-3xl font-bold text-white flex items-baseline gap-2">
            {streak} <span className="text-base font-medium text-secondary">Days</span>
          </p>
        </div>

        {/* Road Health */}
        <div className="glass p-6 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-secondary">
            <Activity className="w-5 h-5 text-success" />
            <span className="text-sm font-semibold uppercase tracking-wider">Road Health</span>
          </div>
          <div className="flex flex-col gap-2 mt-1">
            <div className="flex justify-between items-end">
              <span className="text-3xl font-bold text-white">{roadHealth}%</span>
              <span className="text-sm font-medium text-success mb-1">Excellent</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-success rounded-full" style={{ width: `${roadHealth}%` }} />
            </div>
          </div>
        </div>

      </motion.div>

    </motion.div>
  );
}
