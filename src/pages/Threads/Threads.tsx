import ThreadComposer from "@/components/Threads/ThreadComposer";
import { ThreadItem, ThreadSkeleton } from "@/components/Threads/ThreadItem";
import { useState } from "react";
import { useThread } from "@/hooks/useThread";
import { useSelector } from "react-redux";
import { selectAllThreads } from "@/store/like/threadSlice";

const Threads: React.FC = () => {
  const { loading, addThread } = useThread();
  const [isPosting, setIsPosting] = useState(false);
  const threads = useSelector(selectAllThreads);

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
      <ThreadComposer onPost={handlePost} isPosting={isPosting} />

      {loading ? (
        <ThreadSkeleton />
      ) : (
        threads.map((thread, index) => <ThreadItem key={index} {...thread} />)
      )}
    </div>
  );
};

export default Threads;
