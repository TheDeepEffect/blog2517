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

export const POSTS = gql`
	query getPosts($order: order_by) {
		posts(
			where: { published: { _eq: true } }
			order_by: { published_at: $order }
		) {
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

export const MY_POSTS = gql`
	query myPosts($uid: String!, $order: order_by) {
		posts(
			where: { user_id: { _eq: $uid } }
			order_by: { published_at: $order }
		) {
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
