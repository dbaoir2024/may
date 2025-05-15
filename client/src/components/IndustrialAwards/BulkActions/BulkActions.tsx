import React from 'react';
import { BulkAction } from './types';

interface BulkActionsProps {
  selectedCount: number;
  onBulkAction: (action: BulkAction) => void;
  onClearSelection: () => void;
}

export const BulkActions: React.FC<BulkActionsProps> = ({
  selectedCount,
  onBulkAction,
  onClearSelection
}) => (
  <div className="bg-blue-50 p-4 rounded-lg flex items-center justify-between">
    <div className="flex items-center">
      <span className="text-blue-800 font-medium">
        {selectedCount} selected
      </span>
    </div>
    <div className="flex space-x-2">
      <button
        onClick={() => onBulkAction({ type: 'export', ids: [] })}
        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-primary-dark bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        Export
      </button>
      <button
        onClick={() => onBulkAction({ type: 'statusChange', ids: [], status: 'active' })}
        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-green-800 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        Mark Active
      </button>
      <button
        onClick={() => onBulkAction({ type: 'delete', ids: [] })}
        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-red-800 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        Delete
      </button>
      <button
        onClick={onClearSelection}
        className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        Clear
      </button>
    </div>
  </div>
);