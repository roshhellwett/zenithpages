import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Command, Search, X, ArrowRight, Sparkles } from 'lucide-react';

const KeyboardShortcuts = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const shortcuts = [
    { key: 'K', modifier: '⌘', description: 'Open command palette', action: () => setIsOpen(true) },
    { key: '/', modifier: '', description: 'Focus search', action: () => document.querySelector('input[type="text"]')?.focus() },
    { key: 'S', modifier: '⌘', description: 'Sort by stars', action: () => {} },
    { key: 'N', modifier: '⌘', description: 'Sort by name', action: () => {} },
    { key: 'C', modifier: '⌘', description: 'Copy install command', action: () => {} },
    { key: 'G', modifier: '⌘', description: 'Go to GitHub', action: () => window.open('https://github.com/roshhellwett', '_blank') },
    { key: 'H', modifier: '⌘', description: 'Go to Home', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    { key: 'E', modifier: '⌘', description: 'Scroll to packages', action: () => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' }) },
  ];

  const commands = [
    { id: 'search', name: 'Search packages', icon: Search, shortcut: '/', action: () => document.querySelector('input[type="text"]')?.focus() },
    { id: 'sort-stars', name: 'Sort by stars', icon: Sparkles, shortcut: '⌘S', action: () => {} },
    { id: 'sort-name', name: 'Sort by name', icon: ArrowRight, shortcut: '⌘N', action: () => {} },
    { id: 'github', name: 'Open GitHub', icon: () => <span className="text-sm">⚡</span>, shortcut: '⌘G', action: () => window.open('https://github.com/roshhellwett', '_blank') },
    { id: 'home', name: 'Go to top', icon: () => <span className="text-sm">⬆️</span>, shortcut: '⌘H', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
  ];

  const handleKeyDown = useCallback((e) => {
    // Command/Ctrl + K
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setIsOpen(prev => !prev);
    }
    
    // Escape to close
    if (e.key === 'Escape' && isOpen) {
      setIsOpen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const filteredCommands = commands.filter(cmd => 
    cmd.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Keyboard hint - bottom right */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-6 right-6 z-40 hidden lg:flex items-center gap-2"
      >
        <div className="glass-panel px-3 py-2 rounded-lg border border-zinc-800/50 text-xs text-zinc-500 flex items-center gap-2">
          <span>Press</span>
          <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-400 font-mono">⌘</kbd>
          <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-400 font-mono">K</kbd>
          <span>for commands</span>
        </div>
      </motion.div>

      {/* Command palette modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="fixed inset-x-4 top-[20%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl z-50"
            >
              <div className="glass-panel rounded-2xl border border-zinc-700/50 shadow-2xl overflow-hidden">
                {/* Search header */}
                <div className="flex items-center gap-3 px-4 py-4 border-b border-zinc-800/50">
                  <Search size={20} className="text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Type a command or search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-zinc-100 placeholder-zinc-500 text-base"
                    autoFocus
                  />
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-500 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label="Close command palette"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Commands list */}
                <div className="max-h-80 overflow-y-auto p-2">
                  {filteredCommands.length > 0 ? (
                    <>
                      <div className="px-3 py-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Commands
                      </div>
                      {filteredCommands.map((cmd, idx) => {
                        const Icon = cmd.icon;
                        return (
                          <motion.button
                            key={cmd.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => {
                              cmd.action?.();
                              setIsOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-brand-500/10 transition-colors group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center group-hover:bg-brand-500/20 transition-colors">
                              {typeof Icon === 'function' ? (
                                <Icon />
                              ) : (
                                <Icon size={16} className="text-zinc-400 group-hover:text-brand-400" />
                              )}
                            </div>
                            <span className="flex-1 text-left text-zinc-300 group-hover:text-white">
                              {cmd.name}
                            </span>
                            <kbd className="px-2 py-1 bg-zinc-800 rounded text-xs text-zinc-500 font-mono">
                              {cmd.shortcut}
                            </kbd>
                          </motion.button>
                        );
                      })}
                    </>
                  ) : (
                    <div className="px-4 py-8 text-center text-zinc-500">
                      <Command size={32} className="mx-auto mb-3 opacity-30" />
                      <p>No commands found</p>
                    </div>
                  )}

                  {/* Shortcuts section */}
                  <div className="px-3 py-2 mt-2 text-xs font-medium text-zinc-500 uppercase tracking-wider border-t border-zinc-800/50 pt-4">
                    Keyboard Shortcuts
                  </div>
                  <div className="grid grid-cols-2 gap-2 px-2 pb-2">
                    {shortcuts.slice(0, 4).map((shortcut, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-900/50"
                      >
                        <div className="flex gap-1">
                          {shortcut.modifier && (
                            <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-xs text-zinc-400 font-mono">
                              {shortcut.modifier}
                            </kbd>
                          )}
                          <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-xs text-zinc-400 font-mono">
                            {shortcut.key}
                          </kbd>
                        </div>
                        <span className="text-xs text-zinc-500 truncate">{shortcut.description}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-zinc-800/50 bg-zinc-900/30 flex items-center justify-between text-xs text-zinc-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded font-mono">↑↓</kbd>
                      <span>Navigate</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded font-mono">↵</kbd>
                      <span>Select</span>
                    </span>
                  </div>
                  <span>Zenith Registry</span>
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
