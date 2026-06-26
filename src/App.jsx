import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

import Navbar from './layout/Navbar';
import HomePage from './pages/HomePage';
import Footer from './layout/Footer';
import AIChatWidget from './layout/AIChatWidget';
import KeyboardShortcuts from './components/KeyboardShortcuts';

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [apiError, setApiError] = useState(null);

  return (
    <div className="relative min-h-screen overflow-hidden text-[var(--color-text-primary)]">
      <div
        className="fixed inset-0 bg-[var(--color-cream)] bg-cover bg-center bg-no-repeat hidden lg:block"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}desktop_background.png)`, filter: 'contrast(1.15) saturate(1.05)' }}
      />
      <div
        className="fixed inset-0 bg-[var(--color-cream)] bg-cover bg-center bg-no-repeat lg:hidden"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}mobile_background.png)`, filter: 'contrast(1.15) saturate(1.05)' }}
      />
      <div className="fixed inset-0 pointer-events-none opacity-[0.5] mix-blend-multiply"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: '256px 256px', imageRendering: 'crisp-edges' }}
      />
      <KeyboardShortcuts />
      <Navbar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      <HomePage setApiError={setApiError} />

      <Footer />
      <AIChatWidget />

      <AnimatePresence>
        {apiError && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="fixed inset-x-0 top-20 z-50 flex justify-center px-4"
          >
            <div className="flex w-full max-w-xl items-start gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/90 px-4 py-3 text-sm text-[var(--color-text-primary)] shadow-lg backdrop-blur-xl">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[var(--color-amber)]" />
              <div className="flex-1">
                <p>{apiError.message}</p>
                {apiError.canRetry && (
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-1 font-semibold text-[var(--color-amber)] underline-offset-4 hover:underline"
                    type="button"
                  >
                    Refresh
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
