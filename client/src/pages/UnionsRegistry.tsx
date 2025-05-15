import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Filter, Plus, Edit, Trash2, Eye, Download, X, 
  Upload, FolderOpen, FileText, Loader2, ChevronDown, ChevronUp 
} from 'lucide-react';

interface Union {
  id: string;
  code: string;
  name: string;
  abbreviation: string;
  registeredDate: string;
  status: 'active' | 'inactive' | 'pending';
  memberCount: number;
  industries?: string[];
  province?: string;
  branches?: string[];
  year?: string;
}

interface Document {
  id: string;
  fileName: string;
  unionCode: string;
  unionName: string;
  folderCode: string;
  folderName: string;
  uploadedBy: string;
  uploadDate: string;
  fileSize: string;
  fileType: string;
  fileObject?: File;
}

const industryOptions = [
  'Mining', 'Fisheries', 'Agriculture', 'Forestry', 'Construction',
  'Manufacturing','Services', 'Transport', 'Energy', 'Tourism', 'Finance',
  'Education', 'Healthcare'
];

const provinceOptions = [
  'Central', 'Gulf', 'Milne Bay', 'Oro', 'Southern Highlands',
  'Western Highlands', 'Enga', 'Simbu', 'Eastern Highlands',
  'Morobe', 'Madang', 'East Sepik', 'West Sepik', 'Manus',
  'New Ireland', 'East New Britain', 'West New Britain',
  'Autonomous Region of Bougainville', 'National Capital District',
  'Hela', 'Jiwaka'
];

const folderTypes = [
  { code: 'general', name: 'General Matters' },
  { code: 'application', name: 'Application For Registration' },
  { code: 'registration', name: 'Registration Certificate' },
  { code: 'rules', name: 'Rules and Constitution' },
  { code: 'membership', name: 'Financial Membership List' },
  { code: 'elections', name: 'Election of Office Bearers' },
  { code: 'ballots', name: 'Secret Ballots' },
  { code: 'financial', name: 'Financial Returns' },
  { code: 'affiliations', name: 'Affiliations' },
  { code: 'inspections', name: 'Inspection Reports' },
  { code: 'appointments', name: 'General Secretary Appointments' },
  { code: 'welfare', name: 'Welfare Funds' },
];

const MAX_FILE_SIZE_MB = 10;
const VALID_FILE_TYPES = ['pdf', 'docx', 'xlsx', 'jpg', 'png'];

