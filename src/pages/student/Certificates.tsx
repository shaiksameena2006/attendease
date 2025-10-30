import { Award, FileCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Certificates() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Certificates</h1>
          <p className="text-muted-foreground mt-2">View and manage your digital certificates</p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          0 Total
        </Badge>
      </div>

      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Award className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Certificates Yet</h3>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Your earned certificates will appear here once they are issued by faculty or administrators. Complete workshops, competitions, and events to earn certificates.
          </p>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <FileCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                How Certificates Work
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                Administrators and faculty can issue certificates for achievements, workshop completions, and event participation. All certificates are digitally verified with QR codes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}