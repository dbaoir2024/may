import React, { useState } from 'react';
import useAwardsStore from '../IndustrialAwards/hooks/useAwardsStore';
import AwardsTable from './AwardsTable/Awardstable';
import AwardForm from './AwardForm/AwardForm';
import { Modal } from './Modal/Modal';
import { Outlet, useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button/Button';
import { Plus, Download, Filter } from 'lucide-react';
import BulkActionsBar from '../ui/BulkActionBar';
import AwardsFilters from '../IndustrialAwards/Filters/Filters';
import { AuditLogViewer } from './AuditLogViewer/AuditLogView';

import { Award, AwardFormData, BulkAction } from './types';


const IndustrialAwards: React.FC = () => {
  const {
    awards,
    selectedAwards,
    setSelectedAwards,
    auditLogs,
    isLoading,
    error,
    createAward,
    updateAward,
    deleteAward,
    performBulkAction,
    fetchAwards
  } = useAwardsStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAward, setEditingAward] = useState<Award | null>(null);
  const [showAuditLogs, setShowAuditLogs] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUnion, setSelectedUnion] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [dateSort, setDateSort] = useState('');
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);

  const handleCreateAward = async (formData: AwardFormData) => {
    await createAward(formData as Omit<Award, 'id'>);
    setIsFormOpen(false);
  };

  const handleUpdateAward = async (formData: AwardFormData) => {
    if (editingAward) {
      await updateAward(editingAward.id, formData);
      setIsFormOpen(false);
      setEditingAward(null);
    }
  };

  const handleBulkAction = (action: BulkAction) => {
    performBulkAction(action);
  };

  const filteredAwards = awards.filter(award => {
    const matchesSearch = searchTerm === '' || 
      award.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUnion = selectedUnion === '' || 
      award.unionName === selectedUnion;
    const matchesType = selectedType === '' || 
      award.type === selectedType;
    return matchesSearch && matchesUnion && matchesType;
  });

  return (
    <div className="space-y-6 pt-6 pb-8">
      {/* Header with primary button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Industrial Awards Registry</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and view all registered industrial awards
          </p>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button
            onClick={() => navigate('/awards/create')}
            className="bg-primary hover:bg-primary-dark"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Award
          </Button>
        </div>
      </div>

      {/* Bulk actions bar */}
      {selectedAwards.length > 0 && (
        <BulkActionsBar
          selectedCount={selectedAwards.length}
          onClearSelection={() => setSelectedAwards([])}
          onBulkExport={() => navigate('/awards/bulk-actions?action=export')}
          onBulkDelete={() => navigate('/awards/bulk-actions?action=delete')}
        />
      )}

      {showFilters && <AwardsFilters />}

      <div className="bg-white rounded-lg shadow">
        <AwardsTable 
          awards={filteredAwards}
          selectedAwards={selectedAwards}
          onSelectAward={(id) => setSelectedAwards(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
          )}
          onBulkSelect={(selectAll) => 
            setSelectedAwards(selectAll ? filteredAwards.map(a => a.id) : [])
          }
          onEdit={(id) => {
            const award = awards.find(a => a.id === id);
            if (award) {
              setEditingAward(award);
              setIsFormOpen(true);
            }
          }}
          onDelete={deleteAward}
          onExport={(id) => performBulkAction({ type: 'export', ids: [id] })}
          onView={(id) => navigate(`/awards/${id}`)}
        />
      </div>

      {/* Form Modal */}
      <Modal isOpen={isFormOpen} onClose={() => {
        setIsFormOpen(false);
        setEditingAward(null);
      }}>
        <AwardForm
          initialData={editingAward}
          onSubmit={editingAward ? handleUpdateAward : handleCreateAward}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingAward(null);
          }}
        />
      </Modal>

      {/* Audit Log Modal */}
      <Modal isOpen={showAuditLogs} onClose={() => setShowAuditLogs(false)}>
        <AuditLogViewer logs={auditLogs} />
      </Modal>
    </div>
  );
};

export default IndustrialAwards;