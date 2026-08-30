import { useState, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import './Login.css';

interface LocationState {
  from?: {
    pathname: string;
  };
}

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setError(null);
    setLoading(true);

    try {
      await login(email, password);

      const state = location.state as LocationState | null;
      const redirectTo = state?.from?.pathname || '/';

      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Gagal masuk. Periksa kembali email dan password kamu.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-screen">
      <main className="login-main">
        <div className="login-card">
          <header className="login-card__header">
    

            <h1 className="login-card__title">
              Admin Panel
            </h1>

            <p className="login-card__subtitle">
              Gunakan email dan password yang terdaftar
              untuk membuka dashboard.
            </p>
          </header>

          <form
            className="login-form"
            onSubmit={handleSubmit}
            noValidate
          >
            <label className="login-field" htmlFor="email">
              <span className="login-field__label">
                Email
              </span>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="nama@perusahaan.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </label>

            <label className="login-field" htmlFor="password">
              <span className="login-field__label">
                Password
              </span>

              <div className="login-field__password">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />

                <button
                  type="button"
                  className="login-field__toggle"
                  onClick={() =>
                    setShowPassword((value) => !value)
                  }
                  aria-label={
                    showPassword
                      ? 'Sembunyikan password'
                      : 'Tampilkan password'
                  }
                >
                  {showPassword ? 'Sembunyikan' : 'Lihat'}
                </button>
              </div>
            </label>

            {error && (
              <div className="login-error" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              <span className="login-submit__label">
                {loading ? 'Memeriksa…' : 'Masuk'}
              </span>

            </button>
          </form>

          <p className="login-card__footnote">
            Lupa password? Hubungi admin sistem kamu.
          </p>
        </div>
      </main>
    </div>
  );
}