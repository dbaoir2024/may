import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import useAwardsStore from './hooks/useAwardsStore';
import { Button } from '../ui/Button/Button';
import { Download, X, Check } from 'lucide-react';

const AwardExport: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { awards, exportToCSV } = useAwardsStore();
  const [exportFormat, setExportFormat] = useState<'csv' | 'excel'>('csv');
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  const awardIds = searchParams.get('ids')?.split(',') || [];
  const selectedAwards = awards.filter(award => awardIds.includes(award.id));

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportToCSV(awardIds);
      setExportComplete(true);
      setTimeout(() => navigate('/awards'), 2000);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white shadow rounded-lg p-6 max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-6">Export Awards</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">Selected Awards ({selectedAwards.length})</h3>
            <div className="border rounded-md divide-y max-h-60 overflow-y-auto">
              {selectedAwards.map(award => (
                <div key={award.id} className="p-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{award.title}</p>
                    <p className="text-sm text-gray-500">{award.code}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/awards/${award.id}`)}>
                    View
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Export Format</h3>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={exportFormat === 'csv'}
                  onChange={() => setExportFormat('csv')}
                  className="h-4 w-4 text-primary focus:ring-primary"
                />
                <span>CSV</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={exportFormat === 'excel'}
                  onChange={() => setExportFormat('excel')}
                  className="h-4 w-4 text-primary focus:ring-primary"
                />
                <span>Excel</span>
              </label>
            </div>
          </div>

          {exportComplete ? (
            <div className="p-4 bg-green-50 text-green-800 rounded-md flex items-center">
              <Check className="h-5 w-5 mr-2" />
              Export completed successfully
            </div>
          ) : (
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => navigate('/awards')}>
                Cancel
              </Button>
              <Button
                onClick={handleExport}
                disabled={isExporting || selectedAwards.length === 0}
              >
                {isExporting ? 'Exporting...' : 'Export'}
                <Download className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AwardExport;