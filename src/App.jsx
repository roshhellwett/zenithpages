import { motion } from 'framer-motion';
import { Terminal, Package, Search, Download, ArrowUpDown, Sparkles, Code2, Cpu, Menu, X } from 'lucide-react';
import { FaGithub, FaFacebook } from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';
import projectsData from './projects.json';

// Components
import ParticleBackground from './components/ParticleBackground';
import AnimatedTerminal from './components/AnimatedTerminal';
import TiltCard from './components/TiltCard';
import CLIDemo from './components/CLIDemo';
import WorkflowDiagram from './components/WorkflowDiagram';
import StatsSection from './components/StatsSection';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import CustomCursor from './components/CustomCursor';
import { SkeletonGrid } from './components/SkeletonCard';
import Tooltip from './components/Tooltip';
import RippleButton from './components/RippleButton';
import PageLoader from './components/PageLoader';
import NoiseOverlay from './components/NoiseOverlay';
import TypeWriter from './components/TypeWriter';
import ScrollReveal from './components/ScrollReveal';

function App() {
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('stars');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [projects, setProjects] = useState(
    projectsData.map(p => ({ ...p, stars: 0, url: `https://github.com/roshhellwett/${p.repoName}` }))
  );
  const [isLoading, setIsLoading] = useState(true);
  const [pageLoaded, setPageLoaded] = useState(false);

  const containerRef = useRef(null);
  const copyTimeoutRef = useRef(null);

  const filteredProjects = projects
    .filter(p => 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'stars') return b.stars - a.stars;
      if (sortBy === 'name') return a.title.localeCompare(b.title);
      return 0;
    });

  const resultCount = filteredProjects.length;

  useEffect(() => {
    fetch('https://api.github.com/users/roshhellwett/repos?per_page=100')
      .then(res => res.json())
      .then(repos => {
        if (!Array.isArray(repos)) return;
        const updatedProjects = projectsData.map(p => {
          const githubRepo = repos.find(r => r.name.toLowerCase() === p.repoName.toLowerCase());
          return {
            ...p,
            stars: githubRepo ? githubRepo.stargazers_count : 0,
            url: githubRepo ? githubRepo.html_url : `https://github.com/roshhellwett/${p.repoName}`
          };
        });
        updatedProjects.sort((a, b) => b.stars - a.stars);
        setProjects(updatedProjects);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  const copyCommand = (cmd) => {
    navigator.clipboard.writeText(cmd);
    setCopied(cmd);
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
  };

  // Cleanup copy timeout on unmount
  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  return (
    <>
      {/* Page load intro animation */}
      <PageLoader onComplete={() => setPageLoaded(true)} />

      <div ref={containerRef} className={`min-h-screen text-zinc-50 relative overflow-x-hidden font-sans bg-zinc-950 transition-opacity duration-500 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {/* Film grain noise overlay */}
        <NoiseOverlay />

        {/* Custom animated cursor */}
        <CustomCursor />

        {/* Cinematic particle background */}
      <ParticleBackground />
      
      {/* Gradient orbs */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] bg-brand-600/10 rounded-full blur-[150px] animate-blob" />
        <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-blue-900/10 rounded-full blur-[150px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-10%] left-[20%] w-[450px] h-[450px] sm:w-[650px] sm:h-[650px] bg-purple-900/10 rounded-full blur-[150px] animate-blob animation-delay-4000" />
      </div>

      {/* Background grid */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid opacity-20 mask-radial" />
      </div>

      {/* Keyboard shortcuts / Command palette */}
      <KeyboardShortcuts />

      {/* Navbar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 w-full z-50 glass-panel border-b border-zinc-800/50"
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-16 h-16 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-2 sm:gap-3 font-bold text-lg sm:text-xl tracking-tight"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-brand-500/20 blur-lg rounded-lg" />
              <div className="relative bg-brand-500/10 p-2 rounded-lg border border-brand-500/20">
                <Sparkles className="text-brand-400" size={20} />
              </div>
            </div>
            <span className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Zenith <span className="font-normal text-zinc-500">Registry</span>
            </span>
          </motion.div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <a 
              href="#packages" 
              className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <Package size={16} />
              Packages
            </a>
            <a 
              href="#demo" 
              className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <Terminal size={16} />
              Demo
            </a>
            <a 
              href="https://github.com/roshhellwett" 
              target="_blank" 
              rel="noreferrer" 
              className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-2 group"
            >
              <FaGithub size={16} className="group-hover:rotate-12 transition-transform" />
              GitHub
            </a>
            <a 
              href="https://www.facebook.com/zenithopensourceprojects" 
              target="_blank" 
              rel="noreferrer" 
              className="text-sm text-zinc-400 hover:text-blue-500 transition-colors flex items-center gap-2"
            >
              <FaFacebook size={16} />
              Community
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-3 text-zinc-400 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        <motion.div
          initial={false}
          animate={{ height: isMobileMenuOpen ? 'auto' : 0, opacity: isMobileMenuOpen ? 1 : 0 }}
          className="md:hidden overflow-hidden border-t border-zinc-800/50"
        >
          <div className="px-4 py-4 space-y-3">
            <a href="#packages" className="block py-2 text-zinc-400 hover:text-white transition-colors">Packages</a>
            <a href="#demo" className="block py-2 text-zinc-400 hover:text-white transition-colors">Demo</a>
            <a href="https://github.com/roshhellwett" target="_blank" rel="noreferrer" className="block py-2 text-zinc-400 hover:text-white transition-colors">GitHub</a>
            <a href="https://www.facebook.com/zenithopensourceprojects" target="_blank" rel="noreferrer" className="block py-2 text-zinc-400 hover:text-blue-500 transition-colors">Community</a>
          </div>
        </motion.div>
      </motion.nav>

      {/* Hero Section */}
      <main className="pt-28 sm:pt-36 lg:pt-44 pb-10 sm:pb-16 px-4 sm:px-6 md:px-8 lg:px-16 w-full max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-10 lg:gap-16 mb-20 sm:mb-28">
          {/* Left content */}
          <div className="flex flex-col items-start text-left max-w-2xl w-full">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-2 text-brand-400 font-semibold tracking-wider uppercase text-xs mb-6 px-4 py-2 rounded-full border border-brand-500/20 bg-brand-500/10"
            >
              <Cpu size={14} className="animate-pulse" />
              Open Source Developer Tools
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-br from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent leading-[1.1]"
            >
              Developer
              <br />
              <span className="bg-gradient-to-r from-brand-400 via-blue-400 to-brand-400 bg-clip-text text-transparent">
                {pageLoaded && (
                  <TypeWriter 
                    text="Superpowers" 
                    speed={80} 
                    delay={800}
                    cursorStyle="block"
                  />
                )}
              </span>
              <br />
              <span className="text-zinc-600">Unleashed</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-lg sm:text-xl text-zinc-400 max-w-xl leading-relaxed mb-8"
            >
              Precision-crafted CLI tools that transform tedious setup tasks into 
              <span className="text-brand-400"> one-line commands</span>. Built by developers, for developers.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Tooltip content="Browse all 7 CLI tools" delay={500}>
                <RippleButton
                  variant="primary"
                  className="inline-flex items-center gap-2 px-6 py-3"
                  onClick={() => window.location.href = '#packages'}
                >
                  <Download size={18} />
                  Browse Tools
                </RippleButton>
              </Tooltip>
              <Tooltip content="See live terminal demo" delay={500}>
                <RippleButton
                  variant="secondary"
                  className="inline-flex items-center gap-2 px-6 py-3"
                  onClick={() => window.location.href = '#demo'}
                >
                  <Terminal size={18} />
                  See Demo
                </RippleButton>
              </Tooltip>
            </motion.div>

            {/* Quick stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex items-center gap-6 mt-10 pt-8 border-t border-zinc-800/50"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-blue-500 border-2 border-zinc-950 flex items-center justify-center text-xs font-bold"
                  >
                    {['⚡', '🚀', '💻', '🔧'][i - 1]}
                  </div>
                ))}
              </div>
              <div className="text-sm text-zinc-500">
                <span className="text-zinc-300 font-semibold">2,500+</span> developers trust Zenith tools
              </div>
            </motion.div>
          </div>

          {/* Right - Animated Terminal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-lg lg:max-w-xl"
          >
            <AnimatedTerminal />
          </motion.div>
        </div>

        {/* Workflow Diagram Section */}
        <ScrollReveal delay={0.1}>
          <WorkflowDiagram />
        </ScrollReveal>

        {/* CLI Demo Section */}
        <div id="demo">
          <ScrollReveal delay={0.1}>
            <CLIDemo />
          </ScrollReveal>
        </div>

        {/* Stats Section */}
        <ScrollReveal delay={0.1}>
          <StatsSection projects={projects} />
        </ScrollReveal>

        {/* Packages Registry Section */}
        <div id="packages" className="border-t border-zinc-800/50 pt-16 sm:pt-24 scroll-mt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 sm:mb-12 gap-4"
          >
            <div>
              <motion.div
                initial={{ scale: 0.9 }}
                whileInView={{ scale: 1 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-medium mb-3"
              >
                <Code2 size={12} />
                pip install ready
              </motion.div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight flex items-center gap-3">
                <Download className="text-brand-500 shrink-0" />
                Available Packages
              </h2>
              <p className="text-zinc-500 mt-2 text-sm sm:text-base">
                {resultCount} {resultCount === 1 ? 'package' : 'packages'} available
                {searchQuery && ` for "${searchQuery}"`}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-2 bg-zinc-900/50 border border-zinc-800 px-3 sm:px-4 py-2.5 rounded-xl text-sm text-zinc-400 w-full sm:w-auto focus-within:border-brand-500/30 transition-colors">
                <Search size={16} className="shrink-0" />
                <input
                  type="text"
                  placeholder="Search packages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-zinc-100 placeholder-zinc-500 w-full min-w-0 sm:min-w-[200px]"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSortBy(sortBy === 'stars' ? 'name' : 'stars')}
                className="flex justify-center items-center gap-2 bg-zinc-900/50 border border-zinc-800 px-4 py-2.5 rounded-xl text-sm text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 transition-colors whitespace-nowrap w-full sm:w-auto"
              >
                <ArrowUpDown size={16} />
                {sortBy === 'stars' ? ' Stars' : ' A-Z'}
              </motion.button>
            </div>
          </motion.div>

          {/* Loading state - Skeleton shimmer */}
          {isLoading && <SkeletonGrid count={projectsData.length} />}

          {/* Packages grid */}
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6"
          >
            {filteredProjects.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="col-span-full text-center py-16 text-zinc-500"
              >
                <Search size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-lg">No packages found</p>
                <p className="text-sm mt-2">Try a different search term</p>
              </motion.div>
            ) : filteredProjects.map((project, index) => (
              <TiltCard
                key={project.title}
                project={project}
                copied={copied}
                onCopy={copyCommand}
                index={index}
              />
            ))}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 py-12 px-4 sm:px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-brand-500/10 p-2 rounded-lg border border-brand-500/20">
                <Sparkles className="text-brand-400" size={18} />
              </div>
              <span className="font-bold text-zinc-300">
                Zenith <span className="font-normal text-zinc-500">Registry</span>
              </span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-zinc-500">
              <span>Built by roshhellwett</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Open Source MIT License</span>
            </div>

            <div className="flex items-center gap-3">
              <Tooltip content="View GitHub Profile" position="top">
                <motion.a
                  href="https://github.com/roshhellwett"
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2.5 rounded-xl bg-zinc-900/50 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 hover:bg-zinc-800/50 transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/10"
                >
                  <FaGithub size={18} />
                </motion.a>
              </Tooltip>
              <Tooltip content="Join Facebook Community" position="top">
                <motion.a
                  href="https://www.facebook.com/zenithopensourceprojects"
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2.5 rounded-xl bg-zinc-900/50 border border-zinc-800 text-zinc-400 hover:text-blue-500 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
                >
                  <FaFacebook size={18} />
                </motion.a>
              </Tooltip>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-zinc-800/30">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600">
              <p>© 2026 Zenith Open Source. MIT Licensed.</p>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  All systems operational
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}

export default App;
