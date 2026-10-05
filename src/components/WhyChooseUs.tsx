import React from 'react';
import { GraduationCap, Laptop, FlaskConical, Cpu, Trophy, ShieldCheck, ArrowRight } from 'lucide-react';
import { WHY_CHOOSE_US } from '../data/mockData';

interface WhyChooseUsProps {
  onLearnMore?: () => void;
}

export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ onLearnMore }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap':
        return <GraduationCap className="w-6 h-6 text-blue-600" />;
      case 'Laptop':
        return <Laptop className="w-6 h-6 text-sky-600" />;
      case 'FlaskConical':
        return <FlaskConical className="w-6 h-6 text-indigo-600" />;
      case 'Cpu':
        return <Cpu className="w-6 h-6 text-teal-600" />;
      case 'Trophy':
        return <Trophy className="w-6 h-6 text-amber-600" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-emerald-600" />;
      default:
        return <GraduationCap className="w-6 h-6 text-blue-600" />;
    }
  };

  const getBgColor = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap':
        return 'bg-blue-50';
      case 'Laptop':
        return 'bg-sky-50';
      case 'FlaskConical':
        return 'bg-indigo-50';
      case 'Cpu':
        return 'bg-teal-50';
      case 'Trophy':
        return 'bg-amber-50';
      case 'ShieldCheck':
        return 'bg-emerald-50';
      default:
        return 'bg-blue-50';
    }
  };

  return (
    <section className="py-20 bg-slate-50/70 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-bold uppercase tracking-wider">
            Excellence & Distinction
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Why Choose DCI AI School
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Our comprehensive academic framework balances rigorous global standards with state-of-the-art facilities, fostering holistic student development.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {WHY_CHOOSE_US.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
            >
              <div>
                <div className={`w-14 h-14 rounded-xl ${getBgColor(item.iconName)} flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-200`}>
                  {getIcon(item.iconName)}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center text-xs font-semibold text-blue-600 group-hover:text-blue-700">
                <span>World-Class Standard</span>
              </div>
            </div>
          ))}
        </div>

        {onLearnMore && (
          <div className="text-center mt-12">
            <button
              onClick={onLearnMore}
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Learn more about our educational philosophy & campus <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
