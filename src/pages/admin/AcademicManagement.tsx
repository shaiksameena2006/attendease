import { GraduationCap, Calendar, BookOpen, FileText, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AcademicManagement() {
  const departments = [
    { name: "Computer Science Engineering", hod: "Dr. Sarah Johnson", students: 420, faculty: 28 },
    { name: "Electronics & Communication", hod: "Dr. Michael Chen", students: 385, faculty: 24 },
    { name: "Mechanical Engineering", hod: "Prof. James Wilson", students: 450, faculty: 32 },
  ];

  const courses = [
    { code: "CS301", name: "Data Structures & Algorithms", credits: 4, semester: 3 },
    { code: "CS302", name: "Database Management Systems", credits: 4, semester: 3 },
    { code: "CS401", name: "Web Development", credits: 3, semester: 4 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Academic Management</h1>
          <p className="text-muted-foreground mt-2">Manage courses, departments, and academic calendar</p>
        </div>
      </div>

      <Tabs defaultValue="departments" className="space-y-6">
        <TabsList>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="calendar">Academic Calendar</TabsTrigger>
          <TabsTrigger value="examinations">Examinations</TabsTrigger>
        </TabsList>

        <TabsContent value="departments" className="space-y-4">
          <div className="flex justify-end">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Department
            </Button>
          </div>

          {departments.map((dept, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <GraduationCap className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{dept.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">Head: {dept.hod}</p>
                      <div className="flex gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Students: </span>
                          <span className="font-medium">{dept.students}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Faculty: </span>
                          <span className="font-medium">{dept.faculty}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
          <div className="flex justify-between items-center">
            <Input placeholder="Search courses..." className="max-w-sm" />
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Course
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="outline">{course.code}</Badge>
                    <Badge>{course.credits} Credits</Badge>
                  </div>
                  <h3 className="font-semibold mb-2">{course.name}</h3>
                  <p className="text-sm text-muted-foreground">Semester {course.semester}</p>
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Academic Year 2024-25</CardTitle>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Event
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { event: "Semester 1 Begins", date: "2024-08-01", type: "academic" },
                  { event: "Mid-term Examinations", date: "2024-09-15 - 2024-09-20", type: "exam" },
                  { event: "Tech Fest 2024", date: "2024-10-05 - 2024-10-07", type: "event" },
                  { event: "Semester 1 Ends", date: "2024-12-15", type: "academic" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">{item.event}</p>
                        <p className="text-sm text-muted-foreground">{item.date}</p>
                      </div>
                    </div>
                    <Badge variant={item.type === "exam" ? "default" : "secondary"}>
                      {item.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examinations" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Examination Schedule</CardTitle>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule Exam
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { course: "Data Structures", date: "2024-09-15", time: "10:00 AM", venue: "Hall A" },
                  { course: "Database Management", date: "2024-09-17", time: "02:00 PM", venue: "Hall B" },
                  { course: "Web Development", date: "2024-09-19", time: "10:00 AM", venue: "Lab 102" },
                ].map((exam, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <p className="font-medium">{exam.course}</p>
                      <p className="text-sm text-muted-foreground">
                        {exam.date} • {exam.time} • {exam.venue}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">Edit</Button>
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
