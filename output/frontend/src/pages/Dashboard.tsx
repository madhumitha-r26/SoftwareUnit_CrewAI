import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, LogOut, Edit2, Trash2, CheckCircle, Circle, X } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'PENDING' | 'COMPLETED';
  created_at: string;
}

const Dashboard: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', status: 'PENDING' });

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ['tasks', filter],
    queryFn: async () => {
      const params = filter !== 'ALL' ? { status: filter } : {};
      const { data } = await api.get('/tasks', { params });
      return data.tasks;
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: (newTask: any) => api.post('/tasks', newTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsModalOpen(false);
      setTaskForm({ title: '', description: '', status: 'PENDING' });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: (updatedTask: any) => api.put(`/tasks/${updatedTask.id}`, updatedTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsModalOpen(false);
      setEditingTask(null);
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/tasks/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const handleOpenAddModal = () => {
    setEditingTask(null);
    setTaskForm({ title: '', description: '', status: 'PENDING' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task);
    setTaskForm({ title: task.title, description: task.description, status: task.status });
    setIsModalOpen(true);
  };

  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.title) return alert('Title is required');

    if (editingTask) {
      updateTaskMutation.mutate({ ...taskForm, id: editingTask.id });
    } else {
      createTaskMutation.mutate(taskForm);
    }
  };

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-bold text-primary">STMS</h1>
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              className="pl-10 pr-4 py-2 bg-surface border border-gray-200 rounded-full text-sm w-64 outline-none focus:ring-2 focus:ring-primary transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => { logout(); navigate('/login'); }}
            className="flex items-center gap-2 text-sm text-neutral-500 hover:text-danger transition-colors"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-neutral-900">My Tasks</h2>
          <button 
            onClick={handleOpenAddModal}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> New Task
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 p-1 bg-gray-200 rounded-md w-fit">
          {(['ALL', 'PENDING', 'COMPLETED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 text-sm font-medium rounded ${
                filter === tab ? 'bg-white text-primary shadow-sm' : 'text-neutral-500 hover:text-neutral-900'
              } transition-all`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Task List */}
        {isLoading ? (
          <div className="text-center py-20 text-neutral-500">Loading tasks...</div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
            <p className="text-neutral-500 mb-4">No tasks found. Start by creating one!</p>
            <button onClick={handleOpenAddModal} className="text-primary font-semibold hover:underline">Create first task →</button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <div 
                key={task.id} 
                className="bg-white p-4 rounded-md border border-gray-200 flex items-center justify-between group hover:border-primary transition-colors shadow-sm"
              >
                <div className="flex items-center gap-4 overflow-hidden">
                  <button 
                    onClick={() => updateTaskMutation.mutate({ ...task, status: task.status === 'PENDING' ? 'COMPLETED' : 'PENDING' })}
                    className="text-primary hover:scale-110 transition-transform"
                  >
                    {task.status === 'COMPLETED' ? <CheckCircle className="w-5 h-5 text-success" /> : <Circle className="w-5 h-5" />}
                  </button>
                  <div className="overflow-hidden">
                    <h3 className={`font-medium truncate ${task.status === 'COMPLETED' ? 'line-through text-neutral-500' : 'text-neutral-900'}`}>
                      {task.title}
                    </h3>
                    <p className="text-xs text-neutral-500 truncate">{task.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleOpenEditModal(task)}
                    className="p-2 text-neutral-500 hover:text-primary hover:bg-blue-50 rounded"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => { if(confirm('Delete this task?')) deleteTaskMutation.mutate(task.id); }}
                    className="p-2 text-neutral-500 hover:text-danger hover:bg-red-50 rounded"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-lg shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold">{editingTask ? 'Edit Task' : 'New Task'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-500 hover:text-neutral-900">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveTask} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input 
                  className="input-field" 
                  value={taskForm.title} 
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} 
                  placeholder="Enter task title..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea 
                  className="input-field h-24 resize-none" 
                  value={taskForm.description} 
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} 
                  placeholder="Enter detailed notes..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="status" 
                      checked={taskForm.status === 'PENDING'} 
                      onChange={() => setTaskForm({ ...taskForm, status: 'PENDING' })}
                      className="w-4 h-4 text-primary" 
                    /> Pending
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="status" 
                      checked={taskForm.status === 'COMPLETED'} 
                      onChange={() => setTaskForm({ ...taskForm, status: 'COMPLETED' })}
                      className="w-4 h-4 text-primary" 
                    /> Completed
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                >
                  {editingTask ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
