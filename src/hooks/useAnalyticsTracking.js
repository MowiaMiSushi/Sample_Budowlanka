import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '@/lib/dataService';

export const useAnalyticsTracking = () => {
  const location = useLocation();

  useEffect(() => {
    const recordVisit = async () => {
      try {
        let ipAddress = 'anonymous';
        try {
          const response = await fetch('https://api.ipify.org?format=json');
          if (response.ok) {
            const data = await response.json();
            ipAddress = data.ip;
          }
        } catch {
          // brak IP = ok
        }

        await trackPageView({
          page: location.pathname,
          referrer: document.referrer || 'Direct',
          user_agent: navigator.userAgent,
          ip_address: ipAddress,
          visited_at: new Date().toISOString(),
        });
      } catch (error) {
        console.warn('Analytics tracking failed silently', error);
      }
    };

    recordVisit();
  }, [location]);
};
