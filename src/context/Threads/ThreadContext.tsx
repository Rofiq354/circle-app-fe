import { io } from "socket.io-client";
import { useEffect, useState, type ReactNode } from "react";
import { createThread, getAllThreads } from "@/services/thread.service";
import type { Thread } from "@/types/threads";
import ThreadDialog from "@/components/Threads/ThreadDialog";
import { ModalThreadContext, ThreadContext } from "./createThreadContext";
import toast from "react-hot-toast";

const socket = io("http://localhost:3003", { transports: ["websocket"] });

export const ThreadProvider = ({ children }: { children: ReactNode }) => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchThreads();

    // LISTEN THREAD BARU
    socket.on("new-thread", (newThread: Thread) => {
      setThreads((prev) => [newThread, ...prev]); // Tambah ke urutan paling atas
    });

    // LISTEN UPDATE LIKE
    // socket.on(
    //   "update-like",
    //   (data: { threadId: number; likesCount: number }) => {
    //     setThreads((prev) =>
    //       prev.map((t) =>
    //         t.id === data.threadId ? { ...t, likes: data.likesCount } : t,
    //       ),
    //     );
    //   },
    // );

    return () => {
      socket.off("new-thread");
      // socket.off("update-like");
    };
  }, []);

  const fetchThreads = async () => {
    setLoading(true);
    try {
      const data = await getAllThreads();
      setTimeout(() => {
        setThreads(data);
      }, 500);
    } catch (error) {
      console.error("Fetch threads gagal", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  const addThread = async (content: string) => {
    try {
      const formData = new FormData();
      formData.append("content", content);

      const response = await createThread(formData);

      const newThread: Thread = {
        id: response.data.tweet.id,
        content,
        images: null,
        created_at: response.data.tweet.timestamp,
        likes: 0,
        replies: 0,
        isLiked: false,
        user: {
          id: Number(response.data.tweet.user_id),
          email: String(response.data.tweet.user?.email),
          username: String(response.data.tweet.user?.username),
          fullname: String(response.data.tweet.user?.fullname),
          profile_picture:
            response.data.tweet.user?.profile_picture ??
            "https://i.pravatar.cc/40",
        },
      };

      setThreads((prev) => [newThread, ...prev]);

      if (response.status === "success") {
        toast.success(response.message);
      } else if (response.status === "error") {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Tambah thread gagal", error);
    }
  };

  // Optimistic update (tanpa API dulu)
  const toggleLike = (threadId: number) => {
    setThreads((prev) =>
      prev.map((thread) =>
        thread.id === threadId
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
    <ThreadContext
      value={{
        threads,
        addThread,
        loading,
        refreshThreads: fetchThreads,
        toggleLike,
      }}
    >
      {children}
    </ThreadContext>
  );
};

export interface ModalThreadProviderType {
  openModal: () => void;
  closeModal: () => void;
}

export const ModalThreadProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Fungsi kendali
  const openModal = () => setIsOpen(true);

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <ModalThreadContext value={{ openModal, closeModal }}>
      {children}
      <ThreadDialog isOpen={isOpen} onClose={closeModal} />
    </ModalThreadContext>
  );
};
