import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAwardsStore from './hooks/useAwardsStore';
import { Button } from '../ui/Button/Button';
import { ArrowLeft } from 'lucide-react';

const AwardHistory: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { auditLogs } = useAwardsStore();
  
  const awardLogs = auditLogs.filter(log => log.awardId === id);

  return (
    <div className="p-6">
      <Button 
        variant="ghost" 
        onClick={() => navigate(`/awards/${id}`)}
        className="flex items-center mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Award
      </Button>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Award Version History</h2>
        
        {awardLogs.length === 0 ? (
          <p className="text-gray-500">No history available for this award</p>
        ) : (
          <div className="space-y-4">
            {awardLogs.map(log => (
              <div key={log.id} className="border-b border-gray-200 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium capitalize">{log.action}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">By {log.userId}</p>
                </div>
                
                {Object.entries(log.changes).map(([field, { old, new: newVal }]) => (
                  <div key={field} className="mt-2 text-sm">
                    <span className="font-medium">{field}:</span> {String(old)} → {String(newVal)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AwardHistory;