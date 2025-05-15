import React from 'react';
import { ArrowRight, Clock } from 'lucide-react';

interface PendingApproval {
  id: number;
  name: string;
  requester: string;
  date: string;
  status: string;
}

interface PendingApprovalsProps {
  approvals: PendingApproval[];
}

const PendingApprovals: React.FC<PendingApprovalsProps> = ({ approvals }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium mb-4 flex items-center">
        <Clock className="mr-2 text-yellow-500" />
        Pending Approvals
      </h3>
      <div className="space-y-4">
        {approvals.length === 0 ? (
          <p className="text-sm text-gray-500">No pending approvals</p>
        ) : (
          approvals.slice(0, 5).map((approval) => (
            <div key={approval.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{approval.name}</p>
                <p className="text-xs text-gray-500">Requested by {approval.requester}</p>
              </div>
              <div className="flex items-center">
                <span className="text-xs text-gray-500 mr-3">{approval.date}</span>
                <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                  {approval.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
      <button className="mt-4 text-sm text-blue-600 hover:text-blue-800 flex items-center">
        View all approvals <ArrowRight size={16} className="ml-1" />
      </button>
    </div>
  );
};

export default PendingApprovals;