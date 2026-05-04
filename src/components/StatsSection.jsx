import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, Download, Users, Package, GitBranch, Code2, Terminal } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';

const AnimatedCounter = ({ value, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime = null;
    const duration = 2000;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * value));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

const StatsSection = ({ projects }) => {
  const totalStars = projects.reduce((sum, p) => sum + (p.stars || 0), 0);
  const toolCount = projects.length || 7;
  
  const stats = [
    {
      icon: Package,
      value: toolCount,
      suffix: '',
      label: 'Open Source Tools',
      description: 'Production-ready CLI utilities',
      color: 'from-purple-500 to-indigo-500',
    },
    {
      icon: Star,
      value: totalStars || 150,
      suffix: '+',
      label: 'GitHub Stars',
      description: 'Community appreciation',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: Download,
      value: 2500,
      suffix: '+',
      label: 'Total Downloads',
      description: 'PyPI installations',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: GitBranch,
      value: 50,
      suffix: '+',
      label: 'Code Commits',
      description: 'Active development',
      color: 'from-blue-500 to-cyan-500',
    },
  ];

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
            <Code2 size={14} />
            By The Numbers
          </motion.div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Trusted by Developers
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Real metrics from real usage. Every number represents a developer who saved time.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="relative group"
              >
                {/* Glow effect */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-20 blur-xl rounded-2xl transition-opacity duration-500`} />
                
                <div className="relative glass-panel rounded-2xl border border-zinc-800/50 p-6 lg:p-8 text-center overflow-hidden">
                  {/* Background decoration */}
                  <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-5 rounded-full blur-2xl`} />
                  
                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}
                  >
                    <Icon size={24} className="text-white" />
                  </motion.div>

                  {/* Value */}
                  <div className="text-3xl lg:text-4xl font-bold text-white mb-1">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>

                  {/* Label */}
                  <p className="text-zinc-300 font-semibold mb-1">{stat.label}</p>
                  <p className="text-xs text-zinc-500">{stat.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* GitHub activity visualization */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 glass-panel rounded-2xl border border-zinc-800/50 p-6 lg:p-8"
        >
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Left side - contribution graph mock */}
            <div className="flex-1 w-full">
              <div className="flex items-center gap-3 mb-4">
                <FaGithub size={20} className="text-zinc-400" />
                <span className="text-sm font-medium text-zinc-300">Development Activity</span>
              </div>
              
              {/* Contribution grid */}
              <div className="flex gap-1">
                {[...Array(20)].map((_, weekIdx) => (
                  <div key={weekIdx} className="flex flex-col gap-1">
                    {[...Array(7)].map((_, dayIdx) => {
                      const intensity = Math.random();
                      const color = intensity > 0.8 
                        ? 'bg-brand-500' 
                        : intensity > 0.5 
                          ? 'bg-brand-500/60' 
                          : intensity > 0.2 
                            ? 'bg-brand-500/30' 
                            : 'bg-zinc-800';
                      
                      return (
                        <motion.div
                          key={dayIdx}
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: (weekIdx * 7 + dayIdx) * 0.005 }}
                          className={`w-3 h-3 rounded-sm ${color}`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-3 text-xs text-zinc-500">
                <span>Less</span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-sm bg-zinc-800" />
                  <div className="w-3 h-3 rounded-sm bg-brand-500/30" />
                  <div className="w-3 h-3 rounded-sm bg-brand-500/60" />
                  <div className="w-3 h-3 rounded-sm bg-brand-500" />
                </div>
                <span>More</span>
              </div>
            </div>

            {/* Right side - quick facts */}
            <div className="lg:w-80 space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Terminal size={20} className="text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-300">CLI-First Design</p>
                  <p className="text-xs text-zinc-500">Every tool works in terminal</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Code2 size={20} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-300">Pure Python</p>
                  <p className="text-xs text-zinc-500">No external dependencies</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Users size={20} className="text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-300">Open Source</p>
                  <p className="text-xs text-zinc-500">MIT Licensed, PRs welcome</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;
