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
import { useDispatch, useSelector } from "react-redux";
import {
  addReply,
  selectAllReplies,
  setReplies,
} from "@/store/reply/replySlice";

const ThreadDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const allReplies = useSelector(selectAllReplies);
  const [loading, setLoading] = useState(false);

  const currentReplies = allReplies.filter(
    (reply) => reply.threadId === Number(id),
  );

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const result = await getAllRepliesByThreadId(Number(id));
        dispatch(setReplies(result));
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();

    const handleNewReply = (newReply: Reply) => {
      if (newReply.threadId === Number(id)) {
        dispatch(addReply(newReply));
        console.log("hasil dari websocket: ", newReply);
      }
    };

    socket.on("new-reply", handleNewReply);

    return () => {
      socket.off("new-reply", handleNewReply);
    };
  }, [id, dispatch]);

  const handleSubmit = async (content: string, image?: File | null) => {
    if (!content.trim() && !image) return;
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("content", content);
      if (image) {
        formData.append("image", image);
      }

      await createRepliesByThreadId(Number(id), formData);
    } catch (err) {
      console.error("Gagal posting", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="detail_thread_parent w-full relative">
        <DetailThread dataId={id} />
        <ReplyMessage onPost={handleSubmit} isPosting={loading} />
        <div className="reply-list">
          {currentReplies.map((reply) => (
            <ReplyItems key={reply.id} {...reply} />
          ))}
        </div>
      </div>
    </>
  );
};

export default ThreadDetailPage;
