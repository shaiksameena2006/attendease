import { Clock, MapPin, User, Download, Calendar as CalendarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Timetable() {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  
  const schedule = {
    Monday: [
      { subject: "Data Structures", time: "09:00 - 10:00", room: "Room 301", faculty: "Dr. Sarah Johnson", type: "Lecture" },
      { subject: "Web Development Lab", time: "11:00 - 01:00", room: "Lab 102", faculty: "Prof. Michael Chen", type: "Lab" },
      { subject: "Database Management", time: "02:00 - 03:30", room: "Room 205", faculty: "Dr. Emily Brown", type: "Lecture" },
    ],
    Tuesday: [
      { subject: "Operating Systems", time: "09:00 - 10:30", room: "Room 402", faculty: "Dr. James Wilson", type: "Lecture" },
      { subject: "Computer Networks", time: "11:00 - 12:00", room: "Room 304", faculty: "Prof. Lisa Anderson", type: "Lecture" },
      { subject: "OS Lab", time: "02:00 - 04:00", room: "Lab 201", faculty: "Dr. James Wilson", type: "Lab" },
    ],
    Wednesday: [
      { subject: "Data Structures", time: "09:00 - 10:00", room: "Room 301", faculty: "Dr. Sarah Johnson", type: "Lecture" },
      { subject: "Database Management", time: "11:00 - 12:30", room: "Room 205", faculty: "Dr. Emily Brown", type: "Lecture" },
      { subject: "Seminar", time: "02:00 - 03:00", room: "Auditorium", faculty: "Guest Speaker", type: "Seminar" },
    ],
    Thursday: [
      { subject: "Computer Networks", time: "09:00 - 10:00", room: "Room 304", faculty: "Prof. Lisa Anderson", type: "Lecture" },
      { subject: "Web Development", time: "11:00 - 12:00", room: "Room 103", faculty: "Prof. Michael Chen", type: "Lecture" },
      { subject: "Networks Lab", time: "02:00 - 04:00", room: "Lab 305", faculty: "Prof. Lisa Anderson", type: "Lab" },
    ],
    Friday: [
      { subject: "Operating Systems", time: "09:00 - 10:30", room: "Room 402", faculty: "Dr. James Wilson", type: "Lecture" },
      { subject: "Database Lab", time: "11:00 - 01:00", room: "Lab 203", faculty: "Dr. Emily Brown", type: "Lab" },
    ],
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Lecture": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "Lab": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "Seminar": return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Timetable</h1>
          <p className="text-muted-foreground mt-2">Your weekly class schedule</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <CalendarIcon className="w-4 h-4 mr-2" />
            Add to Calendar
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="Monday" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          {days.map((day) => (
            <TabsTrigger key={day} value={day}>{day}</TabsTrigger>
          ))}
        </TabsList>

        {days.map((day) => (
          <TabsContent key={day} value={day} className="space-y-4">
            {schedule[day as keyof typeof schedule].map((session, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{session.subject}</CardTitle>
                    <Badge className={getTypeColor(session.type)}>{session.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{session.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{session.room}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>{session.faculty}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>

      {/* Recent Changes */}
      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <CalendarIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Schedule Update
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                Wednesday Seminar has been rescheduled from Room 301 to Auditorium
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">2 hours ago</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
