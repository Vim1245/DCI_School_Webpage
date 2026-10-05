import express from 'express';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { INITIAL_NOTICES, ACADEMIC_PROGRAMS, FACULTY_MEMBERS, DEMO_STUDENT_RECORD, UPCOMING_EVENTS } from './src/data/mockData.js';

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// In-Memory Storage for Fallback Mode
let inMemoryNotices = [...INITIAL_NOTICES];
let inMemoryContacts: any[] = [];
let inMemoryAdmissions: any[] = [];
let inMemoryFaculty = [...FACULTY_MEMBERS];

// Default user-provided credentials
const DEFAULT_SUPABASE_URL = 'https://gbmkshrvjqdbklufjoli.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdibWtzaHJ2anFkYmtsdWZqb2xpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1ODU2MDEsImV4cCI6MjEwNjE2MTYwMX0.H7IJMFLCDaOb0RUDXNjbo60WESk46_OG1n_zR4EMecw';

// Helper to get Supabase Server Client
function getSupabaseServerClient() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

  if (url && key && url.startsWith('https://') && !url.includes('placeholder')) {
    try {
      return createClient(url, key);
    } catch (e) {
      console.error('Supabase client init error:', e);
    }
  }
  return null;
}

// -------------------------------------------------------------------
// API ROUTES
// -------------------------------------------------------------------

// 1. Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'DCI AI School Portal API',
    timestamp: new Date().toISOString(),
  });
});

// 2. Supabase Connection & Configuration Status
app.get('/api/supabase/status', async (req, res) => {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;
  const urlSet = Boolean(url && url.startsWith('https://'));
  const keySet = Boolean(key && key.length > 20);

  // Extract project ref (e.g. gbmkshrvjqdbklufjoli)
  const projectId = url ? url.replace(/^https?:\/\//, '').split('.')[0] : 'gbmkshrvjqdbklufjoli';

  const client = getSupabaseServerClient();
  let configured = false;
  let message = 'Supabase keys not detected in environment variables. Running in local fallback mode.';
  let errors: Record<string, string> = {};
  let tableCheck = {
    notices: false,
    contact_messages: false,
    admissions: false,
  };

  if (client) {
    try {
      // Check notices table
      const { data: nData, error: nError } = await client.from('notices').select('id').limit(1);
      if (!nError) {
        tableCheck.notices = true;
      } else {
        errors.notices = nError.message;
      }

      // Check contact_messages table
      const { data: cData, error: cError } = await client.from('contact_messages').select('id').limit(1);
      if (!cError) {
        tableCheck.contact_messages = true;
      } else {
        errors.contact_messages = cError.message;
      }

      // Check admissions table
      const { data: aData, error: aError } = await client.from('admissions').select('id').limit(1);
      if (!aError) {
        tableCheck.admissions = true;
      } else {
        errors.admissions = aError.message;
      }

      const missing = Object.entries(tableCheck)
        .filter(([_, exists]) => !exists)
        .map(([name]) => name);

      if (missing.length === 0) {
        configured = true;
        message = 'Connected live to Supabase! All 3 tables (notices, contact_messages, admissions) are accessible and storing data.';
      } else {
        configured = false;
        message = `Connected to Supabase project (${projectId}), but the SQL tables (${missing.join(', ')}) have not been created yet in your Supabase SQL Editor. Copy the SQL schema and run it in Supabase to start storing data!`;
      }
    } catch (err: any) {
      message = `Failed to connect to Supabase: ${err.message}`;
    }
  }

  const missingTables = Object.entries(tableCheck)
    .filter(([_, exists]) => !exists)
    .map(([name]) => name);

  res.json({
    configured,
    urlSet,
    keySet,
    projectId,
    tableCheck,
    missingTables,
    errors,
    message,
  });
});

// 3. GET Notices
app.get('/api/notices', async (req, res) => {
  const client = getSupabaseServerClient();

  if (client) {
    try {
      const { data, error } = await client
        .from('notices')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return res.json(data);
      } else if (error) {
        console.warn('Supabase fetch notices query notice:', error.message);
      }
    } catch (err) {
      console.warn('Falling back to in-memory notices due to error:', err);
    }
  }

  res.json(inMemoryNotices);
});

