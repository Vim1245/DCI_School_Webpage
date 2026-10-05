import React, { useState } from 'react';
import { SCHOOL_FACILITIES } from '../data/mockData';
import { Check, Sparkles, Building2, MapPin } from 'lucide-react';
import { Facility } from '../types';

interface FacilitiesSectionProps {
  onTourRequest?: () => void;
}

export const FacilitiesSection: React.FC<FacilitiesSectionProps> = ({ onTourRequest }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalFacility, setActiveModalFacility] = useState<Facility | null>(null);

  const categories = ['All', 'Academics', 'Technology', 'Science', 'Learning', 'Athletics', 'Arts', 'Campus'];

  const filteredFacilities = selectedCategory === 'All'
    ? SCHOOL_FACILITIES
    : SCHOOL_FACILITIES.filter((f) => f.category === selectedCategory);

  return (
    <section id="facilities" className="py-20 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" /> World-Class Infrastructure
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Campus Facilities & Learning Spaces
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Spread across 25 green acres, our campus is engineered with cutting-edge academic labs, high-performance athletic arenas, and creative hubs.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredFacilities.map((facility) => (
            <div
              key={facility.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col group cursor-pointer"
              onClick={() => setActiveModalFacility(facility)}
            >
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img
                  src={facility.image}
                  alt={facility.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-bold text-slate-700 border border-slate-200/50">
                  {facility.category}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                    {facility.name}
                  </h3>
                  <p className="text-slate-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                    {facility.description}
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  {facility.features.slice(0, 2).map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                      <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Bar */}
        <div className="mt-14 p-8 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl font-bold">Experience Our Campus In Person</h3>
            <p className="text-blue-100 text-xs sm:text-sm">
              Schedule a personalized guided walkthrough with our admissions counselors and faculty.
            </p>
          </div>
          {onTourRequest && (
            <button
              onClick={onTourRequest}
              className="px-6 py-3 rounded-lg bg-white text-blue-900 hover:bg-blue-50 font-bold text-sm shadow-sm transition-colors whitespace-nowrap"
            >
              Book a Campus Visit
            </button>
          )}
        </div>

        {/* Detail Modal */}
        {activeModalFacility && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
              <div className="relative h-64 sm:h-72">
                <img
                  src={activeModalFacility.image}
                  alt={activeModalFacility.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setActiveModalFacility(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900/70 text-white flex items-center justify-center hover:bg-slate-900 transition-colors"
                >
                  ✕
                </button>
                <div className="absolute bottom-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-md">
                  {activeModalFacility.category}
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-4">
                <h3 className="text-2xl font-bold text-slate-900">{activeModalFacility.name}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{activeModalFacility.description}</p>

                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Key Highlights</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeModalFacility.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 text-xs font-medium text-slate-700">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => setActiveModalFacility(null)}
                    className="px-5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                  >
                    Close Details
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
