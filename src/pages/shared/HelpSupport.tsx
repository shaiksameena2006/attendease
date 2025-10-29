import { HelpCircle, MessageSquare, Book, Video, Mail, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function HelpSupport() {
  const faqs = [
    {
      question: "How do I mark my attendance?",
      answer: "You can mark attendance using face recognition when you're near the classroom or by scanning the QR code provided by your faculty.",
    },
    {
      question: "How do I view my timetable?",
      answer: "Navigate to the Schedule tab from the bottom navigation or go to Student > Timetable from the menu.",
    },
    {
      question: "How do I join a club?",
      answer: "Go to Clubs & Houses from the menu, browse available clubs, and click Join on the club you're interested in.",
    },
    {
      question: "How can I download my certificates?",
      answer: "Go to Certificates from the menu, find your certificate, and click the Download button.",
    },
    {
      question: "What if I forgot my password?",
      answer: "Click on 'Forgot Password' on the login screen and follow the instructions sent to your email.",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Help & Support</h1>
        <p className="text-muted-foreground mt-2">Find answers and get assistance</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search for help..."
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Book className="w-8 h-8 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold mb-1">User Guide</h3>
            <p className="text-sm text-muted-foreground">Comprehensive documentation</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Video className="w-8 h-8 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold mb-1">Video Tutorials</h3>
            <p className="text-sm text-muted-foreground">Step-by-step guides</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <MessageSquare className="w-8 h-8 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold mb-1">Live Chat</h3>
            <p className="text-sm text-muted-foreground">Chat with support team</p>
          </CardContent>
        </Card>
      </div>

      {/* FAQs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Contact Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Contact Support
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Subject</label>
            <Input placeholder="What do you need help with?" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Message</label>
            <Textarea
              placeholder="Describe your issue in detail..."
              rows={6}
            />
          </div>
          <Button className="w-full">
            <Mail className="w-4 h-4 mr-2" />
            Send Message
          </Button>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Application</span>
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-600 dark:bg-emerald-400 rounded-full" />
                Operational
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Database</span>
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-600 dark:bg-emerald-400 rounded-full" />
                Operational
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Notifications</span>
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-600 dark:bg-emerald-400 rounded-full" />
                Operational
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
