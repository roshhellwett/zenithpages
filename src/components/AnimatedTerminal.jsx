import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const AnimatedTerminal = () => {
  const [lines, setLines] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [isTyping, setIsTyping] = useState(true);
  const containerRef = useRef(null);

  const commands = [
    { type: 'input', text: 'zenith search audio', delay: 800 },
    { type: 'output', text: 'Found 1 package:', delay: 300 },
    { type: 'output', text: '➜ projectpulsewire (v2.0.3) - Linux audio enhancement', delay: 200, color: 'text-green-400' },
    { type: 'input', text: 'pip install projectpulsewire', delay: 1000 },
    { type: 'output', text: 'Collecting projectpulsewire', delay: 400 },
    { type: 'output', text: 'Downloading projectpulsewire-2.0.3-py3-none-any.whl (12 kB)', delay: 300 },
    { type: 'output', text: 'Installing collected packages: projectpulsewire', delay: 500 },
    { type: 'output', text: 'Successfully installed projectpulsewire-2.0.3', delay: 200, color: 'text-green-400' },
    { type: 'input', text: 'pulsewire --help', delay: 1200 },
    { type: 'output', text: 'Usage: pulsewire [OPTIONS] COMMAND [ARGS]...', delay: 300 },
    { type: 'output', text: 'Commands: install, list, backup, restore, preset', delay: 400 },
  ];

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    if (currentLine >= commands.length) {
      setIsTyping(false);
      // Reset after a pause
      const resetTimeout = setTimeout(() => {
        setLines([]);
        setCurrentLine(0);
        setCurrentChar(0);
        setIsTyping(true);
      }, 4000);
      return () => clearTimeout(resetTimeout);
    }

    const command = commands[currentLine];

    if (command.type === 'input') {
      if (currentChar < command.text.length) {
        const timeout = setTimeout(() => {
          setCurrentChar(prev => prev + 1);
        }, 50 + Math.random() * 30);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setLines(prev => [...prev, { ...command, fullText: command.text }]);
          setCurrentLine(prev => prev + 1);
          setCurrentChar(0);
        }, command.delay);
        return () => clearTimeout(timeout);
      }
    } else {
      const timeout = setTimeout(() => {
        setLines(prev => [...prev, command]);
        setCurrentLine(prev => prev + 1);
      }, command.delay);
      return () => clearTimeout(timeout);
    }
  }, [currentLine, currentChar]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines, currentChar]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-lg"
    >
      {/* Glow effect behind terminal */}
      <div className="absolute -inset-1 bg-gradient-to-r from-brand-500/20 via-blue-500/20 to-brand-500/20 rounded-2xl blur-xl opacity-50 animate-pulse" />
      
      {/* Terminal window */}
      <div className="relative glass-panel rounded-2xl border border-zinc-700/50 overflow-hidden shadow-2xl">
        {/* Terminal header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800/50 bg-zinc-900/50">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors cursor-pointer" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-xs text-zinc-500 font-medium">zenith — zsh</span>
          </div>
          <div className="w-16" />
        </div>

        {/* Terminal content */}
        <div 
          ref={containerRef}
          className="p-4 h-64 overflow-y-auto font-mono text-sm scrollbar-hide"
          style={{ 
            background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(9,9,11,0.6) 100%)',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {/* Prompt */}
          <div className="text-zinc-500 text-xs mb-2">
            Last login: {new Date().toLocaleString()} on ttys000
          </div>

          {/* Rendered lines */}
          {lines.map((line, idx) => (
            <div key={idx} className="mb-1">
              {line.type === 'input' ? (
                <div className="flex items-center gap-2">
                  <span className="text-brand-400">❯</span>
                  <span className="text-zinc-100">{line.fullText || line.text}</span>
                </div>
              ) : (
                <div className={`${line.color || 'text-zinc-400'} pl-4`}>
                  {line.text}
                </div>
              )}
            </div>
          ))}

          {/* Currently typing line */}
          {isTyping && currentLine < commands.length && commands[currentLine].type === 'input' && (
            <div className="flex items-center gap-2">
              <span className="text-brand-400">❯</span>
              <span className="text-zinc-100">
                {commands[currentLine].text.slice(0, currentChar)}
                <span 
                  className={`inline-block w-2 h-4 bg-brand-400 ml-0.5 ${showCursor ? 'opacity-100' : 'opacity-0'}`}
                  style={{ transition: 'opacity 0.1s' }}
                />
              </span>
            </div>
          )}

          {/* Empty prompt at end */}
          {!isTyping && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-brand-400">❯</span>
              <span className={`inline-block w-2 h-4 bg-brand-400 ml-0.5 ${showCursor ? 'opacity-100' : 'opacity-0'}`} />
            </div>
          )}
        </div>

        {/* Scanline effect */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)'
          }}
        />
      </div>
    </motion.div>
  );
};

export default AnimatedTerminal;