// 4. POST Notice
app.post('/api/notices', async (req, res) => {
  const { title, category, date, content, important, audience } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const client = getSupabaseServerClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('notices')
        .insert([
          {
            title,
            category: category || 'Academics',
            date: date || new Date().toISOString().split('T')[0],
            content,
            important: Boolean(important),
            audience: audience || 'All',
          },
        ])
        .select('*');

      if (!error && data && data[0]) {
        console.log('Successfully inserted notice into Supabase:', data[0].id);
        return res.status(201).json({
          ...data[0],
          supabaseSynced: true,
        });
      } else if (error) {
        console.error('Supabase notice insert error:', error.message, error.details, error.hint);
        const fallbackNotice = {
          id: 'n-' + Date.now(),
          title,
          category: category || 'Academics',
          date: date || new Date().toISOString().split('T')[0],
          content,
          important: Boolean(important),
          audience: audience || 'All',
          created_at: new Date().toISOString(),
          supabaseSynced: false,
          needsSchema: error.code === 'PGRST205',
          notice: error.code === 'PGRST205'
            ? 'Saved to local server! Note: Supabase table "notices" does not exist yet. Please run the SQL schema in Supabase SQL editor.'
            : undefined,
        };
        inMemoryNotices.unshift(fallbackNotice);
        return res.status(201).json(fallbackNotice);
      }
    } catch (err: any) {
      console.warn('Failed to insert into Supabase notices:', err.message);
    }
  }

  const fallbackNotice = {
    id: 'n-' + Date.now(),
    title,
    category: category || 'Academics',
    date: date || new Date().toISOString().split('T')[0],
    content,
    important: Boolean(important),
    audience: audience || 'All',
    created_at: new Date().toISOString(),
    supabaseSynced: false,
  };

  inMemoryNotices.unshift(fallbackNotice);
  res.status(201).json(fallbackNotice);
});

// 4b. DELETE Notice
app.delete('/api/notices/:id', async (req, res) => {
  const { id } = req.params;
  const client = getSupabaseServerClient();
  if (client) {
    try {
      await client.from('notices').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase delete notice error:', err);
    }
  }
  inMemoryNotices = inMemoryNotices.filter((n) => n.id !== id);
  res.json({ success: true, id });
});

// 4c. GET Contact Inquiries (for Admin)
app.get('/api/contact', async (req, res) => {
  const client = getSupabaseServerClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        return res.json(data);
      }
    } catch (err) {
      console.warn('Supabase fetch contact messages error:', err);
    }
  }
  res.json(inMemoryContacts);
});

// 5. POST Contact Inquiry
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  const client = getSupabaseServerClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('contact_messages')
        .insert([
          {
            name,
            email,
            phone: phone || '',
            subject: subject || 'General Inquiry',
            message,
          },
        ])
        .select('*');

      let insertRes = await client
        .from('contact_messages')
        .insert([
          {
            name,
            email,
            phone: phone || '',
            subject: subject || 'General Inquiry',
            message,
          },
        ])
        .select('*');

      if (insertRes.error && insertRes.error.code === '42501') {
        insertRes = await client
          .from('contact_messages')
          .insert([
            {
              name,
              email,
              phone: phone || '',
              subject: subject || 'General Inquiry',
              message,
            },
          ]);
      }

      if (!insertRes.error) {
        console.log('Successfully inserted contact message into Supabase');
        return res.status(201).json({
          success: true,
          message: 'Thank you! Your message has been saved to your Supabase database.',
          data: insertRes.data && insertRes.data[0] ? insertRes.data[0] : { id: 'c-' + Date.now() },
          supabaseSynced: true,
        });
      } else {
        console.error('Supabase contact message insert error:', insertRes.error.message);
        return res.status(500).json({
          success: false,
          error: `Database insert failed: ${insertRes.error.message}`,
          supabaseSynced: false,
        });
      }
    } catch (err: any) {
      console.warn('Failed to insert contact message into Supabase:', err.message);
      return res.status(500).json({
        success: false,
        error: `Database connection error: ${err.message}`,
        supabaseSynced: false,
      });
    }
  }

  return res.status(500).json({
    success: false,
    error: 'Database connection is not configured.',
    supabaseSynced: false,
  });
});

