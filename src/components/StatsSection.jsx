import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { motion, useInView } from 'framer-motion';
import { Code2, Download, GitBranch, GitCommit, Package, ShieldCheck, Sparkles, Star, Terminal } from 'lucide-react';

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

const heatmapColors = ['#f5f4f3', '#fef3c7', '#fde68a', '#f59e0b', '#1c1917'];

const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const COLS = 12;
const ROWS = 7;

const monthColMap = (() => {
  const map = {};
  for (let c = 0; c < COLS; c++) {
    const dt = new Date();
    dt.setDate(dt.getDate() - (COLS - 1 - c) * 7);
    const m = dt.getMonth();
    if (!map[m]) map[m] = c;
  }
  return map;
})();
const monthHeaders = Object.entries(monthColMap).map(([m, c]) => ({ label: MONTHS[Number(m)], col: c }));

const getCellData = (index) => {
  const col = Math.floor(index / ROWS);
  const row = index % ROWS;
  const dt = new Date();
  dt.setDate(dt.getDate() - (COLS - 1 - col) * 7 + row - dt.getDay());
  return { col, row, date: dt, value: heatmapValues[index] || 0 };
};

const AnimatedCounter = ({ value, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
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
    { icon: GitCommit, label: 'Well-documented', sub: 'Clear guides for every tool' },
  ];

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/70 backdrop-blur-md p-5 shadow-md sm:p-7">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-[var(--color-amber)]/10 px-3 py-1 text-[11px] font-semibold text-[var(--color-amber)]">
            <Sparkles size={12} />
            Vertices
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-3xl lg:text-4xl">
            A focused tool collection with room to grow.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--color-text-secondary)] sm:text-base sm:leading-7">
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
              transition={{ delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="group rounded-xl border border-[var(--color-border)] bg-[var(--color-cream)]/70 backdrop-blur-md p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:bg-[var(--color-cream)]/85 hover:border-[var(--color-amber)]/20 hover:-translate-y-0.5"
            >
              <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-amber)]/10 text-[var(--color-amber-dark)] transition-all duration-200 group-hover:bg-[var(--color-amber)]/15 group-hover:shadow-sm">
                <Icon size={18} />
              </span>
              <p className="text-3xl font-bold text-[var(--color-text-primary)] tracking-tight">
                <AnimatedCounter value={stat.value} suffix={stat.suffix || ''} />
              </p>
              <p className="mt-1.5 text-sm font-semibold text-[var(--color-text-primary)]">{stat.label}</p>
              <p className="mt-0.5 text-xs leading-5 text-[var(--color-text-secondary)]">{stat.sub}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_22rem]">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-cream)]/70 backdrop-blur-md p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-[var(--color-amber)]" />
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">Maintenance rhythm</p>
            </div>
            <p className="text-[10px] font-medium text-[var(--color-text-secondary)]/35 uppercase tracking-widest">12 weeks</p>
          </div>

          <div className="w-full overflow-hidden">
            <div className="flex flex-col gap-1">
              <div className="relative h-3">
                {monthHeaders.map(({ label, col }) => (
                  <span
                    key={label}
                    className="absolute text-[9px] font-medium text-[var(--color-text-secondary)]/30 uppercase tracking-wider select-none"
                    style={{ left: `${23 + col * 17}px`, visibility: col === 0 ? 'hidden' : 'visible' }}
                  >
                    {label}
                  </span>
                ))}
              </div>
              <div className="grid rounded-[4px] border border-[var(--color-border)]/20 bg-[var(--color-cream)]/30 p-1.5" style={{
                gridTemplateColumns: `${DAY_LABELS.some(Boolean) ? '20px ' : ''}repeat(${COLS}, 14px)`,
                gridTemplateRows: `repeat(${ROWS}, 14px)`,
                gap: '3px',
                backgroundImage: `
                  repeating-linear-gradient(0deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 1px, transparent 1px, transparent calc(14px + 3px)),
                  repeating-linear-gradient(90deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 1px, transparent 1px, transparent calc(14px + 3px))
                `,
              }}>
                {Array.from({ length: ROWS }, (_, row) => (
                  <span key={row} className="h-[14px] text-[9px] leading-[14px] text-[var(--color-text-secondary)]/20 select-none">
                    {DAY_LABELS[row] || ''}
                  </span>
                ))}
                {Array.from({ length: COLS * ROWS }, (_, idx) => {
                  const cell = getCellData(idx);
                  const color = heatmapColors[cell.value] || heatmapColors[0];
                  const isToday = new Date().toDateString() === cell.date.toDateString();
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.3 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.002, duration: 0.18, ease: 'easeOut' }}
                      className="group relative"
                    >
                      <span
                        className={`block h-[14px] w-[14px] rounded-[2px] transition-all duration-150 group-hover:ring-2 group-hover:ring-[var(--color-amber)]/50 group-hover:ring-offset-[1.5px] group-hover:ring-offset-[var(--color-cream)] cursor-default ${isToday ? 'ring-[1.5px] ring-[var(--color-amber)] shadow-[0_0_6px_rgba(201,127,10,0.35)]' : ''}`}
                        style={{ backgroundColor: color }}
                      />
                      <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        <div className="whitespace-nowrap rounded-md bg-[var(--color-text-primary)] px-2 py-1 text-[10px] font-medium text-[var(--color-cream)] shadow-lg">
                          {cell.value > 0 ? `${cell.value} contribution${cell.value !== 1 ? 's' : ''} on ` : 'No activity on '}
                          {cell.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    </motion.div>
                  );
              })}
            </div>
          </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-[10px] text-[var(--color-text-secondary)]/35">
            <span className="text-[9px]">Less</span>
            <div className="flex items-center gap-1">
              {heatmapColors.map((color, i) => (
                <motion.span
                  key={color}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="h-[14px] w-[14px] rounded-[2px] transition-transform hover:scale-125 hover:ring-1 hover:ring-[var(--color-amber)]/40"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <span className="text-[9px]">More</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 content-start">
          {facts.map((fact, i) => {
            const Icon = fact.icon;
            return (
              <motion.div
                key={fact.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="group flex items-start gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/70 backdrop-blur-md p-3.5 shadow-sm transition-all duration-200 hover:shadow-md hover:bg-[var(--color-surface)]/85 hover:border-[var(--color-amber)]/20 hover:-translate-y-0.5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-amber)]/10 text-[var(--color-amber-dark)] transition-all duration-200 group-hover:bg-[var(--color-amber)]/15 group-hover:shadow-sm">
                  <Icon size={16} />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-[var(--color-text-primary)]">{fact.label}</span>
                  <span className="block text-xs leading-5 text-[var(--color-text-secondary)]">{fact.sub}</span>
                </span>
              </motion.div>
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
