import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { LogOut, Home, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { SITE_NAME } from '@/lib/siteConfig';
import { getUnreadMessageCount, probeDataBackend } from '@/lib/dataService';

import ProjectsManager from '@/components/admin/ProjectsManager';
import AnalyticsSection from '@/components/admin/AnalyticsSection';
import MessagesManager from '@/components/admin/MessagesManager';

const AdminDashboard = () => {
  const { logout, usesSupabase } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [dataBackend, setDataBackend] = useState(null);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  useEffect(() => {
    const fetchUnreadCount = async () => {
      const count = await getUnreadMessageCount();
      setUnreadMessagesCount(count);
    };
    fetchUnreadCount();
  }, []);

  useEffect(() => {
    probeDataBackend().then(setDataBackend);
  }, []);

  return (
    <>
      <Helmet>
        <title>{t('admin.title')} - {SITE_NAME}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-[#EFEAE4] to-orange-50">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-6 shadow-lg sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold flex items-center gap-3">
                {t('admin.title')}
                {unreadMessagesCount > 0 && (
                   <span className="bg-white text-orange-600 text-xs font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {unreadMessagesCount} {t('admin.messages.filter.new')}
                   </span>
                )}
              </h1>
              <div className="flex items-center gap-4">
                <Button 
                    onClick={() => navigate('/')} 
                    variant="ghost" 
                    size="sm"
                    className="text-white hover:bg-white/20 px-4 py-2"
                >
                    <Home className="w-4 h-4 mr-2" />
                    {t('nav.home')}
                </Button>
                <Button
                  onClick={handleLogout}
                  className="bg-white/20 hover:bg-white/30 text-white border-0 px-4 py-2"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {t('nav.logout')}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {dataBackend && (
            <div
              className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
                dataBackend.backend === 'supabase'
                  ? 'border-green-200 bg-green-50 text-green-800'
                  : dataBackend.backend === 'error'
                    ? 'border-red-200 bg-red-50 text-red-800'
                    : 'border-amber-200 bg-amber-50 text-amber-900'
              }`}
            >
              {usesSupabase ? 'Supabase: ' : 'Demo: '}
              {dataBackend.message}
            </div>
          )}
          <Tabs defaultValue="projects" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 max-w-[600px] bg-white p-1 rounded-lg shadow-sm border border-gray-100">
              <TabsTrigger value="projects" className="px-4 py-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:shadow-md">
                {t('admin.tabs.projects')}
              </TabsTrigger>
              <TabsTrigger value="messages" className="px-4 py-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:shadow-md flex items-center justify-center gap-2">
                  {t('admin.tabs.messages')}
                  {unreadMessagesCount > 0 && (
                      <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem]">
                        {unreadMessagesCount}
                      </span>
                  )}
              </TabsTrigger>
              <TabsTrigger value="analytics" className="px-4 py-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:shadow-md">
                {t('admin.tabs.analytics')}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="projects" className="mt-0">
              <ProjectsManager />
            </TabsContent>

            <TabsContent value="messages" className="mt-0">
              <MessagesManager onUnreadCountChange={setUnreadMessagesCount} />
            </TabsContent>
            
            <TabsContent value="analytics" className="mt-0">
              <AnalyticsSection />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;