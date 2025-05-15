export interface Award {
    id: string;
    code: string;
    title: string;
    unionName: string;
    employer: string;
    type: 'MWB' | 'PSCA' | 'TSCA';
    commencementDate: string;
    registrationDate: string;
    duration: string;
    gazetteNumber: string;
    gazetteDate: string;
    status: 'active' | 'expired' | 'draft';
    description?: string;
    documents?: string[];
  }
  
  export interface FilePreview {
    name: string;
    size: string;
    id: string;
  }
  
  export interface AwardFormData {
    title: string;
    code: string;
    unionName: string;
    employer: string;
    type: '' | 'MWB' | 'PSCA' | 'TSCA';
    commencementDate: string;
    registrationDate: string;
    duration: string;
    gazetteNumber: string;
    gazetteDate: string;
    status: 'active' | 'expired' | 'draft';
    description: string;
  }
  
  export interface BulkAction {
    type: 'export' | 'delete' | 'statusChange';
    ids: string[];
    status?: 'active' | 'expired' | 'draft';
  }
  
  export interface AuditLog {
    id: string;
    action: string;
    userId: string;
    timestamp: string;
    awardId: string;
    changes: Record<string, { old: any; new: any }>;
  }

  export interface BulkAction {
    type: 'export' | 'delete' | 'statusChange';
    ids: string[];
    status?: 'active' | 'expired' | 'draft';
  }
  
  export interface AuditLog {
    id: string;
    action: string;
    userId: string;
    timestamp: string;
    awardId: string;
    changes: Record<string, { old: any; new: any }>;
  }
  
  export interface ExportOptions {
    format: 'csv' | 'excel';
    includeDocuments: boolean;
  }

  export interface BulkAction {
    type: 'export' | 'delete' | 'statusChange';
    ids: string[];
    status?: 'active' | 'expired' | 'draft';
  }
  
  export interface ExportOptions {
    format: 'csv' | 'excel';
    includeAttachments: boolean;
  }
  
  export interface AuditLogEntry {
    id: string;
    action: string;
    userId: string;
    timestamp: string;
    awardId: string;
    changes: Record<string, {
      old: any;
      new: any;
    }>;
  }