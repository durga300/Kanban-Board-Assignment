import React, { useState, useCallback } from 'react';
import { KanbanViewProps, KanbanTask } from './KanbanBoard.types';
import { KanbanColumn } from './KanbanColumn';
import { TaskModal } from './TaskModal';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import { useKeyboardDragAndDrop } from '@/hooks/useKeyboardDragAndDrop';

export const KanbanBoard: React.FC<KanbanViewProps> = ({
  columns,
  tasks,
  onTaskMove,
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete,
}) => {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    task: KanbanTask | null;
    columnId?: string;
  }>({
    isOpen: false,
    task: null,
  });

  const {
    dragState,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
    isDragging,
    isDropTarget,
  } = useDragAndDrop(onTaskMove, columns);

  const { 
    keyboardDragState, 
    handleKeyDown, 
    isKeyboardSelected 
  } = useKeyboardDragAndDrop(onTaskMove, columns);

  const handleAddTask = useCallback((columnId: string) => {
    setModalState({
      isOpen: true,
      task: null,
      columnId,
    });
  }, []);

  const handleEditTask = useCallback((task: KanbanTask) => {
    setModalState({
      isOpen: true,
      task,
    });
  }, []);

  const handleSaveTask = useCallback((taskId: string | null, updates: Partial<KanbanTask>) => {
    if (taskId) {
      onTaskUpdate(taskId, updates);
    } else {
      const newTask: Omit<KanbanTask, 'id' | 'createdAt'> = {
        title: updates.title || '',
        description: updates.description,
        status: updates.status || modalState.columnId || columns[0].id,
        priority: updates.priority,
        assignee: updates.assignee,
        tags: updates.tags,
        dueDate: updates.dueDate,
      };
      onTaskCreate(newTask.status, newTask);
    }
  }, [onTaskUpdate, onTaskCreate, modalState.columnId, columns]);

  const handleCloseModal = useCallback(() => {
    setModalState({
      isOpen: false,
      task: null,
    });
  }, []);

  const activeTask = dragState.draggedTaskId ? tasks[dragState.draggedTaskId] : null;

  return (
    <>
      <div className="flex gap-5 md:gap-6 overflow-x-auto pb-6 px-3 md:px-5">
          {columns.map((column, index) => {
            const columnTasks = column.taskIds
              .map(taskId => tasks[taskId])
              .filter(Boolean);

            return (
              <KanbanColumn
                key={column.id}
                column={column}
                tasks={columnTasks}
                onAddTask={handleAddTask}
                onEditTask={handleEditTask}
                onDeleteTask={onTaskDelete}
                isDropTarget={isDropTarget(column.id)}
                onDragOver={handleDragOver(column.id)}
                onDrop={handleDrop(column.id)}
                onDragStart={(taskId) => handleDragStart(taskId, column.id)}
                onDragEnd={handleDragEnd}
                isDraggingTask={isDragging}
                isFocusedForKeyboard={keyboardDragState.focusedColumnIndex === index}
                isKeyboardSelected={isKeyboardSelected}
                onKeyDown={(taskId) => handleKeyDown(taskId, column.id)}
              />
            );
          })}
      </div>

      {/* Drag overlay for visual feedback */}
      {activeTask && (
        <div 
          className="fixed pointer-events-none z-50 opacity-70"
          style={{
            left: '-9999px',
            top: '-9999px',
          }}
          role="presentation" 
          aria-live="assertive"
        >
          <div className="bg-white border-l-4 rounded-lg p-3 shadow-lg rotate-3">
            <h4 className="font-medium text-sm text-neutral-900">
              {activeTask.title}
            </h4>
          </div>
        </div>
      )}

      <TaskModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        task={modalState.task}
        columns={columns}
        onSave={handleSaveTask}
        defaultColumnId={modalState.columnId}
      />
    </>
  );
};