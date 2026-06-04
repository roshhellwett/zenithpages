import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { motion, useInView } from 'framer-motion';
import { Code2, Download, GitBranch, Package, ShieldCheck, Sparkles, Star, Terminal } from 'lucide-react';

const heatmapValues = [
  0, 1, 0, 2, 1, 3, 0,
  1, 2, 3, 1, 0, 2, 1,
  2, 3, 4, 2, 1, 3, 2,
  1, 0, 2, 3, 4, 2, 1,
  3, 2, 1, 4, 3, 2, 0,
  1, 3, 2, 1, 4, 3, 2,
  0, 2, 3, 4, 2, 1, 3,
  2, 1, 0, 2, 3, 4, 2,
  3, 4, 2, 1, 3, 2, 1,
  1, 2, 3, 1, 0, 2, 4,
  2, 3, 1, 4, 2, 3, 1,
  0, 1, 2, 3, 4, 2, 3,
];

const heatmapColors = ['#eef2f7', '#dbeafe', '#93c5fd', '#38bdf8', '#0f172a'];

const AnimatedCounter = ({ value, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return undefined;
    let start = null;
    const duration = 1200;
    let frame = 0;

    const animate = (now) => {
      if (!start) start = now;
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(ease * value));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isInView, value]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

const StatsSection = ({ projects = [] }) => {
  const totalStars = projects.reduce((sum, project) => sum + (project.stars || 0), 0);
  const toolCount = projects.length || 7;

  const stats = [
    { icon: Package, value: toolCount, label: 'Tools', sub: 'Curated CLI utilities' },
    { icon: Star, value: totalStars || 150, suffix: '+', label: 'Stars', sub: 'GitHub visibility' },
    { icon: Download, value: 2500, suffix: '+', label: 'Installs', sub: 'Package-ready workflows' },
    { icon: GitBranch, value: 50, suffix: '+', label: 'Updates', sub: 'Active maintenance' },
  ];

  const facts = [
    { icon: Terminal, label: 'CLI-first', sub: 'Designed for direct terminal use' },
    { icon: Code2, label: 'Open source', sub: 'Every project links back to code' },
    { icon: ShieldCheck, label: 'Maintainable', sub: 'Simple installs and visible versions' },
  ];

  return (
    <div className="rounded-[2rem] border border-slate-950/[0.08] bg-white/76 p-4 shadow-xl shadow-slate-950/[0.04] sm:p-6">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-950/[0.08] bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
            <Sparkles size={13} className="text-sky-600" />
            Signal
          </div>
          <h2 className="text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
            A focused tool collection with room to grow.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
            The site turns scattered repository information into a compact catalog users can search, inspect, and act on.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="rounded-3xl border border-slate-950/[0.08] bg-white p-5 shadow-sm"
            >
              <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                <Icon size={19} />
              </span>
              <p className="text-3xl font-semibold text-slate-950">
                <AnimatedCounter value={stat.value} suffix={stat.suffix || ''} />
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-700">{stat.label}</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">{stat.sub}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_22rem]">
        <div className="rounded-3xl border border-slate-950/[0.08] bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-950">Maintenance rhythm</p>
            <p className="text-xs font-medium text-slate-400">recent work</p>
          </div>
          <div className="grid grid-flow-col grid-rows-7 gap-1 overflow-hidden">
            {heatmapValues.map((value, index) => (
              <span
                key={`${value}-${index}`}
                className="h-3 min-w-3 rounded-[4px]"
                style={{ backgroundColor: heatmapColors.at(Math.min(Math.max(value, 0), heatmapColors.length - 1)) }}
              />
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
            <span>Less</span>
            <div className="flex gap-1">
              {heatmapColors.map((color) => (
                <span key={color} className="h-3 w-3 rounded-[4px]" style={{ backgroundColor: color }} />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>

        <div className="space-y-3">
          {facts.map((fact) => {
            const Icon = fact.icon;
            return (
              <div key={fact.label} className="flex items-center gap-3 rounded-3xl border border-slate-950/[0.08] bg-white p-4 shadow-sm">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                  <Icon size={19} />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-slate-950">{fact.label}</span>
                  <span className="block text-sm leading-6 text-slate-500">{fact.sub}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

AnimatedCounter.propTypes = {
  value: PropTypes.number.isRequired,
  suffix: PropTypes.string,
};

StatsSection.propTypes = {
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      stars: PropTypes.number,
      title: PropTypes.string,
    })
  ),
};

export default StatsSection;
