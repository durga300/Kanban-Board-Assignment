import { format, isPast, isToday, isTomorrow } from 'date-fns';
import { KanbanTask } from '@/components/KanbanBoard/KanbanBoard.types';

export const formatDate = (date: Date): string => {
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  return format(date, 'MMM d');
};

export const isOverdue = (date: Date): boolean => {
  return isPast(date) && !isToday(date);
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const getPriorityBorderColor = (priority: KanbanTask['priority']): string => {
  switch (priority) {
    case 'urgent':
      return 'border-l-red-600';
    case 'high':
      return 'border-l-orange-500';
    case 'medium':
      return 'border-l-yellow-500';
    case 'low':
      return 'border-l-blue-500';
    default:
      return 'border-l-neutral-300';
  }
};

export const getPriorityBadgeColor = (priority: KanbanTask['priority']): string => {
  switch (priority) {
    case 'urgent':
      return 'bg-red-100 text-red-700';
    case 'high':
      return 'bg-orange-100 text-orange-700';
    case 'medium':
      return 'bg-yellow-100 text-yellow-700';
    case 'low':
      return 'bg-blue-100 text-blue-700';
    default:
      return 'bg-neutral-100 text-neutral-700';
  }
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
