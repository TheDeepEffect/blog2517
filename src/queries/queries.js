import gql from "graphql-tag";

export const GET_USER = gql`
	query getUser($uid: String!) {
		users(where: { id: { _eq: $uid } }) {
			id
			username
			name
		}
	}
`;
