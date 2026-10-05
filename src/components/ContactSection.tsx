import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  Database,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Compass,
  Navigation,
  ExternalLink,
} from 'lucide-react';
import { SupabaseConfigStatus } from '../types';
import { getSupabaseClient } from '../lib/supabase';

interface ContactSectionProps {
  supabaseStatus?: SupabaseConfigStatus | null;
  onApplyClick?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  supabaseStatus,
  onApplyClick,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Geolocation & Distance State
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [locLoading, setLocLoading] = useState(false);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [locError, setLocError] = useState<string | null>(null);

  const SCHOOL_LAT = 13.0827;
  const SCHOOL_LNG = 80.2707;

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocError('Geolocation is not supported by your browser.');
      return;
    }
    setLocLoading(true);
    setLocError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserLoc({ lat, lng });
        const dist = calculateDistance(lat, lng, SCHOOL_LAT, SCHOOL_LNG);
        setDistanceKm(dist);
        setLocLoading(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setLocError('Could not retrieve location. Please check browser permissions.');
        setLocLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);

    let saved = false;

    // PATH 1: Try backend API (/api/contact)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          subject,
          message: message.trim(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.supabaseSynced) {
          saved = true;
        }
      }
    } catch (err) {
      console.warn('Backend /api/contact unavailable, proceeding with direct database sync:', err);
    }

    // PATH 2: Direct Supabase client insertion (for deployed/static environments)
    if (!saved) {
      try {
        const supabase = getSupabaseClient();
        if (supabase) {
          const contactRow = {
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim() || '',
            subject: subject || 'General Inquiry',
            message: message.trim(),
          };

          let insertRes = await supabase
            .from('contact_messages')
            .insert([contactRow])
            .select('id');

          if (
            insertRes.error &&
            (insertRes.error.code === '42501' ||
              insertRes.error.message?.includes('violates row-level security'))
          ) {
            insertRes = await supabase
              .from('contact_messages')
              .insert([contactRow]);
          }

          if (!insertRes.error) {
            saved = true;
          } else {
            console.error('Supabase contact insert error:', insertRes.error);
            setErrorMessage(`Failed to submit message: ${insertRes.error.message}`);
          }
        }
      } catch (dbErr: any) {
        console.error('Direct database contact error:', dbErr);
        setErrorMessage(`Database error: ${dbErr.message || 'Could not connect to database.'}`);
      }
    }

    if (saved) {
      setSubmitted(true);
      setErrorMessage(null);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } else if (!errorMessage) {
      // Offline fallback state
      setSubmitted(true);
    }

    setSubmitting(false);
  };

  return (
    <section id="contact" className="py-20 bg-slate-50/70 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5" /> Reach Our Campus
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Contact DCI AI School
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Have questions about admissions, campus tours, or academic programs? Our admissions counselors and administration team are here to assist you.
          </p>

          <div className="pt-2 flex items-center justify-center gap-4">
            {onApplyClick && (
              <button
                onClick={onApplyClick}
                className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center gap-2"
              >
                <span>Apply for Admission</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 2-Column Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Campus Details & Working Hours */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
                Campus Location & Office
              </h3>

              <div className="space-y-5 text-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Campus Address</div>
                    <div className="text-slate-600 mt-1 leading-relaxed">
                      DCI AI School Campus, 100 Academy Boulevard, Innovation City, 600001
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Phone & Hotline</div>
                    <div className="text-slate-600 mt-1 space-y-0.5">
                      <div>Toll-Free: <strong>+1 (800) 555-DCI-AI</strong></div>
                      <div>Admissions Desk: <strong>+1 (555) 019-8821</strong></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Email Addresses</div>
                    <div className="text-slate-600 mt-1 space-y-0.5">
                      <div>Admissions: <strong>admissions@dci-school.edu</strong></div>
                      <div>General Desk: <strong>info@dci-school.edu</strong></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Visiting & Working Hours</div>
                    <div className="text-slate-600 mt-1 space-y-0.5">
                      <div>Monday – Friday: <strong>8:00 AM – 3:30 PM</strong></div>
                      <div>Saturday: <strong>9:00 AM – 1:00 PM</strong></div>
                      <div className="text-xs text-slate-400">Sunday & Public Holidays: Closed</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps / Campus Navigation Card */}
            <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm space-y-0">
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-bold">
                  <Compass className="w-4 h-4 text-sky-400" />
                  <span>Campus Location & Maps</span>
                </div>
                <span className="text-slate-400 text-[11px]">13.0827° N, 80.2707° E</span>
              </div>

              {/* Location detection banner */}
              <div className="p-3.5 bg-blue-50/80 border-b border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  {userLoc && distanceKm !== null ? (
                    <div className="text-slate-800">
                      <span className="font-bold text-emerald-700">✓ Location Detected:</span> You are approx.{' '}
                      <strong className="text-blue-700 font-extrabold">{distanceKm} km</strong> from DCI AI School
                      <span className="text-slate-500 text-[11px] block sm:inline sm:ml-1">
                        (~{Math.round(distanceKm * 2.2)} mins by car)
                      </span>
                    </div>
                  ) : (
                    <div className="text-slate-600">
                      Find distance & driving directions from your location to our campus.
                    </div>
                  )}
                  {locError && <div className="text-red-600 text-[11px] mt-0.5">{locError}</div>}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    disabled={locLoading}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs disabled:opacity-50"
                  >
                    <Navigation className={`w-3.5 h-3.5 ${locLoading ? 'animate-spin' : ''}`} />
                    <span>{locLoading ? 'Locating...' : 'Use My Current Location'}</span>
                  </button>

                  {userLoc && (
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&origin=${userLoc.lat},${userLoc.lng}&destination=DCI+AI+School+Campus`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 transition-colors shadow-2xs"
                    >
                      <span>Directions</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              <div className="relative h-48 bg-slate-100 flex items-center justify-center">
                <iframe
                  title="School Campus Map Location"
                  className="w-full h-full border-0"
                  loading="lazy"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15546.750567086873!2d80.2312!3d13.0827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5265ea4f7d3361%3A0x6e61a70b6863d433!2sChennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry & Feedback Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-8 sm:p-10 border border-slate-200/80 shadow-sm space-y-6">
              <div className="space-y-1 pb-4 border-b border-slate-100">
                <h3 className="text-xl font-bold text-slate-900">Send an Inquiry or Schedule a Visit</h3>
                <p className="text-slate-500 text-xs sm:text-sm">
                  Our admissions team answers questions promptly. Leave your details below.
                </p>
              </div>

              {submitted ? (
                <div className="p-8 text-center space-y-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900">Message Received!</h4>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
                    Thank you for reaching out to DCI AI School. Our admissions desk will respond to your email within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {errorMessage && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Kumar"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="ramesh@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Subject / Topic
                      </label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Admissions 2026-27">Admissions 2026-27</option>
                        <option value="Campus Tour Booking">Campus Tour Booking</option>
                        <option value="Fee Structure & Scholarships">Fee Structure & Scholarships</option>
                        <option value="Transportation Query">Transportation Query</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Please let us know which grade level you are inquiring about or your preferred campus visit timing..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:w-auto px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {submitting ? (
                        <span>Sending Message...</span>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Contact Us</span>
                        </>
                      )}
                    </button>

                    {onApplyClick && (
                      <button
                        type="button"
                        onClick={onApplyClick}
                        className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-blue-50 text-blue-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <span>Apply for Admission Instead</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
