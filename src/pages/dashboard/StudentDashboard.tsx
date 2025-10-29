import { BookOpen, Calendar, Trophy, TrendingUp, CheckSquare, CalendarDays, FileText } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { NotificationPanel } from "@/components/dashboard/NotificationPanel";
import { QuickActionGrid } from "@/components/dashboard/QuickActionGrid";
import { SchedulePreview } from "@/components/dashboard/SchedulePreview";
import { ChartPlaceholder } from "@/components/dashboard/ChartPlaceholder";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({ attendance: 0, classes: 0, events: 0, housePoints: 0 });
  const [notifications, setNotifications] = useState<any[]>([]);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStudentData();
    }
  }, [user]);

  const fetchStudentData = async () => {
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();
      
      setProfile(profileData);

      // Fetch attendance stats
      const { data: attendanceData } = await supabase
        .from("attendance_records")
        .select("*")
        .eq("student_id", user?.id);
      
      const presentCount = attendanceData?.filter(r => r.status === "present").length || 0;
      const totalCount = attendanceData?.length || 1;
      const attendancePercentage = Math.round((presentCount / totalCount) * 100);

      // Fetch enrolled classes
      const { data: enrolledClasses } = await supabase
        .from("class_enrollments")
        .select("class_id")
        .eq("student_id", user?.id);
      
      // Fetch today's timetable
      const today = new Date().getDay();
      const { data: todaySchedule } = await supabase
        .from("timetable_entries")
        .select(`
          *,
          classes!inner (
            id,
            faculty_id,
            subjects (name)
          ),
          rooms (room_number, building)
        `)
        .in("class_id", enrolledClasses?.map(e => e.class_id) || [])
        .eq("day_of_week", today)
        .eq("is_active", true)
        .order("start_time");

      // Get faculty names separately
      const facultyIds = [...new Set(todaySchedule?.map(t => t.classes?.faculty_id).filter(Boolean))];
      const { data: facultyProfiles } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", facultyIds);

      const facultyMap = new Map(facultyProfiles?.map(p => [p.id, p.full_name]));

      const formattedSchedule = todaySchedule?.map(entry => ({
        id: entry.id,
        subject: entry.classes?.subjects?.name || "Class",
        time: entry.start_time,
        duration: "1 hour",
        room: `${entry.rooms?.building || ""} ${entry.rooms?.room_number || ""}`.trim(),
        faculty: facultyMap.get(entry.classes?.faculty_id) || "Faculty",
        status: new Date().getHours() >= parseInt(entry.start_time.split(":")[0]) ? "ongoing" : "upcoming"
      })) || [];

      setSchedule(formattedSchedule);

      // Fetch registered events
      const { data: registeredEvents } = await supabase
        .from("event_registrations")
        .select("event_id")
        .eq("user_id", user?.id);

      // Fetch house points
      const { data: houseData } = await supabase
        .from("house_memberships")
        .select(`
          houses (
            id,
            name,
            total_points
          )
        `)
        .eq("user_id", user?.id)
        .single();

      setStats({
        attendance: attendancePercentage,
        classes: formattedSchedule.length,
        events: registeredEvents?.length || 0,
        housePoints: houseData?.houses?.total_points || 0
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching student data:", error);
      setLoading(false);
    }
  };

  const quickActions = [
    { id: "1", label: "Mark Attendance", icon: CheckSquare, onClick: () => navigate("/student/attendance") },
    { id: "2", label: "View Timetable", icon: Calendar, onClick: () => navigate("/student/timetable") },
    { id: "3", label: "Browse Events", icon: CalendarDays, onClick: () => navigate("/events") },
    { id: "4", label: "My Certificates", icon: FileText, onClick: () => navigate("/student/certificates") },
  ];

  if (loading) {
    return <div className="flex items-center justify-center h-96">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 border-2 border-primary">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {profile?.full_name?.split(" ").map((n: string) => n[0]).join("") || "ST"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {profile?.full_name || "Student"}!</h1>
              <p className="text-muted-foreground">
                {profile?.department || "Department"} {profile?.year ? `- Year ${profile.year}` : ""}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Attendance"
          value={`${stats.attendance}%`}
          icon={CheckSquare}
        />
        <StatCard
          title="Today's Classes"
          value={stats.classes.toString()}
          icon={BookOpen}
        />
        <StatCard
          title="Registered Events"
          value={stats.events.toString()}
          icon={CalendarDays}
        />
        <StatCard
          title="House Points"
          value={stats.housePoints.toString()}
          icon={Trophy}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Schedule Preview - 2 columns */}
        <div className="lg:col-span-2">
          <SchedulePreview sessions={schedule} />
        </div>

        {/* Notifications - 1 column */}
        <div>
          <NotificationPanel notifications={notifications} />
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActionGrid actions={quickActions} columns={4} />

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartPlaceholder 
          title="Attendance Trends" 
          description="Your attendance over the last 6 months"
          showTrend
        />
        <ChartPlaceholder 
          title="Performance Analytics" 
          description="Subject-wise performance breakdown"
        />
      </div>

      {/* News Feed Preview */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Campus News</h3>
            <button className="text-sm text-primary hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground text-center py-8">
              No campus news available at the moment
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
