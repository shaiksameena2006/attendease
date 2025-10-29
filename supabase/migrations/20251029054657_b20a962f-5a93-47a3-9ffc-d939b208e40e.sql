-- ============================================
-- CORE SCHEMA FOR ATTENDEASE FEATURES
-- ============================================

-- ============================================
-- HOUSES & CLUBS SYSTEM
-- ============================================

-- Houses table (Red, Blue, Green, Orange)
CREATE TABLE public.houses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  color TEXT NOT NULL,
  description TEXT,
  total_points INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Clubs table
CREATE TABLE public.clubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  faculty_coordinator UUID REFERENCES auth.users(id),
  image_url TEXT,
  category TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Club memberships
CREATE TABLE public.club_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  club_id UUID REFERENCES public.clubs(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  role TEXT DEFAULT 'member',
  UNIQUE(user_id, club_id)
);

-- House memberships
CREATE TABLE public.house_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  house_id UUID REFERENCES public.houses(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- House points tracking
CREATE TABLE public.house_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  house_id UUID REFERENCES public.houses(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  points INTEGER NOT NULL,
  reason TEXT NOT NULL,
  awarded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- ACADEMIC SYSTEM (Subjects, Classes, Rooms)
-- ============================================

-- Subjects/Courses
CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  credits INTEGER,
  department TEXT,
  semester INTEGER,
  year INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Rooms
CREATE TABLE public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_number TEXT NOT NULL UNIQUE,
  building TEXT,
  capacity INTEGER,
  room_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Classes (specific instances of subjects taught by faculty)
CREATE TABLE public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
  faculty_id UUID REFERENCES auth.users(id) NOT NULL,
  section TEXT,
  semester INTEGER NOT NULL,
  year INTEGER NOT NULL,
  academic_year TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Student enrollments in classes
CREATE TABLE public.class_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(class_id, student_id)
);

-- ============================================
-- TIMETABLE SYSTEM
-- ============================================

-- Timetable entries
CREATE TABLE public.timetable_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  room_id UUID REFERENCES public.rooms(id),
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- ============================================
-- ATTENDANCE SYSTEM
-- ============================================

-- Attendance sessions (for each class meeting)
CREATE TABLE public.attendance_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  timetable_entry_id UUID REFERENCES public.timetable_entries(id),
  session_date DATE NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'open',
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Individual attendance records
CREATE TABLE public.attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.attendance_sessions(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'present',
  marked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  marked_by UUID REFERENCES auth.users(id),
  verification_method TEXT,
  face_verified BOOLEAN DEFAULT false,
  proximity_verified BOOLEAN DEFAULT false,
  UNIQUE(session_id, student_id)
);

-- ============================================
-- EVENTS SYSTEM
-- ============================================

-- Events
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT,
  category TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  location TEXT,
  image_url TEXT,
  capacity INTEGER,
  is_published BOOLEAN NOT NULL DEFAULT false,
  requires_registration BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  club_id UUID REFERENCES public.clubs(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Event registrations
CREATE TABLE public.event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'registered',
  registered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- Event attendance
CREATE TABLE public.event_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  checked_in_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- ============================================
-- CERTIFICATES SYSTEM
-- ============================================

-- Certificate templates
CREATE TABLE public.certificate_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  template_type TEXT NOT NULL,
  template_data JSONB,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Certificates
CREATE TABLE public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  issued_by UUID REFERENCES auth.users(id) NOT NULL,
  template_id UUID REFERENCES public.certificate_templates(id),
  certificate_url TEXT,
  qr_code TEXT NOT NULL UNIQUE,
  event_id UUID REFERENCES public.events(id),
  verification_status TEXT NOT NULL DEFAULT 'pending',
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- TRANSPORT SYSTEM
-- ============================================

-- Bus routes
CREATE TABLE public.bus_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_number TEXT NOT NULL UNIQUE,
  route_name TEXT NOT NULL,
  description TEXT,
  stops JSONB,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Buses
CREATE TABLE public.buses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bus_number TEXT NOT NULL UNIQUE,
  registration_number TEXT,
  capacity INTEGER NOT NULL,
  route_id UUID REFERENCES public.bus_routes(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Bus drivers
CREATE TABLE public.bus_drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  license_number TEXT NOT NULL UNIQUE,
  phone TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Bus passes
CREATE TABLE public.bus_passes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  route_id UUID REFERENCES public.bus_routes(id) NOT NULL,
  pass_number TEXT NOT NULL UNIQUE,
  qr_code TEXT NOT NULL UNIQUE,
  valid_from DATE NOT NULL,
  valid_until DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Bus tracking (real-time location)
CREATE TABLE public.bus_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bus_id UUID REFERENCES public.buses(id) ON DELETE CASCADE NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  speed DECIMAL(5, 2),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- MESSAGING SYSTEM
-- ============================================

-- Conversations
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_type TEXT NOT NULL DEFAULT 'direct',
  title TEXT,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Conversation participants
CREATE TABLE public.conversation_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_read_at TIMESTAMPTZ,
  UNIQUE(conversation_id, user_id)
);

-- Messages
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text',
  attachment_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- CO-PO MANAGEMENT SYSTEM
-- ============================================

-- Course Outcomes
CREATE TABLE public.course_outcomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
  outcome_code TEXT NOT NULL,
  description TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(subject_id, outcome_code)
);

-- Program Outcomes
CREATE TABLE public.program_outcomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  outcome_code TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  department TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- CO-PO Mappings
CREATE TABLE public.co_po_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_outcome_id UUID REFERENCES public.course_outcomes(id) ON DELETE CASCADE NOT NULL,
  program_outcome_id UUID REFERENCES public.program_outcomes(id) ON DELETE CASCADE NOT NULL,
  correlation_level INTEGER CHECK (correlation_level BETWEEN 1 AND 3),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(course_outcome_id, program_outcome_id)
);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.houses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.house_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.house_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificate_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bus_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bus_drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bus_passes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bus_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.co_po_mappings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES - HOUSES & CLUBS
-- ============================================

