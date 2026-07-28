import React, { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';
import { useTheme } from '../hooks/useTheme';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login } = useAuth();
  const { push } = useToast();
  const { theme, toggle } = useTheme();

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login({ username, password });
      navigate('/home');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login failed';

      setError(message);

      push({
        variant: 'error',
        title: 'Login failed',
        description: message,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <button
        onClick={toggle}
        className="absolute top-6 right-6 grid h-10 w-10 place-items-center rounded-full border border-border bg-card hover:bg-accent transition-colors"
        aria-label="Alterar tema"
      >
        {theme === 'dark' ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </button>

      <div
        className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-xl"
        data-testid="login-form"
      >
        <h2 className="mb-6 text-center text-3xl font-bold text-foreground">
          Login
        </h2>

        {error && (
          <div
            className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-500"
            data-testid="error-message"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-2 block text-sm text-foreground">
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-primary"
              required
              data-testid="username-input"
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm text-foreground">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-primary"
              required
              data-testid="password-input"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-primary py-2 font-medium text-primary-foreground transition hover:opacity-90"
            data-testid="login-button"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};