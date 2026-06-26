import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, Play, Pause, RotateCcw, Check } from 'lucide-react';
import clsx from 'clsx';

const MOCK_PLAYLIST = [
  { id: 1, title: 'Introduction to React Hooks', completed: true },
  { id: 2, title: 'useState Deep Dive', completed: false },
  { id: 3, title: 'useEffect Mental Model', completed: false },
];

export default function FocusMode() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 mins
  const [isActive, setIsActive] = useState(false);
  const [playlist, setPlaylist] = useState(MOCK_PLAYLIST);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const toggleTask = (id: number) => {
    setPlaylist(playlist.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const completedCount = playlist.filter(p => p.completed).length;
  const progressPercent = Math.round((completedCount / playlist.length) * 100);

  return (
    <div className="min-h-screen bg-background text-primary flex flex-col p-6 md:p-12 relative overflow-hidden">
      
      {/* Subtle Background Glow */}
      <div className={clsx(
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vmin] h-[80vmin] rounded-full blur-[100px] opacity-20 transition-all duration-1000",
        isActive ? "bg-accent scale-110" : "bg-white/10 scale-90"
      )} />

      {/* Top Bar: Exit */}
      <div className="flex justify-between items-center z-10">
        <div className="flex flex-col">
          <span className="text-xs font-bold uppercase tracking-widest text-secondary">Current Focus</span>
          <span className="text-sm font-medium text-white">React Hooks Deep Dive</span>
        </div>
        <button 
          onClick={() => navigate(-1)} 
          className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5 text-secondary" />
        </button>
      </div>

      {/* Center: Massive Timer */}
      <div className="flex-1 flex flex-col items-center justify-center z-10">
        
        <motion.div 
          animate={{ scale: isActive ? 1.05 : 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          className="relative flex items-center justify-center mb-12 cursor-pointer group"
          onClick={toggleTimer}
        >
          <h1 className="text-[25vw] md:text-[12rem] font-black tracking-tighter tabular-nums leading-none text-white select-none">
            {formatTime(timeLeft)}
          </h1>
          
          <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-md rounded-full p-6 text-white">
            {isActive ? <Pause className="w-12 h-12" /> : <Play className="w-12 h-12 ml-1" />}
          </div>
        </motion.div>

        {/* Timer Controls (if needed outside massive click) */}
        <div className="flex items-center gap-4">
          <button onClick={resetTimer} className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-secondary transition-colors">
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom: Smart Playlist Tracker */}
      <div className="z-10 w-full max-w-md mx-auto bg-surface/50 backdrop-blur-xl border border-border p-6 rounded-3xl mt-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-white">Execution Playlist</h3>
          <span className="text-xs font-bold text-accent">{progressPercent}%</span>
        </div>

        <div className="flex flex-col gap-3">
          {playlist.map(item => (
            <div 
              key={item.id}
              onClick={() => toggleTask(item.id)}
              className={clsx(
                "flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-colors border",
                item.completed ? "bg-white/5 border-transparent text-secondary" : "bg-white/5 border-white/10 hover:border-white/30 text-white"
              )}
            >
              <div className={clsx(
                "w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors",
                item.completed ? "bg-success border-success text-black" : "border-secondary text-transparent"
              )}>
                <Check className="w-3.5 h-3.5" strokeWidth={3} />
              </div>
              <span className={clsx("text-sm font-medium", item.completed && "line-through opacity-50")}>
                {item.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Action: I'm Stuck */}
      <div className="mt-8 flex justify-center z-10 pb-4">
        <button className="text-xs font-semibold uppercase tracking-widest text-secondary hover:text-white transition-colors underline decoration-secondary hover:decoration-white underline-offset-4">
          [ I'm Stuck ]
        </button>
      </div>

    </div>
  );
}
