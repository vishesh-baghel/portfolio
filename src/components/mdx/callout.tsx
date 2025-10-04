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
    info: 'bg-blue-50 dark:bg-blue-950/20 border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-100',
    warning: 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-300 dark:border-yellow-700 text-yellow-900 dark:text-yellow-100',
    success: 'bg-green-50 dark:bg-green-950/20 border-green-300 dark:border-green-700 text-green-900 dark:text-green-100',
    error: 'bg-red-50 dark:bg-red-950/20 border-red-300 dark:border-red-700 text-red-900 dark:text-red-100',
  };

  const iconStyles = {
    info: 'text-blue-600 dark:text-blue-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    success: 'text-green-600 dark:text-green-400',
    error: 'text-red-600 dark:text-red-400',
  };

  return (
    <div className={`my-4 rounded-lg border-2 px-3 py-2.5 ${styles[type]}`}>
      <div className="flex gap-2.5 items-start">
        <div className={`flex-shrink-0 ${iconStyles[type]}`}>
          <div className="mt-[3px]">{icons[type]}</div>
        </div>
        <div className="flex-1 min-w-0">
          {title && <div className="font-semibold mb-1.5">{title}</div>}
          <div className="text-[15px] leading-normal">{children}</div>
        </div>
      </div>
    </div>
  );
}
