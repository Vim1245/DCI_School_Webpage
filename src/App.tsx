/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { WhyChooseUs } from './components/WhyChooseUs';
import { ProgramsSection } from './components/ProgramsSection';
import { FacilitiesSection } from './components/FacilitiesSection';
import { ActivitiesSection } from './components/ActivitiesSection';
import { NoticeBoard } from './components/NoticeBoard';
import { EventsSection } from './components/EventsSection';
import { GallerySection } from './components/GallerySection';
import { FacultySection } from './components/FacultySection';
import { AdmissionsCta } from './components/AdmissionsCta';
import { AdmissionForm } from './components/AdmissionForm';
import { StudentPortal } from './components/StudentPortal';
import { AdminPortal } from './components/AdminPortal';
import { ContactSection } from './components/ContactSection';
import { SupabaseGuideModal } from './components/SupabaseGuideModal';
import { AiAssistantDrawer } from './components/AiAssistantDrawer';
import { FloatingAiButton } from './components/FloatingAiButton';
import { Footer } from './components/Footer';
import { SupabaseConfigStatus } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [darkMode, setDarkMode] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseConfigStatus | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);

  // Fetch Supabase status on load
  const checkSupabaseStatus = async () => {
    try {
      const res = await fetch('/api/supabase/status');
      if (res.ok) {
        const data = await res.json();
        setSupabaseStatus(data);
      }
    } catch (err) {
      console.warn('Could not connect to /api/supabase/status:', err);
    }
  };

  useEffect(() => {
    checkSupabaseStatus();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${darkMode ? 'dark bg-[#0A0C10] text-[#E2E8F0]' : 'bg-slate-50 text-slate-900'}`}>
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        supabaseStatus={supabaseStatus}
        onOpenSupabaseGuide={() => setIsGuideOpen(true)}
        onOpenAiAssistant={() => setIsAiOpen(true)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Pending Supabase Schema Setup Notification Banner */}
      {supabaseStatus?.urlSet && !supabaseStatus?.configured && (
        <div className="bg-amber-500/10 border-b border-amber-500/25 text-amber-800 dark:text-amber-200 px-4 py-2.5 text-xs font-mono fixed top-[86px] sm:top-[74px] left-0 right-0 z-30 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>
                <strong>Supabase Connected:</strong> Project <code className="bg-amber-100 text-amber-900 px-1 py-0.5 rounded font-bold">{supabaseStatus.projectId || 'gbmkshrvjqdbklufjoli'}</code>. Run the SQL schema once to enable direct database storage for admissions & notices.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsGuideOpen(true)}
                className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded shadow text-xs transition-colors"
              >
                Copy SQL & Instructions
              </button>
              <button
                onClick={checkSupabaseStatus}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded border border-slate-300 text-xs transition-colors"
                title="Re-check database tables"
              >
                Re-check Tables 🔄
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {/* 1. Complete Home Page in Sequence */}
        {activeTab === 'home' && (
          <>
            <HeroSection
              onNavigate={setActiveTab}
              onOpenSupabaseGuide={() => setIsGuideOpen(true)}
              onOpenAiAssistant={() => setIsAiOpen(true)}
            />
            <AboutSection
              onLearnMore={() => setActiveTab('academics')}
              onApply={() => setActiveTab('admission')}
            />
            <WhyChooseUs
              onLearnMore={() => setActiveTab('facilities')}
            />
            <ProgramsSection onApply={() => setActiveTab('admission')} />
            <FacilitiesSection onTourRequest={() => setActiveTab('contact')} />
            <ActivitiesSection onApplyClick={() => setActiveTab('admission')} />
            <NoticeBoard supabaseStatus={supabaseStatus} />
            <EventsSection onContactClick={() => setActiveTab('contact')} />
            <GallerySection />
            <AdmissionsCta
              onApply={() => setActiveTab('admission')}
              onExplorePrograms={() => setActiveTab('academics')}
            />
            <ContactSection
              supabaseStatus={supabaseStatus}
              onApplyClick={() => setActiveTab('admission')}
            />
          </>
        )}

        {/* 2. Dedicated About Section */}
        {activeTab === 'about' && (
          <div className="pt-8">
            <AboutSection
              onLearnMore={() => setActiveTab('academics')}
              onApply={() => setActiveTab('admission')}
            />
            <WhyChooseUs onLearnMore={() => setActiveTab('facilities')} />
          </div>
        )}

        {/* 3. Dedicated Academics Module */}
        {(activeTab === 'academics' || activeTab === 'programs') && (
          <div className="pt-8">
            <ProgramsSection onApply={() => setActiveTab('admission')} />
          </div>
        )}

        {/* 4. Dedicated Facilities Module */}
        {activeTab === 'facilities' && (
          <div className="pt-8">
            <FacilitiesSection onTourRequest={() => setActiveTab('contact')} />
          </div>
        )}

        {/* 5. Dedicated Activities Module */}
        {activeTab === 'activities' && (
          <div className="pt-8">
            <ActivitiesSection onApplyClick={() => setActiveTab('admission')} />
          </div>
        )}

        {/* 6. Dedicated Notices Module */}
        {activeTab === 'notices' && (
          <div className="pt-8">
            <NoticeBoard supabaseStatus={supabaseStatus} />
          </div>
        )}

        {/* 7. Dedicated Faculty Module */}
        {activeTab === 'faculty' && (
          <div className="pt-8">
            <FacultySection supabaseStatus={supabaseStatus} />
          </div>
        )}

        {/* 8. Dedicated Admissions Module */}
        {activeTab === 'admission' && (
          <div className="pt-8">
            <AdmissionForm supabaseStatus={supabaseStatus} />
          </div>
        )}

        {/* 9. Dedicated Events Module */}
        {activeTab === 'events' && (
          <div className="pt-8">
            <EventsSection onContactClick={() => setActiveTab('contact')} />
          </div>
        )}

        {/* 10. Dedicated Gallery Module */}
        {activeTab === 'gallery' && (
          <div className="pt-8">
            <GallerySection />
          </div>
        )}

        {/* 11. Dedicated Contact Module */}
        {activeTab === 'contact' && (
          <div className="pt-8">
            <ContactSection
              supabaseStatus={supabaseStatus}
              onApplyClick={() => setActiveTab('admission')}
            />
          </div>
        )}

        {/* 12. Student & Parent Portal */}
        {activeTab === 'portal' && (
          <div className="pt-8">
            <StudentPortal />
          </div>
        )}

        {/* 13. School Admin & Admissions Management Desk */}
        {activeTab === 'admin' && (
          <div className="pt-8">
            <AdminPortal
              supabaseStatus={supabaseStatus}
              onNavigateHome={() => setActiveTab('home')}
            />
          </div>
        )}
      </main>

      {/* Floating 24/7 AI Concierge Button */}
      <FloatingAiButton
        onClick={() => setIsAiOpen(true)}
        isOpen={isAiOpen}
      />

      {/* Footer */}
      <Footer
        onNavigate={setActiveTab}
        onOpenSupabaseGuide={() => setIsGuideOpen(true)}
      />

      {/* Supabase Local Setup Guide Modal */}
      <SupabaseGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        supabaseStatus={supabaseStatus}
        onRefreshStatus={checkSupabaseStatus}
      />

      {/* AI Assistant Virtual Concierge Drawer */}
      <AiAssistantDrawer
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        onNavigate={setActiveTab}
      />
    </div>
  );
}
