import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Award } from '../types';
import { X, Upload } from 'lucide-react';

// Define the schema for form validation
const awardSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  code: z.string().min(3, 'Code is required'),
  unionName: z.string().min(2, 'Union name is required'),
  employer: z.string().min(2, 'Employer is required'),
  type: z.enum(['MWB', 'PSCA', 'TSCA'], { 
    required_error: 'Award type is required' 
  }),
  commencementDate: z.string().min(1, 'Commencement date is required'),
  registrationDate: z.string().min(1, 'Registration date is required'),
  duration: z.string().min(1, 'Duration is required'),
  gazetteNumber: z.string().min(1, 'Gazette number is required'),
  gazetteDate: z.string().min(1, 'Gazette date is required'),
  status: z.enum(['active', 'expired', 'draft']),
  description: z.string().optional(),
});

export type AwardFormData = z.infer<typeof awardSchema>;

interface FilePreview {
  name: string;
  size: string;
  id: string;
}

interface AwardFormProps {
  initialData?: Award;
  onSubmit: (data: AwardFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const AwardForm: React.FC<AwardFormProps> = ({ 
  initialData, 
  onSubmit, 
  onCancel,
  isSubmitting = false
}) => {
  const [filePreviews, setFilePreviews] = useState<FilePreview[]>(
    initialData?.documents?.map(doc => ({
      name: doc,
      size: 'Unknown',
      id: doc
    })) || []
  );

  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset 
  } = useForm<AwardFormData>({
    resolver: zodResolver(awardSchema),
    defaultValues: initialData || {
      title: '',
      code: '',
      unionName: '',
      employer: '',
      type: 'MWB',
      commencementDate: '',
      registrationDate: '',
      duration: '',
      gazetteNumber: '',
      gazetteDate: '',
      status: 'draft',
      description: ''
    }
  });

  const handleFormSubmit = (data: AwardFormData) => {
    onSubmit(data);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const newPreviews = newFiles.map(file => ({
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        id: `${file.name}-${file.size}-${file.lastModified}`
      }));
      setFilePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeFile = (id: string) => {
    setFilePreviews(prev => prev.filter(file => file.id !== id));
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <label htmlFor="code" className="block text-sm font-medium text-gray-700">
            Award Code <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="code"
              {...register('code')}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
            {errors.code && (
              <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
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
              {...register('title')}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
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
              {...register('unionName')}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
            {errors.unionName && (
              <p className="mt-1 text-sm text-red-600">{errors.unionName.message}</p>
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
              {...register('employer')}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
            {errors.employer && (
              <p className="mt-1 text-sm text-red-600">{errors.employer.message}</p>
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
              {...register('type')}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            >
              <option value="MWB">Minimum Wages Board (MWB)</option>
              <option value="PSCA">Public Service Collective Agreement (PSCA)</option>
              <option value="TSCA">Teaching Service Collective Agreement (TSCA)</option>
            </select>
            {errors.type && (
              <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
            )}
          </div>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <select
              id="status"
              {...register('status')}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
            )}
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
              {...register('commencementDate')}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
            {errors.commencementDate && (
              <p className="mt-1 text-sm text-red-600">{errors.commencementDate.message}</p>
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
              {...register('registrationDate')}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
            {errors.registrationDate && (
              <p className="mt-1 text-sm text-red-600">{errors.registrationDate.message}</p>
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
              {...register('duration')}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
            {errors.duration && (
              <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>
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
              {...register('gazetteNumber')}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
            {errors.gazetteNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.gazetteNumber.message}</p>
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
              {...register('gazetteDate')}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
            {errors.gazetteDate && (
              <p className="mt-1 text-sm text-red-600">{errors.gazetteDate.message}</p>
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
              rows={3}
              {...register('description')}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* File Upload Section */}
      <div className="sm:col-span-6">
        <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">
          Award Documents
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
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

        {/* File Previews */}
        {filePreviews.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700">Uploaded files</h4>
            <ul className="mt-2 divide-y divide-gray-200 border border-gray-200 rounded-md">
              {filePreviews.map((file) => (
                <li key={file.id} className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                  <div className="flex items-center">
                    <span className="ml-2 truncate">{file.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-4">{file.size}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(file.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {/* Form Actions */}
      <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Update Award' : 'Register Award'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AwardForm;