const UnionsRegistry: React.FC = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [docSearchTerm, setDocSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUnions, setSelectedUnions] = useState<string[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [showNewUnionForm, setShowNewUnionForm] = useState(false);
  const [showNewDocumentForm, setShowNewDocumentForm] = useState(false);
  const [selectedUnion, setSelectedUnion] = useState<Union | null>(null);
  const [newUnion, setNewUnion] = useState<Partial<Union>>({
    industries: [],
    branches: [],
    status: 'pending'
  });
  const [newDocument, setNewDocument] = useState<Partial<Document>>({
    fileType: 'PDF'
  });
  const [unions, setUnions] = useState<Union[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);

  // Simulate API loading
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Sample data
      const sampleUnions: Union[] = [
        {
          id: '1',
          code: 'IO-142',
          name: 'Australian Manufacturing Workers Union',
          abbreviation: 'AMWU',
          registeredDate: '2022-05-15',
          status: 'active',
          memberCount: 12500,
          industries: ['Manufacturing'],
          province: 'National Capital District',
          branches: ['Port Moresby', 'Lae'],
          year: '2022'
        },
        {
          id: '2',
          code: 'IO-143',
          name: 'Construction, Forestry, Maritime, Mining and Energy Union',
          abbreviation: 'CFMMEU',
          registeredDate: '2022-06-20',
          status: 'active',
          memberCount: 8500,
          industries: ['Construction', 'Forestry', 'Mining'],
          province: 'Morobe',
          branches: ['Lae', 'Bulolo'],
          year: '2022'
        }
      ];

      const sampleDocuments: Document[] = [
        {
          id: '1',
          fileName: 'AMWU_Constitution_2024.pdf',
          unionCode: 'IO-142',
          unionName: 'Australian Manufacturing Workers Union',
          folderCode: 'rules',
          folderName: 'Rules and Constitution',
          uploadedBy: 'Sarah Johnson',
          uploadDate: '2024-03-15',
          fileSize: '2.4 MB',
          fileType: 'PDF',
        },
        {
          id: '2',
          fileName: 'CFMMEU_Financial_2023.xlsx',
          unionCode: 'IO-143',
          unionName: 'Construction, Forestry, Maritime, Mining and Energy Union',
          folderCode: 'financial',
          folderName: 'Financial Returns',
          uploadedBy: 'Michael Brown',
          uploadDate: '2023-11-30',
          fileSize: '1.8 MB',
          fileType: 'XLSX',
        }
      ];

      setUnions(sampleUnions);
      setDocuments(sampleDocuments);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  // Memoized filtered data
  const filteredUnions = useMemo(() => unions.filter(union => 
    union.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    union.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    union.abbreviation.toLowerCase().includes(searchTerm.toLowerCase())
  ), [unions, searchTerm]);

  const filteredDocuments = useMemo(() => documents.filter(doc => {
    const matchesSearch =
      doc.fileName.toLowerCase().includes(docSearchTerm.toLowerCase()) ||
      doc.unionName.toLowerCase().includes(docSearchTerm.toLowerCase()) ||
      doc.folderName.toLowerCase().includes(docSearchTerm.toLowerCase());
    
    const matchesFolder = selectedFolder === 'all' || doc.folderCode.includes(selectedFolder);
    const matchesUnion = selectedUnion ? doc.unionCode === selectedUnion.code : true;
    
    return matchesSearch && matchesFolder && matchesUnion;
  }), [documents, docSearchTerm, selectedFolder, selectedUnion]);

  // Helper functions
  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFileTypeIcon = (fileType: string) => {
    return <FileText className="h-5 w-5 text-gray-400" />;
  };

  // Handle union selection for bulk actions
  const toggleUnionSelection = (id: string) => {
    setSelectedUnions(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  // Handle document selection for bulk actions
  const toggleDocumentSelection = (id: string) => {
    setSelectedDocuments(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  // Handle bulk delete for unions
  const handleBulkDeleteUnions = () => {
    if (selectedUnions.length === 0) return;
    setUnions(prev => prev.filter(u => !selectedUnions.includes(u.id)));
    setSelectedUnions([]);
  };

  // Handle bulk delete for documents
  const handleBulkDeleteDocuments = () => {
    if (selectedDocuments.length === 0) return;
    setDocuments(prev => prev.filter(d => !selectedDocuments.includes(d.id)));
    setSelectedDocuments([]);
  };

  // Handle bulk export for unions
  const handleBulkExportUnions = () => {
    if (selectedUnions.length === 0) return;
    alert(`Exporting unions: ${selectedUnions.join(', ')}`);
  };

  // Handle bulk export for documents
  const handleBulkExportDocuments = () => {
    if (selectedDocuments.length === 0) return;
    alert(`Exporting documents: ${selectedDocuments.join(', ')}`);
  };

  // Event handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewUnion(prev => ({ ...prev, [name]: value }));
  };

  const handleDocInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewDocument(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !VALID_FILE_TYPES.includes(extension)) {
      alert(`Invalid file type. Please upload: ${VALID_FILE_TYPES.join(', ')}`);
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      alert(`File too large (max ${MAX_FILE_SIZE_MB}MB)`);
      return;
    }

    setNewDocument(prev => ({
      ...prev,
      fileName: file.name,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      fileType: extension.toUpperCase(),
      fileObject: file
    }));
  };

  const handleIndustryChange = (industry: string) => {
    setNewUnion(prev => ({
      ...prev,
      industries: prev.industries?.includes(industry)
        ? prev.industries.filter(i => i !== industry)
        : [...(prev.industries || []), industry]
    }));
  };

  const handleBranchChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      const newBranch = e.currentTarget.value.trim();
      setNewUnion(prev => ({
        ...prev,
        branches: [...(prev.branches || []), newBranch]
      }));
      e.currentTarget.value = '';
    }
  };

  const removeBranch = (branchToRemove: string) => {
    setNewUnion(prev => ({
      ...prev,
      branches: (prev.branches || []).filter(branch => branch !== branchToRemove)
    }));
  };

  // Form validation
  const validateUnionForm = () => {
    if (!newUnion.name || !newUnion.abbreviation || !newUnion.province) {
      alert('Please fill all required fields');
      return false;
    }
    if ((newUnion.industries?.length || 0) === 0) {
      alert('Please select at least one industry');
      return false;
    }
    return true;
  };

  const validateDocumentForm = () => {
    if (!newDocument.fileName || !newDocument.fileObject) {
      alert('Please select a file and provide a name');
      return false;
    }
    return true;
  };

  // Form submissions
  const handleUnionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateUnionForm()) return;

    const unionToAdd: Union = {
      id: generateId(),
      code: `IO-${Math.floor(100 + Math.random() * 900)}`,
      name: newUnion.name || '',
      abbreviation: newUnion.abbreviation || '',
      registeredDate: new Date().toISOString().split('T')[0],
      status: newUnion.status || 'pending',
      memberCount: newUnion.memberCount || 0,
      industries: newUnion.industries,
      province: newUnion.province,
      branches: newUnion.branches,
      year: newUnion.year || new Date().getFullYear().toString()
    };

    setUnions([...unions, unionToAdd]);
    resetUnionForm();
  };

  const handleDocumentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUnion || !validateDocumentForm()) return;
    
    const docToAdd: Document = {
      id: generateId(),
      fileName: newDocument.fileName || '',
      unionCode: selectedUnion.code,
      unionName: selectedUnion.name,
      folderCode: newDocument.folderCode || 'general',
      folderName: folderTypes.find(f => f.code === newDocument.folderCode)?.name || 'General Matters',
      uploadedBy: 'Current User',
      uploadDate: new Date().toISOString().split('T')[0],
      fileSize: newDocument.fileSize || '0 MB',
      fileType: newDocument.fileType || 'PDF',
      fileObject: newDocument.fileObject
    };

    setDocuments([...documents, docToAdd]);
    resetDocumentForm();
  };

  // Reset functions
  const resetUnionForm = () => {
    setShowNewUnionForm(false);
    setNewUnion({
      industries: [],
      branches: [],
      status: 'pending'
    });
  };

  const resetDocumentForm = () => {
    setShowNewDocumentForm(false);
    setNewDocument({
      fileType: 'PDF'
    });
  };

  // View management
  const openUnionDocs = (union: Union) => setSelectedUnion(union);
  const closeUnionDocs = () => {
    setSelectedUnion(null);
    setSelectedDocuments([]);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Main view components
  const DocumentManagementView = () => (
    <div className="space-y-6">
      {/* Bulk Actions Bar */}
      {selectedDocuments.length > 0 && (
        <div className="bg-blue-50 p-3 rounded-lg flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-blue-800 font-medium mr-3">
              {selectedDocuments.length} selected
            </span>
            <button 
              onClick={handleBulkExportDocuments}
              className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
            >
              <Download size={16} className="mr-1" /> Export
            </button>
            <button 
              onClick={handleBulkDeleteDocuments}
              className="flex items-center text-red-600 hover:text-red-800"
            >
              <Trash2 size={16} className="mr-1" /> Delete
            </button>
          </div>
          <button 
            onClick={() => setSelectedDocuments([])}
            className="text-blue-600 hover:text-blue-800"
          >
            Clear selection
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          onClick={closeUnionDocs}
          className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          aria-label="Back to unions list"
        >
          ← Back to Unions
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">
          {selectedUnion?.name} Documents
        </h1>
        <button
          onClick={() => setShowNewDocumentForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          aria-label="Upload new document"
        >
          <Upload className="mr-2 h-4 w-4" /> Upload Document
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Folder Structure Sidebar */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Folder Structure</h2>
          <div className="space-y-1">
            <button
              onClick={() => setSelectedFolder('all')}
              className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                selectedFolder === 'all'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              aria-label="Show all documents"
            >
              <FolderOpen
                className={`mr-2 h-5 w-5 ${
                  selectedFolder === 'all' ? 'text-blue-600' : 'text-gray-400'
                }`}
              />
              <span className="truncate">All Documents</span>
            </button>
            {folderTypes.map((folder) => (
              <button
                key={folder.code}
                onClick={() => setSelectedFolder(folder.code)}
                className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                  selectedFolder === folder.code
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                aria-label={`Show ${folder.name} documents`}
              >
                <FolderOpen
                  className={`mr-2 h-5 w-5 ${
                    selectedFolder === folder.code ? 'text-blue-600' : 'text-gray-400'
                  }`}
                />
                <span className="truncate">{folder.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Document List */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search and Filter */}
          <div className="bg-white shadow rounded-lg p-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={docSearchTerm}
                  onChange={(e) => setDocSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search documents..."
                  aria-label="Search documents"
                />
              </div>
              <button 
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                aria-label="Show advanced filters"
              >
                <Filter className="mr-2 h-4 w-4" /> Advanced Filters
              </button>
            </div>
          </div>

          {/* Documents Table */}
          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <Loader2 className="animate-spin text-blue-500" size={32} />
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200" aria-label="Documents list">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                        <input 
                          type="checkbox" 
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          checked={selectedDocuments.length > 0 && selectedDocuments.length === filteredDocuments.length}
                          onChange={() => {
                            if (selectedDocuments.length === filteredDocuments.length) {
                              setSelectedDocuments([]);
                            } else {
                              setSelectedDocuments(filteredDocuments.map(d => d.id));
                            }
                          }}
                        />
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Document
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Uploaded By
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Size
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDocuments.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 text-center text-sm font-medium text-gray-500">
                          No documents found matching your search criteria
                        </td>
                      </tr>
                    ) : (
                      filteredDocuments.map((doc) => (
                        <tr key={doc.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input 
                              type="checkbox" 
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              checked={selectedDocuments.includes(doc.id)}
                              onChange={() => toggleDocumentSelection(doc.id)}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {getFileTypeIcon(doc.fileType)}
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {doc.fileName}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {doc.fileType}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{doc.folderName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {doc.uploadedBy}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(doc.uploadDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {doc.fileSize}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button
                                type="button"
                                className="text-blue-600 hover:text-blue-900"
                                title="View document"
                                aria-label={`View ${doc.fileName}`}
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                className="text-blue-600 hover:text-blue-900"
                                title="Download document"
                                aria-label={`Download ${doc.fileName}`}
                              >
                                <Download className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                className="text-red-600 hover:text-red-900"
                                title="Delete document"
                                aria-label={`Delete ${doc.fileName}`}
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
              <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to{' '}
                    <span className="font-medium">{filteredDocuments.length}</span> of{' '}
                    <span className="font-medium">{documents.filter(d => d.unionCode === selectedUnion?.code).length}</span> documents
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      aria-label="Previous page"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      aria-label="Next page"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const UnionsListView = () => (
    <>
      {/* Bulk Actions Bar */}
      {selectedUnions.length > 0 && (
        <div className="bg-blue-50 p-3 rounded-lg flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-blue-800 font-medium mr-3">
              {selectedUnions.length} selected
            </span>
            <button 
              onClick={handleBulkExportUnions}
              className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
            >
              <Download size={16} className="mr-1" /> Export
            </button>
            <button 
              onClick={handleBulkDeleteUnions}
              className="flex items-center text-red-600 hover:text-red-800"
            >
              <Trash2 size={16} className="mr-1" /> Delete
            </button>
          </div>
          <button 
            onClick={() => setSelectedUnions([])}
            className="text-blue-600 hover:text-blue-800"
          >
            Clear selection
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Unions Registry</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and view all registered industrial organizations
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <button 
            onClick={() => setShowNewUnionForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Register new union"
          >
            <Plus className="mr-2 h-4 w-4" /> Register New Union
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search unions..."
              aria-label="Search unions"
            />
          </div>
          <div>
            <select 
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              aria-label="Filter by status"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div>
            <select 
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              aria-label="Sort by date"
            >
              <option value="">Registration Date</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
          <button 
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Show more filters"
          >
            <Filter className="mr-2 h-4 w-4" /> More Filters
          </button>
        </div>
      </div>

      {/* Unions Table */}
      {isLoading ? (
        <div className="flex justify-center items-center p-12">
          <Loader2 className="animate-spin text-blue-500" size={32} />
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200" aria-label="Unions list">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={selectedUnions.length > 0 && selectedUnions.length === filteredUnions.length}
                      onChange={() => {
                        if (selectedUnions.length === filteredUnions.length) {
                          setSelectedUnions([]);
                        } else {
                          setSelectedUnions(filteredUnions.map(u => u.id));
                        }
                      }}
                    />
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Union Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Abbreviation
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Industries
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Province
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registration Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Members
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUnions.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-4 text-center text-sm text-gray-500">
                      No unions found matching your search criteria
                    </td>
                  </tr>
                ) : (
                  filteredUnions.map((union) => (
                    <tr key={union.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input 
                          type="checkbox" 
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          checked={selectedUnions.includes(union.id)}
                          onChange={() => toggleUnionSelection(union.id)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {union.code}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{union.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {union.abbreviation}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {union.industries?.join(', ')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {union.province}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(union.registeredDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            union.status
                          )}`}
                        >
                          {union.status.charAt(0).toUpperCase() + union.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {union.memberCount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            type="button"
                            onClick={() => openUnionDocs(union)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View documents"
                            aria-label={`View documents for ${union.name}`}
                          >
                            <FolderOpen className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit"
                            aria-label={`Edit ${union.name}`}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                            aria-label={`Delete ${union.name}`}
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
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to{' '}
                <span className="font-medium">{filteredUnions.length}</span> of{' '}
                <span className="font-medium">{unions.length}</span> unions
              </div>
              <div className="flex space-x-2">
                <button
                  type="button"
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  aria-label="Previous page"
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  aria-label="Next page"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="space-y-6 pt-6 pb-8">
      {/* New Union Form */}
      {showNewUnionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Register New Trade Union</h2>
                <button 
                  onClick={resetUnionForm}
                  className="text-gray-400 hover:text-gray-500"
                  aria-label="Close modal"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={handleUnionSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Union Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={newUnion.name || ''}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="abbreviation" className="block text-sm font-medium text-gray-700">
                      Abbreviation *
                    </label>
                    <input
                      type="text"
                      id="abbreviation"
                      name="abbreviation"
                      required
                      value={newUnion.abbreviation || ''}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                      Year Established *
                    </label>
                    <input
                      type="text"
                      id="year"
                      name="year"
                      required
                      value={newUnion.year || ''}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="province" className="block text-sm font-medium text-gray-700">
                      Province *
                    </label>
                    <select
                      id="province"
                      name="province"
                      required
                      value={newUnion.province || ''}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="">Select Province</option>
                      {provinceOptions.map(province => (
                        <option key={province} value={province}>{province}</option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Industries *
                    </label>
                    <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {industryOptions.map(industry => (
                        <div key={industry} className="flex items-center">
                          <input
                            id={`industry-${industry}`}
                            name="industries"
                            type="checkbox"
                            checked={newUnion.industries?.includes(industry) || false}
                            onChange={() => handleIndustryChange(industry)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`industry-${industry}`} className="ml-2 block text-sm text-gray-700">
                            {industry}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="branches" className="block text-sm font-medium text-gray-700">
                      Branches (if any)
                    </label>
                    <input
                      type="text"
                      id="branches"
                      onKeyDown={handleBranchChange}
                      placeholder="Type branch name and press Enter"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {newUnion.branches && newUnion.branches.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {newUnion.branches.map(branch => (
                          <span
                            key={branch}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {branch}
                            <button
                              type="button"
                              onClick={() => removeBranch(branch)}
                              className="ml-1.5 inline-flex text-blue-400 hover:text-blue-600 focus:outline-none"
                              aria-label={`Remove ${branch}`}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="memberCount" className="block text-sm font-medium text-gray-700">
                      Estimated Member Count
                    </label>
                    <input
                      type="number"
                      id="memberCount"
                      name="memberCount"
                      value={newUnion.memberCount || ''}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                      Status *
                    </label>
                    <select
                      id="status"
                      name="status"
                      required
                      value={newUnion.status || 'pending'}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetUnionForm}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Register Union
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* New Document Form */}
      {showNewDocumentForm && selectedUnion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Upload Document for {selectedUnion.name}</h2>
                <button 
                  onClick={resetDocumentForm}
                  className="text-gray-400 hover:text-gray-500"
                  aria-label="Close modal"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={handleDocumentSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="fileName" className="block text-sm font-medium text-gray-700">
                      Document Name *
                    </label>
                    <input
                      type="text"
                      id="fileName"
                      name="fileName"
                      required
                      value={newDocument.fileName || ''}
                      onChange={handleDocInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="folderCode" className="block text-sm font-medium text-gray-700">
                      Folder Category *
                    </label>
                    <select
                      id="folderCode"
                      name="folderCode"
                      required
                      value={newDocument.folderCode || ''}
                      onChange={handleDocInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      {folderTypes.map(folder => (
                        <option key={folder.code} value={folder.code}>{folder.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="fileType" className="block text-sm font-medium text-gray-700">
                      File Type *
                    </label>
                    <select
                      id="fileType"
                      name="fileType"
                      required
                      value={newDocument.fileType || 'PDF'}
                      onChange={handleDocInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="PDF">PDF</option>
                      <option value="XLSX">Excel</option>
                      <option value="DOCX">Word</option>
                      <option value="JPG">Image (JPG)</option>
                      <option value="PNG">Image (PNG)</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="documentFile" className="block text-sm font-medium text-gray-700">
                      Select File *
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                          >
                            <span>Upload a file</span>
                            <input 
                              id="file-upload" 
                              name="file-upload" 
                              type="file" 
                              className="sr-only" 
                              onChange={handleFileChange}
                              accept=".pdf,.docx,.xlsx,.jpg,.png"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PDF, DOCX, XLSX, JPG, PNG up to 10MB
                        </p>
                        {newDocument.fileName && (
                          <p className="text-xs text-green-500 mt-2">
                            Selected: {newDocument.fileName} ({newDocument.fileSize})
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetDocumentForm}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Upload className="mr-2 h-4 w-4" /> Upload Document
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {selectedUnion ? (
        <DocumentManagementView />
      ) : (
        <UnionsListView />
      )}
    </div>
  );
};

export default UnionsRegistry;