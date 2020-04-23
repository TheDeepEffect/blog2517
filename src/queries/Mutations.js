import gql from "graphql-tag";

export const ADD_POST = gql`
	mutation addPost(
		$title: String!
		$content: String!
		$published: Boolean!
		$urlSlug: String!
		$published_at: timestamptz
	) {
		insert_posts(
			objects: {
				title: $title
				url: $urlSlug
				content: $content
				published: $published
				published_at: $published_at
			}
		) {
			affected_rows
			returning {
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
	}
`;
export const ADD_COMMENT = gql`
	mutation addComment($pid: Int!, $content: String!) {
		insert_comments(objects: { content: $content, post_id: $pid }) {
			affected_rows
		}
	}
`;

export const UPDATE_POST = gql`
	mutation updatePost(
		$id: Int!
		$title: String
		$content: String
		$published: Boolean!
		$published_at: timestamptz
		$urlSlug: String
	) {
		update_posts(
			where: { id: { _eq: $id } }
			_set: {
				title: $title
				url: $urlSlug
				content: $content
				published: $published
				published_at: $published_at
			}
		) {
			affected_rows
		}
	}
`;
export const UPDATE_LASTSEEN_MUTATION = gql`
	mutation updateLastSeen($now: timestamptz!) {
		update_users(where: {}, _set: { last_seen: $now }) {
			affected_rows
		}
	}
`;
