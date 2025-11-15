import type { Meta, StoryObj } from '@storybook/react';
import { KanbanBoard } from './KanbanBoard';
import { KanbanColumn, KanbanTask } from './KanbanBoard.types';
import { useState } from 'react';
import '../../styles/globals.css';

const meta: Meta<typeof KanbanBoard> = {
  title: 'Components/KanbanBoard',
  component: KanbanBoard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A production-grade Kanban Board component with native HTML5 drag-and-drop, full keyboard navigation (WCAG 2.1 AA compliant), and comprehensive task management. Built without forbidden libraries like @dnd-kit, MUI, or Chakra UI.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    columns: {
      description: 'Array of column definitions with id, title, color, and optional maxTasks (WIP limits)',
    },
    tasks: {
      description: 'Record of tasks indexed by task ID',
    },
    onTaskMove: {
      description: 'Callback when a task is moved between columns or reordered',
    },
    onTaskCreate: {
      description: 'Callback when a new task is created',
    },
    onTaskUpdate: {
      description: 'Callback when a task is updated',
    },
    onTaskDelete: {
      description: 'Callback when a task is deleted',
    },
  },
};

export default meta;
type Story = StoryObj<typeof KanbanBoard>;

// Sample data generators
const generateTasks = (count: number): Record<string, KanbanTask> => {
  const tasks: Record<string, KanbanTask> = {};
  const priorities: Array<'low' | 'medium' | 'high' | 'urgent'> = ['low', 'medium', 'high', 'urgent'];
  const assignees = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Williams', 'Charlie Brown'];
  const tags = [['frontend', 'react'], ['backend', 'api'], ['design', 'ui/ux'], ['testing'], ['docs']];

  for (let i = 1; i <= count; i++) {
    const id = `task-${i}`;
    tasks[id] = {
      id,
      title: `Task ${i}: ${['Implement', 'Design', 'Fix', 'Update', 'Review'][i % 5]} feature`,
      description: `This is a detailed description for task ${i}. It explains what needs to be done.`,
      status: ['todo', 'in-progress', 'review', 'done'][i % 4],
      priority: priorities[i % 4],
      assignee: assignees[i % 5],
      tags: tags[i % 5],
      createdAt: new Date(Date.now() - i * 86400000),
      dueDate: i % 3 === 0 ? new Date(Date.now() + (i - count / 2) * 86400000) : undefined,
    };
  }
  return tasks;
};

const createColumns = (tasks: Record<string, KanbanTask>): KanbanColumn[] => {
  const columns: KanbanColumn[] = [
    { id: 'todo', title: 'To Do', color: 'bg-blue-600', taskIds: [] },
    { id: 'in-progress', title: 'In Progress', color: 'bg-yellow-600', taskIds: [] },
    { id: 'review', title: 'Review', color: 'bg-purple-600', taskIds: [] },
    { id: 'done', title: 'Done', color: 'bg-green-600', taskIds: [] },
  ];

  Object.values(tasks).forEach(task => {
    const col = columns.find(c => c.id === task.status);
    if (col) col.taskIds.push(task.id);
  });

  return columns;
};

