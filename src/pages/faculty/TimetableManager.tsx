import { Plus, Edit, Save, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TimetableManager() {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  
  const timeSlots = [
    "09:00 - 10:00",
    "10:00 - 11:00",
    "11:00 - 12:00",
    "12:00 - 01:00",
    "02:00 - 03:00",
    "03:00 - 04:00",
  ];

  const schedule = {
    Monday: {
      "09:00 - 10:00": { class: "Web Dev A", room: "Lab 102" },
      "11:00 - 12:00": { class: "Web Dev B", room: "Lab 103" },
    },
    Tuesday: {
      "02:00 - 03:00": { class: "Database B", room: "Room 205" },
    },
    Wednesday: {
      "09:00 - 10:00": { class: "Web Dev A", room: "Lab 102" },
      "03:00 - 04:00": { class: "Soft Eng A", room: "Room 301" },
    },
    Thursday: {
      "11:00 - 12:00": { class: "Web Dev B", room: "Lab 103" },
    },
    Friday: {
      "02:00 - 03:00": { class: "Database B", room: "Room 205" },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Timetable Manager</h1>
          <p className="text-muted-foreground mt-2">Create and manage class schedules</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Edit Mode
          </Button>
          <Button>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Conflict Alert */}
      <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                No scheduling conflicts detected
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300">
                All classes are scheduled without overlaps
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="weekly" className="space-y-6">
        <TabsList>
          <TabsTrigger value="weekly">Weekly View</TabsTrigger>
          <TabsTrigger value="classes">By Class</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="space-y-4">
          {/* Timetable Grid */}
          <Card>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-2 bg-muted text-left font-semibold">Time</th>
                      {days.map(day => (
                        <th key={day} className="border p-2 bg-muted text-left font-semibold">{day}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {timeSlots.map(slot => (
                      <tr key={slot}>
                        <td className="border p-2 font-medium text-sm text-muted-foreground whitespace-nowrap">
                          {slot}
                        </td>
                        {days.map(day => {
                          const session = schedule[day as keyof typeof schedule]?.[slot];
                          return (
                            <td key={day} className="border p-2">
                              {session ? (
                                <div className="bg-primary/10 p-2 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                                  <p className="text-sm font-semibold">{session.class}</p>
                                  <p className="text-xs text-muted-foreground">{session.room}</p>
                                </div>
                              ) : (
                                <Button variant="ghost" size="sm" className="w-full h-full min-h-[60px] hover:bg-accent">
                                  <Plus className="w-4 h-4" />
                                </Button>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Legend */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-primary/10 rounded" />
                  <span className="text-sm">Scheduled</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-muted rounded border" />
                  <span className="text-sm">Available</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="classes" className="space-y-4">
          {[
            { name: "Web Development (Section A)", sessions: 3, students: 42 },
            { name: "Web Development (Section B)", sessions: 2, students: 38 },
            { name: "Database Management (Section B)", sessions: 2, students: 38 },
            { name: "Software Engineering (Section A)", sessions: 1, students: 35 },
          ].map((classInfo, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{classInfo.name}</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="secondary">{classInfo.sessions} sessions/week</Badge>
                    <Badge variant="outline">{classInfo.students} students</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {/* Example sessions for this class */}
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">Monday, 09:00 - 10:00</p>
                      <p className="text-sm text-muted-foreground">Lab 102</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Session
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Pending Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Student Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="font-medium">Schedule Change Notification</p>
                <p className="text-sm text-muted-foreground">
                  42 students will be notified about the updated schedule
                </p>
              </div>
              <Button size="sm">Send Now</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
