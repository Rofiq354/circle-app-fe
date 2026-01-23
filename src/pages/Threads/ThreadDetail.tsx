import socket from "@/lib/socket";
import React, { useEffect, useState } from "react";
import DetailThread from "@/components/ThreadDetail/DetailThread";
import ReplyMessage from "@/components/ThreadDetail/ReplyMessage";
import ReplyItems from "@/components/ThreadDetail/ReplyItem";
import { useParams } from "react-router-dom";
import {
  createRepliesByThreadId,
  getAllRepliesByThreadId,
} from "@/services/reply.service";
import type { Reply } from "@/types/reply";

const ThreadDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAllRepliesByThreadId(Number(id));
        setTimeout(() => {
          setReplies(result);
        }, 500);
      } catch (error) {
        console.error(error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  useEffect(() => {
    socket.on("new-reply", (newReply: Reply) => {
      setTimeout(() => {
        setReplies((prev) => [newReply, ...prev]);
        console.log(newReply);
      }, 1000);
    });

    return () => {
      socket.off("new-reply");
    };
  }, []);

  const handleSubmit = async (content: string) => {
    if (!content.trim()) return;
    try {
      setLoading(true);
      const result = await createRepliesByThreadId(Number(id), content);

      return result;
    } catch (err) {
      console.error("Gagal posting", err);
      alert("Failed to post reply");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <>
      <div className="detail_thread_parent w-full relative">
        <DetailThread dataId={id} />
        <ReplyMessage onPost={handleSubmit} isPosting={loading} />
        <div className="reply-list">
          {replies.map((reply) => (
            <ReplyItems key={reply.id} {...reply} />
          ))}
        </div>
      </div>
    </>
  );
};

export default ThreadDetailPage;
