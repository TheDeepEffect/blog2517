import React, { useState } from "react";
import { Typography, Button, Popconfirm, message } from "antd";
import { Card } from "antd";
import { useHistory } from "react-router-dom";
import Comments from "../Comments/Comments";
import { useMutation } from "@apollo/react-hooks";
import {
	ADD_COMMENT,
	DELETE_COMMENTS,
	DELETE_POST
} from "./../../queries/Mutations";
import { MY_POSTS } from "../../queries/queries";

const { Paragraph, Title } = Typography;

const Post = ({ post, isMine }) => {
	const history = useHistory();
	const [comment, setComment] = useState("");

	const {
		id,
		title,
		content,
		user: { username, id: uid },
		published_at,
		published
	} = post || "";

	const [addComment, { loading }] = useMutation(ADD_COMMENT, {
		onError: error => console.log(error),
		onCompleted: () => setComment("")
	});
	const [deletePost, { loading: pLoading }] = useMutation(DELETE_POST, {
		onError: error => console.log(error),
		refetchQueries: [{ query: MY_POSTS, variables: { uid } }],
		onCompleted: () => message.info("Deleted")
	});

	const [deleteComments, { loading: cLoading }] = useMutation(DELETE_COMMENTS, {
		onError: error => console.log(error),
		onCompleted: () => deletePost({ variables: { id } })
	});

	// console.log(id, published);
	const submitCommentHandler = e => {
		// console.log(pid);
		e.preventDefault();
		addComment({ variables: { pid: id, content: comment } });
	};

	const deleteButtonProp = {
		title: "Are you sure you want to delete this post?",
		onConfirm: () => {
			deleteComments({ variables: { pid: id } });
		},
		okText: "Yes",
		cancelText: "No"
	};
	return (
		<div>
			<Card className="site-layout-background-posts" bordered={false}>
				<Title style={{ color: "white" }}>{title}</Title>
				<div className="post-divider">
					<span>
						{published
							? `at ${new Date(published_at).toLocaleString()} by ${
									isMine ? "you" : username
							  }`
							: "Not published yet"}{" "}
					</span>
				</div>
				<Paragraph
					ellipsis={{ rows: 10, expandable: true }}
					style={{ color: "white", fontSize: "large" }}
				>
					{content}
				</Paragraph>
				{isMine && (
					<div>
						<Button
							type="primary"
							onClick={() =>
								history.push({ pathname: "/editPost", state: post })
							}
						>
							Update
						</Button>
						<Popconfirm placement="top" {...deleteButtonProp}>
							<Button type="primary">Delete</Button>
						</Popconfirm>
					</div>
				)}
			</Card>
			<Card bordered={false} className="site-layout-background-comments">
				{!isMine && (
					<form onSubmit={submitCommentHandler}>
						<input
							type="text"
							className="comment-input"
							placeholder="Enter comment..."
							value={comment}
							onChange={e => setComment(e.target.value)}
							disabled={loading}
							required
						/>
					</form>
				)}
				<Comments pid={id} />
			</Card>
		</div>
	);
};
export default Post;
