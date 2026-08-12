import React, { useState } from 'react';
import { useCRMStore } from '../store/crmStore';
import {
  LayoutDashboard,
  UserCheck,
  BarChart3,
  DatabaseBackup,
  History,
  X,
  Sun,
  Moon,
  LogOut,
  ChevronDown,
  BriefcaseBusiness,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleAuditLogs: () => void;
}

const NAV_ITEMS = [
  { key: 'DASHBOARD', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'DIRECT_PLACEMENT', label: 'Direct Placement', icon: UserCheck },
  { key: 'REPORTS', label: 'Reports', icon: BarChart3 },
  { key: 'BACKUP', label: 'Backup', icon: DatabaseBackup },
] as const;

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onToggleAuditLogs }) => {
  const { activeTab, setActiveTab, currentTheme, setTheme, currentUser, setUserRole } = useCRMStore();
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const handleNavClick = (tab: typeof NAV_ITEMS[number]['key']) => {
    setActiveTab(tab);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const handleLogout = () => {
    const confirmed = window.confirm('Log out and return to the default demo identity?');
    if (confirmed) {
      setUserRole('SUPER_ADMIN', null);
      setActiveTab('DASHBOARD');
      setShowAccountMenu(false);
    }
  };

  return (
    <>
      <aside className="hidden h-full flex-col border-r border-slate-200/80 bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(30,41,59,0.96),rgba(15,23,42,0.98))] text-slate-100 lg:flex">
        <div className="border-b border-white/10 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 via-amber-400 to-indigo-500 shadow-[0_12px_24px_rgba(251,146,60,0.35)]">
              <span className="font-mono text-xs font-black tracking-[0.2em] text-slate-950">PY</span>
            </div>
            <div>
              <p className="text-xl font-black tracking-[-0.05em] text-white">PyCRM</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                Placement Network
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-2 px-3 py-4">
          <div className="mb-3 px-3 pt-1">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Workspace</p>
          </div>

          {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
            const isActive = activeTab === key;

            return (
              <button
                key={key}
                onClick={() => handleNavClick(key)}
                className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-400 to-amber-500 text-slate-950 shadow-[0_12px_24px_rgba(251,146,60,0.25)]'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${isActive ? 'bg-slate-950/10 text-slate-950' : 'bg-white/5 text-slate-300'}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span>{label}</span>
              </button>
            );
          })}

          <div className="my-5 border-t border-white/10" />

          <div className="space-y-2 px-3">
            <button
              onClick={onToggleAuditLogs}
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold text-slate-300 transition-all hover:bg-white/5 hover:text-white"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5">
                <History className="h-4 w-4" />
              </div>
              Audit Logs
            </button>

            <button
              onClick={() => setTheme(currentTheme === 'sunny' ? 'command' : 'sunny')}
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold text-slate-300 transition-all hover:bg-white/5 hover:text-white"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5">
                {currentTheme === 'sunny' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </div>
              {currentTheme === 'sunny' ? 'Dark Theme' : 'Light Theme'}
            </button>
          </div>
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="relative">
            <button
              onClick={() => setShowAccountMenu(v => !v)}
              className="flex w-full items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-2.5 text-left transition-all hover:bg-white/7"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-black text-white">
                  {getInitials(currentUser.full_name)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-white">{currentUser.full_name}</p>
                  <p className="truncate text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    {currentUser.role.replace('_', ' ')}
                  </p>
                </div>
              </div>
              <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${showAccountMenu ? 'rotate-180' : ''}`} />
            </button>

            {showAccountMenu && (
              <div className="absolute bottom-[calc(100%+12px)] left-0 right-0 rounded-2xl border border-slate-200 bg-white p-2.5 text-slate-700 shadow-[0_20px_30px_rgba(15,23,42,0.18)]">
                <div className="rounded-xl bg-slate-100 px-3 py-2.5">
                  <p className="truncate text-sm font-black text-slate-900">{currentUser.full_name}</p>
                  <p className="truncate text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                    {currentUser.role.replace('_', ' ')}
                  </p>
                </div>
                <div className="my-2 border-t border-slate-200" />
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-bold text-slate-700 transition-all hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>

          <div className="mt-3 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            <BriefcaseBusiness className="h-4 w-4 text-orange-300" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">CRM Hub</span>
          </div>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-950/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200/80 bg-[linear-gradient(180deg,rgba(15,23,42,0.97),rgba(30,41,59,0.96),rgba(15,23,42,0.99))] text-white transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 via-amber-400 to-indigo-500 font-mono text-xs font-black text-slate-950">
              PY
            </div>
            <div>
              <p className="text-lg font-black text-white">PyCRM</p>
              <p className="text-[9px] uppercase tracking-[0.2em] text-slate-400">CRM Hub</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-slate-300 hover:bg-white/5 hover:text-white" title="Hide sidebar">
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-2 px-3 py-4">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => handleNavClick(key)}
                className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-400 to-amber-500 text-slate-950'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${isActive ? 'bg-slate-950/10 text-slate-950' : 'bg-white/5 text-slate-300'}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span>{label}</span>
              </button>
            );
          })}

          <div className="my-3 border-t border-white/10" />

          <button
            onClick={onToggleAuditLogs}
            className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold text-slate-300 transition-all hover:bg-white/5 hover:text-white"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5">
              <History className="h-4 w-4" />
            </div>
            Audit Logs
          </button>

          <button
            onClick={() => setTheme(currentTheme === 'sunny' ? 'command' : 'sunny')}
            className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold text-slate-300 transition-all hover:bg-white/5 hover:text-white"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5">
              {currentTheme === 'sunny' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </div>
            {currentTheme === 'sunny' ? 'Dark Theme' : 'Light Theme'}
          </button>
        </nav>

        <div className="border-t border-white/10 p-3">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-black text-white">
              {getInitials(currentUser.full_name)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-white">{currentUser.full_name}</p>
              <p className="truncate text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                {currentUser.role.replace('_', ' ')}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="mt-3 flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold text-slate-300 transition-all hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};
