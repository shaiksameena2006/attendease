import { Award, Download, Share2, QrCode, Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Certificates() {
  const certificates = [
    {
      id: "CERT-2024-001",
      title: "Hackathon Winner",
      issuer: "Coding Club",
      date: "2024-01-10",
      category: "Competition",
      verified: true,
    },
    {
      id: "CERT-2024-002",
      title: "Workshop Completion - React Advanced",
      issuer: "Prof. Michael Chen",
      date: "2024-01-05",
      category: "Workshop",
      verified: true,
    },
    {
      id: "CERT-2023-089",
      title: "Photography Excellence",
      issuer: "Photography Club",
      date: "2023-12-20",
      category: "Achievement",
      verified: true,
    },
    {
      id: "CERT-2023-078",
      title: "Sports Day Participation",
      issuer: "Sports Committee",
      date: "2023-12-15",
      category: "Participation",
      verified: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Certificates</h1>
          <p className="text-muted-foreground mt-2">View and manage your digital certificates</p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {certificates.length} Total
        </Badge>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search certificates..."
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All ({certificates.length})</TabsTrigger>
          <TabsTrigger value="competition">Competition</TabsTrigger>
          <TabsTrigger value="workshop">Workshop</TabsTrigger>
          <TabsTrigger value="achievement">Achievement</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.map((cert) => (
              <Card key={cert.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Award className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{cert.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{cert.issuer}</p>
                      </div>
                    </div>
                    {cert.verified && (
                      <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                        Verified
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Certificate ID</span>
                    <span className="font-mono">{cert.id}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Issue Date</span>
                    <span>{cert.date}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Category</span>
                    <Badge variant="outline">{cert.category}</Badge>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm">
                      <QrCode className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="competition" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.filter(c => c.category === "Competition").map((cert) => (
              <Card key={cert.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Award className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{cert.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{cert.issuer}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="workshop" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.filter(c => c.category === "Workshop").map((cert) => (
              <Card key={cert.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Award className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{cert.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{cert.issuer}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievement" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.filter(c => c.category === "Achievement").map((cert) => (
              <Card key={cert.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Award className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{cert.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{cert.issuer}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Achievement Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Achievement Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {certificates.map((cert, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 text-primary" />
                  </div>
                  {index < certificates.length - 1 && (
                    <div className="w-0.5 h-full bg-border my-2" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <p className="font-medium">{cert.title}</p>
                  <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                  <p className="text-xs text-muted-foreground mt-1">{cert.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
