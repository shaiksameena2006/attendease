import { MessageSquare, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Messages() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground mt-2">Stay connected with your peers and clubs</p>
      </div>

      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <MessageSquare className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Messages</h3>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Your conversations will appear here once you start messaging with peers, clubs, or groups.
          </p>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Messaging Coming Soon
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                Direct messaging and group chats will be available soon for peer-to-peer communication, club discussions, and house activities.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}