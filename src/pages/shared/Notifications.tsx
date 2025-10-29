import { Bell, CheckCircle, AlertCircle, Info, Trash2, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function Notifications() {
  const notifications = [
    {
      id: 1,
      type: "alert",
      title: "Class Starting Soon",
      message: "Data Structures - Room 301 in 15 minutes",
      time: "10 mins ago",
      isRead: false,
    },
    {
      id: 2,
      type: "success",
      title: "Attendance Marked",
      message: "Your attendance for Web Development has been recorded",
      time: "1 hour ago",
      isRead: false,
    },
    {
      id: 3,
      type: "info",
      title: "New Event",
      message: "Tech Fest 2024 registration is now open",
      time: "2 hours ago",
      isRead: true,
    },
    {
      id: 4,
      type: "alert",
      title: "Assignment Due",
      message: "Database project submission due tomorrow",
      time: "5 hours ago",
      isRead: true,
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case "alert":
        return <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case "info":
        return <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      default:
        return <Bell className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground mt-2">Stay updated with your activities</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Check className="w-4 h-4 mr-2" />
            Mark All Read
          </Button>
          <Button variant="outline" size="sm">
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">
            All ({notifications.length})
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread ({notifications.filter(n => !n.isRead).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={cn(
                "hover:shadow-md transition-shadow cursor-pointer",
                !notification.isRead && "bg-accent/50"
              )}
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="mt-0.5">{getIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold">{notification.title}</h3>
                      {!notification.isRead && (
                        <Badge variant="default" className="shrink-0">New</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {notification.time}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="unread" className="space-y-3">
          {notifications
            .filter((n) => !n.isRead)
            .map((notification) => (
              <Card
                key={notification.id}
                className="bg-accent/50 hover:shadow-md transition-shadow cursor-pointer"
              >
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="mt-0.5">{getIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold">{notification.title}</h3>
                        <Badge variant="default" className="shrink-0">New</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {notification.time}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
