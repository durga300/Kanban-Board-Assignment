import { useState, useCallback, useRef } from 'react';

interface DragState {
  draggedTaskId: string | null;
  draggedFromColumn: string | null;
  dragOverColumn: string | null;
  dragOverTaskId: string | null;
}

interface UseDragAndDropReturn {
  dragState: DragState;
  handleDragStart: (taskId: string, columnId: string) => (e: React.DragEvent) => void;
  handleDragEnd: () => void;
  handleDragOver: (columnId: string, taskId?: string) => (e: React.DragEvent) => void;
  handleDrop: (columnId: string, taskId?: string) => (e: React.DragEvent) => void;
  isDragging: (taskId: string) => boolean;
  isDropTarget: (columnId: string) => boolean;
}

export const useDragAndDrop = (
  onMove: (taskId: string, fromColumn: string, toColumn: string, newIndex: number) => void,
  columns: Array<{ id: string; taskIds: string[]; maxTasks?: number }>
): UseDragAndDropReturn => {
  const [dragState, setDragState] = useState<DragState>({
    draggedTaskId: null,
    draggedFromColumn: null,
    dragOverColumn: null,
    dragOverTaskId: null,
  });

  const draggedDataRef = useRef<{ taskId: string; fromColumn: string } | null>(null);

  const handleDragStart = useCallback((taskId: string, columnId: string) => (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', taskId);
    
    draggedDataRef.current = { taskId, fromColumn: columnId };
    
    setDragState({
      draggedTaskId: taskId,
      draggedFromColumn: columnId,
      dragOverColumn: null,
      dragOverTaskId: null,
    });

    // Set drag image
    if (e.dataTransfer.setDragImage) {
      const dragImage = (e.target as HTMLElement).cloneNode(true) as HTMLElement;
      dragImage.style.opacity = '0.5';
      document.body.appendChild(dragImage);
      e.dataTransfer.setDragImage(dragImage, 0, 0);
      setTimeout(() => document.body.removeChild(dragImage), 0);
    }
  }, []);

  const handleDragEnd = useCallback(() => {
    setDragState({
      draggedTaskId: null,
      draggedFromColumn: null,
      dragOverColumn: null,
      dragOverTaskId: null,
    });
    draggedDataRef.current = null;
  }, []);

  const handleDragOver = useCallback((columnId: string, taskId?: string) => (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    const column = columns.find(col => col.id === columnId);
    if (!column) return;

    // Check WIP limit
    if (column.maxTasks && column.taskIds.length >= column.maxTasks) {
      if (draggedDataRef.current?.fromColumn !== columnId) {
        e.dataTransfer.dropEffect = 'none';
        return;
      }
    }

    setDragState(prev => ({
      ...prev,
      dragOverColumn: columnId,
      dragOverTaskId: taskId || null,
    }));
  }, [columns]);

  const handleDrop = useCallback((columnId: string, taskId?: string) => (e: React.DragEvent) => {
    e.preventDefault();
    
    const draggedData = draggedDataRef.current;
    if (!draggedData) return;

    const { taskId: draggedTaskId, fromColumn } = draggedData;
    const column = columns.find(col => col.id === columnId);
    
    if (!column) return;

    // Check WIP limit
    if (column.maxTasks && column.taskIds.length >= column.maxTasks) {
      if (fromColumn !== columnId) {
        handleDragEnd();
        return;
      }
    }

    // Calculate drop index
    let newIndex = column.taskIds.length;
    if (taskId) {
      const dropIndex = column.taskIds.indexOf(taskId);
      if (dropIndex !== -1) {
        newIndex = dropIndex;
        // If dropping in the same column and dragging down, adjust index
        if (fromColumn === columnId) {
          const dragIndex = column.taskIds.indexOf(draggedTaskId);
          if (dragIndex < dropIndex) {
            newIndex = dropIndex;
          }
        }
      }
    }

    if (fromColumn !== columnId || newIndex !== column.taskIds.indexOf(draggedTaskId)) {
      onMove(draggedTaskId, fromColumn, columnId, newIndex);
    }

    handleDragEnd();
  }, [columns, onMove, handleDragEnd]);

  const isDragging = useCallback((taskId: string) => {
    return dragState.draggedTaskId === taskId;
  }, [dragState.draggedTaskId]);

  const isDropTarget = useCallback((columnId: string) => {
    return dragState.dragOverColumn === columnId;
  }, [dragState.dragOverColumn]);

  return {
    dragState,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
    isDragging,
    isDropTarget,
  };
};
