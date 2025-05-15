import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, AlertTriangle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { RecentActivity } from '../../types/dashboardTypes';

interface PaginatedActivityFeedProps {
  activities: RecentActivity[];
  title?: string;
  itemsPerPage?: number;
  showViewAll?: boolean;
  onViewAll?: () => void;
}

const PaginatedActivityFeed: React.FC<PaginatedActivityFeedProps> = ({ 
  activities, 
  title = "Recent Activity",
  itemsPerPage = 5,
  showViewAll = true,
  onViewAll
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Calculate total pages
  const totalPages = Math.ceil(activities.length / itemsPerPage);
  
  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = activities.slice(indexOfFirstItem, indexOfLastItem);
  
  // Change page
  const goToNextPage = () => setCurrentPage(page => Math.min(page + 1, totalPages));
  const goToPreviousPage = () => setCurrentPage(page => Math.max(page - 1, 1));

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle2 size={16} />;
      case 'warning': return <AlertTriangle size={16} />;
      case 'error': return <XCircle size={16} />;
      default: return <CheckCircle2 size={16} />;
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-500';
      case 'warning': return 'text-amber-500';
      case 'error': return 'text-red-500';
      default: return 'text-green-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      
      {activities.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No activity to display
        </div>
      ) : (
        <>
          <ul className="space-y-4">
            {currentItems.map(activity => (
              <li key={activity.id} className="flex items-start">
                <div className={`flex-shrink-0 mt-1 ${getStatusColor(activity.status)}`}>
                  {getStatusIcon(activity.status)}
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.entity}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time} by {activity.user}</p>
                </div>
              </li>
            ))}
          </ul>
          
          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className={`p-1 rounded-md ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <ChevronLeft size={16} />
                </button>
                <button 
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={`p-1 rounded-md ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
          
          {/* View all button */}
          {showViewAll && (
            <button 
              className="mt-4 text-sm text-blue-600 hover:text-blue-800 flex items-center"
              onClick={onViewAll}
            >
              View all activity <ArrowRight size={16} className="ml-1" />
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default PaginatedActivityFeed;