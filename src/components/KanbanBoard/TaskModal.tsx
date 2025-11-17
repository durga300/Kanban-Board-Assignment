import React, { useState, useEffect } from 'react';
import { KanbanTask, KanbanColumn } from './KanbanBoard.types';
import { Modal } from '@/components/primitives/Modal';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: KanbanTask | null;
  columns: KanbanColumn[];
  onSave: (taskId: string | null, updates: Partial<KanbanTask>) => void;
  defaultColumnId?: string;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  task,
  columns,
  onSave,
  defaultColumnId,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: defaultColumnId || columns[0]?.id || '',
    priority: 'medium' as KanbanTask['priority'],
    assignee: '',
    tags: [] as string[],
    dueDate: '' as string,
  });

  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority || 'medium',
        assignee: task.assignee || '',
        tags: task.tags || [],
        dueDate: task.dueDate ? task.dueDate.toISOString().split('T')[0] : '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: defaultColumnId || columns[0]?.id || '',
        priority: 'medium',
        assignee: '',
        tags: [],
        dueDate: '',
      });
    }
  }, [task, defaultColumnId, columns]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Task title is required');
      return;
    }
    
    const updates: Partial<KanbanTask> = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      status: formData.status,
      priority: formData.priority,
      assignee: formData.assignee.trim() || undefined,
      tags: formData.tags,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
    };

    onSave(task?.id || null, updates);
    onClose();
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(tag => tag !== tagToRemove) });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? 'Edit Task' : 'Create New Task'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Clear Hierarchy - Title field */}
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-neutral-800 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-150"
            required
            placeholder="Enter task title"
          />
        </div>

        {/* Consistent Spacing - Description field */}
        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-neutral-800 mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-150"
            rows={4}
            placeholder="Enter task description"
          />
        </div>

        {/* Purposeful Color - Status & Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="status" className="block text-sm font-semibold text-neutral-800 mb-2">
              Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-150"
            >
              {columns.map(column => (
                <option key={column.id} value={column.id}>
                  {column.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-semibold text-neutral-800 mb-2">
              Priority
            </label>
            <select
              id="priority"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as KanbanTask['priority'] })}
              className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-150"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        {/* Subtle Interactions - Assignee & Due Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="assignee" className="block text-sm font-semibold text-neutral-800 mb-2">
              Assignee
            </label>
            <input
              id="assignee"
              type="text"
              value={formData.assignee}
              onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-150"
              placeholder="Enter assignee name"
            />
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-semibold text-neutral-800 mb-2">
              Due Date
            </label>
            <input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-150"
            />
          </div>
        </div>

        {/* Clean & Minimal - Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-semibold text-neutral-800 mb-2">
            Tags
          </label>
          <div className="flex gap-2">
            <input
              id="tags"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              className="flex-1 px-3.5 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-150"
              placeholder="Add a tag"
            />
            <button 
              type="button" 
              onClick={handleAddTag}
              className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg font-medium transition-colors duration-150"
            >
              Add
            </button>
          </div>
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 bg-neutral-100 text-neutral-700 px-3 py-1.5 rounded-md text-sm font-medium"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-neutral-500 hover:text-neutral-700 transition-colors duration-150"
                    aria-label={`Remove tag ${tag}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Consistent Spacing - Action buttons */}
        <div className="flex justify-end gap-3 pt-5 border-t border-neutral-100 mt-2">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2.5 text-neutral-700 hover:bg-neutral-100 rounded-lg font-medium transition-colors duration-150"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors duration-150 shadow-sm hover:shadow"
          >
            {task ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
