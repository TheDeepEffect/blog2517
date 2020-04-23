import React, { useEffect, useState } from "react";
import { COMMENT_SUB } from "./../../queries/Subscriptions";
import { useSubscription } from "@apollo/react-hooks";
import Comment from "./Comment";
const Comments = ({ latestComments }) => {
	const [comments, setComments] = useState([]);

	useEffect(() => {
		if (latestComments) {
			setComments([...latestComments]);
		}
	}, [latestComments]);
	return (
		<div>
			{comments.map(comment => (
				<Comment
					key={comment.id}
					content={comment.content}
					by={comment.user.username}
					last_seen={comment.user.last_seen}
				/>
			))}
		</div>
	);
};

const CommentsQuery = ({ pid }) => {
	const { data, error, loading } = useSubscription(COMMENT_SUB, {
		variables: { pid }
	});

	if (loading) {
		return <div>Hype... hype....</div>;
	}
	if (error) {
		console.log(error);
		return <div>Error in comments!</div>;
	}
	return (
		<Comments latestComments={data.comments.length ? data.comments : null} />
	);
};
export default CommentsQuery;
