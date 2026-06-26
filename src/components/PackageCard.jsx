import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import {
  Check,
  Copy,
  Disc3,
  Download,
  ExternalLink,
  FileText,
  MonitorCog,
  Paintbrush,
  Settings,
  ShieldCheck,
  Star,
  Terminal,
} from 'lucide-react';

const categoryLabels = {
  audio: 'Audio',
  terminal: 'Terminal',
  docs: 'Docs',
  setup: 'Setup',
  system: 'System',
};

const displayName = (project) => {
  const name = project.repoName.replace(/^project/i, '');
  return name
    .replace(/vscode/i, 'VS Code ')
    .replace(/readmegen/i, 'README Gen')
    .replace(/kittythemes/i, 'Kitty Themes')
    .replace(/pulsewire/i, 'PulseWire')
    .replace(/devsetup/i, 'Dev Setup')
    .replace(/winactivation/i, 'Win Toolkit')
    .replace(/grub/i, 'GRUB Themes')
    .trim();
};

function PackageIcon({ title, size = 19 }) {
  switch (title) {
    case 'PROJECTPULSEWIRE': return <Disc3 size={size} />;
    case 'PROJECTKITTYTHEMES': return <Paintbrush size={size} />;
    case 'PROJECTREADMEGEN': return <FileText size={size} />;
    case 'PROJECTDEVSETUP': return <Settings size={size} />;
    case 'PROJECTGRUB': return <MonitorCog size={size} />;
    case 'PROJECTVSCODE': return <Terminal size={size} />;
    case 'PROJECTWINACTIVATION': return <ShieldCheck size={size} />;
    default: return <Terminal size={size} />;
  }
}

PackageIcon.propTypes = {
  title: PropTypes.string.isRequired,
  size: PropTypes.number,
};

const PackageCard = ({ project, copied = false, onCopy, index = 0 }) => {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef(null);
  const isActiveCopied = copied === project.installCommand || isCopied;

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const handleCopy = (event) => {
    event.preventDefault();
    event.stopPropagation();
    onCopy(project.installCommand);
    setIsCopied(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsCopied(false), 1800);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="group flex h-full flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/70 backdrop-blur-md p-4 shadow-sm transition-all duration-300 ease-out hover:border-[var(--color-amber)]/30 hover:shadow-lg hover:bg-[var(--color-surface)]/85"
    >
      <a href={project.url} target="_blank" rel="noreferrer" className="flex flex-1 flex-col">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-node-bg)] text-white shadow-sm ring-1 ring-white/10">
              <PackageIcon title={project.title} size={18} />
            </span>
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-amber-dark)] transition-colors">{displayName(project)}</h3>
              <p className="mt-0.5 text-[11px] font-medium text-[var(--color-text-secondary)]">{project.repoName}</p>
            </div>
          </div>
          <ExternalLink size={14} className="mt-1 shrink-0 text-[var(--color-border)] transition-all group-hover:text-[var(--color-amber)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>

        <p className="line-clamp-2 min-h-[3rem] text-sm leading-6 text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-colors">
          {project.description}
        </p>

        <div className="mt-auto pt-4 flex flex-wrap items-center gap-1.5">
          <span className="rounded-md border border-[var(--color-border)] bg-[var(--color-amber-light)]/50 px-2 py-0.5 text-[10px] font-semibold text-[var(--color-amber-dark)]">
            {categoryLabels[project.category] || 'Tool'}
          </span>
          {project.version && (
            <span className="rounded-md border border-[var(--color-border)] bg-[var(--color-cream)]/70 px-2 py-0.5 text-[10px] font-semibold text-[var(--color-text-secondary)]">
              v{project.version}
            </span>
          )}
          <span className="inline-flex items-center gap-1 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)]/70 px-2 py-0.5 text-[10px] font-semibold text-[var(--color-amber)]">
            <Star size={10} className={!project.stars ? 'opacity-40' : ''} />
            <span>{project.stars || 0}</span>
          </span>
        </div>
      </a>

      <div className="mt-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-cream)]/70 p-1.5 transition-all duration-300 group-hover:border-[var(--color-amber)]/20 group-hover:bg-[var(--color-cream)]/80">
        <div className="flex items-center gap-2">
          <Download size={13} className="ml-1 shrink-0 text-[var(--color-text-secondary)]" />
          <code className="min-w-0 flex-1 truncate font-mono text-[11px] font-medium text-[var(--color-text-primary)]">
            {project.installCommand}
          </code>
          <button
            onClick={handleCopy}
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-all duration-200 ${
              isActiveCopied
                ? 'bg-[var(--color-terminal-green)] text-white shadow-sm scale-105'
                : 'bg-[var(--color-surface)]/70 text-[var(--color-text-secondary)] shadow-sm hover:bg-[var(--color-node-bg)] hover:text-[var(--color-amber)] hover:shadow-md active:scale-90'
            }`}
            aria-label={`Copy ${project.installCommand}`}
            type="button"
          >
            {isActiveCopied ? (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
                <Check size={14} />
              </motion.span>
            ) : (
              <Copy size={13} />
            )}
          </button>
        </div>
      </div>
    </motion.article>
  );
};

PackageCard.propTypes = {
  project: PropTypes.shape({
    title: PropTypes.string.isRequired,
    repoName: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    installCommand: PropTypes.string.isRequired,
    version: PropTypes.string,
    stars: PropTypes.number,
    category: PropTypes.string,
    url: PropTypes.string.isRequired,
  }).isRequired,
  copied: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  onCopy: PropTypes.func.isRequired,
  index: PropTypes.number,
};

export default PackageCard;
