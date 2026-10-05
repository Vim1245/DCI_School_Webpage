import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Sparkles,
  Menu,
  X,
  Bot,
  Database,
  Phone,
  Mail,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { SupabaseConfigStatus } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  supabaseStatus: SupabaseConfigStatus | null;
  onOpenSupabaseGuide: () => void;
  onOpenAiAssistant: () => void;
  darkMode?: boolean;
  setDarkMode?: (dark: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  supabaseStatus,
  onOpenSupabaseGuide,
  onOpenAiAssistant,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'academics', label: 'Academics' },
    { id: 'facilities', label: 'Facilities' },
    { id: 'activities', label: 'Activities' },
    { id: 'notices', label: 'Notices' },
    { id: 'faculty', label: 'Faculty' },
    { id: 'admission', label: 'Admissions' },
    { id: 'events', label: 'Events' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 bg-white ${
        scrolled ? 'shadow-md border-b border-slate-200/80' : 'border-b border-slate-200'
      }`}
    >
      {/* Top Utility Bar (School Hotline & Accreditation) */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-6 text-[11px] sm:text-xs font-medium">
            <span className="inline-flex items-center gap-1.5 text-amber-300 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Admissions Open 2026-27
            </span>
            <span className="hidden md:inline text-slate-400">|</span>
            <div className="hidden sm:flex items-center gap-1.5 text-slate-300">
              <Phone className="w-3 h-3 text-sky-400" />
              <span>+1 (800) 555-DCI-AI</span>
            </div>
            <span className="hidden lg:inline text-slate-400">|</span>
            <div className="hidden lg:flex items-center gap-1.5 text-slate-300">
              <Mail className="w-3 h-3 text-sky-400" />
              <span>admissions@dci-school.edu</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Student/Parent Portal Link */}
            <button
              onClick={() => handleNavClick('portal')}
              className={`text-[11px] font-semibold flex items-center gap-1 px-2.5 py-0.5 rounded transition-colors ${
                activeTab === 'portal'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <UserCheck className="w-3 h-3 text-sky-400" />
              <span className="hidden sm:inline">Parent/Student Portal</span>
              <span className="sm:hidden">Portal</span>
            </button>

            {/* Admin Desk Link */}
            <button
              onClick={() => handleNavClick('admin')}
              className={`text-[11px] font-semibold flex items-center gap-1 px-2.5 py-0.5 rounded transition-colors ${
                activeTab === 'admin'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Admin Desk</span>
            </button>

            {/* Supabase Status Indicator */}
            <button
              onClick={onOpenSupabaseGuide}
              className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-medium transition-colors ${
                supabaseStatus?.configured
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/40 hover:bg-emerald-900'
                  : supabaseStatus?.urlSet
                  ? 'bg-amber-950 text-amber-300 border border-amber-600/40 hover:bg-amber-900'
                  : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
              }`}
              title="Click to view database connection status and SQL setup"
            >
              <Database className="w-3 h-3 text-emerald-400" />
              <span>{supabaseStatus?.configured ? 'Database Live' : 'Database Status'}</span>
              <HelpCircle className="w-3 h-3 opacity-60" />
            </button>

            {/* Ask AI Assistant Button */}
            <button
              onClick={onOpenAiAssistant}
              className="flex items-center gap-1 px-2.5 py-0.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-[11px] font-bold transition-colors shadow-sm"
            >
              <Bot className="w-3 h-3" />
              <span>AI Concierge</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / DCI Branding */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-800 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-200">
              <GraduationCap className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 flex items-center gap-1.5">
                <span>DCI</span>
                <span className="text-blue-600 font-light">AI School</span>
              </div>
              <div className="text-[10px] tracking-wider text-slate-500 font-semibold uppercase">
                CBSE & IB World School • Excellence in Innovation
              </div>
            </div>
          </div>

          {/* Desktop Navigation Menu Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 relative ${
                    isActive
                      ? 'text-blue-600 font-bold bg-blue-50'
                      : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Apply for Admission Button */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => handleNavClick('admission')}
              className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition-all duration-200 hover:scale-[1.02] flex items-center gap-1.5"
            >
              <span>Apply for Admission</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Hamburger Toggle */}
          <div className="flex items-center gap-2 xl:hidden">
            <button
              onClick={() => handleNavClick('admission')}
              className="sm:hidden px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-sm"
            >
              Apply
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 shadow-xl px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-2 gap-1.5 pb-3 border-b border-slate-100">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3 py-2.5 rounded-lg text-left text-xs font-semibold transition-colors ${
                    isActive ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('admission')}
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow text-center flex items-center justify-center gap-2"
            >
              <span>Apply for Admission 2026-27</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleNavClick('portal')}
              className="w-full py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs text-center"
            >
              Open Student & Parent Portal
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
