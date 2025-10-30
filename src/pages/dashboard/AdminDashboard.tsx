import { useState, useEffect } from "react";
import { Users, UserCheck, Calendar, Activity, Shield, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { NotificationPanel } from "@/components/dashboard/NotificationPanel";
import { QuickActionGrid } from "@/components/dashboard/QuickActionGrid";
import { ChartPlaceholder } from "@/components/dashboard/ChartPlaceholder";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingApprovals: 0,
    activeEvents: 0,
  });
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAdminData();
    }
  }, [user]);

  const fetchAdminData = async () => {
    try {
      // Fetch total users
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch pending approvals
      const { data: pendingData, count: pendingCount } = await supabase
        .from('user_roles')
        .select('*, profiles(*)', { count: 'exact' })
        .eq('approved', false);

      // Fetch active events
      const { count: eventsCount } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true);

      setStats({
        totalUsers: usersCount || 0,
        pendingApprovals: pendingCount || 0,
        activeEvents: eventsCount || 0,
      });

      setPendingUsers(pendingData || []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (userId: string, approved: boolean) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({
          approved,
          approved_by: user?.id,
          approved_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: approved ? "User Approved" : "User Rejected",
        description: approved ? "User can now access the system" : "User registration has been rejected",
      });

      fetchAdminData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]">Loading...</div>;
  }

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
          value={stats.totalUsers.toString()}
          icon={Users}
        />
        <StatCard
          title="Pending Approvals"
          value={stats.pendingApprovals.toString()}
          icon={UserCheck}
        />
        <StatCard
          title="Active Events"
          value={stats.activeEvents.toString()}
          icon={Calendar}
        />
        <StatCard
          title="System Uptime"
          value="99.8%"
          icon={Activity}
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
                <Badge variant="secondary">{stats.pendingApprovals} pending</Badge>
              </div>
              {pendingUsers.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No pending approvals
                </p>
              ) : (
                <div className="space-y-3">
                  {pendingUsers.map((userRole) => (
                    <div key={userRole.id} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {userRole.profiles?.full_name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{userRole.profiles?.full_name || 'Unknown'}</p>
                          <p className="text-sm text-muted-foreground">{userRole.profiles?.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs capitalize">{userRole.role}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="p-2 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/30"
                          onClick={() => handleApproval(userRole.user_id, true)}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="p-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/30"
                          onClick={() => handleApproval(userRole.user_id, false)}
                        >
                          <AlertCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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

          
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActionGrid actions={quickActions} title="Administrative Actions" columns={3} />

      {/* Analytics Dashboard - Only show if has data */}
      {stats.totalUsers > 0 && (
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
      )}
    </div>
  );
}
