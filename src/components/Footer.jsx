import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { SITE_NAME, CONTACT_EMAIL, CONTACT_PHONE, CONTACT_ADDRESS } from '@/lib/siteConfig';
import { staggerContainer, staggerItem, viewportOnce } from '@/lib/motionPresets';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={viewportOnce}
      transition={{ duration: 0.6 }}
      className="bg-gray-900 text-white py-12"
    >
      <div className="container mx-auto px-4">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <motion.div variants={staggerItem}>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              {SITE_NAME}
            </span>
            <p className="text-gray-400 mt-4">
              Professional construction and renovation services for your dream project.
            </p>
          </motion.div>

          <motion.div variants={staggerItem}>
            <span className="text-lg font-semibold mb-4 block">Quick Links</span>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-orange-500 transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-gray-400 hover:text-orange-500 transition-colors">
                  {t('nav.projects')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-orange-500 transition-colors">
                  {t('contact.title')}
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-orange-500 transition-colors inline-flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  {t('nav.demoPanel')}
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={staggerItem}>
            <span className="text-lg font-semibold mb-4 block">{t('contact.info.title')}</span>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-400">
                <Mail className="w-4 h-4 text-orange-500" />
                <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-orange-500 transition-colors">
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Phone className="w-4 h-4 text-orange-500" />
                <a href={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`} className="hover:text-orange-500 transition-colors">
                  {CONTACT_PHONE}
                </a>
              </li>
              <li className="flex items-start gap-2 text-gray-400">
                <MapPin className="w-4 h-4 text-orange-500 mt-1 shrink-0" />
                <span>{CONTACT_ADDRESS}</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewportOnce}
          className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400"
        >
          <p>&copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
