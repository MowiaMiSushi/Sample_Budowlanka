import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    const logPageView = async () => {
      try {
        let ipAddress = 'unknown';
        try {
          const ipResponse = await fetch('https://api.ipify.org?format=json');
          const ipData = await ipResponse.json();
          ipAddress = ipData.ip;
        } catch (error) {
          console.error('Could not fetch IP:', error);
        }

        await supabase
          .from('analytics')
          .insert([
            {
              ip_address: ipAddress,
              timestamp: new Date().toISOString(),
              source: document.referrer || 'Direct',
              page_path: location.pathname,
              user_agent: navigator.userAgent
            }
          ]);
      } catch (error) {
        console.error('Error logging analytics:', error);
      }
    };

    logPageView();
  }, [location]);
};