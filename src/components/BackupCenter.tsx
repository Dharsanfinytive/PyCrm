import React, { useState } from 'react';
import { useCRMStore } from '../store/crmStore';
import { Database, Calendar, Users, ShieldCheck, IndianRupee, History, Download, Check } from 'lucide-react';

export const BackupCenter: React.FC = () => {
  const { candidates, payments, auditLogs } = useCRMStore();
  const [selectedMonth, setSelectedMonth] = useState('August, 2026');
  const [activeExport, setActiveExport] = useState<string | null>(null);

  const months = ['August, 2026', 'July, 2026', 'June, 2026', 'May, 2026'];

  // Universal CSV Downloader
  const downloadCSV = (headers: string[], rows: string[][], filename: string) => {
    setActiveExport(filename);
    setTimeout(() => {
      const csvContent =
        'data:text/csv;charset=utf-8,' +
        [
          headers.join(','),
          ...rows.map(e => e.map(val => `"${String(val || '').replace(/"/g, '""')}"`).join(','))
        ].join('\n');
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `${filename}_${selectedMonth.replace(/\s+/g, '')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setActiveExport(null);
    }, 800); // Simulate brief compression/generating time
  };

  // ----------------------------------------------------
  // DATA EXPORTERS DEFINITIONS
  // ----------------------------------------------------

  // 1. Training Master Candidates
  const exportTrainingMaster = () => {
    const data = candidates.filter(c => c.candidate_type === 'TRAINING');
    const headers = ['Candidate ID', 'Code', 'Name', 'Phone', 'Email', 'Branch', 'Course', 'Batch', 'Placement Status', 'Registered At'];
    const rows = data.map(c => [
      c.id.toString(),
      c.candidate_code,
      c.full_name,
      c.phone,
      c.email,
      c.branch,
      c.course,
      c.batch,
      c.placement_status,
      c.created_at
    ]);
    downloadCSV(headers, rows, 'Training_Master_Candidates');
  };

  // 2. Training BGV
  const exportTrainingBGV = () => {
    const data = candidates.filter(c => c.candidate_type === 'TRAINING' && c.date_of_birth);
    const headers = ['Code', 'Name', 'Phone', 'DOB', 'Father Name', 'Alternate Phone', 'Address', 'Pincode', 'Verification Date'];
    const rows = data.map(c => [
      c.candidate_code,
      c.full_name,
      c.phone,
      c.date_of_birth || '',
      c.father_name || '',
      c.alternate_phone || '',
      c.address || '',
      c.pincode || '',
      c.updated_at
    ]);
    downloadCSV(headers, rows, 'Training_BGV_Records');
  };

  // 3. Direct Placement Candidates
  const exportDPMaster = () => {
    const data = candidates.filter(c => c.candidate_type === 'DIRECT_PLACEMENT');
    const headers = ['Code', 'Name', 'Phone', 'Email', 'Company', 'Designation', 'CTC', 'Experience', 'Status', 'Registered At'];
    const rows = data.map(c => [
      c.candidate_code,
      c.full_name,
      c.phone,
      c.email,
      c.placement_company || '',
      c.designation || '',
      c.annual_ctc ? c.annual_ctc.toString() : '0',
      c.experience_type || '',
      c.placement_status,
      c.created_at
    ]);
    downloadCSV(headers, rows, 'Direct_Placement_Candidates');
  };

  // 4. Direct Placement BGV
  const exportDPBGV = () => {
    const data = candidates.filter(c => c.candidate_type === 'DIRECT_PLACEMENT' && c.date_of_birth);
    const headers = ['Code', 'Name', 'Phone', 'DOB', 'Father Name', 'Alternate Phone', 'Address', 'Pincode', 'Company', 'Verification Date'];
    const rows = data.map(c => [
      c.candidate_code,
      c.full_name,
      c.phone,
      c.date_of_birth || '',
      c.father_name || '',
      c.alternate_phone || '',
      c.address || '',
      c.pincode || '',
      c.placement_company || '',
      c.updated_at
    ]);
    downloadCSV(headers, rows, 'Direct_Placement_BGV_Records');
  };

  // 5. Training Finances
  const exportTrainingFinances = () => {
    const headers = ['Date', 'Candidate Name', 'Code', 'Amount Paid', 'Mode', 'Ref ID', 'Collected By', 'Remarks'];
    const rows = payments
      .filter(p => {
        const c = candidates.find(cand => cand.id === p.candidate_id);
        return c?.candidate_type === 'TRAINING';
      })
      .map(p => {
        const c = candidates.find(cand => cand.id === p.candidate_id);
        return [p.payment_date, c?.full_name || 'N/A', c?.candidate_code || 'N/A', p.amount.toString(), p.payment_mode, p.transaction_ref || '', p.collected_by, p.remarks || ''];
      });
    downloadCSV(headers, rows, 'Training_Finances_Ledger');
  };

  // 6. Direct Placement Finances
  const exportDPFinances = () => {
    const headers = ['Date', 'Candidate Name', 'Code', 'Amount Paid', 'Mode', 'Ref ID', 'Collected By', 'Remarks'];
    const rows = payments
      .filter(p => {
        const c = candidates.find(cand => cand.id === p.candidate_id);
        return c?.candidate_type === 'DIRECT_PLACEMENT';
      })
      .map(p => {
        const c = candidates.find(cand => cand.id === p.candidate_id);
        return [p.payment_date, c?.full_name || 'N/A', c?.candidate_code || 'N/A', p.amount.toString(), p.payment_mode, p.transaction_ref || '', p.collected_by, p.remarks || ''];
      });
    downloadCSV(headers, rows, 'Direct_Placement_Finances_Ledger');
  };

  // 7. Training Audit Logs
  const exportTrainingLogs = () => {
    const headers = ['Timestamp', 'User', 'Action', 'Description', 'IP Address'];
    const rows = auditLogs
      .filter(log => {
        if (!log.candidate_id) return true;
        const c = candidates.find(cand => cand.id === log.candidate_id);
        return c?.candidate_type === 'TRAINING';
      })
      .map(l => [l.created_at, l.user_name, l.action, l.description, l.ip_address]);
    downloadCSV(headers, rows, 'Training_CRM_Audit_Logs');
  };

  // 8. Direct Placement Audit Logs
  const exportDPLogs = () => {
    const headers = ['Timestamp', 'User', 'Action', 'Description', 'IP Address'];
    const rows = auditLogs
      .filter(log => {
        if (!log.candidate_id) return false;
        const c = candidates.find(cand => cand.id === log.candidate_id);
        return c?.candidate_type === 'DIRECT_PLACEMENT';
      })
      .map(l => [l.created_at, l.user_name, l.action, l.description, l.ip_address]);
    downloadCSV(headers, rows, 'Direct_Placement_Audit_Logs');
  };

  // 9. Full CRM Sheets Backup
  const exportFullBackup = () => {
    const headers = ['Database Sheet', 'Record Name / Code', 'Primary Attribute', 'Second Attribute', 'Third Attribute', 'Last Updated'];
    
    const rows: string[][] = [];
    candidates.forEach(c => {
      rows.push(['CANDIDATES', c.candidate_code, c.full_name, c.candidate_type, `Status: ${c.placement_status}, Payable: ${c.amount_payable}`, c.updated_at]);
    });
    payments.forEach(p => {
      rows.push(['PAYMENTS', `PAY-${p.id}`, `Candidate ID: ${p.candidate_id}`, `Amount: ₹${p.amount}`, `Ref: ${p.transaction_ref}`, p.created_at]);
    });
    auditLogs.forEach(l => {
      rows.push(['AUDIT_LOGS', `LOG-${l.id}`, l.user_name, l.action, l.description, l.created_at]);
    });

    downloadCSV(headers, rows, 'Full_CRM_Sheets_Backup');
  };

  const backupCards = [
    {
      title: 'Training Master Candidates',
      desc: 'Export all Training CRM candidate profiles from Master_Candidates.',
      handler: exportTrainingMaster,
      icon: Users,
      id: 'Training_Master_Candidates'
    },
    {
      title: 'Training BGV',
      desc: 'Export all Training CRM background verification records.',
      handler: exportTrainingBGV,
      icon: ShieldCheck,
      id: 'Training_BGV_Records'
    },
    {
      title: 'Direct Placement Candidates',
      desc: 'Export all Direct Placement candidate profiles.',
      handler: exportDPMaster,
      icon: Users,
      id: 'Direct_Placement_Candidates'
    },
    {
      title: 'Direct Placement BGV',
      desc: 'Export all Direct Placement background verification records.',
      handler: exportDPBGV,
      icon: ShieldCheck,
      id: 'Direct_Placement_BGV_Records'
    },
    {
      title: 'Training Finances',
      desc: 'Export Training CRM payment records and financial ledger.',
      handler: exportTrainingFinances,
      icon: IndianRupee,
      id: 'Training_Finances_Ledger'
    },
    {
      title: 'Direct Placement Finances',
      desc: 'Export Direct Placement payment records and financial ledger.',
      handler: exportDPFinances,
      icon: IndianRupee,
      id: 'Direct_Placement_Finances_Ledger'
    },
    {
      title: 'Training Audit Logs',
      desc: 'Export Training CRM system audit history.',
      handler: exportTrainingLogs,
      icon: History,
      id: 'Training_CRM_Audit_Logs'
    },
    {
      title: 'Direct Placement Audit Logs',
      desc: 'Export Direct Placement system audit history.',
      handler: exportDPLogs,
      icon: History,
      id: 'Direct_Placement_Audit_Logs'
    }
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 fade-in text-slate-800 sm:px-6 lg:px-8">
      <div className="silver-gradient-panel rounded-[28px] p-5 md:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#56391c,#9c6c35,#d69a48)] text-white shadow-lg shadow-[#7a4d1d]/20">
              <Database className="h-6 w-6" />
            </div>
            <div>
              <span className="inline-flex rounded-full border border-[#d3a663]/40 bg-[linear-gradient(135deg,#f9efe1,#f1d9b3,#efc680)] px-3 py-1 text-[9px] font-black uppercase tracking-[0.22em] text-[#5c3c1f]">
                Backup & Export
              </span>
              <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-slate-900 md:text-4xl">
                Backup
                <span className="ml-2 bg-[linear-gradient(135deg,#56391c,#9c6c35,#d69a48)] bg-clip-text text-transparent">
                  Center
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-3 py-2.5 shadow-sm">
            <Calendar className="h-4 w-4 text-[#8b5a2b]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Select month</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="cursor-pointer border-none bg-transparent text-sm font-black text-slate-700 outline-none"
            >
              {months.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-[24px] border border-[#d3a663]/30 bg-[linear-gradient(135deg,#fffaf1,#f3e2c2,#f3d39c)] p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3 text-sm font-black text-[#5c3c1f]">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-[#9c6c35] animate-pulse" />
            <span>Selected Backup Period: <strong className="font-black uppercase text-slate-800">{selectedMonth}</strong></span>
          </div>
          <span className="rounded-full border border-[#d3a663]/40 bg-white/80 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-[#5c3c1f]">
            Active Partition
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {backupCards.map(card => {
          const Icon = card.icon;
          const isExportingThis = activeExport === card.id;
          
          return (
            <div
              key={card.title}
              className="silver-card flex min-h-[180px] flex-col justify-between rounded-[24px] p-5 transition duration-200 hover:-translate-y-1 hover:border-[#d3a663]/40 hover:shadow-[0_20px_45px_rgba(120,79,32,0.12)]"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#f9efe1,#f1d9b3,#efc680)] text-[#5c3c1f]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="text-base font-black text-slate-800">{card.title}</h4>
                </div>
                <p className="text-sm font-semibold leading-6 text-slate-500">{card.desc}</p>
              </div>

              <button
                onClick={card.handler}
                disabled={!!activeExport}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#d9b57a]/60 bg-[linear-gradient(135deg,rgba(255,255,255,0.9),rgba(245,230,200,0.9),rgba(229,185,108,0.7))] py-3 px-4 text-[11px] font-black uppercase tracking-[0.18em] text-[#5c3c1f] transition hover:border-[#c68d45] hover:brightness-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isExportingThis ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-600 animate-bounce" />
                    Generating CSV...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Export {card.title.split(' ').slice(-1)[0]}
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div className="silver-gradient-panel mx-auto max-w-2xl rounded-[28px] p-6 text-center shadow-[0_20px_44px_rgba(15,23,42,0.08)]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
          <Database className="h-7 w-7" />
        </div>
        <div className="mt-4 space-y-2">
          <h3 className="text-lg font-black uppercase tracking-[0.14em] text-slate-800">Full CRM Backup</h3>
          <p className="mx-auto max-w-md text-sm font-semibold leading-6 text-slate-500">
            Exports a consolidated, multidimensional spreadsheet containing all candidates, payment ledgers, and audit logs.
          </p>
        </div>

        <button
          onClick={exportFullBackup}
          disabled={!!activeExport}
          className="silver-button-primary mx-auto mt-5 inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-[11px] font-black uppercase tracking-[0.18em] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Download className="h-4 w-4" />
          Export Full CRM Backup
        </button>
      </div>

    </div>
  );
};
