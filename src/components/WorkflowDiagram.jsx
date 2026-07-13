import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Download, Package, Settings, ShieldCheck, Sparkles, Zap } from 'lucide-react';

const steps = [
  {
    title: 'Discover',
    icon: Package,
    description: 'Scan the curated library by workflow, category, and command.',
    details: ['Clear tool purpose', 'Version visibility', 'GitHub source link'],
  },
  {
    title: 'Install',
    icon: Download,
    description: 'Copy one command and install directly from your terminal.',
    details: ['pip install packages', 'No buried repo search', 'Fast command access'],
  },
  {
    title: 'Configure',
    icon: Settings,
    description: 'Use interactive prompts and sensible defaults where tools need setup.',
    details: ['Backups when needed', 'Environment checks', 'Beginner-friendly flows'],
  },
  {
    title: 'Run',
    icon: Zap,
    description: 'Start using the utility immediately in your development workflow.',
    details: ['CLI-first UX', 'Readable output', 'Practical automation'],
  },
  {
    title: 'Trust',
    icon: ShieldCheck,
    description: 'Inspect the source, track updates, and use tools that stay maintainable.',
    details: ['Open source', 'Active projects', 'MIT license'],
  },
];

const WorkflowDiagram = () => {
  const [active, setActive] = useState(0);
  const ActiveIcon = steps[active].icon;

  return (
    <div>
      <div className="mb-8 max-w-2xl">
        <div className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-[var(--color-amber)]/10 px-3 py-1 text-[11px] font-semibold text-[var(--color-amber)]">
          <Sparkles size={12} />
          Workflow
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-3xl lg:text-4xl">
          From repo discovery to a running command.
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--color-text-secondary)] sm:text-base sm:leading-7">
          Zenith keeps the useful parts of a GitHub profile visible and removes the friction around finding, installing, and trying each tool.
        </p>
      </div>

      <div className="relative grid gap-3 md:grid-cols-5">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = active === index;

          return (
            <button
              key={step.title}
              onClick={() => setActive(index)}
              onMouseEnter={() => setActive(index)}
              className={`group relative rounded-xl border p-4 text-left transition-all duration-300 ${
                isActive
                  ? 'border-[var(--color-amber)]/50 bg-[var(--color-node-bg)] text-white shadow-lg shadow-black/20 scale-[1.02]'
                  : 'border-[var(--color-border)] bg-[var(--color-surface)]/70 backdrop-blur-md text-[var(--color-text-secondary)] shadow-sm hover:bg-[var(--color-sidebar-hover)]/80 hover:border-[var(--color-amber)]/20'
              }`}
              type="button"
            >
              {index === active && <span className="absolute -inset-[1px] rounded-xl bg-gradient-to-b from-[var(--color-amber)]/20 to-transparent pointer-events-none" />}
              <div className="relative mb-4 flex items-center justify-between">
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 ${isActive ? 'bg-white text-[var(--color-node-bg)] shadow-sm scale-110' : 'bg-[var(--color-cream)]/70 text-[var(--color-text-secondary)]'}`}>
                  <Icon size={18} />
                </span>
                {index < active ? (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 15 }}>
                    <CheckCircle2 size={18} className="text-[var(--color-terminal-green)]" />
                  </motion.span>
                ) : (
                  <span className={`text-xs font-semibold ${isActive ? 'text-white/45' : 'text-[var(--color-text-secondary)]/50'}`}>0{index + 1}</span>
                )}
              </div>
              <div className="relative">
                <h3 className="text-base font-semibold">{step.title}</h3>
                <p className={`mt-2 text-sm leading-6 transition-colors duration-300 ${isActive ? 'text-white/70' : 'text-[var(--color-text-secondary)]'}`}>
                  {step.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={steps[active].title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/70 backdrop-blur-md p-5 shadow-sm"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--color-amber)]/10 text-[var(--color-amber-dark)]">
              <ActiveIcon size={22} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">{steps[active].title}</p>
              <p className="mt-1 text-sm leading-6 text-[var(--color-text-secondary)]">{steps[active].description}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {steps[active].details.map((detail) => (
                <div key={detail} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-cream)]/70 px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] shadow-sm whitespace-nowrap">
                  {detail}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default WorkflowDiagram;
