import React, { useState, useEffect } from "react";
import Comment from "./Comment";
import { Layout } from "antd";
import { useSubscription, useMutation } from "@apollo/react-hooks";
import { COMMENT_SUB } from "./../../queries/Subscriptions";
import { ADD_COMMENT } from "./../../queries/Mutations";

const { Content } = Layout;

const Comments = ({ latestComments, pid }) => {
	const [comments, setComments] = useState([]);
	const [comment, setComment] = useState("");

	const [addComment, { loading }] = useMutation(ADD_COMMENT, {
		onError: error => console.log(error),
		onCompleted: () => setComment("")
	});
	// console.log(pid);
	const submitCommentHandler = e => {
		// console.log(pid);
		e.preventDefault();
		addComment({ variables: { pid, content: comment } });
	};
	useEffect(() => {
		if (latestComments) {
			setComments([...latestComments]);
		}
	}, [latestComments]);
	return (
		<Content style={{ padding: 10 }}>
			<div
				className="site-layout-background"
				style={{
					padding: 0,
					minWidth: "50vw",
					backgroundColor: "#525252",
					color: "white",
					fontSize: 20
				}}
			>
				<form onSubmit={submitCommentHandler}>
					<input
						type="text"
						className="comment-input"
						placeholder="Enter comment..."
						style={{
							background: "rgba(0, 0, 0, 0)",
							border: "none",
							outline: "none",
							width: "100%"
						}}
						value={comment}
						onChange={e => setComment(e.target.value)}
						disabled={loading}
					/>
				</form>
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
			</div>
		</Content>
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
		<Comments
			pid={pid}
			latestComments={data.comments.length ? data.comments : null}
		/>
	);
};
export default CommetnsSubscription;
