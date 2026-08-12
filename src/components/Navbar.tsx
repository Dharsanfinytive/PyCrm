import React, { useState } from 'react';
import { useCRMStore } from '../store/crmStore';
import {
  Bell,
  History,
  Check,
  Trash,
  Sun,
  Moon,
  Menu,
  X,
  LayoutDashboard,
  UserCheck,
  BarChart3,
  DatabaseBackup,
} from 'lucide-react';

interface NavbarProps {
  onToggleAuditLogs: () => void;
}

const NAV_ITEMS = [
  { key: 'DASHBOARD', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'DIRECT_PLACEMENT', label: 'Direct Placement', icon: UserCheck },
  { key: 'REPORTS', label: 'Reports', icon: BarChart3 },
  { key: 'BACKUP', label: 'Backup', icon: DatabaseBackup },
] as const;

export const Navbar: React.FC<NavbarProps> = ({ onToggleAuditLogs }) => {
  const {
    activeTab,
    currentUser,
    currentTheme,
    setTheme,
    notifications,
    markNotificationAsRead,
    clearNotifications,
    isSyncing,
    setActiveTab,
  } = useCRMStore();

  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const UniqLogoBadge = ({ compact = false }: { compact?: boolean }) => (
    <div className={`${compact ? 'h-10 w-28' : 'h-12 w-32 sm:h-14 sm:w-36'} flex items-center justify-center overflow-hidden rounded-xl bg-white p-1 shadow-sm`}>
      <svg viewBox="0 0 220 120" className="block h-full w-full" preserveAspectRatio="xMidYMid meet" aria-label="UNIQ logo" role="img">
        <g transform="translate(10 2)">
          <text x="0" y="90" fill="#111827" fontSize="86" fontWeight="900" fontFamily="Arial, Helvetica, sans-serif" letterSpacing="-8">
            u
          </text>
          <circle cx="70" cy="30" r="9" fill="#1d4ed8" />
          <text x="86" y="90" fill="#111827" fontSize="86" fontWeight="900" fontFamily="Arial, Helvetica, sans-serif" letterSpacing="-8">
            n
          </text>
          <circle cx="150" cy="30" r="9" fill="#ef4444" />
          <text x="166" y="90" fill="#111827" fontSize="86" fontWeight="900" fontFamily="Arial, Helvetica, sans-serif" letterSpacing="-8">
            i
          </text>
          <circle cx="197" cy="30" r="9" fill="#10b981" />
          <text x="212" y="90" fill="#111827" fontSize="86" fontWeight="900" fontFamily="Arial, Helvetica, sans-serif" letterSpacing="-8">
            q
          </text>
        </g>
      </svg>
    </div>
  );

  return (
    <>
      <header className="border-b border-slate-200/80 bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(30,41,59,0.96),rgba(15,23,42,1))] text-white shadow-[0_18px_40px_rgba(15,23,42,0.18)]">
        <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 transition-all hover:bg-white/10 hover:text-white lg:hidden"
              title="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3">
              <UniqLogoBadge />
            </div>
          </div>

          <nav className="hidden items-center gap-2 lg:flex">
            {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-400 to-amber-500 text-slate-950 shadow-[0_10px_20px_rgba(251,146,60,0.28)]'
                      : 'bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setTheme(currentTheme === 'sunny' ? 'command' : 'sunny')}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 transition-all hover:bg-white/10 hover:text-white"
              title={currentTheme === 'sunny' ? 'Switch to dark theme' : 'Switch to light theme'}
            >
              {currentTheme === 'sunny' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>

            <button
              onClick={onToggleAuditLogs}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 transition-all hover:bg-white/10 hover:text-white"
              title="Audit Logs"
            >
              <History className="h-4 w-4" />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 transition-all hover:bg-white/10 hover:text-white"
                title="Notifications"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-amber-500 text-[8px] font-black text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 z-50 mt-3 w-80 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-[0_20px_45px_rgba(15,23,42,0.18)]">
                  <div className="mb-2 flex items-center justify-between border-b border-slate-200 pb-2">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Notifications</h4>
                    {notifications.length > 0 && (
                      <button
                        onClick={clearNotifications}
                        className="flex items-center gap-1 text-[10px] font-bold text-red-500 hover:underline"
                      >
                        <Trash className="h-3 w-3" /> Clear all
                      </button>
                    )}
                  </div>

                  <div className="max-h-60 space-y-2 overflow-y-auto pr-1">
                    {notifications.length === 0 ? (
                      <div className="py-4 text-center text-xs font-semibold text-slate-500">No notifications.</div>
                    ) : (
                      notifications.map(notif => (
                        <div
                          key={notif.id}
                          className={`relative rounded-xl border p-2.5 text-xs ${
                            notif.is_read
                              ? 'border-slate-200 bg-slate-50 text-slate-500'
                              : notif.type === 'error'
                                ? 'border-red-200 bg-red-50 text-red-700'
                                : notif.type === 'warning'
                                  ? 'border-amber-200 bg-amber-50 text-amber-700'
                                  : 'border-blue-200 bg-blue-50 text-blue-700'
                          }`}
                        >
                          <div className="pr-5 text-sm font-black">{notif.title}</div>
                          <div className="mt-1 text-[11px] font-medium leading-relaxed">{notif.message}</div>
                          <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.15em] text-slate-500">
                            {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>

                          {!notif.is_read && (
                            <button
                              onClick={() => markNotificationAsRead(notif.id)}
                              className="absolute right-2 top-2 rounded-md p-1 text-slate-500 hover:bg-white hover:text-slate-700"
                              title="Mark as read"
                            >
                              <Check className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-2 py-1.5">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-xs font-black text-white"
                title={`${currentUser.full_name} (${currentUser.role})`}
              >
                {getInitials(currentUser.full_name)}
              </div>
              <div className="hidden min-w-0 text-left sm:block">
                <p className="truncate text-sm font-black text-white">{currentUser.full_name}</p>
                <p className="truncate text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">{currentUser.role.replace('_', ' ')}</p>
              </div>
            </div>
          </div>
        </div>

        {isSyncing && (
          <div className="border-t border-white/10 bg-white/5 px-4 py-2 text-center text-[10px] font-black uppercase tracking-[0.2em] text-amber-300 sm:px-6">
            Syncing...
          </div>
        )}
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/55 backdrop-blur-sm lg:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <aside
            className="h-full w-[280px] bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(30,41,59,0.96),rgba(15,23,42,1))] p-4 text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UniqLogoBadge compact />
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
                title="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="space-y-2">
              {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
                const isActive = activeTab === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setActiveTab(key);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-orange-400 to-amber-500 text-slate-950'
                        : 'bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${isActive ? 'bg-slate-950/10 text-slate-950' : 'bg-white/5 text-slate-200'}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    {label}
                  </button>
                );
              })}
            </nav>

            <div className="mt-6 border-t border-white/10 pt-4">
              <button
                onClick={() => {
                  setTheme(currentTheme === 'sunny' ? 'command' : 'sunny');
                  setIsMobileMenuOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-2xl bg-white/5 px-3 py-3 text-left text-sm font-bold text-slate-200 hover:bg-white/10"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5">
                  {currentTheme === 'sunny' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                </div>
                {currentTheme === 'sunny' ? 'Dark Theme' : 'Light Theme'}
              </button>

              <button
                onClick={() => {
                  onToggleAuditLogs();
                  setIsMobileMenuOpen(false);
                }}
                className="mt-2 flex w-full items-center gap-3 rounded-2xl bg-white/5 px-3 py-3 text-left text-sm font-bold text-slate-200 hover:bg-white/10"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5">
                  <History className="h-4 w-4" />
                </div>
                Audit Logs
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};
