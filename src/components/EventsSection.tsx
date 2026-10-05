import React, { useState } from 'react';
import { UPCOMING_EVENTS } from '../data/mockData';
import { Calendar, Clock, MapPin, ArrowRight, Bell } from 'lucide-react';
import { SchoolEvent } from '../types';

interface EventsSectionProps {
  onContactClick?: () => void;
}

export const EventsSection: React.FC<EventsSectionProps> = ({ onContactClick }) => {
  const [rsvpEvent, setRsvpEvent] = useState<SchoolEvent | null>(null);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return {
        month: d.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
        day: d.getDate(),
        weekday: d.toLocaleString('en-US', { weekday: 'short' }),
      };
    } catch {
      return { month: 'OCT', day: 15, weekday: 'SAT' };
    }
  };

  return (
    <section id="events" className="py-20 bg-slate-50/70 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-14">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-bold uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5" /> Campus Life & Activities
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              School Events & News
            </h2>
            <p className="text-slate-600 text-sm max-w-xl">
              Stay connected with academic exhibitions, athletic tournaments, cultural festivals, and parent-teacher gatherings.
            </p>
          </div>

          {onContactClick && (
            <button
              onClick={onContactClick}
              className="px-5 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 font-semibold text-xs shadow-sm transition-colors whitespace-nowrap"
            >
              School Academic Calendar ↗
            </button>
          )}
        </div>

        {/* Events Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {UPCOMING_EVENTS.map((event) => {
            const dateParts = formatDate(event.date);

            return (
              <div
                key={event.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col group"
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-md text-center shadow-sm border border-slate-200/50">
                    <div className="text-[10px] font-bold text-blue-600 tracking-wider leading-none">{dateParts.month}</div>
                    <div className="text-base font-extrabold text-slate-900 leading-tight">{dateParts.day}</div>
                  </div>
                  <div className="absolute top-3 right-3 bg-slate-900/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-semibold text-white">
                    {event.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-blue-600 transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
                      {event.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
                    {event.time && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-blue-500" />
                        <span>{event.time}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-500" />
                      <span className="truncate">{event.location}</span>
                    </div>

                    <button
                      onClick={() => {
                        setRsvpEvent(event);
                        setRsvpSubmitted(false);
                      }}
                      className="w-full mt-2 py-2 rounded-lg bg-slate-50 hover:bg-blue-50 text-blue-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1"
                    >
                      <Bell className="w-3 h-3" /> Event Details & Reminder
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Event Detail & Reminder Modal */}
        {rsvpEvent && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{rsvpEvent.category}</span>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">{rsvpEvent.title}</h3>
                </div>
                <button
                  onClick={() => setRsvpEvent(null)}
                  className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              <p className="text-slate-600 text-xs leading-relaxed">{rsvpEvent.description}</p>

              <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>Date: <strong>{rsvpEvent.date}</strong></span>
                </div>
                {rsvpEvent.time && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>Time: <strong>{rsvpEvent.time}</strong></span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>Venue: <strong>{rsvpEvent.location}</strong></span>
                </div>
              </div>

              {rsvpSubmitted ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-semibold text-center">
                  ✓ Calendar reminder noted! We look forward to seeing you.
                </div>
              ) : (
                <button
                  onClick={() => setRsvpSubmitted(true)}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs transition-colors shadow-sm"
                >
                  Add to My Calendar / Notify Me
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
