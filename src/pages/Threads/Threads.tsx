import ThreadComposer from "@/components/Threads/ThreadComposer";
import ThreadItem from "@/components/Threads/ThreadItem";
import type { ThreadItemProps } from "@/types/threads";
import { useState } from "react";

const dummyThreads: ThreadItemProps[] = [
  {
    id: 1,
    content: "Ini adalah contoh tweet pertama.",
    user: {
      id: 101,
      username: "user1",
      name: "Nama Pengguna 1",
      profile_picture: "https://i.pravatar.cc/41",
    },
    created_at: "2023-07-31T12:34:56Z",
    likes: 10,
    replies: 5,
    isLiked: true,
  },
  {
    id: 2,
    content: "Ini adalah contoh tweet kedua.",
    images: "https://picsum.photos/500/300",
    user: {
      id: 102,
      username: "user2",
      name: "Nama Pengguna 2",
      profile_picture: "https://i.pravatar.cc/42",
    },
    created_at: "2026-01-19T13:45:21Z",
    likes: 15,
    replies: 3,
    isLiked: false,
  },
];

const Threads: React.FC = () => {
  const [threads, setThreads] = useState<ThreadItemProps[] | []>(dummyThreads);
  const [content, setContent] = useState("");

  const handlePost = () => {
    if (!content.trim()) return;

    const newThread: ThreadItemProps = {
      id: 10,
      user: {
        username: "indahprakarya",
        name: "Indah pra Karya",
        profile_picture: "https://i.pravatar.cc/40",
      },
      likes: 0,
      content,
      created_at: new Date().toISOString(),
      onLike: () => {},
    };

    console.log(newThread);

    setThreads([newThread, ...threads]);
    setContent("");
  };

  const handleLike = (id: number) => {
    setThreads((prev) =>
      prev.map((thread) =>
        thread.id === id
          ? {
              ...thread,
              isLiked: !thread.isLiked,
              likes: thread.isLiked ? thread.likes - 1 : thread.likes + 1,
            }
          : thread,
      ),
    );
  };

  return (
    <div className="w-full bg-[#1d1d1d]">
      <ThreadComposer
        value={content}
        onChange={setContent}
        onPost={handlePost}
      />

      {threads.map((thread, index) => (
        <ThreadItem key={index} {...thread} onLike={handleLike} />
      ))}
    </div>
  );
};

export default Threads;
