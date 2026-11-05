import { useState, useCallback, useMemo, useEffect } from 'react';

export interface BlockOrderState {
  order: string[];
  isCustomized: boolean;
}

export function useCanvasBlockOrder(
  layoutKey: string,
  defaultBlockIds: string[],
  onReorderCallback?: (blockId: string, newIndex: number) => void
) {
  const [order, setOrder] = useState<string[]>(defaultBlockIds);
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const [dragOverBlockId, setDragOverBlockId] = useState<string | null>(null);
  const [dropPosition, setDropPosition] = useState<'before' | 'after' | null>(null);

  // Sync when defaultBlockIds change
  useEffect(() => {
    setOrder((current) => {
      // If current contains the same items, preserve custom order; otherwise reset
      const hasAll = defaultBlockIds.every((id) => current.includes(id));
      if (hasAll && current.length === defaultBlockIds.length) {
        return current;
      }
      return defaultBlockIds;
    });
  }, [layoutKey, defaultBlockIds]);

  const isCustomized = useMemo(() => {
    if (order.length !== defaultBlockIds.length) return false;
    return order.some((id, idx) => id !== defaultBlockIds[idx]);
  }, [order, defaultBlockIds]);

  const moveBlock = useCallback(
    (sourceId: string, targetId: string, position: 'before' | 'after') => {
      if (sourceId === targetId) return;

      setOrder((prev) => {
        const fromIndex = prev.indexOf(sourceId);
        const toIndex = prev.indexOf(targetId);

        if (fromIndex === -1 || toIndex === -1) return prev;

        const newOrder = [...prev];
        // Remove source
        newOrder.splice(fromIndex, 1);

        // Calculate new insertion index
        let insertIndex = newOrder.indexOf(targetId);
        if (position === 'after') {
          insertIndex += 1;
        }

        newOrder.splice(insertIndex, 0, sourceId);

        if (onReorderCallback) {
          onReorderCallback(sourceId, insertIndex);
        }

        return newOrder;
      });
    },
    [onReorderCallback]
  );

  const stepBlock = useCallback(
    (id: string, direction: 'up' | 'down') => {
      setOrder((prev) => {
        const idx = prev.indexOf(id);
        if (idx === -1) return prev;
        const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (targetIdx < 0 || targetIdx >= prev.length) return prev;

        const newOrder = [...prev];
        const [moved] = newOrder.splice(idx, 1);
        newOrder.splice(targetIdx, 0, moved);

        if (onReorderCallback) {
          onReorderCallback(id, targetIdx);
        }

        return newOrder;
      });
    },
    [onReorderCallback]
  );

  const resetOrder = useCallback(() => {
    setOrder([...defaultBlockIds]);
  }, [defaultBlockIds]);

  // Drag Event Handlers
  const handleDragStart = useCallback((id: string, e: React.DragEvent) => {
    setDraggedBlockId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  }, []);

  const handleDragOver = useCallback(
    (id: string, e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = 'move';

      if (!draggedBlockId || draggedBlockId === id) {
        setDragOverBlockId(null);
        setDropPosition(null);
        return;
      }

      const rect = e.currentTarget.getBoundingClientRect();
      const midpointY = rect.top + rect.height / 2;
      const pos: 'before' | 'after' = e.clientY < midpointY ? 'before' : 'after';

      setDragOverBlockId(id);
      setDropPosition(pos);
    },
    [draggedBlockId]
  );

  const handleDragLeave = useCallback(
    (id: string, e: React.DragEvent) => {
      // Only clear if leaving the current element
      if (dragOverBlockId === id) {
        const rect = e.currentTarget.getBoundingClientRect();
        if (
          e.clientX < rect.left ||
          e.clientX > rect.right ||
          e.clientY < rect.top ||
          e.clientY > rect.bottom
        ) {
          setDragOverBlockId(null);
          setDropPosition(null);
        }
      }
    },
    [dragOverBlockId]
  );

  const handleDrop = useCallback(
    (id: string, e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const sourceId = draggedBlockId || e.dataTransfer.getData('text/plain');
      if (sourceId && sourceId !== id && dropPosition) {
        moveBlock(sourceId, id, dropPosition);
      }

      setDraggedBlockId(null);
      setDragOverBlockId(null);
      setDropPosition(null);
    },
    [draggedBlockId, dropPosition, moveBlock]
  );

  const handleDragEnd = useCallback(() => {
    setDraggedBlockId(null);
    setDragOverBlockId(null);
    setDropPosition(null);
  }, []);

  return {
    order,
    isCustomized,
    draggedBlockId,
    dragOverBlockId,
    dropPosition,
    moveBlock,
    stepBlock,
    resetOrder,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
  };
}
