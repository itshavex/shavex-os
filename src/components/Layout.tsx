import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, Vault, User } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/roadmaps', label: 'Roadmap', icon: Map },
  { path: '/vault', label: 'Vault', icon: Vault },
  { path: '/profile', label: 'Profile', icon: User },
];

export default function Layout() {
  return (
    <div className="flex h-screen bg-background text-primary overflow-hidden">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-surface p-6">
        <div className="mb-10">
          <h1 className="text-xl font-bold tracking-wider uppercase text-white">ShaVex OS</h1>
          <p className="text-xs text-secondary mt-1 tracking-widest uppercase">V1 Public Beta</p>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive 
                    ? "bg-white/10 text-white font-medium" 
                    : "text-secondary hover:bg-white/5 hover:text-white"
                )
              }
            >
              <item.icon className="w-5 h-5 opacity-70 group-hover:opacity-100" />
              <span className="text-sm">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-y-auto pb-24 md:pb-0">
        <div className="max-w-5xl mx-auto p-6 md:p-10 min-h-full">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-surface/80 backdrop-blur-xl border-t border-border z-50 flex justify-around items-center px-4 pb-safe">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                "flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all duration-200",
                isActive 
                  ? "text-white scale-110" 
                  : "text-secondary hover:text-white"
              )
            }
          >
            <item.icon className={clsx("w-6 h-6 mb-1", "opacity-80")} />
            <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
          </NavLink>
        ))}
      </nav>

    </div>
  );
}
