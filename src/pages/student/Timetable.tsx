import { Calendar as CalendarIcon, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Timetable() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Timetable</h1>
          <p className="text-muted-foreground mt-2">Your weekly class schedule</p>
        </div>
      </div>

      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <CalendarIcon className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Timetable Available</h3>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Your class timetable hasn't been uploaded yet. Once your faculty adds the schedule, it will appear here.
          </p>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                How Timetables Work
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                Faculty will create and upload your class schedule. You'll receive automatic notifications for any schedule changes or updates.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}