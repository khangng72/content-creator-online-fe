"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Cookies from "js-cookie";

interface ApiUserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  nationality: string;
  birthday: string;
  active: boolean;
  admin: boolean;
}

interface ApiResponse {
  result: ApiUserData;
  status: number;
}

interface ProfileData extends ApiUserData {
  bio: string;
  location: string;
  socialLinks: Array<{
    platform: string;
    url: string;
  }>;
}

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const token = Cookies.get("token");

      if (!token) {
        throw new Error("Token not found");
      }

      const headers = new Headers();
      headers.append("Authorization", `Bearer ${token}`);
      const response = await fetch("http://localhost:8080/user/profile", {
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();

      if (data.status === 200) {
        setProfileData({
          ...data.result,
          bio: "Frontend Developer | React Enthusiast",
          location: "San Francisco, CA",
          socialLinks: [
            { platform: "Twitter", url: "twitter.com/user" },
            { platform: "GitHub", url: "github.com/user" },
          ],
        });
      } else {
        throw new Error("Failed to fetch profile data");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error(err); // Log lỗi để kiểm tra
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        No profile data available
      </div>
    );
  }

  const getInitials = () => {
    return `${profileData.firstName[0]}${profileData.lastName[0]}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative w-full h-48 md:h-64 bg-gradient-to-r from-blue-400 to-purple-500 rounded-t-lg overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      <div className="relative px-4 pb-4">
        <div className="absolute -top-16 left-4">
          <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${getInitials()}`}
            />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
        </div>

        <div className="ml-36 pt-4 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{`${profileData.firstName} ${profileData.lastName}`}</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {profileData.email}
            </p>
          </div>
          <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Save Profile" : "Edit Profile"}
          </Button>
        </div>
      </div>

      <div className="mt-6">
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="about">
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Bio</h3>
                  {isEditing ? (
                    <Textarea
                      value={profileData.bio}
                      onChange={(e) =>
                        setProfileData((prev) =>
                          prev ? { ...prev, bio: e.target.value } : prev
                        )
                      }
                      className="w-full"
                    />
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400">
                      {profileData.bio}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500">
                      Email
                    </h3>
                    <p>{profileData.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500">
                      Birthday
                    </h3>
                    <p>{formatDate(profileData.birthday)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500">
                      Nationality
                    </h3>
                    <p>{profileData.nationality}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500">
                      Gender
                    </h3>
                    <p>{profileData.gender}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Social Links</h3>
                  <div className="flex gap-2 flex-wrap">
                    {profileData.socialLinks.map((link, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="hover:bg-secondary/80"
                      >
                        <a
                          href={`https://${link.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {link.platform}
                        </a>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="details">
            <Card className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500">
                      Account Status
                    </h3>
                    <Badge
                      variant={profileData.active ? "default" : "destructive"}
                    >
                      {profileData.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500">
                      Role
                    </h3>
                    <Badge
                      variant={profileData.admin ? "default" : "secondary"}
                    >
                      {profileData.admin ? "Admin" : "User"}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Profile Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email Notifications
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                    />
                    <span>Receive email notifications</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Profile Visibility
                  </label>
                  <select className="w-full rounded-md border border-gray-300 p-2">
                    <option>Public</option>
                    <option>Private</option>
                    <option>Friends Only</option>
                  </select>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
