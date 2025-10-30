import { Award, Plus, CheckCircle, Clock, Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function CertificateGenerator() {
  const templates: any[] = [];
  const recentCertificates: any[] = [];
  const selectedStudents: any[] = [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Certificate Generator</h1>
          <p className="text-muted-foreground mt-2">Create and issue certificates to students</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Generate Certificate
        </Button>
      </div>

      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="generate">Generate New</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          {templates.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Award className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">No certificate templates available</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Award className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{template.name}</h3>
                        <Badge variant="outline" className="mt-1">{template.category}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Used {template.uses} times</span>
                    <Button variant="outline" size="sm">Use Template</Button>
                  </div>
                </CardContent>
              </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="generate" className="space-y-6">
          {/* Step 1: Select Template */}
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Select Template</CardTitle>
            </CardHeader>
            <CardContent>
              {templates.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No templates available</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {templates.map((template) => (
                  <button
                    key={template.id}
                    className="p-4 rounded-lg border hover:border-primary hover:bg-accent transition-colors text-left"
                  >
                    <Award className="w-6 h-6 text-primary mb-2" />
                    <p className="font-medium text-sm">{template.name}</p>
                  </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Step 2: Select Students */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Step 2: Select Students</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search students..." className="pl-10 w-64" />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {selectedStudents.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No students selected</p>
              ) : (
                <>
                  <div className="space-y-2">
                    {selectedStudents.map((student, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-accent">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                      <Avatar>
                        <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.rollNo} • {student.class}</p>
                      </div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">{selectedStudents.length} students selected</p>
                    <Button variant="outline" size="sm">Select from Class</Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Step 3: Customize & Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Step 3: Customize & Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Certificate Title</label>
                  <Input placeholder="Enter certificate title" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Issue Date</label>
                  <Input type="date" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Input placeholder="Enter description" />
                </div>
              </div>
              
              <div className="p-8 bg-muted rounded-lg border-2 border-dashed border-border">
                <div className="text-center">
                  <Award className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">Certificate preview will appear here</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">Preview</Button>
                <Button className="flex-1">Generate & Submit for Approval</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {recentCertificates.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Award className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">No certificates issued yet</p>
              </CardContent>
            </Card>
          ) : (
            recentCertificates.map((cert, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{cert.student.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{cert.student}</p>
                      <p className="text-sm text-muted-foreground">{cert.template}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div>
                      <Badge variant={cert.status === "approved" ? "default" : "secondary"}>
                        {cert.status === "approved" ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <Clock className="w-3 h-3 mr-1" />
                        )}
                        {cert.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{cert.date}</p>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
