import { useEffect, useState, type ReactNode } from "react";
import { createThread, getAllThreads } from "@/services/thread.service";
import type { Thread } from "@/types/threads";
import { ThreadContext } from "./createThreadContext";
import toast from "react-hot-toast";
import socket from "@/lib/socket";
import {
  addSingleThread,
  incrementReplyCount,
  selectAllThreads,
  updateLikesFromSocket,
} from "@/store/like/threadSlice";
import type { AppDispatch } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { setThreads as setThreadsRedux } from "@/store/like/threadSlice";
import type { Reply } from "@/types/reply";

export const ThreadProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const threads = useSelector(selectAllThreads);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllThreads();
        dispatch(setThreadsRedux(data));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    socket.on("new-thread", (newThread: Thread) => {
      dispatch(addSingleThread(newThread));
    });

    socket.on("new-reply", (newReply: Reply) => {
      dispatch(incrementReplyCount(Number(newReply.threadId)));

      // dispatch(addReply(newReply));
    });

    socket.on(
      "update-like",
      (data: { threadId: number; likesCount: number }) => {
        dispatch(updateLikesFromSocket(data));
      },
    );

    return () => {
      socket.off("new-thread");
      socket.off("update-like");
      socket.off("new-reply");
    };
  }, [dispatch]);

  const addThread = async (content: string) => {
    try {
      const formData = new FormData();
      formData.append("content", content);

      const response = await createThread(formData);

      if (response.status === "success") {
        toast.success(response.message);
      } else if (response.status === "error") {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Tambah thread gagal", error);
    }
  };

  return (
    <ThreadContext.Provider
      value={{
        threads,
        addThread,
        loading,
      }}
    >
      {children}
    </ThreadContext.Provider>
  );
};