-- Houses (everyone can view)
CREATE POLICY "Everyone can view houses" ON public.houses FOR SELECT USING (true);
CREATE POLICY "Faculty and admin can manage houses" ON public.houses FOR ALL USING (public.has_role(auth.uid(), 'faculty') OR public.has_role(auth.uid(), 'admin'));

-- Clubs (everyone can view)
CREATE POLICY "Everyone can view active clubs" ON public.clubs FOR SELECT USING (is_active = true OR public.has_role(auth.uid(), 'faculty') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Faculty and admin can manage clubs" ON public.clubs FOR ALL USING (public.has_role(auth.uid(), 'faculty') OR public.has_role(auth.uid(), 'admin'));

-- Club memberships
CREATE POLICY "Users can view club memberships" ON public.club_memberships FOR SELECT USING (true);
CREATE POLICY "Users can join clubs" ON public.club_memberships FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave clubs" ON public.club_memberships FOR DELETE USING (auth.uid() = user_id);

-- House memberships
CREATE POLICY "Everyone can view house memberships" ON public.house_memberships FOR SELECT USING (true);
CREATE POLICY "Students can join houses" ON public.house_memberships FOR INSERT WITH CHECK (auth.uid() = user_id AND public.has_role(auth.uid(), 'student'));
CREATE POLICY "Admin can manage house memberships" ON public.house_memberships FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- House points
CREATE POLICY "Everyone can view house points" ON public.house_points FOR SELECT USING (true);
CREATE POLICY "Faculty and admin can award points" ON public.house_points FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'faculty') OR public.has_role(auth.uid(), 'admin'));

-- ============================================
-- RLS POLICIES - ACADEMIC
-- ============================================

