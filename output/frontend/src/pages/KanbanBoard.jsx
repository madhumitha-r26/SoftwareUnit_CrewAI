import React, { useState, useEffect } from 'react';
import { Plus, AlertCircle, Filter, ArrowUpDown, MoreVertical } from 'lucide-react';
import axios from 'axios';
import { TaskModal } from './TaskModal';

const COLUMNS = ['To-Do', 'In Progress', 'Review', 'Done'];

export function KanbanBoard() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskMove = async (taskId, newStatus) => {
    try {
      const res = await axios.patch(`http://localhost:5000/api/tasks/${taskId}`, { status: newStatus });
      setTasks(prev => prev.map(t => t._id === taskId ? res.data : t));
    } catch (err) {
      const msg = err.response?.data?.message || 'Action forbidden or state transition invalid';
      alert(msg);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const res = await axios.post('http://localhost:5000/api/tasks', taskData);
      setTasks(prev => [...prev, res.data]);
      setIsModalOpen(false);
    } catch (err) {
      alert('Failed to create task');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-full">Loading Kanban...</div>;

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Project Alpha / Kanban Board</h1>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-md bg-white hover:bg-slate-50">
            <Filter size={16} /> Filter: Me
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-md bg-white hover:bg-slate-50">
            <ArrowUpDown size={16} /> Sort: Priority
          </button>
          <button 
            onClick={() => { setSelectedTask(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-md shadow-sm transition-colors"
          >
            <Plus size={16} /> New Task
          </button>
        </div>
      </div>

      <div className="flex gap-6 h-full overflow-x-auto pb-4">
        {COLUMNS.map(col => (
          <div key={col} className="kanban-column" role="region" aria-label={`Column: ${col}`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-slate-600 uppercase text-xs tracking-wider">{col}</h3>
              <span className="text-xs font-medium bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                {tasks.filter(t => t.status === col).length}
              </span>
            </div>
            
            <div className="flex-1 flex flex-col gap-3">
              {tasks.filter(t => t.status === col).map(task => (
                <div 
                  key={task._id} 
                  className="task-card"
                  onClick={() => { setSelectedTask(task); setIsModalOpen(true); }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">{task._id.slice(-6)}</span>
                    <MoreVertical size={14} className="text-slate-400" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-800 mb-3">{task.title}</h4>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        task.priority === 'High' ? 'bg-red-100 text-red-600' : 
                        task.priority === 'Medium' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {task.priority}
                      </span>
                      <span className="text-xs text-slate-500">User: {task.assignee?.username || 'Unassigned'}</span>
                    </div>
                    
                    {task.isBlocked && (
                      <div className="flex items-center gap-1 text-warning text-[10px] font-bold uppercase">
                        <AlertCircle size={12} /> Blocked
                      </div>
                    )}
                  </div>
                  
                  {/* Simple Drag-and-Drop Simulator */}
                  <div className="mt-4 pt-3 border-t border-slate-50 flex justify-end gap-1">
                    {COLUMNS.filter(c => c !== col).map(c => (
                      <button 
                        key={c} 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTaskMove(task._id, c);
                        }}
                        className="text-[10px] px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded"
                      >
                        Move to {c}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <TaskModal 
          task={selectedTask} 
          onClose={() => setIsModalOpen(false)} 
          onSave={selectedTask ? async (data) => {
            try {
              const res = await axios.patch(`http://localhost:5000/api/tasks/${selectedTask._id}`, data);
              setTasks(prev => prev.map(t => t._id === selectedTask._id ? res.data : t));
              setIsModalOpen(false);
            } catch (err) {
              alert(err.response?.data?.message || 'Update failed');
            }
          } : handleCreateTask}
        />
      )}
    </div>
  );
}
