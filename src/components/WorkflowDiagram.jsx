import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Terminal, Download, Settings, Zap, Shield, ArrowRight, Sparkles } from 'lucide-react';

const WorkflowDiagram = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const steps = [
    {
      id: 1,
      title: 'Package Discovery',
      icon: Package,
      description: 'Find tools via pip, GitHub, or the Zenith Registry',
      color: 'from-purple-500 to-pink-500',
      details: [
        'Search by functionality or name',
        'View star ratings and version info',
        'Read documentation and examples',
      ]
    },
    {
      id: 2,
      title: 'One-Line Install',
      icon: Download,
      description: 'Install any tool with a single pip command',
      color: 'from-blue-500 to-cyan-500',
      details: [
        'pip install <package-name>',
        'Automatic dependency resolution',
        'Cross-platform support (Linux, macOS, Windows)',
      ]
    },
    {
      id: 3,
      title: 'Smart Configuration',
      icon: Settings,
      description: 'Tools auto-detect your environment and configure',
      color: 'from-emerald-500 to-teal-500',
      details: [
        'Detect existing installations',
        'Create backups before changes',
        'Interactive setup wizard',
      ]
    },
    {
      id: 4,
      title: 'Instant Execution',
      icon: Zap,
      description: 'Run commands immediately after installation',
      color: 'from-amber-500 to-orange-500',
      details: [
        'CLI commands available instantly',
        'Helpful error messages',
        'Progress indicators for long tasks',
      ]
    },
    {
      id: 5,
      title: 'Secure & Reliable',
      icon: Shield,
      description: 'Every tool is tested and validated',
      color: 'from-red-500 to-rose-500',
      details: [
        'Open source - inspect the code',
        'Active maintenance and updates',
        'Community tested and approved',
      ]
    },
  ];

  const handleStepClick = (idx) => {
    setActiveStep(idx);
    setIsAutoPlaying(false);
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium mb-4"
          >
            <Sparkles size={14} />
            How It Works
          </motion.div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            From Discovery to Execution
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
            A streamlined workflow designed for developers who value their time. 
            No complex setup, no configuration files to wrestle with.
          </p>
        </motion.div>

        {/* Main diagram */}
        <div className="relative">
          {/* Connection lines - desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 -translate-y-1/2 h-0.5">
            <div className="relative h-full mx-24">
              {/* Animated progress line */}
              <motion.div
                className="absolute h-full bg-gradient-to-r from-brand-500 via-blue-500 to-brand-500 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              />
              {/* Background line */}
              <div className="absolute inset-0 bg-zinc-800/50 rounded-full" />
              
              {/* Step markers */}
              {steps.map((_, idx) => (
                <motion.div
                  key={idx}
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
                  style={{ left: `${(idx / (steps.length - 1)) * 100}%` }}
                  animate={{
                    backgroundColor: idx <= activeStep ? '#8b5cf6' : '#27272a',
                    scale: idx === activeStep ? 1.5 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>
          </div>

          {/* Steps grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = idx === activeStep;
              const isCompleted = idx < activeStep;

              return (
                <motion.button
                  key={step.id}
                  onClick={() => handleStepClick(idx)}
                  onMouseEnter={() => setActiveStep(idx)}
                  className="relative group"
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Card */}
                  <div
                    className={`relative p-6 rounded-2xl border transition-all duration-500 h-full ${
                      isActive
                        ? 'bg-zinc-900/80 border-brand-500/50 shadow-2xl shadow-brand-500/10'
                        : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    {/* Glow effect */}
                    {isActive && (
                      <div
                        className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-r ${step.color} opacity-30 blur-lg`}
                      />
                    )}

                    {/* Number badge */}
                    <div
                      className={`absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        isActive || isCompleted
                          ? 'bg-brand-500 text-white'
                          : 'bg-zinc-800 text-zinc-500'
                      }`}
                    >
                      {isCompleted ? '✓' : step.id}
                    </div>

                    {/* Icon */}
                    <motion.div
                      animate={{
                        scale: isActive ? 1.1 : 1,
                        rotate: isActive ? [0, -5, 5, 0] : 0,
                      }}
                      transition={{ duration: 0.5 }}
                      className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 ${
                        isActive
                          ? `bg-gradient-to-br ${step.color} shadow-lg`
                          : 'bg-zinc-800/50'
                      }`}
                    >
                      <Icon
                        size={24}
                        className={isActive ? 'text-white' : 'text-zinc-500'}
                      />
                    </motion.div>

                    {/* Content */}
                    <h3
                      className={`font-bold text-lg mb-2 transition-colors ${
                        isActive ? 'text-white' : 'text-zinc-400'
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p className="text-sm text-zinc-500 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Mobile arrow */}
                    {idx < steps.length - 1 && (
                      <div className="lg:hidden flex justify-center mt-4">
                        <ArrowRight size={16} className="text-zinc-700" />
                      </div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Detail panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-12 glass-panel rounded-2xl border border-zinc-800/50 p-6 lg:p-8"
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                {/* Active step indicator */}
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${steps[activeStep].color} flex items-center justify-center shrink-0`}
                >
                  {(() => {
                    const Icon = steps[activeStep].icon;
                    return <Icon size={28} className="text-white" />;
                  })()}
                </div>

                {/* Details */}
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-white mb-2">
                    Step {steps[activeStep].id}: {steps[activeStep].title}
                  </h4>
                  <p className="text-zinc-400 mb-4">
                    {steps[activeStep].description}
                  </p>

                  {/* Bullet points */}
                  <div className="grid sm:grid-cols-3 gap-3">
                    {steps[activeStep].details.map((detail, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-start gap-2 p-3 rounded-lg bg-zinc-950/50 border border-zinc-800/50"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0" />
                        <span className="text-sm text-zinc-400">{detail}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Visual decoration */}
                <div className="hidden lg:block relative w-32 h-32">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0"
                  >
                    <div className={`absolute inset-0 rounded-full border-2 border-dashed border-zinc-700`} />
                  </motion.div>
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-2"
                  >
                    <div className={`absolute inset-0 rounded-full border border-zinc-600`} />
                  </motion.div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl">{['🔍', '⬇️', '⚙️', '⚡', '🛡️'][activeStep]}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default WorkflowDiagram;
