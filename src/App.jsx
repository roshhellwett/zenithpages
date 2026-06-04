import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpDown,
  CheckCircle2,
  ExternalLink,
  Menu,
  Package,
  Search,
  Sparkles,
  Terminal,
  X,
} from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { useState, useEffect, useRef, useCallback } from 'react';
import projectsData from './projects.json';
import { fetchGitHubRepos, APIError } from './utils/api';

import AnimatedTerminal from './components/AnimatedTerminal';
import PackageCard from './components/PackageCard';
import CLIDemo from './components/CLIDemo';
import WorkflowDiagram from './components/WorkflowDiagram';
import StatsSection from './components/StatsSection';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import { SkeletonGrid } from './components/SkeletonCard';

const navItems = [
  { href: '#tools', icon: Package, label: 'Tools' },
  { href: '#workflow', icon: CheckCircle2, label: 'Workflow' },
  { href: '#demo', icon: Terminal, label: 'Demo' },
];

const logoSrc = `${import.meta.env.BASE_URL}favicon.ico`;

function BrandMark({ className = 'h-8 w-8' }) {
  return (
    <span className={`flex items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-950/[0.08] ${className}`}>
      <img src={logoSrc} alt="" className="h-[72%] w-[72%] object-contain" aria-hidden="true" />
    </span>
  );
}

const categories = [
  { value: 'all', label: 'All' },
  { value: 'audio', label: 'Audio' },
  { value: 'terminal', label: 'Terminal' },
  { value: 'docs', label: 'Docs' },
  { value: 'setup', label: 'Setup' },
  { value: 'system', label: 'System' },
];

const categoryByRepo = {
  projectpulsewire: 'audio',
  projectkittythemes: 'terminal',
  projectreadmegen: 'docs',
  projectdevsetup: 'setup',
  projectgrub: 'system',
  projectvscodetemplates: 'setup',
  projectwinactivation: 'system',
};

const enrichProject = (project) => ({
  ...project,
  category: categoryByRepo[project.repoName] || 'setup',
  stars: 0,
  url: `https://github.com/roshhellwett/${project.repoName}`,
});

