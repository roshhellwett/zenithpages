import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';

const navItems = [
  { href: '#tools', label: 'Tools' },
  { href: '#workflow', label: 'Workflow' },
  { href: '#stats', label: 'Stats' },
];

const Navbar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => (
  <motion.nav
    initial={{ y: -18, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    className="fixed inset-x-0 top-0 z-50"
  >
    <div className="absolute inset-0 border-b border-[var(--color-border)]/60 bg-[var(--color-cream)]/85 backdrop-blur-2xl supports-[backdrop-filter]:bg-[var(--color-cream)]/75" />
    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--color-amber)]/20 to-transparent" />
    <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <a href="#" className="flex items-center gap-2.5 select-none" aria-label="Zenith home">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-node-bg)] text-[var(--color-amber)] font-bold text-sm shadow-sm">Z</span>
        <span className="text-sm font-bold text-[var(--color-text-primary)]">Zenith</span>
      </a>

      <div className="hidden items-center gap-0.5 md:flex">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="relative rounded-lg px-3.5 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)] after:absolute after:inset-x-3 after:bottom-1 after:h-0.5 after:rounded-full after:bg-[var(--color-amber)] after:opacity-0 after:transition-opacity hover:after:opacity-100"
          >
            {item.label}
          </a>
        ))}
      </div>

      <div className="hidden items-center gap-2 md:flex">
        <a
          href="https://github.com/roshhellwett"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]/70 backdrop-blur-md px-4 py-2 text-sm font-semibold text-[var(--color-text-primary)] shadow-sm transition hover:bg-[var(--color-sidebar-hover)]/80 active:scale-[0.98]"
        >
          <FaGithub size={16} />
          GitHub
        </a>
      </div>

      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="icon-button md:hidden"
        aria-label="Toggle menu"
        type="button"
      >
        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
    </div>

    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden overflow-hidden border-b border-[var(--color-border)]/60 bg-[var(--color-cream)]/92 backdrop-blur-2xl"
        >
          <div className="mx-auto max-w-7xl px-4 py-3 space-y-1">
            {[...navItems, { href: 'https://github.com/roshhellwett', label: 'GitHub', external: true }].map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noreferrer' : undefined}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[var(--color-text-secondary)] transition hover:bg-[var(--color-sidebar-hover)]"
              >
                {item.label}
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.nav>
);

Navbar.propTypes = {
  isMobileMenuOpen: PropTypes.bool.isRequired,
  setIsMobileMenuOpen: PropTypes.func.isRequired,
};

export default Navbar;
