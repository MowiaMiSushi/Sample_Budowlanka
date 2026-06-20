import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1556889380-6e8394ddd7ad?auto=format&fit=crop&w=1600&q=80';

const ParallaxProjectRow = ({ project, index, onClick, compact = false }) => {
  const { t } = useLanguage();
  const ref = React.useRef(null);
  const isReversed = index % 2 === 1;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ['-18%', '18%']);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.12, 1, 1.08]);
  const contentX = useTransform(
    scrollYProgress,
    [0, 0.4, 0.6, 1],
    isReversed ? [40, 0, 0, -30] : [-40, 0, 0, 30]
  );
  const contentOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.6]);
  const numberY = useTransform(scrollYProgress, [0, 1], ['8%', '-8%']);

  const image = project.images?.[0] || FALLBACK_IMAGE;
  const indexLabel = String(index + 1).padStart(2, '0');

  return (
    <article
      ref={ref}
      className={`relative ${compact ? 'py-10 md:py-14' : 'py-16 md:py-24 lg:py-32'}`}
    >
      <motion.span
        style={{ y: numberY }}
        className={`pointer-events-none absolute top-4 font-bold text-[clamp(4rem,12vw,9rem)] leading-none text-orange-500/10 select-none ${
          isReversed ? 'right-4 md:right-12' : 'left-4 md:left-12'
        }`}
      >
        {indexLabel}
      </motion.span>

      <div
        className={`container mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${
          isReversed ? 'lg:[direction:rtl]' : ''
        }`}
      >
        <motion.button
          type="button"
          onClick={() => onClick?.(project)}
          style={{ scale: imageScale }}
          className={`group relative overflow-hidden rounded-2xl lg:col-span-7 shadow-2xl shadow-black/10 ${
            compact ? 'aspect-[16/10]' : 'aspect-[4/3] lg:aspect-[16/11]'
          } ${isReversed ? 'lg:[direction:ltr]' : ''}`}
        >
          <motion.div style={{ y: imageY }} className="absolute inset-0 scale-110">
            <img
              src={image}
              alt={project.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-md capitalize">
              {t(`projects.filter.${project.category}`) || project.category}
            </span>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
              <ArrowUpRight className="h-5 w-5" />
            </span>
          </div>
        </motion.button>

        <motion.div
          style={{ x: contentX, opacity: contentOpacity }}
          className={`lg:col-span-5 space-y-5 ${isReversed ? 'lg:[direction:ltr]' : ''}`}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
            {t('projects.title')} · {indexLabel}
          </p>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            {project.title}
          </h3>
          <p className="text-gray-600 leading-relaxed text-base md:text-lg line-clamp-4">
            {project.description}
          </p>

          {project.techniques?.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {project.techniques.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs text-orange-800"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => onClick?.(project)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors group/link"
          >
            {t('project.modal.description')}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
          </button>
        </motion.div>
      </div>
    </article>
  );
};

const ParallaxProjectShowcase = ({ projects, onProjectClick, compact = false, className = '' }) => {
  if (!projects?.length) return null;

  return (
    <div className={className}>
      {projects.map((project, index) => (
        <ParallaxProjectRow
          key={project.id}
          project={project}
          index={index}
          onClick={onProjectClick}
          compact={compact}
        />
      ))}
    </div>
  );
};

export default ParallaxProjectShowcase;
