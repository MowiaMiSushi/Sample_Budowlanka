import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Toaster } from '@/components/ui/toaster';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ProtectedRoute from '@/components/ProtectedRoute';
import HomePage from '@/pages/HomePage';
import ProjectsPage from '@/pages/ProjectsPage';
import ContactPage from '@/pages/ContactPage';
import LoginPage from '@/pages/LoginPage';
import AdminDashboard from '@/pages/AdminDashboard';
import AnalyticsPage from '@/pages/AnalyticsPage';
import ContentEditor from '@/pages/ContentEditor';
import { useAnalyticsTracking } from '@/hooks/useAnalyticsTracking';
import { SITE_NAME, SITE_TAGLINE, CONTACT_EMAIL, CONTACT_PHONE } from '@/lib/siteConfig';

// useAnalyticsTracking wymaga kontekstu Routera
const AnalyticsTracker = () => {
  useAnalyticsTracking();
  return null;
};

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <AnalyticsTracker />
          <Helmet>
            <title>{SITE_NAME} - {SITE_TAGLINE}</title>
            <meta name="description" content="Expert construction and renovation services. Transform your space with quality craftsmanship and attention to detail." />
            <meta name="keywords" content={`construction, renovation, interior design, finishing, building services, ${SITE_NAME}`} />
            <meta property="og:title" content={`${SITE_NAME} - Professional Construction Services`} />
            <meta property="og:description" content="Transform your space with expert construction and renovation services" />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://yourdomain.com" />
            <meta name="twitter:card" content="summary_large_image" />
          </Helmet>

          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": SITE_NAME,
              "description": SITE_TAGLINE,
              "email": CONTACT_EMAIL,
              "telephone": CONTACT_PHONE,
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "Poland"
              },
              "priceRange": "$$",
              "serviceArea": {
                "@type": "GeoCircle",
                "description": "Nationwide service"
              }
            })}
          </script>

          <div className="flex flex-col min-h-screen">
            <Routes>
              <Route path="/" element={
                <>
                  <Navigation />
                  <main className="flex-grow pt-[4.25rem]">
                    <HomePage />
                  </main>
                  <Footer />
                </>
              } />
              <Route path="/projects" element={
                <>
                  <Navigation />
                  <main className="flex-grow pt-[4.25rem]">
                    <ProjectsPage />
                  </main>
                  <Footer />
                </>
              } />
              <Route path="/contact" element={
                <>
                  <Navigation />
                  <main className="flex-grow pt-[4.25rem]">
                    <ContactPage />
                  </main>
                  <Footer />
                </>
              } />

              <Route path="/login" element={<LoginPage />} />

              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/analytics" element={
                <ProtectedRoute>
                  <AnalyticsPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/content" element={
                <ProtectedRoute>
                  <ContentEditor />
                </ProtectedRoute>
              } />
            </Routes>
          </div>

          <Toaster />
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;