import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { insertMessage } from '@/lib/dataService';
import { useLanguage } from '@/contexts/LanguageContext';
import { SITE_NAME, CONTACT_EMAIL, CONTACT_PHONE, CONTACT_ADDRESS, CONTACT_MAP_EMBED_URL } from '@/lib/siteConfig';
import { PageHeader, AnimatedCard } from '@/components/AnimatedLayout';
import { fadeInLeft, fadeInRight, staggerContainer, staggerItem, viewportOnce } from '@/lib/motionPresets';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: t('contact.validation'),
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await insertMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
      });

      if (error) throw error;

      toast({
        title: "Wiadomość wysłana pomyślnie!",
        description: "Dziękujemy za kontakt. Odpowiemy najszybciej jak to możliwe.",
        className: "bg-green-50 border-green-200 text-green-800"
      });

      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: t('contact.error'),
        description: error.message || t('contact.error.desc'),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('contact.title')} - {SITE_NAME}</title>
        <meta name="description" content={t('contact.subtitle')} />
        <link rel="canonical" href="/contact" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-[#EFEAE4] to-orange-50">
        <section className="py-16 bg-gradient-to-br from-orange-500 to-red-500">
          <div className="container mx-auto px-4">
            <PageHeader title={t('contact.title')} subtitle={t('contact.subtitle')} />
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <motion.div
                {...fadeInLeft}
                className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-2xl"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('contact.form.title')}</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.form.name')}
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-900 bg-white"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('contact.form.email')}
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-900 bg-white"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Telefon (Opcjonalnie)
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-900 bg-white"
                        placeholder="+48 123 456 789"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.form.message')}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none text-gray-900 bg-white"
                      placeholder={t('contact.form.message')}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 rounded-lg font-medium transition-all transform hover:scale-[1.02] disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {t('contact.form.sending')}
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                         {t('contact.form.submit')}
                         <Send className="w-5 h-5" />
                      </span>
                    )}
                  </Button>
                </form>
              </motion.div>

              <motion.div
                {...fadeInRight}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('contact.info.title')}</h2>
                  <p className="text-gray-700 text-lg leading-relaxed mb-8">
                    {t('contact.info.desc')}
                  </p>
                </div>

                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportOnce}
                  className="space-y-6"
                >
                  <motion.div variants={staggerItem}>
                    <AnimatedCard className="flex items-start gap-4 p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{t('contact.info.email')}</h3>
                        <a
                          href={`mailto:${CONTACT_EMAIL}`}
                          className="text-orange-600 hover:text-orange-700 transition-colors"
                        >
                          {CONTACT_EMAIL}
                        </a>
                      </div>
                    </AnimatedCard>
                  </motion.div>

                  <motion.div variants={staggerItem}>
                    <AnimatedCard className="flex items-start gap-4 p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{t('contact.info.phone')}</h3>
                        <a
                          href={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`}
                          className="text-orange-600 hover:text-orange-700 transition-colors"
                        >
                          {CONTACT_PHONE}
                        </a>
                      </div>
                    </AnimatedCard>
                  </motion.div>

                  <motion.div variants={staggerItem}>
                    <AnimatedCard className="flex items-start gap-4 p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{t('contact.info.location')}</h3>
                        <p className="text-gray-600">{CONTACT_ADDRESS}</p>
                      </div>
                    </AnimatedCard>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-16 max-w-6xl mx-auto"
            >
              <div className="mb-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{t('contact.info.location')}</h2>
                  <p className="text-gray-600 mt-1">{CONTACT_ADDRESS}</p>
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-xl border border-orange-100 bg-white h-72 md:h-96 lg:h-[420px]">
                <iframe
                  title="Location Map"
                  src={CONTACT_MAP_EMBED_URL}
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ContactPage;