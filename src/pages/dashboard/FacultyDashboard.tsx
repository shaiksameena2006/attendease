import { Users, BookOpen, CheckSquare, FileText, Calendar, TrendingUp, Award, Clock } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { NotificationPanel } from "@/components/dashboard/NotificationPanel";
import { QuickActionGrid } from "@/components/dashboard/QuickActionGrid";
import { SchedulePreview } from "@/components/dashboard/SchedulePreview";
import { ChartPlaceholder } from "@/components/dashboard/ChartPlaceholder";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function FacultyDashboard() {
  const mockNotifications = [
    {
      id: "1",
      type: "warning" as const,
      title: "Pending Approvals",
      message: "3 certificate requests awaiting your approval",
      time: "30 mins ago",
      isRead: false,
    },
    {
      id: "2",
      type: "info" as const,
      title: "Class Update",
      message: "Room changed for Web Development - Now in Lab 103",
      time: "1 hour ago",
      isRead: false,
    },
    {
      id: "3",
      type: "success" as const,
      title: "Attendance Complete",
      message: "All students marked for Database Management",
      time: "3 hours ago",
      isRead: true,
    },
  ];

  const mockSchedule = [
    {
      id: "1",
      subject: "Web Development (Section A)",
      time: "09:00 AM",
      duration: "2 hours",
      room: "Lab 102",
      status: "ongoing" as const,
    },
    {
      id: "2",
      subject: "Database Management (Section B)",
      time: "12:00 PM",
      duration: "1.5 hours",
      room: "Room 205",
      status: "upcoming" as const,
    },
    {
      id: "3",
      subject: "Software Engineering (Section A)",
      time: "03:00 PM",
      duration: "1 hour",
      room: "Room 301",
      status: "upcoming" as const,
    },
  ];

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
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">MC</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Good morning, Prof. Michael Chen</h1>
              <p className="text-muted-foreground">Computer Science Department</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary" className="h-fit">
                <Clock className="w-3 h-3 mr-1" />
                3 Classes Today
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value="156"
          icon={Users}
        />
        <StatCard
          title="Classes Today"
          value="3"
          icon={BookOpen}
        />
        <StatCard
          title="Avg Attendance"
          value="89%"
          icon={CheckSquare}
          trend={{ value: 3, isPositive: true }}
        />
        <StatCard
          title="Pending Tasks"
          value="8"
          icon={FileText}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Class Schedule - 2 columns */}
        <div className="lg:col-span-2">
          <SchedulePreview sessions={mockSchedule} title="Today's Classes" />
        </div>

        {/* Notifications - 1 column */}
        <div>
          <NotificationPanel notifications={mockNotifications} />
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActionGrid actions={quickActions} columns={3} />

      {/* Student Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      {/* Pending Approvals */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Pending Approvals</h3>
            <Badge variant="secondary">3 items</Badge>
          </div>
          <div className="space-y-3">
            {[
              { type: "Certificate Request", student: "John Doe", subject: "Workshop Completion" },
              { type: "Certificate Request", student: "Jane Smith", subject: "Project Excellence" },
              { type: "Leave Application", student: "Mike Johnson", subject: "Medical Leave" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
                    <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="font-medium">{item.type}</p>
                    <p className="text-sm text-muted-foreground">{item.student} - {item.subject}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 text-sm bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-md hover:bg-emerald-200 dark:hover:bg-emerald-900/30">
                    Approve
                  </button>
                  <button className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md hover:bg-red-200 dark:hover:bg-red-900/30">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
