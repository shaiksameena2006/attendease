import { Bell, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Notifications() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground mt-2">Stay updated with your activities</p>
        </div>
      </div>

      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Bell className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Notifications</h3>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            You'll receive notifications about classes, attendance, events, and important updates. They will appear here when available.
          </p>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Real-Time Updates
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                Notifications will alert you about attendance sessions, schedule changes, event registrations, and certificate issuance in real-time.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}