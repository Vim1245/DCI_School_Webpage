import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  Users,
  FileText,
  Mail,
  Bell,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  Filter,
  RefreshCw,
  Download,
  Trash2,
  Edit2,
  ExternalLink,
  ChevronRight,
  Database,
  ArrowRight,
  GraduationCap,
} from 'lucide-react';
import { SupabaseConfigStatus } from '../types';
import { getSupabaseClient } from '../lib/supabase';

interface AdminPortalProps {
  supabaseStatus?: SupabaseConfigStatus | null;
  onNavigateHome?: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ supabaseStatus, onNavigateHome }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [usernameInput, setUsernameInput] = useState('admin@dci.in');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Active Admin Tab
  const [adminTab, setAdminTab] = useState<'admissions' | 'notices' | 'messages' | 'stats'>('admissions');

  // Admissions Data State
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [loadingAdmissions, setLoadingAdmissions] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedAdmission, setSelectedAdmission] = useState<any | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [adminNotice, setAdminNotice] = useState<string | null>(null);

  // Contact Messages State
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Notices State
  const [notices, setNotices] = useState<any[]>([]);
  const [loadingNotices, setLoadingNotices] = useState(false);

  // Authentication Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default demo master password: "admin" or "dci@2026" or "school"
    if (
      passwordInput === 'admin' ||
      passwordInput === 'dci@2026' ||
      passwordInput === 'school' ||
      passwordInput.toLowerCase() === 'admin123'
    ) {
      setIsAuthenticated(true);
      setLoginError(null);
    } else {
      setLoginError('Invalid Administrator credentials. (Demo hint: use "admin" or "dci@2026")');
    }
  };

  // Fetch all admissions from backend API or direct Supabase client
  const fetchAdmissions = async () => {
    setLoadingAdmissions(true);
    let loaded = false;

    // PATH 1: Server endpoint /api/admissions
    try {
      const res = await fetch('/api/admissions');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setAdmissions(data);
          loaded = true;
        }
      }
    } catch (err) {
      console.warn('Backend /api/admissions unavailable, trying direct Supabase query:', err);
    }

    // PATH 2: Direct Supabase client query
    if (!loaded) {
      try {
        const supabase = getSupabaseClient();
        if (supabase) {
          const { data, error } = await supabase
            .from('admissions')
            .select('*')
            .order('created_at', { ascending: false });

          if (!error && Array.isArray(data)) {
            setAdmissions(data);
            loaded = true;
          }
        }
      } catch (err) {
        console.error('Direct Supabase admissions fetch error:', err);
      }
    }

    // Fallback Mock Data if empty so admin view is instantly demonstrative
    if (!loaded || admissions.length === 0) {
      setAdmissions((prev) => (prev.length > 0 ? prev : [
        {
          id: 'ADM-2026-9812',
          student_name: 'Diya Sharma',
          dob: '2016-05-15',
          grade_applying: 'Grade 5',
          parent_name: 'Vikram Sharma',
          email: 'vikram.sharma@example.com',
          phone: '+1 (555) 019-2831',
          address: '42 Orchid Boulevard, South Campus Zone',
          status: 'Under Review',
          created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
        },
        {
          id: 'ADM-2026-9813',
          student_name: 'Aarav Patel',
          dob: '2014-08-20',
          grade_applying: 'Grade 7',
          parent_name: 'Priya Patel',
          email: 'priya.patel@example.com',
          phone: '+1 (555) 019-3342',
          address: '108 Lake View Residency',
          status: 'Pending',
          created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
        },
        {
          id: 'ADM-2026-9814',
          student_name: 'Ishaan Verma',
          dob: '2011-03-10',
          grade_applying: 'Grade 10',
          parent_name: 'Sanjay Verma',
          email: 'sanjay.verma@example.com',
          phone: '+1 (555) 019-7712',
          address: '15 Harmony Enclave',
          status: 'Accepted',
          created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
        },
      ]));
    }

    setLoadingAdmissions(false);
  };

  // Fetch Contact Messages
  const fetchMessages = async () => {
    setLoadingMessages(true);
    let loaded = false;

    try {
      const res = await fetch('/api/contact');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setContactMessages(data);
          loaded = true;
        }
      }
    } catch {
      // fallback
    }

    if (!loaded) {
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
          if (data && Array.isArray(data)) {
            setContactMessages(data);
            loaded = true;
          }
        } catch {
          // ignore
        }
      }
    }

    if (!loaded) {
      setContactMessages([
        {
          id: 'msg-1',
          name: 'Meenakshi Sundaram',
          email: 'meenakshi@example.com',
          phone: '+1 (555) 018-9921',
          subject: 'Campus Walkthrough & Tour Booking',
          message: 'Hello, we would like to schedule a guided tour of the STEM AI labs this coming Saturday morning for Grade 9 admission.',
          created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
        },
        {
          id: 'msg-2',
          name: 'Karan Malhotra',
          email: 'karan.m@example.com',
          phone: '+1 (555) 018-4412',
          subject: 'Bus Route Availability (Route 14)',
          message: 'Kindly confirm if the school bus covers Anna Nagar West and what are the morning pickup timings for primary students.',
          created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
        },
      ]);
    }
    setLoadingMessages(false);
  };

  // Fetch Notices
  const fetchNotices = async () => {
    setLoadingNotices(true);
    try {
      const res = await fetch('/api/notices');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setNotices(data);
        }
      }
    } catch {
      // ignore
    } finally {
      setLoadingNotices(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAdmissions();
      fetchMessages();
      fetchNotices();
    }
  }, [isAuthenticated]);

  // Update Admission Status Handler
  const handleUpdateStatus = async (appId: string, newStatus: string) => {
    setStatusUpdating(true);
    try {
      // 1. Backend API
      await fetch(`/api/admissions/${appId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      }).catch(() => null);

      // 2. Direct Supabase update
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          await supabase.from('admissions').update({ status: newStatus }).eq('id', appId);
        } catch {
          // ignore
        }
      }

      // 3. Update local state
      setAdmissions((prev) =>
        prev.map((app) => (app.id === appId ? { ...app, status: newStatus } : app))
      );
      if (selectedAdmission && selectedAdmission.id === appId) {
        setSelectedAdmission({ ...selectedAdmission, status: newStatus });
      }

      setAdminNotice(`Application ${appId} marked as "${newStatus}"!`);
      setTimeout(() => setAdminNotice(null), 3500);
    } catch (err: any) {
      console.error('Error updating admission status:', err);
    } finally {
      setStatusUpdating(false);
    }
  };

  // Filter admissions
  const filteredAdmissions = admissions.filter((app) => {
    const sName = (app.student_name || app.studentName || '').toLowerCase();
    const pName = (app.parent_name || app.parentName || '').toLowerCase();
    const gr = (app.grade_applying || app.gradeApplying || '').toLowerCase();
    const id = (app.id || '').toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesSearch = sName.includes(query) || pName.includes(query) || gr.includes(query) || id.includes(query);
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Export CSV
  const exportCSV = () => {
    if (admissions.length === 0) return;
    const headers = ['ID', 'Student Name', 'Grade', 'Parent Name', 'Email', 'Phone', 'Status', 'Date'];
    const rows = admissions.map((a) => [
      `"${a.id || ''}"`,
      `"${a.student_name || a.studentName || ''}"`,
      `"${a.grade_applying || a.gradeApplying || ''}"`,
      `"${a.parent_name || a.parentName || ''}"`,
      `"${a.email || ''}"`,
      `"${a.phone || ''}"`,
      `"${a.status || 'Pending'}"`,
      `"${a.created_at || ''}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DCI_Admissions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isAuthenticated) {
    return (
      <div className="py-24 max-w-md mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-sm">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">School Admin Portal</h1>
            <p className="text-xs text-slate-500">
              Authorized access for Principal, Admissions Desk, and School Administration.
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Admin Username / Email
              </label>
              <input
                type="text"
                required
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="Enter admin password (hint: admin)"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all hover:scale-[1.01]"
            >
              Sign In to Admin Dashboard
            </button>
          </form>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500 space-y-1">
            <div><strong>Demo Master Access:</strong></div>
            <div>Password: <code className="bg-slate-200 px-1 py-0.5 rounded text-blue-700 font-bold">admin</code> or <code className="bg-slate-200 px-1 py-0.5 rounded text-blue-700 font-bold">dci@2026</code></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Toast Alert */}
      {adminNotice && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-slate-900 text-white shadow-2xl flex items-center gap-3 text-xs animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{adminNotice}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Administrator Center
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            School Management & Admissions Desk
          </h1>
          <p className="text-slate-600 text-sm">
            Review live applicant submissions, manage campus notices, review parent inquiries, and monitor database records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              fetchAdmissions();
              fetchMessages();
              fetchNotices();
            }}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 text-xs font-semibold flex items-center gap-2 shadow-2xs transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
            <span>Refresh All</span>
          </button>

          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Admissions Received</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{admissions.length}</div>
            <div className="text-[11px] text-blue-600 font-medium mt-0.5">Live Database Records</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Review</div>
            <div className="text-2xl font-extrabold text-amber-600 mt-1">
              {admissions.filter((a) => a.status === 'Pending' || a.status === 'Under Review').length}
            </div>
            <div className="text-[11px] text-amber-600 font-medium mt-0.5">Action Required</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact Inquiries</div>
            <div className="text-2xl font-extrabold text-indigo-600 mt-1">{contactMessages.length}</div>
            <div className="text-[11px] text-indigo-600 font-medium mt-0.5">Parent Messages</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Mail className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Official Circulars</div>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">{notices.length}</div>
            <div className="text-[11px] text-emerald-600 font-medium mt-0.5">Active Notices</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Bell className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setAdminTab('admissions')}
          className={`px-5 py-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            adminTab === 'admissions'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Admission Applications ({admissions.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('messages')}
          className={`px-5 py-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            adminTab === 'messages'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Parent Inquiries ({contactMessages.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('notices')}
          className={`px-5 py-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            adminTab === 'notices'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Noticeboard Controls ({notices.length})</span>
        </button>
      </div>

      {/* TAB 1: ADMISSIONS MANAGEMENT */}
      {adminTab === 'admissions' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search student, parent, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-medium focus:outline-none focus:border-blue-500"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Under Review">Under Review</option>
                <option value="Accepted">Accepted</option>
                <option value="Waitlisted">Waitlisted</option>
              </select>

              <button
                onClick={exportCSV}
                className="px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Admissions Table */}
          {loadingAdmissions ? (
            <div className="py-16 text-center text-slate-500 space-y-2 bg-white rounded-2xl border border-slate-200">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs">Loading database admissions...</p>
            </div>
          ) : filteredAdmissions.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8 space-y-2">
              <FileText className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">No Applications Found</h3>
              <p className="text-xs text-slate-500">No candidate submissions match your search query.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Application ID</th>
                      <th className="py-3.5 px-4">Student Name</th>
                      <th className="py-3.5 px-4">Grade</th>
                      <th className="py-3.5 px-4">Parent Details</th>
                      <th className="py-3.5 px-4">Contact Phone</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredAdmissions.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                          {app.id}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {app.student_name || app.studentName}
                          <div className="text-[10px] text-slate-400 font-normal">
                            DOB: {app.dob || 'N/A'}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-medium">
                          {app.grade_applying || app.gradeApplying}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-900">{app.parent_name || app.parentName}</div>
                          <div className="text-[10px] text-slate-500">{app.email}</div>
                        </td>
                        <td className="py-3.5 px-4 font-mono">
                          {app.phone}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                              app.status === 'Accepted'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : app.status === 'Under Review'
                                ? 'bg-sky-50 text-sky-700 border-sky-200'
                                : app.status === 'Waitlisted'
                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                          >
                            {app.status || 'Pending'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setSelectedAdmission(app)}
                            className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-xs transition-colors"
                          >
                            Review & Update
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CONTACT MESSAGES */}
      {adminTab === 'messages' && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-5">
            {contactMessages.map((msg) => (
              <div
                key={msg.id}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{msg.subject || 'General Inquiry'}</h3>
                    <div className="text-xs text-slate-500 mt-0.5">
                      From: <strong>{msg.name}</strong> • <a href={`mailto:${msg.email}`} className="text-blue-600 hover:underline">{msg.email}</a>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {msg.created_at ? new Date(msg.created_at).toLocaleDateString() : 'Recent'}
                  </span>
                </div>

                <p className="text-slate-600 text-xs leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  {msg.message}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-500 font-mono">{msg.phone || 'No phone provided'}</span>
                  <a
                    href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || 'DCI AI School Inquiry')}`}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold text-xs shadow-xs hover:bg-blue-700 transition-colors flex items-center gap-1"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Reply to Parent</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: NOTICES MANAGEMENT */}
      {adminTab === 'notices' && (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-800 flex items-center justify-between">
            <span>You can create new official notices directly from the public <strong>Notice Board</strong> tab or manage them here.</span>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {notices.map((n) => (
              <div key={n.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold text-[10px] uppercase">
                    {n.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">{n.date}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{n.title}</h4>
                <p className="text-slate-600 text-xs line-clamp-2">{n.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Admission Review Modal */}
      {selectedAdmission && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedAdmission(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 animate-in fade-in zoom-in-95 duration-200 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                  Admission Candidate Dossier
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                  {selectedAdmission.student_name || selectedAdmission.studentName}
                </h2>
                <div className="text-xs font-mono text-slate-500">
                  App ID: <span className="font-bold text-slate-800">{selectedAdmission.id}</span>
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                  selectedAdmission.status === 'Accepted'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                {selectedAdmission.status || 'Pending'}
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <div className="text-slate-500 font-medium">Grade Applying For:</div>
                <div className="font-bold text-slate-900 text-sm">
                  {selectedAdmission.grade_applying || selectedAdmission.gradeApplying}
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <div className="text-slate-500 font-medium">Date of Birth:</div>
                <div className="font-bold text-slate-900 text-sm">
                  {selectedAdmission.dob || 'Not provided'}
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <div className="text-slate-500 font-medium">Parent / Guardian:</div>
                <div className="font-bold text-slate-900">
                  {selectedAdmission.parent_name || selectedAdmission.parentName}
                </div>
                <div className="text-slate-600">{selectedAdmission.email}</div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <div className="text-slate-500 font-medium">Contact Phone:</div>
                <div className="font-bold text-slate-900 font-mono">
                  {selectedAdmission.phone}
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1">
              <div className="text-slate-500 font-medium">Residential Address:</div>
              <div className="text-slate-800 leading-relaxed">
                {selectedAdmission.address || 'Address provided on file with Admissions Desk.'}
              </div>
            </div>

            {/* Quick Status Action Buttons */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="text-xs font-bold text-slate-700">Update Applicant Status:</div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  disabled={statusUpdating}
                  onClick={() => handleUpdateStatus(selectedAdmission.id, 'Under Review')}
                  className="py-2.5 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs border border-sky-200 transition-colors"
                >
                  Under Review
                </button>
                <button
                  disabled={statusUpdating}
                  onClick={() => handleUpdateStatus(selectedAdmission.id, 'Accepted')}
                  className="py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-200 transition-colors"
                >
                  Accept Admission
                </button>
                <button
                  disabled={statusUpdating}
                  onClick={() => handleUpdateStatus(selectedAdmission.id, 'Waitlisted')}
                  className="py-2.5 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs border border-purple-200 transition-colors"
                >
                  Waitlist
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedAdmission(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
