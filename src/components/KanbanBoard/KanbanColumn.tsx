import React, { memo } from 'react';
import clsx from 'clsx';
import { KanbanColumn as KanbanColumnType, KanbanTask } from './KanbanBoard.types';
import { KanbanCard } from './KanbanCard';
import { isColumnFull, isNearingLimit } from '@/utils/column.utils';

interface KanbanColumnProps {
  column: KanbanColumnType;
  tasks: KanbanTask[];
  onAddTask: (columnId: string) => void;
  onEditTask: (task: KanbanTask) => void;
  onDeleteTask: (taskId: string) => void;
  isDropTarget?: boolean;
  isFocusedForKeyboard?: boolean;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  onDragStart?: (taskId: string) => (e: React.DragEvent) => void;
  onDragEnd?: () => void;
  isDraggingTask?: (taskId: string) => boolean;
  isKeyboardSelected?: (taskId: string) => boolean;
  onKeyDown?: (taskId: string) => (e: React.KeyboardEvent) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = memo(({
  column,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  isDropTarget = false,
  isFocusedForKeyboard = false,
  onDragOver,
  onDrop,
  onDragStart,
  onDragEnd,
  isDraggingTask,
  isKeyboardSelected,
  onKeyDown: onKeyDownProp,
}) => {
  const isFull = isColumnFull(column);
  const nearingLimit = isNearingLimit(column);

  return (
    <div className="flex flex-col bg-white rounded-xl w-80 min-w-[280px] max-w-[400px] md:w-80 flex-shrink-0 shadow-sm border border-neutral-100">
      {/* Clean & Minimal - Column header */}
      <div
        className={clsx(
          'px-4 py-3.5 rounded-t-xl flex items-center justify-between',
          'transition-colors duration-200',
          column.color
        )}
      >
        <div className="flex items-center gap-2.5">
          {/* Clear Hierarchy - Column title */}
          <h3 className="font-semibold text-white text-base tracking-tight">{column.title}</h3>
          {/* Purposeful Color - Task count badge */}
          <span className="bg-white bg-opacity-30 text-white text-xs font-medium px-2.5 py-1 rounded-full">
            {column.taskIds.length}
            {column.maxTasks && ` / ${column.maxTasks}`}
          </span>
        </div>
      </div>

      {/* Purposeful Color - WIP limits */}
      {column.maxTasks && (
        <div className="px-4 py-2.5 bg-white border-b border-neutral-100">
          <div className="w-full bg-neutral-100 rounded-full h-2">
            <div
              className={clsx(
                'h-2 rounded-full transition-all duration-300 ease-out',
                isFull ? 'bg-red-500' : nearingLimit ? 'bg-yellow-500' : 'bg-green-500'
              )}
              style={{ width: `${Math.min((column.taskIds.length / column.maxTasks) * 100, 100)}%` }}
            />
          </div>
          {/* Clear Hierarchy - Status messages */}
          {isFull && (
            <p className="text-xs text-red-600 font-medium mt-1.5">WIP limit reached</p>
          )}
          {nearingLimit && !isFull && (
            <p className="text-xs text-yellow-600 font-medium mt-1.5">Approaching WIP limit</p>
          )}
        </div>
      )}

      {/* Subtle Interactions - Drop zone */}
      <div
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={clsx(
          'flex-1 p-4 space-y-3 overflow-y-auto min-h-[500px] max-h-[calc(100vh-250px)]',
          'transition-all duration-200',
          isDropTarget && !isFull && 'bg-primary-50 ring-2 ring-primary-300 ring-inset',
          isDropTarget && isFull && 'bg-red-50 ring-2 ring-red-300 ring-inset',
          isFocusedForKeyboard && 'ring-2 ring-blue-400 ring-offset-2'
        )}
        role="region"
        aria-label={`${column.title} column. ${column.taskIds.length} tasks.${isFull ? ' Column is full.' : ''}`}
      >
        {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-neutral-400">
              <svg className="w-12 h-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-sm">No tasks yet</p>
            </div>
          ) : (
            tasks.map(task => (
              <KanbanCard
                key={task.id}
                task={task}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                isDragging={isDraggingTask?.(task.id)}
                isKeyboardSelected={isKeyboardSelected?.(task.id)}
                onDragStart={onDragStart?.(task.id)}
                onDragEnd={onDragEnd}
                onKeyDown={onKeyDownProp?.(task.id)}
              />
            ))
          )}
      </div>

      {/* Consistent Spacing - Add task button */}
      <div className="p-4 border-t border-neutral-100">
        <button
          onClick={() => onAddTask(column.id)}
          disabled={isFull}
          className={clsx(
            'w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm',
            'transition-all duration-200',
            'hover:shadow-sm',
            isFull 
              ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
              : 'bg-white text-neutral-700 border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
          )}
          aria-label={isFull ? "Column is full" : `Add task to ${column.title}`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Task
        </button>
      </div>
    </div>
  );
});

KanbanColumn.displayName = 'KanbanColumn';
