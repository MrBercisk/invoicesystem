import { useEffect, useState } from 'react';
import { Receipt } from 'lucide-react';

interface WelcomeScreenProps {
  onFinish: () => void;
}

export function WelcomeScreen({ onFinish }: WelcomeScreenProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setVisible(false);
      window.setTimeout(onFinish, 300);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      className={`dk-welcome fixed inset-0 z-[9999] flex items-center justify-center transition-all duration-300 ${
        visible ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.03]'
      }`}
      style={{ background: 'var(--dk-bg)' }}
    >
      <style>{`
        .dk-welcome {
          --dk-bg: #0b0a10;
          --dk-red: #ff4433;
          --dk-red-deep: #b0221a;
          --dk-cream: #f5ece0;
          --dk-fg: #faf9f7;
          --dk-muted: #86828f;
          background-image:
            radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 18px 18px;
        }

        @keyframes dk-stamp-in {
          0%   { transform: scale(1.6) rotate(-10deg); opacity: 0; filter: blur(6px); }
          55%  { transform: scale(0.94) rotate(2deg); opacity: 1; filter: blur(0); }
          75%  { transform: scale(1.04) rotate(-1deg); }
          100% { transform: scale(1) rotate(-3deg); }
        }
        @keyframes dk-ring {
          0%   { transform: scale(0.6); opacity: 0.55; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        @keyframes dk-word-up {
          0%   { transform: translateY(8px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes dk-bar-fill {
          0%   { width: 0%; }
          100% { width: 100%; }
        }

        .dk-stamp { animation: dk-stamp-in 700ms cubic-bezier(.2,1.4,.4,1) both; }
        .dk-ring { animation: dk-ring 900ms ease-out 120ms both; }
        .dk-word {
          display: inline-block;
          opacity: 0;
          animation: dk-word-up 420ms ease-out forwards;
        }
        .dk-word:nth-child(1) { animation-delay: 560ms; }
        .dk-word:nth-child(2) { animation-delay: 660ms; }
        .dk-word:nth-child(3) { animation-delay: 760ms; }
        .dk-bar-fill { animation: dk-bar-fill 3000ms linear forwards; }

        @media (prefers-reduced-motion: reduce) {
          .dk-stamp, .dk-ring, .dk-word, .dk-bar-fill { animation: none !important; opacity: 1 !important; transform: none !important; width: 100% !important; }
        }
      `}</style>

      <div className="flex flex-col items-center px-6">
        {/* Stamp mark */}
        <div className="relative flex items-center justify-center">
          <span
            className="dk-ring absolute h-16 w-16 rounded-2xl"
            style={{ border: '2px solid var(--dk-red)' }}
          />
          <div
            className="dk-stamp relative flex h-16 w-16 items-center justify-center rounded-2xl shadow-xl"
            style={{
              background: 'linear-gradient(145deg, var(--dk-red), var(--dk-red-deep))',
              boxShadow: '0 10px 30px -8px rgba(255,68,51,0.55)',
            }}
          >
            <Receipt size={28} strokeWidth={2.4} className="text-white" />
          </div>
        </div>

        {/* Wordmark */}
        <div
          className="mt-5 text-3xl font-black tracking-tight"
          style={{ color: 'var(--dk-fg)', letterSpacing: '-0.02em' }}
        >
          Do
          <span style={{ color: 'var(--dk-red)' }}>Kuy</span>
        </div>

        {/* Torn-receipt tagline */}
        <div
          className="mt-4 px-4 py-2"
          style={{
            background: 'rgba(255,255,255,0.04)',
            borderTop: '1.5px dashed rgba(255,255,255,0.16)',
          }}
        >
          <p className="text-xs font-semibold" style={{ color: 'var(--dk-muted)' }}>
            <span className="dk-word">Bikin.</span>{' '}
            <span className="dk-word">Kirim.</span>{' '}
            <span className="dk-word">Beres.</span>
          </p>
        </div>

        {/* Progress line */}
        <div
          className="mt-6 h-[3px] w-28 overflow-hidden rounded-full"
          style={{ background: 'rgba(255,255,255,0.08)' }}
        >
          <div
            className="dk-bar-fill h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, var(--dk-red-deep), var(--dk-red))' }}
          />
        </div>
      </div>
    </div>
  );
}