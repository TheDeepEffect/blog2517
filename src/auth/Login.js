import React from "react";

import { Button } from "react-bootstrap";
import { useFirebaseAuth } from "./auth-spa";

const Login = () => {
	const { isLoading, googleSignIn } = useFirebaseAuth();
	if (isLoading) {
		return <div>Loading.....</div>;
	}
	return (
		<div>
			<Button onClick={() => googleSignIn()}>SigninWithGoogle</Button>
		</div>
	);
};

export default Login;
