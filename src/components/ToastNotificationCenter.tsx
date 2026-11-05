import React, { useEffect, useState, useRef } from 'react';
import { useToast } from '../context/ToastContext';
import { ToastItem } from '../types/toast';
import {
  CheckCircle2,
  FileDown,
  Cpu,
  Info,
  AlertTriangle,
  X,
  FileCheck,
  Download,
  Layers,
  ArrowRight,
  Clock,
  Sparkles,
  Zap,
} from 'lucide-react';

interface ToastCardProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

const ToastCard: React.FC<ToastCardProps> = ({ toast, onDismiss }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(100);
  const duration = toast.durationMs || 4500;
  const startTimeRef = useRef(Date.now());
  const remainingTimeRef = useRef(duration);

  useEffect(() => {
    if (isPaused) return;

    startTimeRef.current = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, remainingTimeRef.current - elapsed);
      const percent = (remaining / duration) * 100;
      setProgress(percent);

      if (remaining <= 0) {
        clearInterval(interval);
        onDismiss(toast.id);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isPaused, duration, onDismiss, toast.id]);

  const handleMouseEnter = () => {
    setIsPaused(true);
    const elapsed = Date.now() - startTimeRef.current;
    remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  // Type styling
  const getTypeConfig = () => {
    switch (toast.type) {
      case 'export':
        return {
          icon: <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />,
          borderColor: 'border-emerald-500/70',
          accentBg: 'bg-emerald-950/40',
          badgeText: 'EXPORT SUCCESS',
          badgeClass: 'bg-emerald-950 text-emerald-300 border-emerald-800/80',
          progressBarColor: 'bg-emerald-500',
        };
      case 'task':
        return {
          icon: <Zap className="w-4 h-4 text-sky-400 shrink-0" />,
          borderColor: 'border-sky-500/70',
          accentBg: 'bg-sky-950/40',
          badgeText: 'TASK COMPLETE',
          badgeClass: 'bg-sky-950 text-sky-300 border-sky-800/80',
          progressBarColor: 'bg-sky-500',
        };
      case 'success':
        return {
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
          borderColor: 'border-emerald-500/60',
          accentBg: 'bg-emerald-950/30',
          badgeText: 'CONFIRMED',
          badgeClass: 'bg-emerald-950 text-emerald-300 border-emerald-800/80',
          progressBarColor: 'bg-emerald-500',
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
          borderColor: 'border-amber-500/70',
          accentBg: 'bg-amber-950/40',
          badgeText: 'ATTENTION',
          badgeClass: 'bg-amber-950 text-amber-300 border-amber-800/80',
          progressBarColor: 'bg-amber-500',
        };
      case 'info':
      default:
        return {
          icon: <Info className="w-4 h-4 text-indigo-400 shrink-0" />,
          borderColor: 'border-indigo-500/60',
          accentBg: 'bg-indigo-950/40',
          badgeText: 'NOTICE',
          badgeClass: 'bg-indigo-950 text-indigo-300 border-indigo-800/80',
          progressBarColor: 'bg-indigo-500',
        };
    }
  };

  const config = getTypeConfig();

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`pointer-events-auto bg-[#0a0f18]/95 backdrop-blur-md border ${config.borderColor} rounded-xl shadow-2xl overflow-hidden font-mono text-xs transition-all duration-200 hover:shadow-cyan-950/30 group animate-in slide-in-from-bottom-3 fade-in`}
    >
      <div className="p-3 sm:p-3.5 space-y-2">
        {/* Header row: Icon, Badge, Timestamp, Dismiss */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {config.icon}
            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border uppercase tracking-wider ${config.badgeClass}`}>
              {config.badgeText}
            </span>
            {toast.engineId && (
              <span className="text-[9px] font-mono text-sky-400 bg-slate-900 border border-slate-800 px-1.5 py-0.2 rounded">
                {toast.engineId}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
              <Clock className="w-2.5 h-2.5 text-slate-600" />
              <span>{toast.timestamp}</span>
            </span>
            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors cursor-pointer"
              title="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="font-bold text-slate-100 text-xs tracking-tight flex items-start gap-1.5">
          <span>{toast.title}</span>
        </div>

        {/* Message */}
        {toast.message && (
          <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
            {toast.message}
          </p>
        )}

        {/* Filename Chip / Artifact Badge */}
        {toast.filename && (
          <div className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-[10px]">
            <div className="flex items-center gap-1.5 truncate text-slate-300">
              <Download className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="truncate font-mono font-medium">{toast.filename}</span>
            </div>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold shrink-0">
              DOWNLOAD READY
            </span>
          </div>
        )}

        {/* Action Button */}
        {toast.action && (
          <div className="pt-1 flex justify-end">
            <button
              onClick={toast.action.onClick}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer border border-slate-700"
            >
              <span>{toast.action.label}</span>
              <ArrowRight className="w-2.5 h-2.5" />
            </button>
          </div>
        )}
      </div>

      {/* Progress countdown line */}
      <div className="w-full h-1 bg-slate-900 overflow-hidden">
        <div
          className={`h-full transition-all duration-75 ease-linear ${config.progressBarColor}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export const ToastNotificationCenter: React.FC = () => {
  const { toasts, removeToast, clearAllToasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      id="toast-notification-center"
      aria-live="polite"
      className="fixed bottom-14 right-3 sm:right-6 z-50 max-w-sm sm:max-w-md w-full flex flex-col gap-2.5 pointer-events-none"
    >
      {/* Optional Clear All bar if multiple toasts */}
      {toasts.length > 1 && (
        <div className="flex justify-end pr-1 pointer-events-auto">
          <button
            onClick={clearAllToasts}
            className="text-[10px] font-mono text-slate-400 hover:text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 px-2 py-0.5 rounded shadow-sm transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>Clear all ({toasts.length})</span>
            <X className="w-2.5 h-2.5" />
          </button>
        </div>
      )}

      {/* Toast Stack */}
      <div className="flex flex-col gap-2.5">
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onDismiss={removeToast} />
        ))}
      </div>
    </div>
  );
};
