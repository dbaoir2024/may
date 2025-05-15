import React from 'react';
import { Button } from './Button/Button';
import { Download, Trash2, X } from 'lucide-react';

interface BulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkExport: () => void;
  onBulkDelete: () => void;
}

const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedCount,
  onClearSelection,
  onBulkExport,
  onBulkDelete,
}) => {
  return (
    <div className="bg-blue-50 p-3 rounded-lg flex items-center justify-between">
      <div className="flex items-center">
        <span className="text-blue-800 font-medium">
          {selectedCount} selected
        </span>
      </div>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onBulkExport}
          className="text-blue-800"
        >
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onBulkDelete}
          className="text-red-600 border-red-200 hover:bg-red-50"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
        >
          <X className="mr-2 h-4 w-4" />
          Clear
        </Button>
      </div>
    </div>
  );
};

export default BulkActionsBar;
