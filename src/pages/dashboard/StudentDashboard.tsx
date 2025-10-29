import { BookOpen, Calendar, Trophy, TrendingUp, CheckSquare, CalendarDays, Users, FileText } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { NotificationPanel } from "@/components/dashboard/NotificationPanel";
import { QuickActionGrid } from "@/components/dashboard/QuickActionGrid";
import { SchedulePreview } from "@/components/dashboard/SchedulePreview";
import { ChartPlaceholder } from "@/components/dashboard/ChartPlaceholder";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function StudentDashboard() {
  const mockNotifications = [
    {
      id: "1",
      type: "alert" as const,
      title: "Class Starting Soon",
      message: "Data Structures - Room 301 in 15 minutes",
      time: "10 mins ago",
      isRead: false,
    },
    {
      id: "2",
      type: "success" as const,
      title: "Attendance Marked",
      message: "Your attendance for Web Development has been recorded",
      time: "1 hour ago",
      isRead: false,
    },
    {
      id: "3",
      type: "info" as const,
      title: "New Event",
      message: "Tech Fest 2024 registration is now open",
      time: "2 hours ago",
      isRead: true,
    },
  ];

  const mockSchedule = [
    {
      id: "1",
      subject: "Data Structures",
      time: "09:00 AM",
      duration: "1 hour",
      room: "Room 301",
      faculty: "Dr. Sarah Johnson",
      status: "ongoing" as const,
    },
    {
      id: "2",
      subject: "Web Development",
      time: "11:00 AM",
      duration: "2 hours",
      room: "Lab 102",
      faculty: "Prof. Michael Chen",
      status: "upcoming" as const,
    },
    {
      id: "3",
      subject: "Database Management",
      time: "02:00 PM",
      duration: "1.5 hours",
      room: "Room 205",
      faculty: "Dr. Emily Brown",
      status: "upcoming" as const,
    },
  ];

  const quickActions = [
    { id: "1", label: "Mark Attendance", icon: CheckSquare, onClick: () => console.log("Mark Attendance") },
    { id: "2", label: "View Timetable", icon: Calendar, onClick: () => console.log("View Timetable") },
    { id: "3", label: "Browse Events", icon: CalendarDays, onClick: () => console.log("Browse Events") },
    { id: "4", label: "My Certificates", icon: FileText, onClick: () => console.log("My Certificates") },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 border-2 border-primary">
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">JD</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">Welcome back, John!</h1>
              <p className="text-muted-foreground">Computer Science Engineering - Year 3</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Attendance"
          value="87%"
          icon={CheckSquare}
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="Upcoming Classes"
          value="3"
          icon={BookOpen}
        />
        <StatCard
          title="Pending Events"
          value="5"
          icon={CalendarDays}
        />
        <StatCard
          title="House Points"
          value="245"
          icon={Trophy}
          trend={{ value: 12, isPositive: true }}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Schedule Preview - 2 columns */}
        <div className="lg:col-span-2">
          <SchedulePreview sessions={mockSchedule} />
        </div>

        {/* Notifications - 1 column */}
        <div>
          <NotificationPanel notifications={mockNotifications} />
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
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 p-3 rounded-lg hover:bg-accent transition-colors">
                <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Campus Update {i}</h4>
                  <p className="text-sm text-muted-foreground">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">{i} hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
