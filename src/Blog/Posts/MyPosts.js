import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { MY_POSTS } from "../../queries/queries";
import { Layout } from "antd";
import Post from "./Post";
const { Content, Header } = Layout;

const MyPosts = ({ posts }) => {
	return (
		<Content>
			{posts.length ? (
				posts.map(post => <Post key={post.id} isMine={true} post={post} />)
			) : (
				<div className="loader">Add new post :-)</div>
			)}
		</Content>
	);
};

const MyPostsQuery = ({ uid }) => {
	const { data, loading, error } = useQuery(MY_POSTS, {
		variables: { uid }
	});

	if (loading) {
		return (
			<Layout className="site-layout">
				<Header className="site-layout-background header-class">
					My Posts
				</Header>
				<Content>
					<div className="loader">Loading your posts...</div>
				</Content>
			</Layout>
		);
	}
	if (error) {
		console.log(error);
		return (
			<Layout className="site-layout">
				<Header className="site-layout-background header-class">
					My Posts
				</Header>
				<Content>
					<div className="loader">
						Something went left in loading your posts
					</div>
				</Content>
			</Layout>
		);
	}
	// console.log(data);
	return (
		<Layout className="site-layout">
			<Header className="site-layout-background header-class">My Posts</Header>
			<MyPosts posts={data.posts} />
		</Layout>
	);
};

export default MyPostsQuery;
