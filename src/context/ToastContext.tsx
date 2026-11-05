import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ToastItem, ToastContextType, ToastType } from '../types/toast';

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const addToast = useCallback((toastData: Omit<ToastItem, 'id' | 'timestamp'>): string => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const newToast: ToastItem = {
      ...toastData,
      id,
      timestamp: timeStr,
      durationMs: toastData.durationMs ?? 4500,
    };

    setToasts((prev) => {
      // Keep up to 5 concurrent toasts in stack
      const next = [newToast, ...prev];
      return next.slice(0, 5);
    });

    return id;
  }, []);

  const notifyExport = useCallback(
    (filename: string, format: string, details?: string) => {
      return addToast({
        type: 'export',
        title: `File Export Complete: ${format.toUpperCase()}`,
        message: details || `Generated production artifact matching ISO 12647-2 prepress standards.`,
        filename,
        durationMs: 5000,
      });
    },
    [addToast]
  );

  const notifyTask = useCallback(
    (title: string, message: string, engineId?: string) => {
      return addToast({
        type: 'task',
        title,
        message,
        engineId,
        durationMs: 4500,
      });
    },
    [addToast]
  );

  const notifySuccess = useCallback(
    (title: string, message?: string) => {
      return addToast({
        type: 'success',
        title,
        message,
        durationMs: 4000,
      });
    },
    [addToast]
  );

  const notifyInfo = useCallback(
    (title: string, message?: string) => {
      return addToast({
        type: 'info',
        title,
        message,
        durationMs: 4000,
      });
    },
    [addToast]
  );

  const notifyWarning = useCallback(
    (title: string, message?: string) => {
      return addToast({
        type: 'warning',
        title,
        message,
        durationMs: 5000,
      });
    },
    [addToast]
  );

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        clearAllToasts,
        notifyExport,
        notifyTask,
        notifySuccess,
        notifyInfo,
        notifyWarning,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
