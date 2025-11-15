import React, { memo } from 'react';
import clsx from 'clsx';
import { KanbanTask } from './KanbanBoard.types';
import { formatDate, isOverdue, getPriorityBadgeColor, getPriorityBorderColor } from '@/utils/task.utils';
import { Avatar } from '@/components/primitives/Avatar';

interface KanbanCardProps {
  task: KanbanTask;
  onEdit: (task: KanbanTask) => void;
  onDelete: (taskId: string) => void;
  isDragging?: boolean;
  isKeyboardSelected?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = memo(({ 
  task, 
  onEdit, 
  onDelete, 
  isDragging = false,
  isKeyboardSelected = false,
  onDragStart,
  onDragEnd,
  onKeyDown: onKeyDownProp 
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // First handle keyboard drag navigation
    if (onKeyDownProp && (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Escape')) {
      onKeyDownProp(e);
      return;
    }
    
    // Then handle edit action
    if (e.key === 'Enter' && !isKeyboardSelected) {
      e.preventDefault();
      onEdit(task);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      onDelete(task.id);
    }
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={clsx(
        // Base styles - Clean & Minimal
        'bg-white rounded-lg p-4 shadow-sm',
        // Subtle interactions - Micro-animations
        'transition-all duration-200 ease-in-out',
        'hover:shadow-md hover:-translate-y-0.5',
        'cursor-move group',
        // Purposeful color - State communication
        isDragging && 'opacity-60 scale-[0.98] rotate-2 shadow-lg',
        isKeyboardSelected && 'ring-2 ring-primary-500 ring-offset-2 shadow-lg',
        // Clear hierarchy - Border for priority
        'border-l-4',
        task.priority ? getPriorityBorderColor(task.priority) : 'border-l-neutral-200'
      )}
      onClick={() => onEdit(task)}
      onKeyDown={handleKeyDown}
      aria-label={`Task: ${task.title}. Status: ${task.status}${task.priority ? `. Priority: ${task.priority}` : ''}. Press Enter to edit.`}
      role="button"
      tabIndex={0}
    >
      {/* Clear Hierarchy - Title */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h4 className="font-semibold text-sm text-neutral-900 line-clamp-2 flex-1 leading-snug">
          {task.title}
        </h4>
        {/* Subtle Interactions - Hover reveal */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleDelete}
            className="text-neutral-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors duration-150"
            aria-label="Delete task"
            title="Delete task"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Consistent Spacing - Description */}
      {task.description && (
        <p className="text-xs text-neutral-600 mb-3 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Purposeful Color - Priority & Tags */}
      <div className="flex items-center justify-between gap-2 mt-3">
        <div className="flex gap-1.5 flex-wrap items-center">
          {/* Purposeful Color - Priority badge */}
          {task.priority && (
            <span className={clsx(
              'text-xs px-2 py-0.5 rounded-md font-medium',
              'transition-colors duration-150',
              getPriorityBadgeColor(task.priority)
            )}>
              {task.priority}
            </span>
          )}
          {/* Clean & Minimal - Tag badges */}
          {task.tags?.slice(0, 2).map(tag => (
            <span key={tag} className="text-xs bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-md">
              {tag}
            </span>
          ))}
          {task.tags && task.tags.length > 2 && (
            <span className="text-xs text-neutral-500 font-medium px-1">
              +{task.tags.length - 2}
            </span>
          )}
        </div>
        {/* Subtle Interactions - Avatar hover */}
        {task.assignee && (
          <div className="transition-transform duration-150 hover:scale-110">
            <Avatar name={task.assignee} size="sm" />
          </div>
        )}
      </div>

      {/* Purposeful Color - Due date with state */}
      {task.dueDate && (
        <div className={clsx(
          'text-xs mt-3 flex items-center gap-1.5',
          'transition-colors duration-150',
          isOverdue(task.dueDate) 
            ? 'text-red-600 font-semibold bg-red-50 px-2 py-1 rounded-md -mx-1' 
            : 'text-neutral-500'
        )}>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{isOverdue(task.dueDate) ? 'Overdue: ' : 'Due: '}{formatDate(task.dueDate)}</span>
        </div>
      )}
    </div>
  );
});

KanbanCard.displayName = 'KanbanCard';
