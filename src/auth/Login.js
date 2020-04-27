import React from "react";

import { Button } from "antd";
import { useFirebaseAuth } from "./auth-spa";

const Login = () => {
	const { isLoading, googleSignIn } = useFirebaseAuth();
	if (isLoading) {
		return <div>Loading.....</div>;
	}
	return (
		<div className="login">
			<Button className="logInButton" onClick={() => googleSignIn()}>
				SigninWithGoogle
			</Button>
		</div>
	);
};

export default Login;
