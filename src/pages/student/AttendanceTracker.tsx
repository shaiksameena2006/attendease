import { Calendar as CalendarIcon, CheckCircle, XCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export default function AttendanceTracker() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const subjects = [
    { name: "Data Structures", present: 42, total: 48, percentage: 87.5 },
    { name: "Web Development", present: 38, total: 40, percentage: 95.0 },
    { name: "Database Management", present: 35, total: 44, percentage: 79.5 },
    { name: "Operating Systems", present: 40, total: 46, percentage: 87.0 },
    { name: "Computer Networks", present: 32, total: 42, percentage: 76.2 },
  ];

  const recentAttendance = [
    { date: "2024-01-15", subject: "Data Structures", status: "present", time: "09:00 AM" },
    { date: "2024-01-15", subject: "Web Development", status: "present", time: "11:00 AM" },
    { date: "2024-01-14", subject: "Database Management", status: "absent", time: "02:00 PM" },
    { date: "2024-01-14", subject: "Operating Systems", status: "present", time: "09:00 AM" },
    { date: "2024-01-13", subject: "Computer Networks", status: "present", time: "03:00 PM" },
  ];

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

      {/* Overall Attendance */}
      <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">Overall Attendance</p>
            <p className="text-5xl font-bold text-primary">85.0%</p>
            <p className="text-xs text-muted-foreground">187 present out of 220 classes</p>
          </div>
        </CardContent>
      </Card>

      {/* Missing Attendance Alert */}
      <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                Attention Required
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300">
                Computer Networks attendance is below 75%. Attend next 5 classes to maintain eligibility.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

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
