import React, { useMemo } from 'react';
import { Users, Eye, Clock, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

const StatCard = ({ icon: Icon, label, value, subtext, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
    </div>
    {subtext && <p className="mt-4 text-xs text-gray-400">{subtext}</p>}
  </motion.div>
);

const AnalyticsStats = ({ data, timeRange }) => {
  const { t } = useLanguage();

  const stats = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        visitors: 0,
        visits: 0,
        avgSessions: 0,
        bounceRate: 0
      };
    }

    const uniqueVisitors = new Set(data.map(d => d.ip_address)).size;
    const totalVisits = data.length;
    
    const avgSessions = uniqueVisitors > 0 ? (totalVisits / uniqueVisitors).toFixed(1) : 0;

    const visitsByIp = data.reduce((acc, curr) => {
      acc[curr.ip_address] = (acc[curr.ip_address] || 0) + 1;
      return acc;
    }, {});
    
    const singlePageVisits = Object.values(visitsByIp).filter(count => count === 1).length;
    const bounceRate = uniqueVisitors > 0 
      ? Math.round((singlePageVisits / uniqueVisitors) * 100) 
      : 0;

    return {
      visitors: uniqueVisitors,
      visits: totalVisits,
      avgSessions,
      bounceRate
    };
  }, [data]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        icon={Users}
        label={t('admin.analytics.stats.visitors')}
        value={stats.visitors}
        subtext={t('admin.analytics.stats.visitors.sub')}
        color="bg-blue-500"
        delay={0}
      />
      <StatCard
        icon={Eye}
        label={t('admin.analytics.stats.views')}
        value={stats.visits}
        subtext={t('admin.analytics.stats.views.sub')}
        color="bg-orange-500"
        delay={0.1}
      />
      <StatCard
        icon={Clock}
        label={t('admin.analytics.stats.avg')}
        value={stats.avgSessions}
        subtext={t('admin.analytics.stats.avg.sub')}
        color="bg-purple-500"
        delay={0.2}
      />
      <StatCard
        icon={Activity}
        label={t('admin.analytics.stats.bounce')}
        value={`${stats.bounceRate}%`}
        subtext={t('admin.analytics.stats.bounce.sub')}
        color="bg-red-500"
        delay={0.3}
      />
    </div>
  );
};

export default AnalyticsStats;