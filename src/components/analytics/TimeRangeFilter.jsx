import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const TimeRangeFilter = ({ selectedRange, onRangeChange }) => {
  const { t } = useLanguage();

  const handlePreset = (range) => {
    onRangeChange(range);
  };

  const isCustom = typeof selectedRange === 'object';

  const formatDateForInput = (date) => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="flex flex-wrap gap-2 items-center bg-white p-2 rounded-lg shadow-sm border border-gray-100">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handlePreset('24h')}
        className={
          selectedRange === '24h'
            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
            : 'text-gray-600 hover:bg-gray-100'
        }
      >
        {t('admin.analytics.filter.24h')}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handlePreset('7d')}
        className={
          selectedRange === '7d'
            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
            : 'text-gray-600 hover:bg-gray-100'
        }
      >
        {t('admin.analytics.filter.7d')}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handlePreset('30d')}
        className={
          selectedRange === '30d'
            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
            : 'text-gray-600 hover:bg-gray-100'
        }
      >
        {t('admin.analytics.filter.30d')}
      </Button>

      <div className="h-6 w-px bg-gray-200 mx-2 hidden sm:block"></div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 font-medium uppercase px-2">{t('admin.analytics.filter.range')}</span>
        <input
          type="date"
          className="text-sm border border-gray-200 rounded px-2 py-1 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => {
             const to = isCustom && selectedRange.to ? selectedRange.to : new Date();
             if (e.target.value) {
               onRangeChange({ from: new Date(e.target.value), to });
             } else {
               onRangeChange('7d');
             }
          }}
          value={isCustom && selectedRange.from ? formatDateForInput(selectedRange.from) : ''}
        />
        <span className="text-gray-400">-</span>
        <input
          type="date"
          className="text-sm border border-gray-200 rounded px-2 py-1 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => {
             const from = isCustom && selectedRange.from ? selectedRange.from : new Date();
             if (e.target.value) {
               onRangeChange({ from, to: new Date(e.target.value) });
             } else {
               onRangeChange('7d');
             }
          }}
          value={isCustom && selectedRange.to ? formatDateForInput(selectedRange.to) : ''}
        />
      </div>
    </div>
  );
};

export default TimeRangeFilter;