import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const commands = [
  { type: 'input', text: 'zenith search readme' },
  { type: 'output', text: 'projectreadmegen  v2.0.3  README generation', delay: 280 },
  { type: 'input', text: 'pip install projectreadmegen', delay: 520 },
  { type: 'output', text: 'Downloading package metadata...', delay: 280 },
  { type: 'output', text: 'Installing projectreadmegen-2.0.3', delay: 360 },
  { type: 'output', text: 'Done. Command available: readmegen', delay: 260 },
  { type: 'input', text: 'readmegen generate --ai', delay: 650 },
  { type: 'output', text: 'README.md created from project structure', delay: 320 },
];

const AnimatedTerminal = () => {
  const [lines, setLines] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [isTyping, setIsTyping] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    const cursorInterval = setInterval(() => setShowCursor((value) => !value), 530);
    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    if (currentLine >= commands.length) {
      const stopTimeout = setTimeout(() => setIsTyping(false), 0);
      const restartTimeout = setTimeout(() => {
        setLines([]);
        setCurrentLine(0);
        setCurrentChar(0);
        setIsTyping(true);
      }, 4200);
      return () => {
        clearTimeout(stopTimeout);
        clearTimeout(restartTimeout);
      };
    }

    const command = commands[currentLine];

    if (command.type === 'input') {
      if (currentChar < command.text.length) {
        const timeout = setTimeout(() => setCurrentChar((value) => value + 1), 38);
        return () => clearTimeout(timeout);
      }

      const timeout = setTimeout(() => {
        setLines((value) => [...value, { ...command, fullText: command.text, isTyped: true }]);
        setCurrentLine((value) => value + 1);
        setCurrentChar(0);
      }, command.delay || 450);
      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(() => {
      setLines((value) => [...value, command]);
      setCurrentLine((value) => value + 1);
    }, command.delay || 280);
    return () => clearTimeout(timeout);
  }, [currentLine, currentChar]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines, currentChar]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 18 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto w-full max-w-lg"
    >
      <div className="absolute -inset-6 rounded-[2rem] bg-[radial-gradient(circle_at_70%_10%,rgba(14,165,233,0.18),transparent_38%),radial-gradient(circle_at_10%_80%,rgba(16,185,129,0.14),transparent_34%)] blur-2xl" />
      <div className="relative overflow-hidden rounded-[1.75rem] border border-white/70 bg-slate-950 shadow-2xl shadow-slate-950/20">
        <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.04] px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-rose-400" />
            <span className="h-3 w-3 rounded-full bg-amber-300" />
            <span className="h-3 w-3 rounded-full bg-emerald-400" />
          </div>
          <span className="flex-1 text-center text-xs font-medium text-white/40">zenith install session</span>
          <span className="w-12" />
        </div>

        <div ref={containerRef} className="h-80 overflow-y-auto p-5 font-mono text-[13px] leading-7" style={{ scrollbarWidth: 'none' }}>
          <div className="mb-3 text-white/25">Last login: today on zenith</div>

          {lines.map((line, index) => (
            <div key={`${line.text}-${index}`} className="mb-1">
              {line.isTyped || line.type === 'input' ? (
                <div className="flex items-center gap-2">
                  <span className="text-sky-300">$</span>
                  <span className="text-white/85">{line.fullText || line.text}</span>
                </div>
              ) : (
                <div className="pl-4 text-white/48">{line.text}</div>
              )}
            </div>
          ))}

          {isTyping && currentLine < commands.length && commands[currentLine].type === 'input' && (
            <div className="flex items-center gap-2">
              <span className="text-sky-300">$</span>
              <span className="text-white/85">
                {commands[currentLine].text.slice(0, currentChar)}
                <span className={`ml-0.5 inline-block h-[15px] w-[6px] bg-sky-300 ${showCursor ? 'opacity-100' : 'opacity-0'}`} />
              </span>
            </div>
          )}

          {!isTyping && (
            <div className="mt-1 flex items-center gap-2">
              <span className="text-sky-300">$</span>
              <span className={`inline-block h-[15px] w-[6px] bg-sky-300 ${showCursor ? 'opacity-100' : 'opacity-0'}`} />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AnimatedTerminal;
