import React, { useState, useEffect } from 'react';
import {
  Users,
  Mail,
  Award,
  Search,
  Edit2,
  X,
  CheckCircle2,
  AlertCircle,
  Save,
  Loader2,
  Database,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { FACULTY_MEMBERS } from '../data/mockData';
import { FacultyMember, SupabaseConfigStatus } from '../types';

interface FacultySectionProps {
  supabaseStatus?: SupabaseConfigStatus | null;
}

export const FacultySection: React.FC<FacultySectionProps> = ({ supabaseStatus }) => {
  const [facultyList, setFacultyList] = useState<FacultyMember[]>(FACULTY_MEMBERS);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('All');

  // Edit Modal State
  const [editingMember, setEditingMember] = useState<FacultyMember | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form Fields State
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('Administration');
  const [qualification, setQualification] = useState('');
  const [experience, setExperience] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState('');
  const [bio, setBio] = useState('');

  const departments = ['All', 'Administration', 'Science & Tech', 'Humanities', 'Mathematics'];
  const departmentOptions = ['Administration', 'Science & Tech', 'Humanities', 'Mathematics'];

  // Fetch faculty from backend API
  const fetchFaculty = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/faculty');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setFacultyList(data);
        }
      }
    } catch (err) {
      console.warn('Failed to load faculty from API, using fallback data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  // Open Edit Modal and prefill existing data
  const handleOpenEdit = (member: FacultyMember) => {
    setEditingMember(member);
    setName(member.name || '');
    setRole(member.role || '');
    setDepartment(member.department || 'Administration');
    setQualification(member.qualification || '');
    setExperience(member.experience || '');
    setEmail(member.email || '');
    setImage(member.image || '');
    setBio(member.bio || '');
    setFormError(null);
  };

  // Close modal
  const handleCloseEdit = () => {
    if (!saving) {
      setEditingMember(null);
      setFormError(null);
    }
  };

  // Submit edits to backend
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    if (!name.trim() || !role.trim() || !qualification.trim() || !experience.trim() || !bio.trim()) {
      setFormError('Please fill out all required fields.');
      return;
    }

    setSaving(true);
    setFormError(null);

    const payload = {
      name: name.trim(),
      role: role.trim(),
      department,
      qualification: qualification.trim(),
      experience: experience.trim(),
      email: email.trim() || null,
      image: image.trim() || null,
      bio: bio.trim(),
    };

    try {
      const res = await fetch(`/api/faculty/${editingMember.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Failed to update faculty details.');
      }

      // Update local state list
      const updatedMember: FacultyMember = {
        ...editingMember,
        ...payload,
        email: payload.email || undefined,
        image: payload.image || undefined,
      };

      setFacultyList((prev) =>
        prev.map((item) => (item.id === editingMember.id ? updatedMember : item))
      );

      // Show alert notice
      setSuccessMessage(result.message || 'Faculty profile updated successfully!');
      setTimeout(() => {
        setSuccessMessage(null);
      }, 4000);

      // Close modal
      setEditingMember(null);
    } catch (err: any) {
      console.error('Error updating faculty:', err);
      setFormError(err.message || 'An unexpected error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  const filtered = facultyList.filter((member) => {
    const matchesDept = dept === 'All' || member.department === dept;
    const matchesSearch =
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.role.toLowerCase().includes(search.toLowerCase()) ||
      member.department.toLowerCase().includes(search.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <section id="faculty" className="py-20 bg-slate-50/70 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold uppercase tracking-wider">
              <Users className="w-3.5 h-3.5 text-blue-600" /> World-Class Educators & Mentors
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Meet Our Distinguished Faculty
            </h1>
            <p className="text-slate-600 text-sm max-w-2xl">
              Our team comprises international scholars, Olympiad mentors, and passionate educators dedicated to student growth.
            </p>
          </div>

          <button
            onClick={fetchFaculty}
            disabled={loading}
            className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 text-xs font-semibold flex items-center gap-2 shadow-2xs transition-colors"
            title="Refresh faculty list"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Directory</span>
          </button>
        </div>

        {/* Database Mode Notice Badge */}
        <div className="flex flex-wrap items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-600" />
            <span>
              {supabaseStatus?.configured
                ? 'Data Source: Live Supabase Postgres Table ("faculty")'
                : 'Data Source: Active School Portal Directory (Edits sync live)'}
            </span>
          </div>
          <span className="font-semibold text-blue-600">
            Total Faculty: {filtered.length}
          </span>
        </div>

        {/* Success Notification Alert Banner */}
        {successMessage && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between gap-3 text-xs shadow-2xs animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-slate-500 hover:text-slate-700 p-1 rounded"
              title="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search faculty by name or subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-2xs transition-all"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {departments.map((d) => (
              <button
                key={d}
                onClick={() => setDept(d)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  dept === d
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-8 space-y-3">
            <Users className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="text-sm text-slate-500">No faculty members found matching your search.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col group"
              >
                {/* Image & Header */}
                <div className="relative h-64 overflow-hidden bg-slate-100">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100">
                      <Users className="w-12 h-12 opacity-30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="px-2.5 py-0.5 rounded-md bg-blue-600/90 text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs">
                      {member.department}
                    </span>
                    <h3 className="text-base font-bold mt-1 text-white">{member.name}</h3>
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-blue-600">
                      {member.role}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{member.qualification}</span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed pt-1">
                      {member.bio}
                    </p>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 truncate mr-2 font-medium">
                      {member.experience}
                    </span>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Functional Edit Button */}
                      <button
                        onClick={() => handleOpenEdit(member)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-300 flex items-center gap-1.5 transition-colors"
                        title={`Edit ${member.name}'s details`}
                      >
                        <Edit2 className="w-3 h-3 text-blue-600" />
                        <span>Edit</span>
                      </button>

                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-blue-600 hover:border-blue-300 transition-colors"
                          title={`Email ${member.name}`}
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Faculty Modal */}
        {editingMember && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-1.5 text-blue-600 text-xs uppercase font-bold tracking-wider">
                    <Edit2 className="w-3.5 h-3.5" /> Edit Faculty Details
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                    Updating: {editingMember.name}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Faculty ID: <span className="font-semibold text-blue-600">{editingMember.id}</span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCloseEdit}
                  disabled={saving}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  title="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Error Message inside Modal */}
              {formError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Edit Form */}
              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Dr. Jane Doe"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Role / Designation <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g. Head of Mathematics & Olympiad Training"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  {/* Department */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-blue-500 font-medium"
                    >
                      {departmentOptions.map((deptName) => (
                        <option key={deptName} value={deptName}>
                          {deptName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Qualification */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Academic Qualification <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={qualification}
                      onChange={(e) => setQualification(e.target.value)}
                      placeholder="e.g. Ph.D. in Educational Leadership"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  {/* Experience */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Experience <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      placeholder="e.g. 15+ Years Faculty"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. educator@dci-school.edu"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                {/* Photo Image URL */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Profile Photo URL
                  </label>
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="Enter faculty photo URL"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Biography */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Biography & Specialization <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Describe academic credentials, mentorship focus, and research background..."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Modal Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCloseEdit}
                    disabled={saving}
                    className="px-4 py-2.5 rounded-lg text-slate-600 hover:text-slate-900 text-xs font-semibold hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving Changes...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Changes</span>
                      </>
                    )}
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
