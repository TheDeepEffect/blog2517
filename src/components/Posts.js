import React, { useState, useEffect } from "react";
import Post from "./Posts/Post";
import { Dropdown } from "react-bootstrap";

import { useSubscription, useApolloClient } from "@apollo/react-hooks";
import { POSTS } from "./../queries/queries";
import { MY_POSTS } from "./../queries/queries";
import { NEW_POST_SUB } from "./../queries/Subscriptions";

const Posts = ({ isMine, latestPosts, uid }) => {
	const client = useApolloClient();
	const [state, setState] = useState({ error: false, posts: [] });
	const [order, setOrder] = useState("desc_nulls_last");

	//TODO:: Add useEffect for filter....
	const QUERY = isMine
		? { query: MY_POSTS, variables: { uid, order } }
		: { query: POSTS, variables: { order } };

	if (order.includes("desc")) {
		state.posts.sort(
			(a, b) => new Date(b.published_at) - new Date(a.published_at)
		);
	} else {
		state.posts.sort(
			(a, b) => new Date(a.published_at) - new Date(b.published_at)
		);
	}
	// useEffect(() => {
	// 	loadOlder();
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, []);
	useEffect(() => {
		// eslint-disable-next-line react-hooks/exhaustive-deps

		if (latestPosts.length) {
			console.log(latestPosts);
			setState({ posts: [...latestPosts] });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [latestPosts]);

	return (
		<div>
			<Dropdown onSelect={e => setOrder(e)}>
				<Dropdown.Toggle>
					Sort : {order.includes("desc") ? "New" : "Old"} first
				</Dropdown.Toggle>
				<Dropdown.Menu>
					<Dropdown.Item eventKey="desc_nulls_last">Newest first</Dropdown.Item>
					<Dropdown.Item eventKey="asc_nulls_last">Oldest first</Dropdown.Item>
				</Dropdown.Menu>
			</Dropdown>
			{state.posts.map(post => (
				<Post key={post.id} post={post} />
			))}
		</div>
	);
};

const PostsQuery = ({ isMine, uid }) => {
	// const QUERY = isMine ? MY_POSTS : POSTS;
	const { data, loading, error } = useSubscription(NEW_POST_SUB);

	if (loading) {
		return <div>Loading...</div>;
	}
	if (error) {
		console.log(error);
		return <div>Error!</div>;
	}
	// console.log(data, "data");
	// console.log(da, err);
	return (
		<div>
			<Posts
				latestPosts={data.posts.length ? data.posts : null}
				isMine={isMine}
				uid={uid}
			/>
		</div>
	);
};

export default PostsQuery;
