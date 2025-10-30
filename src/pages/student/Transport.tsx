import { Bus, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Transport() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Transport</h1>
        <p className="text-muted-foreground mt-2">Manage your bus pass and track buses</p>
      </div>

      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Bus className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Transport Information</h3>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Transport routes and bus passes will be configured by administrators. Once set up, you can view routes, track buses, and manage your digital pass.
          </p>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Transport System
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                Administrators can set up bus routes, schedules, and digital passes. You'll be able to track buses in real-time and access your QR-coded bus pass.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}