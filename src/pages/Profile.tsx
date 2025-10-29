import { User, Mail, BookOpen, Calendar, MapPin, Phone, Edit2, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    contact: "",
    department: "",
    branch: "",
    year: "",
    skills: "",
    interests: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      setProfile(data);
      setFormData({
        full_name: data?.full_name || "",
        contact: data?.contact || "",
        department: data?.department || "",
        branch: data?.branch || "",
        year: data?.year?.toString() || "",
        skills: data?.skills?.join(", ") || "",
        interests: data?.interests?.join(", ") || "",
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
          contact: formData.contact,
          department: formData.department,
          branch: formData.branch,
          year: formData.year ? parseInt(formData.year) : null,
          skills: formData.skills ? formData.skills.split(",").map(s => s.trim()) : [],
          interests: formData.interests ? formData.interests.split(",").map(s => s.trim()) : [],
        })
        .eq("id", user?.id);

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      });
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-96">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="w-32 h-32 border-4 border-primary">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback className="text-3xl">
                {profile?.full_name?.split(" ").map((n: string) => n[0]).join("") || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold">{profile?.full_name || "User"}</h1>
              <p className="text-muted-foreground mt-1">{profile?.email}</p>
              <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                {profile?.department && <Badge variant="secondary">{profile.department}</Badge>}
                {profile?.year && <Badge variant="secondary">Year {profile.year}</Badge>}
              </div>
            </div>
            <Button onClick={() => isEditing ? handleSave() : setIsEditing(true)} disabled={saving}>
              {isEditing ? (
                <><Save className="w-4 h-4 mr-2" />{saving ? "Saving..." : "Save"}</>
              ) : (
                <><Edit2 className="w-4 h-4 mr-2" />Edit Profile</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                {isEditing ? (
                  <Input value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} />
                ) : (
                  <span>{profile?.full_name || "Not set"}</span>
                )}
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Email</Label>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{profile?.email}</span>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Contact</Label>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                {isEditing ? (
                  <Input value={formData.contact} onChange={(e) => setFormData({ ...formData, contact: e.target.value })} />
                ) : (
                  <span>{profile?.contact || "Not set"}</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Academic Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Department</Label>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-muted-foreground" />
                {isEditing ? (
                  <Input value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} />
                ) : (
                  <span>{profile?.department || "Not set"}</span>
                )}
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Branch</Label>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                {isEditing ? (
                  <Input value={formData.branch} onChange={(e) => setFormData({ ...formData, branch: e.target.value })} />
                ) : (
                  <span>{profile?.branch || "Not set"}</span>
                )}
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Year</Label>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                {isEditing ? (
                  <Input type="number" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} />
                ) : (
                  <span>{profile?.year || "Not set"}</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Skills & Interests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Skills (comma-separated)</Label>
            {isEditing ? (
              <Input placeholder="React, TypeScript, Python" value={formData.skills} onChange={(e) => setFormData({ ...formData, skills: e.target.value })} />
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile?.skills?.length > 0 ? profile.skills.map((skill: string, i: number) => (
                  <Badge key={i} variant="secondary">{skill}</Badge>
                )) : <span className="text-sm text-muted-foreground">No skills added</span>}
              </div>
            )}
          </div>
          <Separator />
          <div className="space-y-2">
            <Label>Interests (comma-separated)</Label>
            {isEditing ? (
              <Input placeholder="Web Development, AI, Sports" value={formData.interests} onChange={(e) => setFormData({ ...formData, interests: e.target.value })} />
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile?.interests?.length > 0 ? profile.interests.map((interest: string, i: number) => (
                  <Badge key={i} variant="outline">{interest}</Badge>
                )) : <span className="text-sm text-muted-foreground">No interests added</span>}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
