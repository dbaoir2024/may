import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAwardsStore from './hooks/useAwardsStore';
import { Button } from '../ui/Button/Button';
import { ArrowLeft, Save, X } from 'lucide-react';
import { AwardFormData } from './types';

const AwardCreate: React.FC = () => {
  const navigate = useNavigate();
  const { createAward } = useAwardsStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<AwardFormData>({
    title: '',
    code: '',
    unionName: '',
    employer: '',
    type: '' as 'MWB' | 'PSCA' | 'TSCA',
    commencementDate: '',
    registrationDate: '',
    duration: '',
    gazetteNumber: '',
    gazetteDate: '',
    status: 'draft',
    description: ''
  });
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.code) newErrors.code = 'Code is required';
    if (!formData.unionName) newErrors.unionName = 'Union name is required';
    if (!formData.employer) newErrors.employer = 'Employer is required';
    if (!formData.type) newErrors.type = 'Award type is required';
    if (!formData.commencementDate) newErrors.commencementDate = 'Commencement date is required';
    if (!formData.registrationDate) newErrors.registrationDate = 'Registration date is required';
    if (!formData.duration) newErrors.duration = 'Duration is required';
    if (!formData.gazetteNumber) newErrors.gazetteNumber = 'Gazette number is required';
    if (!formData.gazetteDate) newErrors.gazetteDate = 'Gazette date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      await createAward(formData);
      navigate('/awards', { state: { success: 'Award created successfully' } });
    } catch (error) {
      console.error('Failed to create award:', error);
      setErrors({ submit: 'Failed to create award. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/awards')}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Awards
        </Button>
        <h1 className="text-xl font-semibold">Register New Industrial Award</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">
              Award Code <span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                  errors.code ? 'border-red-500' : ''
                }`}
              />
              {errors.code && (
                <p className="mt-1 text-sm text-red-600">{errors.code}</p>
              )}
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Award Title <span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                  errors.title ? 'border-red-500' : ''
                }`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="unionName" className="block text-sm font-medium text-gray-700">
              Union Name <span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="unionName"
                name="unionName"
                value={formData.unionName}
                onChange={handleInputChange}
                className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                  errors.unionName ? 'border-red-500' : ''
                }`}
              />
              {errors.unionName && (
                <p className="mt-1 text-sm text-red-600">{errors.unionName}</p>
              )}
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="employer" className="block text-sm font-medium text-gray-700">
              Employer <span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="employer"
                name="employer"
                value={formData.employer}
                onChange={handleInputChange}
                className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                  errors.employer ? 'border-red-500' : ''
                }`}
              />
              {errors.employer && (
                <p className="mt-1 text-sm text-red-600">{errors.employer}</p>
              )}
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Award Type <span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                  errors.type ? 'border-red-500' : ''
                }`}
              >
                <option value="">Select type</option>
                <option value="MWB">Minimum Wages Board (MWB)</option>
                <option value="PSCA">Public Service Collective Agreement (PSCA)</option>
                <option value="TSCA">Trade Specific Collective Agreement (TSCA)</option>
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type}</p>
              )}
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <div className="mt-1">
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="commencementDate" className="block text-sm font-medium text-gray-700">
              Commencement Date <span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <input
                type="date"
                id="commencementDate"
                name="commencementDate"
                value={formData.commencementDate}
                onChange={handleInputChange}
                className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                  errors.commencementDate ? 'border-red-500' : ''
                }`}
              />
              {errors.commencementDate && (
                <p className="mt-1 text-sm text-red-600">{errors.commencementDate}</p>
              )}
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="registrationDate" className="block text-sm font-medium text-gray-700">
              Registration Date <span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <input
                type="date"
                id="registrationDate"
                name="registrationDate"
                value={formData.registrationDate}
                onChange={handleInputChange}
                className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                  errors.registrationDate ? 'border-red-500' : ''
                }`}
              />
              {errors.registrationDate && (
                <p className="mt-1 text-sm text-red-600">{errors.registrationDate}</p>
              )}
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
              Duration (years) <span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                  errors.duration ? 'border-red-500' : ''
                }`}
              />
              {errors.duration && (
                <p className="mt-1 text-sm text-red-600">{errors.duration}</p>
              )}
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="gazetteNumber" className="block text-sm font-medium text-gray-700">
              Gazette Number <span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="gazetteNumber"
                name="gazetteNumber"
                value={formData.gazetteNumber}
                onChange={handleInputChange}
                className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                  errors.gazetteNumber ? 'border-red-500' : ''
                }`}
              />
              {errors.gazetteNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.gazetteNumber}</p>
              )}
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="gazetteDate" className="block text-sm font-medium text-gray-700">
              Gazette Date <span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <input
                type="date"
                id="gazetteDate"
                name="gazetteDate"
                value={formData.gazetteDate}
                onChange={handleInputChange}
                className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                  errors.gazetteDate ? 'border-red-500' : ''
                }`}
              />
              {errors.gazetteDate && (
                <p className="mt-1 text-sm text-red-600">{errors.gazetteDate}</p>
              )}
            </div>
          </div>

          <div className="sm:col-span-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <div className="mt-1">
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* File Upload Section */}
          <div className="sm:col-span-6">
            <label className="block text-sm font-medium text-gray-700">
              Upload Documents
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Upload files</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      multiple
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PDF, DOC, DOCX up to 10MB each
                </p>
              </div>
            </div>
            
            {/* File preview section */}
            {files.length > 0 && (
              <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <div className="flex items-center truncate">
                      <svg className="flex-shrink-0 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                      <div className="ml-2 truncate">
                        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="ml-2 text-red-600 hover:text-red-900"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {errors.submit && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
            {errors.submit}
          </div>
        )}

        <div className="mt-6 flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/awards')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? 'Saving...' : 'Register Award'}
            {!isSubmitting && <Save className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AwardCreate;