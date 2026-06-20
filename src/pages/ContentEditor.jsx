import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Save, Eye, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { SITE_NAME } from '@/lib/siteConfig';

const ContentEditor = () => {
  const [heroContent, setHeroContent] = useState({
    title: 'Transform Your Space Into Reality',
    description: 'Expert construction and renovation services for your dream project'
  });
  const [aboutContent, setAboutContent] = useState({
    content: 'We are a professional construction company dedicated to bringing your vision to life with quality craftsmanship and attention to detail.'
  });
  const [isPreview, setIsPreview] = useState(false);
  const { toast } = useToast();
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data: heroData } = await supabase
        .from('page_content')
        .select('*')
        .eq('section', 'hero')
        .single();

      const { data: aboutData } = await supabase
        .from('page_content')
        .select('*')
        .eq('section', 'about')
        .single();

      if (heroData?.content) {
        setHeroContent(JSON.parse(heroData.content));
      }
      if (aboutData?.content) {
        setAboutContent(JSON.parse(aboutData.content));
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const saveHeroContent = async () => {
    try {
      const { error } = await supabase
        .from('page_content')
        .upsert({
          section: 'hero',
          content: JSON.stringify(heroContent),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'section'
        });

      if (error) throw error;

      toast({
        title: "Hero Content Saved",
        description: "Homepage hero section has been updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const saveAboutContent = async () => {
    try {
      const { error } = await supabase
        .from('page_content')
        .upsert({
          section: 'about',
          content: JSON.stringify(aboutContent),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'section'
        });

      if (error) throw error;

      toast({
        title: "About Content Saved",
        description: "About section has been updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Content Editor - {SITE_NAME} Admin</title>
        <meta name="description" content="Edit website content" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-[#EFEAE4] to-orange-50">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-6 shadow-lg">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">Content Editor</h1>
              <div className="flex gap-4">
                <Button
                  onClick={() => setIsPreview(!isPreview)}
                  className="bg-white/20 hover:bg-white/30 text-white"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {isPreview ? 'Edit' : 'Preview'}
                </Button>
                <Button
                  onClick={handleLogout}
                  className="bg-white/20 hover:bg-white/30 text-white"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <Tabs defaultValue="hero" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-8 bg-white">
              <TabsTrigger value="hero" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                Hero Section
              </TabsTrigger>
              <TabsTrigger value="about" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                About Section
              </TabsTrigger>
            </TabsList>

            <TabsContent value="hero">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg max-w-4xl"
              >
                {!isPreview ? (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hero Title
                      </label>
                      <input
                        type="text"
                        value={heroContent.title}
                        onChange={(e) => setHeroContent({ ...heroContent, title: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hero Description
                      </label>
                      <textarea
                        value={heroContent.description}
                        onChange={(e) => setHeroContent({ ...heroContent, description: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-gray-900 bg-white"
                      />
                    </div>

                    <Button
                      onClick={saveHeroContent}
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Hero Content
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h2 className="text-4xl font-bold text-gray-900">{heroContent.title}</h2>
                    <p className="text-xl text-gray-700">{heroContent.description}</p>
                  </div>
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="about">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg max-w-4xl"
              >
                {!isPreview ? (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        About Content
                      </label>
                      <textarea
                        value={aboutContent.content}
                        onChange={(e) => setAboutContent({ content: e.target.value })}
                        rows={8}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-gray-900 bg-white"
                      />
                    </div>

                    <Button
                      onClick={saveAboutContent}
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save About Content
                    </Button>
                  </div>
                ) : (
                  <div>
                    <p className="text-lg text-gray-700 leading-relaxed">{aboutContent.content}</p>
                  </div>
                )}
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default ContentEditor;