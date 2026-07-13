import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, MessageSquare, Send, X, Zap } from 'lucide-react';
import { sendChatMessage } from '../utils/ai';
import { FormattedText, LoadingDots } from '../utils/format';

const aiSuggestions = [
  'What tools do you have?',
  'How do I install a package?',
  'Show me CLI demos',
  'Tell me about the founder',
];

const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  const addMessage = (role, text) => {
    setMessages((prev) => {
      const next = [...prev, { role, text }];
      return next;
    });
    scrollToBottom();
  };

  const handleSend = async (overrideText) => {
    const text = overrideText || input;
    if (!text.trim() || isLoading) return;
    setInput('');
    addMessage('user', text);
    setIsLoading(true);

    try {
      const conversation = [...messages, { role: 'user', text }];
      const reply = await sendChatMessage(conversation);
      addMessage('assistant', reply);
    } catch {
      addMessage('assistant', 'I\'m having trouble connecting right now. Please try again in a moment.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-[calc(100vw-2rem)] sm:w-[380px] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-cream)]/98 shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-[var(--color-border)]/60 bg-gradient-to-r from-[var(--color-amber)]/5 to-transparent px-5 py-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-amber)]/10 text-[var(--color-amber)] shadow-sm">
                <Zap size={15} />
              </span>
              <div className="flex-1">
                <p className="text-sm font-bold text-[var(--color-text-primary)]">Zenith AI</p>
                <p className="flex items-center gap-1.5 text-[10px] text-[var(--color-text-secondary)]/50">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-terminal-green)]" />
                  Online
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                type="button"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--color-text-secondary)]/60 transition hover:bg-[var(--color-amber)]/10 hover:text-[var(--color-amber)]"
              >
                <X size={14} />
              </button>
            </div>

            <div className="max-h-[340px] overflow-y-auto px-5 py-4 scroll-smooth space-y-3">
              {messages.length === 0 && !isLoading ? (
                <div className="space-y-4">
                  <div className="rounded-xl border border-[var(--color-border)]/50 bg-white/40 px-4 py-3">
                    <p className="text-xs leading-relaxed text-[var(--color-text-secondary)]">
                      Hi! I&apos;m the Zenith assistant. Ask me about our tools, install guides, or the project.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {aiSuggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSend(s)}
                        disabled={isLoading}
                        className="rounded-lg border border-[var(--color-border)]/60 bg-white/50 px-3 py-1.5 text-[11px] font-medium text-[var(--color-text-secondary)] transition-all hover:border-[var(--color-amber)]/30 hover:bg-[var(--color-amber)]/5 hover:text-[var(--color-amber)] active:scale-[0.97] disabled:opacity-40"
                        type="button"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`rounded-2xl px-4 py-2.5 text-xs leading-relaxed break-words max-w-[280px] ${
                          msg.role === 'user'
                            ? 'bg-[var(--color-amber)]/12 text-[var(--color-text-primary)] rounded-br-md'
                            : 'bg-white/70 border border-[var(--color-border)]/40 text-[var(--color-text-primary)] rounded-bl-md shadow-sm'
                        }`}
                      >
                        {msg.role === 'user' ? msg.text : <FormattedText text={msg.text} />}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="rounded-2xl rounded-bl-md border border-[var(--color-border)]/40 bg-white/70 px-4 py-3 shadow-sm">
                        <LoadingDots />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            <div className="border-t border-[var(--color-border)]/50 px-5 py-3.5">
              <div className="flex items-center gap-2 rounded-xl border border-[var(--color-border)]/60 bg-white/60 px-3.5 py-2.5 transition-all focus-within:border-[var(--color-amber)]/40 focus-within:bg-white/80 focus-within:shadow-sm">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about tools..."
                  disabled={isLoading}
                  className="flex-1 bg-transparent text-xs font-medium text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-secondary)]/40 disabled:opacity-40"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={isLoading || !input.trim()}
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-amber)] text-white transition hover:bg-[var(--color-amber-dark)] disabled:opacity-40"
                  type="button"
                >
                  {isLoading ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-amber)] to-[var(--color-amber-dark)] text-white shadow-lg shadow-[var(--color-amber)]/20 transition-all hover:shadow-xl hover:shadow-[var(--color-amber)]/30 active:scale-95"
        type="button"
        aria-label="Toggle AI chat"
      >
        {isOpen ? <X size={20} /> : <MessageSquare size={20} />}
      </motion.button>
    </div>
  );
};

export default AIChatWidget;
