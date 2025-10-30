import { useState, useEffect } from "react";
import { Users, BookOpen, CheckSquare, FileText, Calendar, TrendingUp, Award, Clock } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { NotificationPanel } from "@/components/dashboard/NotificationPanel";
import { QuickActionGrid } from "@/components/dashboard/QuickActionGrid";
import { SchedulePreview } from "@/components/dashboard/SchedulePreview";
import { ChartPlaceholder } from "@/components/dashboard/ChartPlaceholder";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export function FacultyDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    totalStudents: 0,
    classesToday: 0,
    avgAttendance: 0,
    pendingTasks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFacultyData();
    }
  }, [user]);

  const fetchFacultyData = async () => {
    if (!user) return;

    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setProfile(profileData);

      // Fetch faculty classes and stats
      const { data: classes } = await supabase
        .from('classes')
        .select('*, class_enrollments(count)')
        .eq('faculty_id', user.id);

      const totalStudents = classes?.reduce((sum, c) => sum + (c.class_enrollments?.[0]?.count || 0), 0) || 0;

      setStats({
        totalStudents,
        classesToday: 0, // Can be calculated based on timetable
        avgAttendance: 0,
        pendingTasks: 0,
      });
    } catch (error) {
      console.error('Error fetching faculty data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]">Loading...</div>;
  }

  const quickActions = [
    { id: "1", label: "Mark Attendance", icon: CheckSquare, onClick: () => console.log("Mark Attendance"), variant: "default" as const },
    { id: "2", label: "Manage Classes", icon: BookOpen, onClick: () => console.log("Manage Classes") },
    { id: "3", label: "Edit Timetable", icon: Calendar, onClick: () => console.log("Edit Timetable") },
    { id: "4", label: "Issue Certificate", icon: Award, onClick: () => console.log("Issue Certificate") },
    { id: "5", label: "View Students", icon: Users, onClick: () => console.log("View Students") },
    { id: "6", label: "CO-PO Analysis", icon: TrendingUp, onClick: () => console.log("CO-PO Analysis") },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Panel */}
      <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 border-2 border-primary">
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {profile?.full_name?.split(' ').map((n: string) => n[0]).join('') || 'F'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">
                Good morning, {profile?.full_name || 'Faculty'}
              </h1>
              <p className="text-muted-foreground">{profile?.department || 'Faculty Member'}</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary" className="h-fit">
                <Clock className="w-3 h-3 mr-1" />
                {stats.classesToday} Classes Today
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={stats.totalStudents.toString()}
          icon={Users}
        />
        <StatCard
          title="Classes Today"
          value={stats.classesToday.toString()}
          icon={BookOpen}
        />
        <StatCard
          title="Avg Attendance"
          value={stats.avgAttendance > 0 ? `${stats.avgAttendance}%` : 'N/A'}
          icon={CheckSquare}
        />
        <StatCard
          title="Pending Tasks"
          value={stats.pendingTasks.toString()}
          icon={FileText}
        />
      </div>

      {/* Main Content Grid - Only show if has data */}
      {stats.totalStudents > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartPlaceholder 
            title="Class-wise Attendance" 
            description="Attendance trends across all your classes"
            showTrend
          />
          <ChartPlaceholder 
            title="Student Performance" 
            description="Performance distribution by class"
          />
        </div>
      )}

      {/* Quick Actions */}
      <QuickActionGrid actions={quickActions} columns={3} />
    </div>
  );
}
