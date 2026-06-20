import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Lock, Mail, Info } from 'lucide-react';
import {
  SITE_NAME,
  DEMO_ADMIN_EMAIL,
  DEMO_ADMIN_PASSWORD,
} from '@/lib/siteConfig';
import { fadeInUp } from '@/lib/motionPresets';

const LoginPage = () => {
  const [email, setEmail] = useState(DEMO_ADMIN_EMAIL);
  const [password, setPassword] = useState(DEMO_ADMIN_PASSWORD);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { data, error } = await login(email, password);

    setIsLoading(false);

    if (!error && data) {
      navigate('/admin');
    }
  };

  const fillDemoCredentials = () => {
    setEmail(DEMO_ADMIN_EMAIL);
    setPassword(DEMO_ADMIN_PASSWORD);
  };

  return (
    <>
      <Helmet>
        <title>{t('login.title')} - {SITE_NAME}</title>
        <meta name="description" content={t('login.metaDescription')} />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#EFEAE4] via-orange-50 to-red-50 p-4">
        <motion.div
          {...fadeInUp}
          className="w-full max-w-md"
        >
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-orange-100">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <p className="text-sm font-semibold text-orange-600 mb-2">{SITE_NAME}</p>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('login.title')}</h1>
              <p className="text-gray-600">{t('login.subtitle')}</p>
            </div>

            <div className="mb-6 rounded-xl border border-orange-200 bg-orange-50 p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-orange-600 mt-0.5 shrink-0" />
                <div className="space-y-2 text-sm text-gray-700">
                  <p className="font-semibold text-orange-800">{t('login.demo.title')}</p>
                  <p>{t('login.demo.description')}</p>
                  <div className="rounded-lg bg-white border border-orange-100 px-3 py-2 font-mono text-xs sm:text-sm">
                    <p><span className="text-gray-500">{t('login.email')}:</span> {DEMO_ADMIN_EMAIL}</p>
                    <p><span className="text-gray-500">{t('login.password')}:</span> {DEMO_ADMIN_PASSWORD}</p>
                  </div>
                  <button
                    type="button"
                    onClick={fillDemoCredentials}
                    className="text-orange-600 hover:text-orange-700 font-medium underline-offset-2 hover:underline"
                  >
                    {t('login.demo.fill')}
                  </button>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('login.email')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-900 bg-white"
                    placeholder={DEMO_ADMIN_EMAIL}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('login.password')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-900 bg-white"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 rounded-lg font-medium transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? t('login.submitting') : t('login.submit')}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/')}
                className="text-sm text-gray-600 hover:text-orange-600 transition-colors"
              >
                ← {t('login.back')}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;
