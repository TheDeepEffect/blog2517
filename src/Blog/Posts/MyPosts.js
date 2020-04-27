import React from "react";
import { useApolloClient, useQuery } from "@apollo/react-hooks";
import { MY_POSTS } from "../../queries/queries";
import { Layout } from "antd";
import Post from "./Post";
const { Content, Header } = Layout;

const MyPosts = ({ posts }) => {
	return (
		<div>
			<Header
				className="site-layout-background"
				style={{
					backgroundColor: "#313131",
					textAlign: "end",
					fontSize: 30,
					color: "white"
				}}
			>
				My Posts
			</Header>
			{posts.map(post => (
				<Post key={post.id} isMine={true} post={post} />
			))}
		</div>
	);
};

const MyPostsQuery = ({ uid }) => {
	const { data, loading, error } = useQuery(MY_POSTS, {
		variables: { uid }
	});

	if (loading) {
		return (
			<div>
				<Header
					className="site-layout-background"
					style={{
						backgroundColor: "#313131",
						textAlign: "end",
						fontSize: 30,
						color: "white"
					}}
				>
					My Posts
				</Header>
				<Layout className="site-layout">
					<div className="loader">Loading Feed...</div>
				</Layout>
			</div>
		);
	}
	if (error) {
		// console.log(error);
		return (
			<div>
				<Header
					className="site-layout-background"
					style={{
						backgroundColor: "#313131",
						textAlign: "end",
						fontSize: 30,
						color: "white"
					}}
				>
					My Posts
				</Header>
				<Layout className="site-layout">
					<div className="loader">Something went left in loading your feed</div>
				</Layout>
			</div>
		);
	}
	// console.log(data);
	return <MyPosts posts={data.posts} />;
};

export default MyPostsQuery;
