import { Users, UserCheck, Calendar, Activity, Shield, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { NotificationPanel } from "@/components/dashboard/NotificationPanel";
import { QuickActionGrid } from "@/components/dashboard/QuickActionGrid";
import { ChartPlaceholder } from "@/components/dashboard/ChartPlaceholder";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export function AdminDashboard() {
  const mockNotifications = [
    {
      id: "1",
      type: "alert" as const,
      title: "System Alert",
      message: "Database backup completed successfully",
      time: "15 mins ago",
      isRead: false,
    },
    {
      id: "2",
      type: "warning" as const,
      title: "Pending Registrations",
      message: "12 new user registrations awaiting approval",
      time: "1 hour ago",
      isRead: false,
    },
    {
      id: "3",
      type: "info" as const,
      title: "Event Update",
      message: "Tech Fest 2024 has 350+ registrations",
      time: "2 hours ago",
      isRead: true,
    },
  ];

  const quickActions = [
    { id: "1", label: "Approve Users", icon: UserCheck, onClick: () => console.log("Approve Users"), variant: "default" as const },
    { id: "2", label: "Manage Users", icon: Users, onClick: () => console.log("Manage Users") },
    { id: "3", label: "View Analytics", icon: TrendingUp, onClick: () => console.log("View Analytics") },
    { id: "4", label: "System Settings", icon: Shield, onClick: () => console.log("System Settings") },
    { id: "5", label: "Academic Config", icon: Calendar, onClick: () => console.log("Academic Config") },
    { id: "6", label: "Transport Admin", icon: Activity, onClick: () => console.log("Transport Admin") },
  ];

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 border-2 border-primary">
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                <Shield className="w-8 h-8" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">System Administration</h1>
              <p className="text-muted-foreground">Attendease Campus Management</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary" className="h-fit flex items-center gap-1">
                <Activity className="w-3 h-3" />
                System Healthy
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value="1,247"
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Pending Approvals"
          value="12"
          icon={UserCheck}
        />
        <StatCard
          title="Active Events"
          value="24"
          icon={Calendar}
        />
        <StatCard
          title="System Uptime"
          value="99.8%"
          icon={Activity}
          trend={{ value: 0.2, isPositive: true }}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Approvals - 2 columns */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Pending User Approvals</h3>
                <Badge variant="secondary">12 pending</Badge>
              </div>
              <div className="space-y-3">
                {[
                  { name: "John Doe", email: "john.doe@university.edu", role: "Student", time: "10 mins ago" },
                  { name: "Sarah Johnson", email: "sarah.j@university.edu", role: "Faculty", time: "25 mins ago" },
                  { name: "Mike Wilson", email: "mike.w@university.edu", role: "Student", time: "1 hour ago" },
                  { name: "Emily Brown", email: "emily.b@university.edu", role: "Student", time: "2 hours ago" },
                ].map((user, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{user.role}</Badge>
                          <span className="text-xs text-muted-foreground">{user.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-md hover:bg-emerald-200 dark:hover:bg-emerald-900/30">
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md hover:bg-red-200 dark:hover:bg-red-900/30">
                        <AlertCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Health & Notifications - 1 column */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">System Health</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Database</span>
                    <span className="text-emerald-600 dark:text-emerald-400">98%</span>
                  </div>
                  <Progress value={98} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>API Performance</span>
                    <span className="text-emerald-600 dark:text-emerald-400">95%</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Storage</span>
                    <span className="text-amber-600 dark:text-amber-400">72%</span>
                  </div>
                  <Progress value={72} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <NotificationPanel notifications={mockNotifications} maxHeight="300px" />
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActionGrid actions={quickActions} title="Administrative Actions" columns={3} />

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ChartPlaceholder 
          title="User Activity" 
          description="Daily active users over time"
          showTrend
        />
        <ChartPlaceholder 
          title="Attendance Analytics" 
          description="Campus-wide attendance trends"
        />
        <ChartPlaceholder 
          title="Event Participation" 
          description="Event registration and attendance"
        />
      </div>

      {/* Recent Activity */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent System Activity</h3>
          <div className="space-y-3">
            {[
              { action: "New user registration", user: "john.doe@university.edu", time: "5 mins ago", type: "info" },
              { action: "Certificate issued", user: "Prof. Michael Chen", time: "15 mins ago", type: "success" },
              { action: "Timetable updated", user: "Admin System", time: "1 hour ago", type: "info" },
              { action: "Event created", user: "faculty@university.edu", time: "2 hours ago", type: "success" },
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                <div className={`w-2 h-2 rounded-full ${activity.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.user}</p>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
