"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { generateApi, GET_STORY_BY_USERID, GET_USER } from "@/constants/api";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface ApiUser {
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

interface ApiStoryByUserIdData {
  id: string;
  releaseDate: string;
  createdDate: string;
  releaseStatus: boolean;
  storyTitle: string;
  saleOnly: boolean;
  salePrice: null;
  numberOfLikes: number;
  coverImageUri: string;
  storyDescription: string;
  tags: string[];
  userId: string;
}

export default function ManageUserStoryList() {
  const [posts, setPosts] = useState<ApiStoryByUserIdData[]>([]);
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  
  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchPosts(user.id);
    }
  }, [user]);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      if (!token) {
        throw new Error("Token not found");
      }
      const headers = new Headers();
      headers.append("Authorization", `Bearer ${token}`);

      const res = await axios.get(generateApi(GET_USER), {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header
        },
      });
      const data = res.data;
      setUser({ ...data.result });
    } catch (err) {
      console.error("Error fetching user:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async (userId: string) => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      if (!token) {
        throw new Error("Token not found");
      }
      const headers = new Headers();
      headers.append("Authorization", `Bearer ${token}`);

      const res = await axios.get(generateApi(GET_STORY_BY_USERID, userId), {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header
        },
      });
      const data = res.data;
      setPosts(data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };
  const filteredPosts = posts.filter((post) =>
    post.storyTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className="min-h-screen px-6 py-10">
      {/* search bar */}
      <div className="max-w-6xl mx-auto mb-6 mt-10">
        <input
          type="text"
          placeholder="Search stories by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="max-w-6xl mx-auto ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post, index) => (
            <div
              key={index}
              className="cursor-pointer rounded-xl overflow-hidden shadow hover:shadow-lg transition-all bg-card"
              onDoubleClick={() => router.push(`/en/mystory/${post.id}`)}
            >
              <div className="w-full h-48 relative">
                <Image
                  // src={post.coverImageUri}
                  src="/vietnam.png"
                  alt={post.storyTitle}
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                />
              </div>
              <div className="p-4">
                <h3 className="text-base font-semibold mb-1">
                  {post.storyTitle}
                </h3>
                <p className="text-xs text-gray-500 mb-2">{post.releaseDate}</p>
                <p className="text-sm text-gray-700 mb-3">
                  {post.storyDescription}
                </p>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(post.tags) &&
                    post.tags.map((tag: string, tagIndex: number) => (
                      <span
                        key={tagIndex}
                        className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        {filteredPosts.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            No stories found.
          </div>
        )}
        <div ref={loaderRef} className="text-center mt-10">
          {loading && <p className="text-gray-500">Loading more posts...</p>}
        </div>
      </div>
    </div>
  );
}
