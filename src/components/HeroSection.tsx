import React from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Award,
  Sparkles,
  Users,
  Compass,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { SCHOOL_STATS } from '../data/mockData';

interface HeroSectionProps {
  onNavigate: (tab: string) => void;
  onOpenSupabaseGuide?: () => void;
  onOpenAiAssistant?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigate,
}) => {
  return (
    <div className="relative pt-24 sm:pt-28 pb-16 lg:pb-24 bg-gradient-to-b from-blue-50/60 via-white to-slate-50 border-b border-slate-100 overflow-hidden">
      {/* Subtle Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-100/60 rounded-full blur-3xl -z-10 opacity-70 pointer-events-none" />
      <div className="absolute top-40 left-0 w-[450px] h-[450px] bg-blue-100/50 rounded-full blur-3xl -z-10 opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid: Headline & Campus Imagery */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Accreditation Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold tracking-wide uppercase shadow-sm">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>CBSE & IB World School • Admissions Open 2026-27</span>
            </div>

            {/* Exact Required Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              Empowering Students. <br />
              <span className="text-blue-600">Inspiring Futures.</span>
            </h1>

            {/* Exact Required Supporting Text */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl font-normal leading-relaxed">
              Discover a modern learning environment where knowledge, technology, creativity and character come together.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('admission')}
                className="px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all duration-200 hover:scale-[1.02] flex items-center gap-2"
              >
                <span>Apply for Admission</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('about')}
                className="px-6 py-3.5 rounded-xl bg-white border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-600 font-semibold text-sm shadow-sm transition-all duration-200 flex items-center gap-2"
              >
                <Compass className="w-4 h-4 text-blue-500" />
                <span>Explore Our School</span>
              </button>
            </div>

            {/* Trust Highlights Checklist */}
            <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-600 border-t border-slate-200">
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Board Exam Pass Rate</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>GPS-Tracked AC Buses</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Merit Scholarships Available</span>
              </div>
            </div>
          </div>

          {/* Right Visual Column: High-Res Real Campus & Students Visual with Subtle Blue Overlay */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80"
                alt="Students studying together at DCI AI School"
                className="w-full h-[450px] object-cover"
              />
              {/* Subtle Blue/Dark Overlay for legibility and tone */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950/70 via-blue-900/20 to-transparent" />

              {/* Bottom Feature Card in Hero Image */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-slate-200/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Ranked #1 STEM & AI Academy</div>
                      <div className="text-[11px] text-slate-500">Excellence in Pedagogy & Character</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-blue-600">25+ Acres</span>
                    <div className="text-[10px] text-slate-400">Green Eco Campus</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Top Pill */}
            <div className="absolute -top-4 -right-2 bg-white px-3.5 py-1.5 rounded-full shadow-md border border-slate-100 text-xs font-bold text-slate-800 flex items-center gap-1.5 animate-bounce">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Admissions Open 2026-27</span>
            </div>
          </div>
        </div>

        {/* Statistics Bar (Bright, Clean White Cards with Soft Shadows) */}
        <div className="mt-16 pt-10 border-t border-slate-200">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {SCHOOL_STATS.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <div className="text-2xl sm:text-3xl font-extrabold text-blue-600">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-medium text-slate-600 mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
