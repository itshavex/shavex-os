import React from 'react';
import { Link } from 'react-router-dom';

export function Error404() {
  return (
    <div className="auth-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100vw', margin: 0, backgroundColor: '#030304', fontFamily: 'var(--font-sans)' }}>
      <div className="error-card glass" style={{ textAlign: 'center', maxWidth: '450px', padding: '40px', borderRadius: '16px', boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 30px rgba(0, 102, 255, 0.15)' }}>
        <div className="error-code" style={{ fontFamily: 'var(--font-display)', fontSize: '5rem', fontWeight: 800, background: 'linear-gradient(135deg, #FFF, #0066FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '10px' }}>404</div>
        <h2 className="error-title" style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>Module Not Found</h2>
        <p className="error-desc" style={{ fontSize: '0.85rem', color: '#8E929E', lineHeight: '1.6', marginBottom: '30px' }}>The requested Journey Map phase, mission cockpit, or catalog page has been relocated or is currently locked in this workspace configuration.</p>
        <Link to="/dashboard" className="home-btn" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#0066FF', color: '#fff', textDecoration: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.2s ease', border: '1px solid rgba(255,255,255,0.1)' }}>Return to Mission Control</Link>
      </div>
    </div>
  );
}

export class Error500 extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="auth-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100vw', margin: 0, backgroundColor: '#030304', fontFamily: 'var(--font-sans)' }}>
          <div className="error-card glass" style={{ textAlign: 'center', maxWidth: '450px', padding: '40px', borderRadius: '16px', boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 30px rgba(255, 61, 0, 0.15)' }}>
            <div className="error-code" style={{ fontFamily: 'var(--font-display)', fontSize: '5rem', fontWeight: 800, background: 'linear-gradient(135deg, #FFF, #FF3D00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '10px' }}>500</div>
            <h2 className="error-title" style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>System Crash</h2>
            <p className="error-desc" style={{ fontSize: '0.85rem', color: '#8E929E', lineHeight: '1.6', marginBottom: '30px' }}>ShaVex OS has encountered an unexpected runtime compilation error or synchronization failure.</p>
            <button onClick={() => window.location.reload()} className="home-btn" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255, 61, 0, 0.15)', border: '1px solid rgba(255, 61, 0, 0.3)', color: '#FF3D00', textDecoration: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.2s ease', cursor: 'pointer' }}>Reload OS Interface</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export function LoadingSkeleton() {
  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      <div className="glass" style={{ height: '80px', borderRadius: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.02)', animation: 'pulse 1.8s infinite' }} />
      <div className="grid-2-1" style={{ gap: '20px' }}>
        <div className="glass" style={{ height: '280px', borderRadius: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.02)', animation: 'pulse 1.8s infinite' }} />
        <div className="glass" style={{ height: '280px', borderRadius: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.02)', animation: 'pulse 1.8s infinite' }} />
      </div>
    </div>
  );
}

export function OfflineFallback() {
  return (
    <div className="glass p-3 mb-5" style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'linear-gradient(to right, rgba(255, 145, 0, 0.04), transparent)', borderLeft: '3.5px solid var(--accent-orange)', animation: 'fade-in 0.5s' }}>
      <span style={{ fontSize: '1.1rem' }}>📡</span>
      <div>
        <h5 style={{ margin: 0, fontSize: '0.8rem', color: '#fff', fontWeight: 700 }}>Executing in Offline Fallback Mode</h5>
        <p style={{ margin: '2px 0 0 0', fontSize: '0.68rem', color: 'var(--text-secondary)' }}>No network synchronization detected. OS caching all milestones locally until server handshake.</p>
      </div>
    </div>
  );
}
