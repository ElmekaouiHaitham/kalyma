import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Users, BookOpen, Settings, LogOut } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-[#0a0f1c] text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white/5 border-r border-white/10 flex flex-col backdrop-blur-xl">
        <div className="p-6">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold">
              K
            </div>
            <span className="text-xl font-bold tracking-tight">Kalyma Admin</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavItem href="/admin" icon={<LayoutDashboard size={20} />} label="Dashboard" active />
          <NavItem href="/admin/users" icon={<Users size={20} />} label="Users" />
          <NavItem href="/admin/content" icon={<BookOpen size={20} />} label="Content" />
          <NavItem href="/admin/settings" icon={<Settings size={20} />} label="Settings" />
        </nav>
        
        <div className="p-4 border-t border-white/10">
          <button className="flex items-center w-full px-4 py-2 space-x-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 bg-[#0a0f1c]/80 backdrop-blur-md border-b border-white/10 px-8 py-5 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
          <div className="flex items-center space-x-4">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold shadow-lg shadow-blue-900/50">
              A
            </div>
          </div>
        </header>
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ href, icon, label, active = false }: { href: string, icon: React.ReactNode, label: string, active?: boolean }) => {
  return (
    <Link 
      href={href} 
      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
        active 
          ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(37,99,235,0.1)]' 
          : 'text-gray-400 hover:text-white hover:bg-white/5'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
};
