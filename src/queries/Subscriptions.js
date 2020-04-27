import gql from "graphql-tag";

export const NEW_POST_SUB = gql`
	subscription newPosts {
		posts(
			where: { published: { _eq: true } }
			limit: 1
			order_by: { published_at: desc_nulls_last }
		) {
			id
			published_at
			title
			content
			url
			user {
				username
			}
		}
	}
`;
export const COMMENT_SUB = gql`
	subscription commentSub($pid: Int!) {
		comments(
			where: { post_id: { _eq: $pid } }
			order_by: { created_at: desc_nulls_last }
		) {
			content
			id
			user {
				username
				last_seen
			}
		}
	}
`;
