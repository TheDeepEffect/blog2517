import React, { useState, useEffect, Fragment } from "react";
import Post from "./Posts/Post";
import { Dropdown } from "react-bootstrap";

import { useSubscription, useQuery } from "@apollo/react-hooks";
// import { POSTS } from "./../queries/queries";
import { MY_POSTS } from "./../queries/queries";
import { NEW_POST_SUB } from "./../queries/Subscriptions";

const Posts = ({ isMine, latestPosts, uid }) => {
	const [state, setState] = useState({ posts: [] });
	const [order, setOrder] = useState("desc_nulls_last");
	//TODO:: Add two buttons to load newer and older Todos from client.query

	useEffect(() => {
		// eslint-disable-next-line react-hooks/exhaustive-deps

		if (latestPosts.length - state.posts.length !== 0) {
			// console.log(latestPosts.length - state.posts.length, "new posts");
			setState({ posts: [...latestPosts] });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [latestPosts.length]);

	if (order.includes("desc")) {
		state.posts.sort(
			(a, b) => new Date(b.published_at) - new Date(a.published_at)
		);
	} else {
		state.posts.sort(
			(a, b) => new Date(a.published_at) - new Date(b.published_at)
		);
	}

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
				<Post key={post.id} isMine={isMine} post={post} />
			))}
		</div>
	);
};

const PostsQuery = ({ isMine, uid }) => {
	const { data, loading, error } = useSubscription(NEW_POST_SUB);

	const { data: myData, loading: myLoading, error: myError } = useQuery(
		MY_POSTS,
		{
			variables: { uid }
		}
	);

	if (isMine) {
		if (myLoading) {
			return <div>Loading...</div>;
		}
		if (myError) {
			console.log(error);
			return <div>Error!</div>;
		}

		return (
			<div>
				<Posts
					latestPosts={myData.posts.length ? myData.posts : null}
					isMine={isMine}
					uid={uid}
				/>
			</div>
		);
	} else {
		if (loading) {
			return <div>Loading...</div>;
		}
		return (
			<div>
				<Posts
					latestPosts={data.posts.length ? data.posts : []}
					isMine={isMine}
					uid={uid}
				/>
			</div>
		);
	}
};

export default PostsQuery;
