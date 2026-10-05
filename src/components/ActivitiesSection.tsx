import React, { useState } from 'react';
import {
  Trophy,
  Sparkles,
  Users,
  Calendar,
  Clock,
  Compass,
  CheckCircle2,
  ArrowRight,
  Target,
  Palette,
  Music,
  Code,
  Globe,
  Award,
} from 'lucide-react';

interface ActivityClub {
  id: string;
  name: string;
  category: 'STEM & Tech' | 'Arts & Culture' | 'Sports & Fitness' | 'Leadership & Debate';
  description: string;
  schedule: string;
  leadTeacher: string;
  studentPres: string;
  achievements: string[];
  image: string;
}

const ACTIVITIES_DATA: ActivityClub[] = [
  {
    id: 'act-1',
    name: 'AI & Robotics Innovation Club',
    category: 'STEM & Tech',
    description: 'Hands-on exploration in building autonomous rovers, drone avionics, computer vision algorithms, and participating in the International Youth Robotics Olympiad.',
    schedule: 'Tuesdays & Thursdays, 3:30 PM - 5:00 PM',
    leadTeacher: 'Dr. Rajesh Sundaram (Ph.D. Robotics)',
    studentPres: 'Kavya Raman (Grade 11)',
    achievements: [
      'National AI Champions 2025 (1st Place)',
      '12 Patents filed for student assistive tech',
      'Autonomous Rover selected for Asia-Pacific Expo',
    ],
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'act-2',
    name: 'Model United Nations (MUN) & Debate Forum',
    category: 'Leadership & Debate',
    description: 'Fosters global diplomacy, geopolitical analysis, parliamentary procedure, and persuasive public rhetoric through regional and Harvard Model UN simulations.',
    schedule: 'Wednesdays, 3:45 PM - 5:15 PM',
    leadTeacher: 'Mrs. Ananya Sen (M.A. International Relations)',
    studentPres: 'Arjun Nambiar (Grade 12)',
    achievements: [
      'Best Delegation Award at Indian National MUN',
      'Over 45 individual gavels and citations in 2025',
      'Hosted 18 regional schools at DCI-MUN 2026',
    ],
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'act-3',
    name: 'Olympic Aquatic & Athletic Academy',
    category: 'Sports & Fitness',
    description: 'Professional NIS-certified coaching in competitive 50m swimming strokes, synthetic track athletics, badminton, and state-level basketball championships.',
    schedule: 'Daily, 6:30 AM - 7:45 AM & 4:00 PM - 5:30 PM',
    leadTeacher: 'Coach Vikram Rathore (National Swimmer)',
    studentPres: 'Rohan Mehta (Grade 11)',
    achievements: [
      'Gold Medals in State Inter-School Aquatic Meet',
      '4 Students selected for National Games Trials',
      'Under-17 Basketball Regional Champions',
    ],
    image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'act-4',
    name: 'Symphony & Classical Performing Arts',
    category: 'Arts & Culture',
    description: 'Acoustic orchestral training, Western instruments (Violin, Piano, Drums), Indian Carnatic & Hindustani vocal traditions, and semi-classical fusion choreography.',
    schedule: 'Mondays & Fridays, 3:30 PM - 5:00 PM',
    leadTeacher: 'Maestro David Abraham (Royal Academy Certified)',
    studentPres: 'Meera Krishnan (Grade 10)',
    achievements: [
      'Annual Winter Symphony featured on State Radio',
      'Distinction in Trinity College London Music Exams',
      '1st Prize in Regional Youth Philharmonic Festival',
    ],
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'act-5',
    name: 'Eco-Green Warriors & Sustainable Tech',
    category: 'Leadership & Debate',
    description: 'Oversees the 25-acre zero-waste school sanctuary, solar power monitoring, hydroponic organic gardens, and community e-waste recycling initiatives.',
    schedule: 'Saturdays, 9:30 AM - 11:30 AM',
    leadTeacher: 'Dr. Sunita Deshmukh (Environmental Sciences)',
    studentPres: 'Tarun Iyer (Grade 10)',
    achievements: [
      'Green School of Excellence Gold Standard 2025',
      '3,000+ native saplings planted in local biosphere',
      '100% campus rainwater harvesting efficiency',
    ],
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'act-6',
    name: 'Computational Coding & Web3 Society',
    category: 'STEM & Tech',
    description: 'Mastery in Python, React, competitive algorithmic coding (USACO / Codeforces), app development, and open-source civic technology contribution.',
    schedule: 'Mondays & Wednesdays, 4:00 PM - 5:30 PM',
    leadTeacher: 'Mr. Arvind Swamy (M.Tech Computer Science)',
    studentPres: 'Siddharth Patel (Grade 11)',
    achievements: [
      'Winners of Google Code-In Youth Hackathon',
      'Student-developed School App with 2,000+ active users',
      'Finalists in International Cyber Olympiad',
    ],
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
  },
];

