import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { getProjects } from '@/lib/dataService';
import { useLanguage } from '@/contexts/LanguageContext';
import { SITE_NAME } from '@/lib/siteConfig';
import ParallaxProjectShowcase from '@/components/ParallaxProjectShowcase';
import ProjectModal from '@/components/ProjectModal';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ProjectsPageHeader = ({ title, subtitle }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative h-[55vh] min-h-[420px] overflow-hidden bg-[#1a1410]">
      <motion.div style={{ y: bgY }} className="absolute inset-0 scale-110">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=80"
          alt=""
          className="h-full w-full object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#EFEAE4]" />

      <motion.div style={{ y: textY, opacity }} className="relative z-10 flex h-full items-end pb-16">
        <div className="container mx-auto px-4 md:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-400 mb-4">
            {SITE_NAME}
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 max-w-4xl leading-tight">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-white/75 max-w-2xl">{subtitle}</p>
        </div>
      </motion.div>
    </section>
  );
};

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useLanguage();

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, activeFilter]);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await getProjects();
      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err.message);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    if (activeFilter === 'all') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter((p) => p.category === activeFilter));
    }
  };

  const filters = [
    { id: 'all', label: t('projects.filter.all') },
    { id: 'interior', label: t('projects.filter.interior') },
    { id: 'renovation', label: t('projects.filter.renovation') },
    { id: 'finishing', label: t('projects.filter.finishing') },
  ];

  return (
    <>
      <Helmet>
        <title>{t('projects.title')} - {SITE_NAME}</title>
        <meta name="description" content="Explore our portfolio of completed construction, renovation, and interior design projects." />
        <link rel="canonical" href="/projects" />
      </Helmet>

      <div className="min-h-screen bg-[#EFEAE4]">
        <ProjectsPageHeader title={t('projects.title')} subtitle={t('projects.subtitle')} />

        <section className="sticky top-[4.25rem] z-30 border-b border-orange-100/80 bg-[#EFEAE4]/90 backdrop-blur-xl">
          <div className="container mx-auto px-4 md:px-8 py-5">
            <div className="flex flex-wrap justify-center gap-3">
              {filters.map((filter) => (
                <motion.button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  layout
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeFilter === filter.id
                      ? 'bg-gray-900 text-white shadow-lg'
                      : 'bg-white/80 text-gray-700 hover:bg-white shadow-sm'
                  }`}
                >
                  {filter.label}
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-24">
          {loading ? (
            <div className="flex justify-center items-center py-32">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
          ) : error ? (
            <div className="text-center py-24 px-4">
              <p className="text-xl text-red-600 mb-4">{t('projects.error') || 'Failed to load projects.'}</p>
              <p className="text-gray-500 mb-6">{error}</p>
              <Button onClick={fetchProjects} className="bg-orange-500 hover:bg-orange-600 text-white">
                Retry Loading
              </Button>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFilter}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                {filteredProjects.length > 0 ? (
                  <ParallaxProjectShowcase
                    projects={filteredProjects}
                    onProjectClick={setSelectedProject}
                  />
                ) : (
                  <div className="text-center py-24">
                    <p className="text-xl text-gray-600">{t('projects.empty')}</p>
                    <Button
                      onClick={fetchProjects}
                      className="mt-4 bg-orange-500 hover:bg-orange-600 text-white"
                      variant="outline"
                    >
                      Refresh
                    </Button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </section>

        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      </div>
    </>
  );
};

export default ProjectsPage;
