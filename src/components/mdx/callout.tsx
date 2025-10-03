import React from 'react';
import { AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react';

interface CalloutProps {
  type?: 'info' | 'warning' | 'success' | 'error';
  children: React.ReactNode;
  title?: string;
}

export function Callout({ type = 'info', children, title }: CalloutProps) {
  const icons = {
    info: <Info className="size-5" />,
    warning: <AlertTriangle className="size-5" />,
    success: <CheckCircle className="size-5" />,
    error: <AlertCircle className="size-5" />,
  };

  const styles = {
    info: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200',
    warning: 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800 text-yellow-900 dark:text-yellow-200',
    success: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 text-green-900 dark:text-green-200',
    error: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-900 dark:text-red-200',
  };

  return (
    <div className={`my-6 rounded-lg border p-4 ${styles[type]}`}>
      <div className="flex gap-3">
        <div className="flex-shrink-0">{icons[type]}</div>
        <div className="flex-1">
          {title && <div className="font-semibold mb-1">{title}</div>}
          <div className="text-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}
