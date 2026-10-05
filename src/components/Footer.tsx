import React from 'react';
import {
  GraduationCap,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Award,
  Globe,
  Database,
} from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenSupabaseGuide?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenSupabaseGuide }) => {
  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800">
      {/* Upper Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand Info & Motto */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md">
                <GraduationCap className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <div className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
                  <span>DCI</span>
                  <span className="text-sky-400 font-light">AI School</span>
                </div>
                <div className="text-[10px] text-slate-400 tracking-wider font-semibold uppercase">
                  CBSE & IB World School
                </div>
              </div>
            </div>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Empowering students through academic rigor, ethical values, and cutting-edge technological inquiry. Fostering future global leaders across our 25-acre modern green campus.
            </p>

            <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5 text-sky-400 bg-sky-950/60 border border-sky-800 px-2.5 py-1 rounded-md text-[11px] font-medium">
                <Award className="w-3.5 h-3.5" /> Ranked #1 STEM Academy
              </span>
              <span className="inline-flex items-center gap-1.5 text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2.5 py-1 rounded-md text-[11px] font-medium">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Board Success
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors"
                >
                  About Our School
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('academics')}
                  className="hover:text-white transition-colors"
                >
                  Academic Programs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('facilities')}
                  className="hover:text-white transition-colors"
                >
                  Campus Facilities
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('faculty')}
                  className="hover:text-white transition-colors"
                >
                  Faculty Directory
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('events')}
                  className="hover:text-white transition-colors"
                >
                  Events & News
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('gallery')}
                  className="hover:text-white transition-colors"
                >
                  Photo Gallery
                </button>
              </li>
            </ul>
          </div>

          {/* Admissions & Student Support */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400">
              Admissions & Portal
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button
                  onClick={() => onNavigate('admission')}
                  className="text-amber-300 hover:text-amber-200 font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>Apply for Admission 2026-27</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('portal')}
                  className="hover:text-white transition-colors"
                >
                  Student & Parent Portal
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('notices')}
                  className="hover:text-white transition-colors"
                >
                  Official School Notices
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('academics')}
                  className="hover:text-white transition-colors"
                >
                  Fee Structure & Scholarships
                </button>
              </li>
              {onOpenSupabaseGuide && (
                <li className="pt-2">
                  <button
                    onClick={onOpenSupabaseGuide}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors border border-slate-700"
                  >
                    <Database className="w-3 h-3 text-emerald-400" />
                    <span>Database Configuration Guide</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400">
              Contact Desk
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span className="text-slate-400 leading-relaxed">
                  DCI AI School Campus, 100 Academy Boulevard, Innovation City
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <span>+1 (800) 555-DCI-AI</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <span>admissions@dci-school.edu</span>
              </div>
              <div className="flex items-start gap-2.5 pt-1 text-[11px] text-slate-400">
                <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                <span>Mon – Fri: 8:00 AM – 3:30 PM | Sat: 9:00 AM – 1:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-slate-950 py-6 border-t border-slate-800/80 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            © {new Date().getFullYear()} DCI AI School. All Rights Reserved. Affiliated with CBSE & IB World School.
          </div>
          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span>Privacy Policy</span>
            <span>·</span>
            <span>Terms of Admission</span>
            <span>·</span>
            <span>Student Code of Conduct</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
