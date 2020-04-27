import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Blog from "./Blog/Blog";

import { useFirebaseAuth } from "./auth/auth-spa";

import { BrowserRouter } from "react-router-dom";

import ApolloClient from "apollo-client";
import { WebSocketLink } from "apollo-link-ws";
import { HttpLink } from "apollo-link-http";
import { split } from "apollo-link";
import { getMainDefinition } from "apollo-utilities";
import { setContext } from "apollo-link-context";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloProvider } from "@apollo/react-hooks";

const createApolloClient = idToken => {
	const httpLink = new HttpLink({
		uri: "https://blog2517.herokuapp.com/v1/graphql"
	});
	const wsLink = new WebSocketLink({
		uri: "wss://blog2517.herokuapp.com/v1/graphql",
		options: {
			reconnect: true,
			connectionParams: {
				headers: {
					Authorization: `Bearer ${idToken}`
				}
			}
		}
	});
	const authLink = setContext((_, { headers }) => {
		return {
			headers: {
				...headers,
				authorization: idToken ? `Bearer ${idToken}` : ""
			}
		};
	});

	const link = split(
		({ query }) => {
			const { kind, operation } = getMainDefinition(query);
			return kind === "OperationDefinition" && operation === "subscription";
		},
		wsLink,
		httpLink
	);

	return new ApolloClient({
		link: authLink.concat(link),
		cache: new InMemoryCache()
	});
};

function App({ idToken }) {
	const { isLoading } = useFirebaseAuth();
	if (isLoading && !idToken) {
		return <div>Loading...</div>;
	}
	const client = createApolloClient(idToken);
	return (
		<BrowserRouter>
			<ApolloProvider client={client}>
				<Blog />
			</ApolloProvider>
		</BrowserRouter>
	);
}

export default App;
