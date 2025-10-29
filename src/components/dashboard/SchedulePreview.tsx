import { Clock, MapPin, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ClassSession {
  id: string;
  subject: string;
  time: string;
  duration: string;
  room: string;
  faculty?: string;
  status: "upcoming" | "ongoing" | "completed";
}

interface SchedulePreviewProps {
  sessions: ClassSession[];
  title?: string;
}

const statusColors = {
  upcoming: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  ongoing: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  completed: "bg-muted text-muted-foreground",
};

export function SchedulePreview({ sessions, title = "Today's Schedule" }: SchedulePreviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold">{session.subject}</h4>
                  <Badge className={statusColors[session.status]}>
                    {session.status}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{session.time} ({session.duration})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{session.room}</span>
                  </div>
                  {session.faculty && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{session.faculty}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
