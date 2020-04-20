import gql from "graphql-tag";

export const ADD_POST = gql`
	mutation addPost(
		$title: String!
		$content: String!
		$published: Boolean!
		$urlSlug: String!
	) {
		insert_posts(
			objects: {
				title: $title
				url: $urlSlug
				content: $content
				published: $published
			}
		) {
			affected_rows
		}
	}
`;
