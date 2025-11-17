import { KanbanColumn } from '@/components/KanbanBoard/KanbanBoard.types';

export const isColumnFull = (column: KanbanColumn): boolean => {
  if (!column.maxTasks) return false;
  return column.taskIds.length >= column.maxTasks;
};

export const getColumnProgress = (column: KanbanColumn): number => {
  if (!column.maxTasks) return 0;
  return (column.taskIds.length / column.maxTasks) * 100;
};

export const isNearingLimit = (column: KanbanColumn, threshold: number = 0.8): boolean => {
  if (!column.maxTasks) return false;
  return column.taskIds.length / column.maxTasks >= threshold;
};
