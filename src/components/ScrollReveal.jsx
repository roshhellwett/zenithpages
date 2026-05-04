import { motion, useInView, useAnimation } from 'framer-motion';
import { useRef, useEffect } from 'react';

const ScrollReveal = ({ 
  children, 
  className = '',
  delay = 0,
  duration = 0.5,
  y = 30,
  x = 0,
  scale = 1,
  once = true,
  threshold = 0.2,
  amount = 'some'
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once, 
    amount: amount,
  });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    } else if (!once) {
      controls.start('hidden');
    }
  }, [isInView, controls, once]);

  const variants = {
    hidden: {
      opacity: 0,
      y,
      x,
      scale,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: {
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Staggered children reveal
export const StaggerReveal = ({ 
  children, 
  className = '',
  staggerDelay = 0.1,
  duration = 0.5,
  y = 20,
  once = true,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: 'some' });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={containerVariants}
      className={className}
    >
      {Array.isArray(children) ? (
        children.map((child, i) => (
          <motion.div key={i} variants={itemVariants}>
            {child}
          </motion.div>
        ))
      ) : (
        <motion.div variants={itemVariants}>{children}</motion.div>
      )}
    </motion.div>
  );
};

export default ScrollReveal;
