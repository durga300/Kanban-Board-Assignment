import { useState, useCallback } from 'react';
import { KanbanColumn, KanbanTask } from '@/components/KanbanBoard/KanbanBoard.types';
import { generateId } from '@/utils/task.utils';

interface UseKanbanBoardReturn {
  columns: KanbanColumn[];
  tasks: Record<string, KanbanTask>;
  handleTaskMove: (taskId: string, fromColumn: string, toColumn: string, newIndex: number) => void;
  handleTaskCreate: (columnId: string, task: Omit<KanbanTask, 'id' | 'createdAt'>) => void;
  handleTaskUpdate: (taskId: string, updates: Partial<KanbanTask>) => void;
  handleTaskDelete: (taskId: string) => void;
  filterTasks: (searchTerm: string, filterPriority?: string, filterAssignee?: string) => void;
  resetFilters: () => void;
}

export const useKanbanBoard = (
  initialColumns: KanbanColumn[],
  initialTasks: Record<string, KanbanTask>
): UseKanbanBoardReturn => {
  const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns);
  const [tasks, setTasks] = useState<Record<string, KanbanTask>>(initialTasks);
  const [allTasks, setAllTasks] = useState<Record<string, KanbanTask>>(initialTasks);
  const [isFiltered, setIsFiltered] = useState(false);

  const handleTaskMove = useCallback(
    (taskId: string, fromColumn: string, toColumn: string, newIndex: number) => {
      setColumns(prevColumns => {
        const newColumns = prevColumns.map(col => {
          if (col.id === fromColumn) {
            return {
              ...col,
              taskIds: col.taskIds.filter(id => id !== taskId),
            };
          }
          if (col.id === toColumn) {
            const newTaskIds = [...col.taskIds];
            newTaskIds.splice(newIndex, 0, taskId);
            return {
              ...col,
              taskIds: newTaskIds,
            };
          }
          return col;
        });
        return newColumns;
      });

      setTasks(prevTasks => ({
        ...prevTasks,
        [taskId]: {
          ...prevTasks[taskId],
          status: toColumn,
        },
      }));
    },
    []
  );

  const handleTaskCreate = useCallback(
    (columnId: string, task: Omit<KanbanTask, 'id' | 'createdAt'>) => {
      const newId = generateId();
      const newTask: KanbanTask = {
        ...task,
        id: newId,
        createdAt: new Date(),
      };

      setTasks(prevTasks => ({
        ...prevTasks,
        [newId]: newTask,
      }));

      setAllTasks(prevTasks => ({
        ...prevTasks,
        [newId]: newTask,
      }));

      setColumns(prevColumns =>
        prevColumns.map(col =>
          col.id === columnId ? { ...col, taskIds: [...col.taskIds, newId] } : col
        )
      );
    },
    []
  );

  const handleTaskUpdate = useCallback((taskId: string, updates: Partial<KanbanTask>) => {
    setTasks(prevTasks => {
      const currentTask = prevTasks[taskId];
      const oldStatus = currentTask?.status;
      const newStatus = updates.status;

      const updatedTasks = {
        ...prevTasks,
        [taskId]: {
          ...prevTasks[taskId],
          ...updates,
        },
      };

      setAllTasks(updatedTasks);

      if (newStatus && oldStatus !== newStatus) {
        setColumns(prevColumns =>
          prevColumns.map(col => {
            if (col.id === oldStatus) {
              return {
                ...col,
                taskIds: col.taskIds.filter(id => id !== taskId),
              };
            }
            if (col.id === newStatus) {
              return {
                ...col,
                taskIds: [...col.taskIds, taskId],
              };
            }
            return col;
          })
        );
      }

      return updatedTasks;
    });
  }, []);

  const handleTaskDelete = useCallback((taskId: string) => {
    setTasks(prevTasks => {
      const task = prevTasks[taskId];
      if (!task) return prevTasks;

      const newTasks = { ...prevTasks };
      delete newTasks[taskId];

      setAllTasks(newTasks);

      setColumns(prevColumns =>
        prevColumns.map(col =>
          col.id === task.status ? { ...col, taskIds: col.taskIds.filter(id => id !== taskId) } : col
        )
      );

      return newTasks;
    });
  }, []);

  const filterTasks = useCallback(
    (searchTerm: string, filterPriority?: string, filterAssignee?: string) => {
      setIsFiltered(true);
      setTasks(prevAllTasks => {
        const currentAllTasks = isFiltered ? allTasks : prevAllTasks;
        const filtered: Record<string, KanbanTask> = {};
        const updatedColumns = initialColumns.map(col => ({ ...col, taskIds: [] as string[] }));

        Object.entries(currentAllTasks).forEach(([id, task]) => {
          const matchesSearch = searchTerm
            ? task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              task.description?.toLowerCase().includes(searchTerm.toLowerCase())
            : true;

          const matchesPriority = filterPriority ? task.priority === filterPriority : true;
          const matchesAssignee = filterAssignee
            ? task.assignee?.toLowerCase().includes(filterAssignee.toLowerCase())
            : true;

          if (matchesSearch && matchesPriority && matchesAssignee) {
            filtered[id] = task;
            const colIndex = updatedColumns.findIndex(c => c.id === task.status);
            if (colIndex !== -1) {
              updatedColumns[colIndex].taskIds.push(id);
            }
          }
        });

        setColumns(updatedColumns);
        return filtered;
      });
    },
    [allTasks, initialColumns, isFiltered]
  );

  const resetFilters = useCallback(() => {
    setIsFiltered(false);
    setTasks(allTasks);
    const restoredColumns = initialColumns.map(col => ({
      ...col,
      taskIds: Object.values(allTasks)
        .filter(task => task.status === col.id)
        .map(task => task.id),
    }));
    setColumns(restoredColumns);
  }, [allTasks, initialColumns]);

  return {
    columns,
    tasks,
    handleTaskMove,
    handleTaskCreate,
    handleTaskUpdate,
    handleTaskDelete,
    filterTasks,
    resetFilters,
  };
};
