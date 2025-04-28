"use client";

import { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Card, CardContent } from "../ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import axios from "axios";
import Cookies from "js-cookie";
import { generateApi } from "@/constants/api";
import { useParams } from "next/navigation";

interface ApiStoryByIdData {
  releaseDate: string;
  storyId: string,
  createdDate: string;
  releaseStatus: boolean;
  storyTitle: string;
  saleOnly: boolean;
  salePrice: number | null;
  numberOfLikes: number;
  coverImageUri: string;
  storyDescription: string;
  tags: string;
  averageRating: number,
  userId: null
}

interface ApiChaptersByStoryIdData {
  chapterId: string,
  chapterTitle: string,
  chapterCreatedTime: string,
  isPublished: boolean,
  numberOfComment: number,
  numberOfLikes: number
}

export default function DetailStory() {
  const [story, setStory] = useState<ApiStoryByIdData | null>(null);
  const [chapters, setChapters] = useState<ApiChaptersByStoryIdData | null>(null);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef(null);
  const [storyTags, setStoryTags] = useState<string[]>([]);
  const router = useParams();
  const story_id = router.story_id;

  useEffect(() => {
    if(story_id) {
      fetchStoryById(story_id as string);
    }
  }, [story_id]);

  useEffect(() => {
    if (story?.tags) {
      const tagsArray = story.tags.split(",").map((tag) => tag.trim()); // Tách chuỗi và loại bỏ khoảng trắng
      setStoryTags(tagsArray);
    }
  }, [story]);

  useEffect(() => {
    if(story_id) {
      fetchChaptersByStoryId(story_id as string);
    }
  }, [story_id]);

  const fetchStoryById = async (storyId: string) => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      if (!token) {
        throw new Error("Token not found");
      }
      const headers = new Headers();
      headers.append("Authorization", `Bearer ${token}`);

      const res = await axios.get(generateApi("/story", storyId), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = res.data;
      setStory(data);
    } catch (err) {
      console.error("Error fetching story:", err);
    } finally {
      setLoading(false);
    }
  }

  const fetchChaptersByStoryId = async (storyId: string) => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      if (!token) {
        throw new Error("Token not found");
      }
      const headers = new Headers();
      headers.append("Authorization", `Bearer ${token}`);

      const res = await axios.get(generateApi("/story", storyId + "/chapters"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = res.data;
      setChapters(data);
    } catch (err) {
      console.error("Error fetching chapter:", err);
    } finally {
      setLoading(false);
    }
  }

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
        <h2 className="text-lg font-semibold">{story.storyTitle}</h2>
        <p className="text-sm text-gray-500">Number of like: {story.numberOfLikes}</p>
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
                <Input value={story.storyTitle} onChange={(e) => setStory((prev) => prev ? { ...prev, storyTitle: e.target.value } : null)} />
              </div>

              <div>
                <label className="text-sm font-semibold">Description</label>
                <Textarea value={story.storyDescription} onChange={(e) => setStory((prev) => prev ? { ...prev, storyDescription: e.target.value } : null)} />
              </div>
              <div>
                <label className="text-sm font-semibold">Release date</label>
                <Input type="Date" value={story.releaseDate} onChange={(e) => setStory((prev) => prev ? { ...prev, releaseDate: e.target.value } : null)} />
              </div>
              <div>
                <label className="text-sm font-semibold">Release status</label>
                <div className="flex items-center gap-4 mt-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="releaseStatus"
                      value="true"
                      checked={story.releaseStatus === true}
                      onChange={(e) => setStory((prev) => prev ? { ...prev, releaseStatus: e.target.value === "true" } : null)}
                      className="form-radio"
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="releaseStatus"
                      value="false"
                      checked={story.releaseStatus === false}
                      onChange={(e) => setStory((prev) => prev ? { ...prev, releaseStatus: e.target.value === "false" } : null)}
                      className="form-radio"
                    />
                    No
                  </label>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold">Sale price</label>
                <Input value={story.salePrice??''} onChange={(e) => setStory((prev) => prev ? { ...prev, salePrice: e.target.value === '' ? null : Number(e.target.value) } : null)} />
              </div>
              <div>
                <label className="text-sm font-semibold">Tags</label>
                <div className="flex gap-2 flex-wrap">
                  {storyTags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-secondary rounded hover:bg-secondary/80"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div ref={loaderRef} className="text-center mt-10">
                {loading && <p className="text-gray-500">Loading more information...</p>}
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
                  {chapters?.map((chapter, idx: number) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-4 border rounded shadow-sm hover:shadow-lg transition-all bg-card"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{chapter.chapterTitle}</span>
                        {!chapter.isPublished && <span className="text-xs text-gray-400">(Draft)</span>}
                      </div>
                      <div className="text-sm text-gray-500 flex gap-4">
                        {<span>👁 21</span>}
                        {chapter.numberOfLikes !== undefined && <span className="lucide lucide-star">⭐ {chapter.numberOfLikes}</span>}
                        {chapter.numberOfComment !== undefined && <span>💬 {chapter.numberOfComment}</span>}
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
