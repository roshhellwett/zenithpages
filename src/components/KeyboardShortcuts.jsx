import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Package, Search, Terminal, X } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';

const commands = [
  { id: 'tools', name: 'Tool library', icon: Package, action: () => document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' }) },
  { id: 'demo', name: 'Live CLI demo', icon: Terminal, action: () => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' }) },
  { id: 'home', name: 'Top of page', icon: Home, action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
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
              <div className="overflow-hidden rounded-3xl border border-slate-950/[0.08] bg-white/95 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
                <div className="flex items-center gap-2.5 border-b border-slate-950/[0.08] px-4 py-3">
                  <Search size={15} className="shrink-0 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search commands..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 border-none bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                    autoFocus
                  />
                  <button
                    onClick={() => setIsOpen(false)}
                    className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
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
                        className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors hover:bg-slate-100"
                        type="button"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100">
                          <cmd.icon size={14} className="text-slate-500" />
                        </div>
                        <span className="flex-1 text-left text-sm font-medium text-slate-700">{cmd.name}</span>
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-6 text-center text-sm text-slate-400">No commands found</div>
                  )}
                </div>
                <div className="flex items-center justify-between border-t border-slate-950/[0.08] px-4 py-2.5 text-[10px] text-slate-400">
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

KeyboardShortcuts.propTypes = {};

export default KeyboardShortcuts;
