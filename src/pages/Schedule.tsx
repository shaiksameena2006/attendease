import { useRole } from "@/contexts/RoleContext";
import { Calendar, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Timetable from "./student/Timetable";

export default function Schedule() {
  const { role } = useRole();

  // Students see their timetable
  if (role === "student") {
    return <Timetable />;
  }

  // Faculty and admin see empty state
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Schedule</h1>
        <p className="text-muted-foreground mt-2">View and manage schedules</p>
      </div>

      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Schedule Management</h3>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            {role === "faculty" 
              ? "Create and manage class timetables from the Faculty section."
              : "Manage all timetables and schedules from the Admin section."}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Quick Access
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                {role === "faculty"
                  ? "Access the timetable manager from the hamburger menu to create and edit class schedules."
                  : "Access academic management from the hamburger menu to oversee all schedules."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}