function Navbar({ isMobileMenuOpen, setIsMobileMenuOpen }) {
  return (
    <motion.nav
      initial={{ y: -18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div className="absolute inset-0 border-b border-slate-950/[0.08] bg-white/78 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/68" />
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#" className="flex items-center gap-2.5 select-none" aria-label="Zenith home">
          <BrandMark />
          <span className="text-sm font-semibold text-slate-950">Zenith</span>
        </a>

        <div className="hidden items-center gap-1 rounded-full border border-slate-950/[0.08] bg-white/70 p-1 shadow-sm md:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-950 hover:text-white"
            >
              <item.icon size={14} />
              {item.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <a
            href="https://github.com/roshhellwett"
            target="_blank"
            rel="noreferrer"
            className="icon-button"
            aria-label="Open GitHub profile"
          >
            <FaGithub size={17} />
          </a>
          <a
            href="https://github.com/roshhellwett/zenithpages"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.98]"
          >
            Source
            <ExternalLink size={14} />
          </a>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="icon-button md:hidden"
          aria-label="Toggle menu"
          type="button"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden border-b border-slate-950/[0.08] bg-white/92 backdrop-blur-2xl"
          >
            <div className="mx-auto max-w-7xl px-4 py-3">
              {[...navItems, { href: 'https://github.com/roshhellwett', icon: FaGithub, label: 'GitHub', external: true }].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noreferrer' : undefined}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  <item.icon size={17} />
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

function Section({ id, className = '', children }) {
  return (
    <section id={id} className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </section>
  );
}

function Eyebrow({ icon: Icon, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-950/[0.08] bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm"
    >
      {Icon && <Icon size={13} className="text-sky-600" />}
      {children}
    </motion.div>
  );
}

function SectionHeading({ eyebrow, icon, title, text, center = false }) {
  return (
    <div className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {eyebrow && <Eyebrow icon={icon}>{eyebrow}</Eyebrow>}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.04 }}
        className="text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl"
      >
        {title}
      </motion.h2>
      {text && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08 }}
          className={`mt-4 text-base leading-7 text-slate-600 ${center ? 'mx-auto' : ''}`}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}

function App() {
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('stars');
  const [category, setCategory] = useState('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [projects, setProjects] = useState(projectsData.map(enrichProject));
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const copyTimeoutRef = useRef(null);
  const searchInputRef = useRef(null);

  const filteredProjects = projects
    .filter((project) => {
      const query = searchQuery.toLowerCase();
      const matchesQuery =
        project.title.toLowerCase().includes(query) ||
        project.repoName.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.installCommand.toLowerCase().includes(query);
      const matchesCategory = category === 'all' || project.category === category;
      return matchesQuery && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'stars') return b.stars - a.stars || a.title.localeCompare(b.title);
      return a.title.localeCompare(b.title);
    });

  const loadRepositories = useCallback(async () => {
    try {
      setIsLoading(true);
      setApiError(null);

      const repos = await fetchGitHubRepos('roshhellwett');
      const updatedProjects = projectsData.map((project) => {
        const baseProject = enrichProject(project);
        const githubRepo = repos.find((repo) => repo.name.toLowerCase() === project.repoName.toLowerCase());
        return {
          ...baseProject,
          stars: githubRepo ? githubRepo.stargazers_count : 0,
          url: githubRepo ? githubRepo.html_url : baseProject.url,
        };
      });

      setProjects(updatedProjects);
    } catch (error) {
      console.error('Failed to fetch repositories:', error);
      setApiError({
        message: error instanceof APIError
          ? error.message
          : 'GitHub data could not be refreshed. Local package details are still available.',
        canRetry: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadRepositories();
  }, [loadRepositories]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === '/') {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => () => {
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
  }, []);

  const copyCommand = useCallback((command) => {
    navigator.clipboard.writeText(command).catch((error) => {
      console.error('Failed to copy:', error);
    });
    setCopied(command);
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    copyTimeoutRef.current = setTimeout(() => setCopied(false), 1800);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden bg-[#f5f5f7] text-slate-800">
      <div className="fixed inset-0 -z-10 bg-page-sheen" />
      <KeyboardShortcuts />
      <Navbar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

      <AnimatePresence>
        {apiError && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="fixed inset-x-0 top-20 z-40 flex justify-center px-4"
          >
            <div className="flex w-full max-w-xl items-start gap-3 rounded-2xl border border-amber-300/70 bg-amber-50/90 px-4 py-3 text-sm text-amber-900 shadow-lg shadow-amber-950/5 backdrop-blur-xl">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-amber-600" />
              <div className="flex-1">
                <p>{apiError.message}</p>
                {apiError.canRetry && (
                  <button
                    onClick={() => loadRepositories()}
                    className="mt-1 font-semibold text-amber-800 underline-offset-4 hover:underline"
                    type="button"
                  >
                    Refresh
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        <Section className="pt-28 sm:pt-36">
          <div className="grid items-center gap-12 pb-16 lg:grid-cols-[1fr_0.9fr] lg:gap-16 lg:pb-24">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-950/[0.08] bg-white/80 px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm"
              >
                <Sparkles size={13} className="text-sky-600" />
                Curated open-source CLI tools
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-4xl text-5xl font-semibold tracking-normal text-slate-950 sm:text-6xl lg:text-7xl"
              >
                Find the right Zenith tool without hunting through repos.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.12 }}
                className="mt-6 max-w-2xl text-lg leading-8 text-slate-600"
              >
                A polished home for practical developer utilities: audio presets, terminal themes,
                README generation, editor setup, boot themes, and system workflows.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.2 }}
                className="mt-8 flex flex-col gap-3 sm:flex-row"
              >
                <a
                  href="#tools"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:bg-slate-800 active:scale-[0.98]"
                >
                  Browse tools
                  <ArrowRight size={16} />
                </a>
                <a
                  href="#demo"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-950/[0.1] bg-white/80 px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-950/[0.18] hover:bg-white active:scale-[0.98]"
                >
                  Watch a CLI run
                  <Terminal size={16} />
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-10 grid max-w-xl grid-cols-3 gap-3"
              >
                {[
                  ['7', 'tools'],
                  ['1 line', 'installs'],
                  ['MIT', 'licensed'],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-2xl border border-slate-950/[0.08] bg-white/70 p-4 shadow-sm">
                    <p className="text-2xl font-semibold text-slate-950">{value}</p>
                    <p className="mt-1 text-xs font-medium uppercase tracking-[0.08em] text-slate-500">{label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            <AnimatedTerminal />
          </div>
        </Section>

        <Section id="tools" className="scroll-mt-24 py-16 sm:py-24">
          <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Tool library"
              icon={Package}
              title={`${filteredProjects.length} tools ready to install`}
              text="Search by name, purpose, or install command. Every card keeps the command, version, GitHub link, and status easy to scan."
            />

            <div className="w-full max-w-xl space-y-3 lg:w-[32rem]">
              <div className="flex items-center gap-2 rounded-2xl border border-slate-950/[0.08] bg-white/82 px-4 py-3 shadow-sm focus-within:border-sky-400 focus-within:ring-4 focus-within:ring-sky-100">
                <Search size={18} className="shrink-0 text-slate-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search tools, setup, README, audio..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="w-full bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
                />
                <button
                  onClick={() => setSortBy(sortBy === 'stars' ? 'name' : 'stars')}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-200"
                  type="button"
                >
                  <ArrowUpDown size={13} />
                  {sortBy === 'stars' ? 'Stars' : 'A-Z'}
                </button>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1">
                {categories.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setCategory(item.value)}
                    className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold transition ${
                      category === item.value
                        ? 'bg-slate-950 text-white shadow-sm'
                        : 'border border-slate-950/[0.08] bg-white/70 text-slate-600 hover:bg-white'
                    }`}
                    type="button"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {isLoading && <SkeletonGrid count={projectsData.length} />}

          {!isLoading && (
            <motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProjects.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full rounded-3xl border border-slate-950/[0.08] bg-white/70 px-6 py-16 text-center shadow-sm"
                >
                  <Search size={34} className="mx-auto mb-4 text-slate-300" />
                  <p className="font-semibold text-slate-900">No tools found</p>
                  <p className="mt-1 text-sm text-slate-500">Try a different search or category.</p>
                </motion.div>
              ) : filteredProjects.map((project, index) => (
                <PackageCard
                  key={project.title}
                  project={project}
                  copied={copied}
                  onCopy={copyCommand}
                  index={index}
                />
              ))}
            </motion.div>
          )}
        </Section>

        <Section id="workflow" className="scroll-mt-24 py-16 sm:py-24">
          <WorkflowDiagram />
        </Section>

        <Section className="py-16 sm:py-24">
          <StatsSection projects={projects} />
        </Section>

        <Section id="demo" className="scroll-mt-24 py-16 sm:py-24">
          <CLIDemo />
        </Section>
      </main>

      <footer className="border-t border-slate-950/[0.08] bg-white/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2.5">
              <BrandMark />
              <div>
                <p className="text-sm font-semibold text-slate-950">Zenith</p>
                <p className="text-xs text-slate-500">Open-source tools by roshhellwett</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a href="https://github.com/roshhellwett" target="_blank" rel="noreferrer" className="icon-button" aria-label="Open GitHub profile">
                <FaGithub size={17} />
              </a>
              <a href="https://github.com/roshhellwett/zenithpages" target="_blank" rel="noreferrer" className="icon-button" aria-label="Open source repository">
                <ExternalLink size={17} />
              </a>
            </div>
          </div>
          <div className="flex flex-col gap-2 border-t border-slate-950/[0.06] pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Zenith Open Source. MIT licensed.</p>
            <p className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Package data available
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

Navbar.propTypes = {
  isMobileMenuOpen: PropTypes.bool.isRequired,
  setIsMobileMenuOpen: PropTypes.func.isRequired,
};

Section.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

Eyebrow.propTypes = {
  icon: PropTypes.elementType,
  children: PropTypes.node.isRequired,
};

BrandMark.propTypes = {
  className: PropTypes.string,
};

SectionHeading.propTypes = {
  eyebrow: PropTypes.string,
  icon: PropTypes.elementType,
  title: PropTypes.string.isRequired,
  text: PropTypes.string,
  center: PropTypes.bool,
};
