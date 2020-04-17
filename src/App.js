import React from "react";
import "./App.css";

import { useFirebaseAuth } from "./auth/auth-spa";

import ApolloClient from "apollo-client";
import { WebSocketLink } from "apollo-link-ws";
import { HttpLink } from "apollo-link-http";
import { split } from "apollo-link";
import { getMainDefinition } from "apollo-utilities";
import { setContext } from "apollo-link-context";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloProvider, useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

import Blog from "./components/Blog";

const createApolloClient = idToken => {
	const httpLink = new HttpLink({
		uri: "https://blog2517.herokuapp.com/v1/graphql"
	});
	const wsLink = new WebSocketLink({
		uri: "ws://blog2517.herokuapp.com/v1/graphql",
		options: {
			reconnect: true
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
	// console.log(currentUser);
	if (isLoading && !idToken) {
		return <div>Loading...</div>;
	}

	const client = createApolloClient(idToken);
	// console.log(JSON.stringify(currentUser, 3));
	// console.log(uid);

	return (
		<ApolloProvider client={client}>
			<Blog />
		</ApolloProvider>
	);
}

export default App;
