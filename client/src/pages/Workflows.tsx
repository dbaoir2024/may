import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, ArrowRight, Users, FileCheck, Clock, 
  Gavel, Scale, BookOpen, Shield, AlertCircle, CheckCircle2, 
  XCircle, CalendarCheck, FileText, Database, Briefcase, Mail, 
  FileArchive, ChevronDown, ChevronUp, Loader2, Download, 
  Trash2, Edit, MoreHorizontal
} from 'lucide-react';

interface Correspondence {
  id: string;
  dateReceived: Date;
  from: string;
  subject: string;
  documentDate: Date;
  referredTo: string;
  dateOut: Date | null;
  comments: string;
  status: 'pending' | 'processed' | 'archived';
  relatedWorkflowId?: number;
  documents: {
    name: string;
    type: string;
    url: string;
    dateUploaded: Date;
  }[];
}

interface Workflow {
  id: number;
  name: string;
  type: string;
  category: string;
  status: string;
  progress: number;
  assigned: string[];
  dueDate: string;
  priority: string;
  notes: string;
  correspondence?: Correspondence[];
}

const Workflows = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showCorrespondence, setShowCorrespondence] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWorkflows, setSelectedWorkflows] = useState<number[]>([]);
  const [showNewWorkflowForm, setShowNewWorkflowForm] = useState(false);
  const [showNewCorrespondenceForm, setShowNewCorrespondenceForm] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    type: 'Industrial Agreement',
    category: 'registrations',
    status: 'Not Started',
    progress: 0,
    assigned: [],
    dueDate: '',
    priority: 'medium',
    notes: ''
  });
  const [newCorrespondence, setNewCorrespondence] = useState({
    from: '',
    subject: '',
    documentDate: '',
    referredTo: '',
    comments: '',
    status: 'pending'
  });
  
  // Main workflow categories
  const workflowCategories = [
    { id: 'all', name: 'All Workflows' },
    { id: 'registrations', name: 'Registrations' },
    { id: 'tribunal', name: 'Tribunal Determinations' },
    { id: 'unions', name: 'Union Elections' },
    { id: 'strikes', name: 'Strike Interventions' },
    { id: 'legal', name: 'Legal Matters' },
    { id: 'policy', name: 'Policy Work' }
  ];

  // Status filters
  const statusFilters = [
    { id: 'all', name: 'All Statuses' },
    { id: 'processed', name: 'Processed & Cleared' },
    { id: 'returned', name: 'Returned for Correction' },
    { id: 'pending', name: 'Pending NEC Consideration' },
    { id: 'rejected', name: 'Rejected' },
    { id: 'completed', name: 'Completed' }
  ];

  // Sample data state
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [correspondence, setCorrespondence] = useState<Correspondence[]>([]);

  // Simulate API loading
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Sample data
      const sampleCorrespondence: Correspondence[] = [
        {
          id: 'corr-1',
          dateReceived: new Date('2025-01-06'),
          from: 'Beverley Doiwa, Chairman – Office of Industrial Conciliation & Arbitration & MWB',
          subject: 'Registration and safekeeping of four (4) ADHOC Tribunal Decisions',
          documentDate: new Date('2024-11-06'),
          referredTo: '',
          dateOut: null,
          comments: '',
          status: 'processed',
          relatedWorkflowId: 3,
          documents: [
            {
              name: 'Eddy Yaman vs Air Niugini Limited',
              type: 'Tribunal Decision',
              url: '#',
              dateUploaded: new Date('2025-01-06')
            }
          ]
        },
        {
          id: 'corr-2',
          dateReceived: new Date('2025-01-06'),
          from: 'Beverley Doiwa, Chairman – Office of Industrial Conciliation & Arbitration & MWB',
          subject: 'Registration and safekeeping of Tribunal Decisions',
          documentDate: new Date('2024-10-31'),
          referredTo: 'Mrs Utubasi, a/Industrial Registrar',
          dateOut: new Date('2025-01-06'),
          comments: 'This ad-hoc tribunal awards were hand-delivered to OIR and received on 06 Jan 2025. This letter was back-dated to prior my appointment, this is not proper. Hence they are to be registered under your acting IR period.',
          status: 'processed',
          relatedWorkflowId: 5,
          documents: [
            {
              name: 'Pius Yafacet vs Air Niugini Limited',
              type: 'Tribunal Decision',
              url: '#',
              dateUploaded: new Date('2025-01-06')
            }
          ]
        }
      ];

      const sampleWorkflows: Workflow[] = [
        {
          id: 1,
          name: 'Ramu Nickel Project Operation Industrial Agreement 2025-2027',
          type: 'Industrial Agreement',
          category: 'registrations',
          status: 'Processed & Cleared',
          progress: 100,
          assigned: ['Natasha Utubasi'],
          dueDate: '2025-03-15',
          priority: 'high',
          notes: 'Successfully registered and gazetted',
          correspondence: []
        },
        {
          id: 3,
          name: 'Eddy Yaman v. Air Niugini',
          type: 'Tribunal Determination',
          category: 'tribunal',
          status: 'Processed & Cleared',
          progress: 100,
          assigned: ['Legal Team'],
          dueDate: '2025-02-10',
          priority: 'high',
          notes: 'Termination case - decision in favor of employer',
          correspondence: [sampleCorrespondence[0]]
        }
      ];

      setWorkflows(sampleWorkflows);
      setCorrespondence(sampleCorrespondence);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  // Filter workflows based on active tab, filter and search query
  const filteredWorkflows = workflows.filter(workflow => {
    const categoryMatch = activeTab === 'all' || workflow.category === activeTab;
    const statusMatch = activeFilter === 'all' || 
      (activeFilter === 'processed' && workflow.status.includes('Processed')) ||
      (activeFilter === 'returned' && workflow.status.includes('Returned')) ||
      (activeFilter === 'pending' && workflow.status.includes('Pending')) ||
      (activeFilter === 'rejected' && workflow.status === 'Rejected') ||
      (activeFilter === 'completed' && (workflow.status === 'Completed' || workflow.status === 'Resolved'));
    
    const searchMatch = searchQuery === '' || 
      workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.assigned.some(person => 
        person.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return categoryMatch && statusMatch && searchMatch;
  });

  // Status and priority styling
  const getStatusClass = (status: string) => {
    if (status.includes('Processed')) return 'bg-green-100 text-green-800';
    if (status.includes('Returned')) return 'bg-yellow-100 text-yellow-800';
    if (status.includes('Pending')) return 'bg-purple-100 text-purple-800';
    if (status === 'Rejected') return 'bg-red-100 text-red-800';
    if (status === 'Completed' || status === 'Resolved') return 'bg-blue-100 text-blue-800';
    if (status === 'In Progress') return 'bg-blue-100 text-blue-800';
    if (status === 'Monitoring') return 'bg-orange-100 text-orange-800';
    if (status === 'Delayed') return 'bg-red-100 text-red-800';
    if (status === 'Not Started') return 'bg-gray-100 text-gray-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-500';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Industrial Agreement': return <FileText size={16} className="mr-1" />;
      case 'Tribunal Determination': return <Gavel size={16} className="mr-1" />;
      case 'Union Election': return <Users size={16} className="mr-1" />;
      case 'Strike Intervention': return <AlertCircle size={16} className="mr-1" />;
      case 'Legal Review': return <Scale size={16} className="mr-1" />;
      case 'Policy Work': return <BookOpen size={16} className="mr-1" />;
      case 'IT Project': return <Database size={16} className="mr-1" />;
      default: return <Briefcase size={16} className="mr-1" />;
    }
  };

  const getCorrespondenceIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Mail className="text-yellow-500" size={16} />;
      case 'processed': return <FileCheck className="text-green-500" size={16} />;
      case 'archived': return <FileArchive className="text-gray-500" size={16} />;
      default: return <Mail size={16} />;
    }
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return '-';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-PG', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Handle workflow selection for bulk actions
  const toggleWorkflowSelection = (id: number) => {
    setSelectedWorkflows(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedWorkflows.length === 0) return;
    setWorkflows(prev => prev.filter(w => !selectedWorkflows.includes(w.id)));
    setSelectedWorkflows([]);
  };

  // Handle bulk export
  const handleBulkExport = () => {
    if (selectedWorkflows.length === 0) return;
    alert(`Exporting workflows: ${selectedWorkflows.join(', ')}`);
    // In a real app, this would trigger a download
  };

  // Handle new workflow form submission
  const handleNewWorkflowSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = Math.max(...workflows.map(w => w.id), 0) + 1;
    setWorkflows(prev => [
      ...prev,
      {
        id: newId,
        ...newWorkflow,
        progress: parseInt(newWorkflow.progress as any) || 0,
        assigned: typeof newWorkflow.assigned === 'string' ? [newWorkflow.assigned] : newWorkflow.assigned
      }
    ]);
    setShowNewWorkflowForm(false);
    setNewWorkflow({
      name: '',
      type: 'Industrial Agreement',
      category: 'registrations',
      status: 'Not Started',
      progress: 0,
      assigned: [],
      dueDate: '',
      priority: 'medium',
      notes: ''
    });
  };

  // Handle new correspondence form submission
  const handleNewCorrespondenceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `corr-${Math.random().toString(36).substr(2, 9)}`;
    const newCorr: Correspondence = {
      id: newId,
      dateReceived: new Date(),
      from: newCorrespondence.from,
      subject: newCorrespondence.subject,
      documentDate: new Date(newCorrespondence.documentDate),
      referredTo: newCorrespondence.referredTo,
      dateOut: null,
      comments: newCorrespondence.comments,
      status: newCorrespondence.status as 'pending' | 'processed' | 'archived',
      documents: []
    };
    setCorrespondence(prev => [...prev, newCorr]);
    setShowNewCorrespondenceForm(false);
    setNewCorrespondence({
      from: '',
      subject: '',
      documentDate: '',
      referredTo: '',
      comments: '',
      status: 'pending'
    });
  };

  // Statistics for dashboard
  const stats = [
    { name: 'Total Workflows', value: workflows.length, icon: <FileCheck /> },
    { name: 'Processed & Cleared', value: workflows.filter(w => w.status.includes('Processed')).length, icon: <CheckCircle2 /> },
    { name: 'Pending NEC', value: workflows.filter(w => w.status.includes('Pending')).length, icon: <Clock /> },
    { name: 'Critical Priority', value: workflows.filter(w => w.priority === 'critical').length, icon: <AlertCircle /> },
    { name: 'Union Elections', value: workflows.filter(w => w.category === 'unions').length, icon: <Users /> },
    { name: 'Delayed Projects', value: workflows.filter(w => w.status === 'Delayed').length, icon: <XCircle /> }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Industrial Registrar Workflow & Correspondence Management</h1>
        <div className="flex space-x-2">
          <button 
            className="btn-primary bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => setShowNewCorrespondenceForm(true)}
          >
            <Plus size={16} className="mr-2" /> New Correspondence
          </button>
          <button 
            className="btn-primary bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => setShowNewWorkflowForm(true)}
          >
            <Plus size={16} className="mr-2" /> New Workflow
          </button>
        </div>
      </div>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow flex items-center">
            <div className="p-3 rounded-full bg-blue-50 text-blue-600 mr-4">
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.name}</p>
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bulk Actions Bar */}
      {selectedWorkflows.length > 0 && (
        <div className="bg-blue-50 p-3 rounded-lg flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-blue-800 font-medium mr-3">
              {selectedWorkflows.length} selected
            </span>
            <button 
              onClick={handleBulkExport}
              className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
            >
              <Download size={16} className="mr-1" /> Export
            </button>
            <button 
              onClick={handleBulkDelete}
              className="flex items-center text-red-600 hover:text-red-800"
            >
              <Trash2 size={16} className="mr-1" /> Delete
            </button>
          </div>
          <button 
            onClick={() => setSelectedWorkflows([])}
            className="text-blue-600 hover:text-blue-800"
          >
            Clear selection
          </button>
        </div>
      )}

      {/* Main Workflow Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 flex flex-col lg:flex-row justify-between border-b gap-4">
          <div className="flex flex-wrap gap-2">
            {workflowCategories.map((category) => (
              <button 
                key={category.id}
                className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === category.id ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          <div className="flex space-x-2">
            <select
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md"
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
            >
              {statusFilters.map(filter => (
                <option key={filter.id} value={filter.id}>{filter.name}</option>
              ))}
            </select>
            <div className="relative max-w-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search workflows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <Loader2 className="animate-spin text-blue-500" size={32} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={selectedWorkflows.length > 0 && selectedWorkflows.length === filteredWorkflows.length}
                      onChange={() => {
                        if (selectedWorkflows.length === filteredWorkflows.length) {
                          setSelectedWorkflows([]);
                        } else {
                          setSelectedWorkflows(filteredWorkflows.map(w => w.id));
                        }
                      }}
                    />
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Workflow Item
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredWorkflows.length > 0 ? (
                  filteredWorkflows.map((workflow) => (
                    <React.Fragment key={workflow.id}>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input 
                            type="checkbox" 
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            checked={selectedWorkflows.includes(workflow.id)}
                            onChange={() => toggleWorkflowSelection(workflow.id)}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <div className="text-sm font-medium text-gray-900">{workflow.name}</div>
                            <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                              <div 
                                className="bg-blue-600 h-1.5 rounded-full" 
                                style={{ width: `${workflow.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 flex items-center">
                            {getTypeIcon(workflow.type)}
                            {workflow.type}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(workflow.status)}`}>
                            {workflow.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex -space-x-2">
                            {workflow.assigned.map((person, index) => (
                              <div 
                                key={index}
                                className="h-6 w-6 rounded-full bg-gray-200 border border-white flex items-center justify-center text-xs font-medium"
                                title={person}
                              >
                                {person.split(' ').map(name => name[0]).join('')}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(workflow.dueDate)}
                            {new Date(workflow.dueDate) < new Date() && workflow.progress < 100 && (
                              <span className="ml-1 text-red-500">(Overdue)</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityClass(workflow.priority)}`}>
                            {workflow.priority.charAt(0).toUpperCase() + workflow.priority.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Edit size={16} />
                            </button>
                            <button 
                              className="text-blue-600 hover:text-blue-900 font-medium flex items-center"
                              onClick={() => setShowCorrespondence(showCorrespondence === workflow.id ? null : workflow.id)}
                            >
                              {showCorrespondence === workflow.id ? (
                                <ChevronUp size={16} />
                              ) : (
                                <ChevronDown size={16} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                      
                      {/* Correspondence Section */}
                      {showCorrespondence === workflow.id && (
                        <tr>
                          <td colSpan={8} className="px-6 py-4 bg-gray-50">
                            <div className="pl-8 pr-4">
                              <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                                <Mail className="mr-2" size={16} /> Related Correspondence
                              </h3>
                              
                              {workflow.correspondence && workflow.correspondence.length > 0 ? (
                                <div className="space-y-4">
                                  {workflow.correspondence.map((corr) => (
                                    <div key={corr.id} className="border rounded-lg p-4 bg-white">
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <div className="flex items-center">
                                            {getCorrespondenceIcon(corr.status)}
                                            <span className="ml-2 text-sm font-medium">
                                              {corr.from}
                                            </span>
                                          </div>
                                          <p className="text-sm text-gray-900 mt-1">{corr.subject}</p>
                                          <p className="text-xs text-gray-500 mt-1">
                                            Received: {formatDate(corr.dateReceived)} | 
                                            Document Date: {formatDate(corr.documentDate)} | 
                                            Status: <span className={`${getStatusClass(corr.status)} px-2 py-0.5 rounded-full`}>
                                              {corr.status}
                                            </span>
                                          </p>
                                        </div>
                                        <div className="text-right">
                                          <p className="text-xs text-gray-500">
                                            {corr.referredTo && `Referred to: ${corr.referredTo}`}
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            {corr.dateOut && `Date Out: ${formatDate(corr.dateOut)}`}
                                          </p>
                                        </div>
                                      </div>
                                      
                                      {corr.comments && (
                                        <div className="mt-2 p-2 bg-yellow-50 rounded text-sm text-gray-700">
                                          {corr.comments}
                                        </div>
                                      )}
                                      
                                      {corr.documents && corr.documents.length > 0 && (
                                        <div className="mt-3">
                                          <h4 className="text-xs font-medium text-gray-500 mb-1">Documents:</h4>
                                          <div className="space-y-1">
                                            {corr.documents.map((doc, idx) => (
                                              <div key={idx} className="flex items-center text-sm">
                                                <FileText size={14} className="text-gray-400 mr-2" />
                                                <a href={doc.url} className="text-blue-600 hover:underline">
                                                  {doc.name}
                                                </a>
                                                <span className="text-xs text-gray-500 ml-2">
                                                  ({formatDate(doc.dateUploaded)})
                                                </span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-4 text-gray-500">
                                  No correspondence linked to this workflow
                                </div>
                              )}
                              
                              <div className="mt-4 flex justify-end">
                                <button 
                                  className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
                                  onClick={() => setShowNewCorrespondenceForm(true)}
                                >
                                  <Plus size={14} className="mr-1" /> Add Correspondence
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                      No workflows found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="px-6 py-4 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredWorkflows.length}</span> of <span className="font-medium">{workflows.length}</span> workflows
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50" disabled>
                Previous
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white text-gray-700 hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* New Workflow Form */}
      {showNewWorkflowForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Create New Workflow</h2>
                <button 
                  onClick={() => setShowNewWorkflowForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle size={24} />
                </button>
              </div>
              
              <form onSubmit={handleNewWorkflowSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Workflow Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={newWorkflow.name}
                      onChange={(e) => setNewWorkflow({...newWorkflow, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={newWorkflow.type}
                      onChange={(e) => setNewWorkflow({...newWorkflow, type: e.target.value})}
                    >
                      <option value="Industrial Agreement">Industrial Agreement</option>
                      <option value="Tribunal Determination">Tribunal Determination</option>
                      <option value="Union Election">Union Election</option>
                      <option value="Strike Intervention">Strike Intervention</option>
                      <option value="Legal Review">Legal Review</option>
                      <option value="Policy Work">Policy Work</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={newWorkflow.category}
                      onChange={(e) => setNewWorkflow({...newWorkflow, category: e.target.value})}
                    >
                      <option value="registrations">Registrations</option>
                      <option value="tribunal">Tribunal Determinations</option>
                      <option value="unions">Union Elections</option>
                      <option value="strikes">Strike Interventions</option>
                      <option value="legal">Legal Matters</option>
                      <option value="policy">Policy Work</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={newWorkflow.status}
                      onChange={(e) => setNewWorkflow({...newWorkflow, status: e.target.value})}
                    >
                      <option value="Not Started">Not Started</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Pending NEC Consideration">Pending NEC Consideration</option>
                      <option value="Processed & Cleared">Processed & Cleared</option>
                      <option value="Returned for Correction">Returned for Correction</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Progress (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={newWorkflow.progress}
                      onChange={(e) => setNewWorkflow({...newWorkflow, progress: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={newWorkflow.priority}
                      onChange={(e) => setNewWorkflow({...newWorkflow, priority: e.target.value})}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={newWorkflow.dueDate}
                      onChange={(e) => setNewWorkflow({...newWorkflow, dueDate: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={Array.isArray(newWorkflow.assigned) ? newWorkflow.assigned.join(', ') : newWorkflow.assigned}
                      onChange={(e) => setNewWorkflow({...newWorkflow, assigned: e.target.value.split(',').map(s => s.trim())})}
                      placeholder="Comma separated names"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={newWorkflow.notes}
                    onChange={(e) => setNewWorkflow({...newWorkflow, notes: e.target.value})}
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowNewWorkflowForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Create Workflow
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* New Correspondence Form */}
      {showNewCorrespondenceForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Add New Correspondence</h2>
                <button 
                  onClick={() => setShowNewCorrespondenceForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle size={24} />
                </button>
              </div>
              
              <form onSubmit={handleNewCorrespondenceSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={newCorrespondence.from}
                      onChange={(e) => setNewCorrespondence({...newCorrespondence, from: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={newCorrespondence.subject}
                      onChange={(e) => setNewCorrespondence({...newCorrespondence, subject: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Document Date</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={newCorrespondence.documentDate}
                      onChange={(e) => setNewCorrespondence({...newCorrespondence, documentDate: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={newCorrespondence.status}
                      onChange={(e) => setNewCorrespondence({...newCorrespondence, status: e.target.value as any})}
                    >
                      <option value="pending">Pending</option>
                      <option value="processed">Processed</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Referred To</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={newCorrespondence.referredTo}
                      onChange={(e) => setNewCorrespondence({...newCorrespondence, referredTo: e.target.value})}
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={newCorrespondence.comments}
                      onChange={(e) => setNewCorrespondence({...newCorrespondence, comments: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Attachments</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                        >
                          <span>Upload files</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PDF, DOCX up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowNewCorrespondenceForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Add Correspondence
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workflows;