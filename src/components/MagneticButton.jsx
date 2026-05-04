import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

const MagneticButton = ({ 
  children, 
  className = '', 
  strength = 0.3,
  onClick,
  ...props 
}) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    
    setPosition({
      x: distanceX * strength,
      y: distanceY * strength,
    });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{ x: position.x, y: position.y }}
      transition={{ 
        type: 'spring',
        stiffness: 150,
        damping: 15,
        mass: 0.1,
      }}
      className={`relative overflow-hidden ${className}`}
      {...props}
    >
      {/* Magnetic glow effect */}
      <motion.div
        className="absolute inset-0 bg-brand-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"
        animate={{
          x: position.x * 0.5,
          y: position.y * 0.5,
        }}
      />
      
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

export default MagneticButton;
