import { TrendingUp, Users, Calendar, Activity, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartPlaceholder } from "@/components/dashboard/ChartPlaceholder";
import { Progress } from "@/components/ui/progress";

export default function Analytics() {
  const departmentData = [
    { name: "Computer Science", students: 420, avgAttendance: 87, events: 24 },
    { name: "Electronics", students: 385, avgAttendance: 89, events: 18 },
    { name: "Mechanical", students: 450, avgAttendance: 84, events: 15 },
    { name: "Civil", students: 380, avgAttendance: 86, events: 12 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-2">Comprehensive campus analytics and insights</p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
            <p className="text-sm text-muted-foreground mb-1">Total Users</p>
            <p className="text-3xl font-bold">1,635</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Activity className="w-8 h-8 mx-auto mb-2 text-primary" />
            <p className="text-sm text-muted-foreground mb-1">Avg Attendance</p>
            <p className="text-3xl font-bold">86.5%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-primary" />
            <p className="text-sm text-muted-foreground mb-1">Active Events</p>
            <p className="text-3xl font-bold">69</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-primary" />
            <p className="text-sm text-muted-foreground mb-1">Engagement Rate</p>
            <p className="text-3xl font-bold">92%</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="attendance" className="space-y-6">
        <TabsList>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="transport">Transport</TabsTrigger>
        </TabsList>

        <TabsContent value="attendance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartPlaceholder 
              title="Daily Attendance Trends" 
              description="Campus-wide attendance over the last 30 days"
              height="300px"
              showTrend
            />
            <ChartPlaceholder 
              title="Department-wise Attendance" 
              description="Comparative attendance across departments"
              height="300px"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Department Attendance Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentData.map((dept, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{dept.name}</span>
                      <span className="text-sm text-muted-foreground">{dept.avgAttendance}%</span>
                    </div>
                    <Progress value={dept.avgAttendance} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartPlaceholder 
              title="Event Participation" 
              description="Monthly event registration and attendance"
              height="300px"
              showTrend
            />
            <ChartPlaceholder 
              title="Event Categories" 
              description="Distribution of events by category"
              height="300px"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Performing Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "Tech Fest 2024", participants: 450, capacity: 500 },
                  { name: "Sports Day", participants: 380, capacity: 400 },
                  { name: "Cultural Night", participants: 420, capacity: 450 },
                ].map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">{event.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {event.participants} / {event.capacity} participants
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{Math.round((event.participants / event.capacity) * 100)}%</p>
                      <p className="text-xs text-muted-foreground">Fill Rate</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {departmentData.map((dept, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">{dept.name}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Students</span>
                      <span className="font-medium">{dept.students}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Attendance</span>
                      <span className="font-medium">{dept.avgAttendance}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Events</span>
                      <span className="font-medium">{dept.events}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <ChartPlaceholder 
            title="Department Growth Trends" 
            description="Student enrollment trends over time"
            height="300px"
            showTrend
          />
        </TabsContent>

        <TabsContent value="transport" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartPlaceholder 
              title="Bus Usage Statistics" 
              description="Daily ridership patterns"
              height="300px"
            />
            <ChartPlaceholder 
              title="Route Performance" 
              description="Usage by route"
              height="300px"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Transport Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg border">
                  <p className="text-sm text-muted-foreground mb-1">Active Passes</p>
                  <p className="text-2xl font-bold">847</p>
                </div>
                <div className="text-center p-4 rounded-lg border">
                  <p className="text-sm text-muted-foreground mb-1">Daily Trips</p>
                  <p className="text-2xl font-bold">156</p>
                </div>
                <div className="text-center p-4 rounded-lg border">
                  <p className="text-sm text-muted-foreground mb-1">Avg Occupancy</p>
                  <p className="text-2xl font-bold">78%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
