import { useState, useCallback } from 'react';

interface KeyboardDragState {
  isKeyboardDragging: boolean;
  draggedTaskId: string | null;
  focusedColumnIndex: number | null;
  currentColumnIndex: number | null;
}

interface UseKeyboardDragAndDropReturn {
  keyboardDragState: KeyboardDragState;
  handleKeyDown: (taskId: string, columnId: string) => (e: React.KeyboardEvent) => void;
  isKeyboardSelected: (taskId: string) => boolean;
}

export const useKeyboardDragAndDrop = (
  onMove: (taskId: string, fromColumn: string, toColumn: string, newIndex: number) => void,
  columns: Array<{ id: string; taskIds: string[] }>
): UseKeyboardDragAndDropReturn => {
  const [keyboardDragState, setKeyboardDragState] = useState<KeyboardDragState>({
    isKeyboardDragging: false,
    draggedTaskId: null,
    focusedColumnIndex: null,
    currentColumnIndex: null,
  });

  const handleKeyDown = useCallback((taskId: string, columnId: string) => (e: React.KeyboardEvent) => {
    // Prevent default behavior for handled keys
    if ([' ', 'Enter', 'ArrowLeft', 'ArrowRight', 'Escape'].includes(e.key)) {
      e.preventDefault();
    }

    // Grab or drop task
    if (e.key === ' ' || e.key === 'Enter') {
      if (!keyboardDragState.isKeyboardDragging) {
        // Start dragging
        const columnIndex = columns.findIndex(col => col.id === columnId);
        setKeyboardDragState({
          isKeyboardDragging: true,
          draggedTaskId: taskId,
          focusedColumnIndex: columnIndex,
          currentColumnIndex: columnIndex,
        });
      } else if (keyboardDragState.draggedTaskId === taskId) {
        // Drop task
        if (keyboardDragState.currentColumnIndex !== null) {
          const fromColumn = columns[keyboardDragState.focusedColumnIndex!].id;
          const toColumn = columns[keyboardDragState.currentColumnIndex].id;
          
          // Calculate drop index (append to end of column)
          const newIndex = columns[keyboardDragState.currentColumnIndex].taskIds.length;
          
          onMove(taskId, fromColumn, toColumn, newIndex);
        }
        
        setKeyboardDragState({
          isKeyboardDragging: false,
          draggedTaskId: null,
          focusedColumnIndex: null,
          currentColumnIndex: null,
        });
      }
    }

    // Move between columns
    if (keyboardDragState.isKeyboardDragging && keyboardDragState.draggedTaskId === taskId) {
      if (e.key === 'ArrowRight') {
        setKeyboardDragState(prev => {
          const nextIndex = Math.min(columns.length - 1, (prev.currentColumnIndex || 0) + 1);
          return {
            ...prev,
            currentColumnIndex: nextIndex,
          };
        });
      } else if (e.key === 'ArrowLeft') {
        setKeyboardDragState(prev => {
          const nextIndex = Math.max(0, (prev.currentColumnIndex || 0) - 1);
          return {
            ...prev,
            currentColumnIndex: nextIndex,
          };
        });
      } else if (e.key === 'Escape') {
        // Cancel drag
        setKeyboardDragState({
          isKeyboardDragging: false,
          draggedTaskId: null,
          focusedColumnIndex: null,
          currentColumnIndex: null,
        });
      }
    }
  }, [keyboardDragState, columns, onMove]);

  const isKeyboardSelected = useCallback((taskId: string) => {
    return keyboardDragState.isKeyboardDragging && keyboardDragState.draggedTaskId === taskId;
  }, [keyboardDragState]);

  return {
    keyboardDragState,
    handleKeyDown,
    isKeyboardSelected,
  };
};