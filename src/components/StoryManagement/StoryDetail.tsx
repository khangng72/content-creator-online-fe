"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Card, CardContent } from "../ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Badge } from "lucide-react";

export default function DetailStory() {
  const { id } = useParams();
  const [story, setStory] = useState<any>(null);

  useEffect(() => {
    setStory({
      title: "Tui là con chó",
      description: "con chó là tui",
      released: true,
      releaseDate: "2024-09-17",
      price: 200,
      tags: ["hihi", "haha"],
      parts: [
        { title: "Con Chó Mập", published: true, date: "2024-09-17", views: 47, likes: 1, comments: 0 },
        { title: "Untitled Part 2", published: false, date: "2024-12-12", views: 3, likes: 0, comments: 0 },
        { title: "Untitled Part 3", published: false, date: "2024-12-12" },
        { title: "Untitled Part 4", published: false, date: "2024-12-12" },
      ],
    });
  }, [id]);

  const [title, setTitle] = useState<string>(story?.title);
  useEffect(() => {
    if (story) {
      setTitle(story.title);
    }
  }, [story]);
  if (!story) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 min-h-screen">
      {/* Profile Card */}
      <Card className="p-4 text-center" style={{ marginTop: "64px" }}>
        <img
          src="https://static.vecteezy.com/system/resources/previews/021/334/027/non_2x/smiling-bernese-mountain-dog-avatar-tongue-hanging-out-cute-cartoon-pet-domestic-animal-vector.jpg"
          alt="story image"
          className="w-24 h-24 rounded-full mx-auto mb-2"
        />
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-gray-500">Number of like: 21</p>
      </Card>

      {/* Account Tabs */}
      <Tabs defaultValue="detail" className="flex-1" style={{ marginTop: "64px" }}>
        <TabsList className="mb-4 border-b">
          <TabsTrigger
            value="detail"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold"
          >
            Story details
          </TabsTrigger>
          <TabsTrigger
            value="content"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold ml-[2px]"
          >
            Table of Contents
          </TabsTrigger>
        </TabsList>
        <TabsContent value="detail">
          <Card className="p-6">
            <CardContent className="grid gap-4">
              <div>
                <label className="text-sm font-semibold">Title</label>
                <Input value={story.title} onChange={(e) => setStory({ title: e.target.value })} />
              </div>

              <div>
                <label className="text-sm font-semibold">Description</label>
                <Textarea value={story.description} onChange={(e) => setStory({ description: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-semibold">Release date</label>
                <Input type="Date" value={story.releaseDate} onChange={(e) => setStory({ releaseDate: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-semibold">Release status</label>
                <div className="flex items-center gap-4 mt-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="releaseStatus"
                      value="true"
                      checked={story.released === true}
                      onChange={(e) => setStory({ released: e.target.value })}
                      className="form-radio"
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="releaseStatus"
                      value="false"
                      checked={story.released === false}
                      onChange={(e) => setStory({ released: e.target.value })}
                      className="form-radio"
                    />
                    No
                  </label>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold">Sale price</label>
                <Input value={story.price} onChange={(e) => setStory({ price: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-semibold">Tags</label>
                <div className="flex gap-2 flex-wrap">
                  {story.tags?.map((tag: string, index: number) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="hover:bg-secondary/80"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button className="mt-4 w-full">Edit</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card className="p-6">
            <CardContent className="grid gap-4">
              <div>
                <h2 className="text-2xl font-bold mb-4">Chapter list</h2>
                <div className="space-y-2">
                  {story.parts?.map((part: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-4 border rounded shadow-sm hover:shadow-lg transition-all bg-card"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{part.title}</span>
                        {!part.published && <span className="text-xs text-gray-400">(Draft)</span>}
                      </div>
                      <div className="text-sm text-gray-500 flex gap-4">
                        {part.views !== undefined && <span>👁 {part.views}</span>}
                        {part.likes !== undefined && <span>❤️ {part.likes}</span>}
                        {part.comments !== undefined && <span>💬 {part.comments}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
