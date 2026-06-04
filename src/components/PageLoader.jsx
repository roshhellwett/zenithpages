import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const PageLoader = ({ onComplete } = {}) => {
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(true);
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(intervalRef.current);
          timeoutRef.current = setTimeout(() => {
            setShow(false);
            setTimeout(() => onComplete?.(), 400);
          }, 300);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 120);

    return () => {
      clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
          className="fixed inset-0 z-[9999] bg-zinc-950 flex flex-col items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-6">
              <Sparkles size={18} className="text-brand-400" />
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="text-base font-medium text-white/80 mb-1"
          >
            Zenith
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-xs text-white/30 mb-8"
          >
            Loading...
          </motion.p>

          <div className="w-32 h-[2px] bg-white/[0.06] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-brand-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.15 }}
            />
          </div>

          <motion.p className="text-[11px] text-white/20 mt-3 font-mono">
            {Math.min(Math.round(progress), 100)}%
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

PageLoader.propTypes = {
  onComplete: PropTypes.func,
};

export default PageLoader;
