import React from "react";
import Post from "./Posts/Post";

import { useQuery } from "@apollo/react-hooks";
import { POSTS } from "./../queries/queries";

const Posts = props => {
	const { data, loading, error } = useQuery(POSTS);

	if (loading) {
		return <div>Imagine Loading Spinner please.....</div>;
	}
	if (error) {
		return <div>Something's not wrong.... i can feel it.....</div>;
	}
	const postList = data.posts.map(post => <Post post={post} />);
	return <div>{postList}</div>;
};
export default Posts;
