import React from "react";
import { Typography, Button } from "antd";
import { Layout, Divider } from "antd";
import { useHistory } from "react-router-dom";
import Comments from "../Comments/Comments";
const { Paragraph, Title } = Typography;
const { Content } = Layout;

const Post = ({ post, isMine }) => {
	const history = useHistory();
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
	return (
		<Content style={{ padding: 50 }}>
			<div
				className="site-layout-background-posts"
				style={{
					padding: 50,
					minHeight: "50vh",
					minWidth: "50vw",
					backgroundColor: "#ec625f",
					color: "white"
				}}
			>
				<Title style={{ color: "#313131" }}>{title}</Title>
				<Divider className="post-divider" orientation="right">
					at{" "}
					{published
						? new Date(published_at).toLocaleString()
						: "Not published yet"}{" "}
					by {isMine ? "you" : username}
				</Divider>
				<Paragraph
					ellipsis={{ rows: 10, expandable: true }}
					style={{ color: "white", fontSize: 20 }}
				>
					{content}
				</Paragraph>
				{isMine && (
					<Button
						onClick={() => history.push({ pathname: "/editPost", state: post })}
					>
						Update Post
					</Button>
				)}
			</div>
			<Comments pid={id} />
		</Content>
	);
};
export default Post;
