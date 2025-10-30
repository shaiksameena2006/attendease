import { Calendar, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Events() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Events</h1>
        <p className="text-muted-foreground mt-2">Discover and register for campus events</p>
      </div>

      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Events Available</h3>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Campus events will be posted here by faculty and administrators. Check back soon for upcoming workshops, competitions, and cultural activities.
          </p>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Event Registration
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                Once events are created, you can browse by category, register to participate, and receive notifications about event updates and reminders.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}