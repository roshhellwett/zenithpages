import { motion, useInView, useAnimation } from 'framer-motion';
import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const ScrollReveal = ({
  children,
  className = '',
  delay = 0,
  duration = 0.5,
  y = 20,
  x = 0,
  once = true,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    } else if (!once) {
      controls.start('hidden');
    }
  }, [isInView, controls, once]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y, x },
        visible: {
          opacity: 1,
          y: 0,
          x: 0,
          transition: { duration, delay, ease: [0.16, 1, 0.3, 1] },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

ScrollReveal.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  delay: PropTypes.number,
  duration: PropTypes.number,
  y: PropTypes.number,
  x: PropTypes.number,
  once: PropTypes.bool,
};

export default ScrollReveal;
