import gql from "graphql-tag";

export const NEW_POST_SUB = gql`
	subscription {
		posts(where: { published: { _eq: true } }) {
			id
			published_at
			title
			content
			url
			user {
				username
			}
			comments {
				id
				content
			}
		}
	}
`;
