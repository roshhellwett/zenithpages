import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Package, Search, Terminal, X } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';

const commands = [
  { id: 'workflow', name: 'Workflow', icon: Terminal, action: () => document.getElementById('workflow')?.scrollIntoView({ behavior: 'smooth' }) },
  { id: 'tools', name: 'Tool library', icon: Package, action: () => document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' }) },
  { id: 'stats', name: 'Vertices', icon: Home, action: () => document.getElementById('stats')?.scrollIntoView({ behavior: 'smooth' }) },
  { id: 'github', name: 'GitHub profile', icon: FaGithub, action: () => window.open('https://github.com/roshhellwett', '_blank') },
];

const KeyboardShortcuts = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  const handleKeyDown = useCallback((e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setIsOpen(prev => !prev);
    }
    if (e.key === 'Escape' && isOpen) setIsOpen(false);
  }, [isOpen]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const filtered = commands.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -12 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-x-4 top-[18%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md z-50"
            >
              <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-cream)]/70 shadow-2xl shadow-black/20 backdrop-blur-xl">
                <div className="flex items-center gap-2.5 border-b border-[var(--color-border-light)] px-4 py-3">
                  <Search size={15} className="shrink-0 text-[var(--color-text-secondary)]" />
                  <input
                    type="text"
                    placeholder="Search commands..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 border-none bg-transparent text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-secondary)]/50"
                    autoFocus
                  />
                  <button
                    onClick={() => setIsOpen(false)}
                    className="rounded-lg p-1 text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-sidebar-hover)] hover:text-[var(--color-text-primary)]"
                    type="button"
                    aria-label="Close command palette"
                  >
                    <X size={15} />
                  </button>
                </div>
                <div className="max-h-72 overflow-y-auto p-1.5">
                  {filtered.length > 0 ? (
                    filtered.map((cmd) => (
                      <button
                        key={cmd.id}
                        onClick={() => { cmd.action?.(); setIsOpen(false); }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-[var(--color-sidebar-hover)]"
                        type="button"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-sidebar-hover)]/70 backdrop-blur-sm">
                          <cmd.icon size={14} className="text-[var(--color-text-secondary)]" />
                        </div>
                        <span className="flex-1 text-left text-sm font-medium text-[var(--color-text-primary)]">{cmd.name}</span>
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-6 text-center text-sm text-[var(--color-text-secondary)]">No commands found</div>
                  )}
                </div>
                <div className="flex items-center justify-between border-t border-[var(--color-border-light)] px-4 py-2.5 text-[10px] text-[var(--color-text-secondary)]">
                  <span>Zenith navigation</span>
                  <span>Zenith</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default KeyboardShortcuts;
