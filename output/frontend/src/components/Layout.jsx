import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Kanban, Users, BarChart3, Settings, LogOut, Search, Bell, User } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../App';

export function Layout({ children }) {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Kanban', icon: Kanban, path: '/', active: true },
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Users', icon: Users, path: '/users', disabled: auth?.user.role !== 'Admin' },
    { name: 'Reports', icon: BarChart3, path: '/reports' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col">
        <div className="p-6 flex items-center gap-3 text-white font-bold text-xl">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">T</div>
          <span>TMS Enterprise</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                item.disabled 
                ? 'opacity-40 cursor-not-allowed pointer-events-none' 
                : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2 w-full text-left hover:bg-slate-800 hover:text-white rounded-md transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search Tasks... (Ctrl+K)" 
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-full text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-border">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">{auth?.user.username}</p>
                <p className="text-xs text-slate-500">{auth?.user.role}</p>
              </div>
              <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                <User size={18} className="text-slate-600" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