interface ActivitiesSectionProps {
  onApplyClick?: () => void;
}

export const ActivitiesSection: React.FC<ActivitiesSectionProps> = ({ onApplyClick }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedClub, setSelectedClub] = useState<ActivityClub | null>(null);

  const categories = ['All', 'STEM & Tech', 'Leadership & Debate', 'Sports & Fitness', 'Arts & Culture'];

  const filteredClubs = selectedCategory === 'All'
    ? ACTIVITIES_DATA
    : ACTIVITIES_DATA.filter((club) => club.category === selectedCategory);

  return (
    <section id="activities" className="py-20 bg-slate-50/70 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5 text-blue-600" /> Beyond the Classroom
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Student Activities, Clubs & Societies
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Holistic growth is at the heart of DCI AI School. Through over 25 student-led societies, our learners build character, teamwork, and global perspective.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredClubs.map((club) => (
            <div
              key={club.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={club.image}
                    alt={club.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-blue-700 border border-slate-200/60 uppercase tracking-wider">
                    {club.category}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {club.name}
                    </h3>
                    <p className="text-slate-600 text-xs mt-2 leading-relaxed">
                      {club.description}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate">{club.schedule}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate">Mentor: {club.leadTeacher}</span>
                    </div>
                  </div>

                  {/* Top Achievements */}
                  <div className="space-y-1 pt-2">
                    <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      Recent Accolades:
                    </div>
                    {club.achievements.map((ach, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{ach}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => setSelectedClub(club)}
                  className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-blue-700 hover:text-blue-800 border border-slate-200 hover:border-blue-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>View Society Charter</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for Club Details */}
        {selectedClub && (
          <div
            className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedClub(null)}
          >
            <div
              className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-44">
                <img
                  src={selectedClub.image}
                  alt={selectedClub.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
                <div className="absolute bottom-4 left-6 right-6 text-white">
                  <span className="px-2 py-0.5 rounded bg-blue-600 text-[10px] font-bold uppercase">
                    {selectedClub.category}
                  </span>
                  <h3 className="text-xl font-bold mt-1 text-white">{selectedClub.name}</h3>
                </div>
              </div>

              <div className="p-6 space-y-4 text-xs text-slate-600">
                <p className="leading-relaxed">{selectedClub.description}</p>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div><strong>Meeting Schedule:</strong> {selectedClub.schedule}</div>
                  <div><strong>Faculty Coordinator:</strong> {selectedClub.leadTeacher}</div>
                  <div><strong>Student Representative:</strong> {selectedClub.studentPres}</div>
                </div>

                <div className="space-y-1.5">
                  <div className="font-bold text-slate-900 text-sm">Key Honors & Distinctions:</div>
                  {selectedClub.achievements.map((ach, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>{ach}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedClub(null)}
                    className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold"
                  >
                    Close
                  </button>
                  {onApplyClick && (
                    <button
                      onClick={() => {
                        setSelectedClub(null);
                        onApplyClick();
                      }}
                      className="px-4 py-2 rounded-lg bg-blue-600 text-white font-bold shadow-sm"
                    >
                      Apply for Admission
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
