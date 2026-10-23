import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

export function TaskModal({ task, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'To-Do',
    priority: 'Medium',
    assignee: '',
    dependencies: []
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'To-Do',
        priority: task.priority || 'Medium',
        assignee: task.assignee?._id || '',
        dependencies: task.dependencies || []
      });
    }
  }, [task]);

  const handleDependencyAdd = () => {
    const depId = prompt('Enter Task ID to depend on:');
    if (depId) {
      setFormData(prev => ({ ...prev, dependencies: [...prev.dependencies, depId] }));
    }
  };

  const removeDependency = (id) => {
    setFormData(prev => ({ ...prev, dependencies: prev.dependencies.filter(d => d !== id) }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-slate-900">
            {task ? `Edit Task: ${task._id.slice(-6)}` : 'Create New Task'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Status</label>
              <select 
                value={formData.status} 
                onChange={e => setFormData({...formData, status: e.target.value})}
                className="w-full p-2 border border-border rounded-md text-sm outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option>To-Do</option>
                <option>In Progress</option>
                <option>Review</option>
                <option>Done</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Priority</label>
              <select 
                value={formData.priority} 
                onChange={e => setFormData({...formData, priority: e.target.value})}
                className="w-full p-2 border border-border rounded-md text-sm outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Assignee ID</label>
              <input 
                type="text" 
                value={formData.assignee} 
                onChange={e => setFormData({...formData, assignee: e.target.value})}
                className="w-full p-2 border border-border rounded-md text-sm outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="User ID..."
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Title</label>
            <input 
              type="text" 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})}
              className="w-full p-2 border border-border rounded-md text-sm outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Enter task title..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Description</label>
            <textarea 
              rows="4" 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full p-2 border border-border rounded-md text-sm outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Detailed requirements..."
            />
          </div>

          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-xs font-semibold text-slate-500 uppercase">Dependencies</label>
              <button 
                onClick={handleDependencyAdd}
                className="text-xs flex items-center gap-1 text-primary hover:underline font-medium"
              >
                <Plus size={12} /> Add Dependency
              </button>
            </div>
            <div className="space-y-2">
              {formData.dependencies.length === 0 && (
                <p className="text-xs text-slate-400 italic">No dependencies mapped.</p>
              )}
              {formData.dependencies.map((dep, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 rounded border border-border text-xs">
                  <span className="flex items-center gap-2">
                    <span className="text-slate-400">Blocked By:</span>
                    <span className="font-mono font-medium">{dep}</span>
                  </span>
                  <button onClick={() => removeDependency(dep)} className="text-danger hover:text-red-700">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-border flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800">
            Cancel
          </button>
          <button 
            onClick={() => onSave(formData)}
            className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-md shadow-sm"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
