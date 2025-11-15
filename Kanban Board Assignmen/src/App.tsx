import { useState } from 'react';
import { KanbanBoard } from './components/KanbanBoard/KanbanBoard';
import { KanbanColumn, KanbanTask } from './components/KanbanBoard/KanbanBoard.types';
import { useKanbanBoard } from './hooks/useKanbanBoard';
import { Button } from './components/primitives/Button';
import './styles/globals.css';

// Initial sample data
const initialColumns: KanbanColumn[] = [
  {
    id: 'todo',
    title: 'To Do',
    color: 'bg-blue-600',
    taskIds: ['task-1', 'task-2', 'task-3'],
    maxTasks: 10,
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    color: 'bg-yellow-600',
    taskIds: ['task-4', 'task-5'],
    maxTasks: 5,
  },
  {
    id: 'review',
    title: 'Review',
    color: 'bg-purple-600',
    taskIds: ['task-6'],
  },
  {
    id: 'done',
    title: 'Done',
    color: 'bg-green-600',
    taskIds: ['task-7', 'task-8'],
  },
];

const initialTasks: Record<string, KanbanTask> = {
  'task-1': {
    id: 'task-1',
    title: 'Design new landing page',
    description: 'Create mockups for the new landing page with modern design',
    status: 'todo',
    priority: 'high',
    assignee: 'Sarah Johnson',
    tags: ['design', 'ui/ux'],
    createdAt: new Date('2024-01-15'),
    dueDate: new Date('2024-02-01'),
  },
  'task-2': {
    id: 'task-2',
    title: 'Implement authentication',
    description: 'Add JWT-based authentication to the API',
    status: 'todo',
    priority: 'urgent',
    assignee: 'John Doe',
    tags: ['backend', 'security'],
    createdAt: new Date('2024-01-16'),
    dueDate: new Date('2024-01-25'),
  },
  'task-3': {
    id: 'task-3',
    title: 'Update documentation',
    description: 'Update API documentation with latest endpoints',
    status: 'todo',
    priority: 'low',
    assignee: 'Mike Chen',
    tags: ['docs'],
    createdAt: new Date('2024-01-17'),
  },
  'task-4': {
    id: 'task-4',
    title: 'Build dashboard components',
    description: 'Create reusable components for the admin dashboard',
    status: 'in-progress',
    priority: 'high',
    assignee: 'Emily Davis',
    tags: ['frontend', 'react'],
    createdAt: new Date('2024-01-14'),
    dueDate: new Date('2024-01-30'),
  },
  'task-5': {
    id: 'task-5',
    title: 'Optimize database queries',
    description: 'Improve performance of slow database queries',
    status: 'in-progress',
    priority: 'medium',
    assignee: 'John Doe',
    tags: ['backend', 'performance'],
    createdAt: new Date('2024-01-13'),
  },
  'task-6': {
    id: 'task-6',
    title: 'Code review for PR #123',
    description: 'Review the new feature implementation',
    status: 'review',
    priority: 'high',
    assignee: 'Sarah Johnson',
    tags: ['review'],
    createdAt: new Date('2024-01-12'),
    dueDate: new Date('2024-01-20'),
  },
  'task-7': {
    id: 'task-7',
    title: 'Deploy staging environment',
    description: 'Set up and deploy the staging environment',
    status: 'done',
    priority: 'medium',
    assignee: 'Mike Chen',
    tags: ['devops', 'deployment'],
    createdAt: new Date('2024-01-10'),
  },
  'task-8': {
    id: 'task-8',
    title: 'Fix login button styling',
    description: 'Fix the styling issue on the login button',
    status: 'done',
    priority: 'low',
    assignee: 'Emily Davis',
    tags: ['frontend', 'bugfix'],
    createdAt: new Date('2024-01-11'),
  },
};

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('');
  const [filterAssignee, setFilterAssignee] = useState('');

  const {
    columns,
    tasks,
    handleTaskMove,
    handleTaskCreate,
    handleTaskUpdate,
    handleTaskDelete,
    filterTasks,
    resetFilters,
  } = useKanbanBoard(initialColumns, initialTasks);

  const applyFilters = () => {
    if (!searchTerm && !filterPriority && !filterAssignee) {
      resetFilters();
    } else {
      filterTasks(searchTerm, filterPriority, filterAssignee);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterPriority('');
    setFilterAssignee('');
    resetFilters();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-100 to-neutral-200">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 mb-2">Kanban Board</h1>
          <p className="text-neutral-600">Manage your tasks efficiently with drag-and-drop</p>
        </header>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label htmlFor="search" className="block text-sm font-medium text-neutral-700 mb-1">
                Search Tasks
              </label>
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                placeholder="Search by title or description..."
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>
            <div className="w-48">
              <label htmlFor="priority-filter" className="block text-sm font-medium text-neutral-700 mb-1">
                Priority
              </label>
              <select
                id="priority-filter"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              >
                <option value="">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div className="w-48">
              <label htmlFor="assignee-filter" className="block text-sm font-medium text-neutral-700 mb-1">
                Assignee
              </label>
              <input
                id="assignee-filter"
                type="text"
                value={filterAssignee}
                onChange={(e) => setFilterAssignee(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                placeholder="Filter by assignee..."
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={applyFilters} variant="primary">
                Apply Filters
              </Button>
              <Button onClick={clearFilters} variant="secondary">
                Clear
              </Button>
            </div>
          </div>
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
    </div>
  );
}

export default App;