// 6. POST Admission Application
app.post('/api/admissions', async (req, res) => {
  const { studentName, dob, gradeApplying, parentName, email, phone, address } = req.body;

  if (!studentName || !gradeApplying || !parentName || !email || !phone) {
    return res.status(400).json({ error: 'Please fill in all required admission fields.' });
  }

  const client = getSupabaseServerClient();
  if (client) {
    try {
      const admissionRow = {
        student_name: studentName,
        dob: dob || new Date().toISOString().split('T')[0],
        grade_applying: gradeApplying,
        parent_name: parentName,
        email: email,
        phone: phone,
        address: address || '',
        status: 'Pending',
      };

      // Try insert with select; if select fails or RLS restricts select for public clients, retry pure insert
      let insertResult = await client
        .from('admissions')
        .insert([admissionRow])
        .select('id');

      if (insertResult.error) {
        console.warn('Initial insert+select error, attempting pure insert:', insertResult.error.message);
        insertResult = await client
          .from('admissions')
          .insert([admissionRow]);
      }

      if (!insertResult.error) {
        const appId = insertResult.data && insertResult.data[0]?.id
          ? insertResult.data[0].id
          : 'ADM-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000);
        console.log('Successfully inserted admission into Supabase:', appId);
        return res.status(201).json({
          success: true,
          applicationNumber: appId,
          message: 'Application submitted successfully & saved to your Supabase Admissions table!',
          data: { id: appId, ...admissionRow },
          supabaseSynced: true,
        });
      } else {
        console.error('Supabase admission insert error:', insertResult.error.message, insertResult.error.details);
        return res.status(500).json({
          success: false,
          error: `Database insert failed: ${insertResult.error.message}`,
          details: insertResult.error.details || insertResult.error.hint,
          code: insertResult.error.code,
          supabaseSynced: false,
        });
      }
    } catch (err: any) {
      console.error('Failed to insert admission into Supabase:', err.message);
      return res.status(500).json({
        success: false,
        error: `Database connection error: ${err.message}`,
        supabaseSynced: false,
      });
    }
  }

  return res.status(500).json({
    success: false,
    error: 'Database client not initialized. Please verify database connection.',
    supabaseSynced: false,
  });
});

// 6b. GET Admissions List (for Admin Dashboard)
app.get('/api/admissions', async (req, res) => {
  const client = getSupabaseServerClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('admissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        return res.json(data);
      }
    } catch (err: any) {
      console.warn('Supabase fetch admissions error:', err.message);
    }
  }
  res.json(inMemoryAdmissions);
});

// 6c. UPDATE Admission Status (for Admin Dashboard)
const handleUpdateAdmissionStatus = async (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const client = getSupabaseServerClient();
  if (client) {
    try {
      await client.from('admissions').update({ status }).eq('id', id);
    } catch (err: any) {
      console.warn('Supabase update admission error:', err.message);
    }
  }

  const appRecord = inMemoryAdmissions.find((a) => a.id === id);
  if (appRecord) {
    appRecord.status = status;
  }

  res.json({ success: true, id, status });
};

app.patch('/api/admissions/:id', handleUpdateAdmissionStatus);
app.put('/api/admissions/:id', handleUpdateAdmissionStatus);

// 6d. GET Events
app.get('/api/events', (req, res) => {
  res.json(UPCOMING_EVENTS);
});

// 7. GET Academic Programs & Faculty (Convenience endpoints)
app.get('/api/programs', (req, res) => {
  res.json(ACADEMIC_PROGRAMS);
});

app.get('/api/faculty', async (req, res) => {
  const client = getSupabaseServerClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('faculty')
        .select('*')
        .order('name', { ascending: true });

      if (!error && data && data.length > 0) {
        const mapped = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          role: item.role,
          department: item.department,
          qualification: item.qualification,
          experience: item.experience,
          image: item.image_url || item.image || '',
          email: item.email || '',
          bio: item.bio || '',
        }));

        // Synchronize in-memory cache with all DB records
        mapped.forEach((dbItem: any) => {
          const idx = inMemoryFaculty.findIndex((f) => f.id === dbItem.id);
          if (idx !== -1) {
            inMemoryFaculty[idx] = { ...dbItem, ...inMemoryFaculty[idx] };
          } else {
            inMemoryFaculty.push(dbItem);
          }
        });

        const merged = mapped;

        return res.json(merged);
      }
    } catch (err: any) {
      console.warn('Failed to fetch from Supabase faculty:', err.message);
    }
  }

  res.json(inMemoryFaculty);
});