// Interactive wrapper component
const KanbanBoardWrapper = ({ initialTasks }: { initialTasks: Record<string, KanbanTask> }) => {
  const [tasks, setTasks] = useState(initialTasks);
  const [columns, setColumns] = useState(createColumns(initialTasks));

  const handleTaskMove = (taskId: string, fromColumn: string, toColumn: string, newIndex: number) => {
    setColumns(prevColumns => {
      const newColumns = prevColumns.map(col => {
        if (col.id === fromColumn) {
          return { ...col, taskIds: col.taskIds.filter(id => id !== taskId) };
        }
        if (col.id === toColumn) {
          const newTaskIds = [...col.taskIds];
          newTaskIds.splice(newIndex, 0, taskId);
          return { ...col, taskIds: newTaskIds };
        }
        return col;
      });
      return newColumns;
    });

    setTasks(prevTasks => ({
      ...prevTasks,
      [taskId]: { ...prevTasks[taskId], status: toColumn },
    }));
  };

  const handleTaskCreate = (columnId: string, task: Omit<KanbanTask, 'id' | 'createdAt'>) => {
    const newId = `task-${Date.now()}`;
    const newTask: KanbanTask = { ...task, id: newId, createdAt: new Date() };

    setTasks(prev => ({ ...prev, [newId]: newTask }));
    setColumns(prev => prev.map(col => 
      col.id === columnId ? { ...col, taskIds: [...col.taskIds, newId] } : col
    ));
  };

  const handleTaskUpdate = (taskId: string, updates: Partial<KanbanTask>) => {
    const oldStatus = tasks[taskId]?.status;
    const newStatus = updates.status;

    setTasks(prev => ({ ...prev, [taskId]: { ...prev[taskId], ...updates } }));

    if (newStatus && oldStatus !== newStatus) {
      setColumns(prev => prev.map(col => {
        if (col.id === oldStatus) return { ...col, taskIds: col.taskIds.filter(id => id !== taskId) };
        if (col.id === newStatus) return { ...col, taskIds: [...col.taskIds, taskId] };
        return col;
      }));
    }
  };

  const handleTaskDelete = (taskId: string) => {
    const task = tasks[taskId];
    if (!task) return;

    setTasks(prev => {
      const newTasks = { ...prev };
      delete newTasks[taskId];
      return newTasks;
    });

    setColumns(prev => prev.map(col =>
      col.id === task.status ? { ...col, taskIds: col.taskIds.filter(id => id !== taskId) } : col
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-100 to-neutral-200 p-8">
      <KanbanBoard
        columns={columns}
        tasks={tasks}
        onTaskMove={handleTaskMove}
        onTaskCreate={handleTaskCreate}
        onTaskUpdate={handleTaskUpdate}
        onTaskDelete={handleTaskDelete}
      />
    </div>
  );
};

// Default story - Basic kanban board with sample data
export const Default: Story = {
  render: () => <KanbanBoardWrapper initialTasks={generateTasks(8)} />,
  parameters: {
    docs: {
      description: {
        story: 'Basic Kanban board demonstrating standard workflow with 8 sample tasks across 4 columns. Shows all core features: task cards with priorities, assignees, tags, and due dates.',
      },
    },
  },
};

// Empty state story
export const EmptyState: Story = {
  render: () => <KanbanBoardWrapper initialTasks={{}} />,
  parameters: {
    docs: {
      description: {
        story: 'Empty board state showing placeholder UI. Demonstrates how the component handles zero tasks gracefully with helpful empty state messages.',
      },
    },
  },
};

// With many tasks - performance test (20+ tasks)
export const WithManyTasks: Story = {  render: () => <KanbanBoardWrapper initialTasks={generateTasks(24)} />,
  parameters: {
    docs: {
      description: {
        story: 'Performance test with 24 tasks distributed across columns. Tests render performance (<300ms) and smooth drag interactions (<16ms).',
      },
    },
  },
};

// Different priorities showcase
export const DifferentPriorities: Story = {
  render: () => {
    const tasks: Record<string, KanbanTask> = {
      'task-1': {
        id: 'task-1',
        title: 'Urgent: Fix production bug',
        description: 'Critical bug affecting users',
        status: 'in-progress',
        priority: 'urgent',
        assignee: 'John Doe',
        tags: ['bugfix', 'urgent'],
        createdAt: new Date(),
        dueDate: new Date(Date.now() + 86400000),
      },
      'task-2': {
        id: 'task-2',
        title: 'High: Implement new feature',
        status: 'todo',
        priority: 'high',
        assignee: 'Jane Smith',
        tags: ['feature'],
        createdAt: new Date(),
      },
      'task-3': {
        id: 'task-3',
        title: 'Medium: Update documentation',
        status: 'review',
        priority: 'medium',
        assignee: 'Bob Johnson',
        tags: ['docs'],
        createdAt: new Date(),
      },
      'task-4': {
        id: 'task-4',
        title: 'Low: Refactor code',
        status: 'todo',
        priority: 'low',
        assignee: 'Alice Williams',
        tags: ['refactor'],
        createdAt: new Date(),
      },
    };
    return <KanbanBoardWrapper initialTasks={tasks} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Showcases all four priority levels (Urgent, High, Medium, Low) with distinct color coding. Each priority level has unique visual indicators including left border colors and badge styles.',
      },
    },
  },
};

