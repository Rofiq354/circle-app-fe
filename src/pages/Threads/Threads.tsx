import ThreadComposer from "@/components/Threads/ThreadComposer";
import { ThreadItem, ThreadSkeleton } from "@/components/Threads/ThreadItem";
import { useState } from "react";
import { useThread } from "@/hooks/useThread";
import { ModalThreadProvider } from "@/context/Threads/ThreadContext";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

const Threads: React.FC = () => {
  const { loading, addThread } = useThread();
  const [isPosting, setIsPosting] = useState(false);
  const threads = useSelector((state: RootState) => state.threads.threads);

  const handlePost = (content: string) => {
    setIsPosting(true);
    setTimeout(() => {
      try {
        if (!content.trim()) return;
        addThread?.(content);
      } finally {
        setIsPosting(false);
      }
    }, 500);
  };

  return (
    <div className="w-full bg-[#1d1d1d] relative">
      <ModalThreadProvider>
        <ThreadComposer onPost={handlePost} isPosting={isPosting} />
      </ModalThreadProvider>

      {loading ? (
        <ThreadSkeleton />
      ) : (
        threads.map((thread, index) => <ThreadItem key={index} {...thread} />)
      )}
    </div>
  );
};

export default Threads;
