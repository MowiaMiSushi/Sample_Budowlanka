import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { SITE_NAME } from '@/lib/siteConfig';
import { useHeroParallax } from '@/hooks/useScrollParallax';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=2400&q=80';

const HeroSection = () => {
  const { t } = useLanguage();
  const { ref, backgroundY, contentY, contentOpacity, overlayOpacity } = useHeroParallax();

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[640px] overflow-hidden bg-[#1a1410]">
      <motion.div style={{ y: backgroundY }} className="absolute inset-0 scale-110">
        <img
          src={HERO_IMAGE}
          alt=""
          className="h-full w-full object-cover object-center"
        />
      </motion.div>

      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-[#1a1410]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/25 to-transparent" />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 flex h-full items-center"
      >
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl">
            <motion.p
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-orange-400"
            >
              {SITE_NAME}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight"
            >
              {t('home.hero.title')}
            </motion.h1>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="my-6 h-1 w-24 origin-left rounded-full bg-gradient-to-r from-orange-500 to-red-500"
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mb-10 max-w-xl text-lg md:text-xl text-white/80 leading-relaxed"
            >
              {t('home.hero.description')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/projects">
                <Button className="group h-12 px-8 rounded-full bg-orange-500 hover:bg-orange-600 text-white border-0 shadow-lg shadow-orange-500/25">
                  {t('home.hero.cta.projects')}
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  variant="outline"
                  className="h-12 px-8 rounded-full border-white/30 bg-white/5 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm"
                >
                  {t('home.hero.cta.contact')}
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
