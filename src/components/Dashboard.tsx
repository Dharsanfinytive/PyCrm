import React, { useState } from 'react';
import { useCRMStore } from '../store/crmStore';
import type { Candidate } from '../store/crmStore';
import { Users, UserPlus, CheckCircle, IndianRupee, Search, Mail, Send, Activity, ShieldAlert } from 'lucide-react';
import { StudentDetailView } from './StudentDetailView';

export const Dashboard: React.FC = () => {
  const {
    candidates,
    payments,
    auditLogs,
    currentUser,
    addCandidate
  } = useCRMStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [courseFilter, setCourseFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [formPendingOnly, setFormPendingOnly] = useState(false);
  const [bgvClearedOnly, setBgvClearedOnly] = useState(false);
  const [hasDuesOnly, setHasDuesOnly] = useState(false);
  const [workflowEmail, setWorkflowEmail] = useState('');
  const [workflowType, setWorkflowType] = useState<'NEW_REG' | 'DP_REG' | 'BGV' | 'DP_BGV' | 'CONTACT'>('NEW_REG');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const getVisibleCandidates = () => {
    let list = candidates;
    if (currentUser.role === 'TEAM_LEAD' && currentUser.team_id) {
      list = candidates.filter(c => c.team_id === currentUser.team_id);
    }
    return list;
  };

  const visibleCandidates = getVisibleCandidates();
  const totalCandidatesCount = visibleCandidates.length;
  const newJoineesCount = visibleCandidates.filter(c => c.candidate_type === 'TRAINING' && !c.date_of_birth).length;
  const placedCandidatesCount = visibleCandidates.filter(c => c.placement_status === 'APPROVED' || c.placement_status === 'PENDING_APPROVAL').length;
  const visibleCandidateIds = new Set(visibleCandidates.map(c => c.id));
  const revenueReceived = payments.filter(p => visibleCandidateIds.has(p.candidate_id)).reduce((sum, p) => sum + p.amount, 0);
  const pendingDues = visibleCandidates.reduce((sum, c) => sum + c.pending_amount, 0);

  const branches = ['ALL', ...Array.from(new Set(visibleCandidates.map(c => c.branch)))];
  const courses = ['ALL', ...Array.from(new Set(visibleCandidates.map(c => c.course)))];

  const filteredCandidates = visibleCandidates.filter(c => {
    const matchesSearch =
      c.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.candidate_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      (c.batch && c.batch.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesBranch = branchFilter === 'ALL' || c.branch === branchFilter;
    const matchesCourse = courseFilter === 'ALL' || c.course === courseFilter;

    let matchesStatus = true;
    if (statusFilter !== 'ALL') {
      if (statusFilter === 'PLACED') {
        matchesStatus = c.placement_status === 'APPROVED';
      } else if (statusFilter === 'PENDING_APPROVAL') {
        matchesStatus = c.placement_status === 'PENDING_APPROVAL';
      } else if (statusFilter === 'NOT_PLACED') {
        matchesStatus = c.placement_status === 'NOT_PLACED';
      }
    }

    const matchesFormPending = !formPendingOnly || !c.date_of_birth;
    const matchesBgvCleared = !bgvClearedOnly || !!c.date_of_birth;
    const matchesHasDues = !hasDuesOnly || c.pending_amount > 0;

    return matchesSearch && matchesBranch && matchesCourse && matchesStatus && matchesFormPending && matchesBgvCleared && matchesHasDues;
  });

  const handleDispatchWorkflow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workflowEmail) return;

    alert(`Branded email workflow dispatched successfully to ${workflowEmail}`);

    addCandidate({
      full_name: workflowEmail.split('@')[0],
      email: workflowEmail,
      phone: '',
      course: 'Pending Registration',
      branch: 'Online',
      batch: 'Pending Batch',
      candidate_type: workflowType.includes('DP') ? 'DIRECT_PLACEMENT' : 'TRAINING',
      placement_status: 'NOT_PLACED'
    });

    setWorkflowEmail('');
  };

  const handleOpenDetailModal = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsDetailModalOpen(true);
  };

  if (isDetailModalOpen && selectedCandidate) {
    return (
      <StudentDetailView
        candidate={selectedCandidate}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedCandidate(null);
        }}
        breadcrumbSource="Dashboard"
      />
    );
  }

  return (
    <div className="bg-[var(--color-bg-primary)] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1480px] space-y-6 fade-in">
        <section className="silver-card rounded-[28px] p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-full border border-[var(--color-border-primary)] bg-[var(--color-bg-hover)] px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--color-accent-navy)]">
                  Workspace
                </span>
                <span className="inline-flex h-2 w-2 rounded-full bg-[var(--color-accent-green)]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Live Data</span>
              </div>

              <h1 className="text-3xl font-black tracking-[-0.06em] text-[var(--color-text-primary)] md:text-4xl">
                Command Center
                <span className="ml-2 bg-[linear-gradient(135deg,var(--color-accent-navy),var(--color-accent-orange),var(--color-accent-yellow))] bg-clip-text text-transparent">
                  for candidates
                </span>
              </h1>

              <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[var(--color-text-secondary)]">
                Manage registrations, placements, background verification, payments, and candidate workflows from one operating view.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-2xl border border-[var(--color-border-primary)] bg-[var(--color-bg-hover)] px-4 py-3 shadow-sm">
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[var(--color-text-muted)]">View</p>
                <p className="mt-1 text-xs font-black text-[var(--color-text-primary)]">
                  {currentUser.role === 'TEAM_LEAD' ? 'Team Lead View' : 'Admin View'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setWorkflowEmail('');
                  setWorkflowType('NEW_REG');
                  document.getElementById('dispatch-workflow')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#56391c,#9c6c35,#d69a48)] px-5 py-3 text-xs font-black uppercase tracking-[0.12em] text-white shadow-[0_18px_32px_rgba(120,79,32,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_36px_rgba(120,79,32,0.3)]"
              >
                <UserPlus className="h-4 w-4" />
                Start New Workflow
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <div className="silver-card rounded-[22px] p-5 transition-all duration-200 hover:-translate-y-1 hover:border-[var(--color-accent-orange)]">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-bg-hover)] text-[var(--color-accent-navy)]">
                <Users className="h-5 w-5" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Database</span>
            </div>
            <p className="mt-5 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Total candidates</p>
            <p className="mt-2 text-3xl font-black tracking-[-0.05em] text-[var(--color-text-primary)]">{totalCandidatesCount}</p>
          </div>

          <div className="silver-card rounded-[22px] p-5 transition-all duration-200 hover:-translate-y-1 hover:border-[var(--color-accent-orange)]">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-bg-hover)] text-[var(--color-accent-orange)]">
                <UserPlus className="h-5 w-5" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-[0.18em] text-[var(--color-text-muted)]">New</span>
            </div>
            <p className="mt-5 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--color-text-muted)]">New joinees</p>
            <p className="mt-2 text-3xl font-black tracking-[-0.05em] text-[var(--color-accent-orange)]">{newJoineesCount}</p>
          </div>

          <div className="silver-card rounded-[22px] p-5 transition-all duration-200 hover:-translate-y-1 hover:border-[var(--color-accent-orange)]">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-bg-hover)] text-[var(--color-accent-green)]">
                <CheckCircle className="h-5 w-5" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Success</span>
            </div>
            <p className="mt-5 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Placed candidates</p>
            <p className="mt-2 text-3xl font-black tracking-[-0.05em] text-[var(--color-accent-green)]">{placedCandidatesCount}</p>
          </div>

          <div className="silver-card rounded-[22px] p-5 transition-all duration-200 hover:-translate-y-1 hover:border-[var(--color-accent-orange)]">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-bg-hover)] text-[var(--color-accent-navy)]">
                <IndianRupee className="h-5 w-5" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-[0.18em] text-[var(--color-accent-green)]">Collected</span>
            </div>
            <p className="mt-5 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Revenue received</p>
            <p className="mt-2 text-2xl font-black tracking-[-0.04em] text-[var(--color-accent-navy)]">₹{revenueReceived.toLocaleString()}</p>
          </div>

          <div className="silver-card rounded-[22px] p-5 transition-all duration-200 hover:-translate-y-1 hover:border-[var(--color-accent-orange)]">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-bg-hover)] text-[var(--color-accent-orange)]">
                <IndianRupee className="h-5 w-5" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-[0.18em] text-[var(--color-accent-orange)]">Attention</span>
            </div>
            <p className="mt-5 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Pending dues</p>
            <p className="mt-2 text-2xl font-black tracking-[-0.04em] text-[var(--color-accent-orange)]">₹{pendingDues.toLocaleString()}</p>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_380px]">
          <div className="space-y-6">
            <div className="silver-gradient-panel rounded-[26px] p-5 transition-all duration-200 hover:-translate-y-1">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--color-accent-navy)]">Candidate Explorer</p>
                  <h2 className="mt-1 text-xl font-black text-[var(--color-text-primary)]">Find the right candidate</h2>
                </div>
                <span className="inline-flex rounded-full bg-[var(--color-bg-hover)] px-3 py-1.5 text-[10px] font-black text-[var(--color-text-secondary)]">
                  {filteredCandidates.length} matches
                </span>
              </div>

              <div className="grid gap-3 xl:grid-cols-[minmax(260px,1fr)_auto]">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
                  <input
                    type="text"
                    placeholder="Search by name, code, batch, email or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-11 w-full rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] pl-11 pr-4 text-sm font-semibold text-[var(--color-text-primary)] outline-none transition placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent-navy)] focus:ring-4 focus:ring-[rgba(28,44,88,0.12)]"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)} className="h-11 rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] px-3 text-xs font-black text-[var(--color-text-secondary)] outline-none focus:border-[var(--color-accent-navy)]">
                    <option value="ALL">All Branches</option>
                    {branches.filter(b => b !== 'ALL').map(b => (<option key={b} value={b}>{b}</option>))}
                  </select>

                  <select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)} className="h-11 rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] px-3 text-xs font-black text-[var(--color-text-secondary)] outline-none focus:border-[var(--color-accent-navy)]">
                    <option value="ALL">All Courses</option>
                    {courses.filter(c => c !== 'ALL').map(c => (<option key={c} value={c}>{c}</option>))}
                  </select>

                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-11 rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] px-3 text-xs font-black text-[var(--color-text-secondary)] outline-none focus:border-[var(--color-accent-navy)]">
                    <option value="ALL">All Statuses</option>
                    <option value="NOT_PLACED">Training (Unplaced)</option>
                    <option value="PENDING_APPROVAL">Pending Approval</option>
                    <option value="PLACED">Placed & Approved</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[var(--color-border-secondary)] pt-4">
                <span className="mr-1 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--color-text-muted)]">Quick filters</span>

                <button onClick={() => setFormPendingOnly(!formPendingOnly)} className={`rounded-full border px-3 py-1.5 text-[10px] font-black transition ${formPendingOnly ? 'border-[var(--color-accent-navy)] bg-[var(--color-accent-navy)] text-white shadow-md shadow-[rgba(28,44,88,0.18)]' : 'border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent-navy)] hover:text-[var(--color-accent-navy)]'}`}>
                  BGV Pending
                </button>

                <button onClick={() => setBgvClearedOnly(!bgvClearedOnly)} className={`rounded-full border px-3 py-1.5 text-[10px] font-black transition ${bgvClearedOnly ? 'border-[var(--color-accent-green)] bg-[var(--color-accent-green)] text-white shadow-md shadow-[rgba(18,135,106,0.18)]' : 'border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent-green)] hover:text-[var(--color-accent-green)]'}`}>
                  BGV Completed
                </button>

                <button onClick={() => setHasDuesOnly(!hasDuesOnly)} className={`rounded-full border px-3 py-1.5 text-[10px] font-black transition ${hasDuesOnly ? 'border-[var(--color-accent-orange)] bg-[var(--color-accent-orange)] text-white shadow-md shadow-[rgba(200,146,44,0.18)]' : 'border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent-orange)] hover:text-[var(--color-accent-orange)]'}`}>
                  Outstanding Dues
                </button>
              </div>
            </div>

            <div className="silver-gradient-panel rounded-[26px] p-5 transition-all duration-200 hover:-translate-y-1">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.18em] text-indigo-500">Candidate Workspace</p>
                  <h2 className="mt-1 text-xl font-black text-slate-800">Students</h2>
                </div>
                <span className="text-xs font-black text-slate-400">{filteredCandidates.length} profiles</span>
              </div>

              {filteredCandidates.length === 0 ? (
                <div className="rounded-[22px] border border-dashed border-slate-300 bg-slate-50/80 p-12 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                    <ShieldAlert className="h-7 w-7" />
                  </div>
                  <h4 className="mt-4 text-lg font-black text-slate-800">No candidates found</h4>
                  <p className="mx-auto mt-1 max-w-sm text-xs font-medium leading-5 text-slate-500">
                    No profiles match the current search and filter set. Try clearing one or more filters.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredCandidates.map(candidate => (
                    <div
                      key={candidate.id}
                      onClick={() => handleOpenDetailModal(candidate)}
                      className="silver-card group cursor-pointer rounded-[22px] p-4 transition duration-200 hover:-translate-y-1 hover:border-[var(--color-accent-orange)] hover:shadow-[0_20px_32px_rgba(28,44,88,0.12)]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="rounded-lg bg-white/70 px-2 py-1 text-[8px] font-black uppercase tracking-[0.2em] text-[var(--color-text-secondary)] ring-1 ring-white/70">
                          {candidate.candidate_code}
                        </span>

                        <span className={`rounded-full border px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.18em] ${candidate.placement_status === 'APPROVED' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : candidate.placement_status === 'PENDING_APPROVAL' ? 'border-amber-200 bg-amber-50 text-amber-700' : candidate.placement_status === 'REJECTED' ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
                          {candidate.placement_status.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="mt-5 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#56391c,#9c6c35,#d69a48)] text-sm font-black text-white shadow-[0_12px_16px_rgba(120,79,32,0.22)]">
                          {candidate.full_name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-black text-[var(--color-text-primary)]">{candidate.full_name}</h3>
                          <p className="mt-1 truncate text-[10px] font-semibold text-[var(--color-text-secondary)]">{candidate.course || 'Course not assigned'}</p>
                        </div>
                      </div>

                      <div className="mt-5 rounded-xl border border-white/60 bg-white/40 p-3">
                        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Course</p>
                        <p className="mt-1 truncate text-[10px] font-black text-[var(--color-text-primary)]">{candidate.course || 'Course not assigned'}</p>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-white/60 pt-3">
                        <span className="text-[9px] font-black uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Open profile</span>
                        <span className="text-sm font-black text-[var(--color-accent-navy)] transition group-hover:translate-x-1">→</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-6">
            <div id="dispatch-workflow" className="silver-gradient-panel rounded-[26px] p-5 transition-all duration-200 hover:-translate-y-1">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <Send className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.18em] text-indigo-500">Workflow Center</p>
                  <h2 className="mt-1 text-lg font-black text-slate-800">Dispatch a new workflow</h2>
                </div>
              </div>

              <form onSubmit={handleDispatchWorkflow} className="mt-5 space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="Candidate email address..."
                    value={workflowEmail}
                    onChange={(e) => setWorkflowEmail(e.target.value)}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => setWorkflowType('NEW_REG')} className={`rounded-xl border px-3 py-2 text-[9px] font-black uppercase tracking-[0.18em] ${workflowType === 'NEW_REG' ? 'border-[#9c6c35] bg-[linear-gradient(135deg,#56391c,#9c6c35,#d69a48)] text-white' : 'border-slate-200 bg-white text-slate-500'}`}>
                    New Reg
                  </button>
                  <button type="button" onClick={() => setWorkflowType('DP_REG')} className={`rounded-xl border px-3 py-2 text-[9px] font-black uppercase tracking-[0.18em] ${workflowType === 'DP_REG' ? 'border-[#9c6c35] bg-[linear-gradient(135deg,#56391c,#9c6c35,#d69a48)] text-white' : 'border-slate-200 bg-white text-slate-500'}`}>
                    DP Reg
                  </button>
                  <button type="button" onClick={() => setWorkflowType('BGV')} className={`rounded-xl border px-3 py-2 text-[9px] font-black uppercase tracking-[0.18em] ${workflowType === 'BGV' ? 'border-[#9c6c35] bg-[linear-gradient(135deg,#56391c,#9c6c35,#d69a48)] text-white' : 'border-slate-200 bg-white text-slate-500'}`}>
                    BGV
                  </button>
                  <button type="button" onClick={() => setWorkflowType('DP_BGV')} className={`rounded-xl border px-3 py-2 text-[9px] font-black uppercase tracking-[0.18em] ${workflowType === 'DP_BGV' ? 'border-[#9c6c35] bg-[linear-gradient(135deg,#56391c,#9c6c35,#d69a48)] text-white' : 'border-slate-200 bg-white text-slate-500'}`}>
                    DP BGV
                  </button>
                  <button type="button" onClick={() => setWorkflowType('CONTACT')} className={`rounded-xl border px-3 py-2 text-[9px] font-black uppercase tracking-[0.18em] ${workflowType === 'CONTACT' ? 'border-[#9c6c35] bg-[linear-gradient(135deg,#56391c,#9c6c35,#d69a48)] text-white' : 'border-slate-200 bg-white text-slate-500'}`}>
                    Contact
                  </button>
                </div>

                <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#56391c,#9c6c35,#d69a48)] px-5 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-white shadow-[0_14px_24px_rgba(120,79,32,0.24)] transition hover:-translate-y-0.5">
                  <Send className="h-4 w-4" />
                  Send Workflow
                </button>
              </form>
            </div>

            <div className="silver-gradient-panel rounded-[26px] p-5 transition-all duration-200 hover:-translate-y-1">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.18em] text-amber-500">Live Activity</p>
                  <h2 className="mt-1 text-lg font-black text-slate-800">System Change Log</h2>
                </div>
              </div>

              <div className="mt-5 space-y-2">
                {auditLogs.slice(0, 4).map(log => (
                  <div key={log.id} className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <div className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                      <Activity className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold leading-4 text-slate-700">{log.description}</p>
                      <p className="mt-1 text-[9px] font-semibold text-slate-400">By {log.user_name} · {new Date(log.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                ))}

                {auditLogs.length === 0 && (
                  <div className="rounded-xl bg-slate-50 p-6 text-center text-xs font-semibold text-slate-400">
                    No system changes recorded yet.
                  </div>
                )}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
};
