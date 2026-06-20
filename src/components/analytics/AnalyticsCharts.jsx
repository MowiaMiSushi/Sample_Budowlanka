import React, { useMemo } from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';
import moment from 'moment';
import { useLanguage } from '@/contexts/LanguageContext';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg text-sm">
        <p className="font-bold text-gray-900 mb-1">{label}</p>
        <p className="text-orange-500 font-semibold">
          Visits: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const AnalyticsCharts = ({ data, timeRange }) => {
  const { t } = useLanguage();

  const chartConfig = useMemo(() => {
    if (!data) return { processedData: [], type: 'bar', title: '' };

    let processedData = [];
    let type = 'bar';
    let title = '';
    let avg = 0;

    if (timeRange === '24h') {
        type = 'line';
        title = t('admin.analytics.charts.hourly');
        
        const grouped = {};
        for(let i=0; i<24; i++) {
            const hourLabel = moment().subtract(i, 'hours').startOf('hour').format('HH:00');
            grouped[hourLabel] = 0;
        }

        data.forEach(d => {
            const key = moment(d.visited_at).startOf('hour').format('HH:00');
            if (grouped[key] !== undefined) grouped[key]++;
        });

        processedData = Object.entries(grouped)
            .map(([name, visits]) => ({ name, visits }))
            .reverse();

    } else {
        type = 'bar';
        let days = 7;
        
        if (timeRange === '7d') {
             title = t('admin.analytics.charts.daily7');
             days = 7;
        } else if (timeRange === '30d') {
             title = t('admin.analytics.charts.daily30');
             days = 30;
        } else if (typeof timeRange === 'object') {
             title = 'Custom Range Visits';
             const start = moment(timeRange.from);
             const end = timeRange.to ? moment(timeRange.to) : moment();
             days = end.diff(start, 'days') + 1;
             if (days < 1) days = 1;
        }

        const grouped = {};
        for(let i=0; i<days; i++) {
            const dayLabel = moment().subtract(i, 'days').format('MM-DD');
            grouped[dayLabel] = 0;
        }

        data.forEach(d => {
            const key = moment(d.visited_at).format('MM-DD');
            if (grouped[key] !== undefined) grouped[key]++;
        });

        processedData = Object.entries(grouped)
            .map(([name, visits]) => ({ name, visits }))
            .reverse();
    }

    if (processedData.length > 0) {
        const sum = processedData.reduce((acc, curr) => acc + curr.visits, 0);
        avg = (sum / processedData.length).toFixed(1);
    }

    return { processedData, type, title, avg };

  }, [data, timeRange, t]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{chartConfig.title}</h3>
        <span className="text-sm text-gray-500">
             {timeRange === '24h' ? t('admin.analytics.charts.avgHour') : t('admin.analytics.charts.avgDay')}: {chartConfig.avg}
        </span>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartConfig.type === 'line' ? (
            <LineChart data={chartConfig.processedData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="visits" stroke="#F97316" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
            </LineChart>
          ) : (
            <BarChart data={chartConfig.processedData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="visits" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsCharts;