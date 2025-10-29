import { Trophy, Users, Calendar, TrendingUp, Plus, Crown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function ClubsHouses() {
  const houses = [
    { name: "Red House", color: "bg-red-500", points: 1250, members: 156, rank: 2 },
    { name: "Blue House", color: "bg-blue-500", points: 1420, members: 168, rank: 1 },
    { name: "Green House", color: "bg-emerald-500", points: 1180, members: 142, rank: 3 },
    { name: "Orange House", color: "bg-orange-500", points: 980, members: 134, rank: 4 },
  ];

  const myClubs = [
    { name: "Coding Club", role: "Member", members: 85, nextEvent: "Hackathon 2024" },
    { name: "Photography Club", role: "Core Team", members: 42, nextEvent: "Photo Walk" },
  ];

  const allClubs = [
    { name: "Robotics Club", category: "Technical", members: 67, description: "Build and program robots" },
    { name: "Music Club", category: "Cultural", members: 89, description: "Learn and perform music" },
    { name: "Drama Club", category: "Cultural", members: 54, description: "Theatre and performances" },
    { name: "Sports Club", category: "Sports", members: 123, description: "Various sports activities" },
  ];

  const recentActivities = [
    { activity: "Hackathon Registration Open", club: "Coding Club", points: "+50", date: "2 hours ago" },
    { activity: "Won Photography Contest", club: "Photography Club", points: "+100", date: "1 day ago" },
    { activity: "Sports Day Participation", house: "Blue House", points: "+75", date: "2 days ago" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Clubs & Houses</h1>
        <p className="text-muted-foreground mt-2">Join clubs and represent your house</p>
      </div>

      {/* My House */}
      <Card className="bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border-blue-500/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Blue House</h3>
                <p className="text-sm text-muted-foreground">Rank #1 - 1420 points</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Crown className="w-4 h-4 mr-2" />
              Your House
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="houses" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="houses">Houses</TabsTrigger>
          <TabsTrigger value="my-clubs">My Clubs</TabsTrigger>
          <TabsTrigger value="discover">Discover Clubs</TabsTrigger>
        </TabsList>

        <TabsContent value="houses" className="space-y-6">
          {/* Leaderboard */}
          <div className="space-y-4">
            {houses.map((house, index) => (
              <Card key={index} className={house.rank === 1 ? "border-primary" : ""}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-muted-foreground">#{house.rank}</span>
                        <div className={`w-12 h-12 ${house.color} rounded-lg`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{house.name}</h3>
                        <p className="text-sm text-muted-foreground">{house.members} members</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{house.points}</p>
                      <p className="text-xs text-muted-foreground">points</p>
                    </div>
                  </div>
                  <Progress value={(house.points / 1500) * 100} className="h-2 mt-4" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Recent House Activities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivities.filter(a => a.house).map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">{activity.activity}</p>
                    <p className="text-sm text-muted-foreground">{activity.house}</p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                      {activity.points}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{activity.date}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-clubs" className="space-y-4">
          {myClubs.map((club, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {club.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{club.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">{club.role}</Badge>
                        <span className="text-sm text-muted-foreground">{club.members} members</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>Next: {club.nextEvent}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Activities
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Members
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Club Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Club Activities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivities.filter(a => a.club).map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">{activity.activity}</p>
                    <p className="text-sm text-muted-foreground">{activity.club}</p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                      {activity.points}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{activity.date}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discover" className="space-y-4">
          {allClubs.map((club, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-muted">
                        {club.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{club.name}</h3>
                      <p className="text-sm text-muted-foreground">{club.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <Badge variant="outline">{club.category}</Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {club.members} members
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Join
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
