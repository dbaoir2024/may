import React, { useState } from 'react';
import { FilePreview } from '../types';
import { X, Upload } from 'lucide-react';

interface FileUploadProps {
  onFilesChange?: (files: File[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesChange }) => {
  const [filePreviews, setFilePreviews] = useState<FilePreview[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const newPreviews = newFiles.map(file => ({
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        id: `${file.name}-${file.size}-${file.lastModified}`
      }));
      setFilePreviews(prev => [...prev, ...newPreviews]);
      onFilesChange?.(newFiles);
    }
  };

  const removeFile = (id: string) => {
    setFilePreviews(prev => prev.filter(file => file.id !== id));
  };

  return (
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
            PDF, DOC, DOCX, XLS, XLSX up to 10MB
          </p>
        </div>
      </div>

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
  );
};

export default FileUpload;