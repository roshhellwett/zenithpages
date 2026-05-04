import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Play, RotateCcw, ChevronRight, Check, Loader2 } from 'lucide-react';

const CLIDemo = () => {
  const [selectedDemo, setSelectedDemo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [output, setOutput] = useState([]);
  const scrollRef = useRef(null);

  const demos = [
    {
      name: 'projectpulsewire',
      title: 'Audio Enhancement',
      icon: '🔊',
      steps: [
        { type: 'command', text: 'pulsewire install', delay: 1000 },
        { type: 'output', text: 'Scanning for EasyEffects...', delay: 800, loading: true },
        { type: 'output', text: '✓ EasyEffects detected (v7.1.0)', delay: 400, color: 'text-green-400' },
        { type: 'output', text: 'Downloading IRS files...', delay: 600, loading: true },
        { type: 'progress', text: 'Installing preset "Studio Quality"...', delay: 1000 },
        { type: 'output', text: '✓ Successfully installed 5 presets', delay: 300, color: 'text-green-400' },
        { type: 'output', text: 'Run "pulsewire list" to see all presets', delay: 200, color: 'text-brand-400' },
      ]
    },
    {
      name: 'projectkittythemes',
      title: 'Theme Installer',
      icon: '🎨',
      steps: [
        { type: 'command', text: 'kittythemes install dracula', delay: 1000 },
        { type: 'output', text: 'Fetching theme "dracula"...', delay: 600, loading: true },
        { type: 'output', text: '✓ Downloaded dracula.conf (2.4 KB)', delay: 400, color: 'text-green-400' },
        { type: 'output', text: 'Backing up current config...', delay: 500, loading: true },
        { type: 'output', text: '✓ Backup saved to ~/.config/kitty/backup/', delay: 300, color: 'text-green-400' },
        { type: 'output', text: 'Applying theme...', delay: 700, loading: true },
        { type: 'output', text: '✓ Theme applied! Restart kitty to see changes.', delay: 300, color: 'text-green-400' },
      ]
    },
    {
      name: 'projectreadmegen',
      title: 'README Generator',
      icon: '📝',
      steps: [
        { type: 'command', text: 'readmegen generate --ai', delay: 1000 },
        { type: 'output', text: 'Scanning project structure...', delay: 800, loading: true },
        { type: 'output', text: 'Found: src/, tests/, docs/, package.json', delay: 400 },
        { type: 'output', text: 'Analyzing code with Groq API...', delay: 1200, loading: true },
        { type: 'output', text: '✓ Generated comprehensive README.md', delay: 400, color: 'text-green-400' },
        { type: 'output', text: 'Sections: Features, Install, Usage, API, License', delay: 300 },
        { type: 'output', text: 'Saved to: ./README.md (4.2 KB)', delay: 300, color: 'text-brand-400' },
      ]
    },
  ];

  const currentDemo = useMemo(() => demos[selectedDemo], [selectedDemo]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [output, typedText]);

  useEffect(() => {
    if (!isPlaying) return;

    if (currentStep >= currentDemo.steps.length) {
      setIsPlaying(false);
      return;
    }

    const step = currentDemo.steps[currentStep];

    if (step.type === 'command') {
      if (typedText.length < step.text.length) {
        const timeout = setTimeout(() => {
          setTypedText(step.text.slice(0, typedText.length + 1));
        }, 50);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setOutput(prev => [...prev, { type: 'command', text: step.text }]);
          setTypedText('');
          setCurrentStep(prev => prev + 1);
        }, 300);
        return () => clearTimeout(timeout);
      }
    } else {
      const timeout = setTimeout(() => {
        setOutput(prev => [...prev, step]);
        setCurrentStep(prev => prev + 1);
      }, step.delay);
      return () => clearTimeout(timeout);
    }
  }, [isPlaying, currentStep, typedText, currentDemo]);

  const handlePlay = () => {
    setOutput([]);
    setCurrentStep(0);
    setTypedText('');
    setIsPlaying(true);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setOutput([]);
    setCurrentStep(0);
    setTypedText('');
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium mb-4"
          >
            <Terminal size={14} />
            Live Demo
          </motion.div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            See It In Action
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Watch how these tools work in real-time. Experience the smooth, intuitive CLI interface.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Demo selector */}
          <div className="space-y-3">
            {demos.map((demo, idx) => (
              <motion.button
                key={demo.name}
                onClick={() => {
                  setSelectedDemo(idx);
                  handleReset();
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                  selectedDemo === idx
                    ? 'bg-brand-500/10 border-brand-500/30'
                    : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{demo.icon}</span>
                  <div>
                    <p className={`font-semibold ${selectedDemo === idx ? 'text-brand-400' : 'text-zinc-300'}`}>
                      {demo.name}
                    </p>
                    <p className="text-xs text-zinc-500">{demo.title}</p>
                  </div>
                  {selectedDemo === idx && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto"
                    >
                      <ChevronRight size={16} className="text-brand-400" />
                    </motion.div>
                  )}
                </div>
              </motion.button>
            ))}

            {/* Control buttons */}
            <div className="flex gap-3 pt-4">
              <motion.button
                onClick={handlePlay}
                disabled={isPlaying}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-brand-500 hover:bg-brand-600 disabled:bg-zinc-700 text-white rounded-xl font-medium transition-colors"
              >
                {isPlaying ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play size={16} />
                    Run Demo
                  </>
                )}
              </motion.button>
              <motion.button
                onClick={handleReset}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center p-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition-colors"
              >
                <RotateCcw size={16} />
              </motion.button>
            </div>
          </div>

          {/* Terminal display */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="relative glass-panel rounded-2xl border border-zinc-700/50 overflow-hidden">
              {/* Terminal header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800/50 bg-zinc-900/50">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-xs text-zinc-500 font-medium">
                    {currentDemo.name} — demo
                  </span>
                </div>
                <div className="w-16" />
              </div>

              {/* Terminal output */}
              <div
                ref={scrollRef}
                className="p-4 h-80 overflow-y-auto font-mono text-sm bg-black/40"
                style={{ scrollbarWidth: 'none' }}
              >
                <AnimatePresence mode="popLayout">
                  {output.map((line, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="mb-2"
                    >
                      {line.type === 'command' ? (
                        <div className="flex items-center gap-2">
                          <span className="text-brand-400">❯</span>
                          <span className="text-zinc-100">{line.text}</span>
                        </div>
                      ) : line.type === 'progress' ? (
                        <div className="space-y-1">
                          <span className={line.color || 'text-zinc-400'}>{line.text}</span>
                          <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: '100%' }}
                              transition={{ duration: 1, ease: 'easeOut' }}
                              className="h-full bg-gradient-to-r from-brand-500 to-blue-500 rounded-full"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className={`flex items-center gap-2 ${line.color || 'text-zinc-400'}`}>
                          {line.loading && (
                            <Loader2 size={12} className="animate-spin text-brand-400" />
                          )}
                          {!line.loading && line.text.startsWith('✓') && (
                            <Check size={12} className="text-green-400" />
                          )}
                          <span>{line.text}</span>
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {/* Currently typing */}
                  {isPlaying && typedText && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2"
                    >
                      <span className="text-brand-400">❯</span>
                      <span className="text-zinc-100">{typedText}</span>
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="inline-block w-2 h-4 bg-brand-400 ml-0.5"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Empty state */}
                {!isPlaying && output.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full text-zinc-600"
                  >
                    <Terminal size={48} className="mb-4 opacity-30" />
                    <p>Click "Run Demo" to see the tool in action</p>
                  </motion.div>
                )}
              </div>

              {/* Scanline overlay */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-[0.02]"
                style={{
                  background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)'
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CLIDemo;
