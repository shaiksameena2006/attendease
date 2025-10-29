import { Calendar, Users, MapPin, Clock, Plus, CheckCircle, XCircle, Image } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

export default function EventManagement() {
  const myEvents = [
    { 
      name: "React Workshop", 
      date: "2024-01-20", 
      time: "02:00 PM",
      venue: "Lab 102", 
      registered: 45, 
      capacity: 50,
      status: "approved" 
    },
    { 
      name: "Tech Talk Series", 
      date: "2024-01-25", 
      time: "04:00 PM",
      venue: "Auditorium", 
      registered: 120, 
      capacity: 150,
      status: "pending" 
    },
  ];

  const attendees = [
    { name: "John Doe", rollNo: "CS2024001", status: "present" },
    { name: "Jane Smith", rollNo: "CS2024002", status: "present" },
    { name: "Mike Johnson", rollNo: "CS2024003", status: "absent" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Event Management</h1>
          <p className="text-muted-foreground mt-2">Create and manage campus events</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </div>

      <Tabs defaultValue="my-events" className="space-y-6">
        <TabsList>
          <TabsTrigger value="my-events">My Events</TabsTrigger>
          <TabsTrigger value="create">Create New</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="my-events" className="space-y-4">
          {myEvents.map((event, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{event.name}</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{event.date}</span>
                        <Clock className="w-4 h-4 ml-2" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{event.venue}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{event.registered} / {event.capacity} registered</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={event.status === "approved" ? "default" : "secondary"}>
                    {event.status === "approved" ? (
                      <CheckCircle className="w-3 h-3 mr-1" />
                    ) : (
                      <Clock className="w-3 h-3 mr-1" />
                    )}
                    {event.status}
                  </Badge>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">View Attendees</Button>
                  <Button variant="outline" size="sm">Mark Attendance</Button>
                  <Button variant="outline" size="sm">Edit Event</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Event Name *</label>
                  <Input placeholder="Enter event name" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Category *</label>
                  <Input placeholder="e.g., Workshop, Seminar, Competition" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Date *</label>
                  <Input type="date" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Time *</label>
                  <Input type="time" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Venue *</label>
                  <Input placeholder="Enter venue" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Capacity *</label>
                  <Input type="number" placeholder="Max participants" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-2 block">Description *</label>
                  <Textarea placeholder="Describe your event..." rows={4} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-2 block">Event Banner</label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                    <Image className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1">Save as Draft</Button>
                <Button className="flex-1">Submit for Approval</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">Total Events</p>
                <p className="text-3xl font-bold">12</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">Total Participants</p>
                <p className="text-3xl font-bold">456</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">Avg Attendance</p>
                <p className="text-3xl font-bold">92%</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Event Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myEvents.map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <p className="font-semibold">{event.name}</p>
                      <p className="text-sm text-muted-foreground">{event.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{Math.round((event.registered / event.capacity) * 100)}%</p>
                      <p className="text-xs text-muted-foreground">Registration</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Attendees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {attendees.map((attendee, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">{attendee.name}</p>
                      <p className="text-sm text-muted-foreground">{attendee.rollNo}</p>
                    </div>
                    {attendee.status === "present" ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
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
