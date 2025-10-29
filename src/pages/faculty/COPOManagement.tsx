import { Target, TrendingUp, FileText, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function COPOManagement() {
  const courseOutcomes = [
    { id: "CO1", description: "Understand fundamental web development concepts", achievement: 85 },
    { id: "CO2", description: "Build responsive web applications using React", achievement: 78 },
    { id: "CO3", description: "Implement REST APIs and database integration", achievement: 92 },
    { id: "CO4", description: "Apply security best practices in web development", achievement: 88 },
  ];

  const programOutcomes = [
    { id: "PO1", description: "Engineering Knowledge", mapped: ["CO1", "CO3"] },
    { id: "PO2", description: "Problem Analysis", mapped: ["CO2", "CO4"] },
    { id: "PO3", description: "Design/Development", mapped: ["CO2", "CO3"] },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">CO-PO Management</h1>
          <p className="text-muted-foreground mt-2">Manage Course and Program Outcomes</p>
        </div>
        <Button>
          <FileText className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </div>

      <Tabs defaultValue="course-outcomes" className="space-y-6">
        <TabsList>
          <TabsTrigger value="course-outcomes">Course Outcomes</TabsTrigger>
          <TabsTrigger value="program-outcomes">Program Outcomes</TabsTrigger>
          <TabsTrigger value="mapping">CO-PO Mapping</TabsTrigger>
          <TabsTrigger value="assessment">Assessment</TabsTrigger>
        </TabsList>

        <TabsContent value="course-outcomes" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Define and track course-specific learning outcomes
            </p>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add CO
            </Button>
          </div>

          {courseOutcomes.map((co) => (
            <Card key={co.id}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{co.id}</Badge>
                        <h3 className="font-semibold">{co.description}</h3>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Student Achievement</span>
                      <span className="font-semibold">{co.achievement}%</span>
                    </div>
                    <Progress value={co.achievement} className="h-2" />
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">View Assessments</Button>
                    <Button variant="outline" size="sm">Student Performance</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="program-outcomes" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Program-wide learning outcomes for the degree
            </p>
          </div>

          {programOutcomes.map((po) => (
            <Card key={po.id}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge>{po.id}</Badge>
                        <h3 className="font-semibold">{po.description}</h3>
                      </div>
                      <div className="flex gap-2 mt-3">
                        {po.mapped.map((co) => (
                          <Badge key={co} variant="outline">{co}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm">View Mapping Details</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="mapping" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>CO-PO Mapping Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-3 bg-muted text-left font-semibold">CO</th>
                      {programOutcomes.map(po => (
                        <th key={po.id} className="border p-3 bg-muted text-center font-semibold">
                          {po.id}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {courseOutcomes.map(co => (
                      <tr key={co.id}>
                        <td className="border p-3 font-medium">{co.id}</td>
                        {programOutcomes.map(po => {
                          const isMapped = po.mapped.includes(co.id);
                          return (
                            <td key={po.id} className="border p-3 text-center">
                              {isMapped ? (
                                <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                                  High
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mapping Legend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">High</Badge>
                  <span className="text-sm">Strong correlation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">Medium</Badge>
                  <span className="text-sm">Moderate correlation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Low</Badge>
                  <span className="text-sm">Weak correlation</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assessment Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "Mid-term Examination", cos: ["CO1", "CO2"], weight: 30 },
                { name: "Project Assignment", cos: ["CO2", "CO3"], weight: 40 },
                { name: "Final Examination", cos: ["CO1", "CO3", "CO4"], weight: 30 },
              ].map((assessment, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-primary" />
                      <div>
                        <h4 className="font-semibold">{assessment.name}</h4>
                        <div className="flex gap-2 mt-1">
                          {assessment.cos.map(co => (
                            <Badge key={co} variant="outline" className="text-xs">{co}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{assessment.weight}%</p>
                    <p className="text-xs text-muted-foreground">Weight</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attainment Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-semibold">Direct Assessment</p>
                    <p className="text-sm text-muted-foreground">Exam & Assignment based</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-emerald-600">85%</p>
                    <p className="text-xs text-muted-foreground">Average attainment</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-semibold">Indirect Assessment</p>
                    <p className="text-sm text-muted-foreground">Feedback & Surveys</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-emerald-600">82%</p>
                    <p className="text-xs text-muted-foreground">Average attainment</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
