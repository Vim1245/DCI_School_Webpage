import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  CheckCircle,
  FileText,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Database,
  AlertCircle,
  ShieldCheck,
  GraduationCap,
} from 'lucide-react';
import { SupabaseConfigStatus } from '../types';
import { getSupabaseClient } from '../lib/supabase';

interface AdmissionFormProps {
  supabaseStatus?: SupabaseConfigStatus | null;
}

export const AdmissionForm: React.FC<AdmissionFormProps> = ({ supabaseStatus }) => {
  const [studentName, setStudentName] = useState('');
  const [dob, setDob] = useState('');
  const [gradeApplying, setGradeApplying] = useState('Grade 1');
  const [parentName, setParentName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);

    const submissionPayload = {
      student_name: studentName.trim(),
      dob: dob || new Date().toISOString().split('T')[0],
      grade_applying: gradeApplying,
      parent_name: parentName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim() || '',
      status: 'Pending',
    };

    let savedData: any = null;
    let savedInDatabase = false;
    let apiErrorMsg = '';

    // PATH 1: Try backend API (/api/admissions)
    try {
      const res = await fetch('/api/admissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: submissionPayload.student_name,
          dob: submissionPayload.dob,
          gradeApplying: submissionPayload.grade_applying,
          parentName: submissionPayload.parent_name,
          email: submissionPayload.email,
          phone: submissionPayload.phone,
          address: submissionPayload.address,
        }),
      });

      const resJson = await res.json().catch(() => null);

      if (res.ok && resJson && resJson.supabaseSynced) {
        savedData = resJson;
        savedInDatabase = true;
      } else if (resJson && resJson.error) {
        apiErrorMsg = resJson.error + (resJson.details ? ` (${resJson.details})` : '');
      } else if (!res.ok) {
        apiErrorMsg = `API HTTP ${res.status}: ${res.statusText || 'Backend endpoint unavailable'}`;
      }
    } catch (apiErr: any) {
      apiErrorMsg = `Network error calling /api/admissions: ${apiErr.message}`;
      console.warn('Backend /api/admissions not reachable, falling back to direct Supabase client insertion:', apiErr);
    }

    // PATH 2: Direct Supabase client insertion (for Render static hosting or direct browser submission)
    if (!savedInDatabase) {
      try {
        const supabase = getSupabaseClient();
        if (supabase) {
          // Attempt insert: first with select('id'); if that fails (e.g. RLS on select), fall back to pure insert
          let insertRes = await supabase
            .from('admissions')
            .insert([submissionPayload])
            .select('id');

          if (insertRes.error) {
            console.warn('Direct insert+select error, attempting pure insert:', insertRes.error.message);
            insertRes = await supabase
              .from('admissions')
              .insert([submissionPayload]);
          }

          if (!insertRes.error && (insertRes.status === 201 || insertRes.status === 200 || !insertRes.status)) {
            const appId = (insertRes.data && insertRes.data[0]?.id)
              || 'ADM-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000);
            savedData = {
              success: true,
              applicationNumber: appId,
              message: 'Application submitted successfully & saved to your Supabase Admissions table!',
              data: (insertRes.data && insertRes.data[0]) || { ...submissionPayload, id: appId },
              supabaseSynced: true,
            };
            savedInDatabase = true;
          } else if (insertRes.error) {
            console.error('Supabase direct admission insert error:', insertRes.error);
            const errCode = insertRes.error.code ? `[Code ${insertRes.error.code}] ` : '';
            const errDetails = insertRes.error.details ? ` (${insertRes.error.details})` : '';
            setErrorMessage(`Database Error: ${errCode}${insertRes.error.message}${errDetails}`);
          }
        } else {
          setErrorMessage('Database connection could not be established. Supabase URL and anon key are missing.');
        }
      } catch (dbErr: any) {
        console.error('Database connection error:', dbErr);
        setErrorMessage(`Database connection error: ${dbErr.message || 'Could not connect to database.'}`);
      }
    }

    if (savedInDatabase && savedData) {
      setSubmittedData(savedData);
      setErrorMessage(null);
    } else if (!errorMessage) {
      setErrorMessage(
        apiErrorMsg
          ? `Submission failed: ${apiErrorMsg}`
          : 'Could not record application in the database. Please verify your Supabase database permissions and try again.'
      );
    }

    setSubmitting(false);
  };

  return (
    <div id="admission-form" className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Admissions Session 2026 - 2027
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Online Student Admission Application
        </h1>
        <p className="text-slate-600 text-sm max-w-xl mx-auto">
          Begin your child’s transformative journey at DCI AI School. Complete the simple form below to initiate review with our admissions desk.
        </p>
      </div>

      {submittedData ? (
        <div className="bg-white p-8 sm:p-10 rounded-2xl border border-emerald-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900">
              Application Submitted Successfully!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              Your application has been received and logged directly into our admissions database. Our counselors will contact you within 24–48 hours.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-left max-w-md mx-auto space-y-2.5 text-xs">
            <div className="flex justify-between font-bold text-slate-900 pb-2 border-b border-slate-200">
              <span>Application ID:</span>
              <span className="text-blue-600 font-mono text-sm">{submittedData.applicationNumber}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Student Name:</span>
              <span className="font-semibold text-slate-900">{studentName}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Grade Applying:</span>
              <span className="font-semibold text-slate-900">{gradeApplying}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Parent / Guardian:</span>
              <span className="font-semibold text-slate-900">{parentName}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Database Sync Status:</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                ✓ Recorded in Production Supabase
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              setSubmittedData(null);
              setStudentName('');
              setParentName('');
              setEmail('');
              setPhone('');
              setAddress('');
            }}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
          >
            Submit Another Application
          </button>
        </div>
      ) : (
        <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 border-b border-slate-100 pb-4">
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <Database className="w-4 h-4 text-blue-600" />
              Direct sync with Supabase production table: <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-600 font-mono font-bold">admissions</code>
            </span>
            <span className="font-semibold text-rose-500">* Required Fields</span>
          </div>

          {errorMessage && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-3 text-xs">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Submission Notice:</strong> {errorMessage}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Student Section */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
                <User className="w-4 h-4" /> 1. Student Information
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Diya Sharma"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Grade Applying For *
                </label>
                <select
                  value={gradeApplying}
                  onChange={(e) => setGradeApplying(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                >
                  <option value="Pre-Kindergarten">Pre-Kindergarten (Age 3+)</option>
                  <option value="Kindergarten">Kindergarten (Age 4+)</option>
                  <option value="Grade 1">Grade 1</option>
                  <option value="Grade 2">Grade 2</option>
                  <option value="Grade 3">Grade 3</option>
                  <option value="Grade 4">Grade 4</option>
                  <option value="Grade 5">Grade 5</option>
                  <option value="Grade 6">Grade 6</option>
                  <option value="Grade 7">Grade 7</option>
                  <option value="Grade 8">Grade 8</option>
                  <option value="Grade 9">Grade 9 (Secondary)</option>
                  <option value="Grade 10">Grade 10 (Secondary)</option>
                  <option value="Grade 11">Grade 11 (Higher Secondary - STEM / Arts / Commerce)</option>
                  <option value="Grade 12">Grade 12 (Higher Secondary)</option>
                </select>
              </div>
            </div>

            {/* Parent / Guardian Section */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> 2. Parent / Guardian Contact Details
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Parent or Guardian Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Sharma"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="parent@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone / Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210 or +1 (555) 019-2831"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Residential Address
                </label>
                <textarea
                  rows={2}
                  placeholder="Flat/House No., Street Name, City, Postal Code"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>

            {/* Declaration & Submit Button */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  By submitting this form, you confirm that the details provided are accurate. We respect your privacy and will never share your contact details.
                </span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Recording in Database...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Admission Application</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
