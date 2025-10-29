import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Events() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Events</h1>
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Events list coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
