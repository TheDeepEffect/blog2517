import React, { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { Layout } from "antd";

import { GET_USER } from "./../queries/queries";
import { useFirebaseAuth } from "./../auth/auth-spa";

import Sidebar from "./Sidebar/Sidebar";
import Posts from "./Posts/Posts";
import Adduser from "./Adduser";
import AddPost from "./Posts/AddPost";
import MyPosts from "./Posts/MyPosts";
import PageNotFound from "./PageNotFound";

const Blog = () => {
	const { currentUser } = useFirebaseAuth();
	const { uid, displayName } = currentUser;
	const { loading, error, data } = useQuery(GET_USER, {
		variables: { uid: uid }
	});

	if (loading) {
		return (
			<Layout style={{ minHeight: "100vh" }}>
				<Sidebar />
				<Layout className="site-layout">
					<div className="loader">Loading...</div>
				</Layout>
			</Layout>
		);
	}
	if (error) {
		console.log(error);
		return (
			<Layout style={{ minHeight: "100vh" }}>
				<Sidebar />
				<Layout className="site-layout">
					<div className="loader">Oops refresh the page...</div>
				</Layout>
			</Layout>
		);
	}

	return (
		<Layout style={{ minHeight: "100vh" }}>
			<Sidebar user={data.users_by_pk} />
			<Switch>
				<Route
					exact
					path="/"
					render={() => {
						return data.users_by_pk ? (
							<Posts />
						) : (
							<Adduser uid={uid} name={displayName} />
						);
					}}
				/>
				<Route
					exact
					path="/addPost"
					render={() => <AddPost user={data.users_by_pk} />}
				/>
				<Route
					exact
					path="/editPost"
					render={() => <AddPost isEdit={true} user={data.users_by_pk} />}
				/>
				<Route
					exact
					path="/myPosts"
					render={() => <MyPosts uid={data.users_by_pk.id} />}
				/>
				<Route render={() => <PageNotFound />} />
			</Switch>

			{/* <Footer style={{ textAlign: "center" }}>
					Ant Design ©2018 Created by Ant UED
				</Footer> */}
		</Layout>
	);
};
export default Blog;
