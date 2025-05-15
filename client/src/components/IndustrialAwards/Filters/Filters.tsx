import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';

interface AwardsFiltersProps {
  onFilterChange?: (filters: {
    search: string;
    union: string;
    type: string;
    status: string;
    dateSort: string;
  }) => void;
}

const AwardsFilters: React.FC<AwardsFiltersProps> = ({ onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUnion, setSelectedUnion] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [dateSort, setDateSort] = useState('');

  const handleFilterChange = (
    field: 'search' | 'union' | 'type' | 'status' | 'dateSort',
    value: string
  ) => {
    switch (field) {
      case 'search':
        setSearchTerm(value);
        break;
      case 'union':
        setSelectedUnion(value);
        break;
      case 'type':
        setSelectedType(value);
        break;
      case 'status':
        setSelectedStatus(value);
        break;
      case 'dateSort':
        setDateSort(value);
        break;
    }

    if (onFilterChange) {
      onFilterChange({
        search: field === 'search' ? value : searchTerm,
        union: field === 'union' ? value : selectedUnion,
        type: field === 'type' ? value : selectedType,
        status: field === 'status' ? value : selectedStatus,
        dateSort: field === 'dateSort' ? value : dateSort,
      });
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search awards..."
          />
        </div>
        
        <div>
          <select
            value={selectedUnion}
            onChange={(e) => handleFilterChange('union', e.target.value)}
            className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">All Unions</option>
            <option value="Australian Manufacturing Workers Union">AMWU</option>
            <option value="Health Services Union">HSU</option>
            <option value="Transport Workers Union">TWU</option>
            <option value="Finance Sector Union">FSU</option>
            <option value="Australian Teachers Union">ATU</option>
          </select>
        </div>
        
        <div>
          <select
            value={selectedType}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">All Award Types</option>
            <option value="MWB">Minimum Wages Board</option>
            <option value="PSCA">Public Service Conciliation</option>
            <option value="TSCA">Teaching Service</option>
          </select>
        </div>
        
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        
        <div>
          <select
            value={dateSort}
            onChange={(e) => handleFilterChange('dateSort', e.target.value)}
            className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">Registration Date</option>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AwardsFilters;