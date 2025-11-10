import { useState, useEffect } from "react";
import {
  Users,
  BookOpen,
  CheckSquare,
  FileText,
  Calendar,
  TrendingUp,
  Award,
  Clock,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { QuickActionGrid } from "@/components/dashboard/QuickActionGrid";
import { ChartPlaceholder } from "@/components/dashboard/ChartPlaceholder";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

  // State for students modal
  const [showStudents, setShowStudents] = useState(false);
  const [students, setStudents] = useState<string[]>([]);
  const [fetchingStudents, setFetchingStudents] = useState(false);

  // State for scan progress
  const [scanning, setScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState("");

  useEffect(() => {
    if (user) {
      fetchFacultyData();
    }
  }, [user]);

  const fetchFacultyData = async () => {
    if (!user) return;

    try {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(profileData);

      const { data: classes } = await supabase
        .from("classes")
        .select("*, class_enrollments(count)")
        .eq("faculty_id", user.id);

      const totalStudents =
        classes?.reduce(
          (sum, c) => sum + (c.class_enrollments?.[0]?.count || 0),
          0
        ) || 0;

      setStats({
        totalStudents,
        classesToday: 0,
        avgAttendance: 0,
        pendingTasks: 0,
      });
    } catch (error) {
      console.error("Error fetching faculty data:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🟢 MARK ATTENDANCE → Trigger BLE scan
  const handleMarkAttendance = async () => {
    setScanning(true);
    setScanMessage("🔍 Scanning in progress... Please wait 20 seconds.");

    try {
      const res = await fetch("http://localhost:5001/api/scan");
      const data = await res.json();

      if (data.status === "success") {
        setScanMessage("✅ Scan complete! Attendance saved.");
      } else {
        setScanMessage(`❌ Scan failed: ${data.message}`);
      }
    } catch (err) {
      console.error("Error triggering scan:", err);
      setScanMessage("❌ Error starting BLE scan.");
    } finally {
      setScanning(false);
      // Auto-hide message after 8 seconds
      setTimeout(() => setScanMessage(""), 8000);
    }
  };

  // 🟣 VIEW STUDENTS → Fetch today’s attendance
  const handleViewStudents = async () => {
    setShowStudents(true);
    setFetchingStudents(true);

    try {
      const res = await fetch("http://localhost:5001/api/view_students");
      const data = await res.json();

      // Filter today's data only
      const today = new Date().toISOString().split("T")[0];
      const todays = data.students?.filter((s: string) => s.includes(today)) || [];
      setStudents(todays);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setFetchingStudents(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        Loading...
      </div>
    );
  }

  const quickActions = [
    {
      id: "1",
      label: "Mark Attendance",
      icon: CheckSquare,
      onClick: () => window.open("http://127.0.0.1:5001/", "_blank"),
      variant: "default" as const,
    },    
    {
      id: "2",
      label: "Manage Classes",
      icon: BookOpen,
      onClick: () => console.log("Manage Classes"),
    },
    {
      id: "3",
      label: "Edit Timetable",
      icon: Calendar,
      onClick: () => console.log("Edit Timetable"),
    },
    {
      id: "4",
      label: "Issue Certificate",
      icon: Award,
      onClick: () => console.log("Issue Certificate"),
    },
    {
      id: "5",
      label: "View Students",
      icon: Users,
      onClick: handleViewStudents,
    },
    {
      id: "6",
      label: "CO-PO Analysis",
      icon: TrendingUp,
      onClick: () => console.log("CO-PO Analysis"),
    },
  ];

  return (
    <div className="space-y-6 relative">
      {/* Welcome Panel */}
      <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 border-2 border-primary">
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {profile?.full_name
                  ?.split(" ")
                  .map((n: string) => n[0])
                  .join("") || "F"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">
                Welcome, {profile?.full_name || "Faculty"}
              </h1>
              <p className="text-muted-foreground">
                {profile?.department || "Faculty Member"}
              </p>
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
        <StatCard title="Total Students" value={stats.totalStudents.toString()} icon={Users} />
        <StatCard title="Classes Today" value={stats.classesToday.toString()} icon={BookOpen} />
        <StatCard title="Avg Attendance" value={stats.avgAttendance > 0 ? `${stats.avgAttendance}%` : "N/A"} icon={CheckSquare} />
        <StatCard title="Pending Tasks" value={stats.pendingTasks.toString()} icon={FileText} />
      </div>

      {/* Charts */}
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

      {/* Scan Status */}
      {scanMessage && (
        <p className="text-center text-sm mt-2 text-blue-500">{scanMessage}</p>
      )}

      {/* 🧾 View Students Modal */}
      <Dialog open={showStudents} onOpenChange={setShowStudents}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Today's Scanned Students</DialogTitle>
          </DialogHeader>

          {fetchingStudents ? (
            <p className="text-muted-foreground text-center py-4">
              Fetching students...
            </p>
          ) : students.length > 0 ? (
            <ul className="space-y-2 max-h-[400px] overflow-y-auto">
              {students.map((student, idx) => (
                <li
                  key={idx}
                  className="border border-gray-300 dark:border-gray-700 p-2 rounded-md"
                >
                  {student}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground py-4">
              No attendance records for today.
            </p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
