import ThreadComposer from "@/components/Threads/ThreadComposer";
import { ThreadItem, ThreadSkeleton } from "@/components/Threads/ThreadItem";
import { useState } from "react";
import { useModalThread, useThread } from "@/hooks/useThread";

const Threads: React.FC = () => {
  const { openModal } = useModalThread();
  const { threads, toggleLike, loading, addThread } = useThread();
  const [isPosting, setIsPosting] = useState(false);

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
    <div className="w-full bg-[#1d1d1d]">
      <ThreadComposer
        // value={content}
        // onChange={setContent}
        inputClick={openModal}
        onPost={handlePost}
        isPosting={isPosting}
      />

      {loading ? (
        <ThreadSkeleton />
      ) : (
        threads.map((thread, index) => (
          <ThreadItem
            key={index}
            {...thread}
            onLike={() => toggleLike(thread.id as number)}
          />
        ))
      )}
    </div>
  );
};

export default Threads;
