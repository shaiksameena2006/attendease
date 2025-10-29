import { Users, CheckSquare, TrendingUp, Calendar, Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function ClassManagement() {
  const classes = [
    { name: "Web Development (Section A)", year: "3rd Year", students: 42, avgAttendance: 92 },
    { name: "Database Management (Section B)", year: "2nd Year", students: 38, avgAttendance: 87 },
    { name: "Software Engineering (Section A)", year: "4th Year", students: 35, avgAttendance: 89 },
  ];

  const recentSessions = [
    { class: "Web Development", date: "2024-01-15", time: "11:00 AM", attendance: "40/42", topic: "React Hooks" },
    { class: "Database Management", date: "2024-01-15", time: "02:00 PM", attendance: "35/38", topic: "SQL Joins" },
    { class: "Software Engineering", date: "2024-01-14", time: "03:00 PM", attendance: "33/35", topic: "Agile Methods" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Class Management</h1>
          <p className="text-muted-foreground mt-2">Manage your classes and student roster</p>
        </div>
        <Button>
          <CheckSquare className="w-4 h-4 mr-2" />
          Mark Attendance
        </Button>
      </div>

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
                    <h3 className="font-semibold">{classInfo.name}</h3>
                    <p className="text-sm text-muted-foreground">{classInfo.year}</p>
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

      {/* Recent Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentSessions.map((session, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg border hover:shadow-md transition-shadow">
                <div className="flex-1">
                  <h4 className="font-semibold">{session.class}</h4>
                  <p className="text-sm text-muted-foreground">{session.topic}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {session.date}
                    </span>
                    <span>{session.time}</span>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary">{session.attendance}</Badge>
                  <p className="text-xs text-muted-foreground mt-1">Present</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Student List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Students</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search students..." className="pl-10 w-64" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { name: "John Doe", rollNo: "CS2024001", class: "Web Development", attendance: 95 },
              { name: "Jane Smith", rollNo: "CS2024002", class: "Web Development", attendance: 92 },
              { name: "Mike Johnson", rollNo: "CS2024003", class: "Database Management", attendance: 88 },
              { name: "Sarah Williams", rollNo: "CS2024004", class: "Database Management", attendance: 90 },
              { name: "Tom Brown", rollNo: "CS2024005", class: "Software Engineering", attendance: 87 },
            ].map((student, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-muted-foreground">{student.rollNo} • {student.class}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={student.attendance >= 90 ? "default" : student.attendance >= 75 ? "secondary" : "destructive"}>
                    {student.attendance}%
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">Attendance</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
