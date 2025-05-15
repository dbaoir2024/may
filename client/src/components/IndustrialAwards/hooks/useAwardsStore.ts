import { useState, useEffect } from 'react';
import { Award, BulkAction, AuditLog } from '../types';

const useAwardsStore = () => {
  const [awards, setAwards] = useState<Award[]>([]);
  const [selectedAwards, setSelectedAwards] = useState<string[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock API calls - replace with real API calls
  const fetchAwards = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockAwards: Award[] = [
        {
          id: '1',
          code: 'AW-2023-001',
          title: 'Manufacturing Industry Minimum Wage Award 2023',
          unionName: 'Australian Manufacturing Workers Union',
          employer: 'National Manufacturing Association',
          type: 'MWB',
          commencementDate: '2023-01-01',
          registrationDate: '2022-11-15',
          duration: '3 years',
          gazetteNumber: 'G12345',
          gazetteDate: '2022-12-10',
          status: 'active'
        },
        {
          id: '2',
          code: 'AW-2023-002',
          title: 'Public Health Sector Award 2023',
          unionName: 'Health Services Union',
          employer: 'Department of Health',
          type: 'PSCA',
          commencementDate: '2023-02-01',
          registrationDate: '2023-01-10',
          duration: '2 years',
          gazetteNumber: 'G12346',
          gazetteDate: '2023-01-25',
          status: 'active'
        },
        {
          id: '3',
          code: 'AW-2023-003',
          title: 'Transport Workers Collective Agreement 2023',
          unionName: 'Transport Workers Union',
          employer: 'National Transport Federation',
          type: 'MWB',
          commencementDate: '2023-03-15',
          registrationDate: '2023-02-28',
          duration: '4 years',
          gazetteNumber: 'G12347',
          gazetteDate: '2023-03-10',
          status: 'active'
        }
      ];
      setAwards(mockAwards);
    } catch (err) {
      setError('Failed to fetch awards');
    } finally {
      setIsLoading(false);
    }
  };

  const createAward = async (award: Omit<Award, 'id'>) => {
    try {
      const newAward = { ...award, id: Date.now().toString() } as Award;
      setAwards(prev => [...prev, newAward]);
      logAuditAction('create', newAward.id, {}, newAward);
      return newAward;
    } catch (err) {
      throw new Error('Failed to create award');
    }
  };

  const updateAward = async (id: string, updates: Partial<Award>) => {
    try {
      const oldAward = awards.find(award => award.id === id);
      setAwards(prev => prev.map(award => 
        award.id === id ? { ...award, ...updates } : award
      ));
      if (oldAward) {
        logAuditAction('update', id, oldAward, updates);
      }
    } catch (err) {
      throw new Error('Failed to update award');
    }
  };

  const deleteAward = async (id: string) => {
    try {
      const oldAward = awards.find(award => award.id === id);
      setAwards(prev => prev.filter(award => award.id !== id));
      if (oldAward) {
        logAuditAction('delete', id, oldAward, {});
      }
    } catch (err) {
      throw new Error('Failed to delete award');
    }
  };

  const logAuditAction = (
    action: string, 
    awardId: string, 
    oldValues: Record<string, any>, 
    newValues: Record<string, any>
  ) => {
    const log: AuditLog = {
      id: Date.now().toString(),
      action,
      userId: 'current-user-id', // Replace with actual user ID
      timestamp: new Date().toISOString(),
      awardId,
      changes: Object.keys(newValues).reduce((acc, key) => {
        if (oldValues[key] !== newValues[key]) {
          acc[key] = { old: oldValues[key], new: newValues[key] };
        }
        return acc;
      }, {} as Record<string, { old: any; new: any }>)
    };
    setAuditLogs(prev => [...prev, log]);
  };

  // New methods to add:
  const exportToCSV = async (ids: string[]) => {
    setIsLoading(true);
    try {
      const selected = awards.filter(award => ids.includes(award.id));
      // In a real app, this would call an API endpoint
      const csvContent = convertToCSV(selected);
      downloadFile(csvContent, 'awards-export.csv');
      logAuditAction('export', '', {}, { ids });
    } catch (err) {
      setError('Export failed');
    } finally {
      setIsLoading(false);
    }
  };

  const performBulkAction = async (action: BulkAction) => {
    setIsLoading(true);
    try {
      switch (action.type) {
        case 'delete':
          setAwards(prev => prev.filter(award => !action.ids.includes(award.id)));
          break;
        case 'statusChange':
          if (action.status) {
            setAwards(prev => prev.map(award => 
              action.ids.includes(award.id) ? { ...award, status: action.status! } : award
            ));
          }
          break;
        case 'export':
          await exportToCSV(action.ids);
          break;
      }
      logAuditAction(action.type, '', {}, { ids: action.ids });
    } catch (err) {
      setError(`Bulk ${action.type} failed`);
    } finally {
      setIsLoading(false);
    }
  };

  // Utility functions
  const convertToCSV = (items: Award[]) => {
    if (items.length === 0) return '';
    const headers = Object.keys(items[0]).join(',');
    const rows = items.map(item => Object.values(item).join(','));
    return [headers, ...rows].join('\n');
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchAwards();
  }, []);

  return {
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
    fetchAwards,
    exportToCSV,
  };
};

export default useAwardsStore;