import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { LogOut, RefreshCw, AlertCircle, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { getAnalytics, clearAnalytics } from '@/lib/dataService';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { SITE_NAME } from '@/lib/siteConfig';
import { useToast } from '@/components/ui/use-toast';
import moment from 'moment';
import AnalyticsCharts from '@/components/analytics/AnalyticsCharts';
import AnalyticsStats from '@/components/analytics/AnalyticsStats';
import TrafficSources from '@/components/analytics/TrafficSources';
import DeviceAnalytics from '@/components/analytics/DeviceAnalytics';
import TimeRangeFilter from '@/components/analytics/TimeRangeFilter';

const AnalyticsPage = () => {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
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
        title: "Failed to fetch analytics",
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
        title: "Analytics data reset",
        description: "All analytics data has been successfully deleted.",
      });
    } catch (err) {
      console.error('Error resetting analytics:', err);
      setError(err.message);
      toast({
        title: "Failed to reset analytics",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setShowResetConfirm(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      <Helmet>
        <title>Analytics Dashboard - {SITE_NAME}</title>
      </Helmet>

      <div className="min-h-screen bg-[#F8FAFC]">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Analytics Overview</h1>
                <p className="text-sm text-gray-500">Track your website performance and visitor insights</p>
              </div>
              
              <div className="flex items-center gap-3">
                 <Button 
                  onClick={() => setShowResetConfirm(true)} 
                  variant="outline" 
                  size="sm"
                  className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 transition-all px-4 py-2"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Reset Stats
                </Button>
                 <Button 
                  onClick={fetchAnalytics} 
                  size="sm"
                  className="bg-blue-600 text-white hover:bg-blue-700 transition-all px-4 py-2"
                  disabled={loading}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <TimeRangeFilter selectedRange={timeRange} onRangeChange={setTimeRange} />
            <div className="text-sm text-gray-500">
              Showing {filteredData.length} visits
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <p>Failed to load analytics data: {error}</p>
              <Button variant="link" onClick={fetchAnalytics} className="ml-auto text-red-700 underline">Retry</Button>
            </div>
          )}

          {loading && !analyticsData.length ? (
            <div className="flex justify-center items-center py-20">
               <div className="flex flex-col items-center gap-3">
                 <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
                 <p className="text-gray-500">Loading your insights...</p>
               </div>
            </div>
          ) : (
            <>
              <section>
                <AnalyticsStats data={filteredData} timeRange={timeRange} />
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Traffic Trends</h2>
                <AnalyticsCharts data={filteredData} timeRange={timeRange} />
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Acquisition & Content</h2>
                <TrafficSources data={filteredData} timeRange={timeRange} />
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Technology & Devices</h2>
                <DeviceAnalytics data={filteredData} timeRange={timeRange} />
              </section>
            </>
          )}
        </main>
        
        <AlertDialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
          <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-gray-900">Confirm Analytics Reset</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600">
                This will permanently delete ALL analytics data collected so far. This action cannot be undone. Are you sure you want to proceed?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-gray-300 text-gray-800 hover:bg-gray-400">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleResetAnalytics}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Yes, Delete All Data
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
};

export default AnalyticsPage;