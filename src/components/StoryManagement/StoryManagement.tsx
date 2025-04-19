"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";

const initialPosts = [
  {
    title: "My sixth post",
    date: "Sep 9, 2020",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "/story-image.jpg",
    tags: ["#Blog", "#Eleventy"],
  },
  {
    title: "My fifth post",
    date: "Aug 8, 2020",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "/story-image.jpg",
    tags: ["#Eleventy"],
  },
  {
    title: "My forth post",
    date: "Jul 7, 2020",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "/story-image.jpg",
    tags: ["#Blog", "#Eleventy"],
  },
  {
    title: "My third post",
    date: "Jun 6, 2020",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "/story-image.jpg",
    tags: ["#Eleventy"],
  },
  {
    title: "Next.js blog Boilerplate Presentation",
    date: "Jun 1, 2020",
    desc: "Everything you need to use this Nextjs Boilerplate template",
    image: "/story-image.jpg",
    tags: ["#Eleventy"],
  },
  {
    title: "My second post",
    date: "Mar 3, 2020",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "/story-image.jpg",
    tags: ["#Eleventy"],
  },
];

export default function ManageUserStoryList() {
  const [posts, setPosts] = useState(initialPosts);
  const [page, setPage] = useState(1);
  const loaderRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMorePosts();
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [loaderRef, page]);

  const loadMorePosts = () => {
    const morePosts = initialPosts.map((post) => ({
      ...post,
      title: `${post.title} (copy ${page})`,
    }));

    setPosts((prev) => [...prev, ...morePosts]);
    setPage((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="max-w-6xl mx-auto mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <div
              key={index}
              className="cursor-pointer rounded-xl overflow-hidden shadow hover:shadow-lg transition-all bg-card"
            >
              <div className="w-full h-48 relative">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="p-4">
                <h3 className="text-base font-semibold mb-1">{post.title}</h3>
                <p className="text-xs text-gray-500 mb-2">{post.date}</p>
                <p className="text-sm text-gray-700 mb-3">{post.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, tagIndex) => (
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

        <div ref={loaderRef} className="text-center mt-10">
          <p className="text-gray-500">Loading more posts...</p>
        </div>
      </div>
    </div>
  );
}
