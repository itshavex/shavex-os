import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppState } from '../context/StateContext.jsx';
import { 
  LayoutDashboard, 
  Map, 
  Compass, 
  Library, 
  PenTool, 
  Dumbbell, 
  Milestone, 
  Activity, 
  Cpu, 
  LogOut,
  Award
} from 'lucide-react';

export default function Sidebar({ onOpenProfile }) {
  const { state, handleUserLogout } = useAppState();
  const user = state.auth.user;

  const fullName = user?.user_metadata?.full_name || user?.name || state.profile.name || "Shashwat Tiwari";
  const email = user?.email || "shashwat@shavex.ai";
  const initials = fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const navItems = [
    { to: "/dashboard", label: "Mission Control", icon: LayoutDashboard },
    { to: "/roadmaps", label: "Journey Maps", icon: Map },
    { to: "/focus", label: "Focus Mode", icon: Compass },
    { to: "/vault", label: "Knowledge Vault", icon: Library },
    { to: "/reflections", label: "Reflection Log", icon: PenTool },
    { to: "/fitness", label: "Fitness GPS", icon: Dumbbell },
    { to: "/timeline", label: "Life Timeline", icon: Milestone },
    { to: "/insights", label: "Growth Insights", icon: Activity },
    { to: "/achievements", label: "Achievements", icon: Award }
  ];

  return (
    <aside className="sidebar">
      {/* Brand logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <Cpu size={20} color="#fff" />
        </div>
        <div>
          <h2 className="logo-text">SHAVEX OS</h2>
          <div className="logo-sub">Choose Your Destination. Build Your System.</div>
        </div>
      </div>
      
      {/* Nav List */}
      <nav className="sidebar-nav">
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <NavLink 
              key={item.to}
              to={item.to} 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
      
      {/* User footer badge card */}
      <div 
        className="sidebar-footer" 
        id="sidebar-profile-card" 
        onClick={onOpenProfile}
        style={{ cursor: 'pointer', border: '1px solid transparent', borderRadius: '8px', transition: 'var(--transition)' }}
      >
        {user && (
          <div id="sidebar-user-loggedin" style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justify: 'center', fontWeight: '700', fontSize: '0.8rem', border: '1px solid rgba(255,255,255,0.1)' }}>
              {initials}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flexGrow: 1 }}>
              <span className="owner-name" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{fullName}</span>
              <span className="owner-title" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{email}</span>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleUserLogout();
              }}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', marginLeft: 'auto', padding: '4px' }}
            >
              <LogOut size={14} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
