import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X, Home, Briefcase, Mail, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { SITE_NAME } from '@/lib/siteConfig';

const NavLink = ({ item, isActive, onClick, mobile = false }) => (
  <Link
    to={item.path}
    onClick={onClick}
    className={`relative flex items-center gap-2 font-medium transition-colors ${
      mobile ? 'py-3 px-4 rounded-xl w-full' : 'py-2 px-1 text-sm lg:text-[15px]'
    } ${
      isActive
        ? mobile
          ? 'text-orange-600 bg-orange-50'
          : 'text-gray-900'
        : mobile
          ? 'text-gray-700 hover:text-orange-600 hover:bg-gray-50'
          : 'text-gray-600 hover:text-gray-900'
    }`}
  >
    <item.icon className={`shrink-0 ${mobile ? 'w-4 h-4' : 'w-4 h-4 opacity-70'}`} />
    {item.label}
    {isActive && !mobile && (
      <motion.span
        layoutId="nav-active-indicator"
        className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500"
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      />
    )}
  </Link>
);

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 24);
  });

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navItems = [
    { path: '/', label: t('nav.home'), icon: Home },
    { path: '/projects', label: t('nav.projects'), icon: Briefcase },
    { path: '/contact', label: t('nav.contact'), icon: Mail },
  ];

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const isDemoActive = location.pathname === '/login';

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-[background,box-shadow,border-color] duration-300 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-gray-200/60'
            : 'bg-white/70 backdrop-blur-md border-b border-transparent'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-[4.25rem]">
            <Link to="/" className="group flex items-center gap-2 shrink-0">
              <motion.span
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="text-xl md:text-2xl font-bold tracking-tight"
              >
                <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  {SITE_NAME}
                </span>
              </motion.span>
            </Link>

            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  item={item}
                  isActive={isActive(item.path)}
                />
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <Link to="/login">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    className={`rounded-full px-5 h-10 text-sm font-semibold shadow-sm transition-all ${
                      isDemoActive
                        ? 'bg-gray-900 text-white hover:bg-gray-800'
                        : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 shadow-orange-500/20'
                    }`}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    {t('nav.demoPanel')}
                  </Button>
                </motion.div>
              </Link>
            </div>

            <motion.button
              type="button"
              whileTap={{ scale: 0.92 }}
              onClick={() => setIsOpen((open) => !open)}
              className="md:hidden relative z-[60] flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100/80 text-gray-900 hover:bg-gray-200/80 transition-colors"
              aria-label={isOpen ? 'Zamknij menu' : 'Otwórz menu'}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-5 h-5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-[4.25rem] left-3 right-3 z-50 md:hidden rounded-2xl border border-white/60 bg-white/95 backdrop-blur-xl shadow-2xl shadow-black/10 overflow-hidden"
            >
              <nav className="p-3 flex flex-col gap-1">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.06, duration: 0.25 }}
                  >
                    <NavLink
                      item={item}
                      isActive={isActive(item.path)}
                      onClick={() => setIsOpen(false)}
                      mobile
                    />
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.06, duration: 0.25 }}
                  className="pt-2 mt-1 border-t border-gray-100"
                >
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <Button className="w-full rounded-xl h-11 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0">
                      <Shield className="w-4 h-4 mr-2" />
                      {t('nav.demoPanel')}
                    </Button>
                  </Link>
                </motion.div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
