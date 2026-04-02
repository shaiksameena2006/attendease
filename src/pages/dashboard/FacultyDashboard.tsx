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

  // BLE scanning
  const [scanning, setScanning] = useState(false);
  const [detectedStudents, setDetectedStudents] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) fetchFacultyData();
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

      const totalStudents = classes?.reduce(
        (sum, c) => sum + (c.class_enrollments?.[0]?.count || 0),
        0
      ) || 0;

      setStats({
        totalStudents,
        classesToday: 0,
        avgAttendance: 0,
        pendingTasks: 0,
      });
    } catch (err) {
      console.error("Error fetching faculty data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Start BLE scan
  const startScan = async () => {
    setDetectedStudents({});
    setScanning(true);
    try {
      await fetch("http://192.168.29.153:5000/start_scan"); // Trigger Flask scan
      pollResults();
    } catch (err) {
      console.error("Scan error:", err);
      alert("Failed to start scan.");
      setScanning(false);
    }
  };

  // Poll scan results every 2 seconds
  const pollResults = async () => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/get_results");
        const data = await res.json();
        setDetectedStudents(data.results || {});
        setScanning(data.scanning);
        if (!data.scanning) clearInterval(interval);
      } catch (err) {
        console.error("Error fetching scan results:", err);
        clearInterval(interval);
        setScanning(false);
      }
    }, 2000);
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
      label: scanning ? "Scanning..." : "Take Attendance",
      icon: CheckSquare,
      onClick: startScan,
      variant: "default" as const,
    },
    { id: "2", label: "Manage Classes", icon: BookOpen, onClick: () => console.log("Manage Classes") },
    { id: "3", label: "Edit Timetable", icon: Calendar, onClick: () => console.log("Edit Timetable") },
    { id: "4", label: "Issue Certificate", icon: Award, onClick: () => console.log("Issue Certificate") },
    { id: "5", label: "View Students", icon: Users, onClick: () => console.log("View Students") },
    { id: "6", label: "CO-PO Analysis", icon: TrendingUp, onClick: () => console.log("CO-PO Analysis") },
  ];

  return (
    <div className="space-y-6 relative">
      {/* Welcome Panel */}
      <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
        <CardContent className="p-6 flex items-center gap-4">
          <Avatar className="w-16 h-16 border-2 border-primary">
            <AvatarFallback className="bg-primary text-primary-foreground text-xl">
              {profile?.full_name?.split(" ").map(n => n[0]).join("") || "F"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">
              Good morning, {profile?.full_name || "Faculty"}
            </h1>
            <p className="text-muted-foreground">{profile?.department || "Faculty Member"}</p>
          </div>
          <Badge variant="secondary" className="h-fit flex items-center gap-1">
            <Clock className="w-3 h-3" /> {stats.classesToday} Classes Today
          </Badge>
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
          <ChartPlaceholder title="Class-wise Attendance" description="Attendance trends across all your classes" showTrend />
          <ChartPlaceholder title="Student Performance" description="Performance distribution by class" />
        </div>
      )}

      {/* Quick Actions */}
      <QuickActionGrid actions={quickActions} columns={3} />

      {/* Detected Students Modal */}
      {Object.keys(detectedStudents).length > 0 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 max-w-full text-black">
            <h2 className="text-xl font-bold mb-4">Detected Students</h2>
            <ul className="max-h-64 overflow-y-auto space-y-2">
              {Object.entries(detectedStudents).map(([name, address]) => (
                <li key={address} className="p-2 bg-gray-200 rounded">
                  {name} — {address}
                </li>
              ))}
            </ul>
            <button
              className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
              onClick={() => setDetectedStudents({})}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 