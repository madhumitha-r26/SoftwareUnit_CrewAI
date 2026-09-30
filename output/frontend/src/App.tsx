import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Circle, 
  LayoutDashboard, 
  Settings, 
  User,
  X,
  AlertCircle
} from 'lucide-react';
import { format, isPast, parseISO } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
type Category = 'Work' | 'Personal' | 'Urgent' | 'Other';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  category: Category;
  isCompleted: boolean;
}

// --- Mock API Service ---
const API_BASE = 'https://api.taskapp.com/v1';

const MockAPI = {
  async getTasks(): Promise<Task[]> {
    // Simulating network latency
    await new Promise(resolve => setTimeout(resolve, 300));
    const data = localStorage.getItem('taskflow_tasks');
    return data ? JSON.parse(data) : [];
  },
  async saveTasks(tasks: Task[]) {
    localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
  }
};

// --- Components ---

const Modal = ({ isOpen, onClose, children, title }: { isOpen: boolean, onClose: () => void, children: React.ReactNode, title: string }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-custom w-full max-w-md shadow-xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-neutral-900">{title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<Category | 'All'>('All');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'Completed'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    category: 'Work' as Category
  });

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    setLoading(true);
    try {
      const data = await MockAPI.getTasks();
      setTasks(data);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveTask() {
    if (!formData.title || !formData.dueDate) return;
    
    // Validation: Past Date
    if (isPast(parseISO(formData.dueDate))) {
      alert("Deadline cannot be in the past");
      return;
    }

    const taskData = {
      ...formData,
      id: editingTask?.id || crypto.randomUUID(),
      isCompleted: editingTask?.isCompleted || false,
    };

    let newTasks;
    if (editingTask) {
      newTasks = tasks.map(t => t.id === editingTask.id ? taskData : t);
    } else {
      newTasks = [...tasks, taskData];
    }

    // Optimistic Update
    setTasks(newTasks);
    await MockAPI.saveTasks(newTasks);
    closeModal();
  }

  async function toggleComplete(id: string) {
    const newTasks = tasks.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t);
    setTasks(newTasks); // Optimistic UI
    await MockAPI.saveTasks(newTasks);
  }

  async function deleteTask(id: string) {
    if (confirm('Are you sure you want to delete this task?')) {
      const newTasks = tasks.filter(t => t.id !== id);
      setTasks(newTasks);
      await MockAPI.saveTasks(newTasks);
    }
  }

  function openModal(task?: Task) {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        category: task.category
      });
    } else {
      setEditingTask(null);
      setFormData({ title: '', description: '', dueDate: '', category: 'Work' });
    }
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingTask(null);
  }

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'All' || task.category === filterCategory;
      const matchesStatus = filterStatus === 'All' || 
        (filterStatus === 'Completed' ? task.isCompleted : !task.isCompleted);
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [tasks, searchQuery, filterCategory, filterStatus]);

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex-shrink-0 flex flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white">
            <CheckCircle2 size={20} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">TaskFlow</h1>
        </div>

        <nav className="flex-1 px-4 space-y-8 overflow-y-auto">
          <div>
            <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Filters</p>
            <div className="space-y-1">
              {(['All', 'Work', 'Personal', 'Urgent'] as const).map(cat => (
                <button 
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-custom text-sm transition-colors flex items-center gap-3",
                    filterCategory === cat ? "bg-blue-50 text-primary-600 font-medium" : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <div className={cn("w-2 h-2 rounded-full", filterCategory === cat ? "bg-primary-600" : "bg-gray-300")} />
                  {cat} Tasks
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Status</p>
            <div className="space-y-1">
              {(['All', 'Pending', 'Completed'] as const).map(status => (
                <button 
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-custom text-sm transition-colors flex items-center gap-3",
                    filterStatus === status ? "bg-blue-50 text-primary-600 font-medium" : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <div className={cn("w-2 h-2 rounded-full", filterStatus === status ? "bg-primary-600" : "bg-gray-300")} />
                  {status}
                </button>
              ))}
            </div>
          </div>
        </nav>

        <div className="p-4 border-t space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-custom transition-colors">
            <Settings size={18} /> Settings
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-custom transition-colors">
            <User size={18} /> Profile
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b px-6 flex items-center justify-between gap-4">
          <div className="flex-1 max-w-xl relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              className="w-full pl-10 pr-4 py-2 bg-neutral-100 border-transparent rounded-full text-sm focus:bg-white focus:ring-2 focus:ring-primary-600 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => openModal()} 
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={18} /> <span className="hidden sm:inline">Add Task</span>
            </button>
            <div className="w-8 h-8 bg-gray-200 rounded-full border border-gray-300 overflow-hidden cursor-pointer">
              <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">JD</div>
            </div>
          </div>
        </header>

        {/* Task List Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-neutral-900">My Tasks</h2>
              <p className="text-sm text-gray-500">{filteredTasks.length} tasks found</p>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p>Loading your flow...</p>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center p-8 border-2 border-dashed border-gray-200 rounded-custom bg-white">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                  <LayoutDashboard size={32} />
                </div>
                <h3 className="text-lg font-semibold mb-1">You're all caught up!</h3>
                <p className="text-gray-500 mb-6">Relax or add a new task to get started.</p>
                <button 
                  onClick={() => openModal()} 
                  className="btn-primary"
                >
                  Create Your First Task
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTasks.map(task => (
                  <div 
                    key={task.id} 
                    className={cn(
                      "group bg-white p-4 rounded-custom border transition-all hover:shadow-md flex items-start gap-4",
                      task.isCompleted ? "opacity-75" : "border-transparent shadow-sm"
                    )}
                  >
                    <button 
                      onClick={() => toggleComplete(task.id)}
                      className={cn(
                        "mt-1 transition-colors",
                        task.isCompleted ? "text-success-500" : "text-gray-300 hover:text-gray-400"
                      )}
                    >
                      {task.isCompleted ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={cn(
                          "font-medium truncate",
                          task.isCompleted && "line-through text-gray-400"
                        )}>
                          {task.title}
                        </h3>
                        <span className={cn(
                          "category-tag",
                          task.category === 'Work' && "bg-blue-100 text-blue-700",
                          task.category === 'Personal' && "bg-green-100 text-green-700",
                          task.category === 'Urgent' && "bg-orange-100 text-orange-700",
                          task.category === 'Other' && "bg-gray-100 text-gray-700",
                        )}>
                          {task.category}
                        </span>
                      </div>
                      <p className={cn(
                        "text-sm text-gray-500 truncate mb-2",
                        task.isCompleted && "text-gray-300"
                      )}>
                        {task.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs font-medium">
                        <span className={cn(
                          "flex items-center gap-1",
                          isPast(parseISO(task.dueDate)) && !task.isCompleted ? "text-danger-500" : "text-gray-400"
                        )}>
                          Due: {format(parseISO(task.dueDate), 'MMM dd, yyyy')}
                        </span>
                        {isPast(parseISO(task.dueDate)) && !task.isCompleted && (
                          <span className="bg-danger-50 text-danger-500 px-1.5 py-0.5 rounded uppercase text-[10px] font-bold">Late</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openModal(task)}
                        className="p-2 text-gray-400 hover:text-primary-600 hover:bg-blue-50 rounded-custom transition-colors"
                        aria-label="Edit task"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => deleteTask(task.id)}
                        className="p-2 text-gray-400 hover:text-danger-500 hover:bg-red-50 rounded-custom transition-colors"
                        aria-label="Delete task"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        title={editingTask ? "Edit Task" : "Add New Task"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Enter task name..." 
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              className="input-field h-24 resize-none" 
              placeholder="Enter details..." 
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deadline*</label>
              <input 
                type="date" 
                className="input-field" 
                value={formData.dueDate}
                onChange={e => setFormData({...formData, dueDate: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select 
                className="input-field" 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value as Category})}
              >
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Urgent">Urgent</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3">
            <button onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-custom transition-colors">
              Cancel
            </button>
            <button 
              onClick={handleSaveTask} 
              disabled={!formData.title || !formData.dueDate}
              className="btn-primary"
            >
              {editingTask ? 'Update Task' : 'Save Task'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}