import { Bus, MapPin, Clock, QrCode, Navigation, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Transport() {
  const myPass = {
    id: "PASS-2024-0156",
    route: "Route 3 - Downtown Campus",
    validUntil: "2024-06-30",
    status: "Active",
  };

  const routes = [
    {
      name: "Route 1 - North Campus",
      buses: ["BUS-001", "BUS-002"],
      stops: ["Main Gate", "Library", "Sports Complex", "Hostel Block A"],
      frequency: "Every 15 mins",
    },
    {
      name: "Route 2 - South Campus",
      buses: ["BUS-003", "BUS-004"],
      stops: ["Main Gate", "Academic Block", "Cafeteria", "Hostel Block B"],
      frequency: "Every 20 mins",
    },
    {
      name: "Route 3 - Downtown Campus",
      buses: ["BUS-005", "BUS-006"],
      stops: ["Main Gate", "City Center", "Shopping District", "Tech Park"],
      frequency: "Every 30 mins",
    },
  ];

  const liveTracking = [
    { bus: "BUS-005", route: "Route 3", nextStop: "Main Gate", eta: "5 mins", passengers: 28 },
    { bus: "BUS-006", route: "Route 3", nextStop: "City Center", eta: "12 mins", passengers: 35 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Transport</h1>
        <p className="text-muted-foreground mt-2">Manage your bus pass and track buses</p>
      </div>

      {/* Digital Pass */}
      <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">Digital Bus Pass</h3>
              <p className="text-sm text-muted-foreground">{myPass.route}</p>
            </div>
            <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
              {myPass.status}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-xs text-muted-foreground">Pass ID</p>
              <p className="font-mono text-sm">{myPass.id}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Valid Until</p>
              <p className="text-sm">{myPass.validUntil}</p>
            </div>
          </div>

          <div className="flex justify-center p-6 bg-white dark:bg-muted rounded-lg mb-4">
            <div className="w-48 h-48 bg-muted dark:bg-background rounded-lg flex items-center justify-center">
              <QrCode className="w-32 h-32 text-muted-foreground" />
            </div>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Show this QR code to the bus driver when boarding
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="tracking" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tracking">Live Tracking</TabsTrigger>
          <TabsTrigger value="routes">Routes</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="tracking" className="space-y-4">
          {/* Live Tracking */}
          {liveTracking.map((bus, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Bus className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{bus.bus}</h3>
                      <p className="text-sm text-muted-foreground">{bus.route}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">{bus.passengers}/40 passengers</Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Next Stop:</span>
                    <span className="font-medium">{bus.nextStop}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">ETA:</span>
                    <span className="font-medium text-primary">{bus.eta}</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-4">
                  <Navigation className="w-4 h-4 mr-2" />
                  Track on Map
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="routes" className="space-y-4">
          {routes.map((route, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{route.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Active Buses</p>
                  <div className="flex gap-2">
                    {route.buses.map((bus, idx) => (
                      <Badge key={idx} variant="outline">{bus}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Stops</p>
                  <div className="space-y-2">
                    {route.stops.map((stop, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <span className="text-sm">{stop}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Frequency:</span>
                  <span className="font-medium">{route.frequency}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekday Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { time: "07:00 AM", route: "Route 3", from: "Main Gate", to: "Downtown" },
                  { time: "08:30 AM", route: "Route 3", from: "Main Gate", to: "Downtown" },
                  { time: "10:00 AM", route: "Route 3", from: "Downtown", to: "Main Gate" },
                  { time: "12:00 PM", route: "Route 3", from: "Main Gate", to: "Downtown" },
                  { time: "05:00 PM", route: "Route 3", from: "Downtown", to: "Main Gate" },
                  { time: "07:00 PM", route: "Route 3", from: "Downtown", to: "Main Gate" },
                ].map((schedule, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-4">
                      <div className="text-sm font-semibold w-20">{schedule.time}</div>
                      <Badge variant="outline">{schedule.route}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {schedule.from} → {schedule.to}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Pass Renewal */}
      <Card className="border-amber-200 dark:border-amber-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Pass Renewal Required</p>
              <p className="text-xs text-muted-foreground mt-1">
                Your bus pass expires on {myPass.validUntil}
              </p>
            </div>
            <Button size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Renew Pass
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
