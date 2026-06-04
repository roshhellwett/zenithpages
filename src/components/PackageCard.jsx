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

const iconMap = new Map([
  ['PROJECTPULSEWIRE', Disc3],
  ['PROJECTKITTYTHEMES', Paintbrush],
  ['PROJECTREADMEGEN', FileText],
  ['PROJECTDEVSETUP', Settings],
  ['PROJECTGRUB', MonitorCog],
  ['PROJECTVSCODE', Terminal],
  ['PROJECTWINACTIVATION', ShieldCheck],
]);

const categoryLabels = new Map([
  ['audio', 'Audio'],
  ['terminal', 'Terminal'],
  ['docs', 'Docs'],
  ['setup', 'Setup'],
  ['system', 'System'],
]);

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

const PackageCard = ({ project, copied = false, onCopy, index = 0 }) => {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef(null);
  const Icon = iconMap.get(project.title) || Terminal;
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
      whileHover={{ y: -3 }}
      className="group flex h-full flex-col rounded-3xl border border-slate-950/[0.08] bg-white/82 p-4 shadow-sm shadow-slate-950/[0.03] transition duration-300 hover:border-slate-950/[0.14] hover:bg-white hover:shadow-xl hover:shadow-slate-950/[0.07]"
    >
      <a href={project.url} target="_blank" rel="noreferrer" className="flex flex-1 flex-col">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
              <Icon size={19} />
            </span>
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold text-slate-950">{displayName(project)}</h3>
              <p className="mt-0.5 text-xs font-medium text-slate-500">{project.repoName}</p>
            </div>
          </div>
          <ExternalLink size={16} className="mt-1 shrink-0 text-slate-300 transition group-hover:text-slate-500" />
        </div>

        <p className="line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-slate-600">
          {project.description}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700">
            {categoryLabels.get(project.category) || 'Tool'}
          </span>
          {project.version && (
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
              v{project.version}
            </span>
          )}
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
            <Star size={12} />
            {project.stars || 0}
          </span>
        </div>
      </a>

      <div className="mt-5 rounded-2xl border border-slate-950/[0.08] bg-slate-50 p-2">
        <div className="flex items-center gap-2">
          <Download size={15} className="ml-1 shrink-0 text-slate-400" />
          <code className="min-w-0 flex-1 truncate font-mono text-xs font-medium text-slate-700">
            {project.installCommand}
          </code>
          <button
            onClick={handleCopy}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${
              isActiveCopied
                ? 'bg-emerald-500 text-white'
                : 'bg-white text-slate-500 shadow-sm hover:bg-slate-950 hover:text-white'
            }`}
            aria-label={`Copy ${project.installCommand}`}
            type="button"
          >
            {isActiveCopied ? <Check size={16} /> : <Copy size={15} />}
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
