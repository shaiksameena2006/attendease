import { Calendar as CalendarIcon, CheckCircle, XCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { BluetoothAttendance } from "@/components/attendance/BluetoothAttendance";

export default function AttendanceTracker() {
  const { user } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [subjects, setSubjects] = useState<any[]>([]);
  const [recentAttendance, setRecentAttendance] = useState<any[]>([]);
  const [overallStats, setOverallStats] = useState({ present: 0, total: 0, percentage: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAttendanceData();
    }
  }, [user]);

  const fetchAttendanceData = async () => {
    try {
      // Get all attendance records
      const { data: records } = await supabase
        .from("attendance_records")
        .select(`
          *,
          attendance_sessions (
            classes (
              subjects (name)
            )
          )
        `)
        .eq("student_id", user?.id)
        .order("marked_at", { ascending: false });

      // Calculate subject-wise attendance
      const subjectMap = new Map();
      records?.forEach(record => {
        const subjectName = record.attendance_sessions?.classes?.subjects?.name || "Unknown";
        if (!subjectMap.has(subjectName)) {
          subjectMap.set(subjectName, { present: 0, total: 0 });
        }
        const stats = subjectMap.get(subjectName);
        stats.total += 1;
        if (record.status === "present") stats.present += 1;
      });

      const subjectsData = Array.from(subjectMap.entries()).map(([name, stats]: any) => ({
        name,
        present: stats.present,
        total: stats.total,
        percentage: stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0,
      }));

      setSubjects(subjectsData);

      // Calculate overall stats
      const totalPresent = records?.filter(r => r.status === "present").length || 0;
      const totalRecords = records?.length || 1;
      setOverallStats({
        present: totalPresent,
        total: totalRecords,
        percentage: Math.round((totalPresent / totalRecords) * 100),
      });

      // Format recent attendance
      const recentData = records?.slice(0, 10).map(record => ({
        date: new Date(record.marked_at).toLocaleDateString(),
        subject: record.attendance_sessions?.classes?.subjects?.name || "Unknown",
        status: record.status,
        time: new Date(record.marked_at).toLocaleTimeString(),
      })) || [];

      setRecentAttendance(recentData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-96">Loading...</div>;
  }

  const getStatusColor = (percentage: number) => {
    if (percentage >= 85) return "text-emerald-600 dark:text-emerald-400";
    if (percentage >= 75) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Attendance Tracker</h1>
        <p className="text-muted-foreground mt-2">Monitor your attendance across all subjects</p>
      </div>

      {/* Bluetooth Attendance */}
      <BluetoothAttendance />

      {/* Overall Attendance */}
      <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">Overall Attendance</p>
            <p className="text-5xl font-bold text-primary">{overallStats.percentage}%</p>
            <p className="text-xs text-muted-foreground">
              {overallStats.present} present out of {overallStats.total} classes
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Low Attendance Alert */}
      {subjects.some(s => s.percentage < 75) && (
        <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <div>
                <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                  Attention Required
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  Some subjects have attendance below 75%. Please attend classes regularly.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="subjects" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="subjects">By Subject</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="subjects" className="space-y-4">
          {subjects.map((subject, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{subject.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {subject.present} / {subject.total} classes attended
                      </p>
                    </div>
                    <Badge className={getStatusColor(subject.percentage)}>
                      {subject.percentage}%
                    </Badge>
                  </div>
                  <Progress value={subject.percentage} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border mx-auto"
              />
              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-emerald-500 rounded-sm" />
                  <span className="text-sm">Present</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded-sm" />
                  <span className="text-sm">Absent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-muted rounded-sm" />
                  <span className="text-sm">No class</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {recentAttendance.map((record, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {record.status === "present" ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    )}
                    <div>
                      <p className="font-medium">{record.subject}</p>
                      <p className="text-sm text-muted-foreground">{record.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={record.status === "present" ? "default" : "destructive"}>
                      {record.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{record.date}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
