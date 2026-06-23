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
