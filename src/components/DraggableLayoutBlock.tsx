import React, { useState } from 'react';
import { GripVertical, ChevronUp, ChevronDown, Move } from 'lucide-react';

export type BlockCategory =
  | 'header'
  | 'headline'
  | 'body'
  | 'graphic'
  | 'card'
  | 'footer'
  | 'asset';

export interface DraggableLayoutBlockProps {
  id: string;
  index: number;
  totalBlocks: number;
  label: string;
  category: BlockCategory;
  isReorderMode: boolean;
  isDragging?: boolean;
  dropPosition?: 'before' | 'after' | null;
  onDragStart: (id: string, e: React.DragEvent) => void;
  onDragOver: (id: string, e: React.DragEvent) => void;
  onDragLeave: (id: string, e: React.DragEvent) => void;
  onDrop: (id: string, e: React.DragEvent) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onMoveUp?: (id: string) => void;
  onMoveDown?: (id: string) => void;
  className?: string;
  children: React.ReactNode;
}

export const DraggableLayoutBlock: React.FC<DraggableLayoutBlockProps> = ({
  id,
  index,
  totalBlocks,
  label,
  category,
  isReorderMode,
  isDragging = false,
  dropPosition = null,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  onMoveUp,
  onMoveDown,
  className = '',
  children,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getCategoryBadge = () => {
    switch (category) {
      case 'graphic':
      case 'asset':
        return 'bg-pink-950/80 text-pink-300 border-pink-700/60';
      case 'headline':
        return 'bg-indigo-950/80 text-indigo-200 border-indigo-700/60';
      case 'header':
        return 'bg-sky-950/80 text-sky-200 border-sky-700/60';
      case 'card':
        return 'bg-amber-950/80 text-amber-200 border-amber-700/60';
      case 'footer':
        return 'bg-slate-800 text-slate-300 border-slate-600';
      case 'body':
      default:
        return 'bg-emerald-950/80 text-emerald-200 border-emerald-700/60';
    }
  };

  const showHeaderAffordance = isReorderMode || isHovered;

  return (
    <div
      id={`layout-block-${id}`}
      data-block-id={id}
      draggable
      onDragStart={(e) => onDragStart(id, e)}
      onDragOver={(e) => onDragOver(id, e)}
      onDragLeave={(e) => onDragLeave(id, e)}
      onDrop={(e) => onDrop(id, e)}
      onDragEnd={onDragEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative transition-all duration-200 select-none ${
        isDragging
          ? 'opacity-35 scale-[0.98] border-2 border-dashed border-sky-400 rounded-lg pointer-events-none'
          : ''
      } ${
        dropPosition === 'before'
          ? 'border-t-4 border-sky-400 shadow-[0_-4px_12px_rgba(56,189,248,0.5)] -mt-1'
          : ''
      } ${
        dropPosition === 'after'
          ? 'border-b-4 border-sky-400 shadow-[0_4px_12px_rgba(56,189,248,0.5)] -mb-1'
          : ''
      } ${
        isReorderMode
          ? 'ring-1 ring-dashed ring-sky-400/50 rounded-lg p-1.5 bg-sky-500/[0.03] cursor-grab active:cursor-grabbing hover:ring-sky-400 hover:bg-sky-500/[0.07]'
          : ''
      } ${className}`}
    >
      {/* Reorder and Block Identifier Header Bar */}
      {showHeaderAffordance && (
        <div
          className={`absolute -top-3.5 left-2 right-2 z-40 flex items-center justify-between gap-1.5 px-2 py-0.5 rounded-md font-mono text-[9px] shadow-lg backdrop-blur-md pointer-events-auto transition-all animate-in fade-in zoom-in-95 duration-100 ${
            isReorderMode
              ? 'bg-[#090d16]/95 border border-sky-500 text-sky-200 shadow-sky-500/20'
              : 'bg-black/90 border border-slate-700/80 text-slate-300'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-1.5 overflow-hidden">
            <span
              className="cursor-grab active:cursor-grabbing text-sky-400 flex items-center p-0.5 hover:bg-sky-950/60 rounded"
              title="Click & drag to reorder block"
            >
              <GripVertical className="w-3 h-3" />
            </span>
            <span
              className={`px-1 py-0.2 rounded border uppercase font-bold text-[8px] tracking-wider ${getCategoryBadge()}`}
            >
              {category}
            </span>
            <span className="font-semibold truncate max-w-[120px] sm:max-w-[180px] text-slate-200">
              {label}
            </span>
            <span className="text-slate-400 font-bold">
              #{index + 1}/{totalBlocks}
            </span>
          </div>

          {/* Quick Step Buttons */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              id={`btn-block-up-${id}`}
              onClick={(e) => {
                e.stopPropagation();
                if (onMoveUp) onMoveUp(id);
              }}
              disabled={index === 0}
              className="p-0.5 hover:bg-slate-800 disabled:opacity-20 text-slate-300 hover:text-white rounded transition-colors"
              title="Move block up"
            >
              <ChevronUp className="w-3 h-3" />
            </button>
            <button
              id={`btn-block-down-${id}`}
              onClick={(e) => {
                e.stopPropagation();
                if (onMoveDown) onMoveDown(id);
              }}
              disabled={index === totalBlocks - 1}
              className="p-0.5 hover:bg-slate-800 disabled:opacity-20 text-slate-300 hover:text-white rounded transition-colors"
              title="Move block down"
            >
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Block Content */}
      <div className="w-full relative">{children}</div>
    </div>
  );
};
