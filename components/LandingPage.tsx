'use client';

import { motion } from 'framer-motion';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="flex flex-col items-center w-full max-w-md"
      >
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-7xl font-bold text-foreground text-center"
        >
          Seva Eats
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-destructive text-sm md:text-base tracking-widest mt-6 mb-12 text-center"
        >
          {"FOOD\u2009•\u2009COMMUNITY\u2009•\u2009SERVICE"}
        </motion.p>

        {/* Logo with background */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-20 flex items-center justify-center"
        >
          <div className="bg-yellow-100 rounded-3xl p-8 md:p-12 flex items-center justify-center">
              <img
                src={require('@/assets/images/logo.png')}
                alt="Seva Eats logo"
                className="w-64 h-64 md:w-96 md:h-96 object-contain"
              />
          </div>
        </motion.div>

        {/* Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onGetStarted}
          className="w-full bg-destructive text-destructive-foreground px-8 py-4 rounded-full text-lg font-semibold hover:bg-destructive/90 transition-colors"
        >
          Get started
        </motion.button>
      </motion.div>
    </div>
  );
}
