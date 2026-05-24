import React, { useState } from 'react';
import { LayoutDashboard, Wallet, User, LogOut, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  activeView: string;
  setActiveView: (view: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setActiveView }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  if (!user) return <>{children}</>;

  const SidebarContent = () => (
    <div className="flex flex-col h-full py-8 px-4">
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center glow-blue">
          <span className="font-bold text-white text-xl">X</span>
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight">XRP <span className="text-accent">MINER</span></h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Network</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveView(item.id);
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
              activeView === item.id
                ? 'bg-accent/10 text-accent border border-accent/20'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
            {activeView === item.id && (
              <motion.div
                layoutId="active-nav"
                className="ml-auto w-1.5 h-1.5 rounded-full bg-accent"
              />
            )}
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-900">
        <div className="px-4 py-3 mb-4 bg-slate-900/50 rounded-2xl border border-slate-800">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Active User</p>
          <p className="text-xs font-bold truncate text-slate-300">{user.email}</p>
        </div>
        <button 
          onClick={() => logout()}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300"
        >
          <LogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background text-slate-100 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-72 border-r border-slate-900 bg-slate-950/50 backdrop-blur-xl">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <span className="font-bold text-white text-sm">X</span>
          </div>
          <span className="font-bold text-sm tracking-tight">XRP MINER</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(true)} className="text-slate-400 p-2">
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-80 bg-slate-950 z-[70] md:hidden shadow-2xl"
            >
              <div className="absolute top-4 right-4">
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-500 p-2">
                  <X size={24} />
                </button>
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 relative md:pl-0 pt-16 md:pt-0 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-6 md:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Layout;
