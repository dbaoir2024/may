import React from 'react';
import { Award } from '../../types';
import { Download } from 'lucide-react';

interface ExportButtonProps {
  awards: Award[];
}

export const ExportButton: React.FC<ExportButtonProps> = ({ awards }) => {
  const handleExport = () => {
    // Implement export logic
    console.log('Exporting all filtered awards:', awards);
  };

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
    >
      <Download className="mr-2 h-4 w-4" /> Export
    </button>
  );
};
