import React, { useState, useEffect } from "react";
import Comment from "./Comment";
import { Card } from "antd";
import { useSubscription, useMutation } from "@apollo/react-hooks";
import { COMMENT_SUB } from "./../../queries/Subscriptions";
import { ADD_COMMENT } from "./../../queries/Mutations";

const Comments = ({ latestComments }) => {
	const [comments, setComments] = useState([]);

	// const [addComment, { loading }] = useMutation(ADD_COMMENT, {
	// 	onError: error => console.log(error),
	// 	onCompleted: () => setComment("")
	// });
	// console.log(pid);
	// const submitCommentHandler = e => {
	// 	// console.log(pid);
	// 	e.preventDefault();
	// 	addComment({ variables: { pid, content: comment } });
	// };
	useEffect(() => {
		if (latestComments) {
			setComments([...latestComments]);
		}
	}, [latestComments]);
	return (
		<div style={{ marginTop: 5, border: " 0.25vh solid white" }}>
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

const CommetnsSubscription = ({ pid }) => {
	const { data, error, loading } = useSubscription(COMMENT_SUB, {
		variables: { pid }
	});
	if (loading) {
		return <div style={{ color: "white" }}>Hype... hype....</div>;
	}
	if (error) {
		console.log(error);
		return <div style={{ color: "white" }}>Error in comments!</div>;
	}
	return (
		<Comments latestComments={data.comments.length ? data.comments : null} />
	);
};
export default CommetnsSubscription;
