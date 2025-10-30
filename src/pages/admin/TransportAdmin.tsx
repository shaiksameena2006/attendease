import { Bus, MapPin, User, Plus, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TransportAdmin() {
  const routes: any[] = [];
  const buses: any[] = [];
  const passes: any[] = [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Transport Administration</h1>
          <p className="text-muted-foreground mt-2">Manage routes, buses, and transport operations</p>
        </div>
      </div>

      <Tabs defaultValue="routes" className="space-y-6">
        <TabsList>
          <TabsTrigger value="routes">Routes</TabsTrigger>
          <TabsTrigger value="buses">Buses & Drivers</TabsTrigger>
          <TabsTrigger value="passes">Pass Management</TabsTrigger>
          <TabsTrigger value="tracking">Live Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="routes" className="space-y-4">
          <div className="flex justify-end">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Route
            </Button>
          </div>

          {routes.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <MapPin className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">No routes configured yet</p>
              </CardContent>
            </Card>
          ) : (
            routes.map((route) => (
            <Card key={route.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{route.name}</h3>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>{route.buses} buses</span>
                        <span>{route.stops} stops</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={route.active ? "default" : "secondary"}>
                      {route.active ? "Active" : "Inactive"}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="buses" className="space-y-4">
          <div className="flex justify-end">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Bus
            </Button>
          </div>

          {buses.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Bus className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">No buses configured yet</p>
              </CardContent>
            </Card>
          ) : (
            buses.map((bus) => (
            <Card key={bus.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Bus className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{bus.id}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{bus.route}</p>
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4" />
                        <span>{bus.driver}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={bus.status === "active" ? "default" : "secondary"}>
                      {bus.status}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-2">
                      Capacity: {bus.capacity}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="passes" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Active Passes: {passes.length}</CardTitle>
                <Button variant="outline">Approve Pending</Button>
              </div>
            </CardHeader>
            <CardContent>
              {passes.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No bus passes issued yet</p>
              ) : (
                <div className="space-y-3">
                  {passes.map((pass, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <p className="font-medium">{pass.student}</p>
                      <p className="text-sm text-muted-foreground">
                        {pass.passId} • {pass.route}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="default">{pass.status}</Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        Valid until {pass.validUntil}
                      </p>
                    </div>
                  </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Live Bus Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {buses.filter(b => b.status === "active").map((bus) => (
                  <div key={bus.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <p className="font-medium">{bus.id}</p>
                      <p className="text-sm text-muted-foreground">{bus.route}</p>
                    </div>
                    <Button variant="outline" size="sm">View on Map</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
