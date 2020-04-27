import gql from "graphql-tag";

export const GET_USER = gql`
	query getUser($uid: String!) {
		users_by_pk(id: $uid) {
			id
			username
			name
		}
	}
`;

export const POSTS = gql`
	query getPosts($offset: Int!) {
		posts(
			where: { published: { _eq: true } }
			order_by: { published_at: desc_nulls_last }
			limit: 7
			offset: $offset
		) {
			id
			published_at
			published
			title
			content
			url
			user {
				username
			}
		}
	}
`;

export const MY_POSTS = gql`
	query myPosts($uid: String!) {
		posts(where: { user_id: { _eq: $uid } }, order_by: { id: desc }) {
			id
			published_at
			published
			title
			content
			url
			user {
				username
			}
		}
	}
`;
