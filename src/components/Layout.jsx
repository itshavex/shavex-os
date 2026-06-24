import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';
import ProfilePage from './ProfilePage.jsx';

export default function Layout() {
  const [profileActive, setProfileActive] = useState(false);

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar onOpenProfile={() => setProfileActive(true)} />

      {/* Main Content Area */}
      <main className="main-content">
        {/* Shared Progress Header */}
        <Header />

        {/* Beta Banner */}
        <div style={{
          margin: '0 40px 20px 40px',
          padding: '12px 20px',
          background: 'linear-gradient(90deg, rgba(0, 102, 255, 0.06) 0%, rgba(0, 102, 255, 0.01) 100%)',
          border: '1px solid rgba(0, 102, 255, 0.12)',
          borderRadius: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)' }}></span>
              ShaVex OS Beta
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Your progress is currently stored on this device. Cloud Sync is coming soon.
            </div>
          </div>
          <span style={{
            fontSize: '0.62rem',
            background: 'rgba(0, 102, 255, 0.1)',
            color: 'var(--primary-hover)',
            padding: '2px 8px',
            borderRadius: '4px',
            textTransform: 'uppercase',
            fontWeight: 700,
            letterSpacing: '0.5px'
          }}>
            Local Mode
          </span>
        </div>

        {/* Dynamic Nested Active Panel */}
        <Outlet />

        {/* Premium footer branding */}
        <footer style={{ marginTop: 'auto', padding: '24px 40px', borderTop: '1px solid var(--border-color)', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'rgba(3,3,4,0.2)' }}>
          <div>Built with ❤️ by <span style={{ color: '#fff', fontWeight: 600 }}>ShaVex</span></div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Build. Learn. Evolve.</div>
        </footer>
      </main>

      {/* Fullscreen User Profile Slider Drawer */}
      <ProfilePage active={profileActive} onClose={() => setProfileActive(false)} />
    </div>
  );
}
