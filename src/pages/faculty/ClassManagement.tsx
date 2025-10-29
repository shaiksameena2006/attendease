import { Users, CheckSquare, Calendar, Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { FacultyAttendanceSession } from "@/components/attendance/FacultyAttendanceSession";

export default function ClassManagement() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFacultyData();
    }
  }, [user]);

  const fetchFacultyData = async () => {
    try {
      // Fetch faculty classes
      const { data: classesData } = await supabase
        .from("classes")
        .select(`
          *,
          subjects (name),
          class_enrollments (count)
        `)
        .eq("faculty_id", user?.id);

      // For each class, calculate average attendance
      const classesWithStats = await Promise.all(
        (classesData || []).map(async (cls) => {
          const { data: enrollments } = await supabase
            .from("class_enrollments")
            .select("student_id")
            .eq("class_id", cls.id);

          const studentIds = enrollments?.map(e => e.student_id) || [];

          // Get attendance records for this class
          const { data: sessions } = await supabase
            .from("attendance_sessions")
            .select("id")
            .eq("class_id", cls.id);

          const sessionIds = sessions?.map(s => s.id) || [];

          if (sessionIds.length > 0) {
            const { data: records } = await supabase
              .from("attendance_records")
              .select("status")
              .in("session_id", sessionIds)
              .in("student_id", studentIds);

            const presentCount = records?.filter(r => r.status === "present").length || 0;
            const totalCount = records?.length || 1;
            const avgAttendance = Math.round((presentCount / totalCount) * 100);

            return {
              ...cls,
              students: studentIds.length,
              avgAttendance,
            };
          }

          return {
            ...cls,
            students: studentIds.length,
            avgAttendance: 0,
          };
        })
      );

      setClasses(classesWithStats);

      // Fetch all students from all classes
      const allClassIds = classesData?.map(c => c.id) || [];
      const { data: allStudents } = await supabase
        .from("class_enrollments")
        .select(`
          *,
          profiles (full_name, email),
          classes (
            subjects (name)
          )
        `)
        .in("class_id", allClassIds);

      setStudents(allStudents || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching faculty data:", error);
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(s =>
    s.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center h-96">Loading...</div>;
  }


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Class Management</h1>
          <p className="text-muted-foreground mt-2">Manage your classes and student roster</p>
        </div>
      </div>

      {/* Bluetooth Attendance Session */}
      <FacultyAttendanceSession />

      {/* Class Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {classes.map((classInfo, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{classInfo.subjects?.name || "Class"}</h3>
                    <p className="text-sm text-muted-foreground">
                      Year {classInfo.year} - Section {classInfo.section || "A"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Students</span>
                  <span className="font-semibold">{classInfo.students}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Avg Attendance</span>
                    <span className="font-semibold">{classInfo.avgAttendance}%</span>
                  </div>
                  <Progress value={classInfo.avgAttendance} className="h-2" />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">View Students</Button>
                <Button variant="outline" size="sm" className="flex-1">Analytics</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>


      {/* Student List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Students</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search students..." 
                  className="pl-10 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredStudents.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No students found</p>
            ) : (
              filteredStudents.map((student, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {student.profiles?.full_name?.split(' ').map((n: string) => n[0]).join('') || "ST"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{student.profiles?.full_name || "Student"}</p>
                      <p className="text-sm text-muted-foreground">
                        {student.profiles?.email} • {student.classes?.subjects?.name || "Class"}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
