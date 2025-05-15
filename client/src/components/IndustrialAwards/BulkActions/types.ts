export type BulkAction = {
  type: 'export' | 'statusChange' | 'delete';
  id?: string;
  ids?: string[];
  status?: string;
};
