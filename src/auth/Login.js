import React from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { Card } from "antd";

import { Button } from "antd";
import { useFirebaseAuth } from "./auth-spa";

const Login = () => {
	const { isLoading, uiConfig, firebaseAuth } = useFirebaseAuth();
	if (isLoading) {
		return <div className="login">Loading.....</div>;
	}
	return (
		<Card className="login" bordered={false}>
			<Card className="login-inside-div" bordered={false}>
				<h1>BLOG 2517</h1>
				<p>Hey there, Welcome to BLOG2517 please Login to continue😁 </p>
				<StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebaseAuth()} />
			</Card>
		</Card>
	);
};

export default Login;
