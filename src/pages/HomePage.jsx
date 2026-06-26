import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpDown,
  Search,
  Star,
  X,
} from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import projectsData from '../projects.json';
import { fetchGitHubRepos, APIError } from '../utils/api';

import AnimatedTerminal from '../components/AnimatedTerminal';
import PackageCard from '../components/PackageCard';
import WorkflowDiagram from '../components/WorkflowDiagram';
import StatsSection from '../components/StatsSection';
import { SkeletonGrid } from '../components/SkeletonCard';

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

const HomePage = ({ setApiError }) => {
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('stars');
  const [category, setCategory] = useState('all');
  const [projects, setProjects] = useState(projectsData.map(enrichProject));
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        setIsLoading(true);
        setApiError(null);
        const repos = await fetchGitHubRepos('roshhellwett');
        if (ignore) return;
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
        if (ignore) return;
        console.error('Failed to fetch repositories:', error);
        setApiError({
          message: error instanceof APIError
            ? error.message
            : 'GitHub data could not be refreshed. Local package details are still available.',
          canRetry: true,
        });
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };
    load();
    return () => { ignore = true; };
  }, [setApiError]);

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

  const copyCommand = (command) => {
    navigator.clipboard.writeText(command).catch(console.error);
    setCopied(command);
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    copyTimeoutRef.current = setTimeout(() => setCopied(false), 1800);
  };

  return (
    <main className="relative pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">

        {/* Hero */}
        <div className="mb-16 sm:mb-20 lg:mb-24">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="relative">
              <div className="absolute -inset-x-20 -inset-y-10 bg-[radial-gradient(ellipse_at_30%_30%,rgba(201,127,10,0.06),transparent_60%)] pointer-events-none" />
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="relative text-4xl font-extrabold leading-tight text-[var(--color-text-primary)] sm:text-5xl lg:text-6xl tracking-tight"
              >
                Open-source CLI tools,{' '}
                <span className="relative text-[var(--color-amber)]">curated.<span className="absolute -inset-x-2 -inset-y-1 bg-[var(--color-amber)]/10 blur-xl rounded-full -z-10" /></span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.1 }}
                className="mt-4 max-w-xl text-base leading-7 text-[var(--color-text-secondary)] sm:text-lg"
              >
                A showcase of Python CLI tools &mdash; search, inspect, and install with a single command.
                Every project ships via pip, ready to use.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="mt-6 flex flex-col gap-3 sm:flex-row"
              >
                <a
                  href="#tools"
                  className="group inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-amber)] px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all duration-200 hover:bg-[var(--color-amber-dark)] hover:shadow-lg active:scale-[0.97]"
                >
                  <span>Browse projects</span>
                  <ArrowRight size={16} className="transition-all duration-200 group-hover:translate-x-0.5" />
                </a>
                <a
                  href="https://github.com/roshhellwett"
                  target="_blank" rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]/70 backdrop-blur-md px-5 py-2.5 text-sm font-semibold text-[var(--color-text-primary)] shadow-sm transition hover:bg-[var(--color-sidebar-hover)]/80 active:scale-[0.98]"
                >
                  <FaGithub size={16} />
                  GitHub Profile
                </a>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="hidden lg:block"
            >
              <AnimatedTerminal />
            </motion.div>
          </div>
        </div>

        {/* Workflow */}
        <section id="workflow" className="scroll-mt-24 mb-16 sm:mb-20">
          <WorkflowDiagram />
        </section>

        {/* Tools Section */}
        <section id="tools" className="scroll-mt-24 mb-16 sm:mb-20">
          <div className="mb-4">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-amber)]">Tool Library</span>
          </div>
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">{filteredProjects.length} tools ready to install</h2>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Search by name, purpose, or install command.</p>
            </div>

            <div className="w-full max-w-xl space-y-3 lg:w-[28rem]">
              <div className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]/70 backdrop-blur-md px-3 py-2.5 shadow-sm focus-within:border-[var(--color-amber)] focus-within:ring-2 focus-within:ring-[var(--color-amber)]/20">
                <Search size={16} className="shrink-0 text-[var(--color-text-secondary)]" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-sm font-medium text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-secondary)]/50"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="flex h-6 w-6 items-center justify-center rounded-full text-[var(--color-text-secondary)]/50 hover:text-[var(--color-text-primary)] hover:bg-[var(--color-sidebar-hover)] transition"
                    type="button"
                    aria-label="Clear search"
                  >
                    <X size={13} />
                  </button>
                )}
                <button
                  onClick={() => setSortBy(sortBy === 'stars' ? 'name' : 'stars')}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-cream)]/70 backdrop-blur-md px-2.5 py-1.5 text-[10px] font-semibold text-[var(--color-text-secondary)] transition-all hover:bg-[var(--color-sidebar-hover)]/80 hover:border-[var(--color-amber)]/30 active:scale-95"
                  type="button"
                >
                  <ArrowUpDown size={12} />
                  {sortBy === 'stars' ? 'Stars' : 'A-Z'}
                </button>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1">
                {categories.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setCategory(item.value)}
                    className={`shrink-0 rounded-md px-3 py-1.5 text-[10px] font-semibold transition-all active:scale-95 ${
                      category === item.value
                        ? 'bg-[var(--color-node-bg)] text-[var(--color-node-text)] shadow-sm'
                        : 'border border-[var(--color-border)] bg-[var(--color-surface)]/70 backdrop-blur-md text-[var(--color-text-secondary)] hover:bg-[var(--color-sidebar-hover)]/80 hover:border-[var(--color-amber)]/30'
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
                  className="col-span-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/70 backdrop-blur-md px-6 py-14 text-center shadow-sm"
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--color-cream)]/70">
                    <Search size={24} className="text-[var(--color-text-secondary)]/50" />
                  </div>
                  <p className="font-semibold text-[var(--color-text-primary)]">No tools found</p>
                  <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Try adjusting your search or category.</p>
                </motion.div>
              ) : filteredProjects.map((project, index) => (
                <PackageCard key={project.title} project={project} copied={copied} onCopy={copyCommand} index={index} />
              ))}
            </motion.div>
          )}
        </section>

        {/* Stats */}
        <section id="stats" className="scroll-mt-24 mb-16 sm:mb-20">
          <StatsSection projects={projects} />
        </section>

      </div>
    </main>
  );
};

HomePage.propTypes = {
  setApiError: PropTypes.func.isRequired,
};

export default HomePage;
