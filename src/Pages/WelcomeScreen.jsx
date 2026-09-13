import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LOADING_DURATION = 2200; // ms visible antes de empezar a desvanecer

const WelcomeScreen = ({ onLoadingComplete }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Le damos tiempo a la animación de salida antes de avisar al padre
      setTimeout(() => {
        onLoadingComplete?.();
      }, 600);
    }, LOADING_DURATION);

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          <motion.img
            src="/logo.png"
            alt="Lumen"
            className="w-28 sm:w-36 md:w-40 select-none"
            draggable="false"
            initial={{ opacity: 0, y: 0 }}
            animate={{
              opacity: 1,
              y: [0, -14, 0],
            }}
            transition={{
              opacity: { duration: 0.6, ease: 'easeOut' },
              y: {
                duration: 2.4,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'loop',
              },
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeScreen;