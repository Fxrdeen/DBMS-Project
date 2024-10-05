"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, X } from "lucide-react";
import React from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { User, UserWithSkills } from "@/types";
import { getUserDetails, getUserWithSkills } from "@/server";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserDetails } from "@/server";
import { useToast } from "@/hooks/use-toast";

// Mock available skills (replace with actual skill data in your app)
const availableSkills = [
  "React",
  "Node.js",
  "MongoDB",
  "Python",
  "Java",
  "JavaScript",
  "Machine Learning",
  "SQL",
  "Figma",
  "Adobe XD",
  "Sketch",
  "Web Scraping",
  "Data Analysis",
  "Mobile Development",
  "React Native",
  "Backend Development",
];
export default function ProfilePage() {
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserWithSkills>();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState("");
  const { user } = useUser();
  const { data, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const result = await getUserDetails(
        user?.emailAddresses[0].emailAddress as string
      );
      return result as User[];
    },
    enabled: !!user?.emailAddresses[0].emailAddress,
  });
  const { data: userdata, isLoading: userdataLoading } = useQuery({
    queryKey: ["userdata"],
    queryFn: async () => {
      const result = await getUserWithSkills(data?.[0].user_id as number);
      const res = result as UserWithSkills[];
      setUserData(res[0]);
      return res[0];
    },
    enabled: !!data?.[0].user_id,
  });
  const queryClient = useQueryClient();

  const updateUserMutation = useMutation({
    mutationFn: updateUserDetails,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userdata"] });
      toast({
        title: "Profile updated successfully",
        variant: "default",
      });
      setIsEditing(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to update profile",
        variant: "destructive",
      });
      console.error("Error updating profile:", error);
    },
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => (prev ? { ...prev, [name]: value } : undefined));
  };

  const handleAddSkill = () => {
    if (selectedSkill && userData && !userData.skills.includes(selectedSkill)) {
      setUserData({
        ...userData,
        skills: [...userData.skills, selectedSkill],
      });
      setSelectedSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    if (userData) {
      setUserData({
        ...userData,
        skills: userData.skills.filter((skill) => skill !== skillToRemove),
      });
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userData) {
      updateUserMutation.mutate({
        userId: userData.user_id,
        name: userData.name,
        skills: userData.skills,
      });
    }
    console.log("Updating profile:", userData);
    setIsEditing(false);
  };
  if (isLoading || userdataLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin w-10 h-10" />
      </div>
    );
  }
  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>
            View and edit your profile information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={userData?.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="skills">Skills</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {userData?.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-sm">
                      {skill}
                      {isEditing && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-1 text-muted-foreground hover:text-foreground"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    <Select
                      value={selectedSkill}
                      onValueChange={setSelectedSkill}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a skill" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSkills.map((skill) => (
                          <SelectItem key={skill} value={skill}>
                            {skill}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button type="button" onClick={handleAddSkill}>
                      Add Skill
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-row">
          {isEditing ? (
            <div className="flex gap-6 justify-between">
              <Button type="submit" onClick={handleSubmit}>
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
