import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TypeWriter = ({ 
  text, 
  speed = 50, 
  delay = 0, 
  className = '',
  onComplete,
  cursor = true,
  cursorStyle = 'block'
}) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setIsTyping(true);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (!isTyping) return;

    let timeout;
    if (displayText.length < text.length) {
      timeout = setTimeout(() => {
        setDisplayText(text.slice(0, displayText.length + 1));
      }, speed + Math.random() * 20);
    } else {
      onComplete?.();
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [displayText, isTyping, text, speed]);

  // Cursor blink
  useEffect(() => {
    if (!cursor) return;
    
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);

    return () => clearInterval(interval);
  }, [cursor]);

  return (
    <span className={className}>
      {displayText}
      {cursor && (
        <motion.span
          animate={{ opacity: showCursor ? 1 : 0 }}
          transition={{ duration: 0.1 }}
          className={`inline-block ml-1 ${
            cursorStyle === 'block' 
              ? 'w-2 h-[1em] bg-current align-middle' 
              : 'w-px h-[1.2em] bg-current'
          }`}
        />
      )}
    </span>
  );
};

export default TypeWriter;