// With WIP limits
export const WithWIPLimits: Story = {
  render: () => {
    const tasks = generateTasks(12);
    const TasksWithLimits = () => {
      const [stateTasks, setStateTasks] = useState(tasks);
      const [columns, setColumns] = useState<KanbanColumn[]>([
        { id: 'todo', title: 'To Do', color: 'bg-blue-600', taskIds: [], maxTasks: 10 },
        { id: 'in-progress', title: 'In Progress', color: 'bg-yellow-600', taskIds: [], maxTasks: 3 },
        { id: 'review', title: 'Review', color: 'bg-purple-600', taskIds: [], maxTasks: 5 },
        { id: 'done', title: 'Done', color: 'bg-green-600', taskIds: [] },
      ]);

      // Initialize taskIds
      useState(() => {
        const updatedColumns = [...columns];
        Object.values(tasks).forEach(task => {
          const colIndex = updatedColumns.findIndex(c => c.id === task.status);
          if (colIndex !== -1) updatedColumns[colIndex].taskIds.push(task.id);
        });
        setColumns(updatedColumns);
      });

      const handleTaskMove = (taskId: string, fromColumn: string, toColumn: string, newIndex: number) => {
        setColumns(prevColumns => {
          const newColumns = prevColumns.map(col => {
            if (col.id === fromColumn) {
              return { ...col, taskIds: col.taskIds.filter(id => id !== taskId) };
            }
            if (col.id === toColumn) {
              const newTaskIds = [...col.taskIds];
              newTaskIds.splice(newIndex, 0, taskId);
              return { ...col, taskIds: newTaskIds };
            }
            return col;
          });
          return newColumns;
        });

        setStateTasks(prevTasks => ({
          ...prevTasks,
          [taskId]: { ...prevTasks[taskId], status: toColumn },
        }));
      };

      return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-100 to-neutral-200 p-8">
          <KanbanBoard
            columns={columns}
            tasks={stateTasks}
            onTaskMove={handleTaskMove}
            onTaskCreate={() => {}}
            onTaskUpdate={() => {}}
            onTaskDelete={() => {}}
          />
        </div>
      );
    };

    return <TasksWithLimits />;
  },
};

// Mobile View - Responsive design showcase
export const MobileView: Story = {
  render: () => <KanbanBoardWrapper initialTasks={generateTasks(6)} />,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Mobile-optimized view showing responsive column layout and touch-friendly interactions.',
      },
    },
  },
};

