import React from 'react';
import { CheckCircle2, ArrowRight, ShieldCheck, Award, Users, BookOpen, Sparkles } from 'lucide-react';

interface AboutSectionProps {
  onLearnMore?: () => void;
  onApply?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onLearnMore, onApply }) => {
  const highlights = [
    {
      title: 'Student-Focused Learning',
      desc: 'Individualized mentoring tailored to foster critical thinking, emotional intelligence, and natural curiosity.',
    },
    {
      title: 'Experienced Faculty',
      desc: 'Nationally recognized and globally certified teachers passionate about igniting lifelong enthusiasm for knowledge.',
    },
    {
      title: 'Modern Facilities',
      desc: 'State-of-the-art STEM labs, Olympic aquatic complex, acoustically treated auditoriums, and open-air learning courts.',
    },
    {
      title: 'Technology-Enabled Education',
      desc: 'Dedicated AI & Robotics innovation hub, 1:1 digital learning programs, and smart interactive classrooms.',
    },
    {
      title: 'Safe and Supportive Environment',
      desc: '25-acre gated green sanctuary with 24/7 biometric security, round-the-clock infirmary, and caring pastoral mentorship.',
    },
  ];

  return (
    <section id="about" className="py-20 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: School Image & Accent Badge */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80"
                alt="Students learning at DCI AI School"
                className="w-full h-[460px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
              
              {/* Overlay Stat Pill */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-slate-200/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Accreditation</div>
                    <div className="text-sm font-bold text-slate-900">CBSE & IB World School Candidate</div>
                  </div>
                </div>
                <div className="hidden sm:block text-right">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                    <Sparkles className="w-3.5 h-3.5" /> 100% Board Results
                  </span>
                </div>
              </div>
            </div>

            {/* Decorative background element */}
            <div className="absolute -top-4 -left-4 w-48 h-48 bg-sky-100 rounded-full blur-3xl -z-10 opacity-70" />
            <div className="absolute -bottom-4 -right-4 w-48 h-48 bg-blue-100 rounded-full blur-3xl -z-10 opacity-70" />
          </div>

          {/* Right Column: Narrative & Key Features */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-bold uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" /> Welcome to DCI AI School
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              A Modern Learning Sanctuary Where <span className="text-blue-600">Tradition Meets Innovation</span>
            </h2>

            <p className="text-slate-600 text-base leading-relaxed">
              At DCI AI School, we believe that education extends far beyond textbooks. Rooted in time-honored Indian values and elevated by international pedagogy, our holistic approach nurtures curious thinkers, compassionate leaders, and visionary innovators ready to excel on the global stage.
            </p>

            {/* Feature Checklist */}
            <div className="space-y-3.5 pt-2">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 text-sm">{item.title}: </span>
                    <span className="text-slate-600 text-sm">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              {onApply && (
                <button
                  onClick={onApply}
                  className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all duration-200 flex items-center gap-2"
                >
                  Apply for Admission <ArrowRight className="w-4 h-4" />
                </button>
              )}
              {onLearnMore && (
                <button
                  onClick={onLearnMore}
                  className="px-6 py-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors"
                >
                  Explore Curriculum & Campus
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
