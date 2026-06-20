import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/motionPresets';

const FloatingOrb = ({ className, delay = 0, duration = 8 }) => (
  <motion.div
    className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
    animate={{
      y: [0, -24, 0, 18, 0],
      x: [0, 12, -8, 0],
      scale: [1, 1.08, 0.95, 1.04, 1],
    }}
    transition={{
      duration,
      repeat: Infinity,
      ease: 'easeInOut',
      delay,
    }}
  />
);

const AnimatedBackground = ({ children, className = '' }) => (
  <div className={`relative overflow-hidden ${className}`}>
    <FloatingOrb className="w-64 h-64 bg-orange-400/20 top-10 -left-20" delay={0} />
    <FloatingOrb className="w-72 h-72 bg-red-400/15 top-1/3 -right-24" delay={1.5} duration={10} />
    <FloatingOrb className="w-48 h-48 bg-amber-300/20 bottom-10 left-1/3" delay={0.8} duration={9} />
    {children}
  </div>
);

const PageSection = ({
  children,
  className = '',
  delay = 0,
  ...motionProps
}) => (
  <motion.section
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    className={className}
    {...motionProps}
  >
    {children}
  </motion.section>
);

const AnimatedCard = ({ children, className = '', delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    whileHover={{ y: -6, scale: 1.02 }}
    className={className}
  >
    {children}
  </motion.div>
);

const PageHeader = ({ title, subtitle, className = '' }) => (
  <motion.div
    {...fadeInUp}
    className={`text-center ${className}`}
  >
    <motion.h1
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="text-5xl md:text-6xl font-bold text-white mb-4"
    >
      {title}
    </motion.h1>
    {subtitle && (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.25 }}
        className="text-xl text-white/90 max-w-2xl mx-auto"
      >
        {subtitle}
      </motion.p>
    )}
  </motion.div>
);

export { FloatingOrb, AnimatedBackground, PageSection, AnimatedCard, PageHeader };