// Update existing faculty member
const handleUpdateFaculty = async (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  const { name, role, department, qualification, experience, image, email, bio } = req.body;

  // Validation
  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Faculty name is required.' });
  }
  if (!role || typeof role !== 'string' || !role.trim()) {
    return res.status(400).json({ error: 'Role / Designation is required.' });
  }
  if (!department || typeof department !== 'string' || !department.trim()) {
    return res.status(400).json({ error: 'Department is required.' });
  }
  if (!qualification || typeof qualification !== 'string' || !qualification.trim()) {
    return res.status(400).json({ error: 'Qualification is required.' });
  }
  if (!experience || typeof experience !== 'string' || !experience.trim()) {
    return res.status(400).json({ error: 'Experience is required.' });
  }
  if (!bio || typeof bio !== 'string' || !bio.trim()) {
    return res.status(400).json({ error: 'Biography is required.' });
  }
  if (email && typeof email === 'string' && email.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
  }

  const updatedPayload = {
    id,
    name: name.trim(),
    role: role.trim(),
    department: department.trim(),
    qualification: qualification.trim(),
    experience: experience.trim(),
    image: typeof image === 'string' ? image.trim() : (image || ''),
    email: email && typeof email === 'string' ? email.trim() : '',
    bio: bio.trim(),
  };

  const client = getSupabaseServerClient();
  const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  let supabaseSynced = false;
  let supabaseData: any = null;

  if (client && isValidUUID) {
    try {
      const { data, error } = await client
        .from('faculty')
        .update({
          name: updatedPayload.name,
          role: updatedPayload.role,
          department: updatedPayload.department,
          qualification: updatedPayload.qualification,
          experience: updatedPayload.experience,
          image_url: updatedPayload.image,
          email: updatedPayload.email || null,
          bio: updatedPayload.bio,
        })
        .eq('id', id)
        .select('*');

      if (!error && data && data.length > 0) {
        supabaseSynced = true;
        const item = data[0];
        supabaseData = {
          id: item.id,
          name: item.name,
          role: item.role,
          department: item.department,
          qualification: item.qualification,
          experience: item.experience,
          image: item.image_url || item.image || updatedPayload.image,
          email: item.email || '',
          bio: item.bio || '',
          supabaseSynced: true,
        };
      } else if (error) {
        console.warn('Supabase faculty update error:', error.message);
      }
    } catch (err: any) {
      console.warn('Failed to update faculty in Supabase:', err.message);
    }
  }

  const finalRecord = supabaseData || {
    ...updatedPayload,
    supabaseSynced,
  };

  // Update in inMemoryFaculty
  const index = inMemoryFaculty.findIndex((f) => f.id === id);
  if (index !== -1) {
    inMemoryFaculty[index] = finalRecord;
  } else {
    inMemoryFaculty.push(finalRecord);
  }

  return res.json({
    success: true,
    message: supabaseSynced
      ? 'Faculty details updated and saved to Supabase database!'
      : 'Faculty details updated successfully!',
    data: finalRecord,
  });
};

app.put('/api/faculty/:id', handleUpdateFaculty);
app.patch('/api/faculty/:id', handleUpdateFaculty);

app.get('/api/student-portal/demo', (req, res) => {
  res.json(DEMO_STUDENT_RECORD);
});

