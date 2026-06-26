import React from 'react';
import { Vault, Search, Plus } from 'lucide-react';

export default function KnowledgeVault() {
  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Vault className="w-8 h-8 text-accent" /> Knowledge Vault
          </h1>
          <p className="text-secondary mt-2">Your curated, intelligent second brain.</p>
        </div>
        <button className="bg-white text-black px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-white/90 transition-colors">
          <Plus className="w-4 h-4" /> Add Source
        </button>
      </div>

      <div className="relative mb-8">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-secondary" />
        <input 
          type="text" 
          placeholder="Search insights, formulas, links..."
          className="w-full bg-surface border border-border rounded-2xl py-4 pl-12 pr-4 text-white placeholder-secondary focus:outline-none focus:border-accent transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Placeholder cards */}
        <div className="glass p-6 group cursor-pointer">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-red-500/10 text-red-500 rounded-md">YouTube</span>
            <span className="text-xs text-secondary ml-auto">Added Today</span>
          </div>
          <h3 className="text-lg font-bold text-white group-hover:text-accent transition-colors">Advanced React Patterns</h3>
          <p className="text-sm text-secondary mt-2 line-clamp-2">Great explanation of compound components and render props...</p>
        </div>

        <div className="glass p-6 group cursor-pointer">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-blue-500/10 text-blue-500 rounded-md">Article</span>
            <span className="text-xs text-secondary ml-auto">2 Days Ago</span>
          </div>
          <h3 className="text-lg font-bold text-white group-hover:text-accent transition-colors">A Complete Guide to useEffect</h3>
          <p className="text-sm text-secondary mt-2 line-clamp-2">The mental model for thinking in hooks and effect dependencies...</p>
        </div>
      </div>
    </div>
  );
}