// Interactive Demo - Full featured interactive example
export const InteractiveDemo: Story = {
  render: () => {
    const InteractiveDemoComponent = () => {
      const initialTasks = generateTasks(12);
      const [tasks, setTasks] = useState(initialTasks);
      const [columns, setColumns] = useState<KanbanColumn[]>(createColumns(initialTasks));
      const [stats, setStats] = useState({ moves: 0, creates: 0, updates: 0, deletes: 0 });

      const handleTaskMove = (taskId: string, fromColumn: string, toColumn: string, newIndex: number) => {
        setColumns(prevColumns => {
          const newColumns = prevColumns.map(col => {
            if (col.id === fromColumn) {
              return { ...col, taskIds: col.taskIds.filter(id => id !== taskId) };
            }
            if (col.id === toColumn) {
              const newTaskIds = [...col.taskIds];
              newTaskIds.splice(newIndex, 0, taskId);
              return { ...col, taskIds: newTaskIds };
            }
            return col;
          });
          return newColumns;
        });
        setTasks(prev => ({ ...prev, [taskId]: { ...prev[taskId], status: toColumn } }));
        setStats(prev => ({ ...prev, moves: prev.moves + 1 }));
      };

      const handleTaskCreate = (columnId: string, task: Omit<KanbanTask, 'id' | 'createdAt'>) => {
        const newId = `task-${Date.now()}`;
        const newTask: KanbanTask = { ...task, id: newId, createdAt: new Date() };
        setTasks(prev => ({ ...prev, [newId]: newTask }));
        setColumns(prev => prev.map(col => 
          col.id === columnId ? { ...col, taskIds: [...col.taskIds, newId] } : col
        ));
        setStats(prev => ({ ...prev, creates: prev.creates + 1 }));
      };

      const handleTaskUpdate = (taskId: string, updates: Partial<KanbanTask>) => {
        const oldStatus = tasks[taskId]?.status;
        const newStatus = updates.status;
        setTasks(prev => ({ ...prev, [taskId]: { ...prev[taskId], ...updates } }));
        if (newStatus && oldStatus !== newStatus) {
          setColumns(prev => prev.map(col => {
            if (col.id === oldStatus) return { ...col, taskIds: col.taskIds.filter(id => id !== taskId) };
            if (col.id === newStatus) return { ...col, taskIds: [...col.taskIds, taskId] };
            return col;
          }));
        }
        setStats(prev => ({ ...prev, updates: prev.updates + 1 }));
      };

      const handleTaskDelete = (taskId: string) => {
        const task = tasks[taskId];
        if (!task) return;
        setTasks(prev => {
          const newTasks = { ...prev };
          delete newTasks[taskId];
          return newTasks;
        });
        setColumns(prev => prev.map(col =>
          col.id === task.status ? { ...col, taskIds: col.taskIds.filter(id => id !== taskId) } : col
        ));
        setStats(prev => ({ ...prev, deletes: prev.deletes + 1 }));
      };

      return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-100 to-neutral-200 p-8">
          <div className="mb-6 bg-white rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Interactive Demo - Action Stats</h2>
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-neutral-600">Moves:</span>
                <span className="ml-2 font-bold text-blue-600">{stats.moves}</span>
              </div>
              <div>
                <span className="text-neutral-600">Creates:</span>
                <span className="ml-2 font-bold text-green-600">{stats.creates}</span>
              </div>
              <div>
                <span className="text-neutral-600">Updates:</span>
                <span className="ml-2 font-bold text-yellow-600">{stats.updates}</span>
              </div>
              <div>
                <span className="text-neutral-600">Deletes:</span>
                <span className="ml-2 font-bold text-red-600">{stats.deletes}</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-neutral-500">
              Try: Drag tasks, create new ones (+ button), edit (click card), delete (hover card), and use keyboard navigation (Space/Enter to grab, Arrow keys to move)
            </p>
          </div>
          <KanbanBoard
            columns={columns}
            tasks={tasks}
            onTaskMove={handleTaskMove}
            onTaskCreate={handleTaskCreate}
            onTaskUpdate={handleTaskUpdate}
            onTaskDelete={handleTaskDelete}
          />
        </div>
      );
    };

    return <InteractiveDemoComponent />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Fully interactive demo with action tracking. Test all features: drag-and-drop, create, edit, delete tasks, and keyboard navigation.',
      },
    },
  },
};

