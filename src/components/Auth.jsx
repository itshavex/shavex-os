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

  // Cloud sync settings
  const [showConfig, setShowConfig] = useState(false);
  const [dbUrl, setDbUrl] = useState('');
  const [dbKey, setDbKey] = useState('');

  useEffect(() => {
    // Populate DB settings if already customized
    const creds = supabaseAdapter.getCredentials();
    setDbUrl(creds.url || '');
    setDbKey(creds.key || '');
  }, []);

  const handleConfigSave = (e) => {
    e.preventDefault();
    const success = supabaseAdapter.setCredentials(dbUrl.trim(), dbKey.trim());
    if (success) {
      setSuccessMsg('Database credentials updated. Reloading client...');
      setErrorMsg('');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      setErrorMsg('Invalid URL or Key format.');
    }
  };

  const handleConfigClear = () => {
    supabaseAdapter.setCredentials('', '');
    setDbUrl('');
    setDbKey('');
    setSuccessMsg('Cloud credentials cleared. Running in Simulated Local Mode.');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

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
            // Trigger Context load
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

  const isCloud = supabaseAdapter.isCloudEnabled();

  return (
    <div className="auth-overlay" style={{ display: 'flex', zIndex: 120 }}>
      <div className="auth-card glass">
        <div className="sidebar-logo" style={{ justifyContent: 'center', marginBottom: '20px' }}>
          <div className="logo-icon">
            <Cpu style={{ color: '#fff', width: '20px', height: '20px' }} />
          </div>
          <div>
            <h2 className="logo-text">SHAVEX OS</h2>
            <div className="logo-sub">Choose Your Destination. Build Your System.</div>
          </div>
        </div>

        {/* Database Config Toggler */}
        <button
          onClick={() => setShowConfig(!showConfig)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--primary)',
            fontSize: '0.7rem',
            cursor: 'pointer',
            display: 'block',
            margin: '0 auto 16px auto',
            textDecoration: 'underline',
          }}
        >
          {showConfig ? 'Hide Cloud Config Fields' : 'Configure Cloud Sync Database Credentials'}
        </button>

        {showConfig && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              marginBottom: '16px',
              padding: '10px',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
            }}
          >
            <label style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Supabase URL</label>
            <input
              type="text"
              className="task-input"
              placeholder="https://your-supabase-url.supabase.co"
              style={{ padding: '6px', fontSize: '0.75rem' }}
              value={dbUrl}
              onChange={(e) => setDbUrl(e.target.value)}
            />
            <label style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Supabase Anon Key</label>
            <input
              type="text"
              className="task-input"
              placeholder="your-supabase-anon-key"
              style={{ padding: '6px', fontSize: '0.75rem' }}
              value={dbKey}
              onChange={(e) => setDbKey(e.target.value)}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '4px' }}>
              <button onClick={handleConfigSave} className="focus-btn" style={{ height: '28px', fontSize: '0.7rem' }}>
                Save & Connect
              </button>
              <button
                onClick={handleConfigClear}
                className="priority-toggle"
                style={{ height: '28px', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}
              >
                Clear / Local Mode
              </button>
            </div>
          </div>
        )}

        {/* Info alerts */}
        {!isCloud && !showConfig && (
          <p
            style={{
              fontSize: '0.68rem',
              color: 'var(--text-secondary)',
              background: 'rgba(255, 145, 0, 0.05)',
              border: '1px solid rgba(255,145,0,0.1)',
              padding: '6px 10px',
              borderRadius: '6px',
              textAlign: 'center',
              marginBottom: '16px',
            }}
          >
            Running in <strong>Simulated Guest Mode</strong> (Offline Local Caching). Config credentials above to link live databases.
          </p>
        )}

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

        {/* Input panels */}
        {mode === 'forgot' ? (
          <div>
            <h3 style={{ textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
              Reset Password
            </h3>
            <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Enter email address to recover your database sync key
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
              <button type="submit" disabled={loading} className="focus-btn" style={{ height: '42px', marginTop: '8px', width: '100%' }}>
                {loading ? 'Processing...' : 'Send Recovery Email'}
              </button>
            </form>
          </div>
        ) : (
          <div>
            <h3 style={{ textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
              {mode === 'signup' ? 'Create OS Account' : 'Log In to your OS'}
            </h3>
            <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
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
              <button type="submit" disabled={loading} className="focus-btn" style={{ height: '42px', marginTop: '8px', width: '100%' }}>
                {loading ? 'Processing...' : mode === 'signup' ? 'Sign Up' : 'Log In'}
              </button>
            </form>
          </div>
        )}

        <div className="auth-separator">
          <span>OR CONTINUE WITH</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
          <button onClick={() => handleOAuthLogin('google')} className="priority-toggle" style={{ justifyContent: 'center', height: '38px' }}>
            <Chrome style={{ width: '14px', height: '14px', marginRight: '6px' }} /> Google
          </button>
          <button onClick={() => handleOAuthLogin('github')} className="priority-toggle" style={{ justifyContent: 'center', height: '38px' }}>
            <Github style={{ width: '14px', height: '14px', marginRight: '6px' }} /> GitHub
          </button>
        </div>

        {mode === 'forgot' ? (
          <p style={{ fontSize: '0.75rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <a href="#" onClick={() => setMode('signin')} style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
              Back to Login
            </a>
          </p>
        ) : (
          <>
            <p style={{ fontSize: '0.75rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
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
              <p style={{ fontSize: '0.7rem', textAlign: 'center', marginTop: '10px' }}>
                <a href="#" onClick={() => setMode('forgot')} style={{ color: 'var(--text-tertiary)', textDecoration: 'none' }}>
                  Forgot Password?
                </a>
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
