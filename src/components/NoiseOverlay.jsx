import { useEffect, useRef } from 'react';

const NoiseOverlay = () => {
  const canvasRef = useRef(null);
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let frameCount = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    // Handle visibility change to pause animation
    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const noise = () => {
      // Pause when tab not visible
      if (!isVisibleRef.current) {
        animationId = requestAnimationFrame(noise);
        return;
      }

      // Only update every 3rd frame for subtle effect
      frameCount++;
      if (frameCount % 3 !== 0) {
        animationId = requestAnimationFrame(noise);
        return;
      }

      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;

      // Generate noise
      for (let i = 0; i < data.length; i += 16) { // Skip pixels for performance
        const value = Math.random() * 255;
        data[i] = value;     // R
        data[i + 1] = value; // G
        data[i + 2] = value; // B
        data[i + 3] = 8;     // Alpha (very subtle)
      }

      ctx.putImageData(imageData, 0, 0);
      animationId = requestAnimationFrame(noise);
    };

    noise();

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[9998] pointer-events-none opacity-40"
      style={{ 
        mixBlendMode: 'overlay',
        imageRendering: 'pixelated',
      }}
    />
  );
};

export default NoiseOverlay;
