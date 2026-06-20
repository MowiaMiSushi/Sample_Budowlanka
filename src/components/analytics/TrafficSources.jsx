import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';

const COLORS = ['#F97316', '#3B82F6', '#10B981', '#6366F1', '#EC4899'];

const TrafficSources = ({ data, timeRange }) => {
  const { t } = useLanguage();

  const sourcesData = useMemo(() => {
    const sources = {};
    data.forEach(item => {
      let source = item.referrer || 'Direct';
      if (source.includes('google')) source = 'Google';
      else if (source.includes('facebook')) source = 'Facebook';
      else if (source.includes('instagram')) source = 'Instagram';
      else if (source.includes('linkedin')) source = 'LinkedIn';
      else if (source === 'Direct' || source === '') source = 'Direct';
      else if (source.startsWith('http')) {
        try {
          const url = new URL(source);
          source = url.hostname;
        } catch(e) { /* ignore */ }
      }
      
      sources[source] = (sources[source] || 0) + 1;
    });

    return Object.entries(sources)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [data]);

  const topPagesData = useMemo(() => {
    const pages = {};
    data.forEach(item => {
      pages[item.page] = (pages[item.page] || 0) + 1;
    });

    return Object.entries(pages)
      .map(([name, visits]) => ({ name, visits }))
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 10);
  }, [data]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">{t('admin.analytics.sources.title')}</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sourcesData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {sourcesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">{t('admin.analytics.sources.pages')}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">{t('admin.analytics.sources.path')}</th>
                <th className="px-4 py-3 rounded-r-lg text-right">{t('admin.analytics.sources.visits')}</th>
              </tr>
            </thead>
            <tbody>
              {topPagesData.map((page, index) => (
                <tr key={index} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3 font-medium text-gray-900 truncate max-w-[200px]" title={page.name}>
                    {page.name}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    {page.visits}
                  </td>
                </tr>
              ))}
              {topPagesData.length === 0 && (
                <tr>
                  <td colSpan={2} className="px-4 py-8 text-center text-gray-400">
                    {t('admin.analytics.sources.noData')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TrafficSources;