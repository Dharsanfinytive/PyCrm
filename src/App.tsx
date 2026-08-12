import React, { useState, useEffect } from 'react';
import { ShieldCheck, GraduationCap } from 'lucide-react';
import { useCRMStore } from './store/crmStore';
import { Navbar } from './components/Navbar';
import { DevControlPanel } from './components/DevControlPanel';
import { AuditLogsDrawer } from './components/AuditLogsDrawer';
import { Dashboard } from './components/Dashboard';
import { DirectPlacement } from './components/DirectPlacement';
import { Reports } from './components/Reports';
import { BackupCenter } from './components/BackupCenter';
import { PublicForms } from './components/PublicForms';

const App: React.FC = () => {
  const { activeTab, currentTheme } = useCRMStore();
  const [isAuditLogsOpen, setIsAuditLogsOpen] = useState(false);
  const [presentationMode, setPresentationMode] = useState<'ADMIN' | 'STUDENT'>('ADMIN');

  useEffect(() => {
    const htmlElement = document.documentElement;
    if (currentTheme === 'command') {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }, [currentTheme]);

  const renderActiveView = () => {
    if (presentationMode === 'STUDENT') {
      return <PublicForms />;
    }

    switch (activeTab) {
      case 'DASHBOARD':
        return <Dashboard />;
      case 'DIRECT_PLACEMENT':
        return <DirectPlacement />;
      case 'REPORTS':
        return <Reports />;
      case 'BACKUP':
        return <BackupCenter />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] transition-colors duration-300">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(255,255,255,0.45),transparent_14%),radial-gradient(circle_at_82%_0%,rgba(200,146,44,0.08),transparent_18%)]" />

      <div className="relative z-10 mx-auto max-w-[1800px] px-3 py-4 sm:px-5 lg:px-6">
        <div className="mb-3 overflow-hidden rounded-[18px] border border-white/10 bg-[linear-gradient(135deg,rgba(3,10,20,0.98),rgba(5,15,27,0.98),rgba(8,18,32,0.99))] px-3 py-2.5 shadow-[0_18px_30px_rgba(2,6,23,0.38)]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2 text-white">
              <div className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-white/60 bg-transparent text-[8px] text-white">
                ◉
              </div>
              <span className="truncate text-[11px] font-semibold text-slate-100">
                Presentation Mode: <span className="font-medium text-slate-300">Toggle interfaces below to simulate full CRM lifecycles.</span>
              </span>
            </div>

            <div className="flex shrink-0 items-center gap-1.5 rounded-xl border border-white/10 bg-[linear-gradient(135deg,rgba(62,74,166,0.8),rgba(92,101,220,0.72))] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
              <button
                type="button"
                onClick={() => setPresentationMode('ADMIN')}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[9px] font-black uppercase tracking-[0.1em] transition-all ${
                  presentationMode === 'ADMIN'
                    ? 'bg-[linear-gradient(135deg,rgba(255,255,255,0.16),rgba(255,255,255,0.08))] text-white shadow-inner'
                    : 'text-slate-200/90 hover:text-white'
                }`}
              >
                <ShieldCheck className="h-3 w-3" />
                CRM ADMIN INTERFACE
              </button>

              <button
                type="button"
                onClick={() => setPresentationMode('STUDENT')}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[9px] font-black uppercase tracking-[0.1em] transition-all ${
                  presentationMode === 'STUDENT'
                    ? 'bg-[linear-gradient(135deg,rgba(255,255,255,0.16),rgba(255,255,255,0.08))] text-white shadow-inner'
                    : 'text-slate-200/90 hover:text-white'
                }`}
              >
                <GraduationCap className="h-3 w-3" />
                PUBLIC PORTALS (STUDENT)
              </button>
            </div>
          </div>
        </div>

        <div className="silver-gradient-panel overflow-hidden rounded-[32px] shadow-[0_45px_120px_rgba(15,23,42,0.12)]">
          <Navbar
            onToggleAuditLogs={() => setIsAuditLogsOpen(!isAuditLogsOpen)}
          />

          <main className="p-3 sm:p-4 lg:p-6">
            <div className="silver-card rounded-[28px] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
              {renderActiveView()}
            </div>
          </main>
        </div>
      </div>

      <AuditLogsDrawer isOpen={isAuditLogsOpen} onClose={() => setIsAuditLogsOpen(false)} />
      <DevControlPanel />
    </div>
  );
};

export default App;
