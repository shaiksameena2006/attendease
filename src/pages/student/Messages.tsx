import { Send, Search, Paperclip, Phone, Video, MoreVertical } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState<number>(0);

  const conversations = [
    { id: 0, name: "Coding Club", type: "group", lastMessage: "Meeting tomorrow at 5 PM", time: "10m ago", unread: 3 },
    { id: 1, name: "John Doe", type: "direct", lastMessage: "Hey! Did you complete the assignment?", time: "1h ago", unread: 1 },
    { id: 2, name: "Blue House", type: "group", lastMessage: "Great job everyone! 🎉", time: "2h ago", unread: 0 },
    { id: 3, name: "Jane Smith", type: "direct", lastMessage: "Thanks for your help!", time: "1d ago", unread: 0 },
    { id: 4, name: "Photography Club", type: "group", lastMessage: "Photo walk this Saturday", time: "2d ago", unread: 0 },
  ];

  const messages = [
    { id: 1, sender: "Sarah Johnson", message: "Don't forget about tomorrow's meeting!", time: "10:30 AM", isMe: false },
    { id: 2, sender: "Me", message: "I'll be there. What's the agenda?", time: "10:32 AM", isMe: true },
    { id: 3, sender: "Mike Wilson", message: "We'll discuss the hackathon project", time: "10:35 AM", isMe: false },
    { id: 4, sender: "Me", message: "Sounds good! Looking forward to it.", time: "10:36 AM", isMe: true },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground mt-2">Stay connected with your peers and clubs</p>
      </div>

      <Card className="h-[600px]">
        <CardContent className="p-0 h-full">
          <div className="grid grid-cols-12 h-full">
            {/* Conversations List */}
            <div className="col-span-12 md:col-span-4 border-r">
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search messages..." className="pl-10" />
                </div>
              </div>
              <ScrollArea className="h-[calc(600px-73px)]">
                <div className="divide-y">
                  {conversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedChat(conv.id)}
                      className={`w-full p-4 text-left hover:bg-accent transition-colors ${
                        selectedChat === conv.id ? 'bg-accent' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {conv.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold truncate">{conv.name}</h3>
                            <span className="text-xs text-muted-foreground">{conv.time}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                            {conv.unread > 0 && (
                              <Badge className="ml-2 bg-primary text-primary-foreground">{conv.unread}</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Chat Area */}
            <div className="col-span-12 md:col-span-8 flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {conversations[selectedChat].name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{conversations[selectedChat].name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {conversations[selectedChat].type === 'group' ? 'Group' : 'Online'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] ${msg.isMe ? '' : 'flex gap-2'}`}>
                        {!msg.isMe && (
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs">
                              {msg.sender.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div>
                          {!msg.isMe && (
                            <p className="text-xs text-muted-foreground mb-1">{msg.sender}</p>
                          )}
                          <div
                            className={`rounded-lg p-3 ${
                              msg.isMe
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <p className="text-sm">{msg.message}</p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Input
                    placeholder="Type a message..."
                    className="flex-1"
                  />
                  <Button size="icon">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
