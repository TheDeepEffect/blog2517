import React, { useState } from "react";
import Header from "./Header";
import Posts from "./Posts";
import AddUser from "./AddUser";

import { Switch, Route, BrowserRouter } from "react-router-dom";
import { useFirebaseAuth } from "./../auth/auth-spa";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { GET_USER } from "./../queries/queries";

const Blog = props => {
	const [showPopup, setShowPopup] = useState(true);
	const { signOutHandle, currentUser } = useFirebaseAuth();
	const { uid, displayName } = currentUser;
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
				<Header signOut={signOutHandle} username={data.users[0]} />
				<Switch>
					<Route
						exact
						path="/"
						render={() =>
							data.users[0] ? (
								<Posts />
							) : (
								<AddUser uid={uid} name={displayName} />
							)
						}
					/>
					<Route exact path="/addPost"></Route>
				</Switch>
			</div>
		</BrowserRouter>
	);
};

export default Blog;