// 8. Gemini AI School Assistant Endpoint
app.post('/api/ai/assistant', async (req, res) => {
  const { message, conversationHistory, userLocation } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GEMINI_KEY ||
    process.env.VITE_GEMINI_API_KEY ||
    process.env.GOOGLE_GENAI_API_KEY;

  // School location coordinates: 13.0827, 80.2707
  let locationContext = '';
  if (userLocation && typeof userLocation.lat === 'number' && typeof userLocation.lng === 'number') {
    const R = 6371;
    const dLat = ((13.0827 - userLocation.lat) * Math.PI) / 180;
    const dLon = ((80.2707 - userLocation.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((userLocation.lat * Math.PI) / 180) *
        Math.cos((13.0827 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distKm = Math.round(R * c * 10) / 10;
    locationContext = `\nUser's detected geographic coordinates: (${userLocation.lat}, ${userLocation.lng}). They are approximately ${distKm} km from DCI AI School campus (~${Math.round(distKm * 2.2)} minutes driving time). If asked about distance, transit, bus routes or directions, reference this distance.`;
  }

  // Intelligent domain knowledge response generator (used if API key is not configured or all Gemini model calls fail)
  const getDomainResponse = (msg: string) => {
    const q = msg.toLowerCase();
    if (q.includes('fee') || q.includes('cost') || q.includes('tuition') || q.includes('charge')) {
      return (
        "Here is the Annual Fee Structure for DCI AI School (Academic Session 2026-2027):\n\n" +
        "• Early Years (Pre-K to KG): $4,500 / year (Inclusive of activity kits & snacks)\n" +
        "• Primary School (Grades 1 to 5): $6,200 / year (Includes STEM robotics & sports)\n" +
        "• Middle School (Grades 6 to 8): $7,800 / year (Includes science labs & coding)\n" +
        "• High School (Grades 9 & 10): $9,500 / year (Board exam prep & advanced labs)\n" +
        "• Senior Secondary (Grades 11 & 12): $10,800 / year (SAT/JEE/NEET mentorship)\n\n" +
        "Scholarships: Merit scholarships (up to 40% fee waiver) and sports excellence grants are available. You can apply directly through the Admissions tab."
      );
    }
    if (q.includes('admission') || q.includes('apply') || q.includes('register') || q.includes('process') || q.includes('deadline')) {
      return (
        "Admissions for Session 2026-2027 are officially open at DCI AI School:\n\n" +
        "1. Complete the Online Application Form under the 'Admissions' menu.\n" +
        "2. Required documents: Child's Birth Certificate, Previous Academic Transcripts, and Passport Photos.\n" +
        "3. Admissions office evaluates applications within 24-48 business hours.\n" +
        "4. Friendly interaction & campus walkthrough scheduled with academic counselors.\n\n" +
        "Need immediate assistance? Contact admissions@dci-school.edu or call +1 (800) 555-DCI-AI."
      );
    }
    if (q.includes('distance') || q.includes('location') || q.includes('where') || q.includes('reach') || q.includes('directions')) {
      return (
        `DCI AI School is located at 100 Academy Boulevard, Innovation City, 600001 (Coordinates: 13.0827° N, 80.2707° E).\n\n` +
        (locationContext ? `${locationContext}\n\n` : '') +
        `• GPS AC Buses cover 35+ prime city routes with live parent tracking.\n` +
        `• You can use the 'Use My Current Location' tool in the Contact section to get turn-by-turn driving directions in Google Maps!`
      );
    }
    if (q.includes('curriculum') || q.includes('cbse') || q.includes('ib') || q.includes('academic') || q.includes('subject') || q.includes('stream')) {
      return (
        "DCI AI School provides an integrated global academic continuum:\n\n" +
        "• CBSE Board Curriculum: Recognized national excellence with 100% board pass rates.\n" +
        "• IB World School Candidate: Inquiry-led Primary & Middle Years frameworks.\n" +
        "• Senior Streams (Grades 11 & 12): AI & Computer Science STEM, Commerce, and Humanities with integrated Olympiad & university preparation.\n" +
        "• Digital 1:1 Learning: Interactive smart panels and personalized learning analytics."
      );
    }
    if (q.includes('facility') || q.includes('facilities') || q.includes('lab') || q.includes('robot') || q.includes('sport') || q.includes('pool')) {
      return (
        "Our 25-Acre Smart Eco-Campus features world-class infrastructure:\n\n" +
        "• AI & Robotics Hub: 3D printing, Arduino, humanoid simulators, and GPU workstations.\n" +
        "• Olympic Aquatic Complex: Heated 50-meter 8-lane competition swimming pool.\n" +
        "• Science Labs: Dedicated Physics, Chemistry, and Biotechnology research facilities.\n" +
        "• Central Library: Over 30,000 titles, e-readers, and digital research subscriptions.\n" +
        "• Performing Arts: Acoustic orchestral studios and Indian classical dance amphitheater."
      );
    }
    return (
      "Welcome to DCI AI School! I am your AI Virtual Concierge.\n\n" +
      "• Admissions: Open for 2026-2027 Academic Session (Pre-K to Grade 12).\n" +
      "• Curriculum: CBSE & IB World School Candidate.\n" +
      "• Campus: 25-acre modern facility with AI labs, Olympic pool, and 35+ bus routes.\n" +
      "• Office Hours: Mon - Fri: 8:00 AM - 3:30 PM, Sat: 9:00 AM - 1:00 PM.\n" +
      "• Contact: admissions@dci-school.edu | +1 (800) 555-DCI-AI.\n\n" +
      "How can I help you today? Feel free to ask about fees, admissions, curriculum, or campus tours!"
    );
  };

  if (!apiKey) {
    console.warn('GEMINI_API_KEY not configured on server, using domain engine.');
    return res.json({ reply: getDomainResponse(message) });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemPrompt = `You are the friendly, professional, and knowledgeable AI Virtual Concierge for "DCI AI School".
Your goal is to assist parents, students, and prospective applicants with clear, warm, and structured information about the school.

School Details:
- Name: DCI AI School
- Motto: "Empowering Students. Inspiring Futures."
- Affiliations: CBSE, IB World School Candidate & Cambridge Assessment
- Grades: Pre-K to Grade 12 (Early Years, Primary, Middle, Secondary, Higher Secondary)
- Campus Features: 25-acre modern green eco-campus, STEM & AI Robotics Hub, Olympic 50m Swimming Pool, Performing Arts Auditorium, 100% Board Exam Pass Rate.
- Admissions: Open for 2026-2027 session. Online application form is available directly on this portal.
- Fee Structure: Pre-K ($4,500/yr), Primary ($6,200/yr), Middle ($7,800/yr), High School ($9,500/yr), Higher Sec ($10,800/yr). Scholarships available for merit and sports.
- Transport: GPS-tracked AC buses covering 35+ city routes with parent notification app.
- Timings: Monday to Friday: 8:00 AM - 3:30 PM, Saturday: 9:00 AM - 1:00 PM.
- Address: 100 Academy Boulevard, Innovation City, 600001 (Coordinates: 13.0827° N, 80.2707° E).
${locationContext}

Be polite, helpful, concise, well-formatted with bullet points where appropriate, and encourage parents to submit the online admission form or schedule a campus visit.`;

    let historyText = '';
    if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      const recent = conversationHistory.slice(-8);
      historyText = recent
        .map((m: any) => `${m.sender === 'user' ? 'User' : 'Assistant'}: ${m.text}`)
        .join('\n');
    }

    const fullPrompt = `${systemPrompt}\n\n${historyText ? `Previous Conversation:\n${historyText}\n\n` : ''}User Question: ${message}\n\nAssistant Response:`;

    // Multi-model failover strategy: gemini-3.1-flash-lite, gemini-3.5-flash, gemini-3.8-flash, gemini-flash-latest
    const candidateModels = ['gemini-3.1-flash-lite', 'gemini-3.5-flash', 'gemini-3.8-flash', 'gemini-flash-latest'];
    let generatedText = '';
    let lastError: any = null;

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: fullPrompt,
        });
        if (response && response.text) {
          generatedText = response.text;
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${model} attempt failed (${err.status || err.message}). Trying next candidate...`);
      }
    }

    if (generatedText) {
      return res.json({ reply: generatedText });
    }

    console.warn('All Gemini model candidates failed, using domain response fallback:', lastError?.message);
    return res.json({ reply: getDomainResponse(message) });
  } catch (error: any) {
    console.error('Gemini server execution error:', error);
    return res.json({ reply: getDomainResponse(message) });
  }
});

// -------------------------------------------------------------------
// VITE DEV SERVER / PRODUCTION STATIC SERVING
// -------------------------------------------------------------------
async function startServer() {
  const isDev = process.env.npm_lifecycle_event === 'dev' || process.env.NODE_ENV === 'development';
  const distPath = path.join(process.cwd(), 'dist');
  const distExists = fs.existsSync(distPath) && fs.existsSync(path.join(distPath, 'index.html'));

  if (isDev && !process.env.FORCE_PROD) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else if (distExists) {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening at http://0.0.0.0:${PORT}`);
  });
}

startServer();
