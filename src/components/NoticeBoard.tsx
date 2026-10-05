import React, { useState, useEffect } from 'react';
import {
  Bell,
  Search,
  Plus,
  Calendar,
  AlertCircle,
  CheckCircle,
  Users,
  X,
  Database,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Notice, SupabaseConfigStatus } from '../types';

interface NoticeBoardProps {
  supabaseStatus: SupabaseConfigStatus | null;
}

export const NoticeBoard: React.FC<NoticeBoardProps> = ({ supabaseStatus }) => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [posting, setPosting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // New Notice Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Academics' | 'Events' | 'Exams' | 'Sports' | 'Holidays'>('Academics');
  const [content, setContent] = useState('');
  const [important, setImportant] = useState(false);
  const [audience, setAudience] = useState<'All' | 'Parents' | 'Students' | 'Staff'>('All');

  const categories = ['All', 'Academics', 'Events', 'Exams', 'Sports', 'Holidays'];

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/notices');
      if (res.ok) {
        const data = await res.json();
        setNotices(data);
      }
    } catch (err) {
      console.error('Error fetching notices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleAddNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    setPosting(true);
    try {
      const res = await fetch('/api/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          date: new Date().toISOString().split('T')[0],
          content,
          important,
          audience,
        }),
      });

      if (res.ok) {
        setSuccessMsg(
          supabaseStatus?.configured
            ? 'Notice published and recorded into Supabase database!'
            : 'Notice published successfully to school noticeboard!'
        );
        setTitle('');
        setContent('');
        setImportant(false);
        setShowAddModal(false);
        fetchNotices();
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      console.error('Error posting notice:', err);
    } finally {
      setPosting(false);
    }
  };

  const filteredNotices = notices.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="notices" className="py-20 bg-slate-50/70 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header & Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold uppercase tracking-wider">
              <Bell className="w-3.5 h-3.5 text-blue-600" /> Official Circulars & Announcements
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Notice Board & Event Circulars
            </h2>
            <p className="text-slate-600 text-sm max-w-2xl">
              Stay updated with official academic schedules, exam timetables, sports meets, and holiday alerts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>Post Official Notice</span>
            </button>
          </div>
        </div>

        {/* Database Mode Notice Badge */}
        <div className="flex flex-wrap items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-600" />
            <span>
              {supabaseStatus?.configured
                ? 'Data Source: Live Supabase Postgres Table ("notices")'
                : 'Data Source: Active School Portal API (Connect Supabase to sync across devices)'}
            </span>
          </div>
          <span className="font-semibold text-blue-600">
            Total Circulars: {filteredNotices.length}
          </span>
        </div>

        {/* Success Notification */}
        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 text-sm shadow-2xs">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Search and Category Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search circulars, exams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-2xs transition-all"
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Notice List */}
        {loading ? (
          <div className="py-12 text-center text-slate-500 space-y-2">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs">Loading official circulars...</p>
          </div>
        ) : filteredNotices.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">No Circulars Found</h3>
            <p className="text-xs text-slate-500">
              No notices match your search term or selected category filter.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredNotices.map((notice) => (
              <div
                key={notice.id}
                className={`p-6 rounded-2xl bg-white border transition-all duration-200 shadow-sm hover:shadow-md ${
                  notice.important
                    ? 'border-amber-300 ring-2 ring-amber-100'
                    : 'border-slate-200/80 hover:border-blue-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                          notice.category === 'Sports'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : notice.category === 'Exams'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : notice.category === 'Events'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        {notice.category}
                      </span>

                      {notice.important && (
                        <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold uppercase tracking-wider">
                          High Priority
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 pt-1">
                      {notice.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-500 text-xs whitespace-nowrap bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/80">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>{notice.date}</span>
                  </div>
                </div>

                <p className="mt-3.5 text-slate-600 text-xs leading-relaxed">
                  {notice.content}
                </p>

                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" /> Audience: {notice.audience || 'All'}
                  </span>
                  <span className="text-blue-600 font-semibold flex items-center gap-1">
                    <span>Active Notice</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Notice Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-blue-600" /> Post Official School Notice
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddNotice} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Notice Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Science Fair Registration Deadline Extended"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e: any) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-blue-500 font-medium"
                    >
                      <option value="Academics">Academics</option>
                      <option value="Events">Events</option>
                      <option value="Exams">Exams</option>
                      <option value="Sports">Sports</option>
                      <option value="Holidays">Holidays</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Audience
                    </label>
                    <select
                      value={audience}
                      onChange={(e: any) => setAudience(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-blue-500 font-medium"
                    >
                      <option value="All">All</option>
                      <option value="Parents">Parents</option>
                      <option value="Students">Students</option>
                      <option value="Staff">Staff</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Circular Content *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide detailed information regarding timing, venue, instructions..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="importantNotice"
                    checked={important}
                    onChange={(e) => setImportant(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="importantNotice" className="text-xs font-medium text-slate-700">
                    Mark as High-Priority Notice
                  </label>
                </div>

                <div className="pt-2 flex justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2.5 rounded-lg text-slate-600 hover:text-slate-900 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={posting}
                    className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20"
                  >
                    {posting ? 'Publishing...' : 'Publish Notice'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
