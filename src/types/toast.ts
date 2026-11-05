export type ToastType = 'export' | 'task' | 'success' | 'info' | 'warning';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  filename?: string;
  fileSize?: string;
  engineId?: string;
  timestamp: string;
  durationMs?: number;
  action?: ToastAction;
}

export interface ToastContextType {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, 'id' | 'timestamp'>) => string;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
  notifyExport: (filename: string, format: string, details?: string) => string;
  notifyTask: (title: string, message: string, engineId?: string) => string;
  notifySuccess: (title: string, message?: string) => string;
  notifyInfo: (title: string, message?: string) => string;
  notifyWarning: (title: string, message?: string) => string;
}
