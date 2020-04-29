import React, { useState, useEffect, useContext } from "react";
import { firebaseAuth, database } from "./config/firebase-config";
import Login from "./Login";
import App from "./../App";

export const FirebaseAuthContext = React.createContext();
export const useFirebaseAuth = () => useContext(FirebaseAuthContext);

export const FirebaseAuthProvider = ({ cildren }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [idToken, setIdToken] = useState("");
	const [currentUser, setUser] = useState({});

	useEffect(() => {
		return firebaseAuth().onAuthStateChanged(async user => {
			if (user) {
				const token = await user.getIdToken(true);
				// console.log("user here");
				const idTokenResult = await user.getIdTokenResult();
				const hasuraClaim =
					idTokenResult.claims["https://hasura.io/jwt/claims"];
				setIsLoading(false);
				setIdToken(token);
				setIsAuthenticated(true);
				setUser(user);

				if (hasuraClaim) {
					setIsLoading(false);
					setIdToken(token);
					setIsAuthenticated(true);
				} else {
					// Check if refresh is required.
					const metadataRef = database().ref(
						"metadata/" + user.uid + "/refreshTime"
					);
					// console.log(metadataRef);

					metadataRef.on("value", async data => {
						if (!data.exists) return;
						// Force refresh to pick up the latest custom claims changes.
						const token = await user.getIdToken(true);
						setIsLoading(false);
						setIdToken(token);
						setIsAuthenticated(true);
					});
				}
			} else {
				setIsAuthenticated(false);
				setIsLoading(false);
			}
		});
	}, []);

	const uiConfig = {
		signInFlow: "popup",
		signInOptions: [
			firebaseAuth.GoogleAuthProvider.PROVIDER_ID,
			firebaseAuth.EmailAuthProvider.PROVIDER_ID,
			firebaseAuth.GithubAuthProvider.PROVIDER_ID
		],
		callbacks: {
			// Avoid redirects after sign-in.
			signInSuccessWithAuthResult: () => {
				setIsLoading(false);
				setIsAuthenticated(true);
			}
		}
	};

	const signOutHandle = async () => {
		setIsLoading(true);
		await firebaseAuth().signOut();
		setIsAuthenticated(false);
	};
	if (isLoading) {
		// console.log("inloading");
		return <div className="app">Loading..</div>;
	}
	if (!isAuthenticated) {
		return (
			<FirebaseAuthContext.Provider
				value={{ isLoading, uiConfig, firebaseAuth }}
			>
				<div className="app">
					<Login />
				</div>
			</FirebaseAuthContext.Provider>
		);
	} else {
		return (
			<FirebaseAuthContext.Provider
				value={{ signOutHandle, isLoading, currentUser }}
			>
				<div className="app">
					<App idToken={idToken} />
				</div>
			</FirebaseAuthContext.Provider>
		);
	}
};
