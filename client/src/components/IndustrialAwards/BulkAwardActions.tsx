import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAwardsStore from './hooks/useAwardsStore';
import { Button } from '../ui/Button/Button';
import { Check, X, Trash2, Download, AlertCircle } from 'lucide-react';
import { Dialog } from '../ui/Dialog/Dialog';

const BulkAwardActions: React.FC = () => {
  const navigate = useNavigate();
  const { selectedAwards, performBulkAction, awards } = useAwardsStore();
  const [action, setAction] = useState<'export' | 'delete' | 'statusChange' | null>(null);
  const [status, setStatus] = useState<'active' | 'expired' | 'draft'>('active');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedAwardData = awards.filter(award => selectedAwards.includes(award.id));

  const handleConfirm = async () => {
    if (!action) return;
    
    setIsSubmitting(true);
    try {
      await performBulkAction({
        type: action,
        ids: selectedAwards,
        ...(action === 'statusChange' ? { status } : {})
      });
      navigate('/awards');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white shadow rounded-lg p-6 max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-6">Bulk Actions</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">Selected Awards ({selectedAwardData.length})</h3>
            <div className="border rounded-md divide-y max-h-60 overflow-y-auto">
              {selectedAwardData.map(award => (
                <div key={award.id} className="p-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{award.title}</p>
                    <p className="text-sm text-gray-500">{award.code} • {award.status}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/awards/${award.id}`)}>
                    View
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              onClick={() => setAction('export')}
              className="flex flex-col items-center justify-center h-full p-4"
            >
              <Download className="h-5 w-5 mb-2" />
              <span>Export Selected</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => setAction('statusChange')}
              className="flex flex-col items-center justify-center h-full p-4"
            >
              <Check className="h-5 w-5 mb-2" />
              <span>Change Status</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => setAction('delete')}
              className="flex flex-col items-center justify-center h-full p-4 text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="h-5 w-5 mb-2" />
              <span>Delete Selected</span>
            </Button>
          </div>

          {action === 'statusChange' && (
            <div>
              <h3 className="font-medium mb-2">Set Status To</h3>
              <div className="flex space-x-4">
                {['active', 'expired', 'draft'].map(s => (
                  <label key={s} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={status === s}
                      onChange={() => setStatus(s as any)}
                      className="h-4 w-4 text-primary focus:ring-primary"
                    />
                    <span className="capitalize">{s}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {action !== null && (
          <div className="mt-6 border-t pt-4">
            <div className="flex items-center mb-4">
              {action === 'delete' ? (
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              ) : (
                <Check className="h-5 w-5 text-blue-500 mr-2" />
              )}
              <h3 className="font-medium">
                {action === 'delete' ? 'Confirm Deletion' : 'Confirm Action'}
              </h3>
            </div>
            
            <p className="mb-4">
              {action === 'delete'
                ? `Are you sure you want to delete ${selectedAwardData.length} awards? This action cannot be undone.`
                : `Are you sure you want to ${action === 'export' ? 'export' : 'update status for'} ${selectedAwardData.length} awards?`}
            </p>
            
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setAction(null)}>
                Cancel
              </Button>
              <Button
                variant={action === 'delete' ? 'destructive' : 'primary'}
                onClick={handleConfirm}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Confirm'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkAwardActions;