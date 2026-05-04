import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const cursorRef = useRef(null);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 400 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Trail positions
  const trail1X = useSpring(cursorX, { damping: 30, stiffness: 200 });
  const trail1Y = useSpring(cursorY, { damping: 30, stiffness: 200 });
  const trail2X = useSpring(cursorX, { damping: 35, stiffness: 150 });
  const trail2Y = useSpring(cursorY, { damping: 35, stiffness: 150 });

  useEffect(() => {
    // Only show custom cursor on desktop
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Check for hoverable elements
    const handleElementHover = (e) => {
      const target = e.target;
      const isHoverable = 
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('hoverable') ||
        target.closest('.hoverable');
      
      setIsHovering(isHoverable);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleElementHover);
    document.body.addEventListener('mouseenter', handleMouseEnter);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleElementHover);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [cursorX, cursorY, isVisible]);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      {/* Hide default cursor */}
      <style>{`
        @media (pointer: fine) {
          * { cursor: none !important; }
        }
      `}</style>

      {/* Trail dots */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] mix-blend-screen"
        style={{
          x: trail2X,
          y: trail2Y,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <div className={`w-2 h-2 rounded-full bg-brand-500/20 transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`} />
      </motion.div>

      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-screen"
        style={{
          x: trail1X,
          y: trail1Y,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <div className={`w-3 h-3 rounded-full bg-brand-500/40 transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`} />
      </motion.div>

      {/* Main cursor */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[10000] mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          animate={{
            scale: isClicking ? 0.8 : isHovering ? 1.5 : 1,
            opacity: isVisible ? 1 : 0,
          }}
          transition={{ duration: 0.15 }}
          className={`relative ${isHovering ? 'w-12 h-12' : 'w-4 h-4'}`}
        >
          {/* Core */}
          <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
            isHovering 
              ? 'border-2 border-white bg-transparent' 
              : 'bg-white'
          }`} />
          
          {/* Glow ring */}
          {!isHovering && (
            <motion.div
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.5, 0.2, 0.5],
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="absolute inset-0 rounded-full bg-brand-500/30 blur-sm"
            />
          )}

          {/* Label on hover */}
          {isHovering && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap"
            >
              <span className="text-xs font-medium text-white bg-brand-500/80 px-2 py-0.5 rounded-full">
                Click
              </span>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* Ambient glow following cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9997]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <div className={`w-[300px] h-[300px] rounded-full bg-brand-500/5 blur-[100px] transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`} />
      </motion.div>
    </>
  );
};

export default CustomCursor;
