import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ExternalLink, Star, Copy, Terminal, Download, Cpu, Palette, FileText, Settings, Disc, Monitor } from 'lucide-react';

const iconMap = {
  'PROJECTPULSEWIRE': Disc,
  'PROJECTKITTYTHEMES': Palette,
  'PROJECTREADMEGEN': FileText,
  'PROJECTDEVSETUP': Settings,
  'PROJECTGRUB': Monitor,
  'PROJECTVSCODE': Cpu,
  'PROJECTWINACTIVATION': Download,
};

const TiltCard = ({ project, copied, onCopy, index }) => {
  const cardRef = useRef(null);
  const copyTimeoutRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [localCopied, setLocalCopied] = useState(false);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['8deg', '-8deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-8deg', '8deg']);
  
  // Dynamic shadow based on tilt
  const shadowX = useTransform(mouseXSpring, [-0.5, 0.5], [20, -20]);
  const shadowY = useTransform(mouseYSpring, [-0.5, 0.5], [20, -20]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const handleCopy = (cmd) => {
    onCopy(cmd);
    setLocalCopied(true);
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    copyTimeoutRef.current = setTimeout(() => setLocalCopied(false), 2000);
  };

  const Icon = iconMap[project.title] || Terminal;
  const isCopied = copied === project.installCommand || localCopied;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1]
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        transformStyle: 'preserve-3d',
      }}
      className="relative group"
    >
      {/* Dynamic glow effect */}
      <motion.div
        className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(59, 130, 246, 0.4), rgba(139, 92, 246, 0.4))',
          filter: 'blur(15px)',
        }}
      />

      {/* Realistic dynamic shadow */}
      <motion.div
        className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none"
        style={{
          x: shadowX,
          y: shadowY,
          background: 'rgba(0, 0, 0, 0.4)',
          filter: 'blur(20px)',
          transform: 'translateZ(-50px)',
        }}
      />

      {/* Card content */}
      <motion.div 
        className="relative h-full bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/60 p-5 rounded-2xl overflow-hidden transition-all duration-300 group-hover:border-brand-500/30 group-hover:bg-zinc-900/80"
        style={{ 
          transformStyle: 'preserve-3d',
          boxShadow: isHovered 
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(139, 92, 246, 0.1)' 
            : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        }}
        animate={{
          boxShadow: isHovered 
            ? '0 35px 60px -15px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(139, 92, 246, 0.2), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)'
            : '0 4px 6px -1px rgba(0, 0, 0, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.02)',
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Animated gradient border on hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div 
            className="absolute inset-0 rounded-2xl"
            style={{
              background: 'conic-gradient(from 0deg, transparent, rgba(139, 92, 246, 0.3), transparent, rgba(59, 130, 246, 0.3), transparent)',
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
              WebkitMaskComposite: 'xor',
              padding: '1px',
            }}
          />
        </div>

        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: 'linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.05) 45%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.05) 55%, transparent 60%)',
          }}
          animate={{
            x: isHovered ? ['0%', '200%'] : '0%',
          }}
          transition={{
            duration: 0.8,
            ease: 'easeInOut',
          }}
        />

        {/* Content wrapper with 3D depth */}
        <div style={{ transform: 'translateZ(30px)' }}>
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500/20 to-blue-500/20 border border-brand-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Icon className="w-5 h-5 text-brand-400" />
              </div>
              <div>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-bold text-zinc-100 hover:text-brand-400 transition-colors flex items-center gap-1.5"
                >
                  {project.title}
                  <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500" />
                </a>
                <div className="flex items-center gap-2 mt-1">
                  {project.version && (
                    <span className="text-xs font-mono text-zinc-500 bg-zinc-950/80 px-1.5 py-0.5 rounded border border-zinc-800">
                      v{project.version}
                    </span>
                  )}
                  {project.stars > 0 && (
                    <div className="flex items-center gap-1 text-xs font-medium text-zinc-400">
                      <Star size={10} className="text-yellow-500 fill-yellow-500/30" />
                      {project.stars}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-zinc-400 text-sm leading-relaxed mb-4 line-clamp-3 group-hover:text-zinc-300 transition-colors">
            {project.description}
          </p>
        </div>

        {/* Install command section */}
        <div 
          className="mt-auto pt-4 border-t border-zinc-800/50"
          style={{ transform: 'translateZ(20px)' }}
        >
          <p className="text-xs font-semibold text-zinc-600 mb-2 uppercase tracking-wider">
            Install Command
          </p>
          <motion.div
            onClick={() => handleCopy(project.installCommand)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
              isCopied 
                ? 'bg-green-500/10 border-green-500/30' 
                : 'bg-black/40 border-zinc-800 hover:border-brand-500/30 hover:bg-black/60'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <Terminal size={14} className={`shrink-0 ${isCopied ? 'text-green-400' : 'text-brand-500'}`} />
              <code className={`font-mono text-xs truncate ${isCopied ? 'text-green-400' : 'text-zinc-300'}`}>
                {project.installCommand}
              </code>
            </div>
            
            <motion.div
              initial={false}
              animate={{
                scale: isCopied ? [1, 1.2, 1] : 1,
              }}
              transition={{ duration: 0.2 }}
              className="shrink-0 ml-2"
            >
              {isCopied ? (
                <span className="text-green-400 text-xs font-medium">Copied!</span>
              ) : (
                <Copy size={14} className="text-zinc-500 group-hover:text-zinc-300 transition-colors" />
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Floating particles on hover */}
        {isHovered && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-brand-400/50 rounded-full pointer-events-none"
                initial={{ 
                  x: Math.random() * 200, 
                  y: 200,
                  opacity: 0 
                }}
                animate={{ 
                  y: -20,
                  opacity: [0, 1, 0],
                }}
                transition={{ 
                  duration: 1.5,
                  delay: i * 0.2,
                  repeat: Infinity,
                }}
              />
            ))}
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default TiltCard;
