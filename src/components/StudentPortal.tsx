import React, { useState } from 'react';
import {
  UserCheck,
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  Download,
  FileText,
  Lock,
  Search,
  Sparkles,
  GraduationCap,
} from 'lucide-react';
import { DEMO_STUDENT_RECORD } from '../data/mockData';

export const StudentPortal: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [rollInput, setRollInput] = useState('DCI-2026-0892');
  const [downloadToast, setDownloadToast] = useState<string | null>(null);
  const student = DEMO_STUDENT_RECORD;

  const handleSimulatedDownload = (title: string) => {
    setDownloadToast(`Preparing ${title} PDF for ${student.name} (${student.rollNo})...`);
    setTimeout(() => {
      setDownloadToast(null);
    }, 3500);
  };

  return (
    <section id="portal" className="py-20 bg-slate-50/70 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Toast Notification */}
        {downloadToast && (
          <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-slate-900 text-white shadow-2xl flex items-center gap-3 text-xs animate-in slide-in-from-bottom duration-200">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{downloadToast}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold uppercase tracking-wider">
              <UserCheck className="w-3.5 h-3.5 text-blue-600" /> Student & Parent Digital Portal
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Academic Performance & Fee Center
            </h1>
            <p className="text-slate-600 text-sm max-w-2xl">
              View real-time term grades, attendance metrics, exam blueprints, and digital fee receipts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsLoggedIn(!isLoggedIn)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:border-blue-300 hover:text-blue-600 shadow-2xs flex items-center gap-2 transition-colors"
            >
              <Lock className="w-3.5 h-3.5 text-blue-600" />
              <span>{isLoggedIn ? 'Sign Out Demo' : 'Sign In Demo'}</span>
            </button>
          </div>
        </div>

        {!isLoggedIn ? (
          <div className="max-w-md mx-auto my-12 bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-sm">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Student Portal Sign In</h3>
              <p className="text-xs text-slate-500">
                Enter Roll Number or Student ID to view gradebook & attendance records.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Student Roll Number / ID
                </label>
                <input
                  type="text"
                  value={rollInput}
                  onChange={(e) => setRollInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <button
                onClick={() => setIsLoggedIn(true)}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all hover:scale-[1.01]"
              >
                Access Student Record
              </button>

              <p className="text-[11px] text-center text-slate-500">
                Demo Mode Active: Pre-loaded with student record <strong className="text-slate-800">Aarav V. Sharma</strong>.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Student Profile Overview Card */}
            <div className="bg-white border border-slate-200/80 p-6 sm:p-8 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-xl font-extrabold text-white shadow-md">
                  AS
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider">
                      Active Student
                    </span>
                    <span className="text-xs font-medium text-slate-500">Roll No: {student.rollNo}</span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-slate-900">{student.name}</h2>
                  <div className="text-xs text-slate-600">
                    {student.grade} - Section {student.section} • CBSE Senior Secondary Pathway
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <div className="text-center px-4 border-r border-slate-200">
                  <div className="text-2xl font-extrabold text-blue-600">{student.overallGpa}</div>
                  <div className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Overall GPA</div>
                </div>

                <div className="text-center px-4 border-r border-slate-200">
                  <div className="text-2xl font-extrabold text-emerald-600">{student.attendancePercentage}%</div>
                  <div className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Attendance</div>
                </div>

                <div className="text-center px-4">
                  <div className="text-2xl font-extrabold text-emerald-600">{student.feeStatus}</div>
                  <div className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Tuition Status</div>
                </div>
              </div>
            </div>

            {/* Grid Layout: Gradebook & Fee Downloads */}
            <div className="grid lg:grid-cols-12 gap-8">
              {/* Subject Gradebook */}
              <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    Term 1 Subject Performance Breakdown
                  </h3>
                  <button
                    onClick={() => handleSimulatedDownload('Term Report Card')}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-blue-600 font-semibold text-xs flex items-center gap-1.5 hover:border-blue-300 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Report Card PDF</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {student.subjects.map((sub, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-blue-200 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="text-sm font-bold text-slate-900">
                          {sub.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          Instructor: {sub.teacher}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Score Bar */}
                        <div className="w-32 hidden sm:block bg-slate-200 h-2.5 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-600 h-full rounded-full"
                            style={{ width: `${sub.score}%` }}
                          />
                        </div>

                        <div className="text-right">
                          <div className="text-sm font-bold text-slate-900">
                            {sub.score}/100
                          </div>
                          <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                            Grade: {sub.grade}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Fee Center & Recent Activity */}
              <div className="lg:col-span-4 space-y-6">
                {/* Fee Receipt Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    Digital Fee Receipts & Payments
                  </h3>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex justify-between text-xs font-bold text-emerald-700">
                      <span>Term 1 Tuition & STEM Fee</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px]">PAID</span>
                    </div>
                    <div className="text-2xl font-extrabold text-slate-900">
                      $2,450.00
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Paid via Bank Transfer on July 10, 2026 • Ref: TXN-99812
                    </div>
                  </div>

                  <button
                    onClick={() => handleSimulatedDownload('Official Fee Receipt #TXN-99812')}
                    className="w-full py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold hover:border-blue-300 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-600" />
                    <span>Download Tax Fee Receipt</span>
                  </button>
                </div>

                {/* Achievements & Activities */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500" />
                    Recent Achievements & Badges
                  </h3>

                  <div className="space-y-2.5">
                    {student.recentActivities.map((act, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1"
                      >
                        <div className="font-bold text-slate-800">
                          {act.title}
                        </div>
                        <div className="flex justify-between text-slate-500 text-[11px]">
                          <span>{act.date}</span>
                          <span className="font-bold text-emerald-600">
                            {act.score}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
