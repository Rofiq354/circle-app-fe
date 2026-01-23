import { useEffect, useState, type ReactNode } from "react";
import { createThread, getAllThreads } from "@/services/thread.service";
import type { Thread } from "@/types/threads";
import ThreadDialog from "@/components/Threads/ThreadDialog";
import { ModalThreadContext, ThreadContext } from "./createThreadContext";
import toast from "react-hot-toast";
import socket from "@/lib/socket";
import { addSingleThread } from "@/store/like/threadTuhnk";
import type { AppDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { setThreads as setThreadsRedux } from "@/store/like/threadTuhnk";

export const ThreadProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const threads = useSelector((state: RootState) => state.threads.threads);
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

    return () => {
      socket.off("new-thread");
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
