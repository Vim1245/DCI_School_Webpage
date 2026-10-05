import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Brain,
  Baby,
  Layers,
  Award,
} from 'lucide-react';
import { ACADEMIC_PROGRAMS } from '../data/mockData';
import { Program } from '../types';

interface ProgramsSectionProps {
  onApply: () => void;
}

export const ProgramsSection: React.FC<ProgramsSectionProps> = ({ onApply }) => {
  const [selectedModalProgram, setSelectedModalProgram] = useState<Program | null>(null);

  // Map 4 primary academic stages requested
  const stages = [
    {
      id: 'primary',
      level: 'Primary Education',
      gradeRange: 'Pre-K to Grade 5',
      title: 'Foundational Discovery & Literacy',
      desc: 'Nurturing curiosity, foundational mathematics, bilingual reading, and early STEM inquiry through hands-on activity.',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
      icon: <Baby className="w-5 h-5 text-blue-600" />,
      features: ['Activity-Based Experiential Math', 'Guided Phonics & Reading', 'Early AI & Robotics Play', 'Swimming & Fine Arts'],
      curriculum: 'CBSE Early Pathway / Cambridge Primary',
    },
    {
      id: 'middle',
      level: 'Middle School',
      gradeRange: 'Grades 6 to 8',
      title: 'Inquiry-Based & Analytical Growth',
      desc: 'Deepening conceptual mastery in sciences, computational thinking, debate, and collaborative project-based problem solving.',
      image: 'https://images.unsplash.com/photo-1522661067900-ab829854a57f?auto=format&fit=crop&w=800&q=80',
      icon: <Brain className="w-5 h-5 text-sky-600" />,
      features: ['Hands-on Physics & Bio Labs', 'Debate & Model UN (MUN)', '3D Prototyping & Coding', 'Competitive Track Athletics'],
      curriculum: 'CBSE / Cambridge Lower Secondary',
    },
    {
      id: 'secondary',
      level: 'Secondary Education',
      gradeRange: 'Grades 9 & 10',
      title: 'Rigorous Academic Specialization',
      desc: 'Rigorous preparation for board examinations with intensive conceptual coaching, experimental laboratories, and career guidance.',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
      icon: <BookOpen className="w-5 h-5 text-indigo-600" />,
      features: ['Comprehensive Board Exam Prep', 'STEM Innovation Projects', 'Leadership & Community Service', 'Olympiad & NTSE Coaching'],
      curriculum: 'CBSE All-India Secondary Examination',
    },
    {
      id: 'higher-sec',
      level: 'Higher Secondary Education',
      gradeRange: 'Grades 11 & 12',
      title: 'Pre-University & Global Career Pathways',
      desc: 'Advanced streams in STEM (AI & Computer Science), Commerce, and Humanities preparing seniors for Ivy League and premier colleges.',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
      icon: <GraduationCap className="w-5 h-5 text-teal-600" />,
      features: ['JEE / NEET & SAT Guidance Cell', 'AI Research Lab Mentorship', 'Global University Advisory', 'Industry Internship Credits'],
      curriculum: 'CBSE Senior Secondary / IB Diploma Stream',
    },
  ];

  return (
    <section id="academics" className="py-20 bg-slate-50/70 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" /> Academic Continuum
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Academic Programs & Curriculum
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Our curriculum blends rigorous CBSE and international standards with experiential learning, preparing students to lead in an AI-driven global future.
          </p>
        </div>

        {/* 4 Clean Academics Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stages.map((stage) => (
            <div
              key={stage.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
            >
              {/* Card Image */}
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img
                  src={stage.image}
                  alt={stage.level}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-bold text-slate-800 shadow-sm border border-slate-200/50">
                  {stage.gradeRange}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      {stage.icon}
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">
                      {stage.level}
                    </h3>
                  </div>

                  <h4 className="text-xs font-semibold text-blue-600">
                    {stage.title}
                  </h4>

                  <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                    {stage.desc}
                  </p>
                </div>

                {/* Features & Action */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="space-y-1.5">
                    {stage.features.slice(0, 2).map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedModalProgram(stage as any)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
                    >
                      <span>Learn More</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={onApply}
                      className="px-3 py-1.5 rounded-md bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white text-xs font-semibold transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Learn More Modal */}
        {selectedModalProgram && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
              <div className="relative h-56 bg-slate-900">
                <img
                  src={selectedModalProgram.image}
                  alt={selectedModalProgram.level}
                  className="w-full h-full object-cover opacity-90"
                />
                <button
                  onClick={() => setSelectedModalProgram(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-900/70 text-white flex items-center justify-center hover:bg-slate-900 transition-colors"
                >
                  ✕
                </button>
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="text-[11px] font-bold uppercase tracking-wider bg-blue-600 px-2 py-0.5 rounded">
                    {selectedModalProgram.gradeRange}
                  </span>
                  <h3 className="text-xl font-bold mt-1">{selectedModalProgram.level}</h3>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{selectedModalProgram.title}</h4>
                  <p className="text-slate-600 text-xs mt-1 leading-relaxed">{selectedModalProgram.description}</p>
                </div>

                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Curriculum Highlights</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedModalProgram.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 text-xs font-medium text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-blue-50 rounded-xl text-xs text-blue-800 flex items-center justify-between">
                  <span>Admissions for 2026-27 are currently open for this level.</span>
                  <button
                    onClick={() => {
                      setSelectedModalProgram(null);
                      onApply();
                    }}
                    className="px-3 py-1.5 bg-blue-600 text-white font-bold rounded-lg text-xs hover:bg-blue-700 transition-colors"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
