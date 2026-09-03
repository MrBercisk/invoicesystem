import { useState, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Receipt,
} from 'lucide-react';

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

      sessionStorage.setItem('dokuy_show_welcome', 'true');

      const state = location.state as LocationState | null;
      const redirectTo = state?.from?.pathname || '/';

      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Gagal masuk. Coba cek lagi email dan password kamu.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-screen">
      {/* Dekorasi */}
      <div className="login-decoration login-decoration--one" />
      <div className="login-decoration login-decoration--two" />
      <div className="login-decoration login-decoration--three" />
      <div className="login-decoration login-decoration--four" />
      <div className="login-decoration login-decoration--five" />

      <main className="login-main">
        <div className="login-card">

          {/* Logo */}
          <div className="login-logo">
            <div className="login-logo__ring" />
            <div className="login-logo__icon">
              <Receipt size={20} strokeWidth={2.4} />
            </div>

            <span className="login-logo__text">
              Do<span>Kuy</span>
            </span>
          </div>

          {/* Header */}
          <div className="login-header">

            <h1>GasKuy 👋</h1>

            <p>
              Buka DoKuy,
              <br className="login-header__desktop" />
              beresin dokumen, lanjut kerja.
            </p>
          </div>

          {/* Sobekan pemisah */}
          <div className="login-tear" aria-hidden="true" />

          {/* Form */}
          <form
            className="login-form"
            onSubmit={handleSubmit}
            noValidate
          >
            {/* Email */}
            <label className="login-field" htmlFor="email">
              <span className="login-field__label">
                Email
              </span>

              <div className="login-input">
                <Mail size={17} />

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="kamu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </label>

            {/* Password */}
            <label className="login-field" htmlFor="password">
              <span className="login-field__label">
                Password
              </span>

              <div className="login-input">
                <Lock size={17} />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Masukkan password kamu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />

                <button
                  type="button"
                  className="login-input__toggle"
                  onClick={() =>
                    setShowPassword((value) => !value)
                  }
                  aria-label={
                    showPassword
                      ? 'Sembunyikan password'
                      : 'Tampilkan password'
                  }
                >
                  {showPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>
            </label>

            {/* Error */}
            {error && (
              <div className="login-error" role="alert">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading ? 'Lagi masuk...' : 'Masuk & lanjut'}
            </button>
          </form>

        </div>

        <p className="login-copyright">
          © {new Date().getFullYear()} DoKuy
          <span className="login-copyright__by">
            Dibuat oleh Moracraft — BeEs Software Engineer
          </span>
        </p>
      </main>
    </div>
  );
}