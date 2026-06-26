import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Youtube, Edit2, CheckCircle2, Circle } from 'lucide-react';
import { useAppState } from '../context/StateContext';

const MOCK_TIMELINE = [
  { id: 1, title: 'JavaScript Fundamentals', status: 'completed' },
  { id: 2, title: 'React Hooks Deep Dive', status: 'active', resource: { type: 'Playlist', title: 'Advanced React Hooks Tutorial (2025)', url: '#' } },
  { id: 3, title: 'State Management (Redux/Zustand)', status: 'locked' },
  { id: 4, title: 'Performance Optimization', status: 'locked' },
];

export default function Roadmaps() {
  const [nodes, setNodes] = useState(MOCK_TIMELINE);

  return (
    <div className="max-w-2xl mx-auto pb-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-white">Roadmap Engine</h1>
        <p className="text-secondary mt-2">Your personalized path to mastery.</p>
      </div>

      <div className="relative pl-6">
        {/* Vertical Line */}
        <div className="absolute left-[11px] top-4 bottom-8 w-[2px] bg-white/10" />

        <div className="flex flex-col gap-8">
          {nodes.map((node, idx) => (
            <div key={node.id} className="relative">
              
              {/* Node Indicator */}
              <div className="absolute -left-6 top-1">
                {node.status === 'completed' ? (
                  <CheckCircle2 className="w-6 h-6 text-success bg-background rounded-full" />
                ) : node.status === 'active' ? (
                  <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center border-4 border-background">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                ) : (
                  <Circle className="w-6 h-6 text-white/20 bg-background rounded-full" />
                )}
              </div>

              {/* Node Content */}
              <div className={`pl-6 ${node.status === 'locked' ? 'opacity-50' : 'opacity-100'}`}>
                <h3 className={`text-lg font-semibold ${node.status === 'active' ? 'text-white' : 'text-secondary'}`}>
                  {node.title}
                </h3>
                
                {node.status === 'active' && node.resource && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 glass p-5 flex flex-col gap-4 border-accent/30 bg-accent/5"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-accent" />
                        <span className="text-xs font-bold uppercase tracking-widest text-accent">AI Recommended Resource</span>
                      </div>
                      <button className="text-[10px] uppercase font-bold tracking-wider text-secondary hover:text-white flex items-center gap-1 transition-colors">
                        <Edit2 className="w-3 h-3" /> Replace
                      </button>
                    </div>
                    
                    <a href={node.resource.url} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 group">
                      <div className="w-10 h-10 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center flex-shrink-0">
                        <Youtube className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-white group-hover:text-accent transition-colors line-clamp-1">{node.resource.title}</span>
                        <span className="text-xs text-secondary">{node.resource.type}</span>
                      </div>
                    </a>
                  </motion.div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