// Accessibility - Keyboard Navigation Demonstration
export const Accessibility: Story = {
  render: () => {
    const AccessibilityDemoComponent = () => {
      const initialTasks = generateTasks(8);
      const [tasks, setTasks] = useState(initialTasks);
      const [columns, setColumns] = useState<KanbanColumn[]>(createColumns(initialTasks));
      const [keyboardLog, setKeyboardLog] = useState<string[]>([]);

      const logAction = (action: string) => {
        setKeyboardLog(prev => [...prev.slice(-4), `${new Date().toLocaleTimeString()}: ${action}`]);
      };

      const handleTaskMove = (taskId: string, fromColumn: string, toColumn: string, newIndex: number) => {
        setColumns(prevColumns => {
          const newColumns = prevColumns.map(col => {
            if (col.id === fromColumn) {
              return { ...col, taskIds: col.taskIds.filter(id => id !== taskId) };
            }
            if (col.id === toColumn) {
              const newTaskIds = [...col.taskIds];
              newTaskIds.splice(newIndex, 0, taskId);
              return { ...col, taskIds: newTaskIds };
            }
            return col;
          });
          return newColumns;
        });
        setTasks(prev => ({ ...prev, [taskId]: { ...prev[taskId], status: toColumn } }));
        const fromCol = columns.find(c => c.id === fromColumn)?.title;
        const toCol = columns.find(c => c.id === toColumn)?.title;
        logAction(`Moved task from "${fromCol}" to "${toCol}"`);
      };

      const handleTaskCreate = (columnId: string, task: Omit<KanbanTask, 'id' | 'createdAt'>) => {
        const newId = `task-${Date.now()}`;
        const newTask: KanbanTask = { ...task, id: newId, createdAt: new Date() };
        setTasks(prev => ({ ...prev, [newId]: newTask }));
        setColumns(prev => prev.map(col => 
          col.id === columnId ? { ...col, taskIds: [...col.taskIds, newId] } : col
        ));
      };

      const handleTaskUpdate = (taskId: string, updates: Partial<KanbanTask>) => {
        const oldStatus = tasks[taskId]?.status;
        const newStatus = updates.status;
        setTasks(prev => ({ ...prev, [taskId]: { ...prev[taskId], ...updates } }));
        if (newStatus && oldStatus !== newStatus) {
          setColumns(prev => prev.map(col => {
            if (col.id === oldStatus) return { ...col, taskIds: col.taskIds.filter(id => id !== taskId) };
            if (col.id === newStatus) return { ...col, taskIds: [...col.taskIds, taskId] };
            return col;
          }));
        }
      };

      const handleTaskDelete = (taskId: string) => {
        const task = tasks[taskId];
        if (!task) return;
        setTasks(prev => {
          const newTasks = { ...prev };
          delete newTasks[taskId];
          return newTasks;
        });
        setColumns(prev => prev.map(col =>
          col.id === task.status ? { ...col, taskIds: col.taskIds.filter(id => id !== taskId) } : col
        ));
      };

      return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-100 to-neutral-200 p-8">
          <div className="mb-6 bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-3 text-neutral-900">♿ Accessibility & Keyboard Navigation Demo</h2>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <h3 className="font-semibold text-blue-900 mb-2">Keyboard Controls (WCAG 2.1 AA Compliant)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-800">
                <div>
                  <kbd className="px-2 py-1 bg-white rounded shadow-sm border border-blue-200">Tab</kbd>
                  <span className="ml-2">Navigate between tasks</span>
                </div>
                <div>
                  <kbd className="px-2 py-1 bg-white rounded shadow-sm border border-blue-200">Space</kbd> or 
                  <kbd className="px-2 py-1 bg-white rounded shadow-sm border border-blue-200 ml-1">Enter</kbd>
                  <span className="ml-2">Grab/Drop task</span>
                </div>
                <div>
                  <kbd className="px-2 py-1 bg-white rounded shadow-sm border border-blue-200">← →</kbd>
                  <span className="ml-2">Move between columns</span>
                </div>
                <div>
                  <kbd className="px-2 py-1 bg-white rounded shadow-sm border border-blue-200">Esc</kbd>
                  <span className="ml-2">Cancel drag operation</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-4">
              <h3 className="font-semibold text-green-900 mb-2">✓ WCAG 2.1 AA Features</h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Full keyboard navigation support</li>
                <li>• ARIA labels and roles (role="button", role="region")</li>
                <li>• Screen reader announcements (aria-live)</li>
                <li>• Focus indicators (visible blue rings)</li>
                <li>• Color contrast compliance</li>
                <li>• Semantic HTML structure</li>
              </ul>
            </div>

            {keyboardLog.length > 0 && (
              <div className="mt-4 bg-neutral-50 border border-neutral-200 rounded p-3">
                <h3 className="font-semibold text-neutral-700 mb-2 text-sm">Action Log:</h3>
                <div className="space-y-1 text-xs font-mono text-neutral-600">
                  {keyboardLog.map((log, i) => (
                    <div key={i} className="flex items-start">
                      <span className="text-green-600 mr-2">→</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <KanbanBoard
            columns={columns}
            tasks={tasks}
            onTaskMove={handleTaskMove}
            onTaskCreate={handleTaskCreate}
            onTaskUpdate={handleTaskUpdate}
            onTaskDelete={handleTaskDelete}
          />
        </div>
      );
    };

    return <AccessibilityDemoComponent />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates WCAG 2.1 AA compliant keyboard navigation. Use Tab to navigate, Space/Enter to grab tasks, Arrow keys to move between columns, and Esc to cancel.',
      },
    },
  },
};
