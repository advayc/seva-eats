'use client';

import { motion } from 'framer-motion';

interface AnimationTransitionProps {
  onComplete: () => void;
}

export function AnimationTransition({ onComplete }: AnimationTransitionProps) {
  return (
    <motion.div
      className="fixed inset-0 bg-background flex items-center justify-center z-50"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 1 }}
        animate={{
          scale: [1, 15, 15],
          opacity: [1, 1, 0],
        }}
        transition={{
          duration: 2,
          times: [0, 0.7, 1],
          ease: 'easeInOut',
        }}
        onAnimationComplete={onComplete}
        className="relative"
      >
        <img
          src={require('@/assets/images/logo.png')}
          alt="Seva Eats logo"
          className="w-64 h-64"
        />
      </motion.div>
    </motion.div>
  );
}
