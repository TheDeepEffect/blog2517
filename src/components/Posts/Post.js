import React from "react";
import { Card, ListGroup, Form } from "react-bootstrap";

const Post = ({ post }) => {
	const {
		id,
		title,
		content,
		user: { username },
		published_at,
		url,
		comments
	} = post || "";

	const onCommentSubmit = e => {
		e.preventDefault();
	};
	return (
		<div>
			<Card
				style={{ width: "80%", margin: "5vh auto" }}
				bg="secondary text-white"
			>
				<Card.Header as="h5">{title}</Card.Header>
				<Card.Body>
					<Card.Text>{content}</Card.Text>
				</Card.Body>
				<ListGroup>
					<ListGroup.Item>
						<Form.Control
							type="text"
							placeholder="enter comment"
							onSubmit={onCommentSubmit}
						/>
					</ListGroup.Item>
					{comments.map(({ id, content }) => (
						<ListGroup.Item variant="dark">{content}</ListGroup.Item>
					))}
				</ListGroup>
				<Card.Footer className="mb-2">{`published at: ${published_at} by ${username}`}</Card.Footer>
			</Card>
		</div>
	);
};

export default Post;
