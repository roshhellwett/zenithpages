import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Disc3, FileText, Paintbrush, Play, RotateCcw, Terminal } from 'lucide-react';

const demos = [
  {
    name: 'PulseWire',
    title: 'Audio presets',
    icon: Disc3,
    steps: [
      { type: 'command', text: 'pulsewire install studio', delay: 560 },
      { type: 'output', text: 'Scanning EasyEffects installation...', delay: 360 },
      { type: 'output', text: 'Detected EasyEffects v7.1.0', delay: 280, color: 'text-emerald-300' },
      { type: 'output', text: 'Installed Studio Quality preset', delay: 420, color: 'text-emerald-300' },
      { type: 'output', text: 'Backup saved before changes', delay: 260 },
    ],
  },
  {
    name: 'Kitty Themes',
    title: 'Terminal themes',
    icon: Paintbrush,
    steps: [
      { type: 'command', text: 'kittythemes install nord', delay: 560 },
      { type: 'output', text: 'Fetching nord.conf...', delay: 360 },
      { type: 'output', text: 'Theme copied to ~/.config/kitty/', delay: 300, color: 'text-emerald-300' },
      { type: 'output', text: 'Restart kitty to apply the palette', delay: 360 },
    ],
  },
  {
    name: 'README Gen',
    title: 'Project docs',
    icon: FileText,
    steps: [
      { type: 'command', text: 'readmegen generate --ai', delay: 560 },
      { type: 'output', text: 'Scanning src, tests, and package metadata...', delay: 380 },
      { type: 'output', text: 'Creating sections for install, usage, API', delay: 420 },
      { type: 'output', text: 'Generated README.md', delay: 300, color: 'text-emerald-300' },
      { type: 'output', text: 'Saved to ./README.md', delay: 220 },
    ],
  },
];

const CLIDemo = () => {
  const [selected, setSelected] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [output, setOutput] = useState([]);
  const scrollRef = useRef(null);
  const demo = useMemo(() => demos[selected], [selected]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [output, typedText]);

  useEffect(() => {
    if (!isPlaying) return;
    if (currentStep >= demo.steps.length) {
      const stopTimeout = setTimeout(() => setIsPlaying(false), 0);
      return () => clearTimeout(stopTimeout);
    }

    const step = demo.steps[currentStep];
    if (step.type === 'command') {
      if (typedText.length < step.text.length) {
        const timeout = setTimeout(() => setTypedText(step.text.slice(0, typedText.length + 1)), 36);
        return () => clearTimeout(timeout);
      }
      const timeout = setTimeout(() => {
        setOutput((value) => [...value, { type: 'command', text: step.text }]);
        setTypedText('');
        setCurrentStep((value) => value + 1);
      }, 190);
      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(() => {
      setOutput((value) => [...value, step]);
      setCurrentStep((value) => value + 1);
    }, step.delay);
    return () => clearTimeout(timeout);
  }, [isPlaying, currentStep, typedText, demo]);

  const reset = () => {
    setIsPlaying(false);
    setOutput([]);
    setCurrentStep(0);
    setTypedText('');
  };

  const run = () => {
    setOutput([]);
    setCurrentStep(0);
    setTypedText('');
    setIsPlaying(true);
  };

  return (
    <div>
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-950/[0.08] bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
          <Terminal size={13} className="text-sky-600" />
          Live CLI
        </div>
        <h2 className="text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
          Try the feel before installing.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600">
          A compact look at how the tools behave in real command-line workflows.
        </p>
      </div>

      <div className="grid gap-4 rounded-[2rem] border border-slate-950/[0.08] bg-white/76 p-3 shadow-xl shadow-slate-950/[0.04] lg:grid-cols-[19rem_1fr] lg:p-4">
        <div className="space-y-2">
          {demos.map((item, index) => {
            const Icon = item.icon;
            const active = selected === index;
            return (
              <button
                key={item.name}
                onClick={() => {
                  setSelected(index);
                  reset();
                }}
                className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${
                  active
                    ? 'border-slate-950 bg-slate-950 text-white'
                    : 'border-slate-950/[0.08] bg-white text-slate-700 hover:bg-slate-50'
                }`}
                type="button"
              >
                <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${active ? 'bg-white text-slate-950' : 'bg-slate-100 text-slate-600'}`}>
                  <Icon size={19} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">{item.name}</span>
                  <span className={`block text-xs ${active ? 'text-white/55' : 'text-slate-500'}`}>{item.title}</span>
                </span>
              </button>
            );
          })}

          <div className="grid grid-cols-[1fr_auto] gap-2 pt-2">
            <button
              onClick={run}
              disabled={isPlaying}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              type="button"
            >
              <Play size={15} />
              {isPlaying ? 'Running' : 'Run'}
            </button>
            <button
              onClick={reset}
              className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-950/[0.08] bg-white text-slate-500 transition hover:bg-slate-100"
              type="button"
              aria-label="Reset demo"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-[1.5rem] bg-slate-950 shadow-inner">
          <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.04] px-4 py-3">
            <div className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-rose-400" />
              <span className="h-3 w-3 rounded-full bg-amber-300" />
              <span className="h-3 w-3 rounded-full bg-emerald-400" />
            </div>
            <span className="flex-1 text-center text-xs font-medium text-white/40">{demo.name}</span>
            <span className="w-12" />
          </div>

          <div ref={scrollRef} className="h-[22rem] overflow-y-auto p-5 font-mono text-[13px] leading-7" style={{ scrollbarWidth: 'none' }}>
            <AnimatePresence mode="popLayout">
              {output.map((line, index) => (
                <motion.div
                  key={`${line.text}-${index}`}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-1"
                >
                  {line.type === 'command' ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sky-300">$</span>
                      <span className="text-white/85">{line.text}</span>
                    </div>
                  ) : (
                    <div className={`pl-4 ${line.color || 'text-white/48'}`}>{line.text}</div>
                  )}
                </motion.div>
              ))}

              {isPlaying && typedText && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                  <span className="text-sky-300">$</span>
                  <span className="text-white/85">{typedText}</span>
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.55, repeat: Infinity }}
                    className="inline-block h-[15px] w-[6px] bg-sky-300"
                  />
                </motion.div>
              )}

              {!isPlaying && output.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex h-72 flex-col items-center justify-center text-white/26"
                >
                  <Terminal size={34} className="mb-3" />
                  <p className="text-sm">Choose a tool and run the demo</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CLIDemo;
