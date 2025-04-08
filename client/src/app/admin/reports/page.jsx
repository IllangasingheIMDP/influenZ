"use client";
import { useState, useEffect } from 'react';
import api from '@/utils/api'; // Adjust the import based on your project structure
import { motion } from 'framer-motion'; // For animations

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
        const brandsData = await api.get('/admin/get-reports-from-brands');
        const influencersData = await api.get('/admin/get-reports-from-influencers');
        
        let allReports = [];
        
        if (brandsData.data.success && brandsData.data.data) {
          allReports = [...allReports, ...brandsData.data.data.map(report => ({...report, source: 'brand'}))];
        }
        
        if (influencersData.data.success && influencersData.data.data) {
          allReports = [...allReports, ...influencersData.data.data.map(report => ({...report, source: 'influencer'}))];
        }
      
      // Sort by creation date (newest first)
      allReports.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
      setReports(allReports);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const changeReportStatus = async (reportId, newStatus) => {
    setIsUpdating(true);
    try{
        console.log('Changing status for report ID:', reportId, 'to', newStatus);
        const response = await api.post('/admin/changestatus', {
          reportId,
          status: newStatus
        });
        const result = await response.data;
        if (result.success) {
          // Update local state if API call was successful
          setReports(reports.map(report => {
            if (report.id === reportId) {
              return { ...report, status: newStatus };
            }
            return report;
          }));
        } else {
          alert('Failed to update status. Please try again.');
        }
    } catch (error) {
      console.error('Error updating report status:', error);
      alert('Failed to update status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const getFilteredReports = () => {
    return reports.filter(report => {
      // Filter by tab (reporter type)
      if (activeTab !== 'all' && report.reportertype !== activeTab) {
        return false;
      }
      
      // Filter by status
      if (statusFilter !== 'all' && report.status !== statusFilter) {
        return false;
      }
      
      return true;
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Status option colors - using amber theme
  const statusColors = {
    'Pending': 'bg-amber-100 text-amber-800 border border-amber-300',
    'Resolved': 'bg-green-100 text-green-800 border border-green-300',
    'Rejected': 'bg-red-100 text-red-800 border border-red-300',
    'Under Investigation': 'bg-blue-100 text-blue-800 border border-blue-300',
    'Under Review': 'bg-blue-100 text-blue-800 border border-blue-300'
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center mb-6"
        >
          <h1 className="text-3xl font-bold text-amber-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            User Reports Dashboard
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchReports}
            className="ml-auto flex items-center px-4 py-2 rounded-full bg-amber-600 text-white font-medium shadow-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Refresh
          </motion.button>
        </motion.div>
        
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          {/* Tabs */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="flex space-x-2 border-b border-gray-200 mb-6">
              {['all', 'brand', 'influencer'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative py-3 px-6 rounded-t-lg font-medium text-sm transition-all duration-300 ${
                    activeTab === tab
                      ? 'text-amber-800 bg-amber-50'
                      : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50/30'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)} Reports
                  {activeTab === tab && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"
                      initial={false}
                    />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
          
          {/* Status Filter */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-6 flex flex-wrap items-center gap-4"
          >
            <div className="flex items-center bg-amber-50 rounded-full pl-4 pr-1 py-1 border border-amber-200 shadow-sm">
              <span className="text-amber-700 font-medium text-sm mr-2">Filter by status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white text-amber-800 rounded-full py-1.5 pl-3 pr-8 text-sm border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23d97706' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundPosition: "right 0.5rem center", backgroundRepeat: "no-repeat", backgroundSize: "1.5em 1.5em", paddingRight: "2.5rem" }}
              >
                <option value="all">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Resolved">Resolved</option>
                <option value="Under Investigation">Under Investigation</option>
              </select>
            </div>
            
            <div className="flex items-center bg-amber-50 rounded-full pl-4 pr-2 py-1 border border-amber-200 shadow-sm">
              <span className="text-amber-700 font-medium text-sm mr-2">Reports found:</span>
              <span className="bg-amber-600 text-white font-bold text-sm py-1 px-3 rounded-full">
                {getFilteredReports().length}
              </span>
            </div>
          </motion.div>
          
          {/* Reports Table */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="overflow-hidden rounded-xl border border-amber-200 shadow-md"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-amber-200">
                <thead className="bg-amber-50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-amber-800 uppercase tracking-wider">
                      Reporter
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-amber-800 uppercase tracking-wider">
                      Reportee
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-amber-800 uppercase tracking-wider">
                      Reason
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-amber-800 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-amber-800 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-amber-800 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-amber-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <svg className="animate-spin h-10 w-10 text-amber-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span className="text-amber-700 font-medium">Loading reports...</span>
                        </div>
                      </td>
                    </tr>
                  ) : getFilteredReports().length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-amber-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-amber-700 font-medium text-lg">No reports found</span>
                          <p className="text-amber-500 text-sm mt-1">Try changing your filters or refreshing the page</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    getFilteredReports().map((report, index) => (
                      <motion.tr 
                        key={index} 
                        variants={itemVariants}
                        className={`${index % 2 === 0 ? 'bg-white' : 'bg-amber-50/30'} hover:bg-amber-50 transition-colors duration-150`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-amber-100 text-amber-600 font-bold text-lg">
                              {report.reporterfirstname?.charAt(0) || '?'}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {report.reporterfirstname} {report.reporterlastname}
                              </div>
                              <div className="flex items-center text-xs text-gray-500">
                                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium">
                                  {report.reportertype}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 font-bold text-lg">
                              {report.reporteefirstname?.charAt(0) || '?'}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {report.reporteefirstname} {report.reporteelastname}
                              </div>
                              <div className="text-xs text-gray-500">
                                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-medium">
                                  {report.reporteetype}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="max-w-xs truncate text-sm text-gray-900">
                            {report.reason}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(report.created_at)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1.5 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[report.status] || 'bg-gray-100 text-gray-800'}`}>
                            {report.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex space-x-2">
                            {report.status !== 'Resolved' && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => changeReportStatus(report.report_id, 'Resolved')}
                                disabled={isUpdating}
                                className="px-3 py-1 rounded-full text-white bg-green-500 hover:bg-green-600 disabled:opacity-50 transition-colors duration-300 text-xs font-medium shadow-sm"
                              >
                                Resolve
                              </motion.button>
                            )}
 
                            {report.status !== 'Under Investigation' && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => changeReportStatus(report.report_id, 'Under Investigation')}
                                disabled={isUpdating}
                                className="px-3 py-1 rounded-full text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-50 transition-colors duration-300 text-xs font-medium shadow-sm"
                              >
                                Investigate
                              </motion.button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
          
          {/* Footer */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 text-right text-xs text-amber-500"
          >
            Last updated: {new Date().toLocaleTimeString()}
          </motion.div>
        </div>
      </div>
    </div>
  );
}