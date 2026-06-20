import { useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export const useScrollParallax = (offset = ['start end', 'end start'], range = ['-12%', '12%']) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset,
  });

  const y = useTransform(scrollYProgress, [0, 1], range);
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.4, 1, 1, 0.4]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1, 1.05]);

  return { ref, scrollYProgress, y, opacity, scale };
};

export const useHeroParallax = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '28%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-18%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.8], [0.55, 0.85]);

  return { ref, scrollYProgress, backgroundY, contentY, contentOpacity, overlayOpacity };
};
