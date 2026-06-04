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
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-950/[0.08] bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
          <Sparkles size={13} className="text-sky-600" />
          Workflow
        </div>
        <h2 className="text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
          From repo discovery to a running command.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600">
          Zenith keeps the useful parts of a GitHub profile visible and removes the friction around finding, installing, and trying each tool.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-5">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = active === index;

          return (
            <button
              key={step.title}
              onClick={() => setActive(index)}
              onMouseEnter={() => setActive(index)}
              className={`group rounded-3xl border p-4 text-left transition duration-300 ${
                isActive
                  ? 'border-slate-950 bg-slate-950 text-white shadow-xl shadow-slate-950/15'
                  : 'border-slate-950/[0.08] bg-white/78 text-slate-700 shadow-sm hover:bg-white'
              }`}
              type="button"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${isActive ? 'bg-white text-slate-950' : 'bg-slate-100 text-slate-600'}`}>
                  <Icon size={18} />
                </span>
                {index < active ? (
                  <CheckCircle2 size={18} className="text-emerald-400" />
                ) : (
                  <span className={`text-xs font-semibold ${isActive ? 'text-white/45' : 'text-slate-400'}`}>0{index + 1}</span>
                )}
              </div>
              <h3 className="text-base font-semibold">{step.title}</h3>
              <p className={`mt-2 text-sm leading-6 ${isActive ? 'text-white/62' : 'text-slate-500'}`}>
                {step.description}
              </p>
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
          transition={{ duration: 0.22 }}
          className="mt-5 rounded-3xl border border-slate-950/[0.08] bg-white/82 p-5 shadow-sm"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
              <ActiveIcon size={24} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-950">{steps[active].title}</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">{steps[active].description}</p>
            </div>
            <div className="grid flex-1 gap-2 sm:grid-cols-3">
              {steps[active].details.map((detail) => (
                <div key={detail} className="rounded-2xl bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600">
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
