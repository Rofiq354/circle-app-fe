import React, { useEffect, useState } from 'react';
import DetailThread from '@/components/ThreadDetail/DetailThread';
import ReplyMessage from '@/components/ThreadDetail/ReplyMessage';
import ReplyItems from '@/components/ThreadDetail/ReplyItem';
import { useParams } from 'react-router-dom';
import { getAllRepliesByThreadId } from '@/services/reply.service';
import type { Reply } from '@/types/reply';

const ThreadDetailPage: React.FC = () => {
	const [replies, setReplies] = useState<Reply[]>([]);
	const { id } = useParams<{id: string}>();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const result = await getAllRepliesByThreadId(Number(id));
				setReplies(result);
				console.log(result);
			} catch (error) {
				console.error(error);
			}
		}

		fetchData();
	}, [id])

  return (
		<>
			<div className="detail_thread_parent relative">
				<DetailThread dataId={id} />
				<ReplyMessage />
				{replies.map(reply => (
					<ReplyItems key={reply.id} {...reply}/>
				))}
			</div>
		</>
  );
};

export default ThreadDetailPage;