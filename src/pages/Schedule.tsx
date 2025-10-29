import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Schedule() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Schedule</h1>
      <Card>
        <CardHeader>
          <CardTitle>Your Timetable</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Schedule view coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