-- Subjects
CREATE POLICY "Everyone can view subjects" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Faculty and admin can manage subjects" ON public.subjects FOR ALL USING (public.has_role(auth.uid(), 'faculty') OR public.has_role(auth.uid(), 'admin'));

-- Rooms
CREATE POLICY "Everyone can view rooms" ON public.rooms FOR SELECT USING (true);
CREATE POLICY "Admin can manage rooms" ON public.rooms FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Classes
CREATE POLICY "Students can view their enrolled classes" ON public.classes FOR SELECT USING (
  public.has_role(auth.uid(), 'student') AND EXISTS (
    SELECT 1 FROM public.class_enrollments WHERE class_id = classes.id AND student_id = auth.uid()
  )
);
CREATE POLICY "Faculty can view and manage their classes" ON public.classes FOR ALL USING (faculty_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Class enrollments
CREATE POLICY "Students can view their enrollments" ON public.class_enrollments FOR SELECT USING (student_id = auth.uid() OR public.has_role(auth.uid(), 'faculty') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Faculty and admin can manage enrollments" ON public.class_enrollments FOR ALL USING (public.has_role(auth.uid(), 'faculty') OR public.has_role(auth.uid(), 'admin'));

-- ============================================
-- RLS POLICIES - TIMETABLE
-- ============================================

CREATE POLICY "Students can view timetable for enrolled classes" ON public.timetable_entries FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.class_enrollments WHERE class_id = timetable_entries.class_id AND student_id = auth.uid())
  OR public.has_role(auth.uid(), 'faculty')
  OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Faculty and admin can manage timetable" ON public.timetable_entries FOR ALL USING (public.has_role(auth.uid(), 'faculty') OR public.has_role(auth.uid(), 'admin'));

-- ============================================
-- RLS POLICIES - ATTENDANCE
-- ============================================

CREATE POLICY "Students can view their attendance sessions" ON public.attendance_sessions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.class_enrollments WHERE class_id = attendance_sessions.class_id AND student_id = auth.uid())
  OR public.has_role(auth.uid(), 'faculty')
  OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Faculty can manage attendance sessions" ON public.attendance_sessions FOR ALL USING (public.has_role(auth.uid(), 'faculty') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Students can view their attendance records" ON public.attendance_records FOR SELECT USING (
  student_id = auth.uid() OR public.has_role(auth.uid(), 'faculty') OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Students can mark their own attendance" ON public.attendance_records FOR INSERT WITH CHECK (student_id = auth.uid());
CREATE POLICY "Faculty can manage attendance records" ON public.attendance_records FOR ALL USING (public.has_role(auth.uid(), 'faculty') OR public.has_role(auth.uid(), 'admin'));

-- ============================================
-- RLS POLICIES - EVENTS
-- ============================================

CREATE POLICY "Everyone can view published events" ON public.events FOR SELECT USING (is_published = true OR public.has_role(auth.uid(), 'faculty') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Faculty and admin can manage events" ON public.events FOR ALL USING (public.has_role(auth.uid(), 'faculty') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view event registrations" ON public.event_registrations FOR SELECT USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'faculty') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can register for events" ON public.event_registrations FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can cancel their registrations" ON public.event_registrations FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Users can view event attendance" ON public.event_attendance FOR SELECT USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'faculty') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Faculty can mark event attendance" ON public.event_attendance FOR ALL USING (public.has_role(auth.uid(), 'faculty') OR public.has_role(auth.uid(), 'admin'));

-- ============================================
-- RLS POLICIES - CERTIFICATES
-- ============================================

CREATE POLICY "Faculty and admin can view certificate templates" ON public.certificate_templates FOR SELECT USING (public.has_role(auth.uid(), 'faculty') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Faculty and admin can manage certificate templates" ON public.certificate_templates FOR ALL USING (public.has_role(auth.uid(), 'faculty') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own certificates" ON public.certificates FOR SELECT USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'faculty') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Faculty can issue certificates" ON public.certificates FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'faculty') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can approve certificates" ON public.certificates FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- RLS POLICIES - TRANSPORT
-- ============================================

CREATE POLICY "Everyone can view bus routes" ON public.bus_routes FOR SELECT USING (is_active = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can manage bus routes" ON public.bus_routes FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Everyone can view buses" ON public.buses FOR SELECT USING (is_active = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can manage buses" ON public.buses FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can manage bus drivers" ON public.bus_drivers FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can view bus drivers" ON public.bus_drivers FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own bus passes" ON public.bus_passes FOR SELECT USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can manage bus passes" ON public.bus_passes FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Everyone can view bus tracking" ON public.bus_tracking FOR SELECT USING (true);
CREATE POLICY "Admin can manage bus tracking" ON public.bus_tracking FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- RLS POLICIES - MESSAGING
-- ============================================

CREATE POLICY "Users can view conversations they're part of" ON public.conversations FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = conversations.id AND user_id = auth.uid())
);
CREATE POLICY "Users can create conversations" ON public.conversations FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can view their conversation participations" ON public.conversation_participants FOR SELECT USING (
  user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.conversation_participants cp WHERE cp.conversation_id = conversation_participants.conversation_id AND cp.user_id = auth.uid())
);
CREATE POLICY "Users can add participants to their conversations" ON public.conversation_participants FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.conversations WHERE id = conversation_id AND created_by = auth.uid())
);

