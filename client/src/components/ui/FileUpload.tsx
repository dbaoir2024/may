import * as React from 'react';
import { useDropzone, type FileWithPath } from 'react-dropzone';
import { UploadCloud, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from './Button/Button';
import { Progress } from './progress';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  /**
   * Accepted file types in { [mimeType]: [extensions] } format
   * Example: { 'image/*': ['.png', '.jpg'], 'application/pdf': ['.pdf'] }
   */
  accept?: Record<string, string[]>;
  /**
   * Maximum file size in bytes
   * @default 10_000_000 (10MB)
   */
  maxSize?: number;
  /**
   * Maximum number of files
   * @default 5
   */
  maxFiles?: number;
  /**
   * Callback when files change
   */
  onFilesChange: (files: FileWithPath[]) => void;
  /**
   * Additional class names
   */
  className?: string;
  /**
   * Show upload progress
   */
  showProgress?: boolean;
  /**
   * Current upload progress (0-100)
   */
  progress?: number;
  /**
   * Upload status
   */
  status?: 'idle' | 'uploading' | 'success' | 'error';
}

export const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  (
    {
      accept,
      maxSize = 10_000_000, // 10MB default
      maxFiles = 5,
      onFilesChange,
      className,
      showProgress = false,
      progress = 0,
      status = 'idle',
    },
    ref
  ) => {
    const [files, setFiles] = React.useState<FileWithPath[]>([]);
    const [rejectedFiles, setRejectedFiles] = React.useState<FileWithPath[]>([]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      accept,
      maxSize,
      maxFiles,
      onDrop: (acceptedFiles, fileRejections) => {
        setFiles(prev => [...prev, ...acceptedFiles]);
        setRejectedFiles(fileRejections.map(f => f.file));
        onFilesChange([...files, ...acceptedFiles]);
      },
    });

    const removeFile = (index: number) => {
      const newFiles = [...files];
      newFiles.splice(index, 1);
      setFiles(newFiles);
      onFilesChange(newFiles);
    };

    const removeAll = () => {
      setFiles([]);
      setRejectedFiles([]);
      onFilesChange([]);
    };

    return (
      <div className="space-y-4" ref={ref}>
        {/* Dropzone Area */}
        <div
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
            isDragActive ? 'border-primary bg-primary/10' : 'border-muted',
            status === 'error' ? 'border-destructive bg-destructive/10' : '',
            className
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-2">
            {status === 'success' ? (
              <CheckCircle2 className="h-8 w-8 text-success" />
            ) : status === 'error' ? (
              <AlertCircle className="h-8 w-8 text-destructive" />
            ) : (
              <UploadCloud className="h-8 w-8 text-muted-foreground" />
            )}
            
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {status === 'success'
                  ? 'Upload complete!'
                  : status === 'error'
                  ? 'Upload failed'
                  : isDragActive
                  ? 'Drop files here'
                  : 'Drag & drop files here, or click to select'}
              </p>
              <p className="text-xs text-muted-foreground">
                {accept && `Accepted types: ${Object.keys(accept).join(', ')}`}
                {` • Max size: ${maxSize / 1_000_000}MB`}
                {maxFiles > 1 && ` • Max files: ${maxFiles}`}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {showProgress && status === 'uploading' && (
          <Progress value={progress} className="h-2" />
        )}

        {/* Accepted Files Preview */}
        {files.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium">Selected files</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeAll}
                className="text-destructive hover:text-destructive"
              >
                Remove all
              </Button>
            </div>
            <div className="border rounded-md divide-y">
              {files.map((file, index) => (
                <div
                  key={file.path}
                  className="flex items-center justify-between p-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1_000_000).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rejected Files */}
        {rejectedFiles.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-destructive">
              Rejected files
            </h4>
            <div className="border border-destructive/20 rounded-md divide-y divide-destructive/20">
              {rejectedFiles.map((file, index) => (
                <div
                  key={`rejected-${index}`}
                  className="flex items-center justify-between p-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        File is too large or invalid type
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setRejectedFiles(prev => prev.filter((_, i) => i !== index));
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);

FileUpload.displayName = 'FileUpload';