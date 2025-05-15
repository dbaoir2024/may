import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, Filter, Plus, Edit, Trash2, Eye, Download, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { pool } from "./../../../server/src/lib/db"; // Import your PostgreSQL query function
import type { Member } from '../types';

// Pagination constants
const ITEMS_PER_PAGE = 5;

const MembershipLists: React.FC = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUnion, setSelectedUnion] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMembers, setNewMembers] = useState<Partial<Member>[]>([]);
  const [currentMember, setCurrentMember] = useState<Partial<Member & { union_id: string }>>({
      union_id: '',
      name: '',
      employeeId: '',
      position: '',
      joining_date: new Date().toISOString().split('T')[0],
      status: 'pending'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  // Fetch members from PostgreSQL
  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      const { rows } = await pool.query<Member>(
        `SELECT * FROM members 
         WHERE (name ILIKE $1 OR employee_id ILIKE $1 OR position ILIKE $1)
         AND ($2 = '' OR union_id = $2)
         AND ($3 = '' OR status = $3)
         ORDER BY name LIMIT $4 OFFSET $5`,
        [`%${searchTerm}%`, selectedUnion, selectedStatus, ITEMS_PER_PAGE, (currentPage - 1) * ITEMS_PER_PAGE]
      );
      setMembers(rows);
      setError(null);
    } catch (err) {
      console.error('Error fetching members:', err);
      setError('Failed to load members');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedUnion, selectedStatus, currentPage]);

  // Count total members for pagination
  const [totalMembers, setTotalMembers] = useState(0);
  const fetchTotalMembers = useCallback(async () => {
    try {
      const { rows } = await pool.query<{ count: number }>(
        `SELECT COUNT(*) FROM members 
         WHERE (name ILIKE $1 OR employee_id ILIKE $1 OR position ILIKE $1)
         AND ($2 = '' OR union_id = $2)
         AND ($3 = '' OR status = $3)`,
        [`%${searchTerm}%`, selectedUnion, selectedStatus]
      );
      setTotalMembers(Number(rows[0].count));
    } catch (err) {
      console.error('Error counting members:', err);
    }
  }, [searchTerm, selectedUnion, selectedStatus]);

  // Initial data load
  useEffect(() => {
    fetchMembers();
    fetchTotalMembers();
  }, [fetchMembers, fetchTotalMembers]);

  // Filtered members (client-side if needed)
  const filteredMembers = useMemo(() => {
    return members.filter(member => 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.position.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [members, searchTerm]);

  // Status color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Add member to batch
  const handleAddMember = () => {
    if (!currentMember.name || !currentMember.employee_id || !currentMember.position || !currentMember.union_id) {
      alert('Please fill all required fields');
      return;
    }

    setNewMembers([...newMembers, currentMember]);
    setCurrentMember({
      union_id: currentMember.union_id, // Keep same union for batch
      name: '',
      employee_id: '',
      position: '',
      joining_date: new Date().toISOString().split('T')[0],
      status: 'pending'
    });
  };

  // Submit batch for review
  const handleSubmitForReview = async () => {
    if (newMembers.length === 0) {
      alert('Please add at least one member');
      return;
    }

    setIsSubmitting(true);
    try {
      await pool.query('BEGIN');
      
      for (const member of newMembers) {
        await pool.query(
          `INSERT INTO members (union_id, name, employee_id, position, joining_date, status)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [member.union_id, member.name, member.employee_id, member.position, 
           member.joining_date, member.status || 'pending']
        );
      }
      
      await pool.query('COMMIT');
      setSubmissionStatus('success');
      setTimeout(() => {
        setIsModalOpen(false);
        setNewMembers([]);
        fetchMembers(); // Refresh list
      }, 2000);
    } catch (err) {
      await pool.query('ROLLBACK');
      console.error('Error submitting members:', err);
      setSubmissionStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit member
  const handleEditMember = async (member: Member) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const handleUpdateMember = async () => {
    if (!editingMember) return;

    try {
      await pool.query(
        `UPDATE members SET 
          name = $1, 
          employee_id = $2, 
          position = $3, 
          union_id = $4, 
          joining_date = $5, 
          status = $6 
         WHERE id = $7`,
        [
          editingMember.name,
          editingMember.employee_id,
          editingMember.position,
          editingMember.union_id,
          editingMember.joining_date,
          editingMember.status,
          editingMember.id
        ]
      );
      fetchMembers(); // Refresh list
      setIsModalOpen(false);
      setEditingMember(null);
    } catch (err) {
      console.error('Error updating member:', err);
    }
  };

  // Delete member
  const handleDeleteMember = async (id: string) => {
    if (!confirm('Are you sure you want to delete this member?')) return;
    
    try {
      await pool.query('DELETE FROM members WHERE id = $1', [id]);
      fetchMembers(); // Refresh list
    } catch (err) {
      console.error('Error deleting member:', err);
    }
  };

  // Pagination controls
  const totalPages = Math.ceil(totalMembers / ITEMS_PER_PAGE);
  const canPrevious = currentPage > 1;
  const canNext = currentPage < totalPages;

  // Accessibility improvements
  const statusLabels: Record<string, string> = {
    active: 'Active member',
    inactive: 'Inactive member',
    pending: 'Pending review'
  };

  return (
    <div className="space-y-6 pt-6 pb-8">
      {/* Add/Edit Member Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Modal content */}
        </div>
      )}

      {/* Header and controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Membership Lists</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and view union membership records
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <button 
            onClick={() => {
              setIsModalOpen(true);
              setEditingMember(null);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            aria-label="Add new member"
          >
            <Plus className="mr-2 h-4 w-4" /> Add New Member
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Search input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Search members..."
              aria-label="Search members"
            />
          </div>

          {/* Union filter */}
          <div>
            <select 
              value={selectedUnion}
              onChange={(e) => setSelectedUnion(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              aria-label="Filter by union"
            >
              <option value="">All Unions</option>
              <option value="IO-142">AMWU</option>
              <option value="IO-143">HSU</option>
              <option value="IO-144">TWU</option>
              <option value="IO-145">FSU</option>
            </select>
          </div>

          {/* Status filter */}
          <div>
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              aria-label="Filter by status"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <button 
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            aria-label="More filters"
          >
            <Filter className="mr-2 h-4 w-4" /> More Filters
          </button>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-6 text-center">Loading members...</div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">{error}</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Union ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joining Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMembers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                        No members found matching your criteria
                      </td>
                    </tr>
                  ) : (
                    filteredMembers.map((member) => (
                      <tr key={member.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {member.employee_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {member.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {member.position}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {member.union_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(member.joining_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span 
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(member.status)}`}
                            aria-label={statusLabels[member.status]}
                          >
                            {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button 
                              type="button" 
                              className="text-indigo-600 hover:text-indigo-900" 
                              title="View details"
                              aria-label={`View details for ${member.name}`}
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button 
                              type="button" 
                              className="text-blue-600 hover:text-blue-900" 
                              title="Download records"
                              aria-label={`Download records for ${member.name}`}
                            >
                              <Download className="h-4 w-4" />
                            </button>
                            <button 
                              type="button" 
                              className="text-green-600 hover:text-green-900" 
                              title="Edit"
                              onClick={() => handleEditMember(member)}
                              aria-label={`Edit ${member.name}`}
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              type="button" 
                              className="text-red-600 hover:text-red-900" 
                              title="Delete"
                              onClick={() => handleDeleteMember(member.id)}
                              aria-label={`Delete ${member.name}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div className="text-sm text-gray-700 mb-2 sm:mb-0">
                  Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, totalMembers)}</span> of{' '}
                  <span className="font-medium">{totalMembers}</span> members
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                    disabled={!canPrevious}
                    className="relative inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="px-3 py-1.5 text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                    disabled={!canNext}
                    className="relative inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MembershipLists;