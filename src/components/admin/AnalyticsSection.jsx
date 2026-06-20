import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAnalytics, clearAnalytics } from '@/lib/dataService';
import { Loader2, AlertCircle, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import moment from 'moment';
import 'moment/locale/pl';
import { useLanguage } from '@/contexts/LanguageContext';

import AnalyticsCharts from '@/components/analytics/AnalyticsCharts';
import AnalyticsStats from '@/components/analytics/AnalyticsStats';
import TrafficSources from '@/components/analytics/TrafficSources';
import DeviceAnalytics from '@/components/analytics/DeviceAnalytics';
import TimeRangeFilter from '@/components/analytics/TimeRangeFilter';

const AnalyticsSection = () => {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    moment.locale('pl');
    fetchAnalytics();
  }, []);

  useEffect(() => {
    filterData();
  }, [analyticsData, timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await getAnalytics(5000);
      if (error) throw error;
      setAnalyticsData(data || []);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err.message);
      toast({
        title: t('admin.error'),
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterData = () => {
    let start = moment();
    let end = moment();

    if (timeRange === '24h') {
      start = moment().subtract(24, 'hours');
    } else if (timeRange === '7d') {
      start = moment().subtract(7, 'days').startOf('day');
    } else if (timeRange === '30d') {
      start = moment().subtract(30, 'days').startOf('day');
    } else if (typeof timeRange === 'object' && timeRange.from) {
      start = moment(timeRange.from).startOf('day');
      end = timeRange.to ? moment(timeRange.to).endOf('day') : moment();
    }

    const filtered = analyticsData.filter(item => {
      const visitTime = moment(item.visited_at);
      return visitTime.isBetween(start, end, undefined, '[]');
    });

    setFilteredData(filtered);
  };

  const handleResetAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await clearAnalytics();
      if (error) throw error;
      setAnalyticsData([]);
      toast({
        title: t('admin.analytics.clear.toast'),
        description: "",
      });
    } catch (err) {
      console.error('Error resetting analytics:', err);
      setError(err.message);
      toast({
        title: t('admin.error'),
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setShowResetConfirm(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <TimeRangeFilter selectedRange={timeRange} onRangeChange={setTimeRange} />
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            {t('admin.analytics.viewCount').replace('{{count}}', filteredData.length)}
          </span>
          <Button 
            onClick={() => setShowResetConfirm(true)} 
            variant="outline" 
            size="sm"
            className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 transition-all px-4 py-2"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {t('admin.analytics.clear')}
          </Button>
          <Button 
            onClick={fetchAnalytics} 
            size="sm"
            className="bg-blue-600 text-white hover:bg-blue-700 transition-all px-4 py-2"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {t('admin.refresh')}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700">
          <AlertCircle className="w-5 h-5" />
          <p>{t('admin.error')}: {error}</p>
          <Button variant="link" onClick={fetchAnalytics} className="ml-auto text-red-700 underline">
            {t('admin.retry')}
          </Button>
        </div>
      )}

      {loading && !analyticsData.length ? (
        <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
              <p className="text-gray-500">{t('admin.loading')}</p>
            </div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <section>
            <AnalyticsStats data={filteredData} timeRange={timeRange} />
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t('admin.analytics.sections.trends')}</h2>
            <AnalyticsCharts data={filteredData} timeRange={timeRange} />
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t('admin.analytics.sections.sources')}</h2>
            <TrafficSources data={filteredData} timeRange={timeRange} />
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t('admin.analytics.sections.tech')}</h2>
            <DeviceAnalytics data={filteredData} timeRange={timeRange} />
          </section>
        </motion.div>
      )}

      <AlertDialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900">{t('admin.analytics.clear.title')}</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              {t('admin.analytics.clear.desc')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-300 text-gray-800 hover:bg-gray-400">{t('admin.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleResetAnalytics}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {t('admin.analytics.clear.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AnalyticsSection;