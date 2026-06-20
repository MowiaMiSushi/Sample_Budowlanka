import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Award, Users, TrendingUp } from 'lucide-react';
import { getProjects } from '@/lib/dataService';
import { useLanguage } from '@/contexts/LanguageContext';
import { SITE_NAME } from '@/lib/siteConfig';
import { viewportOnce } from '@/lib/motionPresets';
import HeroSection from '@/components/HeroSection';
import ParallaxProjectShowcase from '@/components/ParallaxProjectShowcase';
import ProjectModal from '@/components/ProjectModal';

const HomePage = () => {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const { t } = useLanguage();

  useEffect(() => {
    fetchFeaturedProjects();
  }, []);

  const fetchFeaturedProjects = async () => {
    try {
      const { data } = await getProjects();
      setFeaturedProjects((data || []).slice(0, 3));
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  return (
    <>
      <Helmet>
        <title>{SITE_NAME} - {t('home.hero.badge')}</title>
        <meta name="description" content={t('home.hero.description')} />
        <link rel="canonical" href="/" />
      </Helmet>

      <HeroSection />

      <section className="py-20 md:py-28 bg-[#EFEAE4]">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{t('home.about.title')}</h2>
            <p className="text-xl text-gray-700 leading-relaxed">
              {t('home.about.content')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Award, title: t('home.features.quality.title'), description: t('home.features.quality.desc') },
              { icon: Users, title: t('home.features.team.title'), description: t('home.features.team.desc') },
              { icon: TrendingUp, title: t('home.features.time.title'), description: t('home.features.time.desc') },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.55, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl border border-white/60 bg-white/70 backdrop-blur-sm p-8 shadow-lg"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-5">
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-[#EFEAE4] to-white overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 pt-16 pb-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500 mb-3">
              Portfolio
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{t('home.featured.title')}</h2>
            <p className="text-lg text-gray-600">{t('home.featured.subtitle')}</p>
          </motion.div>
        </div>

        <ParallaxProjectShowcase
          projects={featuredProjects}
          onProjectClick={setSelectedProject}
          compact
        />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewportOnce}
          className="text-center pb-20 pt-4"
        >
          <Link to="/projects">
            <Button className="rounded-full bg-gray-900 hover:bg-gray-800 text-white px-8 py-6 text-base">
              {t('home.featured.viewAll')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </section>

      <section className="py-20 md:py-28 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(249,115,22,0.15),_transparent_50%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t('home.cta.title')}
            </h2>
            <p className="text-xl text-white/75 mb-10">
              {t('home.cta.desc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button className="rounded-full bg-orange-500 hover:bg-orange-600 text-white px-8 py-6">
                  {t('home.cta.contact')}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/projects">
                <Button
                  variant="outline"
                  className="rounded-full border-white/25 bg-transparent text-white hover:bg-white/10 px-8 py-6"
                >
                  {t('home.cta.portfolio')}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </>
  );
};

export default HomePage;
