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
