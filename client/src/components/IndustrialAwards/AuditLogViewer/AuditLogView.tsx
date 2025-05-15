import React from 'react';
import { AuditLog } from '../types';

interface AuditLogViewerProps {
  logs: AuditLog[];
}

export const AuditLogViewer: React.FC<AuditLogViewerProps> = ({ logs }) => (
  <div className="bg-white p-6 rounded-lg max-h-[80vh] overflow-y-auto">
    <h3 className="text-lg font-medium text-gray-900 mb-4">Audit Logs</h3>
    <div className="space-y-4">
      {logs.map(log => (
        <div key={log.id} className="border-b border-gray-200 pb-4">
          <div className="flex justify-between">
            <span className="font-medium">{log.action}</span>
            <span className="text-sm text-gray-500">
              {new Date(log.timestamp).toLocaleString()}
            </span>
          </div>
          {Object.entries(log.changes).map(([key, change]) => (
            <div key={key} className="text-sm mt-1">
              <span className="font-medium">{key}:</span> {String(change.old)} → {String(change.new)}
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);
