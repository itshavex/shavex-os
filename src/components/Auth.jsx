import React, { useState, useEffect } from 'react';
import { useAppState } from '../context/StateContext';
import { supabaseAdapter } from '../supabase';
import { Cpu, Chrome, Github, AlertCircle } from 'lucide-react';

export default function Auth() {
  const { handleUserLogin } = useAppState();

  const [mode, setMode] = useState('signin'); // signin, signup, forgot
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const [showForms, setShowForms] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (mode === 'forgot') {
        const { success, error } = await supabaseAdapter.resetPassword(email.trim());
        if (error) {
          setErrorMsg(error);
        } else {
          setSuccessMsg('Reset links sent to email address if registered.');
        }
      } else if (mode === 'signup') {
        const { user, error } = await supabaseAdapter.signUp(email.trim(), password, name.trim());
        if (error) {
          setErrorMsg(error);
        } else if (user) {
          setSuccessMsg('Account created successfully! Logging in...');
          setTimeout(async () => {
            await handleUserLogin(user);
          }, 1000);
        }
      } else {
        // Sign In
        const { user, error } = await supabaseAdapter.signIn(email.trim(), password);
        if (error) {
          setErrorMsg(error);
        } else if (user) {
          setSuccessMsg('Logged in successfully! Loading environment...');
          await handleUserLogin(user);
        }
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider) => {
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await supabaseAdapter.signInWithOAuth(provider);
      if (res.user) {
        setSuccessMsg(`Authenticated via ${provider}!`);
        await handleUserLogin(res.user);
      } else if (res.error) {
        setErrorMsg(res.error);
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay" style={{ display: 'flex', zIndex: 120 }}>
      <div className="auth-card glass" style={{ maxWidth: '480px' }}>
        <div className="sidebar-logo" style={{ justifyContent: 'center', marginBottom: '20px' }}>
          <div className="logo-icon">
            <Cpu style={{ color: '#fff', width: '20px', height: '20px' }} />
          </div>
          <div>
            <h2 className="logo-text">SHAVEX OS</h2>
            <div className="logo-sub">Choose Your Destination. Build Your System.</div>
          </div>
        </div>

        {/* Landing Value Proposition Previews */}
        <div className="landing-preview-grid" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          margin: '24px 0',
          textAlign: 'left'
        }}>
          <div className="glass p-3" style={{ border: '1px solid var(--border-color)', borderRadius: '8px', background: 'rgba(255,255,255,0.01)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: 'bold', color: 'var(--primary)' }}>
              🎯 Destination Goals
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '1.4' }}>
              Select target roadmaps (AI Engineer, Full Stack, Data Science) or map custom growth timelines.
            </div>
          </div>
          <div className="glass p-3" style={{ border: '1px solid var(--border-color)', borderRadius: '8px', background: 'rgba(255,255,255,0.01)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: 'bold', color: 'var(--accent-orange)' }}>
              🚀 Next Move Engine
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '1.4' }}>
              No more guessing what is next. Let the engine calculate the optimal learning checkpoint dynamically.
            </div>
          </div>
          <div className="glass p-3" style={{ border: '1px solid var(--border-color)', borderRadius: '8px', background: 'rgba(255,255,255,0.01)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: 'bold', color: 'var(--accent-green)' }}>
              📝 Daily Time-Budget Missions
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '1.4' }}>
              Select available minutes (15m, 30m, 1h, 2h) to generate tailored daily focus tasks immediately.
            </div>
          </div>
        </div>

        {/* Primary Guest Mode Entrance */}
        <button 
          onClick={() => handleUserLogin({ id: 'guest_user', email: 'guest@shavex.os', user_metadata: { full_name: 'Guest Explorer' } })}
          className="focus-btn" 
          style={{ width: '100%', height: '44px', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'var(--primary)', marginBottom: '12px' }}
        >
          Explore ShaVex OS Beta (Guest Mode)
        </button>

        {/* Technical credentials collapsible toggle */}
        <button
          onClick={() => setShowForms(!showForms)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-tertiary)',
            fontSize: '0.72rem',
            cursor: 'pointer',
            display: 'block',
            margin: '16px auto 0 auto',
            textDecoration: 'underline',
          }}
        >
          {showForms ? 'Hide Custom Login / Signup' : 'Connect Developer Sync Account / Social Log In'}
        </button>

        {showForms && (
          <div className="animate-fade-in" style={{ marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
            {errorMsg && (
              <div style={{ display: 'flex', gap: '6px', color: 'var(--accent-orange)', fontSize: '0.75rem', marginBottom: '16px', justifyContent: 'center' }}>
                <AlertCircle size={14} className="mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div style={{ color: 'var(--accent-green)', fontSize: '0.75rem', marginBottom: '16px', textAlign: 'center' }}>
                {successMsg}
              </div>
            )}

            {mode === 'forgot' ? (
              <div>
                <h3 style={{ textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>
                  Reset Password
                </h3>
                <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  Enter email to recover database sync session
                </p>
                <form onSubmit={handleSubmit} className="internship-notes-form">
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      className="task-input"
                      placeholder="shashwat@shavex.ai"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" disabled={loading} className="focus-btn" style={{ height: '38px', marginTop: '8px', width: '100%' }}>
                    {loading ? 'Processing...' : 'Send Recovery Email'}
                  </button>
                </form>
              </div>
            ) : (
              <div>
                <h3 style={{ textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>
                  {mode === 'signup' ? 'Create OS Account' : 'Log In to your OS'}
                </h3>
                <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  {mode === 'signup' ? 'Enter parameters to register credentials' : 'Enter your credentials below to sync your workspace'}
                </p>

                <form onSubmit={handleSubmit} className="internship-notes-form">
                  {mode === 'signup' && (
                    <div className="form-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        className="task-input"
                        placeholder="e.g. Shashwat Tiwari"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                  )}
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      className="task-input"
                      placeholder="shashwat@shavex.ai"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input
                      type="password"
                      className="task-input"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" disabled={loading} className="focus-btn" style={{ height: '38px', marginTop: '8px', width: '100%' }}>
                    {loading ? 'Processing...' : mode === 'signup' ? 'Sign Up' : 'Log In'}
                  </button>
                </form>
              </div>
            )}

            <div className="auth-separator">
              <span>OR CONTINUE WITH</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <button onClick={() => handleOAuthLogin('google')} className="priority-toggle" style={{ justifyContent: 'center', height: '36px' }}>
                <Chrome style={{ width: '12px', height: '12px', marginRight: '6px' }} /> Google
              </button>
              <button onClick={() => handleOAuthLogin('github')} className="priority-toggle" style={{ justifyContent: 'center', height: '36px' }}>
                <Github style={{ width: '12px', height: '12px', marginRight: '6px' }} /> GitHub
              </button>
            </div>

            {mode === 'forgot' ? (
              <p style={{ fontSize: '0.72rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <a href="#" onClick={() => setMode('signin')} style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
                  Back to Login
                </a>
              </p>
            ) : (
              <>
                <p style={{ fontSize: '0.72rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  <span>{mode === 'signup' ? 'Already have an account?' : 'New to ShaVex OS?'}</span>{' '}
                  <a
                    href="#"
                    onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}
                    style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}
                  >
                    {mode === 'signup' ? 'Log In' : 'Create Account'}
                  </a>
                </p>
                {mode === 'signin' && (
                  <p style={{ fontSize: '0.68rem', textAlign: 'center', marginTop: '10px' }}>
                    <a href="#" onClick={() => setMode('forgot')} style={{ color: 'var(--text-tertiary)', textDecoration: 'none' }}>
                      Forgot Password?
                    </a>
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
