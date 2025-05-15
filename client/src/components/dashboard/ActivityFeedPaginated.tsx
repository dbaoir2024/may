import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { RecentActivity } from '../../types/dashboardTypes';

interface ActivityFeedPaginatedProps {
  activities: RecentActivity[];
  title?: string;
  itemsPerPage?: number;
  showViewAll?: boolean;
  onViewAll?: () => void;
  className?: string;
}

const ActivityFeedPaginated: React.FC<ActivityFeedPaginatedProps> = ({ 
  activities,
  title = "Recent Activity",
  itemsPerPage = 5,
  showViewAll = true,
  onViewAll,
  className = ""
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(activities.length / itemsPerPage);
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentActivities = activities.slice(startIndex, endIndex);
  
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 size={16} className="text-green-500" />;
      case 'warning':
        return <AlertTriangle size={16} className="text-amber-500" />;
      case 'error':
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <CheckCircle2 size={16} className="text-blue-500" />;
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">{title}</h3>
        {activities.length > 0 && totalPages > 1 && (
          <div className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </div>
        )}
      </div>
      
      {activities.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No recent activities to display
        </div>
      ) : (
        <>
          <ul className="space-y-4">
            {currentActivities.map(activity => (
              <li key={activity.id} className="flex items-start group hover:bg-gray-50 p-2 rounded-md -mx-2">
                <div className="flex-shrink-0 mt-1">
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
          
          <div className="mt-6 flex items-center justify-between">
            {totalPages > 1 && (
              <div className="flex space-x-2">
                <button 
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className={`p-1 rounded-md ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-100'}`}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={16} />
                </button>
                <button 
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={`p-1 rounded-md ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-100'}`}
                  aria-label="Next page"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
            
            {showViewAll && activities.length > itemsPerPage && (
              <button 
                onClick={onViewAll}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center ml-auto"
              >
                View all activity <ArrowRight size={16} className="ml-1" />
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ActivityFeedPaginated;