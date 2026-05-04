import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RippleButton = ({ 
  children, 
  onClick, 
  className = '', 
  variant = 'primary',
  ...props 
}) => {
  const [ripples, setRipples] = useState([]);
  const buttonRef = useRef(null);
  const timeoutsRef = useRef([]);

  useEffect(() => {
    return () => {
      // Clear all pending timeouts on unmount
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, []);

  const handleClick = useCallback((e) => {
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple = {
      id: Date.now(),
      x,
      y,
      size,
    };

    setRipples(prev => [...prev, newRipple]);

    // Remove ripple after animation
    const timeout = setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      timeoutsRef.current = timeoutsRef.current.filter(t => t !== timeout);
    }, 600);
    
    timeoutsRef.current.push(timeout);

    onClick?.(e);
  }, [onClick]);

  const variants = {
    primary: 'bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/25',
    secondary: 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700',
    ghost: 'bg-transparent hover:bg-zinc-800/50 text-zinc-400 hover:text-white',
  };

  return (
    <motion.button
      ref={buttonRef}
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative overflow-hidden rounded-xl font-semibold transition-colors ${variants[variant]} ${className}`}
      {...props}
    >
      {/* Ripples */}
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.span
            key={ripple.id}
            initial={{ 
              scale: 0, 
              opacity: 0.5,
              x: ripple.x,
              y: ripple.y,
            }}
            animate={{ 
              scale: 2.5, 
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              width: ripple.size,
              height: ripple.size,
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              pointerEvents: 'none',
            }}
          />
        ))}
      </AnimatePresence>

      {/* Button content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>

      {/* Shine effect on hover */}
      <motion.div
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: 'linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.1) 50%, transparent 60%)',
        }}
        initial={false}
        whileHover={{
          x: ['0%', '200%'],
        }}
        transition={{ duration: 0.6 }}
      />
    </motion.button>
  );
};

export default RippleButton;
