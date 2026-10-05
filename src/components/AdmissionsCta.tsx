import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2, Calendar, FileText, UserCheck, ShieldCheck } from 'lucide-react';

interface AdmissionsCtaProps {
  onApply: () => void;
  onExplorePrograms?: () => void;
}

export const AdmissionsCta: React.FC<AdmissionsCtaProps> = ({ onApply, onExplorePrograms }) => {
  const steps = [
    {
      num: '01',
      title: 'Online Application',
      desc: 'Complete the verified student application form in 3 minutes.',
      icon: <FileText className="w-5 h-5 text-blue-600" />,
    },
    {
      num: '02',
      title: 'Campus Interaction',
      desc: 'Friendly interaction session with educators & campus walkthrough.',
      icon: <UserCheck className="w-5 h-5 text-sky-600" />,
    },
    {
      num: '03',
      title: 'Admissions Offer',
      desc: 'Receive formal admission confirmation with official student roll ID.',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-950 to-slate-950 text-white relative overflow-hidden">
      {/* Decorative gradient accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-sky-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Admissions Session 2026 - 2027
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Admissions Open
          </h2>

          <p className="text-blue-100/90 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Give your child an opportunity to learn, grow and succeed in an environment where curiosity meets cutting-edge innovation.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onApply}
              className="px-8 py-3.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all duration-200 flex items-center gap-2 hover:scale-105"
            >
              Apply Now <ArrowRight className="w-4 h-4" />
            </button>
            {onExplorePrograms && (
              <button
                onClick={onExplorePrograms}
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/10 transition-colors"
              >
                View Academic Fee & Grade Levels
              </button>
            )}
          </div>
        </div>

        {/* 3 Simple Admission Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div
              key={step.num}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm relative flex flex-col justify-between hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-md">
                  {step.icon}
                </div>
                <span className="font-mono text-2xl font-extrabold text-blue-400/50">{step.num}</span>
              </div>
              <div>
                <h4 className="font-bold text-lg text-white mb-1.5">{step.title}</h4>
                <p className="text-blue-200/80 text-xs leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Reassurance pill */}
        <div className="mt-12 text-center text-xs text-blue-300/80 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Need help? Call Admissions Hotline: <strong>+1 (800) 555-DCI-AI</strong> or email <strong>admissions@dci-school.edu</strong></span>
        </div>
      </div>
    </section>
  );
};
