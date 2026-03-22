import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const res = await fetch('http://localhost:8000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await res.json();
      login(data.access_token);
      navigate('/');
    } catch {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cg-login-page">
      <div className="cg-login-atmo" />

      <div className="cg-login-card">
        <div className="cg-login-header">
          <div className="cg-login-lock-wrap">
            <Lock className="h-7 w-7" />
          </div>
          <div>
            <h1>Welcome back</h1>
            <p>Sign in to continue to your Obsidian RAG workspace.</p>
          </div>
        </div>

        <form className="cg-login-form" onSubmit={handleLogin}>
          <div className="cg-login-body">
            {error && (
              <div className="cg-login-error" role="alert">
                {error}
              </div>
            )}

            <div className="cg-login-field">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                autoComplete="username"
                className="cg-login-input"
                required
              />
            </div>

            <div className="cg-login-field">
              <div className="cg-login-field-head">
                <label htmlFor="password">Password</label>
                <span>Use your local account</span>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="cg-login-input"
                required
              />
            </div>
          </div>

          <div className="cg-login-footer">
            <button type="submit" disabled={loading || !username || !password} className="cg-login-submit">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
            <p>Authentication is required before accessing chat and settings.</p>
          </div>
        </form>
      </div>
    </div>
  );
};
