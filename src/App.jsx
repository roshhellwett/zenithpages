import { motion } from 'framer-motion';
import { Terminal, Copy, Code2, Star, ExternalLink, Package, Search, Download, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { FaGithub, FaFacebook } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import projectsData from './projects.json';

void motion;

function App() {
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('stars');
  const [projects, setProjects] = useState(
    projectsData.map(p => ({ ...p, stars: 0, url: `https://github.com/roshhellwett/${p.repoName}` }))
  );

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
      })
      .catch(err => console.error(err));
  }, []);

  const copyCommand = (cmd) => {
    navigator.clipboard.writeText(cmd);
    setCopied(cmd);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen text-zinc-50 relative overflow-hidden font-sans pb-10">
      
      {/* 2026 Animated Background */}
      <div className="fixed inset-0 z-[-1] bg-zinc-950">
        <div className="absolute inset-0 bg-grid opacity-30 mask-radial"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-600/20 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[150px] animate-blob animation-delay-2000"></div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass-panel border-b border-zinc-800/50">
        <div className="w-full px-8 md:px-16 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 font-bold text-xl tracking-tight">
            <div className="bg-brand-500/10 p-1.5 rounded-lg border border-brand-500/20 hidden sm:block">
              <Package className="text-brand-500" size={20} />
            </div>
            <span>Zenith <span className="text-zinc-400 font-normal">Registry</span></span>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://github.com/roshhellwett" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
              <FaGithub size={18} /> <span className="hidden sm:inline">GitHub</span>
            </a>
            <a href="https://www.facebook.com/zenithopensourceprojects" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-blue-500 transition-colors flex items-center gap-2 text-sm font-medium">
              <FaFacebook size={18} /> <span className="hidden sm:inline">Facebook</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section - Left Aligned */}
      <main className="pt-40 pb-16 px-8 md:px-16 w-full mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-16 mb-24">
          <div className="flex flex-col items-start text-left max-w-3xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-brand-400 font-semibold tracking-wider uppercase text-xs mb-6 px-3 py-1 rounded-full border border-brand-500/20 bg-brand-500/10"
            >
              <Terminal size={14} /> Open Source Toolchain
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-8 bg-gradient-to-br from-white via-zinc-200 to-zinc-600 bg-clip-text text-transparent leading-[1.05]"
            >
              The Developer <br/> Utility Registry
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed"
            >
              Explore, download, and integrate highly optimized CLI tools directly from your terminal. Built for modern infrastructure, accessible to everyone.
            </motion.p>
          </div>

          {/* Decorative Terminal/Code Element on Right */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
            className="hidden lg:block w-full max-w-md glass-panel p-6 rounded-2xl border border-zinc-800/50 relative overflow-hidden shadow-2xl"
          >
            <div className="flex gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="font-mono text-sm text-zinc-300 space-y-2">
              <p><span className="text-brand-400">root@zenith</span><span className="text-zinc-500">:~#</span> zenith search audio</p>
              <p className="text-zinc-400">Found 1 package:</p>
              <p className="text-green-400">➜ projectpulsewire (v2.0.0)</p>
              <p className="mt-4"><span className="text-brand-400">root@zenith</span><span className="text-zinc-500">:~#</span> pip install projectpulsewire</p>
              <p className="text-zinc-400">Downloading dependencies...</p>
              <p className="text-green-400">Successfully installed projectpulsewire</p>
            </div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-brand-500/10 blur-3xl"></div>
          </motion.div>
        </div>

        {/* Packages Registry Section */}
        <div className="border-t border-zinc-800/50 pt-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                <Download className="text-brand-500" />
                Available Packages
              </h2>
              <p className="text-zinc-500 mt-2">
                {resultCount} {resultCount === 1 ? 'package' : 'packages'} available
                {searchQuery && ` for "${searchQuery}"`}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <div className="flex items-center gap-2 bg-zinc-900/50 border border-zinc-800 px-4 py-2.5 rounded-xl text-sm text-zinc-400 w-full sm:w-auto">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search packages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-zinc-100 placeholder-zinc-500 w-full min-w-[150px]"
                />
              </div>
              <button
                onClick={() => setSortBy(sortBy === 'stars' ? 'name' : 'stars')}
                className="flex justify-center items-center gap-2 bg-zinc-900/50 border border-zinc-800 px-4 py-2.5 rounded-xl text-sm text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 transition-colors whitespace-nowrap w-full sm:w-auto"
              >
                <ArrowUpDown size={16} />
                {sortBy === 'stars' ? ' Stars' : ' A-Z'}
              </button>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredProjects.length === 0 ? (
              <div className="col-span-full text-center py-16 text-zinc-500">
                <Search size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg">No packages found</p>
                <p className="text-sm mt-2">Try a different search term</p>
              </div>
            ) : filteredProjects.map((project, index) => (
              <ProjectCard 
                key={index}
                title={project.title} 
                desc={project.description}
                cmd={project.installCommand}
                stars={project.stars}
                url={project.url}
                version={project.version}
                copied={copied}
                onCopy={copyCommand}
              />
            ))}
          </motion.div>
        </div>
      </main>

    </div>
  );
}

function ProjectCard({ title, desc, cmd, stars, url, version, copied, onCopy }) {
  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.01 }}
      className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/50 p-6 rounded-2xl hover:border-brand-500/50 hover:bg-zinc-900/60 hover:shadow-[0_0_30px_rgba(139,92,246,0.1)] transition-all flex flex-col justify-between h-full group"
    >
      <div>
        <div className="flex items-start justify-between mb-4 gap-4">
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="min-w-0 flex-1 text-lg font-bold text-zinc-100 hover:text-brand-400 transition-colors flex items-start gap-2 group/link"
          >
            {title}
            <ExternalLink size={14} className="opacity-0 group-hover/link:opacity-100 transition-opacity mt-1 text-zinc-500 shrink-0"/>
          </a>
          <div className="flex shrink-0 items-center gap-2 self-start">
            {version && (
              <span className="text-zinc-400 bg-zinc-950/80 px-2 py-1 rounded-md border border-zinc-800/80 text-xs font-mono font-semibold whitespace-nowrap">
                v{version}
              </span>
            )}
            {stars !== undefined && stars > 0 && (
              <div className="flex items-center gap-1 text-zinc-400 bg-zinc-950/80 px-2.5 py-1 rounded-md border border-zinc-800/80 text-xs font-semibold whitespace-nowrap">
                <Star size={12} className="text-yellow-500 fill-yellow-500/20" />
                {stars}
              </div>
            )}
          </div>
        </div>
        <p className="text-zinc-400 mb-6 text-sm leading-relaxed line-clamp-3">{desc}</p>
      </div>
      
      {/* Installation Command block mimicking npm/PyPI */}
      <div className="mt-auto pt-4 border-t border-zinc-800/50">
        <p className="text-[10px] font-semibold text-zinc-500 mb-2 uppercase tracking-wider">Install via pip</p>
        <div 
          onClick={() => onCopy(cmd)}
          className="bg-black/40 border border-zinc-800 rounded-lg p-3 flex justify-between items-center cursor-pointer hover:border-brand-500/30 hover:bg-black/60 transition-colors"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <Terminal size={14} className="text-brand-500 shrink-0" />
            <code className="font-mono text-sm text-zinc-300 truncate">{cmd}</code>
          </div>
          {copied === cmd ? (
            <span className="text-green-400 text-xs font-medium ml-3 shrink-0">Copied</span>
          ) : (
            <Copy size={14} className="text-zinc-500 group-hover:text-zinc-300 transition-colors ml-3 shrink-0" />
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default App;
