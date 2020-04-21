import React, { useState, useEffect } from "react";
import Header from "./Header";
import Posts from "./Posts";
import AddUser from "./AddUser";

import { Switch, Route, BrowserRouter } from "react-router-dom";
import { useFirebaseAuth } from "./../auth/auth-spa";
import { useQuery } from "@apollo/react-hooks";
import { GET_USER } from "./../queries/queries";
import AddPost from "./AddPost";

const Blog = props => {
	const { currentUser } = useFirebaseAuth();
	const { uid } = currentUser;
	// console.log(uid);
	// const { loading, error, data } = useQuery(USER, { variables: { uid } });
	const { loading, error, data } = useQuery(GET_USER, {
		variables: { uid: uid }
	});

	if (loading) {
		// console.log(error, data);
		return <div>Loading...</div>;
	}
	if (error) {
		console.error(error);
		return <div>error!</div>;
	}
	return (
		<BrowserRouter>
			<div className="app">
				<Header user={data.users[0]} />
				<Switch>
					<Route exact path="/">
						{data.users[0] ? <Posts isMine={false} uid={uid} /> : <AddUser />}
					</Route>
					<Route path="/addPost">
						<AddPost user={data.users[0]} />
					</Route>
					<Route path="/myPost">
						<Posts isMine={true} uid={uid} />
					</Route>
				</Switch>
			</div>
		</BrowserRouter>
	);
};

export default Blog;
