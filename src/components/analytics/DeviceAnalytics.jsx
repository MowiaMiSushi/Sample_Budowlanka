import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { parseUserAgent } from '@/lib/parseUserAgent';
import { useLanguage } from '@/contexts/LanguageContext';

const DeviceAnalytics = ({ data, timeRange }) => {
  const { t } = useLanguage();

  const processedData = useMemo(() => {
    const devices = { Desktop: 0, Mobile: 0, Tablet: 0 };
    const browsers = {};
    const os = {};
    const total = data.length || 1;

    data.forEach(item => {
      const ua = parseUserAgent(item.user_agent);
      
      if (devices[ua.device.type] !== undefined) {
        devices[ua.device.type]++;
      } else {
        devices['Desktop']++;
      }

      browsers[ua.browser.name] = (browsers[ua.browser.name] || 0) + 1;

      os[ua.os.name] = (os[ua.os.name] || 0) + 1;
    });

    const deviceData = Object.entries(devices).map(([name, value]) => ({ 
      name, 
      display: t(`admin.analytics.devices.${name.toLowerCase()}`),
      value,
      percentage: Math.round((value / total) * 100)
    }));

    const browserData = Object.entries(browsers)
      .map(([name, value]) => ({ 
        name, 
        value,
        percentage: Math.round((value / total) * 100)
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    const osData = Object.entries(os)
      .map(([name, value]) => ({ 
        name, 
        value,
        percentage: Math.round((value / total) * 100)
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    return { deviceData, browserData, osData };
  }, [data, t]);

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">{t('admin.analytics.devices.title')}</h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={processedData.deviceData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
              <XAxis type="number" hide />
              <YAxis dataKey="display" type="category" width={100} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{fill: '#F3F4F6'}} 
                formatter={(value, name, props) => [`${value} (${props.payload.percentage}%)`, name]}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={30}>
                {processedData.deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#F97316' : index === 1 ? '#3B82F6' : '#10B981'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('admin.analytics.devices.browsers')}</h3>
          <table className="w-full text-sm">
            <tbody>
              {processedData.browserData.map((item, index) => (
                <tr key={index} className="border-b border-gray-100 last:border-0">
                  <td className="py-2 text-gray-600">{item.name}</td>
                  <td className="py-2 text-right">
                    <span className="font-medium text-gray-900 block">{item.value}</span>
                    <span className="text-xs text-gray-400">{item.percentage}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('admin.analytics.devices.os')}</h3>
          <table className="w-full text-sm">
            <tbody>
              {processedData.osData.map((item, index) => (
                <tr key={index} className="border-b border-gray-100 last:border-0">
                  <td className="py-2 text-gray-600">{item.name}</td>
                  <td className="py-2 text-right">
                    <span className="font-medium text-gray-900 block">{item.value}</span>
                    <span className="text-xs text-gray-400">{item.percentage}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DeviceAnalytics;