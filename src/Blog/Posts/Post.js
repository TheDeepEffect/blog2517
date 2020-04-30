import React, { useState } from "react";
import { Typography, Button, Popover } from "antd";
import { Card, Divider } from "antd";
import { useHistory } from "react-router-dom";
import Comments from "../Comments/Comments";
import { useMutation } from "@apollo/react-hooks";
import { ADD_COMMENT } from "./../../queries/Mutations";

const { Paragraph, Title } = Typography;

const Post = ({ post, isMine }) => {
	const history = useHistory();
	const [comment, setComment] = useState("");
	const [addComment, { loading }] = useMutation(ADD_COMMENT, {
		onError: error => console.log(error),
		onCompleted: () => setComment("")
	});

	const {
		id,
		title,
		content,
		user: { username },
		published_at,
		url,
		published
	} = post || "";

	// console.log(id, published);
	const submitCommentHandler = e => {
		// console.log(pid);
		e.preventDefault();
		addComment({ variables: { pid: id, content: comment } });
	};
	return (
		<div>
			<Card className="site-layout-background-posts" bordered={false}>
				<Title style={{ color: "white" }}>{title}</Title>
				<Divider className="post-divider" orientation="right">
					{published
						? `at ${new Date(published_at).toLocaleString()} by ${
								isMine ? "you" : username
						  }`
						: "Not published yet"}{" "}
				</Divider>
				<Paragraph
					ellipsis={{ rows: 10, expandable: true }}
					style={{ color: "white", fontSize: "large" }}
				>
					{content}
				</Paragraph>
				{isMine && (
					<Button
						type="primary"
						onClick={() => history.push({ pathname: "/editPost", state: post })}
					>
						Update Post
					</Button>
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
