import { Bell, Calendar, AlertCircle, CheckCircle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "alert";
  title: string;
  message: string;
  time: string;
  isRead?: boolean;
}

interface NotificationPanelProps {
  notifications: Notification[];
  maxHeight?: string;
}

const notificationIcons = {
  info: Info,
  success: CheckCircle,
  warning: AlertCircle,
  alert: Bell,
};

const notificationColors = {
  info: "text-blue-600 dark:text-blue-400",
  success: "text-emerald-600 dark:text-emerald-400",
  warning: "text-amber-600 dark:text-amber-400",
  alert: "text-red-600 dark:text-red-400",
};

export function NotificationPanel({ notifications, maxHeight = "400px" }: NotificationPanelProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">Recent Notifications</CardTitle>
        <Badge variant="secondary">{notifications.filter(n => !n.isRead).length} new</Badge>
      </CardHeader>
      <CardContent>
        <ScrollArea className={cn("pr-4")} style={{ maxHeight }}>
          <div className="space-y-4">
            {notifications.map((notification) => {
              const Icon = notificationIcons[notification.type];
              return (
                <div
                  key={notification.id}
                  className={cn(
                    "flex gap-3 p-3 rounded-lg transition-colors",
                    notification.isRead ? "bg-muted/30" : "bg-accent/50"
                  )}
                >
                  <div className={cn("mt-0.5", notificationColors[notification.type])}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {notification.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