CREATE POLICY "Users can view messages in their conversations" ON public.messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = messages.conversation_id AND user_id = auth.uid())
);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (
  sender_id = auth.uid() AND EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = messages.conversation_id AND user_id = auth.uid())
);

-- ============================================
-- RLS POLICIES - CO-PO MANAGEMENT
-- ============================================

CREATE POLICY "Faculty can view course outcomes" ON public.course_outcomes FOR SELECT USING (public.has_role(auth.uid(), 'faculty') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Faculty can manage course outcomes" ON public.course_outcomes FOR ALL USING (public.has_role(auth.uid(), 'faculty') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Faculty can view program outcomes" ON public.program_outcomes FOR SELECT USING (public.has_role(auth.uid(), 'faculty') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can manage program outcomes" ON public.program_outcomes FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Faculty can view CO-PO mappings" ON public.co_po_mappings FOR SELECT USING (public.has_role(auth.uid(), 'faculty') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Faculty can manage CO-PO mappings" ON public.co_po_mappings FOR ALL USING (public.has_role(auth.uid(), 'faculty') OR public.has_role(auth.uid(), 'admin'));

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

CREATE TRIGGER update_houses_updated_at BEFORE UPDATE ON public.houses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_clubs_updated_at BEFORE UPDATE ON public.clubs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON public.subjects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON public.classes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_timetable_entries_updated_at BEFORE UPDATE ON public.timetable_entries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_attendance_sessions_updated_at BEFORE UPDATE ON public.attendance_sessions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_certificate_templates_updated_at BEFORE UPDATE ON public.certificate_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bus_routes_updated_at BEFORE UPDATE ON public.bus_routes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_buses_updated_at BEFORE UPDATE ON public.buses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bus_passes_updated_at BEFORE UPDATE ON public.bus_passes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON public.conversations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON public.messages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_course_outcomes_updated_at BEFORE UPDATE ON public.course_outcomes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_program_outcomes_updated_at BEFORE UPDATE ON public.program_outcomes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- INITIAL DATA - HOUSES
-- ============================================

INSERT INTO public.houses (name, color, description) VALUES
  ('Red House', '#ef4444', 'The house of courage and determination'),
  ('Blue House', '#3b82f6', 'The house of wisdom and intelligence'),
  ('Green House', '#10b981', 'The house of growth and harmony'),
  ('Orange House', '#f97316', 'The house of energy and enthusiasm');